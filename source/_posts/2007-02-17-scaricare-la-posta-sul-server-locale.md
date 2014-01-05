---
title: Scaricare la posta sul server locale
categories: [linux]
tags: [email, fetchmail, mail, postfix]
redirect: [linux/configurare_fetchmail, node/30]
meta:
    description: Con la <a href="/postfix_ubuntu_vistual">prima guida</a> abbiamo visto come andare a configurare postfix per aver una serie di utenti di posta che possono inviare e ricevere la posta al loro interno, o nel caso si disponga di un IP statico anche a caselle di posta non appartenenti ai nostri domini. Purtroppo se non abbiamo un indirizzo IP statico, ma un indirizzo dinamico, come avviene per la quasi totalità di utenze domestiche o aziendali di tipo low-level non possiamo utilizzare il nostro server per inoltrare direttamente le e-mail all'esterno, poiché i server di posta dei destinatari verificando che il nostro non è un indirizzo statico considereranno il nostro server come fonte di SPAM e quindi quasi certamente la nostra mail verrà rifiutata, quando non direttamente cancellata.
    tags: [linux, email, fetchmail, mail, postfix]
---
Con la <a href="/postfix_ubuntu_vistual">prima guida</a> abbiamo visto come andare a configurare postfix per aver una serie di utenti di posta che possono inviare e ricevere la posta al loro interno, o nel caso si disponga di un IP statico anche a caselle di posta non appartenenti ai nostri domini. Purtroppo se non abbiamo un indirizzo IP statico, ma un indirizzo dinamico, come avviene per la quasi totalità di utenze domestiche o aziendali di tipo low-level non possiamo utilizzare il nostro server per inoltrare direttamente le e-mail all'esterno, poiché i server di posta dei destinatari verificando che il nostro non è un indirizzo statico considereranno il nostro server come fonte di SPAM e quindi quasi certamente la nostra mail verrà rifiutata, quando non direttamente cancellata.
<!--break-->
Se anche non possediamo un indirizzo statico non dobbiamo demordere, potremmo utilizzare il server SMTP di colui che ci offre il collegamento per inviare i nostri messaggi di posta, oppure uno dei server SMTP presso cui possiamo autenticarci, anche se spesso questi non ci permettono di inviare messaggi con mittente differente da quello con cui ci siamo loggati.
Come prima cosa andiamo ad inserire nel file _/etc/postfix/main.cf_ le seguenti righe di codice:
~~~language-php
relayhost = [smtp.serveresterno.it]
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options =
~~~

Andando a modificare _smtp.serveresterno.it_ con l'indirizzo del server SMTP che utilizzeremo per inviare i messaggi di posta. Poiché i server richiedono autorizzazione per inviare il messaggio di posta dovremmo anche creare un file che chiameremo _sasl_passwd_ in cui andare a memorizzare le password di accesso al server esterno, diamo quindi il comando:
~~~language-php

sudo gedit /etc/postfix/sasl_passwd
~~~

e andiamo ad inserire:
~~~language-php

[smtp.serveresterno.it] nomeutente@serveresterno.it:password
~~~

In cui dovremmo andare ad impostare:

 * **smtp.serveresterno.it**: Il server SMTP presso cui dobbiamo autenticarci
 * **nomeutente@serveresterno.it**: l'username che dobbiamo utilizzare per autenticarci
 * **password**: la password per l'autenticazione

Fatto questo dobbiamo eseguire il comando:
~~~language-php

sudo postmap /etc/postfx/sasl_passwd
~~~

che trasforma il file in un formato leggibile da postfix. Al termine ricordiamoci di impostare i corretti permessi sul file contenenti le password per evitare che siano leggibili anche da altri utenti:
~~~language-php

sudo chmod go-rwx /etc/postfix/sasl_passwd
~~~

e completiamo l'opera riavviando postfix:
~~~language-php

sudo /etc/init.d/postfix restart
~~~

A questo punto tutti i messaggi che non appartengono alle nostre utenze verranno inviati al server esterno che si occuperà di inviarle agli opportuni destinatari.
Ora che ci siamo occupati di inviare le e-mail agli utenti esterni vediamo come caricare in locale le e-mail presenti nei vari account sparsi in rete.
Come prima cosa dovremmo andare ad installare fetchmail, quindi iniziamo dando:
~~~language-php

sudo apt-get install fetchmail
~~~

A questo punto iniziamo a configurare il programma per scaricare le e-mail sul nostro server locale. Iniziamo editando il file _/etc/fetchmailrc_ inseredo, per ogni account che abbiamo e che vogliamo andare ad elaborare le  seguenti linee:
~~~language-php
poll imap.serveresterno.it with proto imap
user NOMEUTENTE@SERVERESTERNO.IT there fetchall with password PASSWORDESTERNA is nomeutente@serverlocale.it here
~~~

