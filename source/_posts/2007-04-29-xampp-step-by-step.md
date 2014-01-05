---
title: XAMPP - Step by Step
categories: [varie]
tags: [apache, filezilla, mercury, webserver locale, xampp]
redirect: [varie/installazione_configurazione_xampp, node/34]
meta:
    description: Nello sviluppo di siti web è preferibile operare in locale e trasferire il tutto sul server remoto solo una volta che si è ottimizzata la configurazione per lo scopo che ci si è prefissi. Ciò permette di avere una maggior velocità poiché non è necessario operare sul server trasferendo i file ogni volta che è necessario apportare una qualche modifica e perché non si hanno restrizioni imposte dai limiti di banda.
    tags: [varie, apache, filezilla, mercury, webserver locale, xampp]
---
Nello sviluppo di siti web è preferibile operare in locale e trasferire il tutto sul server remoto solo una volta che si è ottimizzata la configurazione per lo scopo che ci si è prefissi. Ciò permette di avere una maggior velocità poiché non è necessario operare sul server trasferendo i file ogni volta che è necessario apportare una qualche modifica e perché non si hanno restrizioni imposte dai limiti di banda.
Per poter sviluppare in locale è necessario avere a disposizione un Web Server in cui è abilitato l'utilizzo di script PHP e di un database in cui archiviare i dati. I software scelti sono quelli presenti nella maggior parte dei server presenti in rete e quindi useremo Apache (Web Server) con PHP 5 attivato, e MySQL 5 come database. Per ovviare ai problemi di installazione e configurazione dei vari software utilizzeremo un pacchetto che contiene tutti questi programmi (a alcuni altri) già configurai per le esigenze più comuni. Per ora ci occuperemo dell'installazione su piattaforma Windows.
<!--break-->
Iniziamo scaricando XAMPP dal <a href="http://www.apachefriends.org/en/xampp.html">sito ufficiale</a>. Una volta scaricato il programma installiamolo sul nostro PC e Scegliamo di avviare Apache e MySQL come servizi, mentre Mercury  e FileZilla non ci interessano, verranno quindi lasciati disabilitati. Al termine dell'installazione apriamo un browser (vi consiglio Firefox) e andiamo all'indirizzo _http://localhost/_. A questo punto avremmo davanti un interfaccia che ci permette di scegliere la lingua principale da utilizzare per l'amministrazione del server, guardacaso sceglieremo l'italiano. Ora ci troveremo davanti ad una schermata simile a quella rappresentata qui sotto.
<img src="/files/34/2.png" alt="Immagine della prima pagina di installazione di XAMPP" />
Se selezioniamo _Sicurezza_ dal menu di sinistra ci troveremo di fronte ad una serie di indicazioni che mettono in risalto i priblemi di sicurezza riscontrati sul nostro server.

<img src="/files/34/3.png" alt="Immagine della pagina delle impostazioni di sicurezza di XAMPP" />

Vediamo ora come modificare le impostazioni di default per correggere queste problematiche.

Iniziamo andando ad impostare le password di accesso alla interfaccia di amministrazione di XAMPP selezionando il link presente nella pagina di sicurezza e precisamente quello indicato da _http://localhost/security/xamppsecurity-php_. Impostiamo per la protezione directory di XAMPP un utente e una password (per esempio _root_, e _miapassword_), salvando le impostazioni inserite scegliendo _Rendi sicura la directory di XAMPP_.Proseguiamo l'operazione dalla stessa pagina andando ad inserire la password di _MySQL superuser_; una volta che è stata inserita e confermata selezioniamo cambia password per rendere permanente la modifica.
A questo punto ci verrà chiesto di inserire l'utente e password scelte per l'accesso all'interfaccia di amministrazione.
Fatto queste semplici operazioni dobbiamo andare a modificare alcune opzioni nei file di configurazione in modo da permettere l'accesso al database che abbiamo protetto con password, quindi apriamo _C:\Programmi\xampp\phpmyadmin\config.inc.php_ e troviamo la riga:

~~~language-php

$cfg['Servers'][$i]['password'] = '';
~~~


e aggiorniamo la password di accesso al database, quindi:

~~~language-php

$cfg['Servers'][$i]['password'] = 'miapassword';
~~~


Ripetiamo la stessa operazioni per il tipo di autorizzazione impostando la stringa a

~~~language-php

$cfg['Servers'][$i]['auth_type'] = 'http';
~~~


