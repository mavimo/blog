---
title: Autocomplete in cascata
categories: [drupal]
tags: [autocomplete, javascript, jquery, usabilità]
redirect: [drupal/autocomplete_cascata, node/79]
meta:
    description: Vediamo ora come creare dei campi autocompletanti che hanno dipendenze tra di loro.
    tags: [drupal, autocomplete, javascript, jquery, usabilità]
---
Come spesso capita si utilizzano select per andare a far effettuare delle scelte agli utenti, e come abbiamo visto <a href="/tutorial/testahah">precentemente</a> è possibile usare le funzionalità ajax per fare in modo che delle select secondarie varino in funzione della prima scelta.

Cosa succede, invece, quando si hanno centinaia o migliaia di elementi tra cui scegliere? una select diventa una pessima scelta per l'utente che deve andare ad inserire i dati, ma fortunatamente <a href="/drupal">Drupal</a> ci mette a disposizione i campi autocompletanti, elementi che abbiamo già affrontato in <a href="/drupal/campo_autocomplete">articoli precedenti</a>.

Vediamo ora come creare dei campi autocompletanti che hanno dipendenze tra di loro.
<!--break-->
Per poter realizzare questa dipendenza potremmo realizzare un meccanismo javascript che prelevi l'informazione dal campo precedentemente completato e la trasferisca al server per poter avere una risposta coerente con la scelta effettuata in precedenza. Questa operazione può essere effettuata andando a interagire con il sistema di autocompletamento di Drupal, che sfruttando le interfaccie di javascript può essere sovrascritto (anche solo in parte).

Nel caso specifico è necessario andare a modificare l'oggetto _Drupal.ACDB_ ed in particolare la sua funzione di search. Questa funzione deventa quindi come di seguito indicata.
~~~language-php

Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  // Language ID
  var langId = this.owner.input.lang;
  // Previous text
  var prevText = '';
  // Current ID
  var currentId = this.owner.input.id.replace('edit-', '');
  // Check if is first element
  if(langId > 0) {
    var selectorString = new Array();
    for( var i = langId - 1; i >= 0; i-- ) {
      selectorString[langId - i] = 'input.dependence-autocomplete#edit-' + i;
    }
    // Create list of previous item
    $(selectorString.join(', ')).each(function () {
      if(this.value != '') {
        prevText += '/' + Drupal.encodeURIComponent(this.value);
      } else {
        prevText += '/' + Drupal.encodeURIComponent('#');
      }
    });
  }
  // Clear all children element when this element change
  $('input.dependence-autocomplete').each(function () {
    if($(this).attr('lang') > langId) {
      this.value = '';
    }
  });
  this.searchString = searchString;
  // See if this key has been searched for before
  if (this.cache[searchString + '/' + currentId + prevText]) {
    return this.owner.found(this.cache[searchString + '/' + currentId + prevText]);
  }
  // Initiate delayed search
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function() {
    db.owner.setStatus('begin');
    // Ajax GET request for autocompletion
    $.ajax({
        type: "GET",
        url: db.uri + '/' + Drupal.encodeURIComponent(searchString) +
                      '/' + Drupal.encodeURIComponent(currentId) +
                      prevText,
        dataType: 'json',
        success: function (matches) {
          if (typeof matches['status'] == 'undefined' || matches['status'] != 0) {
            db.cache[searchString + '/' + currentId + prevText] = matches;
            // Verify if these are still the matches the user wants to see
            if (db.searchString == searchString) {
              db.owner.found(matches);
            }
            db.owner.setStatus('found');
          }
        },
        error: function (xmlhttp) {
          alert(Drupal.ahahError(xmlhttp, db.uri));
        }
      });
    }, this.delay);
};

~~~


Questa funzione, ovviamente, non deve sostituire la funzione originale, ma sovrascriverla, quindi la inseriremo in un file javascript che verrà incluso nel form che conterrà l'autocompletamento. Vediamo velocemente cosa fa questa funzione una volta modificata.

La prima marte si occupa di recuperare il valore dell'attributo _lang_ dell'oggetto che effettua l'autocompletamento, successivamente recupera l'ID dell'elemento corrente e poi va a richiamare l'oggetto con ID con valore inferiore al valore del lang impostato. Ci potrebbero essere altre soluzioni, ma questa permette di avere (vedremo successivamente), autocompletamenti multipli incrociati (per capirci se nel campo 1 metto A e nel campo 2 metto B nel campo C posso fare un autocompletamento in base a ciò che ho messo nel campo 1 e 2).

Per realizzare il campo autocompletante andiamo a creare il form nella maniera classica, ma andiamo ad aggiungere un paio di elementi aggiuntivi, in particolare il valore di _autocomplete_ che permette di andare ad indicare il path di autocomplete, e oltra questo andiamo ad indicare alcuni attributi aggiuntivi che permetto di far funzionare l'autocomplletamento con dipendenza, in particolare viene aggiunta la classe _dependence-autocomplete_ e a questo si aggiunge l'attributo _lang_ che conterrà il valore dell'id dell'elemento padre da utilizzare, a cui poi si aggiunge anche l'attributo _xml:lang_ che invece ha il compito di riportare il valore del lang dell'elemento al valore corretto (_xml:lang_ ha la precedenza su _lang_).

Il form di autocompletamento viene così generato nel sseguente modo:
<?php
function funzione_genera_form() {
  global $language;
  $form =  array();
  drupal_add_js(drupal_get_path('module','testautocomplete').'/js/script.js');
  // First autocomplete
  $form[0] = array(
    '#type'          => 'textfield',
    '#title'         => t('Frutto'),
    '#description'   => t('Inserisci un frutto'),
    '#maxlength'     => 128,
    '#attributes'    => array('class' => 'dependence-autocomplete', 'lang' => 0, 'xml:lang' => $language->language),
    '#autocomplete_path' => 'test/autocomplete',
  );
  // Second autocomplete
  $form[1] = array(
    '#type'          => 'textfield',
    '#title'         => t('Valore'),
    '#description'   => t('Description'),
    '#maxlength'     => 128,
    '#attributes'    => array('class' => 'dependence-autocomplete', 'lang' => 1, 'xml:lang' => $language->language),
    '#autocomplete_path' => 'test/autocomplete',
  );
  return $form;
}
?>

A questo punto possiamo andare ad elaborare le informazioni di ricerca nella funzione apposita dell'autocompletamento, che oltre ad avere il classico parametro di ricerca, conterrà anche l'elemento che sta facendo al ricerca e l'eventuale testo presente nell'elemento padre.
Questa funzione può essere così definita:
<?php
/** Genera l'output necessario all'autocompletamento.
 *
 * @param $string
 *   Stringa inserita che deve essere elaborata.
 *
 * @param $previous
 *   Stringa contenente il termine padre di cui trovare i figli.
 *
 * @return
 *   JSON data array
 */
function _test_autocomplete($string, $container, $previous = '') {
  // Contenitore per i dati
  $data = array();
  /* ... */
  // Riporto l'array finale
  return drupal_json($data);
}
?>

Potete trovare un esempio dell'<a href="/tutorial/multiple-autocomplete">autocompletamento in cascata</a>, mentre trovate un modulo d'esempio allegato a questo articolo.

Per domande o chiarimenti postate pure tra i commenti.
