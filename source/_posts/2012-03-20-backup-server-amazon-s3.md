---
title: Backup di server su Amazon S3
categories: [linux]
tags: [Amazon AWS, backup, duplicity, S3, server]
---
Il sistema che andremo ad utilizare per effettuare il backup della nostra infrastruttura (che sia il nostro PC locale, un server o più di una macchina) si basa sull'utilizzo del tool [duplicity](http://duplicity.nongnu.org/). Questo strumento si integra con sistemi di storage quali FTP, SSH, ma -motivo per cui l'ho scelto, [Amazon S3](http://aws.amazon.com/s3), in modo da poter avere un elevato quantitativo di spazio a basso costo su cui fare il backup. Duplicity effettua operazioni di backup incrementale, compressi e con criptazione dei dati, in questo modo siamo sicuro che le informazioni contenute all'interno dello storage remoto siano protette da accessi "indiscreti".
<!--break-->
La prima operazione da fare è installare duplicity, operazione molto semplice utilizzanto i comandi di sistema:

~~~language-bash
sudo apt-get install duplicity
~~~

a cui poi dobbiamo aggiungere i tool per la sincronia con S3:

~~~language-bash
sudo apt-get install python-boto
~~~

Una volta fatta questa operazione andiamo a configurare il nostro account S3 per ricevere i dati di backup, innanzitutto (se non l'avessimo già fatto in precedenza) registriamoci al servizio. Attiviamo la nostra utenza per S3 e quindi procediamo andando a individuare quali sono le nostre credenziali di accesso.

### Prepariamo AWS S3

Fortunatamente le oprazioni che dobbiamo compiere su S3 non sono molte, dobbiamo innanzitutto registrarci e creare un account su Amazon AWS, attivando S3 e andando a copiare le credenziali di accesso che ci serviranno successivamente per configurare *duplicity*. Una volta registrati e loggati possiamo andare a leggere le chiavi di accesso all'account S3 dalla pagina di [gestione delle credenziali di accesso](https://aws-portal.amazon.com/gp/aws/securityCredentials). Qui sotto la voce **Access Key** potete trovare **Access Key ID** e **Secret Access Key**.

### Generiamo la chiave GPG

Procediamo quindi con il creare la nostra chiave GPG (nel caso in cui non l'avessimo già) attraverso i seguenti comandi:

~~~language-bash
gpg --gen-key
~~~

e seguiamo le istruzioni che ci vengono mostrate per ottenere le chiavi GPG.

~~~language-bash
marco@supernova:~$ gpg --gen-key
gpg (GnuPG) 1.4.11; Copyright (C) 2010 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Selezionare il tipo di chiave desiderato:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (solo firma)
   (4) RSA (solo firma)
Selezione?
~~~

Scegliere 1

~~~language-bash
La lunghezza delle chiavi RSA è compresa tra 1024 e 4096 bit.
Dimensione chiave desiderata? (2048)
~~~

Dare invio

~~~language-bash
La dimensione chiave richiesta è 2048 bit
Specificare la durata di validità della chiave.
         0 = la chiave non scade
      <N>  = la chiave scade dopo N giorni
      <N>w = la chiave scade dopo N settimane
      <N>m = la chiave scade dopo N mesi
      <N>y = la chiave scade dopo N anni
La chiave è valida per... ? (0)
~~~

Dare 0 per evitare scadenza della chiave
~~~language-bash
La chiave non scade
Ciò risulta corretto? (s/N)
~~~
e confermare inserendo **S**
~~~language-bash
È necessario un ID utente per identificare la propria chiave; il software costruisce
l'ID utente a partire da nome reale, commento e indirizzo email in questa forma:
    "Mario Rossi (il commento fornito) mario.rossi@indirizzo.it"
~~~
Inserire i propri dati personali e quindi confermare. Inserire la password della chiave e confermarla

~~~language-bash
Inserisci la passphrase:
~~~
Attendiamo che il sistema riesca a raccogliere abbastanza "dati casuali" per la generazione della nostra chiave

~~~language-bash
Dobbiamo generare un mucchio di byte casuali. È una buona idea eseguire
qualche altra azione (scrivere sulla tastiera, muovere il mouse, usare i
dischi) durante la generazione dei numeri primi; questo da al generatore di
numeri casuali migliori possibilità di raccogliere abbastanza entropia.

Non ci sono abbastanza byte casuali disponibili. Svolgere qualche altro
lavoro per dare al SO la possibilità di raccogliere altra entropia
(sono necessari altri 284 byte)
~~~
al termine dovremmo avere informazioni in merito alla nostra chiave:

~~~language-bash
gpg: key 9F2FBE13 marked as ultimately trusted
chiavi pubbliche e segrete create e firmate.

gpg: controllo il trustdb
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
pub   2048R/1F1FFF11 2012-03-20
      Key fingerprint = 111F 1F11 F111 1FF1 111F  1F1F F1F1 FF11 1F1F FF11
uid                  Marco Vito Moscaritolo (Supernova) <mavimo@gmail.com>
sub   2048R/11111FF1 2012-03-20
~~~
Dove possiamo individuare la nostra chiave. Al termine della procedura ricordiamoci che è FONDAMENTALE andare a salvare le informazioni relative alle chiavi generate (che potete trovare nella cartella `~/.gnupg`) in quanto necessarie per poter ripristinare il backup in caso di necessità. Vediamo poi le chiavi presenti sul nostro sistema attraverso:

~~~language-bash
gpg --list-key
~~~
in modo da individuare le informazioni da utilizzare per la criptazione dei nostri backup, avremo un output simile a:

~~~language-bash
marco@supernova:~$ gpg --list-key
/home/marco/.gnupg/pubring.gpg
------------------------------
pub   2048R/1F1FFF11 2012-03-20
uid                  Marco Vito Moscaritolo (Supernova) <mavimo@gmail.com>
sub   2048R/11111FF1 2012-03-20
~~~
dove possiamo individuare la nostra chiave.

### Script di backup

A questo punto possiamo andare ad estrarre le informazioni da usare per la criptazione dei dati prima del trasferimento verso lo storage remoto. Per effettuare i backup creiamo uno file:
~~~language-bash
sudo nano  /etc/cron.daily/backup-s3
~~~
e inseriamoci al suo interno il seguente codice:
~~~language-bash
#!/bin/sh
# Esporta le variabili d'ambiente necessarie per le autenticazioni
export AWS_ACCESS_KEY_ID=[your-access-key-id]
export AWS_SECRET_ACCESS_KEY=[your-secret-access-key]
export PASSPHRASE=[your-gpg-passphrase]

# Setta la chiave GPG da usare per la criptazione
GPG_KEY=[your-gpg-key]

# Indica la cartella d partenza del backup
SOURCE=/

# Indica la destinazione (nel nostro caso S3)
# Il bucket potrebbe anche non esistere, è richeisto
# che sia univoco fra tutti gli utenti Amazon, quindi
# creane uno con una sua complessità per assicurarti
# che non sia già usato
DEST=s3+http://[your-bucket-name]/[backup-folder]

# Impostare le cartelle che volete che siano incluse
# o escluse dalla operazioni di backup.
duplicity \
    --encrypt-key=${GPG_KEY} \
    --sign-key=${GPG_KEY} \
    --include=/var/ww \
    --include=/var/lib/mysqll \
    --include=/etc \
    --exclude=** \
    ${SOURCE} ${DEST}

# Resetta le variabili d'ambiente per evitare che siano accessibili da altri
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export PASSPHRASE=
~~~
A questo punto salviamo e diamo allo script i permessi di esecuzione:
~~~language-bash
chmod +x /etc/cron.daily/backup-s3
~~~
e proviamo a lanciarlo
~~~language-bash
/etc/cron.daily/backup-s3
~~~
il sistema effettuerà la prima copia dei file sullo storage remoto.

### Spiegazioni su duplicity

Procediamo con alcune spiegazioni per capire cosa sta succedendo e come ottimizzare il nostro script. **Duplicity** effettua un backup incrementale, in pratica crea un primo backup dell'ambiente e procede ad ogni esecuzione ad effettuare un controllo di differenza tra i dati locali (che quindi potrebbero essere stati variati) e quelli presenti nello spazio remoto. In caso di differenza procede andando a creare un archivio di tutti i dati modificati e reinviarli sullo spazio remoto. In tutto questo il sistema crea ua serie di file che contengono il checksum dei file in modo da poter effettuare il controllo di variazione dei file senza dover andare a leggere tutti i file per effettuare un controllo e riducendo quindi le richieste verso lo spazio di backup (ricordiamo che su **S3** le richieste di file sono a pagamento, quindi se avessimo 2000 file pagheremmo per 2000 richieste, oltre che per la banda consumata).

### Ottimizzazioni

Per ottimizzare i tempi di controllo e per ridurre le richieste da effettuare al sistema andremo ad impostare il nostro script per passare a duplicity informazioni in merito a ogni quanto tepo ricostruire il backup integrale del sistema in modo da ottenre pià facilmente dei diff, per fare questo utilizziamo il parametro:
~~~language-bash
  --full-if-older-than 1M
~~~
che dice di ricostruire il backup totale ogni mese. Altro parametro particolarmente importante è la dimensione che ogni pacchetto può avere, di default il sistema crea file di diff di massimo 5MB per ridurre il consumo di banda in caso di ripristino, nel nostro caso, essendo particolarmente importanti il numero dei file, possiamo preferire aumentare la dimensione dei file di backup incrementale usando il parametro:
~~~language-bash
  --volsize 250
~~~
indicando così di fare file da 250M aziché da 5, riuducendo il numero di file impiegati. Come ultima operazione procediamo eliminando i file di backup più vecchi di un tot mesi (io ho scelto 3) in modo da ridurre il consumo di spazio sul server (e quindi i costi di backup); per fare questo inseriamo alla fine dello script la riga:
~~~language-bash
duplicity remove-older-than 6M --force ${DEST}
~~~

### Recovery dei backup

Il recovery delle informazioni è particolarmente semplice e si tratta di indicare quale è la sorgente e la destinaione da ripristinare:
~~~language-bash
duplicity s3+http://[your-bucket-name]/[backup-folder] /dir/di/ripristino
~~~
che procederà a ripristinare tutti i dati presenti all'interno del sistema. Volendo possiamo specificare ulteriori informazioni, quale la data da cui effettuare il backup, o il file specifico da ripristinare:
~~~language-bash
duplicity -t 3D --file-to-restore FILENAME s3+http://[your-bucket-name]/[backup-folder] /dir/di/ripristino
~~~
Dove si indica di ripristinare il file FILENAME di 3 giorni fa (3D) e di salvarlo nella cartella indicata. Maggiori informazioni sugli internal di duplicity che possono essere utili per la pianificazione di procedure di backup possono essere ottenute dalla pagina della [documentazione del progetto](http://duplicity.nongnu.org/epydoc/index.html).
