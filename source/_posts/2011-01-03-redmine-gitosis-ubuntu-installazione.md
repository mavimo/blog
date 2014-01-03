---
title: Redmine e Gitosis in Ubuntu 10.10 (guida all'installazione)
categories: [linux]
tags: [giosis, git, redmine, ubuntu]
---
Quando si lavora (come sviluppatori, ma anche in altre occasioni) in un team è quasi fondamentale avere un sistema per la gestione del codice oltre ad un sistema per la gestione del progetto. Inizialmente avevo utilizzato [trac](http://mavimo.org/linux/trac_svn_ubuntu_904), strumento ottimo, ma con alcuni vincoli, il più evidente: essere monoprogetto. Successivamente ho preferito utilizzare [redmine](http://redmine.org), strumento flessibile e potente.
Vediamo di seguito come installarlo e configurarlo in ubuntu 10.10, andando a configurarlo per utilizzare git come SCM e atomatizzare la creazione dei repository per i vari progetti, nonché i permessi di accesso a questi.
<!--break-->
### Installazione dell'ambiente di base

Partiremo da un installazione di base molto minimale, andando ad installare solamente il software che ci serve. Personalmente preferisco partire dall'installazione ottenuta da [MinimalCD](https://help.ubuntu.com/community/Installation/MinimalCD), in cui si parte con un CD di circa 12-15 Mb (in funzione dell'architettura scelta) e scaricando successivamente quello che serve. Procediamo quindi all'installazione NON selezionando nessuna preconfigurazione del server quando ci verrà richiesto.

Procediamo quindi con l'installazione del server SSH:

~~~language-bash
sudo apt-get install openssh-server
~~~

dei server MySQL:

~~~language-bash
sudo apt-get install mysql-server
~~~

inserendo la password di root quando viene richiesto (segniamocela per bene, ci servirà successivamente).

Apache2 e pacchetti richiesti per far girare rermine:

~~~language-bash
sudo apt-get install apache2 libapache2-mod-passenger
~~~

Assicuriamoci che il nostro server riesca a risolvere se stesso:

~~~language-bash
sudo nano /etc/hosts
~~~

ed inseriamo

~~~language-bash
127.0.0.1  redmine.SERVERNAME
~~~

sostituendo _redmine SERVERNAME_ con il nome del nostro server. Procediamo quindi con l'installazione di Redmine.

### Installare Redmine

Iniziamo installando il pacchetto fornito con la distribuzione. Si tratta della versione 1.0.0, nel nostro caso lo configureremo per interfacciarsi con MySQL come base dati. Nel caso dell'installazione di default di ubuntu l'applicazione è configurata per poter far girare molte istanze dell'applicativo in parallelo, nel nostro caso ci limiteremo ad utilizzare una sola istanza, ma manterremo la configurazione di ubuntu per poter eventualmente successivamente avviare più istanze.

~~~language-bash
sudo apt-get install redmine-mysql redmine
~~~

Nella procedura ci verrà chiesto di inserire l'ID dell'installazione (inseriamo **default**), quindi se vogliamo ocnfigurare un database (scegliamo **yes**), il tipo di database che intendiamo utilizzare (scegliamo pure **mysql**) e quindi ci viene chiesta la password di root per mysql (quella che abbiamo inserito precedentemente). Successivamente ci chiede il nome del database da usare per redmine. Personalmente ho scelto **redmine_default**, ma nulla vieta di scegliere altri nomi!

Una volta installata la versione base configuriamo apache per farla funzionare. Procediamo creando il link della cartella pubblica di redmine in /var/www, attraverso il comando:

~~~language-bash
sudo ln -s /usr/share/redmine/public /var/www/redmine
~~~

Quindi diciamo a passenger di usare l'utente www-data di apache, per fare questo editiamo il file _sudo nano /etc/apache2/mods-available/passenger.conf_:

~~~language-bash
sudo nano /etc/apache2/mods-available/passenger.conf
~~~

aggiungendo il testo:

~~~language-bash
  PassengerDefaultUser www-data
~~~

all'interno della direttiva di attivazione del modulo, complessivamente il file dovrebbe contenere:

~~~language-bash
<IfModule mod_passenger.c>
  PassengerRoot /usr
  PassengerRuby /usr/bin/ruby
  PassengerDefaultUser www-data
</IfModule>
~~~

Procediamo quindi creando un VirtualHost per il nostro server editando il file:

~~~language-bash
sudo nano /etc/apache2/sites-available/redmine
~~~

inserendo (sostituendo eventualmente redmine.SERVERNAME con il nome del nostro server):

~~~language-bash
<VirtualHost *:80>
  ServerAdmin webmaster@localhost
  ServerName  redmine.NOMESERVER

  DocumentRoot /var/www/redmine

  ErrorLog ${APACHE_LOG_DIR}/redmine-error.log

  LogLevel warn
  CustomLog ${APACHE_LOG_DIR}/redmine-access.log combined

  <Directory /var/www/redmine>
    RailsBaseURI /
    PassengerResolveSymlinksInDocumentRoot on
  </Directory>
</VirtualHost>
~~~

disattiviamo il VirtualHost di default (potrebbe dare problemi di sicurezza nei passaggi successivamente effettuati) e attiviamo il VirtualHost di redmine:

~~~language-bash
sudo a2dissite default
sudo a2ensite redmine
~~~

e quindi riavviamo apache:

~~~language-bash
sudo service apache2 restart
~~~

a questo punto possiamo controllare il corretto funzionamento del nostro sistema apprendo in un browser:

 * http://redmine.SERVERNAME

se tutto va bene dovremmo trovarci davanti l'installazione funzionante di redmine, pronta per essere usata (ma non ancora integrate con git, quindi non partite in 5!).

### Git & Gitosis

Procediamo ora con l'installazione e configurazione di git e gitosis per il controllo degli accessi. Partiamo installando git usando quanto disponibile nei repository:

~~~language-bash
sudo apt-get install git-core
~~~

e quindi dei pacchetti che ci serviranno per utilizzare gitosis

~~~language-bash
sudo apt-get install python-setuptools build-essential
~~~

Procediamo quindi con l'installazione dei pacchetti python richiesti da gitosis:

~~~language-bash
sudo easy_install pip
sudo pip install virtualenv
~~~

A questo punto creiamo l'utente che utilizzerà git:

~~~language-bash
sudo adduser --system --shell /bin/bash --gecos 'Git Administrator' --group --disabled-password --home /opt/git git
~~~

e generiamo le sue chiavi SSH

~~~language-bash
sudo -H -u git ssh-keygen -t dsa
~~~

Inizializiamo l'ambiente virtuale per python per l'utente git

~~~language-bash
sudo -u git virtualenv ~git/virtualenv
~~~

e scarichiamo la versione più recente di gitosis direttamente dal suo repository

~~~language-bash
sudo -u git ~git/virtualenv/bin/pip install git+git://eagain.net/gitosis.git
~~~

Aggiungiamo quindi nel file _.bashrc_ dell'utente _git_ la congurazione per l'ambiente virtuale di python:

~~~language-bash
echo "source \$HOME/virtualenv/bin/activate" | sudo -u git tee -a ~git/.bashrc > /dev/null
~~~

A questo punto siamo pronti per inizializzare gitosis:

~~~language-bash
sudo -u git cat ~git/.ssh/id_dsa.pub | sudo -H -u git ~git/virtualenv/bin/gitosis-init
~~~

### Integrazione di redmine con git e gitosis

Per procedere nell'installazione utilizzeremo il plugin **redmine-gitosis**, procediamo quindi scaricandolo:

~~~language-bash
cd /usr/share/redmine
sudo script/plugin install  git://github.com/rocket-rentals/redmine-gitosis.git
~~~

successivamente dobbiamo editare alcuni file al suo interno per far funzionare il tutto, in particolare in:

~~~language-bash
sudo nano /usr/share/redmine/vendor/plugins/redmine-gitosis/lib/gitosis.rb
~~~

andiamo a correggere la configurazione in modo che rispecchi quanto indicato:

~~~language-bash
    module Gitosis
      # server config
      GITOSIS_URI = 'git@redmine.NOMESERVER:repositories/gitosis-admin.git'
      GITOSIS_BASE_PATH = '/opt/git/repositories/'

      # commands
      ENV['GIT_SSH'] = SSH_WITH_IDENTITY_FILE = File.join(RAILS_ROOT, 'vendor/plugins/redmine-gitosis/extra/ssh_with_identity_file.sh')
~~~

cambiando opportunamente il nome del server e (fate bene attenzione) _redmine_gitosis_ in _redmine-gitosis_ (da _trattino basso_ a _trattino_).

Modifichiamo quindi il file:

~~~language-bash
sudo nano /usr/share/redmine/vendor/plugins/redmine-gitosis/extra/ssh_with_identity_file.sh
~~~

in modo che risulti avere al suo interno la dichiarazione di LD_LIBRARY_PATH, alla fine dovrebbe avere il seguente contenuto:

~~~language-bash
#!/bin/bash
LD_LIBRARY_PATH=""
exec ssh -i `dirname $0`/ssh/private_key "$@"
~~~

Procediamo quindi andando ad indicare la chiave da utilizzare per l'autenticazione su GIT da parte di gitosis:

~~~language-bash
sudo cp ~git/.ssh/id_dsa /usr/share/redmine/vendor/plugins/redmine-gitosis/extra/ssh/private_key
~~~

Per potere installare il plugin **redmine-gitosis** sarà necessario andare a scaricare alcune gemme, quindi eseguiamo:

~~~language-bash
sudo gem install lockfile inifile net-ssh
~~~

ed installiamo il plugin

~~~language-bash
cd /usr/share/redmine
sudo rake --trace db:migrate_plugins RAILS_ENV=production
~~~

Poiché passenger gira con l'utente www-data dobbiamo andare a creare le chiavi SSH anche per questo:

~~~language-bash
sudo mkdir /var/www/.ssh
sudo chown www-data:www-data /var/www/.ssh
sudo -H -u www-data ssh-keygen -t dsa
~~~

e aggiungere tutte queste chiavi all'elenco degli utenti che possono autenticarsi con l'utente git:

~~~language-bash
sudo cat ~www-data/.ssh/id_dsa.pub | sudo -u git tee -a ~git/.ssh/authorized_keys
sudo cat ~git/.ssh/id_dsa.pub      | sudo -u git tee -a ~git/.ssh/authorized_keys
~~~

Dopo di che dobbiamo assicurarci che queste si trovino PRIMA delle dichiarazioni di gitosis, quindi apriamo il file

~~~language-bash
sudo nano ~git/.ssh/authorized_keys
~~~

e assicuriamoci che le due chiavi indicate si trovino PRIMA (se non lo sono spostiamo) della riga:

~~~language-bash
#### autogenerated by gitosis, DO NOT EDIT
~~~

a questo punto DOBBIAMO autenticarci almeno una volta con i due utenti (il sistema chiede conferma per l'autenticazione la prima volta)

~~~language-bash
sudo -u git ssh git@redmine.NOMESERVER
sudo -u www-data ssh git@redmine.NOMESERVER
~~~

e per completare riavviamo apache:

~~~language-bash
sudo service apache2 restart
~~~

A questo punto il sistema è funzionante e ci permette di utilizzare lo strumento al massimo delle sue  funzionalità.

### Usiamo redmine

Ok, tutto è configurato, ma come lo usiamo? Bhè, il tutto è molto semplice! Iniziamo creando un nuovo progetto, quindi andiamo alla pagina _Administration_ &raquo; _Projects_ &raquo; _New Project_:

 * http://redmine.SERVERNAME/admin/projects/new

Completando tutti i campi richiesti. Fate particolare attenzione al campo identificato come **Identifier** che ci servirà successivamente per il repository GIT.

A questo punto aggiungiamo tutti gli utenti che devono accedere a redmine (potremmo in ogni caso aggiungerli, bloccarli, .. successivamente) tramite la pagina _Administration_ &raquo; _Users_ &raquo; _New User_:

 * http://redmine.SERVERNAME/users/new

Torniamo quindi al nostro progetto e aggiungiamo tutti gli utenti che devono accedervi. Gli utenti sviluppatori potranno avere accesso anche al repository (come gli utenti manager), mentre non avranno accesso gli utenti classificati come reporter.

Gli utenti, per potersi identificare presso il repository git devono usare le proprie chiavi pubbliche SSH, che possono aggiungere al proprio account dalla pagina _My account_ &raquo; _Public keys_ &raquo; _New value_:

 * http://redmine.SERVERNAME/my/public_keys

A questo punto andiamo a effettuare il primo commit sul repository del progetto:

~~~language-bash
mkdir PROJECT_IDENTIFIER
cd PROJECT_IDENTIFIER/
git init
touch README
git add README
git commit -m "Initial commit."
git remote add origin git@redmine.NOMESERVER:PROJECT_IDENTIFIER.git
git push origin master
~~~

andando ovviamente a cambiare il valore del PROECT_IDENTIFIER con quello indicato quando abbiamo creato il reposotory.

Gli utenti che avranno accesso al repository potranno accedervi con:

~~~language-bash
git clone git@redmine.NOMESERVER:PROJECT_IDENTIFIER.git
~~~

mentre gli utenti che non avranno i permessi impostati riceveranno un bel messaggio di errore.

### Varie

Si, benissimo ora i divertiamo un pò con redmine.. ma tutto funziona bene? Purtroppo c'è ancora un problemino, cercando di sfogliare il repository nell'interfaccia web di redmine non vediamo nulla, purtroppo questo è un bug noto risolto con la versione 1.0.3 (attualmente siamo alla 1.0.5).  Vedremo successivamente come procedere con l'aggiornamento.

EDIT: ecco il link alla parte successiva per l'[aggiornamento di redmine e la configurazione del browsing dei repository](/linux/redmine_ubuntu_drupal).

Come sempre.. Commenti & Critiche sempre ben accetti :)
