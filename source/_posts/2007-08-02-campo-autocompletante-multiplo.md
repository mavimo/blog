---
title: Campo autocompletante multiplo
categories: [Drupal]
tags: [netsons, PHP]
---
In un articolo precedente abbiamo visto come andare a creare dei campi con la funzione di autocompletamento, ma cosa succede nel caso in cui all'interno dello stesso campo dobbiamo andare a posizionare diversi valori ogniuno dei quali deve essere inserito con la funzione di autocompletamento? Normalmente questo non sarebbe possibile, ma tramite una semplice modifica possiamo andare a utilizzare un elenco separato da virgole mantenendo le funzionalità di autocompletamento.
<!--break-->
<p>Innanzitutto andiamo a svolgere le medesime operazioni per un campo di autocompletamento standard come indicato in <a href="/realizzare_campo_autocomplete" title="Realizzare un campo con funzioni di autocompletamento">Realizzare un campo autocompletante</a>. Quando andiamo a creare la funzione per la realizzazione dell'elenco, però, faremmo in modo che tutto ciò che è stato inserito prima dell'ultima virgola venga trascurato e venga no utilizzati solamente i caratteri immessi di seguito per la ricerca dei termini. il codice della funzione di autocompletamento multiplo è quello inserito di seguito (in questo caso è stato usato una selezione multipla per gli utenti disponibili):
<?php
function test_multiple_autocomplete($string_start = '') {
  $matches = array();
  $string  = '';
  $alluser = '';
  if($string_start != '') {
    $nomi     = explode(',', $string_start);
    $num_user = count($nomi);
    $string   = ltrim(rtrim($nomi[$num_user - 1]));
    for ( $i = 0; $i < $num_user - 1; $i++) {
      $alluser .= ltrim(rtrim($nomi[$i])) . ', ';
    }
  }
  if ($string) {
    $result = db_query_range("SELECT name FROM {users} WHERE LOWER(name) LIKE LOWER('%s%%')", $string, 0, 10);
    while ($user = db_fetch_object($result)) {
      $matches[ $alluser . $user->name] = check_plain($user->name);
    }
  }
  print drupal_to_js($matches);
  exit();
}
?>

Inizialmente si ha la fase di ricerca a cui segue poi una fase di accorpamento di tutti i termini inseriti in modo da essere reinseriti nel caso in cui si abbia la selezione dell'elemento richiesto.</p>

Un esempio lo potete trovare qui di seguito:
<?php
function test_form() {

  $form['test']  = array(
    '#type' => 'textfield', 
    '#title' => t('Test Multiple autocomplete'), 
    '#autocomplete_path' => 'test/multiple/autocomplete',
    '#description' => t('Inserisci una lettera compresa tra la **a** e la **d** per vedere la funzione di autocompletamento in funzione.'),
    '#maxlength' => 60, 
    '#weight' => -10,
  );

  return $form;
}
print drupal_get_form('test_form');
?>