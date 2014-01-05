---
title: Migliorare le performance di Drupal
categories: [drupal]
tags: [caricamento, dns, javascript, minifier, performance, yahoo, yslow]
redirect: [drupal/migliorare_performance_drupal, node/66]
meta:
    description: A chi capita di relaizzare siti, dopo la fase iniziale di produzione e prima configurazione non può tralasciare al seconda fase, ma non meno importante, di messa a punto del sistema. Per fare questo uno strumento che non può mancare è <a href="http://getfirebug.com/">FireBug</a> con l'accoppiata di <a href="http://developer.yahoo.com/yslow/">YSlow</a>.
    tags: [drupal, caricamento, dns, javascript, minifier, performance, yahoo, yslow]
---
A chi capita di relaizzare siti, dopo la fase iniziale di produzione e prima configurazione non può tralasciare al seconda fase, ma non meno importante, di messa a punto del sistema. Per fare questo uno strumento che non può mancare è <a href="http://getfirebug.com/">FireBug</a> con l'accoppiata di <a href="http://developer.yahoo.com/yslow/">YSlow</a>.

Dopo l'installazione di base lanciandolo sul nostro sito vediamo che se abbiamo usato un <a href="/drupal">buon sistema di pubblicazione</a>, allora otterremo un discreto punteggio già di partenza, una installazione di prova ha rilevato che è possiblile raggiungere come base un punteggio di circa 77 punti. Vediamo ora come portare il nostro punteggio (e quindi la velocità percepita dagli utenti) a livelli ben più alti.
<!--break-->
<h3>Cosa analizza YSlow</h3>
Prima di vedere come ottimizzare il tutto, vediamo un attimo i punti che YSlow analizza per indicarci il punteggio del nostro sito:
<dl>
<dt>**Ridurre le richieste di file esterni**</dt><dd>Avere molti file che vanno a generare la pagina aumenta i tempi di attesa per il caricamento, poichè ogni file viene richiesto al server, che andrà a cercarlo e lo restituirà. Ovvimanete il numero di file richiesto può essere diminuito, ma un certo numero sarà comunque necesasrio, pensiamo ad esempio alle immagini che servono al layout del nostro sito.</dd>
<dt>**Usare sistemi di ridondanza CDN**</dt><dd>Per una speigazione migliore del CDN vi rimando a wikypedia, in ogni caso si tratta di andare ad avere una serie di server localizzati in parti diverse del mondo che gestiscono lo stesso sito, in base ala vicinanza geografica dell'utente che fa la richiesta la risposta verrà data da un server piuttosto ceh un altro, ovviamente questo ha dei costi infrastrutturali notevoli e viene utilizzata solo per grandi (grandissimi) portali.</dd>
<dt>**Aggiungere gli header con la data di expire**</dt><dd>Fare in modo che il server restituisca la "data di scadenza" di un file in modo che il client lo richieda nuovamente solo se è già stata superata questa data. Questo permette di ridurre notevolmente le richieste al server, sopratutto per quegli elementi che rimangono praticamente inalterati per molto tempo, come le immagini, i css, i javascript, ...</dd>
<dt>**Comprimere i componenti inviati con gzip**</dt><dd>Fare in modo che il server trasferisca i dati al client comprimendoli, in modo da mimnimizzare il consumo di banda, a scapito, però, di un maggiore consumo di risorse del server per comprimerli e del client per decomprimerli. In ogni caso sul client è un operazione che viene svolta velocemente, mentre sul server se ben configurato la copressione non avviene per ogni richiesta ma una volta compresso viene inviato sempre il file compresso.</dd>
<dt>**Mettere i CSS in alto alla pagina**</dt><dd>Mettere i CSS nell'header permette di far partire il download di questi mentre si sta ancora scaricando il documento iniziale, riducendo i tempi di attesa.</dd>
<dt>**Mettere i JS in fondo**</dt><dd>Posizionare i JS in fondo fa in modo che questi vengano caricati quando il codice HTML e CSS è già stato caricato, aggiungendo quindi le feature successivi e rendendo compunque fruibile il sito.</dd>
<dt>**Rimuovere le espressioni nei CSS**</dt><dd>Può capitare di avere CSS che usano expression() per modificare il modo in cui l'elemento viene presentato, questo porta add enormi svantaggi dal punto di vista prestazionale, perchè sul client la risuluzione di queste espressiondeve essere svolta di continuo, penalizzando notevolmente le performance del sito stesso.</dd>
<dt>**Mettere i CSS e JS all'esterno della pagina**</dt><dd>Portare i CSS e JS al di fuori della pagina (quando possibile) permette di avere file che vengono scaricati una volta sola e riutilizzati in molte pagine, riducendo i tempi di caricamento successivi.</dd>
<dt>**Ridurre il tempo di attesa per richieste ai DNS**</dt><dd>Mettere molti elementi su domini differenti può causare ritardi di caricamento a causa della continua necessità di risolvere i DNS secondari. Usata con parsimonia, invece, permette di avere download multipli di file, migliorando la velocità di caricamento.</dd>
<dt>**Comprimere i JS**</dt><dd>Usare script come minifier per la compressione dei JS (rimuovendo commenti, spazi inutili, variabili con numi molto lunghi,....) rende più veloce il suo download senza causare degrado di performance</dd>
<dt>**Rimuovere i redirect**</dt><dd>I redirect portano ad un aumento dei tempi di attesa prima dell'avvio del download, quindi vanno utilizzati solo dove necessario, avere un redirect da http://miosito.tpl/pagina a http://miosito.tpl/pagina/ dove cambia solo lo slash iniziale porta a aumeti dei tempi di attesa per motivi ingiustificati.</dd>
<dt>**Rimuovere gli script duplicati**</dt><dd>mi sembra evidente che avere script che fanno la stesas cosa sia inutile, meglio fare in modo di reciclare quello che si ha già, quindi non ha senso caricare thickhox e lightbox, o usiamo l'uno o l'altro.</dd>
<dt>**Configurare gli ETags**</dt><dd>Gli ETags permettono (in base a come è configurato il server) di dare una stringa identificativa associata al file in qestione in mase alla dmensione, alla data di produzione, .. permettendo di minimizzare la quantità di dati da scaricare.</dd>
</dl>

