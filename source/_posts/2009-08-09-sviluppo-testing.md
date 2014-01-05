---
title: Sviluppo & Testing
categories: [varie]
tags: [ab, php, simpletest, sviluppo, test, unitest]
redirect: [varie/sviluppo_testing, node/91]
meta:
    description: Come potremmo rappresentare il ciclo di sviluppo di un software? Andando con ordine avremmo, inizialmente l'analisi delle richieste, la fase di progettazione, la fase di implementazione, di test e infine il rilascio. Completato questi passaggi si passa alle fasi successive (aggiunta di funzionalità) che sono praticamente identiche (non per nulla si chiama ciclo).
    tags: [varie, ab, php, simpletest, sviluppo, test, unitest]
---
Come potremmo rappresentare il ciclo di sviluppo di un software? Andando con ordine avremmo, inizialmente l'analisi delle richieste, la fase di progettazione, la fase di implementazione, di test e infine il rilascio. Completato questi passaggi si passa alle fasi successive (aggiunta di funzionalità) che sono praticamente identiche (non per nulla si chiama ciclo).

Vedremo ora come andare ad effettuare delle analisi di test su un applicativo (web based). Metto subito le mani avanti dicendo che applicativi differenti hanno necessità differenti di risposta e quindi non necessariamente un test su di un certo applicativo è significativo per un altro o che i risultati su di un progetto siano comparabili con quelli di un altro. Facciamo un esempio: immaginiamoci un software che fornisca i risultati della ricerca in un archivio, questo ha dei di tempi di risposta di circa 200ms.

E' un buon risultato? La risposta corretta è...
<!--break-->
...dipende!

Se questo software deve fornire un servizio all'utente è un tempo di risopota accettabile, magari non lo è nel caso in cui debba fornire informazioni ad altri servizi con cui deve interagire, o -ancora- se il campo di ricerca è su di un miliardo di elementi o 100 elementi (ovviamente a parità di elementi) la cosa cambia.

Tutto questo è per indicare che **i risultati** vanno interpretati con obbiettività, e **non vanno valutati al di fuori del contesto**.

I test possono essere suddivisi per tipologie, ed in particolare avremo:
<dl>
  <dt>Test unitari (unit test)</dt><dd>Test in cui viene valutata la risposta di una unità (o sottounità) funzionale, si controlla il flusso esecutivo e le risposte che fornisce.</dd>
  <dt>Test d'integrazione (integration test)</dt><dd>In questo caso il controllo avviene sull'integrazione tra elementi differenti del sistema, controlla che il flusso avvenga in maniera corretta e senza intoppi.</dd>
  <dt>Test di performance (stress test)</dt><dd>In questo test si cerca di ottenere il miglior risultato nel minor tempo (o consumo di risorse) possibile. Attualmente si punta più al tempo di risposta che non al consumo di risorse. </dd>
</dl>

<h3>Test unitari (unit test)</h3>
Le metodologie di realizzazione di questi test segue una logica temporale, normalmente nella prima fase, si ha la realizzazione dei _test unitari_ prima della scrittura del codice che implementa la logica, nel momento in cui questi test sono pronti si può procedere con la creazione dell'applicativo.

L'utilizzo di questi test permette di modificare la metodologia implmentativa della logica mantenendo la compatibilità con il risultato finale, riducendo quindi il tasso di errore dovuto a modifiche, in particolare risultano comodo per automatizzare il controllo delle modifiche effettuate, così da sgravare il programmatore da questo compito di test.

La creazione di un test non è altro che la scrittura di un codice che automatizza il controllo di determinati risultati di alcune operazioni. Facciamo un esempio banalissimo di test fatto "in casa"; L'oggetto che vogliamo testare è una classe rettangolo che ha come proprietà l'altezza e la larghezza e tramite un metodo mi restituisce la superficie. L'implementazione della classe rettangolo potrebbe essere:
<?php
class rettangolo() {
  private $altezza;
  private $larghezza;

