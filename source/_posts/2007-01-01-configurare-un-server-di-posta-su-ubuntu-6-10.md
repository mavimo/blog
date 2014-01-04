---
title: Configurare un server di posta su Ubuntu 6.10
categories: [Linux]
tags: [mail, mysql, postfix, roundcube]
---
Questa breve guida si prefigge lo scopo di installare un mailserver per l'invio di posta all'interno di un organizzazione con una serie di utenti che possono accedere sia tramite un qualsiasi client di posta (Outlook, Outlook Express, Thunderbird, Evince, ...) che tramite una webmail ospitata sul webserver locale.
Il server gestisce i divverenti utenti tramite l'utilizzo di _virtual_, ovvero sul sistema non saranno presenti gli account per i vari utenti di posta, ma questi saranno presenti all'interno di un database (nel nostro caso MySQL), che pu&ograve; essere facilemnte gestito anche da remoto (tramite una delle tante interfacce disponibili).
<!--break-->
Vediamo ora cosa ci serve installare per poter far funzionare il tutto:

 * <a href="http://www.postfix.org/">**Postfix**</a>: Il vero server di posta
 * <a href="http://www.mysql.com/">**MySQL**</a>: Database dove sono presenti i vari account degli utenti
 * <a href="http://www.courier-mta.org/">**Courier**</a>: Pacchetto che permette agli utenti di scaricare la posta tramite i protocolli POP3 (courier-pop) e IMAP4 (courier-imap).
 * <a href="http://www.apache.org/">**Apache2**</a>: webserver per installare la webmail e l'interfaccia di gestione del DB da remoto.
 * <a href="http://www.roundcube.net/">**Roudcube**</a>: la webmail che andremo ad utilizzare.


iniziamo ad istallare i pacchetti necessari per postfix:

~~~language-php

sudo apt-get install postfix postfix-mysql
~~~


per mysql

~~~language-php

sudo apt-get install mysql-client mysql-server
~~~


e infine per courier

~~~language-php

sudo apt-get install courier-base courier-imap courier-pop courier-authib-mysql
~~~


a questo punto iniziamo a configurare il database. Iniziamo modificando la password di root con una password sufficientemente complessa (solitamente in fase di instalazione si usa qualche cosa di banale, e ci&ograve; non &egrave; un bene):
~~~language-php

mysqladmin -u root -p password 'new-password'
~~~

a questo punto iniziamo a creare il nuovo database (per comodit&aacute;  chiamiamolo maildb):
~~~language-php

mysql -u root -p create maildb
~~~

Popoliamo il nostro database inserendo le tabele necessarie. La cosa pi&ugrave; veloce per fare ci&ograve; &egrave; copiare il testo che segue all'interno di un file e salvarlo (per esermpio con il nome <a href="/files/23/make_db.zip">make_maildb.txt</a>) dopo di che eseguire il comando:
~~~language-php

mysql -u root -p maildb < make_maildb.txt
~~~

Codice da inserire nel file:
~~~language-php
--
-- Table structure for table `aliases`
--
CREATE TABLE `aliases` (
  `pkid` smallint(3) NOT NULL auto_increment,
  `mail` varchar(120) NOT NULL default '',
  `destination` varchar(120) NOT NULL default '',
  `enabled` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`pkid`),
  UNIQUE KEY `mail` (`mail`)
)
--
-- Table structure for table `domains`
--
CREATE TABLE `domains` (
  `pkid` smallint(6) NOT NULL auto_increment,
  `domain` varchar(120) NOT NULL default '',
  `transport` varchar(120) NOT NULL default 'virtual:',
  `enabled` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`pkid`)
)
--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` varchar(128) NOT NULL default '',
  `name` varchar(128) NOT NULL default '',
  `uid` smallint(5) unsigned NOT NULL default '5000',
  `gid` smallint(5) unsigned NOT NULL default '5000',
  `home` varchar(255) NOT NULL default '/var/spool/mail/virtual',
  `maildir` varchar(255) NOT NULL default 'blah/',
  `enabled` tinyint(3) unsigned NOT NULL default '1',
  `change_password` tinyint(3) unsigned NOT NULL default '1',
  `clear` varchar(128) NOT NULL default 'ChangeMe',
  `crypt` varchar(128) NOT NULL default 'sdtrusfX0Jj66',
  `quota` varchar(255) NOT NULL default '',
  `procmailrc` varchar(128) NOT NULL default '',
  `spamassassinrc` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`)
)
~~~


