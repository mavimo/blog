---
title: Coding Drupal con Gedit, ancora Snippet
categories: [drupal]
tags: [autocomplete, funzioni, gedit, linux, mimetypes, snippet, sviluppo]
redirect: [drupal/coding_drupal_gedit_ancora_snippet, node/63]
meta:
    description: Dopo la pubblicazione del precedente articolo sull'<a href="/drupal/autocompletamento_drupal_gedit">autocompletamento in gedit</a>, grazie ai consigli ricevuti da numerose parti, ho portato avanti alcune correzioni e ampliamenti delle funzionalità di autocompletamento, e sopratutto ho creato un nuovo tipo di liguaggio di scripting definito in gedit, in modo da non mischiare queste impostazioni con quelle predefinite di PHP come era precedentemente.
    tags: [drupal, autocomplete, funzioni, gedit, linux, mimetypes, snippet, sviluppo]
---
Dopo la pubblicazione del precedente articolo sull'<a href="/drupal/autocompletamento_drupal_gedit">autocompletamento in gedit</a>, grazie ai consigli ricevuti da numerose parti, ho portato avanti alcune correzioni e ampliamenti delle funzionalità di autocompletamento, e sopratutto ho creato un nuovo tipo di liguaggio di scripting definito in gedit, in modo da non mischiare queste impostazioni con quelle predefinite di PHP come era precedentemente.
<!--break-->
Iniziamo ad aggiungere il nuovo linguaggio di scripting, scaricando il file allegato al termine di questo articolo e inserendolo all'interno della cartella _/usr/share/gtksourceview-2.0/language-specs_ dove sono definiti i diversi linguaggi definiti in gnome, quindi:
~~~language-php
wget http://mavimo.org/files/drupal.lang_.tar_.gz
tar -xzf drupal.lang_.tar_.gz
sudo cp drupal.lang /usr/share/gtksourceview-2.0/language-specs/drupal.lang
~~~

a questo punto aprendo gedit dovrebbe comparire, nel menu _View_, _Highlight mode_, _Scripts_ la nuova voce **Drupal**. Controllate che questo sia presente, dopo di che importate i pacchetti sotto indicati riguardanti le parti che vi interessano come autocompletamento.

Sul come installare gli snippet sotto riportati vi rimando all'<a href="/drupal/autocompletamento_drupal_gedit">articolo precedente</a>. I pacchetti sono così suddivisi:
<dl>
<dt>**db**</dt>
<dd>Le principali funzioni necessarie ad interagire con il database</dd>
<dt>**file**</dt>
<dd>Le principali funzioni necessarie per l'elaborazioni dei file</dd>
<dt>**hook**</dt>
<dd>I principali hook, a differenza delle versioni precedenti il nome dell'hook viene completato automaticamente prelevando il nome del modulo dal nome del file, rendendo il tutto ancora più veloce. Per questa funzionalità devo ringraziare <a href="http://www.icecrew.nl/~jesse/">Jesse Van Den Kieboom</a> del canale IRC #gedit per l'aiuto.</dd>
<dt>**fapi**</dt>
<dd>le FAPI necessarie alla realizzazione dei form, rispetto ala versione precedente sono stati corretti alcuni errori ed è stata migliorata l'indentazione del codice, per rispettare meglio i <a href="http://drupal.org/coding-standards">coding standard</a>.</dd>
<dt>**php_coding_standard**</dt>
<dd>Gli snippet di codice PHP sono stati risistemati per rispettare meglio i coding standard, in modo da validare più velocemente i propri moduli (per vedere come fare leggete <a href="/drupal/controllo_codice_drupal_gedit">Controllo del codice di Drupal (anche in gedit)</a>, oltre ad aver aggiunto funzionalità per l'inserimento di funzioni "private" all'interno dei moduli con creazione della prefazione per la documentazione in maniera automatica.</a></dd>
<dt>**varie**</dt>
<dd>Tutta la serie di funzioni che permettono di creare l'intestazione del modulo, del file d'installazione, oltre ad alcune funzioni comunemente usate quali **l**, **t**, **watchdog**, giusto per citarne alcune.</dd>
<dt>**drupal**</dt>
<dd>Elenco di funzioni di uso comune quali **drupal_add_js** (nelle sue varianti _setting_, _module_, _inline_), **drupal_add_css**, **drupal_set_message**</dd>
<dt>**completo**</dt>
<dd>Ebbene si, anche il pachetto che contiene tutti questi snippet, ed è quello che vi consiglio di utilizzare, salvo esigenze particolari.</dd>
</dl>

Se trovate errori, ovviamente, vi pregherei di segnalarmeli per permettermi di correggerli, così come se avete aggiunto altri elementi o se volete che ve ne aggiunga altri particolarmente utili.
