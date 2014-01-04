---
title: Trasferire un file sullo Zen Vision:M
categories: [Linux]
tags: [libmtp, MTP, Zen Vision:M]
---
**EDIT: questa guida la potete trovare in una versione pi&ugrave; aggiornata <a href="/linux_dispositivi_mtp">qui</a>.**
Fino ad ora ci siamo limitati a registrare trasmissioni televisive da poter vedere in giro, ma come facciamo a inviarle allo <a href="/zen_vision_m">Zen Vision:M</a> senza dover passare a Windows? La risposta &egrave; semplice, sono necessarie le libmtp! <!--break-->
Innanzitutto sar&agrave; necessario installare la libreria libmtp, portroppo essendo in beta non esiste pacchettizzata per nessuna distribuzione, quindi va compilato dai <a href="http://libmtp.sourceforge.org">sorgenti</a>. Una volta effettuata questa operazione provate a collegare lo ZV:M alla porta USB del PC e lanciate il comando:
~~~language-php
sudo mtp-detect
~~~

Se tutto va bene dovreste ottenere:
~~~language-php
Autodetected device "Creative Zen Vision:M" (VID=041e,PID=413e) is known.
PTP: Opening session
Connected to MTP device.
~~~

seguito da una serie di altre informazioni.
Attenzione, i comandi indicati di seguito variano in funzione della versione della libreria che state utilizzando.
Ora invieremo il file della registrazione effettuato precedentemente al device tramite il comando
~~~language-php
sudo mtp-sendfile -t avi registrazione.avi -f "TV"
~~~

In cui abbiamo detto di inviare il file di tipo _avi_, chiamato _registrazione.avi_, nella cartella TV della sezione video del player. Ora se proprio volete divertirvi sbizzarritevi a creare gli script che ritenete necessari e eventualmente ad inserire in cron le operazioni necessarie a registrare le trasmissioni preferite quando non siete a casa; l'unica cosa fate attenzione ad avere altri programmi che richiedano un'elevato utilzzo della CPU, inquanto l'operazione di encoding &egrave; abbastanza esigente. Sul mio PC AMD 1700+ con 775980kb di RAM l0utilzzo va al 95% e riesce a malapena a starci dietro quando uso altri software (browser per esempio).
Se il file che volete trasferire non &egrave; stato registrato direttamente da mplayer, o &egrave; in un formato che il lettore non supporta (per esempio filmati Quick Time o FLV) dovete provvedere alla conversione PRIMA di trasferirlo; l'operazione &egrave; banale e pu&ograve; essere effettuata tramite il comando:
~~~language-php
mencoder file1.avi -o test1.avi -vf scale=320:240 -oac mp3lame -ovc xvid --xvidencopts bitrate=800
~~~

In cui indicate di produrre un file video XviD usando i codec lame e con un bitrare di 800kbyte/s. La risoluzione scielta &egrave; quella dello schermo del lettore, se volete vedere il filmato sulla TV tramite l'apposito cavo potrebbe risultare troppo bassa, quindi potete tranquillamente aumentarla.