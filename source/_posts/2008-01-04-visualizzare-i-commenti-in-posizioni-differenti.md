---
title: Visualizzare i commenti in posizioni differenti.
categories: [drupal]
tags: [commenti, php, tema]
redirect: [drupal/visualizzare_i_commenti_in_posizioni_differenti, node/47]
meta:
    description: Quante volte, in fase di creazione o personalizzazione di  un tema vi è capitato di non sapere come fare per posizionare i commenti dove volete voi, magari solo su determinate pagine, o magari solo se si verificano determinate condizioni? Bhè, a me è capitato alcune volte, e non sempre si poteva operare con una soluzione pulita, vediamo ora quel è il metodo migliore che sono riuscito a trovare.
    tags: [drupal, commenti, php, tema]
---
Quante volte, in fase di creazione o personalizzazione di  un tema vi è capitato di non sapere come fare per posizionare i commenti dove volete voi, magari solo su determinate pagine, o magari solo se si verificano determinate condizioni? Bhè, a me è capitato alcune volte, e non sempre si poteva operare con una soluzione pulita, vediamo ora quel è il metodo migliore che sono riuscito a trovare.<!--break-->
Come prima cosa dobbiamo sapere che i commenti, i Drupal, vengono visualizzati in una variabile del nodo, e più precisamente in ~~~language-php
$node->comment

~~~
Quindi operando sul tema, nel file del contenuto di cui vogliamo andare a gestire in maniera autonoma i commenti andiamo a posizionare, alla fine del file _xxx.tpl.php_ la riga di codice:~~~language-php
<?php $node->comment = NULL; ?>

~~~
In questo modo la variabile vine svuotata e il contenuto non verrà visualizzato nella pagina. A questo punto dobbiamo andare a posizionare i commenti dove vogliamo che questi vengano visualizzati all'interno del nodo che stiamo preparando, quindi sempre nel file _xxx.tpl.php_ andiamo ad inserire, dove vogliamo inserire i commenti, ma comunque prima della chiamata che svuota il contenuto della variabile vista precedentemente, il codice~~~language-php
<?php
if (function_exists('comment_render') && $node->comment) {
   print comment_render($node, $node->cid);
}
?>
~~~
che ci permette di inserire i commenti all'interno della stessa pagina. Ovviamente possiamo inserire questo codice all'interno di alcuni tipi di nodi e non di altri, così come usare blocchi _if_ per visualizzarli solo se alcune condizioni sono verificate.

Cosa succede nel caso in cui abbiamo necessità di vedere i contenuti indicati al di fuori dal nodo, ma all'interno di un qualsiasi blocco che deve essere visualizzato nella stessa pagina? l'operazione da fare per visualizzare questo tipo do contenuto è abbastanza semplice, è sufficiente creare un nuovo blocco (_Administer_ &raquo; _Site building_ &raquo; _Blocks_ &raquo; _Add block_). A questo punto andare a inserire il nome del blocco (per esempio _Commenti_) e nel contenuto del blocco inserire~~~language-php
<?php
if ( arg(0) == 'node' && is_numeric(arg(1)) && ! arg(2) ) {
  $node = node_load(arg(1));
  // Do something with the node
  if (function_exists('comment_render') && $node->comment) {
    print comment_render($node, $node->cid);
    // $node->comment = NULL;
  }
}
?>
~~~
scegliendo, ovviamente, come formato di inserimento _PHP code_. A questo punto andiamo a salvare il blocco e posizioniamolo dove vogliamo, andando magari a scegliere di visualizzarlo solo in alcune pagine, o solo per determinanti utenti. Questo è tutto.