---
title: Tagcloud con views
categories: [drupal]
tags: [css, tagcloud, views]
redirect: [drupal/tagcloud_views, node/75]
meta:
    description: La tagcloud, elemento molto in voga fino a poco tempo fa e che un pò alla volta sta scemando, ma che comunque non va mai dimenticata per diversi motivi (aiuta gli utenti, fa bene al SEO, ...) Vediamo ora come realizzarla tramite views.
    tags: [drupal, css, tagcloud, views]
---
La tagcloud, elemento molto in voga fino a poco tempo fa e che un pò alla volta sta scemando, ma che comunque non va mai dimenticata per diversi motivi (aiuta gli utenti, fa bene al SEO, ...) Vediamo ora come realizzarla tramite views.
<!--break-->
Innazitutto è necessario aver installato il modulo che permette di creare views di tipo tagcloud, quindi andiamo alla pagina di <a href="http://drupal.org/project/views_cloud">presentazione del modulo</a>, scarichiamolo, decomprimiamolo, carichiamolo sul server e abilitiamo il modulo (si, ok, sono sempre le stesse procedure, ma ricordarle ogni tanto non fa male). Ricordo che come dipendenza del modulo serve anche <a href="http://drupal.org/project/views">views</a>, quindi se non lo avete già installato dovete farlo IMMEDIATAMENTE :)

Fatto questo andiamo alla pagina di import delle views (_Admin_ -> _Build_ -> _Views_ -> _Import_), e a questo punto andiamo ad inserire questo codice:

~~~language-php

