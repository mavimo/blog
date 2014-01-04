---
title: Trac con SVN su Ubuntu 9.04
categories: [Linux]
tags: [svn, trac, ubuntu]
---
Per la gestione di progetti, sopratutto quando ci si lavora in più di una persona, ma anche nel caso della singola personaquando si ha la necessità di tracciare quello che viene fatto non può mancare un meccanismo di tracking. Tra questi strumenti quello che preferisco utilizzare è Trac, strumento completo che comprende:

   * Wiki per la gestione della documentazione del progetto.
   * Gestione ticket per la segnalazione di eventuali problemi e attività da svolgere
   * Integrazione con sitemi VCS come possono essere SVN, CVS, Mercury, Git, ...
   * Gestione delle tempistiche (Milestone, Relase, ...)
   * Visualizzazione del codice da web con gestione delle differenze, ...

Oltre a questo si ha la possibilità di integrare diversi plugin (scritti in python) che permettono di aggiungere le funzionalità di più disparate.
Vediamo ora come installarlo e configurarlo.
<!--break-->
Innanzitutto andremo ad utilizzare questo applicativo gestendo tutto sulla stessa macchina, anche se è possibile andare ad utilizzare erpository remoti o interfacciarsi con servizi tramite XmlRpc (usando appositi plugin). L'installazione è stata fatta su una macchina Ubuntu 9.04 correttamente installata e aggiornata, quindi come prima cosa diamo:
~~~language-php
sudo apt-get update
sudo apt-get upgrade
~~~

in modo da aggiornare il sistema. Il passo successivo è di installare tutti i pacchetti che verranno utilizzati, quindi:
~~~language-php

sudo apt-get install apache2 libapache2-mod-python trac
~~~

a questo punto il sistema caricherà tutto quello che serve al sistema. Al termine del caricamento dei file andiamo a creare, nell'ordine:
<ol>
   * repository SVN da usare
   * installazione e configurazione di trac collegato al repository
   * interfacciamento con apache per permettere la navigazione da web.
</ol>
Ci sono alcune cose che possono sembrare "particolari" in trac, quindi ve le accenno subito.

Innanzitutto ogni progetto è una sua istanza autonoma, quindi se abbiamo più progetti sarà necessario creare più istanze di trac. Questo permette di tenere il tutto ben compartimentato, a fronte di uno spreco di risorse (spazio su disco) veramente minimo. 
Un altra caratteristica è che l'amministrazione avviene tramite shell e non da pannello web, anche se è possibile attivare (e lo faremo) questa funzionalità.
La caratteristica "forse" più particolare è data dalla mancanza di un meccanismo di autenticazione interno, infatti basa tutto il suo processo sulle autenticazioni fornite da sistemi esterni (siano esse le utenze SVN, LDAP, fornite da Apache, ...). Questo normalmente viene vsto come "sconvolgente" ma permette di avere una centralizzazione del meccanismo di autenticazione che alla fine risulta essere conveniente.

<h3>Creazione e configurazione di SVN</h3>
La prima cosa da fare è creare un repository SVN (ma potrebbe essere CVS, GIT, ... solo che la configurazione è più macchinosa) su cui andare ad inserire il codice che svilupperemo, quindi come prima cosa andiamo a creare una directory (di solito utilizzo la /home/svn come radice) in cui andare a memorizzare il repository, e inizializzare SVN all'interno di questa:
~~~language-php
mkdir /home/svn
mkdir /home/svn/test
svnadmin create /home/svn/test
~~~

a questo punto possiamo iniziare a lavorare sul nostro repository SVN usando lo strumentdo che preferiamo, personalmente uso RapidSVN e NetBeans (ma Tortoise SVN e simili vanno bene nello stesso modo). Controlliamo che il checkout, il commit e le classiche operazioni funzionino senza problemi facendo un pò di test.

<h3>Inizializzazione di Trac collegato a SVN</h3>
Per l'installazione di Trac, dato che poi deve essere disponibile in rete tramite WEB preferisco usare le direcotry _/var/www_ ma potremmo usare altre direcory assicurandoci che Apache abbia permesso il lettura su queste, quindi procediamo con:
~~~language-php
sudo mkdir /var/www/trac
sudo mkdir /var/www/trac/test
sudo trac-admin /var/www/trac/test initenv
~~~

ora ci verranno proposte alcune domande di base per la configuazione, quindi:
~~~language-php
Creating a new Trac environment at /var/www/trac/test

Trac will first ask a few questions about your environment 
in order to initialize and prepare the project database.

 Please enter the name of your project.
 This name will be used in page titles and descriptions.

Project Name [My Project]> Progetto Test
...
Database connection string [sqlite:db/trac.db]> ENTER
...
Repository type [svn]> ENTER
...
Path to repository [/path/to/repos]> /home/svn/test

Creating and Initializing Project
...
---------------------------------------------------------------------
Project environment for 'Progetto Test' created.
...
Congratulations!

~~~

