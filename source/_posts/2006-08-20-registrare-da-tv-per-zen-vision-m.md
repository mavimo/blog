---
title: Registrare da TV per Zen Vision:M
categories: [linux]
tags: [mencoder, mplayer, mtp, saa7134, zen vision:m]
redirect: [linux/registrare_tv_mplayer, node/5]
meta:
    description: Ultimamente, avendo una scheda di acquisizione video sul PC (Empire Enjoy TV), volevo registrare alcuni programmi da trasferire sul <a href="/zen_vision_m">Zen Vision:M</a> e da vedere in un secondo momento. Purtroppo il software fornito in dotazione alla scheda (ovviamente solo per Windows) fa abbastanza schifo e sul mio PC (AMD 1700+ con 760MB di ram) registra un gran male, quindi ho provato a registrare utilizzando <strong>mencoder</strong> su linux.
    tags: [linux, mencoder, mplayer, mtp, saa7134, zen vision:m]
---
Ultimamente, avendo una scheda di acquisizione video sul PC (Empire Enjoy TV), volevo registrare alcuni programmi da trasferire sul <a href="/zen_vision_m">Zen Vision:M</a> e da vedere in un secondo momento. Purtroppo il software fornito in dotazione alla scheda (ovviamente solo per Windows) fa abbastanza schifo e sul mio PC (AMD 1700+ con 760MB di ram) registra un gran male, quindi ho provato a registrare utilizzando **mencoder** su linux.<!--break-->
La prima operazione da fare sar&agrave; qualla di configurare <a href="http://mplayerhq.hu/">mplayer</a> per vedere le trasmissioni televisive sul monitor del PC.
Per una configurazione dettagliata rimando alle complete pagine di man del programma, per ora noi ci accontenteremo di una configurazione di base, ovvero andremo ad inserire nel file _∼/.mplayer/config_ le seguenti opzioni:
~~~language-php

tv=driver=v4l2:input=0:width=640:height=480:device=/dev/video0:audiorate=48000:amode=1:channels="20-Rai_Uno,23-Rai_Due,35-Rai_Tre,45-Rete_4,56-Canale_5,49-Italia_1,41-La_7,66-MTv,62-FLUX":chanlist=italy

~~~

ATTENZIONE: tutto sulla stessa riga!
ovviamente la lista dei canali potr&agrave; essere ampliata a piacere (e sopratutto in base alla capacit&agrave; ricettiva della propria antenna). I canali delle e varie reti TV potrebbero essere differenti; per trovarli potrete affidarvi a vostro televisore di casa, oppure a _tvtime-scan_ (che fa parte del pacchetto tv-time che approfondiremo prossimamente). I parametri _width_ e _height_ sono stati scielti per consentire una buona visione sul dispositivo portatile, ovviamente possiamo aumentarli o diminuirli a piacere, attenzione soltanto ce il vostro processore riesca a codificare ad una velocit&agrave; sufficiente d non perdere fotogrammi.
Una volta impostate le opzioni principali sopra riportate da linea di comando provate a lanciare:
~~~language-php
mplayer tv://1
~~~

e vedete se l'output &egrave; ci&ograve; che vi aspettate, ovvero la trasmissione TV impostata sul canale 1 (per me &egrave; Rai Uno).
A questo punto configureremo mencoder per poter registrare da questi canali. Aprite con il vostro editor preferito il file _∼/.mplayer/mencoder_ (se non &egrave; gi&agrave; presente createlo) e inseritevi le seguenti linee:
~~~language-php
  # Nome di default del file prodotto, &egrave; possibile modificarlo da linea di comando.
o=recorded.avi
# Codec audio utilizzato
oac=mp3lame=yes
# Codec video utilizzato
ovc=xvid=yes
# Impostazioni del codec video utilizzato
xvidencopts=bitrate=800
# Impostazioni TV (le potete copiare dal file ∼/.mplayer/config )
tv=driver=v4l2:input=0:width=320:height=240:device=/dev/video0:fps=25:audiorate=48000:amode=1:channels="20-Rai_Uno,23-Rai_Due,35-Rai_Tre,45-Rete_4,56-Canale_5,49-Italia_1,41-La_7,66-MTv,62-FLUX":chanlist=italy
~~~

A questo punto dovreste essere pronti per registrare la vostra trasmissione con il comando
~~~language-php
mencoder tv://6 -o registrazione.avi -endpos 0:1:30
~~~

Dove si &egrave; specificato di registrare il canale numero 6 (Italia 1), salvando il file con il nome _registrazione.avi_ e la durata della registrazione, nel nostro caso imposttata ad _0 ore, 1 minuto e 30 secondi_. Possiamo ora visionare il file con un quasiasi riproduttore multimediale installato.
Possimo anche controllare che il file prodotto si conforme alle specifiche richieste dallo ZV:M con il comando
~~~language-php
file registrazione.avi
~~~

che dovrebbe fornire un'outpt simile a:
~~~language-php
registrazione.avi: RIFF (little-endian) data, AVI, 320 x 240, 25.00 fps, video: XviD, audio: MPEG-1 Layer 3 (mono, 44100 Hz)
~~~

Ora che abbiamo realizzato il nostro videoregistratore vediamo come trasferire i file sullo ZV:M.
