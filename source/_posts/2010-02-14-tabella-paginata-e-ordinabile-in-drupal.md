---
title: Tabella paginata e ordinabile in Drupal
categories: [Drupal]
tags: [codice, paginazione, sorting, tabella]
---
Nella realizzazione di interfaccie di report può capitare di dover creare delle tabelle che visualizziino una serie di informazioni. Spesso, se i dati sono molti, è necessario ricorrere alla creazione di tabelle paginate. In altri casi, o in aggiunta a questo, può essere necessario andare a realizzare dei sistemi che permettano di fvariare i criteri di ordinamento dei dati estratti, così da migliorare l'usabilità del sistema.

Queste operazioni spesso sono operazioni che porterebero via un pò di tempo per la realizzazione e sono decisamente poco divertenti da implmentare (ma servono e quindi devono essere fatte). Vediamo come possiamo velocizzarne la realizzazione con Drupal.
<!--break-->
Innanzitutto è necessario individuare i dati che dobbliamo andare a visualizzare, in questo esempio ipotizzeremo di avere una tabella dei prodotti in cui sono memoriizzati una serie di campi, tra i quali:
<dl>
  <dt>code</dt><dd>Il codice del prodotto.</dd>
  <dt>decript</dt><dd>La descrizione del prodotto.</dd>
  <dt>price</dt><dd>Il prezzo di vendita unitario del prodotto.</dd>
  <dt>quantity</dt><dd>La rimanenza a magazzino del prodotto.</dd>
</dl>

Questi dati devono essere visualizzati in una tabella e poichè la quantità di prodotti è elevata decidiamo di mantenere una paginazione che mosti 25 elementi per volta.

Iniziamo a definire quale è la query iniziale per l'estrazione dei dati, tralasciando il fatto che si debba limitare l'estrazione ai 25 prodotti.
<?php
  $query = "SELECT code, descript, price, quantity FROM {test_sortable}";
?>
come buona norma ricordiamoci di estrarre i camppi elencando i nomi effettivi e non usando _*_ e usando il nome della tabella tra graffe per permettere al sistema di funzionare anche in caso si utilizzino table prefix.


<h2>La paginazione</h2>
L'aggiunta del sistema di paginazine è quantomeno banale, è sufficiente utilizzare la funzione _pager_query_ per ottenere il risultato desiderato:
<?php
  $q = pager_query($query, 25);
?>
in questo modo si dice al sistema di occuparsi della paginazione estraendo solamente 25 elementi per volta.

Proseguiamo all'estrazione dei dati e alla loro rappresentazione in tabella tramite:
<?php
  $header = array(
    t("Codice"),
    t("Descrizione"),
    t("Prezzo"),
    t("Quantità"),
  );
  
  // Estraggo i valori da inserire in tabella
  while($res = db_fetch_array($q)) {
    // Estrai i dati e generi le $rows
    $rows[] = array(
      $res['code'],
      $res['descript'],
      $res['price'],
      $res['quantity'],
    );
  }
  
  // Temizzo la tabella
  $output  = theme('table', $header, $rows);
?>
e successivamente aggiugiamo nell'output la visualizzazione del paginatore:
<?php
  // Temizzo il pager
  $output .= theme('pager', NULL, 25, 0);
?>
Già in questo modo abbiamo visualizzato i nostri dati in tabella con paginazione.

Volendo sarebbe possibile ridurre ulteriormente la quantià di codice scritto, in particolare nella generazione delle righe della tabella, dato che i valori estratti sono già rappresentati da un array, potremmo avere semplicemente:
<?php
  // Estraggo i valori da inserire in tabella
  while($res = db_fetch_array($q)) {
    // Estrai i dati e generi le $rows
    $rows[] = $res;
  }
?>
anche se questo modo di scrivere potrebbe risultare, a chi non è abbituato, meno intuitivo.

<h2>L'ordinamento</h2>
All'inizio avevamo anche espresso l'interesse per avere delle tabelle con dati ordinabili a discrezione dell'utente. Nulla di più banale da realizzare, dovremmo svlgere solamente alcuni semplici passaggi. Il primo riguarda il modo di definizione dell'header della tabella, che ora cambia un pò. Vediamo come deve essere rappresnetato:
<?php
  $header = array(
    array(
      'data'  => t('Codice'),
      'field' => 'code',
      'sort'  => 'desc',
    ),
    array(
      'data'  => t('Descrizione'),
      'field' => 'descript',
      'sort'  => 'desc',
    ),
    array(
      'data'  => t('Prezzo'),
      'field' => 'price',
      'sort'  => 'desc',
    ),
    array(
      'data'  => t('Rimanenze'),
      'field' => 'quantity',
      'sort'  => 'desc',
    ),
  );
?>
Come vedete ogni campo è orarappresentato da un array anzichè da una solo valore. Questo array ha una serie di parametri che risultano essere:
<dl>
  <dt>data</dt><dd>Il testo che sarà visibile all'utente all'interno della tabella.</dd>
  <dt>field</dt><dd>Il nome del campo che verrà utilizzato per l'ordinamento all'interno della query.</dd>
  <dt>sort</dt><dd>Il valore di ordianmento predefinito per questo campo.</dd>
</dl>

Una volta indicato l'header con i campi che devono essere ordinabili e le informazioni ad esse collegate, proseguiamo andando a modificare la query di ordinamento tramite la funzione _tablesort_sql_.
Il codice di estrazione dei dati ora diventa:
<?php
  // La rendo ordinabile secondo i paraetrui scelti dall'utente
  $query .= tablesort_sql($header);
?>
E deve essere inserito subito dopo la definizione della query (e prima dell'inserimento del sistema di paginazione).

Fatto questo avremo il risultato atteso, ovvero una tabella con i risultati paginati e con la possibilità di variare il criterio di ordinamento semplicemente cliccando sull'intestazione della tabella il campo che vogliamo usare per l'ordinamento. Potete trovare un esempio in <a href="/elenco_prodotti">questa pagina</a> o scaricarvi il modulo di esempio che trovate in allegato a questa pagina.