<h3>Dopo il setup</h3>
Una volta completato il setup del nuovo sito se andiamo a fare una analisi vediamo che otteniamo i seguenti risultati:
<dl>
<dt>**_performance grade_**</dt><dd>C - 77</dd>
<dt>**Ridurre le richieste di file esterni**</dt><dd>D - ci sono 4 javascript, 8 css e una decina di immagini aggiuntive (ovviamente questi dati dipendono da quanti moduli avete abilitato e da che pagina state visualizzando)</dd>
<dt>**Usare sistemi di ridondanza CDN**</dt><dd>F - sono servizi molto costosi, ed é l'unico punto su cui per ora non ci soffermiamo.</dd>
<dt>**Aggiungere gli header con la data di expire**</dt><dd>A - gli expire header sono già settati</dd>
<dt>**Comprimere i componenti inviati con gzip**</dt><dd>A - i componenti sono giàcompressi</dd>
<dt>**Mettere i CSS in alto alla pagina**</dt><dd>A - I CSS sono già posizionai in alto nella pagina e nell'header.</dd>
<dt>**Mettere i JS in fondo alla pagina**</dt><dd>C - ci sono 4 JS che non si trovano in fondo alla pagina</dd>
<dt>**Rimuovere le espressioni nei CSS**</dt><dd>A - dipende da l vostro tema, solitamente non sono presenti expression e quindi va tutto bene, altrimenti vanno rimosse riscrivendo il CSS.</dd>
<dt>**Mettere i CSS e JS all'esterno della pagina**</dt><dd>n/a - il sistema non conosce se i CSS e JS possono essere portati all'esterno, solitamente non vi sono style inline se non dove sono fondamentali, quindi diciamo che fa tutto bene anche qui.</dd>
<dt>**Ridurre il tempo di attesa per richieste ai DNS**</dt><dd>A - Usando un solo dominio che contiene tutto la richiesta DNS è ridotta al minimo. Se abbiamo molte immagini prese da diverse fonti esterne (flickr, picasa, ...) o video (youtube, vimeo, ...) le cose possono cambiare.</dd>
<dt>**Comprimere i JS**</dt><dd>C - Ci sono script che non sono compressi (per l'esattezza 3)</dd>
<dt>**Rimuovere i redirect**</dt><dd>A - anche qui a meno di nostre configurazioni particolari non ci sono redirect tra gli elementi, quindi siao a cavallo.</dd>
<dt>**Rimuovere gli script duplicati**</dt><dd>A - qui dipende da come configuriamo le cose noi, ma normalemente non includiamo lo stesso script più volte (perchè il sistema se ne accorge e lo rimuove), poi ovviamente dobbiamo fare attenzione noi a che script simili andiamo ad aggiungere (vedi appunto thickbox e lightbox).</dd>
<dt>**Configurare gli ETags**</dt><dd>F - Nel nostro server non ci sono configurati gli ETags, quindi non sono attivi e di conseguenza le performance cadono (abbiamo una decina di file senza Etags)</dd>
</dl>

<h3>Partiamo con le ottimizzazioni</h3>

<img src="http://static2.mavimo.org/files/image/66/yslow.jpeg" width="480" height="344" alt="Interfaccia di YSlow per l'analisi delle performance" />

Iniziamo facendo le ottimizzazioni di base, che riguardano l'abilitazione della comperssione dei CSS e JS, in modo da avere un unico file che contiene i CSS e un unico file che contiene i JS, andando anche a eliminare tutto ciò che c'è di superfluo all'interno (commenti, spazi, ..) così da alleggereire il file finale.

Per fare questo andiamo nella pagina di _Admin_ e sotto _Settings_ cerchiamo _Performance_. All'interno abilitiamo **Optimize CSS files** e **Optimize JavaScript files**.

Facendo solo questo semplice passaggio e ricaricando al nostra pagina se analizzaimo nuovamente le performance del nostro sito con YSlow vediamo che:
<dl>
<dt>**_performance grade_**</dt><dd>B - 84</dd>
<dt>**Ridurre le richieste di file esterni**</dt><dd>B</dd>
<dt>**Comprimere i JS**</dt><dd>A</dd>
</dl>
aumentando il punteggio ottenuto.

Un ulteriore vantaggio si può ottenere andando ad abilitare gli ETags, per fare questo dovete andare a controllare le configurazioni del vostro server, ma potrebbe essere sufficiente andare a inserire nel vostro _.htaccess_
~~~language-php
# Requires mod_expires to be enabled.
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType image/gif "access plus 10 years"
  ExpiresByType image/jpeg "access plus 10 years"
  ExpiresByType image/png "access plus 10 years"
  ExpiresByType text/css "access plus 10 years"
  ExpiresByType text/js "access plus 10 years"
  ExpiresByType text/javascript "access plus 10 years"
  ExpiresByType application/javascript "access plus 10 years"
  ExpiresByType application/x-javascript "access plus 10 years"
  #
  FileETag MTime Size
  #
  # Cache all files for 2 weeks after access (A).
  ExpiresDefault A1209600
  #
  # Do not cache dynamically generated pages.
  ExpiresByType text/html A1
</IfModule>
~~~

sostituendolo alla sezione già presente, in particolare ci interesas l'aggiunta:
~~~language-php
# Requires mod_expires to be enabled.
<IfModule mod_expires.c>
  ....
  FileETag MTime Size
  ....
</IfModule>
~~~


Analizzando nuovamente il tutto dopo questa modifica vediamo che:
<dl>
<dt>**_performance grade_**</dt><dd>A - 95</dd>
<dt>**Configurare gli ETags**</dt><dd>A</dd>
</dl>
portanto il nostro sito a livelli decisamente alti.

Possiamo anche vedere che il comportamento di caching dei file fa in modo che la pagina scaricata sia molto più leggera dopo la prima visualizzazione:
<img src="http://static2.mavimo.org/files/image/66/graph.jpeg" width="480" height="490" alt="Interfaccia di YSlow per l'analisi dei file in cache" />

<h3>Mirror per file statici</h3>
Noi, però, non ci fermiamo qui, vogliamo fare ancora meglio, in particolare vogliamo andare a fare in modo che le parti statiche del nostro sito siano su siti mirror secondari, in modo da ottimizzare il tutto, per capire cosa vogliamo ottenere esattamente vi rimando ad un paio di ottime letture:

  * http://developer.yahoo.com/performance/rules.html#split
  * http://yuiblog.com/blog/2007/04/11/performance-research-part-4/


Per fare questo, purtroppo, siamo costretti a dover andare a patchare il core di Drupal, ho <a href="http://drupal.org/node/357241">invato al patch</a> in modo che possa essere incluesa nelle versioni sucecssive, se la cosa vi pare interesante fatelo presente, in modo da aumetare l'interesse di inclusione.

Applichiamo la patch che trovate allegata a questa pagiana ai file _includes/bootstrap.inc_ e _includes/common.inc_, fatto questo apriamo il file _settings.php_ del nostro sito e andiamo ad aggiungere:
<?php
$base_url_mirror[] = 'http://static1.miosito.tpl';
$base_url_mirror[] = 'http://static2.miosito.tpl';
?>
che indicano i mirror che verranno utilizzati, ovviamente questi dovranno contenere tutti i file che sono presenti nel nostro sito, non di meno il miglioramento si ha anche facendo puntare i DNS alla stessa cartella del sito, qundi aumenteremo le performance andando a usare sempre lo stesso server.

Fate attenzione a non usare un numero eccessivo di mirror, altrimenti andremo a penalizzarci causando un elevato numero di richieste per la risoluzione di DNS, solitamente uno, due o al massimo tre mirror sono più che sufficienti

Se andiamo a vedere ora cosa riporta YSlow vediamo un ottimo:
<dl>
<dt>**_performance grade_**</dt><dd>A - 98</dd>
</dl>
che potrebbe compensare alla perdita di tempo per la configurazione del nostro sito.
