---
title: Redmine in Ubuntu (parte 2)
categories: [linux]
tags: [git, gitosis, redmine, ubuntu]
---
Nell'[articolo precedente](http://mavimo.org/linux/redmine_gitosis_ubuntu_1010_guida_allinstallazione) abbiamo visto come procedere all'installazione di [redmine](http://www.redmine.org) su apache, abbiamo visto come integrare [git](http://git-scm.com/) e [gitosis](http://eagain.net/gitweb/?p=gitosis.git) per la gestione delle credenziali degli utenti.. ma alla fine avevamo specificato che c'era ancora qualche problema da risolver. Di seguito vediamo come correggere alcune delle problematiche indicate.
<!--break-->
## Aggiornare redmine

Innanzitutto la versione presente nei repository di ubuntu 10.10 è la versione 1.0.0, purtroppo questa ha qualche bug (di troppo) sopratutto nella gestione dei repository di git, pertanto dobbiamo procedere con l'aggiornamento alla versione 1.0.5 (l'ultima rilasciata) per poter correggere questi problemi.
Per fare questo utilizzeremo il pacchetto gentilmente messo a disposizione da _Michael Kuhn_, per fare questo inseriamo il sorgente del repository sl server:

~~~language-bash
sudo nano /etc/apt/source.list.d/redmine.list
~~~

ed inseriamoci le seguenti righe di codice:

~~~language-bash
deb http://ppa.launchpad.net/suraia/server/ubuntu maverick main
deb-src http://ppa.launchpad.net/suraia/server/ubuntu maverick main
~~~

installiamo anche la chiave del repository:

~~~language-bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1D9D38E5
~~~

a questo punto andiamo ad installare la versione aggiornata di redmine:

~~~language-bash
sudo apt-get update
sudo apt-get install redmine
~~~

e quindi riavviamo apache:

~~~language-bash
sudo service apache2 restart
~~~

A questo punto andando nell'interfaccia di amministrazione dovremmo verificare che la versione di redmine è la 1.0.5:

 * http://redmine.SERVERNAME/admin/info

come sempre inserite il nome del server corretto.

## Browsing del repository

Purtroppo i nostri repository non sono ancora visitabili utilizzando l'interfaccia di redmine, vediamo quindi di risolvere questo problema! Il tutto è dovuto al fatto che il repository è dell'utente _git_, mentre redmiine gira con l'utente _www-data_. Per fare questo facciamo in modo che il comando git venga eseguito dall'utente git.
Per fare questo iniziamo a dare i permessi all'utente www-data di sudare con l'utente git senza password (solo per lanciare il comando git):

~~~language-bash
sudo nano /etc/sudoers
~~~

ed inseriamo (sotto la direttiva ```# User privilege specification```) la riga:

~~~language-bash
www-data ALL=(git) NOPASSWD: /usr/bin/git
~~~

a questo punto proviamo ad eseguire un comando come utente www-data per visualizzare i dati di uno dei repository creati:

~~~language-bash
sudo -u www-data git --git-dir /opt/git/repositories/NOMEREPOSITORY.git branch --no-color
~~~

se tutto va bene dovremmo avere i permessi per visualizzare i branch attivi sul repository.

A questo punto facciamo si che i comandi di git vengano eseguito con il comando sudo andano a modificare il file:

~~~language-bash
sudo nano /usr/share/redmine/lib/redmine/scm/adapters/git_adapter.rb
~~~

e sostituiamo la riga:

~~~language-bash
        GIT_BIN="git"
~~~

con:

~~~language-bash
        GIT_BIN="sudo -u git git"
~~~

a questo punto andando all'interno della pagina di visualizzazione dei repository potremmo vedere i sorgenti del nostro codice dall'interfaccia web.

## E la syntax highlight per Drupal?

Effettivamente andando ad utilizzare Drupal, l'evidenziazione della sintassi per i file module, install e inc non è quella che dovrebbe essere, vengono interpretati come file plain text, anziché come file PHP. Per correggere è sufficiente andare a modificare il file:

~~~language-bash
sudo nano /usr/share/redmine/vendor/plugins/coderay-0.9.2/lib/coderay/helpers/file_type.rb
~~~

andando ad aggiungere, all'interno della dichiarazione del della costante **TypeFromExt** anche le seguenti associazioni:

~~~language-bash
    'module' => :php,
    'install' => :php,
    'inc' => :php,
~~~

In questo modo anche l'evidenziazione della sintassi per  file module, installa e inc sarà attiva.

Questo è quanto... poterete sbizzarrirvi con gli altri plugin!