  function getAltezza() {
    return $altezza;
  }
  function setAltezza($size) {
    $altezza = $size;
  }
  function getLarghezza() {
    return $larghezza;
  }
  function setLarghezza($size) {
    $larghezza = $size;
  }
  function getArea() {
    return $larghezza * $altezza;
  }
}
?>

Il nostro test deve verificare il corretto funzionamento della classe, quindi potremmo realizzare il nostro test tramite:
<?php
$rett = new rettangolo();
$rett->setAltezza(5);
$rett->setLarghezza(5);
print "\nAltezza:   " . $rett->getAltezza() == 5 ? 'passato' : 'non passato';
print "\nLarghezza: " . $rett->getLarghezza() == 5 ? 'passato' : 'non passato';
print "\nArea:      " . $rett->getArea() == 25 ? 'passato' : 'non passato';
?>

In questo test il sistema si occupa di verificare che il sistema sia in grado di andare a gestire la creazione di un oggetto rettangolo, che le sue proprietà siano configurabili e che il risultato del calcolo della sua area sia corretto.

Questo ci permette di andare ad elaborare il codice della nostra classe senza incorrere nel dubbio di effettuare operazioni che diano risultato insapettato, fino a che il test risulterà valido potremmo considerare la nostra unità funzionale valida. Ipotiziamo ora di dover andare ad aggiungere funzionalità alla nostra classe, per esempio andando a gestire un controllo sulla larghezza e altezza in modo che non siano mai negative o uguali a 0, in questo caso possiamo procedere andando a creare il test e poi la nostra classe, facendo attenzione che durante la fase di implementazione il test non fallisca mai.

Il test in questione potrebbe essere indicato come:
<?php
$rett = new rettangolo();

