---
title: SASS per i CSS (2)
categories: [varie]
tags: [css, ruby, sass, ubuntu]
redirect: [varie/sass_css_2, node/84]
meta:
    description: Come indicato nell'articolo precedente abbiamo visto la comodità di usare un metalinguaggio per i <a href="/varie/sass_css_1">CSS come SASS</a>. Ovviamente i browser non sono in grado di utilizzare direttamente questi file, ma necessitano di ricevere del codice CSS standard.
    tags: [varie, css, ruby, sass, ubuntu]
---
Come indicato nell'articolo precedente abbiamo visto la comodità di usare un metalinguaggio per i <a href="/varie/sass_css_1">CSS come SASS</a>. Ovviamente i browser non sono in grado di utilizzare direttamente questi file, ma necessitano di ricevere del codice CSS standard.

Questa operazione (NdA:la conversione da SASS a CSS) viene effettuata compilando i file SASS in modo da ottenre i CSS. Il fatto di dover compilare per ottenre dei CSS non deve affatto spaventarci, è un operazione che viene compiuta in automatico in maniera del tutto trasparente a chi scrive i file.

Vediamo ora come installare il tutto e automatizzare questo processo.
<!--break-->
Ci sono diversi compilatori per SASS, scritti in diversi linguaggi, da Python, a C#, a PHP, ma quello che questo caso conviene usare è ruby, in particolare utilizzeremo <a href="http://github.com/chriseppstein/compass">compass</a>.

Il vantaggio di usare questo strumento è l'estrema semplicità di installazione e configurazione, inoltre integra i principali framework CSS per la creazione di layout grid (<a href="http://www.blueprintcss.org/">blueprint</a>, <a href="http://960.gs/">960</a>, <a href="http://developer.yahoo.com/yui/grids/">YUI</a>, ....).

Il processo di installazione, testato su <a href="http://www.ubuntu.com">ubuntu</a> 9.04, è automatico e richiede pochissimi passaggi:
~~~language-php

sudo apt-get install ruby1.8 rubygems
gem sources --add http://gems.github.com/
sudo gem install chriseppstein-compass
~~~


A questo punto non dobbiamo fare altro che creare un nuovo progetto. Un progetto non è altro che una cartella con una serie di file e informazioni di configurazione. Per fare questo basta andare nella cartella in cui si vuole creare progetto e dare il comando:
~~~language-php

/var/lib/gems/1.8/bin/compass PROVASASS
~~~

a questo punto ci troveremo davanti ad una cartella con la seguente struttura:
~~~language-php

PROVASASS
 |- images
 |   |- *.png
 |   |- ...
 |   `- *.jpeg
 |
 |- src
 |   |- *.sass
 |   |- ...
 |   `- *.sass
 |
 |- stylesheet
 |   |- *.css
 |   |- ...
 |   `- *.css
 |
 `-config.rb

~~~

A questo punto potremmo creare e modificare tutti i file SASS che vogliamo nella directory _src_ e procedendo coon la compialzione questi verranno trasformati nei corrispettivi CSS.

Nel caso volessimo utilizzare un framwork css grid possiamo all'interno del nostro progetto, usando per esempio blueprint, dare il comando:
~~~language-php

/var/lib/gems/1.8/bin/compass -f blueprint PROVASASS
~~~

ed automaticamente verranno inclusi i file necessari:
~~~language-php
PROVASASS
 |- images
 |   `- grid.png
 |
 |- src
 |   |- home.sass
 |   |- ie.sass
 |   |- print.sass
 |   `- screen.sass
 |
 |- stylesheet
 |   |- home.css
 |   |- ie.css
 |   |- print.css
 |   `- screen.css
 |
 `-config.rb
~~~


All'interno del progetto troviamo un file, il _config.rb_ che indica i parametri per configurare ulteriormente il nostro compilatore indicando le cartelle da utilizzare, o i parametri di compilazione; è sufficiente editare il questo file, dove si trovano i diversi parametri, per gestire come verranno compilati i files:
<dl>
  <dt>project_type</dt>
    <dd>Il tipo di progetto realizzato.</dd>
  <dt>css_dir</dt>
    <dd>Il nome della cartella in cui verranno inseriti i CSS dopo la compilazione.</dd>
  <dt>sass_dir</dt>
    <dd>La cartella contenente i SASS da compilare</dd>
  <dt>images_dir</dt>
    <dd>La cartella dove si trovano i file immagine indicati all'interno dei file SASS</dd>
  <dt>output_style</dt>
    <dd>Il tipo di output che si vuole avere nel file CSS. In maniera predefinita è impostato su _:compress_ che indica che i CSS verranno compressi, oppure è possibile andare a renderli espansi, rendendo più semplice la lettura. in ogni caso consiglio di generare i CSS compressi per la messa in produzione.</dd>
  <dt>http_images_path</dt>
    <dd>Il percorso in cui si trovano le immagini una volta messo in produzione i CSS.</dd>
</dl>

Per rendere automatica la ricompliazione dei file lanciamo il comando:
~~~language-php

/var/lib/gems/1.8/bin/compass --watch PROVASASS
~~~

In questo modo ad ogni modifica dei file *.sass verranno automaticamente ricompilati e otterremmo i CSS finali, pronti da essere inclusi o, se sono direttamente inclusi nelle pagine, utilizzati.
