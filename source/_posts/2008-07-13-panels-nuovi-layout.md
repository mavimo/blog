---
title: Panels, nuovi layout
categories: [drupal]
tags: [css, estensione, layout, panels, template, theme]
redirect: [drupal/panels_nuovi_layout, node/55]
meta:
    description: Se vi fosse mai capitato di lavorare con Panels (o Panels2) quasi sicuramente vi sarà capitato di dover creare un pagina con una struttura completamente diversa da quelle presenti tra le disponibili di default del modulo, come possiamo ovviare a questo problema?
    tags: [drupal, css, estensione, layout, panels, template, theme]
---
Se vi fosse mai capitato di lavorare con Panels (o Panels2) quasi sicuramente vi sarà capitato di dover creare un pagina con una struttura completamente diversa da quelle presenti tra le disponibili di default del modulo, come possiamo ovviare a questo problema?

Le soluzioni sono molteplici, usare una struttura simile a quella che ci interessa e poi sopperire alla diversa visualizzaione con dei CSS, oppure usare dei panels all'interno di altri panels (obrobrio!) o l'ultima soluzione, e secondo me più pulita, è quella di andare a creare un nuovo layout, in modo che rispetti la struttura che abbiamo in mente. Vediamo come fare.
<!--break-->
Iniziamo a capire qale è la struttura che vogliamo creare, abbozziamo le diverse regioni su di un foglio e fatto questo disegnamole su di un immagine con dimensione _50px_ di larghezza e _75px_ di altezza. Le dimensioni potrebbero essere anche differenti, ma per coerenza con le altre già presenti (e perchè sono sufficienti a rappresentare la struttura che vogliamo) è preferibile usare queste dimensioni.

L'immagine che otterremo sarà qualche cosa di simile a:
<img src="/files/55/mylayout_stacked.png" alt="Struttura del nuovo layout ceh si vuole creare all'interno di panels" width="50" height="75" />
Come è evidente si tratta di un layout piuttosto complesso, e che potrebbe comodo avere come panels piuttosto che ottenerlo dalla combinazione di diversi altri panels, o dalla modifica dei CSS. salviamo l'immagine con il nome _mylayout-stacked.png_

Una volta determinata la struttura che vogliamo vediamo come deve essere comosta la nostra struttura andando ad indicare i tag html con le rispettive classi o id, necessari a posizionare il tutto con i CSS. Per il caso in questione abbiamo:
~~~language-php

<div class="main-container">
  <div class="top">
  </div>
  <div class="main-left">
    <div>
      <div class="cleft">
      </div>
      <div class="cright">
      </div>
      <br style="clear: both;" />
    </div>
    <div class="center">
    </div>
    <div>
      <div class="cleft">
      </div>
      <div class="cright">
      </div>
      <br style="clear: both;" />
    </div>
  </div>
  <div class="main-right">
  </div>
  <br style="clear: both;" />
  <div class="bottom">
  </div>
</div>

~~~


E ora andiamo a definire il CSS. Presupponendo che si tratti di un layout a larghezza fissa (960px) e che la colonna a destra sia di 300px otterremo:
~~~language-php

.main-container {
  width: 960px;
}
.main-container * {
  margin: 2px 0px;
}
.main-left {
  float: left;
  width: 650px;
}
.main-right {
  float: right;
  width: 300px;
}
.cleft {
  width: 322px;
  float: left;
}
.cright {
  width: 322px;
  float: right;
}

~~~

a questo punto abbiamo parte del codice che ci serve per creare il nostro layout.

Iniziamo inserendo il CSS in un file che chiameremo _mylayout-stacked.css_ e creeremo il file _mylayout-stacked.inc_ in cui definiremo il coice necessario a rendere usabile questo layout.