Ora creaimo un nuovo utente e associamo ad esso i privilegi necessari per interagire su questo database. Digitiamo:
~~~language-php

mysql -u root -p maildb
~~~

e alla interfaccia di comando che compare digitiamo:
~~~language-php

GRANT ALL PRIVILEGES ON maildb.* TO mail@localhost IDENTIFIED BY 'apassword';
FLUSH PRIVILEGES;
~~~

Dove, ovviamente, dobbiamo andare ad inserire la password per il nostro utente.
Ora siamo pronti per iniziare a popolare il nostro database. Per inserire un nuovo dominio si utilizza
~~~language-php

INSERT INTO `domains` VALUES (1,'mavimo.org','virtual:',1);
~~~

Mentre per inserire un nuovo utente utilizzeremo:
~~~language-php

INSERT INTO `users` VALUES ('root@mavimo.org','root',5000,5000,'/var/spool/mail/virtual','root/',1,1,'apassword',password('apassword'),'','','');
INSERT INTO `users` VALUES ('marco@mavimo.org','marco',5000,5000,'/var/spool/mail/virtual','marco/',1,1,'bpassword',password('bpassword'),'','','');
INSERT INTO `users` VALUES ('prova@mavimo.org','prova',5000,5000,'/var/spool/mail/virtual','prova/',1,1,'cpassword',password('cpassword'),'','','');
~~~

Infine possiamo andare ad inserire degli alias tramite i comandi:
~~~language-php

INSERT INTO `aliases` VALUES (1,'postmaster@mavimo.org','root@mavimo.org',1);
~~~

Usciamo dall'interfaccia testuale con il comando
~~~language-php

EXIT;
~~~

Andiamo ora a realizzare il gruppo utenti virtual che sar&aacute;  quello utilizzato per la gestione dei vari account di posta:
~~~language-php

sudo addgroup --gid 5000 virtual
sudo adduser --gid 5000 --uid 5000 virtual
~~~

creiamo la cartella di spool per le mail:
~~~language-php

sudo mkdir /var/spool/mail/virtual
~~~

e assegniamola all'utente e gruppo virtual:
~~~language-php
sudo chown -R virtual:virtual /var/spool/mail/virtual
sudo chmod 771 /var/spool/mail/virtual
~~~

e a questo punto passiamo alla configurazione di postfix.
Iniziamo a modificare i file _/etc/postfix/main.cf_ ed inseriamo quanto segue:
~~~language-php
myorigin = $myhostname
mydestination = 
mynetworks = 127.0.0.0/8 192.168.0.0/16
recipient_delimiter = +
inet_interfaces = all
smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
append_dot_mydomain = no
biff = no
alias_maps = hash:/etc/postfix/aliases
alias_database = hash:/etc/postfix/aliases
virtual_mailbox_base = /var/spool/mail/virtual
virtual_mailbox_maps = mysql:/etc/postfix/mysql_mailbox.cf
virtual_uid_maps = mysql:/etc/postfix/mysql_uid.cf
virtual_gid_maps = mysql:/etc/postfix/mysql_gid.cf
virtual_minimum_uid = 110
virtual_alias_maps = mysql:/etc/postfix/mysql_alias.cf
virtual_mailbox_domains = mysql:/etc/postfix/mysql_domains.cf
~~~

dove andremo ad impostare al posto di 110 (assegnato al valore di _virtual_minimum_uid_) il valore dell'uid di postfix ottenibile tramite il comando:
~~~language-php

