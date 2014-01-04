---
title: Realizzare un campo autocompletante
categories: [Drupal]
tags: [netsons]
---
<p>Se vi è capitato di dover completare alcuni campi con una serie di termini che si ripetono spesso, ma che a volte possono contenere termini nuovi, avrete di certo sentito la necessità di utilizzare un campo che si autocompleti o che quantomeno mettesse a disposizione i termini già inseriti in modo da avere sottomano i termini già aggiunti e non creare così dei doppioni. Un esempio di questo lo potete vedere andando a cercare un certo utente all'interno di un elenco, per esempio su <a href="http://www.drupalitalia.org" title="Sito della comunità italiana di Drupal">DrupalItalia</a> o al termine di questa pagina.</p>
<!--break-->
<p>Questo è facilmente realizzabile andando ad utilizzare, al momento di creazione del form usando per l'opzione _#autocomplete_path_ il valore _user/autocomplete_. Ipotizziamo ora che anziché andare a poter scegliere tra l'elenco degli utenti volessimo andare a dare la possibilità di scegliere tra un elenco di chiavi presenti nel nostro database, come potrebbero essere i diversi titoli degli articoli già inseriti. Non essendoci già un impostazione per l'autocompletamento di questa voce dovremmo andare a creare una nostra funzione di autocompletamento, essendo una operazione poco sfruttata ma che ha delle ottime potenzialità andiamo ad analizzare passo passo come fare ciò.</p>
<p>Innanzitutto all'interno del modulo che stiamo sviluppando andremo a creare una funzione che faccia sovrascriva _<a href="http://api.drupal.org/api/function/hook_form/5" title="Funzione hook_form() spiegata dall'handbook">hook_form()</a>_ per la realizzazione del form. Un esempio banalissimo potrebbe essere:
~~~language-php
function test_form(&$node) {
  $form['test']  = array(
    '#type' => 'textfield', 
    '#title' => t('Test Autocomplete'), 
    '#autocomplete_path' => 'test/autocomplete',
    '#maxlength' => 60, 
    '#weight' => -10,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );
  return $form;
}
~~~

in cui sono presenti due elementi, un campo di input (di tipo textfield) a cui abbiamo assegnato la proprietà di autocompletamento come _test/autocomplete_ e un pulsante di submit.</p>
<p>Andiamo ora a creare un nuovo menu raggiungibile dall'indirizzo _test/autocomplete_ che si occupi di creare restituire l'elenco di termini che possono essere aggiunti all'interno della casella di testo. Per fare questo andiamo ad operare usando _<a href="http://api.drupal.org/api/function/hook_menu/5" title="Funzione hook_menu() spiegata dall'handbook">hook_menu()</a>_, in particolare andremo a scrivere il seguente codice:
~~~language-php
function test_menu() {
  $items = array();
    // Menu per l'autocompleteamento del nome dei moduli
  $items[] = array('path'     => 'test/autocomplete',
                   'title'    => t('Test Autocomplete'),
                   'callback' => 'test_autocomplete',
                   'access'   => TRUE,
                   'type'     => MENU_CALLBACK,
                  );
  return $items;
}
~~~

Le proprietà _type_ è settata su _MENU_CALLBACK_ in modo che la voce del menu non sia inserita all'interno del menu visibile dagli utenti, mentre la proprietà _access_ è settata su _true_ per permettere a chiunque di usufruire della caratteristica di autocompletamento. La proprietà _callback_ si occupa di richiamare la funzione che andrà a generare l'elenco delle parole che possono essere inserite, quindi è stata settata con il nome della funzione che andremo a realizzare ora.</p>
<p>La funzione per la ricerca delle voci possibili che devono essere inserite nel campo di autocompletamento viene realizzata come indicati di seguito:~~~language-php
function test_autocomplete($string = '') {
  if ($string) {
    $result = db_query_range("SELECT voce FROM {tabella_elenco} WHERE LOWER(voce ) LIKE LOWER('%s%%')", $string, 0, 10);
    while ($dati = db_fetch_object($result)) {
      $matches[$dati->voce] = check_plain($dati->voce);
    }
  }
  print drupal_to_js($matches);
  exit();
}
~~~

La funzione è abbastanza semplice e si occupa di andare a recuperare dalla _tabella_elenco_ tutte le voci _voce_ che inizi con le lettere indicate da string (ovvero le lettere inserite dall'utente). Vengono restituiti soltanto i primi dieci termini trovati e non vengono effettuate discriminazioni tra lettere maiuscole e minuscole (case unsensitive), ma questo comportamento è facilmente modificabile agendo sulla query.</p>
<p>Al termine del prelevamento delle voci viene effettuato un ciclo di tutti i risultati ottenuti che vengono inseriti in un array e successivamente questo viene trasformato in javascript per poter essere inviato tramite AJAX alla pagina. Un esempio del risultato ottenibile lo potete vedere qui sotto, dove inserendo le iniziali sotto il campo di input verranno inserite le possibili voci,, lasciando comunque la facoltà di immettere termini al di fuori dell'elenco a disposizione.</p>

<?php
function test_form() {

  $form['test']  = array(
    '#type' => 'textfield', 
    '#title' => t('Test Autocomplete'), 
    '#autocomplete_path' => 'test/autocomplete',
    '#description' => t('Inserisci una lettera compresa tra la **a** e la **d** per vedere la funzione di autocompletamento in funzione.'),
    '#maxlength' => 60, 
    '#weight' => -10,
  );

  return $form;
}
/*
function test_menu() {
  $items = array();
  
  // Menu per l'autocompleteamento del nome dei moduli
  $items[] = array('path'     => 'test/autocomplete',
                   'title'    => t('Test Autocomplete'),
                   'callback' => 'test_autocomplete',
                   'access'   => TRUE,
                   'type'     => MENU_CALLBACK,
                  );

  return $items;
}

function test_autocomplete($string = '') {
  
  if ($string) {
    $result = db_query_range("SELECT name FROM {users} WHERE LOWER(name) LIKE LOWER('%s%%')", $string, 0, 10);
    while ($user = db_fetch_object($result)) {
      $matches[$user->name] = check_plain($user->name);
    }
  }
  print drupal_to_js($matches);
  exit();
}
*/
print drupal_get_form('test_form');

?>