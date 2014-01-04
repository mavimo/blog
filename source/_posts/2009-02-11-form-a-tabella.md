---
title: Form a tabella
categories: [Drupal]
tags: [form, hook, tabella, theme]
---
A chi non è mai capitato di dover creare un form e dargli un aspetto grafico particolare? Credo che chiunque abbia avuto questa necessità avrà avuto anche la necessità di disporre i campi sottoforma di tabella, sopratutto quando si ha una serie di elementi simili che devono essere inseriti.

Per fare questo abbiamo diversi modi, vediamo quale è il più "pulito" e veloce.
<!--break-->
Innanzitutto dobbiamo avere una pagina in cui viene inserito il form, per fare questo andiamo ad usare l'hook menu che richiami la funzione che genera il form tramite la funzione _drupal_get_form_:
<?php
/**
 * Implementation of hook_menu().
 */
function tableform_menu() {
  $items = array();

  $items['tutorial/formtabella'] = array(
    'title' => t('Form a tabella'),
    'description' => t('Crea un form con struttura tabellare'),
    'page callback' => 'drupal_get_form',
    'page arguments' => array('tableform_form'),
    'access arguments' => array('access content'),
  );
  
  return $items;
}
?>

A questo punto andiamo a realizzare la funzione che genera il nostro form e lo restituisce come array. Questa procedura viene semplificata usando un ciclo che inserisce in cascata i vari elementi ripetendoli, ho definito una variabile che contiene il numero di elementi che devono essere contenuti nella tabella, mla cosa non è necessaria ma molto comoda, dato che poi questo valore verrà usato in molte occasioni (theming del form, validazione, inserimento, cancellazione, ..).

Vediamo la funzione che si occupa di creare il form:
<?php
/**
 * Create form
 */
function tableform_form($form_state) {
  
  for($i = 0; $i < FORM_COUNT_ROWS; $i++) {
    $form['check_' . $i ] = array(
      '#type' => 'checkbox',
      '#default_value' => TRUE,
    );
    $form['select_' . $i] = array(
      '#type'          => 'select',
      '#options' => array(
        'value1' => t('Valore 1'),
        'value2' => t('Valore 2'),
        'value3' => t('Valore 3'),
      ),
    );
    $form['text_' . $i] = array(
      '#type'          => 'textfield',
      '#maxlength'     => 128,
    );
  }
  
  $form['#theme'] = 'tableform_draw';
  
  return $form;
}
?>
Ho coscentemente omesso tutto ciò che non serve per modificare kl'aspetto, ma potrebbe essere necessario in un form classico (vedi pulsante di submit e cose simili). Da notare l'inserimento della voce _#theme_ come chiave dell'array che indica quale è la funzione di theming da usare per la formattazione del form.

A questo punto andiamo a creare la funzione che permette di visualizzare il form in tabella:
<?php
/**
 *  Create form table
 */
function theme_tableform_draw($form) {
  $header = array(t('Attivo'), t('Valore'), t('Descrizione'));
  
  for($i = 0; $i < FORM_COUNT_ROWS; $i++) {
    $rows[] = array(
      drupal_render($form['check_' . $i ]),
      drupal_render($form['select_' . $i]), 
      drupal_render($form['text_' . $i])
    );
  }
  
  $output = theme('table', $header, $rows);
  
  $output .= drupal_render($form);
  
  return $output;
}
?>
In questa funzione usaiamo la funzione _drupal_render_ per andare a renderizzare gli elementi del form e disporli nella righe della tabella, viene poi usata la funzione _theme table_ per realizzare al tabella. L'ultima chiamata al form serve a far disegnare gli elementi che non sono stati inseriti precedentemente nel form.

Una volta realizzata la funzione dobbiamo occuparci di segnalarla al meccanismo di theming, per fare questo usiamo l'_hook_theme_:
<?php
/**
 * Implementation of hook_theme().
 */
function tableform_theme($existing, $type, $theme, $path) {
   return array(
    'tableform_draw' => array(
      'arguments' => array('form' => NULL),
    ),
  );
}
?>

Ora possiamo caricare il modulo e visualizzare il risultato desiderato andando all'indirizzo segnalato. Potete vedere il risultato finale andando all'indirizzo <a href="/tutorial/formtabella">Form in tabella</a> e potete scaricare il modulo d'esempio allegato a questo articolo.

Se avete domande scrivete pure nei commenti.