---
title: Fail2Ban per proteggere i server
categories: [Linux]
tags: [fail2ban, protezione, server]
---
Ebbene sì, capita... non sono un sistemista, ma capita di dover mettere on-line dei server, un server on-line dopo pochi giorni di presenza on-line, e senza ancora essere stato pubblicato (in pratica era una macchina fantasma) inizia a subire attacchi.

Boot sparsi in giro per la rete scansionano le diverse porte dei server e tentano di accedervi inviando continue richieste di accesso (FTP, SSH, ...), queste richieste vengono normalmente respinte, ma provocano una serie enorme di dati di log come accessi falliti. Per evitare questo è possibile installare sulla macchina in rete un software che si occupa di bloccare determinati indirizzi IP dopo che sono stati riscontrati più tentativi di accesso falliti. Vediamo come installare e configurare uno si questi applicativi per l'esattezza <a href="http://www.fail2ban.org/">fail2ban</a>.
<!--break-->
Questo programma è uno script che scansiona i file di log che contengono i tentativi di accesso e nel caso in cui riscontri più di un determinato numero di tentativi falliti -in un certo intervallo di tempo- passa la palla a iptables che blocca l'IP che sta tentando l'accesso; l'IP viene bannato per un determinato intervallo di tempo (anche questo configurabile).

Per installare l'applicativo è sufficiente, sulla maggior parte dei server, scaricarlo attraverso il sistema di distribuzione dei pacchetti. Su macchine Ubuntu e Debian è sufficiente dare:
~~~language-php

sudo apt-get install fail2ban
~~~

e confermare l'installazione. Al termine dobbiamo andare a indicare la configurazione che vogliamo impostare.

I file di configurazione si trovano all'interno di _/etc/fail2ban_, in particolare troviamo il file _jail.conf_ che contiene le configurazioni di base, nel nostro caso andiamo a creare un nuovo file (come indicato anche dal manuale) che chiameremo _jail.local_ che andrà a sovrascrivere le configurazioni presenti nel file di configurazione.
~~~language-php

sudo nano /etc/jail.local
~~~

All'interno di questo file andremo ad impostare le regole di ban impostate per i diversi servizi. Ogni regola è indicata dal nome della regola scritta tra parentesi quadre a cui seguono i parametri che vogliamo impostare, seguiti da un uguale e successivamente dal valore della regola.

Inizialmente imposteremo dei parametri per le regole di default, quindi.
~~~language-php
[DEFAULT]
ignoreip = 127.0.0.1 192.168.0.10
bantime  = 600
maxretry = 3
backend = polling
destemail = root@localhost
action = iptables[name=%(__name__)s, port=%(port)s]
~~~

in questo caso stiamo dicendo di non considerare le richieste di autenticazione errate provenienti dall'IP locale (127.0.0.1) e da un IP statico presente nella rete (192.168.0.10), utile quando ci si collega al server da un IP statico. Questa regola è stata impostata ricorrendo al parametro **ignoreip**

Stiamo anche impostando il tempo di ban impostato per quell'IP a 600 second (10 minuti) tramite il parametro **bantime**, mentre il parametro **maxretry** indica il numero di tentativi errati da bloccare prima che venga bannato l'IP.
Proseguiamo vedendo quale è il meccanismo di backend usato dallo script, sui sistemi Debiane Ubuntu pare che l'unico veramente stabile sia polling, quindi ci affideremo a questo. **destmail** è abbastanza scontato ed indica a chi verranno recapitate le mail con le segnalazioni degli IP che vengono bloccati, mentre **action** è l'operazione che viene eseguita a seguito del tentativo di accesso, nello specifico il ban dell'IP indicato.

Oltre a questa regola principale viengono specificate le regole per i singoli servizi, quali SSH:
~~~language-php
[ssh]
enabled = true
port    = ssh
filter  = sshd
logpath  = /var/log/auth.log
maxretry = 5
~~~


