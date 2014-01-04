---
title: Drupal e image optimizer
categories: [Drupal]
tags: [front end, imageapi_optimize, immagini, ottimizzazione]
---
Se vi capita di utilizzare YSlow o PageSpeed per analizzare le performance del vostro front end, può capitare di vedere una voce che vi indica che le vostre immagini non sono ottimizzate. Cosa vuol dire, ma sopratutto, come possiamo ottimizzarle per ottenere dei risultati migliori? Questo è quello di cui parleremo ora, in particolare vedremo come integrare queste ottimizzazioni in Drupal.
<!--break-->
Con ottimizzazione delle immagini intendiamo la rimozione da queste di tutte quelle informazioni che non ne migliorano la qualità, aumentando esclusivamente il peso dell'immagine generata. Se vi capita di lavorare con immagini provenienti dall'editoria può capitare che alcune immagini, anche se di dimensioni ridicole (meno di un centinaio di pixel per lato) possano arrivare a pesare alcuni megabyte. Ovviamente questa è una cosa da correggere nel più breve tempo possibile.

I dati che possiamo trovare all'interno di queste informazioni inutili vanno dai metadati che specificano le dimensioni delle immagini, alle informazioni su canali alpha che non vengono utilizzate, ma anche informazioni relative a thumbnail che vengono integrate come informazioni aggiuntive. Vi sono diversi articoli in merito che illustrano come sia possibile andare ad ottimizzare delle immagini senza diminuirne la qualità, nel nostro caso non ci addentreremo in trattazioni accademiche, ma vediamo come utilizzare dei tool già pronti che si occupano proprio di effettuare l'ottimizzazione delle immagini.

Differenzieremo le immagini in PNG e JPG, in quanto le tecniche di ottimizzazioni sono differenti e dipendono proprio dal formato che queste immagini hanno.

<h2>Installazione dei tool</h2>
Partiamo con l'installazione dei tool necessari. Nel caso di distribuzioni linux basate su Debian è sufficiente procedere con:
~~~language-php

sudo apt-get install libjpeg-progs advancecomp optipng
~~~


per installare rispettivamente:

   * jpegtran
   * advpng e advdef
   * optipng

mentre l'installazione di jfifremove è leggermente più complessa e richiede la compilazione a partire dai sorgenti. Questi fanno uso solo delle libreire standard per l'IO pertanto non è necessario installare il compilatore sui server: è sufficiente compilarlo in locale e trasferire il binario in remoto. La procedura di compilazione è la seguente:
~~~language-php
wget http://lyncd.com/files/imgopt/jfifremove.c
gcc -o jfifremove jfifremove.c
sudo mv jfifremove /usr/bin/jfifremove
~~~

L'ultimo comando serve a posizionare il binario in un punto incluso nella variabile _$PATH_ in modo da poterlo richiamare direttamente.

<h2>L'utilizzo</h2>
Una volta effettuata l'installazione possiamo utilizzare i tool per l'ottimizzazione della PNG semplicemente lanciando i comandi:
~~~language-php
optipng -o3 /path/del/file.png
advpng -z -4 /path/del/file.png
advdef -z -4 /path/del/file.png
~~~


Per quanto riguarda i file JPEG possiamo utilizzare i tool appena installati ricorrendo a:
~~~language-php
jpegtran -optimize < /path/del/file/da/ottimizzare.jpg > /path/del/file/ottimizzato.jpg
jfifremove < /path/del/file/ottimizzato.jpg > /path/del/file/ottimizzato2.jpg
~~~


Questo ovviamente deve essere eseguito per ogni file che abbiamo all'interno del nostro sito.

<h2>Integrazione con Drupal</h2>
L'integrazione con Drupal è abbastanza semplice. È sufficiente installare il modulo <a href="http://drupal.org/project/imageapi_optimize">imageapi_optimize</a>. Una volta installato e attivato il modulo, procediamo in _Admin_ &raquo; _Settings_ &raquo; _ImageAPI_, impostiamo come elaboratore di immagini ImageAPI Optimize e quindi andiamo nella scheda _Settings_. A questo punto scegliamo a quale elaboratore far effettuare la conversione delle immagini vera e propria; io vi consiglio caldamente imagemagick per la qualità superiore, ma alcune impostazione di imagecache non funzioneranno, pertanto dovrete scegliere in base alle vostre esigenze.

Una volta attivato e configurato il modulo, procedete indicando i path in cui si trovano gli eseguibili precedentemente installati (dovrebbe essere **/usr/bin/NOME_TOOL**) e d'ora in poi le immagini generate risulteranno essere ottimizzate.