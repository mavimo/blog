---
title: Creare preset per imagecache da codice
categories: [drupal]
tags: [imagecache, moduli, php, sviluppo]
redirect: [drupal/creare_preset_imagecache_codice, node/70]
meta:
    description: A chi capita di realizzare moduli o profili di installazione per Drupal può capitar di dover andare ad appoggiarsi ad altri moduli, uno di quelli che mi capita spesso di utilizzare è il moduli imagecache, utilissimo nella gestione delle immaginidata l'ampia possibilità che fornisce.
    tags: [drupal, imagecache, moduli, php, sviluppo]
---
A chi capita di realizzare moduli o profili di installazione per Drupal può capitar di dover andare ad appoggiarsi ad altri moduli, uno di quelli che mi capita spesso di utilizzare è il moduli imagecache, utilissimo nella gestione delle immaginidata l'ampia possibilità che fornisce.

Fortunatamente mette a disposizione una interfaccia utente (Imagecache UI) ottima che permette di creare dei preset (delle impostazione di visualizzazione delle immagini) in pochi passaggi ed in un modo pulito, ma nel caso in cui questi preset debbano essere creati da un modulo o da un profilo di installazione? Vediamo come crearli da codice.
<!--break-->
Innanzitutto nel nostro modulo (o nel nostro profilo) dobbiamo andare ad inserire il codice che permette di creare il preset, per fare questo aggiungiamo il seguente codice:
<?php
$preset = imagecache_preset_save(array('presetname' => 'gallery_thumbnail'));
?>
dove si deve impostare il nome del preset che si sta generando. Una volta creato il preset, il passaggio successivo è l'aggiunta delle diverse action al preset, per fare questo è sufficiente inserire:
<?php
$action->presetid = $preset['presetid'];
$action->module = 'imagecache';
$action->action = 'imagecache_scale_and_crop';
$action->data = array( 'width' => '120', 'height' => '120' );
drupal_write_record('imagecache_action', $action);
?>
dove ovviamente il preset è quello generato precedentemente.

In questo caso abbiamo aggiunto un action di tipo _imagecache_scale_and_crop_ ed abbiamo impostato le sue dimensioni a 120x120px, ma questa è solo una delle possibilità che abbiamo; vediamo ora quali sono le actions che possiamo aggiungere al preset.

<h3>Modulo action color</h3>
**Alpha Transparency**: permette di modificare il colore di sfondo da usare come canale alpha e permette di impostare il colore di sfondo per rimuovere le trasparenze.
<?php
$action->module = 'imagecache_coloractions';
$action->action = 'imagecache_alpha';
$action->data = array(
  'color' => '#000000',
  'flatten' => '120',
);
?>

**Brightness**: permette di modificare la luminosità dell'immagine
<?php
$action->module = 'imagecache_coloractions';
$action->action = 'imagecache_brightness';
$action->data = array(
  'filter_arg1' => '+50',
);
?>

**Change File format**: permette di modificare il formato dell'immagine.
<?php
$action->module = 'imagecache_coloractions';
$action->action = 'imagecache_convert';
$action->data = array(
  'format' => 'image/png',
);
?>

**Color Shift**: permette virare il colore dell'immagine verso uno dei colori primari.
<?php
$action->module = 'imagecache_coloractions';
$action->action = 'imagecache_convert';
$action->data = array(
  'RGB' => array(
    'red' => '255',
    'green' => '102',
    'blue' => '51',
    'HEX' => 'FF6633',
  ),
);
?>

**Corp**: ritaglia una parte dell'immagine, secondo le dimensioni e le specifiche indicate.
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_crop';
$action->data = array(
  'width' =>  '100',
  'height' => '100',
  'xoffset' => 'center',
  'yoffset' => 'center',
);
?>

