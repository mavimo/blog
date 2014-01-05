---
title: Installare Drupal 5 su netsons
categories: [drupal]
tags: [netsons]
redirect: [druapl/installare_versione_5_su_netsons, node/22]
meta:
    description: Per eseguire l&#39;installazione di Drupal 5 su <a href="http://www.netsons.org/">netsons</a> &egrave; necessario attivare un account (o utilizzare un account gi&agrave; esistente) e abilitare, dal <a href="http://www.netsons.org/control.php">pannello di controllo</a> MySQL 5 e PHP 5 (Attenzione, l&#39;abilitazione avverr&agrave; entro 24 ore, attendete l&#39;abilitazione prima di proseguire!). Fatte queste semplici operazioni dovete saricare la versione modificata di <a href="http://www.drupal.org">Drupal</a> che trovate come allegato a questo articolo.
    tags: [drupal, netsons]
---
Per eseguire l&#39;installazione di Drupal 5 su <a href="http://www.netsons.org/">netsons</a> &egrave; necessario attivare un account (o utilizzare un account gi&agrave; esistente) e abilitare, dal <a href="http://www.netsons.org/control.php">pannello di controllo</a> MySQL 5 e PHP 5 (Attenzione, l&#39;abilitazione avverr&agrave; entro 24 ore, attendete l&#39;abilitazione prima di proseguire!). Fatte queste semplici operazioni dovete saricare la versione modificata di <a href="http://www.drupal.org">Drupal</a> che trovate come allegato a questo articolo. &Eacute; un file **ZIP** che deve essere trasferito (tramite FTP) direttamente nella cartella in cui volete realizzare il vostro sito (solitamente la _root directory_). Terminato l&#39;upload del file caricate anche il file _start_installa.php_ (che trovate allegato a questo articolo, attenzione a modificare l&#39;estensione da **.php.txt** a **.php**) nella stessa cartella e recatevi, tramite un browser, all&#39;indirizzo contenete in due file e in particolare alla pagina _start_installa.php_ (esempio _http://mioaccount.netsons.org/cartellaprova/start_installa.php_). Puntando a questa pagina avverr&agrave; la decompressione del file compresso e verrete rediretti alla pagina di installazione di Drupal 5. A questo punto vi verranno richieste le informazioni di accesso al vostro account netsons. Inserite i parametri **Username** e **Password** per l&#39;accesso al database, nonch&egrave; il **nome del database** (solitamente uguale al nome del vostro account).  Eventualmente, tra le opzioni avanzate trovate il campo **Table prefix** che indica il prefisso da assegnare alle tabelle (assegnato automaticamente a **druapl5_**), utile nel caso abbiate differenti CMS attivi sul vostro spazio o il vostro database venga utilizzato da pi&ugrave; applicazioni. Premete **Salva configurazione** per procedere con l&#39;installazione, vi troverete con la pagina iniziale per la creazione dell&#39;account base di drupal. 
Premete su _Create frist account_ e inserite le informazioni per l&#39;account di amministrazione, dopo di che potete sbizzarrirvi a personalizzarlo e a scrivere le vostre pagine!  
<h2>Modifiche effettuate:</h2>
Vista la richiesta di specificare le modifiche effettuate, vediamo adesso i file modificati e come sono stati editati.  Dal file _install.mysql.inc_ che trovate nella cartella _includes_ &egrave; stata modificata la funzione per il controllo delle funzioni di **LOCK** e **UNLOCK** del database, e pi&ugrave; esattamente la parte sotto riportata: 
~~~language-php
function drupal_test_mysql($url, &amp;$success) {
   ...
   ...
   // Test LOCK.
   $query = &#39;LOCK TABLES drupal_install_test WRITE&#39;;
   $result = mysql_query($query);
   if ($error = mysql_error()) {
      drupal_set_message(st(&#39;We were unable to lock a test table on your MySQL database server. We tried locking a table with the command %query and MySQL reported the following error: %error.&#39;, array(&#39;%query&#39; =&gt; $query, &#39;%error&#39; =&gt; $error)), &#39;error&#39;);
     $err = TRUE;
   }
   else {
     $success[] = &#39;LOCK&#39;
   }
   // Test UNLOCK.
   $query = &#39;UNLOCK TABLES&#39;;
   $result = mysql_query($query);
   if ($error = mysql_error()) {
     drupal_set_message(st(&#39;We were unable to unlock a test table on your MySQL database server. We tried unlocking a table with the command %query and MySQL reported the following error: %error.&#39;, array(&#39;%query&#39; =&gt; $query, &#39;%error&#39; =&gt; $error)), &#39;error&#39;);
     $err = TRUE;
   }
   else {
     $success[] = &#39;UNLOCK&#39;;
   }
   ...
   ...
}
~~~

diventata:
~~~language-php
function drupal_test_mysql($url, &amp;$success)
{
   ...
   ...
   $success[] = &#39;LOCK&#39;;
   $success[] = &#39;UNLOCK&#39;;
   ...
   ... 
}
~~~

Del file _database.mysql.inc_, che si trova nella stessa cartella, sono state modificate le funzioni:
~~~language-php
function db_next_id($name) {
   $name = db_prefix_tables($name);
   db_query(&#39;LOCK TABLES {sequences} WRITE&#39;);
   $id = db_result(db_query(&quot;SELECT id FROM {sequences} WHERE name = &#39;%s&#39;&quot;, $name)) + 1;
   db_query(&quot;REPLACE INTO {sequences} VALUES (&#39;%s&#39;, %d)&quot;, $name, $id);
   db_query(&#39;UNLOCK TABLES&#39;);
   return $id;
}
~~~

che &egrave; diventata:
~~~language-php
function db_next_id($name) {
   $name = db_prefix_tables($name);
   $id = db_result(db_query(&quot;SELECT id FROM {sequences} WHERE name = &#39;%s&#39;&quot;, $name)) + 1;
   db_query(&quot;REPLACE INTO {sequences} VALUES (&#39;%s&#39;, %d)&quot;, $name, $id);
   return $id;
}
~~~

Mentre le funzioni: 
~~~language-php
function db_lock_table($table) {
   db_query(&#39;LOCK TABLES {&#39;. db_escape_table($table) .&#39;} WRITE&#39;);
}
function db_unlock_tables() {
   db_query(&#39;UNLOCK TABLES&#39;);
}
~~~

sono state modificate in:
~~~language-php
function db_unlock_tables() {} 
function db_lock_table($table) {}
~~~


<h2>ATTENZIONE:</h2> Chi usa il pacchetto e gli script forniti lo fa a suo rischio e pericolo, non mi assumo nessuna responsabilit&agrave; sull&#39;utilizzo o gli eventuali errori che possono essere presenti. Non ho ancora testato il funzionamento per l&#39;aggiornamento da una vecchia versione (4.7.X) alla nuova relase, se lo fate ricordatevi di fare un back-up del database subito prima e eventualemnte postate se riuscite o che problemi avete incontrato che cercheremo di risolvere.

<h2>EDIT:</h2>
Salvo necessità veramente, ma veramente particolari usate la versione di Drupal 5.2 che potete installare (o aggiornare) seguento al guida presente a <a href="/installazione_drupal_52_netsons">questo indirizzo</a>.