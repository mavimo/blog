---
title: Form AHAH in tabelle
categories: [Drupal]
tags: [ahah, form, tabella]
---
Negli articoli precedenti abbiamo visto come realizzare dei <a href="/drupal/ahah_form">form con funzionalità AHAH</a> e con <a href="/drupal/form_tabella">form posizionati in tabella</a>, in questo articolo, invece, vedremo come unire queste due funzionalità per creare dei form con funzionalità AHAH ma con gli elementi disposti in tabella.

Prima di proseguire è altamente consigliato la rilettura dei due precedenti articoli, non verranno rispiegati alcuni concetti fondamentali già affrontati negli altri articoli, ma vedremo solo come integrare le due funzioni. Potete vedere un esempio del risultato nella pagina <a href="/tutorial/tableformahah">Form in tabella con AHAH</a>.
<!--break-->
Come nel caso dei form AHAH è necessario andare a realizzare la voce di menu dove andare ad ottenere le voci da inserire tramite AHAH, con una piccola differenza. In questa voce andremo a passare un ulteriore parametro (numerico) per indicare a quale elemento del form nella tabella deve essere modificato. Per fare questo inseriamo il solito _hook_menu_ andando ad aggiungere alla voce di _callback_ anche un argomento che poi verrà passato alla funzione che si occupa di andare a rigenerare il form.

<?php
/**
 * Implementation of hook_menu().
 */
function tableformahah_menu() {
  $items = array();

  $items['tutorial/tableformahah'] = array(
    'title'            => t('Form in tabella con AHAH'),
    'description'      => t('Test form in tabella con capacità AHAH'),
    'page callback'    => 'drupal_get_form',
    'page arguments'   => array('tableformahah_form'),
    'access arguments' => array('access content'),
  );
  
  $items['tutorial/js/tableformahah/%'] = array(
    'title'            => t('JSON'),
    'description'      => t('Get data for haha'),
    'page callback'    => 'tableformahah_js',
    'page arguments'   => array(3),
    'access arguments' => array('access content'),
    'type'             => MENU_CALLBACK,
  );
  
  return $items;
}
?>

Come si può vedere è stata aggiunta la voce _page arguments_ che verrà usata per andare a passare dei valori.

Il passo successivo è la realizzazione del form, anche in questo caso l'unica acoortezza che dobbiamo metterci è l'inserimento nella voce di menu chiamata da AHAH del codice che indica il numero di riga dell'elemento:
<?php
/**
 * Implementation of hook_form().
 */
function tableformahah_form($form_state) {
  $form = array();
  
  // Build Form with FAPI
  for($i = 0; $i < FORM_COUNT_MAXROWS; $i++) {
    $form['select_a_' . $i] = array(
      '#type'          => 'select',
      '#options' => array(
        'value0' => t('Seleziona un valore'),
        'value1' => t('Valore @index A', array('@index' => $i)),
        'value2' => t('Valore @index B', array('@index' => $i)),
        'value3' => t('Valore @index C', array('@index' => $i)),
      ),
      '#default_value' => 'value0',
      '#ahah'          => array(
        'path'    => 'tutorial/js/tableformahah/' . $i,
        'wrapper' => 'table_ahah_container_' . $i,
      ),
    );
    $form['select_b_' . $i] = array(
      '#type'          => 'select',
      '#options' => array(0 => t('Select a value')),
      '#prefix'       => '<div id="table_ahah_container_' . $i . '">',
      '#suffix'       => '</div>',
    );
  }
  
  $form['#theme'] = 'tableformahah_draw';
  
  return $form;
  return $form;
}
?>

a cui ovviamente dobbiamo andare ad aggiungere le funzioni di theming come abbiamo visto precedentemente:

<?php
/**
 * Implementation of hook_theme().
 */
function tableformahah_theme($existing, $type, $theme, $path) {
   return array(
    'tableformahah_draw' => array(
      'arguments' => array('form' => NULL),
    ),
  );
}

