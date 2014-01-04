---
title: Validatore automatico di test
categories: [Varie]
tags: [tdd, validatore, w3c, XHTML]
---
Come parlavamo negli articoli precedenti, ogni progetto ben organizzato deve fare uso di strumenti di analisi del codice per prevenire l'inserimento di bug, creazione di errori nell'interfaccia o più genricamente dei "problemi" all'utente finale. Abbiamo anche visto l'importanza di realizzare pagine valide, di conseguenza vediamo come automatizzare il test di validazione delle pagine del nostro sito per prevenire errori di questo tipo.
<!--break-->
Poiché il nostro sito (probabilmente) si troverà in uno spazio non raggiungibile dal validatore del W3C in rete, o comunque per evitare rallentamenti dovuti al traffico di rete, o per evitare di mandare in rete codice (se proprio vogliamo essere paranoici), preferiamo usare una copia del validatore in locale (abbiamo già visto come <a href="http://mavimo.org/linux/validatore_w3_locale">installare il validatore del W3C in locale</a>, chi ne ha necessità vada a rivedere).

Per utilizzare il validatore utilizziamo il webservice SOAP che il validatore mette a disposizione, e per comodità di interfacciamento ricorriamo all'uso di alcune classi PEAR per la validazione. Innanzitutto sul nostro server (rigorosamente Debian) andiamo ad installare pear:
~~~language-php

sudo apt-get install php-pear
~~~

ed al termine dell'installazione andiamo a caricare le classi che sono necessarie tramite i comandi:
~~~language-php
sudo pear install http://download.pear.php.net/package/Net_URL2-0.3.0.tgz
sudo pear install http://download.pear.php.net/package/HTTP_Request2-0.4.1.tgz
sudo pear install http://download.pear.php.net/package/Services_W3C_HTMLValidator-1.0.0RC2.tgz
~~~


Dato che non sono le versioni finali ogni tanto controllate se ci sono aggiornamenti di questi pacchetti, poichè li stiamo installando su una macchina di test non dovrebbero creare problemi.

Al termine dell'installazione creaiamo un VirtualHost su nostro server da usare per la creazione dell'ambiente di test, il codice generato è realizzato per funzionare in maniera autonoma e non è cllegato ad SimpleTest, UnitTest o simili, ma nulla vieta che voi lo facciate. La mia scelta è stata di realizzare un applicativo autonomo per ppermettere a chiunque di testare il tutto senza dotarsi di altri strumenti (e dover spiegare come usarli).

Lo script è dotato da un banalissimo file di testo contenente tutto l'elenco delle pagine che intendiamo andare a validare, una per ogni riga, e queste vengono validate dal validatore e i risultati mostrati a schermo.

<h3>Configurazione dell'applicativo di test</h3>
Nel file <a href="http://github.com/mavimo/tdd-markup-validator/blob/master/config.php">config.php</a> vedete una serie di definizione di costanti, andiamo a sostituire a queste i valori del nostro server, in particolare avremo:
<dl>
  <dt>VALIDATOR_WEBSERVER</dt><dd>L'indirizzo del validatore</dd>
  <dt>VALIDATOR_FILE_LIST</dt><dd>Il nome del file contenente la lista di pagine da validare</dd>
</dl>
Il primo contiene l'informazione che presumibilmente vorremo modificare se non intendiamousare il validatore del W3C, ma ilnostro, mentre la seconda può essere utile per andare a tenere diverse versioni dei test, magari perché alcune sezioni del progetto non sono variate ed è inutile effettuare continuamennte la validazione (operazione che comporta l'aumento del tempo di test, i costi computazionali, ..)

Una volta definite questi valori possiamo andare a lanciare il nostro script di validazione che ci segnalerà le pagine indicando per ognuna di esse lo status della validazione. Poiché il processo di validazione è abbastanza lento il sistema restituisce le pagine validate man mano che queste vengono processate.

In allegato trovate il fiel contenente i file dell'applicativo di testing da scaricare ed usare per i vostri progetti. Se avete segnalazioni o correzioni da fare fatevi avanti!
Il progetto lo trovate anche su <a href="http://github.com/mavimo/tdd-markup-validator">github</a>, commenti, critiche e <a href="http://github.com/mavimo/tdd-markup-validator/issues">issue</a> sono benvenuti!