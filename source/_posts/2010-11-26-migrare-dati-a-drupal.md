---
title: Migrare dati a Drupal
categories: [Drupal]
tags: [migrate, table wizard]
redirect: [drupal/migrare_dati_drupal, node/109]
meta:
    description:
    tags: []
---
Nella realizzazione di portali o nella fase di migrazione da una piattaforma ad un altra spesso di riscontra la necessità di effettuare l'inserimento / trasferimento di dati. Fino a che le informazioni sono limitate è conveniente effettuare ua migrazione manuale, permettendo di trasferire le inforazioni in maniera pulita ed eventualmente procedendo ad effettuare tutte le modfiche di markup e struttura necessarie; ma cosa succede se le quantità di informazioni da trasferire sono in numero tale da non consentirci di procedere in maniera manuale?
Analizzeremo ora alcuni tool e tecniche che possono essere utilizzati per migrare grandi quantitativi di dati da una piattaforma X a Drupal, vedendo successivamente come estendere queste funzionalità per poter effettuare operazioni personalizzate sulla propria base dati.
<!--break-->
Per effettuare la migrazione di informazioni ricorreremo all'utilizzo dei moduli:

  <a href="http://drupal.org/project/tw">Table wizard</a>
  <a href="http://drupal.org/project/views">Views</a>
  <a href="http://drupal.org/project/migrate">Migrate</a>
  <a href="http://drupal.org/project/migrate_extra">Migrate extra</a>


<h2>La procedura: teoria</h2>

La procedura consiste nell'avere, all'interno dello schema del database dove si trova l'installazione di Drupal, le tabelle contenente i dati da importare. Questo implica che la base dati deve trovarsi all'interno della stessa tipologia di database (MySQL) o deve essere effettuata una prima fase di migrazione, dal database attuale, a MySQL.
Come primo step, quindi, dovremmo procedere a trasferire i dati a disposizione in una (o più) tabelle -eventualmente con campi contenenti le relazioni- all'interno dello stesso schema di Drupal.

Successivamente, tramite l'utilizzo del modulo _table wizard_ queste tabelle aggiuntive verranno analizzate e mappate all'interno dello schema di Drupal, in modo da poter accedere ad esse attraverso gli strumenti a disposizione. In questa fase verranno create delle viste (intese come elementi generati da views) che permetteranno di effettuare filtraggi/ordinamenti/relazioni all'interno delle tabelle.

Infine tramite l'utilizzo del modulo migrate è possibile mappare i campi delle tabelle inserite, e filtrate da views, all'interno degli oggetti base di Drupal (nodi, commenti, utenti, tassonomia, ...). Una volta effetttuata la mappatura è possibile effettuare la migrazione dei dati ed eventualmente rimuovere i dati importati così da poter ripetere la procedura in maniera iterativa, raffinando la qualità dei dati importati.

<h2>La procedura: pratica</h2>

<h3>Preparazione dell'ambiente</h3>
Bene, ora ci è chiaro come dobbiamo procedere in via del tutto teorica, ma nella realtà? Quali sono i passaggi che devono essere realizzati? Li riassumiamo d seguito.

Innanzitutto controlliamo di aver installato i moduli sopra indicati e le loro dipendenze, se non volete procedere manualmente potete effettuarlo installandoli con drush:

~~~language-php

drush dl schema
drush dl tw
drush dl views
drush dl migrate
drush dl migrate_extra

drush enable schema
drush enable tw
drush enable views
drush enable migrate

~~~


<h3>I dati da importare</h3>

La creazione della base data da importare dipende dalla vostra sorgente, pertanto non è possibile definire procedure standard, ma quasi tutti i database permettono di effettuare un export dei dati in formato CSV, pertanto se non trovaste alternativi potete sempre esportare i dati in questo formato ed importarli all'interno dello schema del database.
Per poter effettuar dei test ho creato un file docn dei dati di test che trovate in allegato. Per poterlo usare importatelo all'interno del vostro database accedete, per esempio tramite phpmyadmin, ed effettuate l'import del file allegato:

<img src="/files/articolo/110/phpmyadmin_png_74243.png" alt="Interfaccia PhpMyAdmin" />

oppure date i seguenti comandi da linea di comndo
~~~language-php