/**
 *  Create form table
 */
function theme_tableformahah_draw($form) {
  $header = array(t('Prima select'), t('Seconda select'));
  
  for($i = 0; $i < FORM_COUNT_MAXROWS; $i++) {
    $rows[] = array(
      drupal_render($form['select_a_' . $i ]),
      drupal_render($form['select_b_' . $i]),
    );
  }
  
  $output = theme('table', $header, $rows);
  
  $output .= drupal_render($form);
  
  return $output;
}
?>

Ora andiamo a realizzare la fuzione che indica l'elemento da inserire nel form del menu per ottenere la select (in questo caso, potrebbe essere qualsiasi altra cosa) nella tabella:
<?php
/**
 * Genera i risultati da inserire nella seconda select
 */
function tableformahah_js($index = 0) {
  $did = $_POST['select_a_' . $index];
  
  $form['select_b_' . $index] = array(
    '#type'          => 'select',
    '#required'      => true,
    '#options' => array(
      'value0' => t('Seleziona un valore'),
      'value1' => t('Valore @index A - primo', array('@index'   => $index)),
      'value2' => t('Valore @index B - secondo', array('@index' => $index)),
      'value3' => t('Valore @index C - terzo', array('@index'   => $index)),
    ),
    '#default_value' => 'value0',
  );
  $output = tableformahah_field_render($form, 'select_b_' . $index);
  print drupal_to_js(array('data' => $output, 'status' => true));
  exit();
}
?>

E' ora evidente l'uso che se ne fa del parametro aggiunto nel menu, questo ci permette di andare a recuperare l'lemento corretto da andare a modificare nel form. Ovviamente sono stati omessi eventuali controlli che porebbero essere necessari epr contrallare che si tratta veramente di un valore intero valido e così via.

A questo è (come spiegato nell'articolo precedente) necessario andare ad aggiungere la funzione che modifichei il form in cache:
<?php
/** Serve a modificare il form in cache prima di inviare i dati al client.
  *
  * Example usage:
  * @code
  *    $form['new_element'] = array(
  *      '#type'          => 'select',
  *      '#title'         => t('Title'),
  *      '#description'   => t('Description'),
  *      '#weight'        => 5,
  *      '#required'      => true,
  *      '#default_value' => $node->name,
  *      '#options' => array(
  *        'value1' => t('Description 1'),
  *        'value2' => t('Description 2'),
  *        'value3' => t('Description 3'),
  *      ),
  *    );
  *    $output = tableformahah_field_render($form, 'old_element');
  *    print drupal_to_js(array('data' => $output, 'status' => true));
  *    exit();
  * @endcode
  * 
  * @param $fields
  *   Indica l'lemento da inserire nel forum
  * @param $name
  *   Indica quale elemento deve essere sostituito nel form
 *
  * @return
  *   Ritorna il codice da iniettare nel form tramite AJAX
  */
function tableformahah_field_render($fields, $name) {
  // Cambia lo status del form
  $form_state = array('submitted' => FALSE);
  
  // Recupera l'id del form
  $form_build_id = $_POST['form_build_id'];
  
  // Recupera il form dalla cache
  $form = form_get_cache($form_build_id, $form_state);
  
  // Sostituisce il field
  $form[$name] = $fields;
  
  // Mette il form modificato in cache
  form_set_cache($form_build_id, $form, $form_state);
  
  
  $form += array(
    '#post' => $_POST,
    '#programmed' => FALSE,
  );
  
  // Rigenera il form
  $form = form_builder($_POST['form_id'], $form, $form_state);
  
  // Estrae il field modificato
  $new_form = $form[$name];
  
  // Renderizza e restituisce il field modificato
  return drupal_render($new_form); 
}
?>

A questo punto abbiamo ottenuto il risultato desiderato :)

Sono state elimiate tutte le parte non strettamente necessarie (vedi fnzioni di validazione, inserimento, aggiornamento,  ...) per rendere più facilmente comprensibile il codice analizzato.