$view = new view;
$view->name = 'tag_cloud';
$view->description = 'Tag cloud';
$view->tag = '';
$view->view_php = '';
$view->base_table = 'node';
$view->is_cacheable = FALSE;
$view->api_version = 2;
$view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */
$handler = $view->new_display('default', 'Defaults', 'default');
$handler->override_option('fields', array(
  'name' => array(
    'label' => '',
    'link_to_taxonomy' => 1,
    'exclude' => 0,
    'id' => 'name',
    'table' => 'term_data',
    'field' => 'name',
    'relationship' => 'none',
  ),
  'created' => array(
    'label' => 'Post date',
    'date_format' => 'small',
    'custom_date_format' => '',
    'exclude' => 0,
    'id' => 'created',
    'table' => 'node',
    'field' => 'created',
    'relationship' => 'none',
  ),
  'teaser' => array(
    'id' => 'teaser',
    'table' => 'node_revisions',
    'field' => 'teaser',
  ),
));
$handler->override_option('sorts', array(
  'created' => array(
    'id' => 'created',
    'table' => 'node',
    'field' => 'created',
  ),
));
$handler->override_option('arguments', array(
  'name' => array(
    'default_action' => 'summary asc',
    'style_plugin' => 'cloud_summary',
    'style_options' => array(
      'count' => 1,
      'override' => 0,
      'items_per_page' => '25',
      'randomize' => 1,
    ),
    'wildcard' => 'all',
    'wildcard_substitution' => 'All',
    'title' => '',
    'default_argument_type' => 'fixed',
    'default_argument' => '',
    'validate_type' => 'none',
    'validate_fail' => 'not found',
    'glossary' => 0,
    'limit' => '0',
    'case' => 'none',
    'path_case' => 'none',
    'transform_dash' => 0,
    'add_table' => 0,
    'require_value' => 0,
    'id' => 'name',
    'table' => 'term_data',
    'field' => 'name',
    'relationship' => 'none',
    'default_options_div_prefix' => '',
    'default_argument_user' => 0,
    'default_argument_fixed' => '',
    'default_argument_php' => '',
    'validate_argument_node_type' => array(
      'feed' => 0,
      'page' => 0,
      'story' => 0,
    ),
    'validate_argument_node_access' => 0,
    'validate_argument_nid_type' => 'nid',
    'validate_argument_vocabulary' => array(
      '2' => 0,
      '3' => 0,
      '4' => 0,
      '5' => 0,
      '6' => 0,
      '7' => 0,
      '8' => 0,
      '9' => 0,
      '10' => 0,
      '11' => 0,
      '12' => 0,
      '13' => 0,
      '14' => 0,
      '15' => 0,
      '16' => 0,
      '17' => 0,
      '18' => 0,
      '19' => 0,
      '20' => 0,
      '21' => 0,
      '22' => 0,
      '23' => 0,
      '24' => 0,
      '25' => 0,
      '26' => 0,
      '27' => 0,
      '28' => 0,
      '29' => 0,
      '30' => 0,
      '31' => 0,
      '32' => 0,
      '33' => 0,
      '34' => 0,
      '35' => 0,
      '36' => 0,
      '37' => 0,
      '38' => 0,
      '39' => 0,
      '1' => 0,
      '40' => 0,
    ),
    'validate_argument_type' => 'tid',
    'validate_argument_php' => '',
  ),
));
$handler->override_option('access', array(
  'type' => 'none',
));
$handler->override_option('items_per_page', 0);
$handler->override_option('distinct', 0);
$handler->override_option('style_plugin', 'cloud');
$handler->override_option('style_options', array(
  'grouping' => 'name',
  'weight_field' => 'created',
  'hide_weight_field' => 1,
  'randomize' => 1,
));
$handler = $view->new_display('page', 'Page', 'page_1');
$handler->override_option('fields', array(
  'name' => array(
    'label' => '',
    'link_to_taxonomy' => 1,
    'exclude' => 1,
    'id' => 'name',
    'table' => 'term_data',
    'field' => 'name',
    'relationship' => 'none',
    'override' => array(
      'button' => 'Use default',
    ),
  ),
  'created' => array(
    'label' => 'Post date',
    'date_format' => 'small',
    'custom_date_format' => '',
    'exclude' => 1,
    'id' => 'created',
    'table' => 'node',
    'field' => 'created',
    'relationship' => 'none',
    'override' => array(
      'button' => 'Use default',
    ),
  ),
  'title' => array(
    'label' => '',
    'link_to_node' => 1,
    'exclude' => 0,
    'id' => 'title',
    'table' => 'node',
    'field' => 'title',
    'override' => array(
      'button' => 'Use default',
    ),
    'relationship' => 'none',
  ),
  'teaser' => array(
    'label' => '',
    'exclude' => 0,
    'id' => 'teaser',
    'table' => 'node_revisions',
    'field' => 'teaser',
    'override' => array(
      'button' => 'Use default',
    ),
    'relationship' => 'none',
  ),
));
$handler->override_option('sorts', array(
  'created' => array(
    'order' => 'DESC',
    'granularity' => 'second',
    'id' => 'created',
    'table' => 'node',
    'field' => 'created',
    'override' => array(
      'button' => 'Use default',
    ),
    'relationship' => 'none',
  ),
));
$handler->override_option('arguments', array(
  'name' => array(
    'default_action' => 'summary asc',
    'style_plugin' => 'unformatted_summary',
    'style_options' => array(
      'count' => 1,
      'override' => 0,
      'items_per_page' => '25',
      'inline' => 0,
      'separator' => '',
    ),
    'wildcard' => 'all',
    'wildcard_substitution' => 'All',
    'title' => '',
    'default_argument_type' => 'fixed',
    'default_argument' => '',
    'validate_type' => 'none',
    'validate_fail' => 'not found',
    'glossary' => 0,
    'limit' => '0',
    'case' => 'none',
    'path_case' => 'none',
    'transform_dash' => 0,
    'add_table' => 0,
    'require_value' => 0,
    'id' => 'name',
    'table' => 'term_data',
    'field' => 'name',
    'relationship' => 'none',
    'default_options_div_prefix' => '',
    'default_argument_user' => 0,
    'default_argument_fixed' => '',
    'default_argument_php' => '',
    'validate_argument_node_type' => array(
      'feed' => 0,
      'page' => 0,
      'story' => 0,
    ),
    'validate_argument_node_access' => 0,
    'validate_argument_nid_type' => 'nid',
    'validate_argument_vocabulary' => array(
      '2' => 0,
      '3' => 0,
      '4' => 0,
      '5' => 0,
      '6' => 0,
      '7' => 0,
      '8' => 0,
      '9' => 0,
      '10' => 0,
      '11' => 0,
      '12' => 0,
      '13' => 0,
      '14' => 0,
      '15' => 0,
      '16' => 0,
      '17' => 0,
      '18' => 0,
      '19' => 0,
      '20' => 0,
      '21' => 0,
      '22' => 0,
      '23' => 0,
      '24' => 0,
      '25' => 0,
      '26' => 0,
      '27' => 0,
      '28' => 0,
      '29' => 0,
      '30' => 0,
      '31' => 0,
      '32' => 0,
      '33' => 0,
      '34' => 0,
      '35' => 0,
      '36' => 0,
      '37' => 0,
      '38' => 0,
      '39' => 0,
      '1' => 0,
      '40' => 0,
    ),
    'validate_argument_type' => 'tid',
    'validate_argument_php' => '',
  ),
));
$handler->override_option('distinct', 1);
$handler->override_option('style_plugin', 'default');
$handler->override_option('style_options', array());
$handler->override_option('row_plugin', 'node');
$handler->override_option('row_options', array(
  'teaser' => 1,
  'links' => 1,
  'comments' => 0,
));
$handler->override_option('path', 'tagcloud');
$handler->override_option('menu', array(
  'type' => 'none',
  'title' => 'Tags',
  'description' => '',
  'weight' => '0',
  'name' => 'primary-links',
));
$handler->override_option('tab_options', array(
  'type' => 'none',
  'title' => '',
  'description' => '',
  'weight' => 0,
));
$handler = $view->new_display('block', 'Block', 'block_1');
$handler->override_option('items_per_page', 50);
$handler->override_option('block_description', '');
$handler->override_option('block_caching', -1);