wget http://mavimo.org/files/articolo/110/fixtures_sql_gz_10682.gz
mv fixtures.sql._gz fixtures.sql.gz
gunzip fixtures.sql.gz
mysql -u NOME_UTENTE -p SCHEMA_DRUPAL < fixtures.sql

~~~

sostituendo i valori per nome utente e lo schema su cui si trova Drupal.

<h3>L'analisi delle tabelle</h3>

Il secondo passaggio da effettuare, a seguito dell'importazione, delle tabelle nello schema di Drupal, è quello di far riconoscere queste tabelle. Per fare questo ricorriamo al modulo _table wizard_, in particolare accedendo alla pagina:

   * http://TUOSITO/admin/content/tw

all'interno della voce _Add existing tables_ possiamo indicare quali tabelle devono essere importate (1) e possiamo quindi procedere con l'analisi della tabella (2).

<img src="/files/articolo/110/1a_small_png_10629.png" alt="Interfaccia table wizard" />

La pagina successiva ci propone (vedi immagine seguente) l'elenco dei campi presenti all'interno della tabella, evidenziando il formato dei dati presenti al loro interno, i valori minimo e massimo di questi dati, il nome della vista di default da generare, quale è il campo contenente l'indice della tabella e quale campo deve essere ignorato nella migrazione.

<img src="/files/articolo/110/1b_small_png_81345.png" alt="Interfaccia di table wizard con l'elenco dei campi" />

Nella migrazione dei nostri dati vogliamo procedere creando dei contenuti associando i diversi campi, ad esclusione del campo parent, che attualmente non stiamo utilizzando, quindi procederemo flaggando questo campo (1) e confermando (2).

A questo punto, visualizzando i dati estratti (3) ci troveremmo davanti la vista con i dati presenti nella tabella e che abbiamo deciso di estrarre:

<img src="/files/articolo/110/1c_small_png_93322.png" alt="elenco dei dati da importare nel sito" />

<h3>Il mapping dei dati</h3>

Una volta definita la struttura dei dati da importare dobbiamo procedere indicado dove devono essere importate queste informazioni, il modulo migrate mette già a disposizione una serie di elementi definiti in cui andranno a confluire le immagini, ma di certo il modulo migrate extra mette a disposizione una sere si elementi aggiuntivi non trascurabili, tra cui appunto la possibilità di importare i dati inserendoli in campi CCK. Per il nostro primo esperiemento non faremo uso di questa funzionalità, ma teniamolo presente per oi prossimi passaggi.

Il nostro intento è di inserire le informazioni che abbiamo a disposizione all'interno di un contenuto di tipo page, pertanto effettueremo la procedura di importazione facendo si che i dati presenti nella tabella precedentemente mappata finiscano nei campi appositi dei nodi. Per fare questo andiamo alla pagina:

   * http://TUOSITO/admin/content/migrate

dove nella sezione _Add a content set_ potremmo inserire le informazioni necessarie a fare si che avvenga l'importazione dei dati. Configuriamo questa sezione con i seguenti settaggi:
<dl>
  <dt>Content set name</dt><dd>import_node</dd>
  <dt>Description of the content set</dt><dd>Importazione dei contenuti. Prima prova.</dd>
  <dt>Destination</dt><dd>Node: page</dd>
  <dt>Source view from which to import content</dt><dd>tw: test_import (test_import)</dd>
</dl>
nelllo specifico stiamo indicando al nostro sistema di creare un nuovo mapper (il coi identificativo e descrizione sono quelli indicati) tra la tabella definita come sorgente e la destinazione che nel nostro caso risultano essere dei contenuti di tipo Page.

<img src="/files/articolo/110/5_small_png_59797.png" alt="Interfaccia configurazione del mapper - step 1" />

Possiamo a questo punto proseguire confermando. La parte successiva ci mostrerà quale è la colonna utilizzata come colonna univoca per la nostra base dati (è un campo obbligatorio, se non è presente nella nostra sorgente originaria dovrete crearla voi inserendo una chiave primaria) ed un riepilogo dei dati precedentemente inseriti.

<img src="/files/articolo/110/6_small_png_19740.png" alt="Interfaccia configurazione del mapper - step 2" />