All'interno scriviamo le funzioni necessarie, la principale è la funzione che implementa l'hook _hook_panels_layouts_, per fare questo chiamiamo la funzione con il nome che abbiamo dato al file, quindi:
<?php
function panels_mylayout_stacked_panels_layouts() {
  $items['mylayout_stacked'] = array(
    'module' => 'panels',
    'title' => t('My layout stacked'),
    'icon' => 'layouts/mylayout_stacked.png',
    'theme' => 'panels_mylayout_stacked',
    'css' => 'layouts/mylayout_stacked.css',
    'panels' => array(
        'top'         => t('Top'),
        'firstleft'   => t('Superior left'),
        'firstright'  => t('Superior right'),
        'center'      => t('Center'),
        'secondleft'  => t('Inferior left'),
        'secondright' => t('Inferior right'),
        'right'       => t('Right'),
        'bottom'      => t('Bottom'),
    ),
  );
  return $items;
}
?>
e andiamo a definire l'array _$items_ che verrà poi ritornato, in questo possiamo definire il nome del nostro layout:

<?php
$items['mylayout_stacked'] = array( .. );
?>
A che modulo ci stiamo riferendo:
<?php
'module' => 'panels',
?>
Il nome che diamo al nostro layout:
<?php
'title' => t('My layout stacked'),
?>
L'immagine di anteprima:
<?php
'icon' => 'layouts/mylayout_stacked.png',
?>
La funzione che si occupa del theming (la analizzeremo di seguito):
<?php
'theme' => 'panels_mylayout_stacked',
?>
Il CSS che verrà caricato e che genererà la struttura della nostra pagina:
<?php
'css' => 'layouts/mylayout_stacked.css',
?>
Infine le diverse regioni da cui è composto il nostro layout:
<?php
'panels' => array( ... );
?>
Per ogniuno delle regioni dovremo indicare il nome che gli viene assegnato e il testo visibili all'utente che genera il panels:
<?php
'top'         => t('Top'),
'firstleft'   => t('Superior left'),
'firstright'  => t('Superior right'),
'center'      => t('Center'),
...
?>
In questo modo abbiamo creato la struttura che ci serve.

La funzione che deve generare la struttura dell apagina (e che prima abbiamo indicato essere la funzione _panels_mylayout_stacked_) deve essere dichiarata come di seguito:
<?php
function theme_panels_mylayout_stacked($id, $content) {
  if ($id) {
    $idstr = " id='$id'";
  }
  $output = <<<EOT
<div class="main-container" $idstr>
  <div class="top">
  $content[top]
  </div>
  <div class="main-left">
    <div>
      <div class="cleft">
      $content[firstleft]
      </div>
      <div class="cright">
      $content[firstright]
      </div>
      <br style="clear: both;" />
    </div>
    <div class="center">
    $content[center]
    </div>
    <div>
      <div class="cleft">
      $content[secondleft]
      <div>
      <div class="cright">
      $content[secondright]
      </div>
      <br style="clear: both;" />
    </div>
  </div>
  <div class="main-right">
  $content[right]
  </div>
  <br style="clear: both;" />
  <div class="bottom">
  $content[bottom]
  </div>
</div>
EOT;
  return $output;
}
?>
nella prima parte si indica quele è l'ID che deve essere assegnato all'elemento padre (paramentro inserito dal'interfaccia di generazione del panel), e di seguito l'output _HTML_ della strttura.

Come si può vedere al'linterno dei tag HTMl sono presente anche delle chiamate alle variabili che eprmettono di inserire all'interno dell'HTML il codice degli elementi inseriti nei diversi spazi in fase di riempimento del panel.
In questo modo il nostro panel potrà essere generato e riempito come tutti gli altri panel, ma verrà presentato con la struttura che ci interessa.

realizzati tutti questi elementi posizioniamo tutti e tre i file (_inc_, _css_ e _png_) all'interno della cartella _layouts_ della cartella del modulo panels e partiamo con la creazione del nuovo panels.

In allegato troverete i file relativi al layout indicato.
