---
title: Find in file from shell
categories: [Linux]
tags: [bash, find in file, grep, script]
---
Capita a volte di avere la necessità di cercare all'interno di un gruppo di file una stringa, ancora più spesso capita di dover scoprire in quale file all'interno di una cartella c'è la stringa che cerchiamo, e magari anche in che posizione, il tutto evitandoci di cercare nelle cartelle create dal nostro VCS. Vediamo ora come effettuare una ricerca in maniera veloce.
<!--break-->
Come prima poca potremmo estrarre il contenuto di tutti i file usando il comando _cat_ e poi filtrare la parte che ci interessa usando _grep_, soluzione improvvisata e che a volte può essere utile; molto meglio, invece, è lascia fare tutto a _grep_.

Per fare questo usiamo il comando grep indicando la stringa da cercare, andando ad aggiungere anche una serie di comandi, tra cui:
<dl>
  <dt>-n</dt>
    <dd>Per indicare di visualizzare il numero della riga della stringa cercata nel file.</dd>
  <dt>-r</dt>
    <dd>Per indicare che si tratta di una ricerca ricorsiva, comprendente anche le subdirectory.</dd>
  <dt>--color</dt>
    <dd>Indica che l'output deve essere visualizzato utilizzando i colori per evidenziare i diversi elementi, rendendo  più semplice la comprensione del risultato.</dd>
  <dt>--exclude-dir</dt>
    <dd>Ci permette di escludere alcune directory dalla ricerca</dd>
</dl>

Usando la combinazione di questi ci permette di effettuare la ricerca di una stringa saltando tutte le directory che non ci interessano (le directory con i dati di _CVS_ o _.svn_), per esempio:
~~~language-php

grep --color -n -r --exclude-dir=.svn MISTRINGA ./
~~~

permette di ottenere tutte le occorrenze della parola MIASTRINGA nei files presenti in tutte le directory a partire dalla directory corrente.

Per rendere più comoda l'esecuzione della ricerca possiamo creare un mini **script bash** che ci faccia da scorciatoia (potremmo effettuare anche un alias, dipende da cosa vogliamo). Creiamo un file nella directory **/usr/sbin**, e inseriamo in questo le righe (rendendo poi il file eseguibile):
~~~language-php
#!/bin/sh
grep --color -n -r --exclude-dir=.svn $1 ./
~~~

Per rendere comoda la creazione potete lanciare i seguenti comandi:
~~~language-php
sudo su -c "echo \#\!\/bin\/sh > /usr/sbin/ff"
sudo su -c "echo 'grep --color -n -r --exclude-dir=.svn \$1 ./' >> /usr/sbin/ff"
sudo chmod 555 /usr/sbin/ff
~~~

a questo punto per trovare la posizione di una stringa possiamo dare, dalla directory da cui vogliamo far partire la ricerca, il comando:
~~~language-php

ff STRINGA_CERCATA
~~~

Lo script l'ho chiamato _ff_ per comodita nella digitazione e perché Find in File mi pareva un nome facilemente ricordabile. Come output del comando otterremo una serie di stringhe che ci indicano dove sarà la stringa cercata nei diversi files in cui è presente; verrà generanto un output simile a:
~~~language-php

ff STRINGA_CERCATA

./file.txt:20: questa è la STRINGA_CERCATA nel file
./directory/file.txt:3: questa è un altra occorrenza della STRINGA_CERCATA
~~~

Questo comando diventa molto comodo per trovare all'interno di server a cui si accede in SSH dove andare a trovare i file a cui mettere mano. Inoltre, escludendo le directory .svn (o .git, CVS, ... in base al sistema di versioning che usate), permette di effettuare la ricerca velocemente anche sulla macchina locale, per esempio quando non si vuole caricare netbeans e il progetto completo per cercare una stringa.