Qui sopra ho estratto le parti più significative, quelle dove ci sono richiesta a cui dobbiamo rispondere, nel mio caso il progetto è stato chiamato _Progetto Test_, come database per Trac ho lasciato _SQL Lite_ interno (sebbene sia possibile usare mysql attualmente non ve lo consiglio a causa di alcune piccole instabilità), per la creazione del repository ho prima confermato che si tratta di un repository SVN e quindi ho indicato in quale percorso andare a trovare il repository. Sarebeb possibile indicare anche un percorso remoto, in modo da tenere SVN e Trac su macchien diverse ma non dovrebbe essere necessario salvo esigenze particolari. Tutto è proseguito fino al termine senza problemi, quindi ora il nostro progetto Trac è attivo e funzionante.

<h3>Integrazione in Apache2</h3>
Ora si tratta di rendere il nostro progetto Trac disponibile anche da interfaccia web, quindi dobbiamo andare a interfacciarlo con Apache. Per fare questo andiamo a caricare in apache il modulo per la gestione di progetti in python (si, trac è scrtitto in python ;))
~~~language-php
sudo a2enmod python
sudo apache2ctl restart
~~~


Creaimo il Virtual Host di apache:
~~~language-php

sudo nano /etc/apache2/sites-available/trac
~~~

e dentro scriviamoci (modificando il nome del sito):
~~~language-php

<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  ServerName  trac.miosito.tpl
  
  DocumentRoot /var/www/trac
  <Directory />
    Options FollowSymLinks
    AllowOverride All
  </Directory>
  
  ErrorLog /var/log/apache2/error.trac.log
  
  # Possible values include: debug, info, notice, warn, error, crit, alert, emerg.
  LogLevel warn
  
  CustomLog /var/log/apache2/access.trac.log combined
  
  <LocationMatch "/[^/]+/login">
    AuthType Basic
    AuthName "Trac"
    AuthUserFile /var/www/trac/.htpasswd
    Require valid-user
  </LocationMatch>
  
  <Location />
    SetHandler mod_python
    PythonInterpreter main_interpreter
    PythonHandler trac.web.modpython_frontend 
    PythonOption TracEnvParentDir /var/www/trac
    PythonOption TracUriRoot /
  </Location>
</VirtualHost>

~~~


Assegnamo i corretti permessi alla directory del trac e aggiungiamo il stito e ricarichiamo i dati di apache.
~~~language-php
sudo chown -R www-data:www-data /var/www/trac
sudo a2ensite trac
sudo /etc/init.d/apache2 reload
~~~


A questo punto andando a visitare il sito _http://trac.miosito.tpl/_ vedremo l'lenco dei progetti trac attivati, accedendo al nostro _Progetto Test_ possiamo andare a vedere il nostro trac per il progetto. Ora vediamo di gestire l'autenticazione, la strada più semplice è di ricorrere all'utilizzo dell'autenticazioend i apache (l'abbiamo anche già configurata precedentemente nel file del virtual host), quindi creaimo il file di autenticazione tramite:
~~~language-php

sudo htpasswd -c /var/www/trac NOMEUTENTE
~~~

e inseriamo la password che ci viene richiesta. Per l'aggounta di utenti successivi omettiamo il parametro -c che indica la cerazione del file nuovo:
~~~language-php

sudo htpasswd /var/www/trac ALTRO_NOMEUTENTE
~~~

a questo punto possiamo andare ad aggiungere tutti gli utenti che vogliamo avere nei nostri progetti. Per semplificare ora abbiamo fatto in modo che tutti i progetti utilizzino la stessa autenticazione, ovviamente è possibile avere autenticazioni differenti per progetti differenti, nel caso ciò sia necessario.

<h3>Configuarzione dei permessi di Trac</h3>
Abbiamo detto che i permessi delle operazioni che gli utenti (anonimi ed autenticati) possono fare sul trac sono configurabili da shell, quindi andiamo a impostare i permessi che desideriamo, e prima di tutto abilitiamo l'interfaccai di amministrazione da WEB (comoda per il setup iniziale, dopo la prima configurazione possiamo disabilitarla).

Iniziamo a vedere che permessi sono attualmente impostati:
~~~language-php

sudo trac-admin /var/www/trac/test/ permission list
~~~

ed ora aggiungiamo i permessi che riteniamo opportuni (in questo caso gli utenti autenticati possono amministrare il trac da interfaccai web):
~~~language-php

sudo trac-admin /var/www/trac/test/ permission add autenticated TRAC_ADMIN
~~~

e rimuoviamo i permessi che riteniamo troppo aperti (tolgo tutto per gli utenti anonimi):
~~~language-php
permission remove anonymous BROWSER_VIEW CHANGESET_VIEW FILE_VIEW LOG_VIEW 
permission remove anonymous MILESTONE_VIEW REPORT_SQL_VIEW REPORT_VIEW
permission remove anonymous ROADMAP_VIEW SEARCH_VIEW TICKET_VIEW
permission remove anonymous TIMELINE_VIEW WIKI_VIEW
~~~


Ora possiamo andare ad affinare le diverse caratteristiche da panenllo Web, aggiungendo i permessi e gli elementi nel trac.

Vedremo prossimamente come estendere il nostro Trac con altre funzionalità e come configurarlo in maniera produttiva per la gestione del processo.