~~~


Ora andando nella pagina di gestione dei blocchi e troveremo un blocco (Tag cloud) che potremmo posizionare dove desideriamo. Una volta creata la view vediamo come possiamo personalizzarla.

Accediamo all'interfaccia di edit della views e poi selezioniamo dal menu laterale sinistro la scheda block, ci si aprirà una finestra simile a:

<img src="/files/articolo/75/tagcloud_edit_jpeg_18889.jpeg" alt="Interfaccia di amministraione di views" />

a questo punto selezioniamo il numero 50 che indica il numero di termini che devono essere presenti nel tag cloud e ci si aprirà una finestra del genere:

<img src="/files/articolo/75/tagcloud_edit_post_jpeg_11081.jpeg" alt="Interfaccia di amministrazione della views nella fase di editing del numero di tag da visualizzare." />

Dove possiamo settare il numero di elementi da visualizzare nel tag cloud, una volta inserito il valore desiderato scegliere salva e salvare la views, in questo modo il blocco cambierà per rispettare i nostri valori inseriti.

Se volete fare in modo che la vostra cloud contenga i link relativi alle pagine con i diversi elementi, mantenedo lo stesso path (e non come nel caso precedente con path differenti), si deve andare ad utilizzare la seguente views da importare come visto precedentemente:
~~~language-php
$view = new view;
$view->name = 'tag_cloud';
$view->description = 'Tag cloud';
$view->tag = '';
$view->view_php = '';
$view->base_table = 'node';
$view->is_cacheable = FALSE;
$view->api_version = 2;
$view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */
$handler = $view->new_display('default', 'Defaults', 'default');
$handler->override_option('fields', array(
  'name' => array(
    'label' => '',
    'link_to_taxonomy' => 0,
    'exclude' => 0,
    'id' => 'name',
    'table' => 'term_data',
    'field' => 'name',
    'relationship' => 'none',
  ),
  'created' => array(
    'label' => 'Post date',
    'date_format' => 'small',
    'custom_date_format' => '',
    'exclude' => 0,
    'id' => 'created',
    'table' => 'node',
    'field' => 'created',
    'relationship' => 'none',
  ),
));
$handler->override_option('sorts', array(
  'created' => array(
    'id' => 'created',
    'table' => 'node',
    'field' => 'created',
  ),
));
$handler->override_option('arguments', array(
  'name' => array(
    'default_action' => 'summary asc',
    'style_plugin' => 'cloud_summary',
    'style_options' => array(
      'count' => 1,
      'override' => 0,
      'items_per_page' => '25',
      'randomize' => 1,
    ),
    'wildcard' => 'all',
    'wildcard_substitution' => 'All',
    'title' => '',
    'default_argument_type' => 'fixed',
    'default_argument' => '',
    'validate_type' => 'none',
    'validate_fail' => 'not found',
    'glossary' => 0,
    'limit' => '0',
    'case' => 'none',
    'path_case' => 'none',
    'transform_dash' => 0,
    'add_table' => 0,
    'require_value' => 0,
    'id' => 'name',
    'table' => 'term_data',
    'field' => 'name',
    'relationship' => 'none',
    'default_options_div_prefix' => '',
    'default_argument_user' => 0,
    'default_argument_fixed' => '',
    'default_argument_php' => '',
    'validate_argument_node_type' => array(
      'feed' => 0,
      'page' => 0,
      'story' => 0,
    ),
    'validate_argument_node_access' => 0,
    'validate_argument_nid_type' => 'nid',
    'validate_argument_vocabulary' => array(
      '2' => 0,
      '3' => 0,
      '4' => 0,
      '5' => 0,
      '6' => 0,
      '7' => 0,
      '8' => 0,
      '9' => 0,
      '10' => 0,
      '11' => 0,
      '12' => 0,
      '13' => 0,
      '14' => 0,
      '15' => 0,
      '16' => 0,
      '17' => 0,
      '18' => 0,
      '19' => 0,
      '20' => 0,
      '21' => 0,
      '22' => 0,
      '23' => 0,
      '24' => 0,
      '25' => 0,
      '26' => 0,
      '27' => 0,
      '28' => 0,
      '29' => 0,
      '30' => 0,
      '31' => 0,
      '32' => 0,
      '33' => 0,
      '34' => 0,
      '35' => 0,
      '36' => 0,
      '37' => 0,
      '38' => 0,
      '39' => 0,
      '1' => 0,
      '40' => 0,
    ),
    'validate_argument_type' => 'tid',
    'validate_argument_php' => '',
  ),
));
$handler->override_option('access', array(
  'type' => 'none',
));
$handler->override_option('items_per_page', 0);
$handler->override_option('distinct', 0);
$handler->override_option('style_plugin', 'cloud');
$handler->override_option('style_options', array(
  'grouping' => 'name',
  'weight_field' => 'created',
  'hide_weight_field' => 1,
  'randomize' => 1,
));
$handler = $view->new_display('block', 'Block', 'block_1');
$handler->override_option('items_per_page', 50);
$handler->override_option('block_description', '');
$handler->override_option('block_caching', -1);

