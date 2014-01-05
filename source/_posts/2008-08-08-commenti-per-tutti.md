---
title: Commenti per tutti
categories: [drupal]
tags: [commenti, permessi, utenti]
redirect: [drupal/commenti_per_tutti, node/56]
meta:
    description: In Drupal ogni contenuto può avere i commenti abilitati o non abilitati di default in base al tipo di contenuto di cui si tratta, questa operazione viene settata normalmente dall'admin che si occupa di gestire i contenuti, eventualemnte in fase di creazione del contenuti chi ha i giusti permessi (<em>admin comment</em>) può decidere se abilitare, disabilitare o rendere in sola lettura i commenti per il singolo contenuto. per fare questo, però, l'utente acquisisce anche dei permessi extra che gli eprmettono di amministrare i commenti.
    tags: [drupal, commenti, permessi, utenti]
---
In Drupal ogni contenuto può avere i commenti abilitati o non abilitati di default in base al tipo di contenuto di cui si tratta, questa operazione viene settata normalmente dall'admin che si occupa di gestire i contenuti, eventualemnte in fase di creazione del contenuti chi ha i giusti permessi (_admin comment_) può decidere se abilitare, disabilitare o rendere in sola lettura i commenti per il singolo contenuto. per fare questo, però, l'utente acquisisce anche dei permessi extra che gli eprmettono di amministrare i commenti.

Affrontiamo ora il problema andando a creare un nuovo tipo di permesso per permettere agli utenti di scegliere se il nostro contenuto potrà avere o meno i commenti, senza però permettergli di agire della parte di amministrazione. La scelta ceh ho fatto è stata quella di andare a modificare il fle del modulo comment presente come paccehtto base di Drupal, nonostante fossero possibili altre soluzioni.

Sarebbe stato possibile creare un nuovo modulo che andasse ad interfacciarsi permettendo così di aggiungere la possibilità di scegliere le impostazioni di commento per il modulo, ma questa operazione sarebbe stata più lunga e, nonostante potesse essere più pulita, avrebbe comportato la creazione anche di tutta una serie di funzioni accessorie che avrebbero appesantito il nostro sistema, causando un maggiore consumo di memoria (creo un nuovo modulo che deve essere caricato sul server e mandato in esecuzione, ...), ho quindi preferito modificare il modulo in questione, la modifica è indolore e richiede giusto un paio di passaggi.

Innanzituto apriamo il file _/modules/comment/comment.module_, e andiamo a trovare la funzione che crea i permessi per l'utente; aggiungiamone uno, andando a modificarla da:
<?php
**
 * Implementation of hook_perm().
 */
function comment_perm() {
  return array('access comments',
    'post comments',
    'administer comments',
    'post comments without approval'
  );
}
?>a
<?php
**
 * Implementation of hook_perm().
 */
function comment_perm() {
  return array('access comments',
    'post comments',
    'administer comments',
    'post comments without approval',
    'admin comment for own node'
  );
}
?>
come si può notare è stato aggiunto il permesso _admin comment for own node_

Successivamente andiamo a cercare la funzione _C:\Programmi\xampp\htdocs\test\modules\comment\comment.module_ e trasformiamola da:
<?php
function comment_form_alter($form_id, &$form) {
  if ($form_id == 'node_type_form' && isset($form['identity']['type'])) {
    $form['workflow']['comment'] = array(
      '#type' => 'radios',
      '#title' => t('Default comment setting'),
      '#default_value' => variable_get('comment_'. $form['#node_type']->type, COMMENT_NODE_READ_WRITE),
      '#options' => array(t('Disabled'), t('Read only'), t('Read/Write')),
      '#description' => t('Users with the _administer comments_ permission will be able to override this setting.'),
    );
  }
  elseif (isset($form['type'])) {
    if ($form['type']['#value'] .'_node_form' == $form_id) {
      $node = $form['#node'];
      $form['comment_settings'] = array(
        '#type' => 'fieldset',
        '#access' => user_access('administer comments'),
        '#title' => t('Comment settings'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#weight' => 30,
      );
      $form['comment_settings']['comment'] = array(
        '#type' => 'radios',
        '#parents' => array('comment'),
        '#default_value' => $node->comment,
        '#options' => array(t('Disabled'), t('Read only'), t('Read/Write')),
      );
    }
  }
}
?>
a
<?php
function comment_form_alter($form_id, &$form) {
  if ($form_id == 'node_type_form' && isset($form['identity']['type'])) {
    $form['workflow']['comment'] = array(
      '#type' => 'radios',
      '#title' => t('Default comment setting'),
      '#default_value' => variable_get('comment_'. $form['#node_type']->type, COMMENT_NODE_READ_WRITE),
      '#options' => array(t('Disabled'), t('Read only'), t('Read/Write')),
      '#description' => t('Users with the _administer comments_ permission will be able to override this setting.'),
    );
  }
  elseif (isset($form['type'])) {
    if ($form['type']['#value'] .'_node_form' == $form_id) {
      $node = $form['#node'];
      global $user;
      $choise_comment = false;
      if( $node->uid == $user->uid ) {
        $choise_comment = user_access('admin comment for own node');
      }
      if( ! $choise_comment ) {
        $choise_comment = user_access('administer comments');
      }
      $form['comment_settings'] = array(
        '#type' => 'fieldset',
        '#access' => $choise_comment,
        '#title' => t('Comment settings'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#weight' => 30,
      );
      $form['comment_settings']['comment'] = array(
        '#type' => 'radios',
        '#parents' => array('comment'),
        '#default_value' => $node->comment,
        '#options' => array(t('Disabled'), t('Read only'), t('Read/Write')),
      );
    }
  }
}
?>

Questo è tutto, saliamo il modulo comment modificato e andiamo ad abilitare il permesso di modifica dei commenti solo per il proprio nodo al ruolo a cui ci ineressava dare questa opzione.

NB: attenzione in fase di aggiornamento del paccehtto del core a ripristinare ogni volta il file modificato, per evitare errori potreste togliere i permessi di scrittura a tuttti gli utenti (permessi impostati a _555_) in modo da non compiere questa operazione per errore
