---
title: drupal-snippet (update)
categories: [drupal]
tags: [gedit, linux, snippet]
redirect: [drupal/drupal_snippet_update, node/74]
meta:
    description: Questo è un aggiornamento del lavoro che sto portando avanti per gli <em>snippet</em> da caricare in <a href="http://projects.gnome.org/gedit/">gedit</a> per facilitare il alvoro su <a href="http://drupal.org">drupal</a>. Se il <a href="/drupal/coding_drupal_gedit_ancora_snippet">precedente articolo</a> vi interessava sono stati inseriti diversi miglioramenti (più che altro correzioni e ottimizzazioni date dall'uso sull'ordine dei placeholder).
    tags: [drupal, gedit, linux, snippet]
---
Questo è un aggiornamento del lavoro che sto portando avanti per gli _snippet_ da caricare in <a href="http://projects.gnome.org/gedit/">gedit</a> per facilitare il alvoro su <a href="http://drupal.org">drupal</a>. Se il <a href="/drupal/coding_drupal_gedit_ancora_snippet">precedente articolo</a> vi interessava sono stati inseriti diversi miglioramenti (più che altro correzioni e ottimizzazioni date dall'uso sull'ordine dei placeholder).
Se non sapete ben di cosa stiamo parlando vediamolo nel dettaglio.
<!--break-->
In gedti è possibile creare degli snippet (dei pezzi di codice) che vengono inseriti nel momento in cui si preme tab, in questo modo  possibile andare ad inserire porzioni di codice senza doverli inserire a mano ogni volta. Per esempio se scriviamo _module_:
<img src="/files/articolo/74/module_png_29486.png" alt="" />
e poi premiamo il tasto _TAB_ verrà inserito tutta una porzione di codice come sotto presentato:
<img src="/files/articolo/74/module_post_png_19096.png" alt="" />
e il cursore avrà selezionato una parte del testo (description) in cui potremmo andare ad inserire il testo di descrizione del modulo, premendo nuovamente TAB ci troveremo alla fine del codice e potremmo proseguire nella scrittura.


Ovviamente la scrittura della parte iniziale del codice è solo una piccola parte di quello che possaimo fare, per esempio se vogliamo andare ad inserire degli hook, e non ci ricordiamo a memoria questi (o comunque non vogliamo andare a cercare nella documentazione il tutto), possiamo andare a scrivere la parola _hook_:
<img src="/files/articolo/74/hook_png_19755.png" alt="" />

Premiamo il tasto _TAB_ e comparirà l'lemnco di tutti gli hook implementati:
<img src="/files/articolo/74/hook_tab_png_14048.png" alt="" />

Selezionando quello che ci interessa e premendo invio (o cliccandoci soprà) verrà inserito il codice richiesto, con alcuni elementi già correttamente settati (il nome del modulo, per esempio), e con il cursore nella posizione adeguata per l'inserimento del codice.
<img src="/files/articolo/74/hook_post_png_15892.png" alt="" />

Spero che questa breve spiegazione vi abbia "stimolato l'appetito" e che ora vi venga voglia di provarlo. Se così fosse vi consiglio di dare una lettura all'articolo precedente per effettuare l'installazione o andare a leggere direttamente il readme dal <a href="http://github.com/mavimo/gedit-drupal/tree/master">repository GIT del progetto</a>.

Potete trovare l'ultimo pacchetto da scaricare direttamente nella <a href="http://github.com/mavimo/gedit-drupal/downloads">pagina di download</a>, mentre le notizie aggiorante sul progetto nel <a href="http://wiki.github.com/mavimo/drupal-snippet">wiki</a>.

Ovviamente commenti e critiche sono più che ben accette, per facilitare la gestione di segalazioni o richieste usate <a href="http://getsatisfaction.com/mavimo/products/mavimo_drupal_snippet">Get Satisfaction</a>