~~~


Dopo averla importata andate a modificare il file _views-cloud-summary-style.tpl.php_ che trovate nella vostra cartella del modulo _views_cloud_ inserendoci il seguente codice:
~~~language-php
<?php
/**
 * @file views-cloud-summary-style.tpl.php
 * View template to display a list summaries as a weighted cloud (edited by mavimo)
 *
 * - $rows contains a nested array of rows. Each row contains an array of
 *   columns.
 */
?>
<div class="views-cloud">

  <?php foreach ($rows as $row): ?>
    <li class="views-cloud-size-<?php print $row->cloud_size; ?>">
      <?php $terms = taxonomy_get_term_by_name($row->term_data_name); ?>
      <a href="<?php print url('taxonomy/term/' . $terms[0]->tid); ?>"><?php print $row->link; ?></a>&nbsp;<?php if (!empty($options['count'])): ?><span class="views-cloud-count">(<?php print $row->count?>)</span><?php endif; ?>

  <?php endforeach; ?>

</div>

~~~


a questo punto andiamo a posizionare il blocco come fatto precedentemente e tutto dovrebbe andare senza problemi.

Purtroppo la relase attuale del modulo soffre di un piccolo (PICCOLO???!!??!!!) bug, la cloud non funziona su Internet Explorer, potete ovviare andando a modificare il file _views_cloud.css_ presente nella cartella del modulo sostituendo il contenuto con:

~~~language-php
div.views-cloud ul {
  list-style: none;
  text-align: center;
  line-height: 1.2;
}
div.views-cloud ul li, div.views-cloud div {
  display: inline;
  background: none;
  padding: 0px;
  margin: 0px;
}
span.views-cloud-count {
  font-size: small;
  color: lightgrey;
}
li.views-cloud-size-1, div.views-cloud-size-1 { font-size: 1em; }
li.views-cloud-size-2, div.views-cloud-size-2 { font-size: 1.5em; }
li.views-cloud-size-3, div.views-cloud-size-3 { font-size: 2em; }
li.views-cloud-size-4, div.views-cloud-size-4 { font-size: 2.5em; }
li.views-cloud-size-5, div.views-cloud-size-5 { font-size: 3em; }
li.views-cloud-size-6, div.views-cloud-size-6 { font-size: 3.5em; }
li.views-cloud-size-7, div.views-cloud-size-7 { font-size: 4em; }
~~~


Commenti e critiche sono benvenuti.