sudo cat /etc/passwd | grep postfix | awk 'BEGIN { FS=":" } {print $3 }'
~~~

salviamo il file e iniziamo a creare i file necessari per l'accesso al database. Per ognuno di essi &egrave; indicato il nome e il contenuto del testo; li trovate anche <a href="/files/23/postfix_config.zip">allegato</a> al seguente articolo, sar&agrave; sufficiente decomprimerli e copiarli all'interno della directory _/etc/postfix_ (NB: dovete andare a modificare la password di accesso al database in ognuno di essi!):
**mysql_alias.cf**
~~~language-php
user=mail
password=apassword
dbname=maildb
table=aliases
select_field=destination
where_field=mail
hosts=127.0.0.1
additional_conditions = and enabled = 1
~~~

**mysql_domains.cf**
~~~language-php
user=mail
password=apassword
dbname=maildb
table=domains
select_field=domain
where_field=domain
hosts=127.0.0.1
additional_conditions = and enabled = 1
~~~

**mysql_gid.cf**
~~~language-php
user=mail
password=apassword
dbname=maildb
table=users
select_field=gid
where_field=id
hosts=127.0.0.1
~~~

**mysql_mailbox.cf**
~~~language-php
user=mail
password=apassword
dbname=maildb
table=users
select_field=maildir
where_field=id
hosts=127.0.0.1
additional_conditions = and enabled = 1
~~~

**mysql_uid.cf**
~~~language-php
user=mail
password=apassword
dbname=maildb
table=users
select_field=uid
where_field=id
hosts=127.0.0.1
~~~

Apriamo ora il file _/etc/postfix/master.cf_ e andiamo a modificare le linee
~~~language-php
smtp      inet  n       -       -       -       -       smtpd
virtual   unix  -       n       -       -       -       virtual
~~~

In modo che risultino:
~~~language-php
smtp      inet  n       -       n       -       -       smtpd
virtual   unix  -       n       n       -       -       virtual
~~~

a questo punto riavviamo postfix:
~~~language-php

sudo /etc/init.d/postfix restart
~~~

e se tutto va bene (controllate i file _/var/log/mail.*_ ) il server dovrebbe essersi avviato e pronto per funzionare.
Possiamo testare il corretto funzionamento del server SMTP collegandoci tramite telnet:
~~~language-php

telnet localhost smtp
~~~

e nella console che otteniamo:
~~~language-php
EHLO mavimo.org
MAIL FROM: <marco@mavimo.org>
RCPT TO: <prova@mavimo.org>
data
messaggio di prova
.
~~~

Se tutto va bene il nostro server prender&agrave; in consegna il messaggio e lo invier&agrave; alla cartella di posta locale corretta.

Passiamo ora alla configurazione di curier per la gestione degli utenti virtuali e la connessione di un quasiasi client.
Come prima operazione andiamo a modificare i seguenti file 
**/etc/courier/authmodulelist**
~~~language-php
authmysql
authdaemon
~~~

**/etc/courier/authdaemonrc**
~~~language-php
authmodulelist="authmysql"
daemons=5
version="authdaemond.mysql"
authdaemonvar=/var/run/courier/authdaemon
~~~

**/etc/courier/authmysqlrc**
~~~language-php
MYSQL_SERVER            127.0.0.1
MYSQL_USERNAME          mail
MYSQL_PASSWORD          apassword
MYSQL_PORT              0
MYSQL_OPT               0
MYSQL_DATABASE          maildb
MYSQL_USER_TABLE        users
MYSQL_CLEAR_PWFIELD     clear
MYSQL_UID_FIELD         uid
MYSQL_GID_FIELD         gid
MYSQL_LOGIN_FIELD       id
MYSQL_HOME_FIELD        home
MYSQL_NAME_FIELD        name
MYSQL_MAILDIR_FIELD     concat(home,'/',maildir)
MYSQL_WHERE_CLAUSE      enabled=1
~~~