Dove, ancora una volta i diversi parametri indicano:
<dl>
  <dt>enabled</dt><dd>Se la regola è attivata, ovviamente le regole verranno tenute attive, salvo alcuni momenti in cui verranno disabilitati manualmente, magari per dei test o dei controlli</dd>
  <dt>port</dt><dd>La porta che viene bloccata, è possibile indicare il servizio che gira sulla porta o il valore della porta numerico. In questo caso, volendo bloccare l'accesso a SSH possiamo indicare o il valore numerico (22) o _ssh_</dd>
  <dt>filter</dt><dd>Il filtro usato dallo script per identificare i tentativi di accesso, i diversi filtri 8delle espressioni regolari) si trovano nella directory _/etc/fail2ban/filter.d_, in questo caso usiamo il filtro indicato come sshd</dd>
  <dt>logpath</dt><dd>Ilpercorso del file che andiamo a tenere monitorato per determinare i tentativi di accesso.</dd>
  <dt>maxretry</dt><dd>Il numero di tentativi di accesso negato da trovare prima che venga bloccato l'IP che sta tentando l'accesso.</dd>
</dl>

Al termine dell'impostazione delle regole è necessario riavviare il demone, quindi da console diamo:
~~~language-php

sudo /etc/init.d/fail2ban restart
~~~

Che riavvia il demone rileggendo la configurazione, per controllare quali indirizzi sono bannati è sufficente dare il comando:
~~~language-php

sudo iptables -L
~~~

Che elencherà le regole di filtro impostate.

<h3>Alcune regole</h3>
Ovviamente oltra a questa regola andremo ad impostarne una per ogni servizio, di seguito sono riportate alcune regole che è possibile usare:
**Autenticazione di Apache**
~~~language-php
[apache]
enabled = true
port    = http
filter  = apache-auth
logpath = /var/log/apache*/*access.log
maxretry = 5
~~~


**FTP con vsftpd**
~~~language-php
[vsftpd]
enabled  = true
port     = ftp
filter   = vsftpd
logpath  = /var/log/auth.log
maxretry = 5
~~~


**FTP con proftpd**
~~~language-php
[proftpd]
enabled  = true
port     = ftp
filter   = proftpd
logpath  = /var/log/auth.log
failregex = proftpd: \(pam_unix\) authentication failure; .* rhost=<HOST>
maxretry = 5
~~~


**FTP con wuftpd**
~~~language-php
[wuftpd]
enabled  = true
port     = ftp
filter   = wuftpd
logpath  = /var/log/auth.log
maxretry = 5
~~~


**SMTP di postfix**
~~~language-php
[postfix]
enabled  = true
port     = smtp
filter   = postfix
logpath  = /var/log/mail.log
maxretry = 5
~~~


**POP3 con courier**
~~~language-php
[courierpop3]
enabled  = true
port     = pop3
filter   = courierlogin
failregex = courierpop3login: LOGIN FAILED.*ip=\[.*:<HOST>\]
logpath  = /var/log/mail.log
maxretry = 5
~~~


**IMAP4 con courier**
~~~language-php
[courierimap]
enabled  = true
port     = imap4
filter   = courierlogin
failregex = courierpop3login: LOGIN FAILED.*ip=\[.*:<HOST>\]
logpath  = /var/log/mail.log
maxretry = 5
~~~


<h3>Il principio di funzionamento</h3>
Questo script scansiona periodicamente i file di log andando a determinare i tentativi di accesso falliti sui log e nel caso in cui riscontri tentativi di accesso falliti blocca l'IP. Normalmente la scansione avviene ogni secondo, quindi all'interno di questo intervallo di tempo potrebbero essere effettuati più tentativi di accesso di quelli consentiti. Per esempio se in un secondo vengono tentati 10 tentativi di accesso su SSH, anche se il limite impostato dalle regole di filtro è di 3 tentativi prima di bannare, le dieci richieste d autenticazione verranno compiute.

Ancor più facilmente è facile rilevare un nummero di tentativi di accesso superiore a quelli indicati dalle regole a causa del fatto che i demoni di logging (syslog) tengono in cache i dati prima di scriverli sul file, quindi fino al momento in cui non vengono scritti su file fail2ban non è in grado di rilevare il tentativo di accesso e di conseguenza non può bloccare l'accesso; per questo motivo è consigliabile disabilitare il caching dei  demoni di log.