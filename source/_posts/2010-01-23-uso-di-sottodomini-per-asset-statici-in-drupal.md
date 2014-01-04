---
title: Uso di sottodomini per asset statici in Drupal
categories: [Drupal]
tags: [cdn, frontend, performance, subdomain]
---
La volta scorsa, nel parlare di <a href="/drupal/migliorare_performance_drupal">ottimizzazione del frontend</a> di siti generici (e <a href="http://mavimo.org/drupal">Drupal in particolare</a>) avevamo
affrontato alcune delle problematiche principali, tra cui appunto la generazione di sottodomini per lo smistamento degli asset statici [1], così da parallelizzare il più possibile il caricamento della pagina.

Ora vedremo come ottimizzare e mettere in pratica i suggerimenti che YSlow (ma anche PageSpeed) ci danno.

NOTA: con il nome di assett intendendo con questo nome quelle informazioni che non variano o variano molto poco nel corso del tempo e che consideriamo opportuno far gestire su sottodomini differenti per ottimizzare le performance del frontend per gli utenti finali (ed eventualmente per suddividere la gestione di questo tipo di dati ai server).
<!--break-->
Innanzitutto, andando a spulciare per bene all'interno dei suggerimento che i due strumenti prima indicati ci danno, vediamo che uno di quelli offerti è appunto la creazione di sottodomini per lo smistamento degli asset statici, questo può essere fatto comidamente andando a agire su tre elementi fondamentali:

   * CSS
   * JS
   * Immagini

I primi due possono essere spopstati su sottodomini differenti andando ad inserire un paio di semplici righe all'interno del file _template.php_ del nostro tema, nello specifico è necesario aggiungere:
<?php
/*
 * Implementation of template_preprocess_page().
 *
 * @param &$variables
 *   Array containing various page elements.
 */
function NOOMETEMA_preprocess_page(&$variables) {
  $static_assets_path = 'http://sottodominio.dominio.it';

  // Sostituisco negli style
  $variables['styles'] = str_replace(' href="/sites/', ' href="' . $static_assets_path . '/sites/');
  // Sostituisco nei JS
  $variables['scripts'] = str_replace(' src="/sites/', ' src="' .  $static_assets_path . '/sites/');
}
?>
mentre per le immagini la cosa è leggermente più complessa.

Potremmo effettuare, come nel caso dei CSS e JS, una ricerca e sostituzione nella pagina, ma non è la soluzione migliore e sopratutto più performante, dato che parsare con espressionii regolari il content della pagina  non è una buona soluzione, inoltre potremmo usare anche singoli campi e quindi a loro volta tutti questi dovrebbero essere parsati. 

Parto dal presupposto che stiamo facendo un uso intelligente degli strumenti che Drupal ci propone, quindi quasi sicuramente staremo usanndo imagecache per la generazioni delle immagini dei diversi formati, proprio per questo baseremo le nostre funzionalità sull'estensione di questo modulo che permette di andare a indicare il sottodominio da utilizzare per le immagini generate.

Per effettuare questa modifica dobbiamo patchare il modulo in questione (per lo meno fino a che non approveranno la <a href="http://drupal.org/node/693630">patch che ho inviato</a>). L'operazione è abbastanza semplice, una volta scaricato il file allegato lanciamo:
~~~language-php

patch -p0 < imagecache_ui.module.patch
patch -p0 < imagecache_ui.pages.inc.patch
patch -p0 < imagecache.module.patch
~~~

Fatta questa modifica, accedendo al nostro pannello di admin, come visibile qui sotto, potremmo settare i diversi sottodomini da utilizzare per lo smistamento
delle immagini; ovviamente vi consiglio di esagerare per non rendere vano il tutto a causa del delay nella risoluzione del dominio da parte dei DNS, per evitare questo attualmente ho limitato la gestione a tre sottodomini massimi, ma volendo è possibile incrementarla modificando il numero massimo di sottodomini gestibili modificando la dichiarazione della costante IMAGECACHE_MAX_SUBDOMAIN; sono indeciso se aggiungere questo dato come configurabile, cosa ne dite?

<img src="/files/post_drupal_frontend_performance_ui.jpg" alt="Interfaccia di configurazione dei sottodomini"/>

A questo punto le richieste degli asset statici verranno reindirizzate sui sottodomini indicati, ma purtroppo, se andiamo ad analizzare più a fondo vedremo anche che le richieste non sono cookieless, quindi le chiamate si moltiplicano, ciò ovviamente non va per nulla bene, quindi andiamo a settare il nostro **$cookie_domain**
nel _setting.php_. La cosa che ci verrebbe naturale impostare è _.www.miodominio.it_ in modo da non includere i diversi sottodomini. Purtroppo all'interno del file di boostrap di <a href="http://mavimo.org/drupal">Drupal</a>, il www iniziale viene rimosso, un semplice trucco è quello di andare a raddoppiarlo, quindi nel _settings.php_ avremo:
<?php
$cookies_domain = '.www.www.miodominio.it';
?> 
in questo modo il primo verrà rimosso, mentre il secondo resterà settato. Questo permetterà di non effettuare la chiamata degli assets passando anche i cookies e quindi generando chiamate inutili (che rallentano il caricamento dei contenuti).

Potete provare a lanciare il test (ovviamente dopo aver fatto puntare anche i DNS dei sottodomini e esservi assicurati che si siano propagati) usando alcuni tools come:

   * <a href="http://tools.pingdom.com/">Pingdom Tools</a>
   * <a href="http://www.webpagetest.org/">Webpage Test</a>
   * <a href="http://www.getfirebug.com/">FireBug</a>
   * <a href="http://code.google.com/speed/page-speed/">PageSpeed</a>
