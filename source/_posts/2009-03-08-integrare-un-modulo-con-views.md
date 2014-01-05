---
title: Integrare un modulo con views
categories: [drupal]
tags: [integrazione, moduli, sviluppo, views]
redirect: [drupal/integrare_un_modulo_views, node/78]
meta:
    description: Vediamo ora come andare ad integrare delle tabelle del nostro modulo in modo che siano collegate a views.
    tags: [drupal, integrazione, moduli, sviluppo, views]
---
<ol>
  * Alzi la mano chi non ha mai usato views.
  * Alzi la mano che l'ha mai usato.
</ol>
Ok, non proprio tutti ma buona parte di voi ha alzato la mano, questo perchè è sicuramente uno strumento potentissimo per la visualizzazione delle informazioni, quindi è fondamentale (o comunque molto utile) andare ad integrare i propri moduli con views, permettendo così la massima facilità di utilizzo successiva.

Vediamo ora come andare ad integrare delle tabelle del nostro modulo in modo che siano collegate a views.
<!--break-->
Iniziamo creando un modulo che si occupa di salvare dei dati su delle tabelle aggiuntive. Nel caso specifico aggiunge a tutti i nodi un campo checkbox che indica la disponibilità di quell'elemento (per noi ogni nodo sarà un prodotto) e il codice dell'articolo rappresentato da quel nodo.

Per fare questo andiamo a scomodare i classici _hook_form_alter()_ e _hook_nodeapi()_, non vi annoierò andando a spiegare nei minimi dettagli questa parte, ma vediamo a grandi linee il codice:
<?php
/**
 * Implementation of hook_form_alter().
 */
function viewsintegration_form_alter(&$form, $form_state, $form_id) {
  if ($form_id == 'node_type_form' && isset($form['identity']['type'])) {
    // Add configuration here
  }
  elseif (isset($form['type']) && isset($form['#node'])) {
    if ($form['type']['#value'] .'_node_form' == $form_id) {
      $node = $form['#node'];

      $form['datainfo'] = array(
        '#type'          => 'fieldset',
        '#title'         => t('Informazioni varie'),
        '#description'   => t("Informazioni varie, inserite come prova per l'integrazione con views"),
        '#weight'        => -2,
        '#collapsible'   => true,
        '#collapsed'     => false,
      );

      $form['datainfo']['aviable'] = array(
        '#type'          => 'checkbox',
        '#title'         => t('Disponibile'),
        '#description'   => t('Setta la disponibilità di questo prodotto'),
        '#required'      => TRUE,
        '#default_value' => $node->aviable,
      );

      $form['datainfo']['code'] = array(
        '#type'          => 'textfield',
        '#title'         => t('Codice del prodotto'),
        '#description'   => t('Permette di impostare il codice di questo prodotto'),
        '#required'      => true,
        '#default_value' => $node->code,
        '#maxlength'     => 32,
      );
    }
  }
}
?>
Con questo pezzo di codice aggiungiamo un elemento collassabile ai form dei nodi e andiamo a metterci all'interno il checkbox e un campo testo per l'inserimento del codice del prodotto.

La parte successiva riguarda la gestione delle informazioni inserite, operazione che può essere effettuata per le operazioni di _inseritmento_, _cancellazione_, _aggiornamento_, _caricamento_ e _visualizzazione_. Sarebbe possibile andare a fare ulteriori controlli (come la validazione), ma ora non è il punto che ci interessa, quindi bypassiamo questo passaggio.
<?php
/**
 * Implementation of hook_nodeapi().
 */
function viewsintegration_nodeapi(&$node, $op, $a3 = NULL, $a4 = NULL) {
  switch ($op) {
    case 'delete':
      $results = db_query("DELETE FROM {viewsintegration} WHERE nid = %d", $node->nid);
      break;
    case 'insert':
      $obj = new stdClass();

      $obj->aviable = $node->aviable;
      $obj->code    = $node->code;
      $obj->nid     = $node->nid;

      drupal_write_record('viewsintegration', $obj);
      break;
    case 'load':
      $data = db_fetch_object(db_query("SELECT * FROM {viewsintegration} WHERE nid = %d", $node->nid));

      $node->aviable = $data->aviable;
      $node->code    = $data->code;
      break;
    case 'update':
      $obj = new stdClass();

      $obj->aviable = $node->aviable;
      $obj->code    = $node->code;
      $obj->nid     = $node->nid;

      drupal_write_record('viewsintegration', $obj, array('nid'));
      if(! db_affected_rows()) {
        drupal_write_record('viewsintegration', $obj);
      }
      break;
    case 'view':
        $node = node_prepare($node, $teaser);

        $header = array(t('Disponibile'), t('Codice'));
        $rows[] = array(
          $node->aviable ? t('Sì') : t('No'),
          $node->code
        );

        $node->content['viewsintegration'] = array(
          '#value'  => theme('table', $header, $rows),
          '#weight' => -2,
        );

        return $node;
      break;
  }
}
?>