L'ultima operazione da effettuare è l'abilitazione del Safe Mode di PHP. Non è un operazione indispensabile lavorando in locale e solo su un sito di prova non accessibile dall'esterno, ma poiché la maggior parte degli hoster ha il safe mode abilitato conviene prevenire i possibili errori di programmazione che potrebbero sorgere. Per abilitarlo apriamo il file _C:\Programmi\xampp\apache\bin\php.ini_ e andiamo a modificare la riga da

~~~language-php

safe_mode = Off
~~~


a

~~~language-php

safe_mode = On
~~~


Apriamo ora il pannello di gestione dei servizi di XAMPP (se avete seguito l'installazione standard lo trovate in _C:\Programmi\xampp\xampp-control.exe_ e arrestate Apache, dopo di che riavviatelo. A questo punto andate a visualizzare ancora le impostazioni di Sicurezza e dovreste trovarvi con tutte le indicazioni rese sicure (ad esclusione dei servizi che non sono stati avviati).

<img src="/files/34/7.png" alt="Immagine della pagina delle impostazioni di sicurezza di XAMPP" />

Ora possiamo creare un nuovo sito locale andando a creare una nuova directory in _C:\Programmi\xampp\htdocs_ (per esmpio creiamo la directory _prova_) che sarà raggiungibile all'indirizzo _http://localhost/prova/_.

Ipotizziamo ora di voler creare un novo database per il nuovo sito di prova creato, le operazioni da compiere sono piuttosto banali, è sufficiente andare nel pannello phpMyAdmin (Presente all'indirizzo _http://localhost/phpmyadmin/_) e scegliere privilegi, quindi _Aggiungi nuovo utente_ e completiamo la pagina che ci viene presentata con le informazioni necessarie, in particolare nel nostro caso come nome utente inseriamo _prova_, come password _miaprova_ e lo conferiamo e scegliamo di creare un nuovo database per l'utente con lo stesso nome e tutti i privilegi (la seconda opzione). Fatto ciò premiamo il pulsante esegui. A questo punto avremo creato un nuovo database per il nuovo utente di cui abbiamo tutti i privilegi.
Per ora abbiamo creato uno spazio web in cui caricare i file che ci interessano (la directory _/prova_), abbiamo creato un nuovo utente per il database e un database ad esso associato. A questo punto possiamo installare il software impostandola i dati inseriti precedentemente e iniziare ad utilizzarlo. Nel caso fosse necessario possiamo attivare il modulo rewrite semplicemente decommentando la riga

~~~language-php

LoadModule rewrite_module modules/mod_rewrite.so
~~~


Presente nel file _C:\Programmi\Xampp\xampp\apache\conf\httpd.conf_. Se servissero altri moduli è possibili abilitarli nello stesso modo. Ricordiamoci che è necessario riavviare apache ogni volta che vengono inseriti nuovi moduli o effettuate modifiche al _php.ini_.

A questo punto abbiamo tutto pronto e configurato per poter inizare a sperimentare in locale tutti gli applicativi web che vogliamo (chi ha detto <a href="http://www.drupal.org">Drupal</a>?). Possiamo andare a perfezionare questo creando dei _VirtualHost_ in modo che il nostro sito non compaia come _http://localhost/prova/_, ma come _http://prova/_. Per fare questo è necessario aprire il il file _C:\Programmi\xampp\apache\conf\extra\httpd-vhosts.conf_ e aggiungere alla fien le righe
~~~language-php
NameVirtualHost *:80
<VirtualHost localhost:80>
    DocumentRoot C:\Programmi\xampp\htdocs\
</VirtualHost>
<VirtualHost prova:80>
    DocumentRoot C:\Programmi\xampp\htdocs\prova\
</VirtualHost>

~~~


Salviamo il file a aggiungiamo a _C:\WINDOWS\system32\drivers\etc\hosts_ una nuova riga del tipo:
~~~language-php

127.0.0.1       prova
~~~


Riavviamo nuovamente Apache e puntiamo il browser all'indirizzo _http://prova/_, a questo punto visualizzeremo l'applicativo che dobbiamo configurare o testare. Il primo _VirtualHost_ è stato inserito per permettere di accedere comunque all'interfaccia di amministrazione di XAMPP, volendo è possibile ometterla e accedere all'interfaccia di amministrazione tramite il protocollo https, ovvero _https://localhost/_.
