---
title: Alterare lo schema di un modulo
categories: [drupal]
tags: [db layer, hook_schema_alter, php]
redirect: [drupal/alterare_lo_schema_un_modulo, node/100]
meta:
    description: Può capitare, a volte, di dover alterare lo schema di una tabella creata da un altro modulo, vedremo come effettuare questa operazione nella mianera corretta mantenendo l'integrità della struttura rappresentata dallo schema e quella effettivamente presente nel database.
    tags: [drupal, db layer, hook_schema_alter, php]
---
Può capitare, a volte, di dover alterare lo schema di una tabella creata da un altro modulo, vedremo come effettuare questa operazione nella mianera corretta mantenendo l'integrità della struttura rappresentata dallo schema e quella effettivamente presente nel database.
<!--break-->
Un breve promemoria, il DB Layer di Drupal si basa su di una struttura mantenuta all'intenro di un array, questa informazione viene elaborata ad ogni update/installazione/rimozione di modulo; la struttura definitiva viene mantenuta in cache per ottimizzare la struttura senza dover ogni volta andare a ricostruire la stessa.

Per la generazione dello schema il sistema opera in due fasi. Iniziialmente chiama tutti gli hook_schema() e effettua il merge degli array per avere la struttura dello schema generata dai moduli, successivamente (nella seconda fase) viene chiamato l'hook_schema_alter() che permette di effettuare delle modifiche all'interno dello schema.

In questa seconda operazione riceviamo (per riferimento) lo schema ottenuto dalla prima fase ed è quindi possibile andare ad aggiungere, modificare o rimuovere elementi dallo schema. Oltre a questa operazione (che si occupa solo di modificare lo schema) è necessario modificare anche la struttura del database, per effettuare questa operazioni ricorriamo, all'interno dell'hook_install(), la funzione db_add_field().

Vediamo ora in pratica come andare ad aggiungere all'interno di uno schema, generato da un modulo esterno al nostro, un campo; nel caso specifico vogliamo aggiungere all'interno della tabella degli utenti (tabella _users_) un nuovo campo che indica il peso che l'utente ha all'interno di un elenco.

Come prima cosa il nostro modulo dovrà implementare all'interno del file install l'hook_schema_alter(), quindi (ipotizzando che il nostro modulo si chiami _classifica_utenti_) avremo:
<?php
/**
 * Implementation of hook_schema_alter().
 */
function classifica_utenti_schema_alter(&$schema) {
  $schema['users']['fields']['classifica'] = array(
    'description' => t("Peso nella classifica dell'utente"),
    'type'        => 'int',
    'unsigned'    => TRUE,
    'not null'    => TRUE,
    'default'     => 0,
  );
}
?>
A questo punto lo schema conterrà l'informazione, ma questa non è ancora stata costruita all'interno del database, un modo per procedere all'aggiunta del campo nel DB è ricorrere alla funzione sopra citata, quindi avremo:
<?php
/**
 * Implementation of hook_install().
 */
function classifica_utenti_install() {
  $ret = array();
  db_add_field($ret, 'users', 'classifica', array(
    'description' => t("Peso nella classifica dell'utente"),
    'type'        => 'int',
    'unsigned'    => TRUE,
    'not null'    => TRUE,
    'default'     => 0,
  ));
}
?>
La funzione db_add_field accetta una serie di parametri, in particolare il primo parametro è un array cche viene utilizzato per gestire il valore di ritorno, il secondo è una stringa che indica in quale tabella deve essere inserito il campo, metrne il terzo campo indica ilnome del field che deve essere aggiunto nel DB.
Il parametro successivo indica la struttura del field che deve essere inserito nel database (per informazioni più dettagliate vi rimando alle <a href="http://api.drupal.org/api/functions/db_add_field/6">API</a>).

Buon Drupal coding a tutti!