dove, ovviamente, si andranno a editeare i seguenti paramentri:

 * **imap.serveresterno.it**: indirizzo del server pop3 o imap4 da cui prelevare le e-mail
 * **imap**: il protocollo utilizzato per scaricare le e-mail (può essere _imap_ o _pop3_)
 * **nomeutente@serveresterno.it**: l'username dell'utente presso il server esterno
 * **passwordesterna**: la password usata per autenticarsi sull'account remoto
 * **nomeutente@serverlocale.it**: la casella di posta locale a cui inviare l'e-mail ricevuta.

Completato il file assegniamogli i permessi corretti:
~~~language-php

chmod 554 /etc/fetchmailrc
~~~

e ora lanciamo il comando per il download delle e-mail:
~~~language-php

fetchamail -f /etc/fetchmailrc
~~~

A questo punto dovrebe iniziare il download dei messaggi presenti sui server remoti per poter essere caricati sul server locale e quindi accessibili ai rispettivi utenti. Poiché fetchmail deve essere avviato ogni volta per poter scaricare i messaggi dal server remoto possiamo schedulare l'esecuzione dell'attività o possiamo avviare fetchmail come demone in modo che il controllo dei nuovi messaggi venga effettualo ad intervalli regolari.
Iniziamo inserendo all'inizio del file _/etc/fetchmailrc_ le seguenti line di codice:
~~~language-php

set daemon 180
~~~

che indica che il programma dovrà essere avviato come demone e eseguirà la scansione ogni 180secondi (ovvero ogni tre minuti, poete modificare a piacere l'intervallo).
~~~language-php
set syslog
defaults
~~~

Che dice di usare _syslog_ per segnalare errori e un livello standard di verbosità per i debug.
Relizziamo ora lo script per l'avvio del programma come demone di ditema per i runlivel 3 e 5
~~~language-php
#!/bin/sh
### BEGIN INIT INFO
# Provides: fetchmail
# Required-Start: network
# Required-Stop:
# Default-Start: 3 5
# Default-Stop:
# Description: fetchmail daemon
### END INIT INFO
# Check for missing binaries (stale symlinks should not happen)
FETCH_BIN=/usr/bin/fetchmail
test -x $FETCH_BIN || exit 5
# Check for existence of needed config file and read it
FETCH_SYSCONFIG=/etc/fetchmailrc
test -r $FETCH_SYSCONFIG || exit 6
# Shell functions sourced from /etc/rc.status:
# rc_check check and set local and overall rc status
# rc_status check and set local and overall rc status
# rc_status -v ditto but be verbose in local rc status
# rc_status -v -r ditto and clear the local rc status
# rc_status -s display "skipped" and exit with status 3
# rc_status -u display "unused" and exit with status 3
# rc_failed set local and overall rc status to failed
# rc_failed <num> set local and overall rc status to <num>
# rc_reset clear local rc status (overall remains)
# rc_exit exit appropriate to overall rc status
# rc_active checks whether a service is activated by symlinks
# rc_splash arg sets the boot splash screen to arg (if active)
. /etc/rc.status
# First reset status of this service
rc_reset
# Note that starting an already running service, stopping
# or restarting a not-running service as well as the restart
# with force-reload (in case signaling is not supported) are
# considered a success.
case "$1" in
    start)
        echo -n "Starting fetchmail"
        startproc $FETCH_BIN -f $FETCH_SYSCONFIG
        rc_status -v
    ;;
    stop)
        echo -n "Shutting down fetchmail "
        $FETCH_BIN --quit 2>/dev/null
        if [ $? -ne 0 ] then
            echo -e" I have to kill it or it was not working"
            killproc -TERM $FETCH_BIN
        fi
        rc_status -v
        ;;
    try-restart)
        $0 status >/dev/null && $0 restart
        rc_status
        ;;
    restart)
        $0 stop
        $0 start
        rc_status
        ;;
    force-reload)
        echo -n "Force reload fetchmail"
        $0 stop && $0 start
        rc_status
        ;;
    reload)
        echo -n "Reload fetchmail"
        rc_failed 3
        rc_status -v
        ;;
    status)
        echo -n "Checking fetchmail"
        checkproc $FETCH_BIN
        rc_status -v
        ;;
    *)
        echo "Usage: $0 {start|stop|status|try-restart|restart|force-reload|reload}"
        exit 1
        ;;
esac
rc_exit
~~~

che dovremmo salvare nel file _/etc/init.d/fetchmail_, mentre per automatizzare l'avvio per i runlivel 3 e 5 dovremmo realizzare i link simboloci a questo, quindi:
~~~language-php
ln -s /etc/init.d/fetchmail /etc/rc3.d/S99fetcmail
ln -s /etc/init.d/fetchmail /etc/rc5.d/S99fetcmail
~~~

e ora occupiamoci di lanciarlo con il comando:
~~~language-php

sudo /etc/init.d/fetchmail
~~~

Se tutto funziona a dovere ci troveremmo le nostre e-mail sempre sul server locale pronte per poter essere lette dai vari client che si collegano ad esso. Se possibile leggete le mail tramite IMAP in modo da lasciarne una copia sul mailserver locale per poter effettuare le copie di back-up di tutti i messaggi.