NB: Fate attenzione a non lasciare nessuno spazio nel file (ne al'linizio, ne alla fine ne in mezzo) e separate i dati solo tramite delle tabulazioni.
Ovviamente modificate la password di accesso al database. A questo punto andate a riavviare i vari server:
~~~language-php
sudo /etc/init.d/courier-imap restart
sudo /etc/init.d/courier-pop restart
sudo /etc/init.d/courier-authdaemon restart
~~~

Testiamo l'autenticazione tramite protocollo POP3 tramite telnet:
~~~language-php

telnet localhost pop3
~~~

e nella console che appare:
~~~language-php
USER marco@mavimo.org
PASS bpassword
LIST
QUIT
~~~

allo stesso modo possimo procedere per controllare che funzioni l'autenticazione tramite IMAP4
~~~language-php

telnet localhost imap
~~~

e nella console che appare:
~~~language-php
AB LOGIN "marco@mavimo.org" "bpassword"
BC SELECT "Inbox"
ZZZZ LOGOUT
~~~

In ogni caso, a seguito di ogni nostro comando dovremmo ricevere la risposta del nostro server.

Possiamo ora procedere alla configurazione dei vari client di posta per la ricezione di messaggi e l'invio dei messaggi al'interno della rete locale.
Non &egrave; stato reso disponibile (per ora) l'invio di mail all'esterno della nostra rete, operazione possibile impostando il _relay_host_ per il nostro postfix, infati non avendo a disposizione indirizzi IP fissi non &eacute; consigliato utilizzarlo come server smtp per l'invio direto di mail.

Proseguiamo la configurazione configurando la webmail ad utilizzo interno. Iniziamo a decomprimere il file compresso che &egrave; possibile trovare nella sezione download del sito di <a href="http://roundcube.net">Roundcube</a> e a copiare i file nella cartella /var/www/roundcube

~~~language-php
wg&#101;t http://switch.dl.sourceforge.net/sourceforge/roundcubemail/roundcubemail-0.1beta2.1.tar.gz
taz xzf roundcubemail-0.1beta2.tar.gz
sudo cp -r roundcubemail-0.1beta2 /var/www/roundcube
~~~

Realiziamo ora il database per la gestione della webamil
~~~language-php

mysql -u root -p create roundcubemail
~~~


E inseriamo:

~~~language-php

GRANT ALL PRIVILEGES ON roundcubemail.* TO roundcube@localhost IDENTIFIED BY 'password';
EXIT;
~~~


A questo punto creiamo la struttura del database:

~~~language-php

mysql -u roundcube -p roundcubemail < /var/www/roundcubeSQL/mysql5.initial.sql
~~~

E ora impostiamo i parametri di configurazione:
~~~language-php
sudo mv /var/www/roundcube/config/db.inc.php.dist /var/www/roundcube/config/db.inc.php
sudo mv /var/www/roundcube/config/main.inc.php.dist /var/www/roundcube/config/main.inc.php
~~~


E impostimo i parametri corretti per il file _/var/www/roundcube/config/db.inc.php_, in particolare per la riga:
~~~language-php

$rcmail_config['db_dsnw'] = 'mysql://roundcube:rpassword@localhost/roundcubemail';
~~~

Salviamo e andiamo a impostare i parametri corretti del file _/var/www/roundcube/config/main.inc.php_ e in particolare:
~~~language-php

$rcmail_config['default_host'] = 'localhost';
~~~

Dopo aver salvato il il file con le modifiche effettuate possiamo visualizzare la webmail collegandoci all'indirizzo http://nome_web_server/roundcube per esempio http://localhost/roundcube e autenticandosi inserendo i propri parametri &egrave; possibile accedere alla webmail (NB: per l'autenticazione inserire il nome utente completo di domino, per esempio _marco@mavimo.org_).

Sicuramente questa guida non &egrave; completa e omette alcuni configurazioni indispensabili dal punto di vista della sicurezza (per esempio autenticazione SASL per l'invio di messaggi o i meccanismi TSL), ma &egrave; una semplice guida introduttiva.