La parte da configurare in questo passaggio al troviamo nella parte inferiore della pagina, e riguarda dove devono essere inserite le informazioni che abbiamo ottenuto dalla sorgente all'interno della nostra destinazione. In queesto caso andremo ad impostare gli elementi che abbiamo a disposizione della nostra sorgente all'interno della destinazione come di seguito riassunto. Da notare che alcuni campi li valorizzeremo con un valore di default poiché abbiamo a disposizione dei dati in fase di import e vogliamo avere il controllo su queste informazioni.

<img src="/files/articolo/110/7_small_png_15129.png" alt="Interfaccia configurazione del mapper (relazione dei campi) - step 2" />

<dl>
  <dt>Node: Authored by (uid)</dt>
    <dd>1</dd>
    <dd>Indichiamo che il creatore del nodo è sempre l'utente con UID = 1, cioè l'amministratore.</dd>
  <dt>Node: Authored on</dt>
    <dd>creation_time</dd>
    <dd>La data di creazione del contenuto.</dd>
  <dt>Node: Last updated on</dt>
    <dd>creation_time</dd>
    <dd>La data di creazione del contenuto. Usiamo lo stesso campo in quanto il sistema precedente non differenziava le due date.</dd>
  <dt>Node: Published</dt>
    <dd>0</dd>
    <dd>Indichiamo che il nodo non è pubblicato, in questo modo man mano che procediamo nella revisione dei contenuti possiamo pubblicarli.</dd>
  <dt>Node: In moderation queue</dt>
    <dd>1</dd>
    <dd>Inseriamo il contenuto nella coda di moderazione in modo da effettuarne la revisione.</dd>
  <dt>Node: Promoted to front page</dt>
    <dd>0</dd>
    <dd>Facciamo in modo che il contenuto non venga promosso in prima pagina.</dd>
  <dt>Node: Sticky at top of lists</dt>
    <dd>0</dd>
    <dd>Facciamo in modo che il contenuto non venga messo in evidenza.</dd>
  <dt>Node: Input format</dt>
    <dd>2</dd>
    <dd>Impostiamo il formato del contenuto a Full HTML. Potremmo scegliere di utilizzare altri formati, nel qual caso indicare l'ID dei filtri visibili in http://TUOSITO/admin/settings/filters</dd>
  <dt>Node: Title</dt>
    <dd>title</dd>
    <dd>Il titolo del contenuto</dd>
  <dt>Node: Body</dt>
    <dd>body</dd>
    <dd>Il corpo completo del contenuto</dd>
  <dt>Node: Teaser</dt>
    <dd>teaser</dd>
    <dd>Il corpo del contenuto (anteprima)</dd>
</dl>

Confermando ci troveremo a disposizione un nuovo content set di cui possiamo fare l'import dei dati.

<h3>L'importazione dei dati</h3>

L'importazione dei dati procede selezionando il campo **Import** del _Content Set_ da importare e nell'area _Execute_ premendo il pulsane **Run**

<img src="/files/articolo/110/8_small_png_10099.png" alt="" />

Nella fase di importazione (la cui durata dipende dalla complessità del matching tra gli elementi, dal numero, ....) vedremo una barra di avanzameno. E' comunque possibile interrompere in qualsiasi momento la migrazione dei processi di import effettuati premendo il pulsante **Stop all running Task**.

Al termine dell'importazione possiamo procedere con la revisione delle informazioni inserite e nel caso volessimo rimuovere i dati importati per modificare la procedura, eventualmente sistemando dei passaggi, o aggiungendo/rimuovendo campi, è possibile farlo semplicemente selezionando -anziché il pulsante **Import**- il pulsante **Clear**; in questo modo i dati importati verranno eliminati e potranno essere importati nuovamente.

Sempre nella procedura di import, è possibile limitare il numero di elementi processati nella fase di importazione/cancellazione inserendo il numero di elementi che si desidera processare nello spazio contrassegnato con _Sample size_; questo è particolarmente comodo quando si vuoglino fare prove di importazione di quantità di dati comunque ridotti rispetto alla quantità dei dati totali da migrare, per esempio nella fase iniziale di test della procedura di importazione.

<h3>Tutto qui?</h3>

Ovviamente no, ci sono moltissime altre cose che è possibile gestire utilizzando gli stessi strumenti, ma vedremo prossimamente come usare gli strumenti aggiuntivi a disposizione.

Come sempre sono graditi commenti & critiche :)