Ovviamente le informazioni devono essere inserite su di una tabelal del database creata in fase di installazione, anche in questo caso date un occhiata al file install che trovate nel modulo di esempio allegato che vedere come vieen generata, ma vediamo velocemente come è strutturata questa tabella:
~~~language-php
tabella:
  {viewsintegration}
campi:
  nid (INT, chiave primaria)
  aviable (INT)
  code (VARCHAR, 32 elementi)
~~~


Il primo elemento, l'**nid** che è anche la chiave primaria, serve a mantenere la relazione tra i dati inseriti e il nodo associato (campo **nid** della tabella **nodes**).

<h3>L'integrazione con views</h3>

Come prima cosa dobbiamo andare ad inserire la chiamata all'hook_views_api() che indica a quale versione delle api di views ci stiamo riferendo, nel nostro caso parliamo della versione 2, quindi avremo:
<?php
/**
 * Implementation of hook_views_api.
 */
function viewsintegration_views_api() {
  return array('api' => 2);
}
?>

In questo modo il sistema saprà che il tutto è collegato al modulo views versione 2.

Il secondo passaggio è l'inserimento della chiamata all'_hook_views_data()_ che invece si occupa di spiegare come il nostro modulo si collega a views, quali informazioni fornisce, .... Vediamo ora il codice e di seguito cosa significa:
<?php
/**
* Implementation of hook_views_data()
*/
function viewsintegration_views_data() {
  // ======================================================================
  // Generic info
  $data['viewsintegration']['table']['group']  = t('Views integration');

  $data['viewsintegration']['table']['base'] = array(
    'field'  => 'nid', // Primary key of table
    'title'  => t('Views integration'),
    'help'   => t("Tabella di esempio per l'integrazione con views"),
    'weight' => -10,
  );

  // ======================================================================
  // Table join
  $data['node']['table']['join'] = array(
    'viewsintegration' => array(
      'left_field' => 'nid',
      'field'      => 'nid',
    ),
  );

  // ======================================================================
  // Fields  of table
  $data['viewsintegration']['aviable'] = array(
    'title'  => t('Disponibilità'),
    'help'   => t('Disponibilità del prodotto'),

    'field'  => array(
      'handler'        => 'views_handler_field_boolean',
      'click sortable' => TRUE,
    ),
    // Information for accepting a name as a filter
    'filter' => array(
      'handler'        => 'views_handler_filter_boolean_operator',
    ),
  );

  // Fields  of table
  $data['viewsintegration']['code'] = array(
    'title'  => t('codice'),
    'help'   => t('codice del prodotto'),

    'field'  => array(
      'handler'        => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    // Information for accepting a name as a filter
    'filter' => array(
      'handler'        => 'views_handler_filter_string',
    ),
  );

  return $data;
}
?>

La prima parte (quella nella sezione _generic info_) riporta delle informazioni base sulla nostra tabella ceh deve essere integrata, in particolar modo il nome, la descrizione e quale è il campo che fa da chiave primaria.

La parte seguente indica come questa tabella è collegata alle altre tabelle del sistema, in particolar modo noi stiamo collegandoci alla tabella **node** mettendo in relazione i campi _nid_ di entrambe le tabelle.

La terza parte della funzione, invece, ci spiega come devono essere interpretati di diversi campi della tabella, per ogniuno di questi campi che deve essere raggiungbile dalle views si possono definire una serie di informazioni (_sorting_, _field_, _argument_, ...), per ogniuno di questo c'è da inticare un handler, cioè un modo in cui quest'informazione deve essere interpretata (possono essere creati degli handler specifici, ma non affronteremo questo punto ora).

Nel caso in esempio abbiamo detto che i nostri campi sono, il primo, un campo boolenao, mentre il secondo una stringa di testo, di conseguenza il sistema permetterà di effettaure tutta una serie di operazioni su di questi come definitio in appositi file; in particolare sarà possibile usare tutti i meccanismi dei filtri, l'exposition, il sorting, ...

Per conoscere le diverse tipologie di handler disponibili di default vi consiglio di dare un occhiata al contenuto della cartella _/sites/all/modules/views/handlers_.

L'ultimo punto che affrontiamo è l'inserimento di views predefinite nel nostro modulo. Innanzitutto creiamo la nostra views da interfaccia grafica (a meno che vi vogliate così male da farlo da codice :D ) e andiamo nella pagina di export della views, a questo punto copiamo il codice e inseriamo all'intenro dell'_hook_views_default()_, otterremo così la nostra views bella e pronta ogni volta che installeremo il nostro modulo.

<?php
/**
 * Implementation of hook_views_default_views.
 */
function viewsintegration_views_default_views() {
  $view = new view;
  $view->name = 'viewsintegration_lista_articoli';
  $view->description = 'Elenco degli articoli';
  $view->tag = '';
  $view->view_php = '';
  $view->base_table = 'viewsintegration';
  $view->is_cacheable = FALSE;
  $view->api_version = 2;
  $view->disabled = FALSE;
  $handler = $view->new_display('default', 'Defaults', 'default');
  $handler->override_option('fields', array(
    'title' => array(
      'label' => 'Title',
      'link_to_node' => 0,
      'exclude' => 0,
      'id' => 'title',
      'table' => 'node',
      'field' => 'title',
      'relationship' => 'none',
    ),
    'aviable' => array(
      'label' => 'Disponibilità',
      'exclude' => 0,
      'id' => 'aviable',
      'table' => 'viewsintegration',
      'field' => 'aviable',
      'relationship' => 'none',
    ),
    'code' => array(
      'label' => 'codice',
      'exclude' => 0,
      'id' => 'code',
      'table' => 'viewsintegration',
      'field' => 'code',
      'relationship' => 'none',
    ),
  ));
  $handler->override_option('filters', array(
    'aviable' => array(
      'operator' => '=',
      'value' => '1',
      'group' => '0',
      'exposed' => TRUE,
      'expose' => array(
        'operator' => '',
        'identifier' => 'aviable',
        'label' => 'Disponibilità',
        'optional' => 1,
        'remember' => 1,
      ),
      'id' => 'aviable',
      'table' => 'viewsintegration',
      'field' => 'aviable',
      'relationship' => 'none',
    ),
    'code' => array(
      'operator' => 'contains',
      'value' => '',
      'group' => '0',
      'exposed' => TRUE,
      'expose' => array(
        'use_operator' => 0,
        'operator' => 'code_op',
        'identifier' => 'code',
        'label' => 'Codice prodotto',
        'optional' => 1,
        'remember' => 1,
      ),
      'case' => 0,
      'id' => 'code',
      'table' => 'viewsintegration',
      'field' => 'code',
      'relationship' => 'none',
    ),
  ));
  $handler->override_option('access', array(
    'type' => 'none',
  ));
  $handler->override_option('style_plugin', 'table');
  $handler->override_option('style_options', array(
    'grouping' => '',
    'override' => 1,
    'sticky' => 0,
    'order' => 'asc',
    'columns' => array(
      'title' => 'title',
      'aviable' => 'aviable',
    ),
    'info' => array(
      'title' => array(
        'sortable' => 0,
        'separator' => '',
      ),
      'aviable' => array(
        'sortable' => 0,
        'separator' => '',
      ),
    ),
    'default' => '-1',
  ));
  $handler = $view->new_display('page', 'Page', 'page_1');
  $handler->override_option('path', 'product-list');
  $handler->override_option('menu', array(
    'type' => 'normal',
    'title' => 'Elenco prodotti',
    'weight' => '0',
    'name' => 'navigation',
  ));
  $handler->override_option('tab_options', array(
    'type' => 'none',
    'title' => '',
    'weight' => 0,
  ));
  $views[$view->name] = $view;
  return $views;
}
?>

Vederemo le prossime volte come andare a creare dei propri handler e andare a creare delle estensioni "più particolari" per views.

Se nel frattemo vi sorgono domande non esitate a farle :D
