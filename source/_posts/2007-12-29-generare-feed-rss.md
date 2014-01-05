---
title: Generare feed RSS
categories: [drupal]
tags: [feed rss, php, tassonomia]
redirect: [drupal/generare_feed_rss, node/46]
meta:
    description: A volte capita di dover generare pagine contenenti tutti i feed rss che possono essere estratti da un determinato vocabolario, per fare questo esiste un modulo apposito, si chiama <a href="http://drupal.org/project/syndication">syndication</a>, che però ha dei limiti, innanzitutto non indenta correttamente i vari feed delle voci gerarchizzate, non inserisce l'icona del feed affianco alle rispettive voci, non genera i feed di termini che non hanno contenuti, .... Tutto questo potrebbe essere sistemato agendo sul codice del modulo (lo farò e invierò la patch), ma è altrettanto possibile farlo senza utilizzare alcun modulo ma generando una semplice pagina con codice PHP.
    tags: [drupal, feed rss, php, tassonomia]
---
A volte capita di dover generare pagine contenenti tutti i feed rss che possono essere estratti da un determinato vocabolario, per fare questo esiste un modulo apposito, si chiama <a href="http://drupal.org/project/syndication">syndication</a>, che però ha dei limiti, innanzitutto non indenta correttamente i vari feed delle voci gerarchizzate, non inserisce l'icona del feed affianco alle rispettive voci, non genera i feed di termini che non hanno contenuti, .... Tutto questo potrebbe essere sistemato agendo sul codice del modulo (lo farò e invierò la patch), ma è altrettanto possibile farlo senza utilizzare alcun modulo ma generando una semplice pagina con codice PHP. Vediamo come proseguire in questa direzione.
<!--break-->
Prima di tutto creiamo una nuova pagina e scegliamo, per questo contenuto, come formato di input _PHP Code_. Ora all'interno della pagina andiamo ad inserire il seguente codice:
<?php
$vid = 4;
$main = taxonomy_get_tree($vid, 0, 0, 2);
$items = array();
$image = '&lt;img src="/misc/feed.png" alt="icona del feed RSS" width="16" height="16" /&gt;';
foreach( $main as $i => $item) {
  $tid = $main[$i]->tid;
  $main2 = taxonomy_get_children($tid);
  // print_r($main2);
  $items2 = array();
  foreach( $main2 as $j => $item) {
    $items2[$j] = l( $image . '<span>' . $main2[$j]->name . '</span>', 'taxonomy/term/'. $main2[$j]->tid . '/0/feed', array(), NULL, NULL, FALSE, TRUE);
    $items2[$j] .= '<p>' . $main2[$j]->description . '</p>';
  }
  $items[$i] = l($image . '<span>' . $main[$i]->name . '</span>', 'taxonomy/term/'. $main[$i]->tid . '/0/feed', array(), NULL, NULL, FALSE, TRUE);
  $items[$i] .= '<p>' . $main[$i]->description . '</p>';
  $items[$i] .= theme('item_list', $items2);
  unset($items2);
}
print theme('item_list', $items, NULL, 'ul', array('class' => 'feedlist'));
?>
Andiamo ora a "configurare" questo piccolo script, andando a mettere, come prima cosa il numero del vocabolario di cui vogliamo andare a generare l'albero dei feed alla variabile _$vid_,  ed impostiamo all'interno della variabile _$image_ il codice HTML che vogliamo andare ad utilizzare come immagine del feed da inserire. Per ora ho utilizzato semplicemente l'immagine dei feed standard che si trova all'interno dell'installazione di Drupal, ma ciò non toglie che potete personalizzarla scegliendone di altre o rimuovendola.

A questo punto vi troverete con l'albero dei feed associati ai vari termini del vostro vocabolario gerarchizzato nella pagina che avete indicato; per ogni termine, se avete associato ad essi una descrizione, questa sarà visualizzata nella pagina subito dopo l'immagine e il nome del feed.

Un esempio del risultato ottenibile è il seguente:
<ul class="feedlist">  *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" /> <span>Categoria 1</span> </a> <p>Descrizione del primo termine della Categoria 1</p> <div class="item-list">   *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" /> <span>Categoria 1 - Sottocategoria 1</span> </a> <p>Descrizione del sotto termine della Categoria </p>   *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" /> <span>Categoria 1 - Sottocategoria 2</span> </a> <p>Descrizione del sotto termine della Categoria </p>   *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" /> <span>Categoria 1 - Sottocategoria 3</span> </a> <p>Descrizione del sotto termine della Categoria </p>   </div>   *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" /> <span>Categoria 2</span> </a> <p>Descrizione del primo termine della Categoria 2</p> <div class="item-list">   *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" /> <span>Categoria 2 - Sottocategoria 1</span> </a> <p>Descrizione del sotto termine della Categoria </p>   *  <a href="#"> <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" />  <span>Categoria 2 - Sottocategoria 2</span>       </a>          <p>Descrizione del sotto termine della Categoria </p>                 *           <a href="#">            <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" />           <span>Categoria 2 - Sottocategoria 3</span>          </a>          <p>Descrizione del sotto termine della Categoria </p>                    </div>       *     <a href="#">      <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" />      <span>Categoria 3</span>    </a>    <p>Descrizione del primo termine della Categoria 3</p>    <div class="item-list">               *           <a href="#">            <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" />            <span>Categoria 3 - Sottocategoria 1</span>          </a>          <p>Descrizione del sotto termine della Categoria </p>                 *           <a href="#">            <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" />            <span>Categoria 3 - Sottocategoria 2</span>          </a>          <p>Descrizione del sotto termine della Categoria </p>                 *           <a href="#">            <img src="/misc/feed.png" alt="icona del feed RSS" height="16" width="16" />            <span>Categoria 3 - Sottocategoria 3</span>          </a>          <p>Descrizione del sotto termine della Categoria </p>                  </div>
NB: i feed elencati qui sopra non esistono!

Ovviamente possiamo poi intervenire sui CSS per modificare lo stile in cui questo vien presentato.

<h3>Note</h3>
Attualmente questo script prevede una conoscenza minima del codice PHP per poter essere configurato e utilizzato, genera solamente l'elenco dei termini e sei sottotermini, ma è facilmente espandibile al numero di livelli che si vuole ottenere. Successivamente verrà perfezionato per avere una maggiore stabilità ed espandibilità.