for($i = -4; $i < 13; $i += 4) {
  for($j = -4; $jj < 13; $j += 4) {
    if($i <= 0 || $j <= 0) {
      try {
        $rett->setAltezza($i);
        $rett->setLarghezza($j);
        print '\nControlli: (' . $i . 'x' . $j . '): non passato';
      } catch ($e) {
        print '\nControlli: (' . $i . 'x' . $j . '): passato - ' . $e;
      }
  }
}
?>
Tralascio l'implementazione della classe per la sua banalità, tuttavia vorrei soffermarmi su un punto. al crescere della complessività della classe cresce la complessità del test, per questo motivo è preferibile realizzare diversi test molto semplici piuttosto che test complessi in modo da rendere più semplice la realizzazione del test.

Consideriamo anche che al crescere della complessità cresce la possibilità di realizzare errori nella scrittura del test, quindi risulta fondamentale l'uso di strumenti di generazione/contorllo dei test che permettono di automatizzare la scrittura e l'analisi di questi, quindi vi consiglio caldamente di appoggiarvi a loro per realizzazione dei test, fra questi possiamo citare

   * <a href="http://sourceforge.net/projects/phptest/">PHPTest</a>
   * <a href="http://www.simpletest.org/">SimpleTest</a>
   * <a href="http://www.phpunit.de/">PHPUnit3</a>


<h3>Test d'integrazione (integration test)</h3>
Sono utilizzati per assicurarsi che delle unità base (testate tramite _unit test_) possano dialogare tra di loro, evitando quindi problemi nel flusso di lavoro.

Questi test vengono eseguiti, di solito, dopo la fase di sviluppo dei componenti base, controllando l'effettivo risultato del flusso, nel caso in cui determinati passaggi falliscano ci permettono di determinare il punto di rottura e quindi di analizzare il problema.

Gli strumenti che possono essere usati per questa tipologia di test sono gli stessi indicati per i test unitari, si differenzia solamente il modo di operare questi test, andando a gestire l'integrazine tra diversi componenti.

<h3>Test di stress</h3>
Questa tipologia di test analizza i tempi di risposta che un nostro sistema ha a disposizione, e permette di indagare i punti critici del sistema. Una volta individuati la modifica del codice ci potrebbe permettere di ottenere moglioramenti (nei tempi di risposta, nei consumi di risorse, ...). Grazie ai test scritti precedentemente si può evitare che eventuali cambiamenti effettuati a questo punto della lavorazione compromettano i punti precedenti.

Gli strumenti che possono essere usati per questa analisi sono differenti in base a quale elemento deve essere analizzato e quali sono i punti importanti da controllare, ma sicuramente una prima analisi è ottenibile tramite l'utilizzo si **ab**.

Questo strumento si occupa semplicemente di effettuare una serie di richieste al server e di analizzare i tempi di risposta che questo da, in base a questi dati (e al buon senso nell'analisi) possiamo determinare se i risultati sono in linea con le richieste o meno, nel qual caso si agisce andando a analizzare i punti in cui sorgono i problemi (o colli di bottiglia) e di conseguenza andare a risolvere questi.

Un esempio di uso di ab può essere:
~~~language-php

ab -c 10 -n 1000 http://miosito/index.php
~~~

In questo modo stiamo chiedendo al sistema di indicare in effettuare all'indirizzo indicato (http://miosito/index.php) 1000 richieste (parametro _n_) con 10 richieste concorrenti al sistema (parametro _c_).

Il risultato della risposta sarà simile a:
~~~language-php
marco@eeepc:~$ ab -c 10 -n 1000 http://localhost/mioapp/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests

Server Software:        Apache/2.2.11
Server Hostname:        localhost
Server Port:            80

Document Path:          /mioapp/
Document Length:        7422 bytes

Concurrency Level:      10
Time taken for tests:   122.731 seconds
Complete requests:      1000
Failed requests:        0
Write errors:           0
Total transferred:      1332150 bytes
HTML transferred:       1232052 bytes
Requests per second:    1.35 [#/sec] (mean)
Time per request:       7393.437 [ms] (mean)
Time per request:       739.344 [ms] (mean, across all concurrent requests)
Transfer rate:          10.60 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.0      0       5
Processing:  6735 7232 404.9   7155    9633
Waiting:     6681 7226 408.1   7155    9633
Total:       6735 7233 405.6   7155    9638

Percentage of the requests served within a certain time (ms)
  50%   7155
  66%   7279
  75%   7312
  80%   7379
  90%   7590
  95%   8217
  98%   8521
  99%   8693
 100%   9638 (longest request)

~~~

da una prima analisi notiamo che sul sistema di test che stiamo usando riusciamo ad evadere il 50% delle richieste in circa 7 secondi, e vengono evase completamente in quasi 10 secondi. Usando altri parametri è possibile generare file CSV (parametro _e_) o pronti per essere elaborati tramite strumenti di plotting, come gnuplot (parametro _g_).

In caso di errori possiamo vedere quale è il tasso di errore di risposta (le _Failed requests_), valore che dovrebbe essere sempre pari a zero, a meno di gravi errori di sviulppo che avremo evitato usando gli _unit_ ed _integration_ test.

Una volta analizzato il dato, e determinato che il nostro sistema non risponde in maniera sufficientemente rapida andiamo ad analizzare quali problemi si riscontrano andando a testare singoli elementi, per fare questo possono essere realizzate pagine di test che mandano in esecuzione alcune parti e tramite queste (e l'uso di AB) di determinna quali sono le parti critiche, oppure (soluzione preferibile) si ricorre a strumenti quali XDebug o altri debugger che permettono di elaborare lo **stack trace** del codice eseguito da PHP (ovvero l'ordine delle chimate, la durata dell'esecuzione, ...).

Questi strumenti solitamente si possono interfacciare con applicativi che reportizzano in maniera più leggibile i risultati, un esempio è <a href="http://www.netbeans.org">netbeans</a> che contiene al suo interno uno strumento di debug che si ancora a XDebug.

Buon testing a tutti!