**Define Canvas**: modifica la dimensione dell'immagine.
<?php
$action->module = 'imagecache_canvasactions';
$action->action = 'imagecache_definecanvas';
$action->data = array(
  // Colore delo spazio laterale aggiunto (lasciare tutto vuoto per averlo trasparente)
  'RGB' => array(
    'red' => '255',
    'green' => '102',
    'blue' => '51',
    'HEX' => 'FF6633',
  ),
  'under' => true,
  // Dimensioni finali dell'immagine (opzione 1)
  'exact' => array(
    'width' => '100',
    'height' => '100',
    'xpos' => 'center',
    'ypos' => 'center',
  ),
  // Aggiunge lo spazio indicato ai lati (opzione 2)
  'relative' => array(
    'leftdiff' => '20',
    'rightdiff' => '20',
    'topdiff' => '20',
    'bottomdiff' => '20',
  ),
);
?>

**Desaturate**: desatura l'immagine (scala di grigi)
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_desaturate';
?>

**Negative Image**: inverte i colori dell'immagine (posterizza)
<?php
$action->module = 'imagecache_coloractions';
$action->action = 'imagecache_inverse';
?>

**Overlay: file image to canvas (watermark)**: permette di aggiungere un immagine sovraimpresa all'immagine di base (il watermaker).
<?php
$action->module = 'imagecache_canvasactions';
$action->action = 'canvasactions_file2canvas';
$action->data = array(
  'xpos' => 'right',
  'ypos' => 'bottom',
  'alpha' => '100',
  'path' => 'image/path.png'
);
?>

**Underlay: place a file image under the current image (background)**: permette di aggiungere un immagine sotto all'immagine corrente.
<?php
$action->module = 'imagecache_canvasactions';
$action->action = 'canvasactions_canvas2file';
$action->data = array(
  'xpos' => 'right',
  'ypos' => 'bottom',
  'alpha' => '100',
  'path' => 'image/path.png'
);
?>

**Overlay: source image to canvas**: permette di usare l'immagine corrente come canvas.
<?php
$action->module = 'imagecache_canvasactions';
$action->action = 'canvasactions_source2canvas';
$action->data = array(
  'xpos' => 'right',
  'ypos' => 'bottom',
  'alpha' => '100',
);
?>

**Resize**: ridimensiona l'immagine di partenza.
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_resize';
$action->data = array(
  'xpos' => 'right',
  'ypos' => 'bottom',
  'alpha' => '100',
  'path' => '/image/path.png'
);
?>

**Resize**: ruota l'immagine di partenza, impostando il colore dello sfondo che si genera..
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_rotate';
$action->data = array(
  'degrees' => '90',
  'random' => false,
  'bgcolor' => '#FFFFFF',
);
?>

**Scale**: ruota l'immagine di partenza, impostando il colore dello sfondo che si genera..
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_scale';
$action->data = array(
  'width' => '100',
  'height' => '100',
  'upscale' => false,
);
?>

**Scale and Crop**: scala l'immagine e taglia la parte in surplus.
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_scale_and_crop';
$action->data = array(
  'width' => '200',
  'height' => '200',
);
?>

**Sharpen**: arrotonda l'immagine
<?php
$action->module = 'imagecache';
$action->action = 'imagecache_sharpen';
$action->data = array(
  'radius' => '0.5',
  'sigma' => '0.5',
  'amount' => '100',
  'threshold' => '0.05',
);
?>

**Text**: scrive un testo sull'immagine
<?php
$action->module = 'imagecache_textactions';
$action->action = 'textactions_text2canvas';
$action->data = array(
  'size' => '12',
  'angle' => '0',
  'alpha' => '100',
  'xpos' => 'left+10',
  'ypos' => 'bottom-10',
  'RGB' => array(
    'red' => '255',
    'green' => '102',
    'blue' => '51',
    'HEX' => 'FF6633',
  ),
  'fontfile' => 'fonts/liberation-fonts-1.04/LiberationSans-Regular.ttf',
  'text' => 'Hello World!',
  'evaluate_text' => false,
);
?>

Per ogni action è possibile impostare il peso per poterli ordinare tramite l'elemento weight, quindi:
<?php
$action->weight = 1;
?>

Se dovete creare preset complessi vi consiglio di andare a crearli e di analizzare i dati inserite per vederne i risultati prima di poter generare il codice finale del preset.

Buon coding a tutti!
