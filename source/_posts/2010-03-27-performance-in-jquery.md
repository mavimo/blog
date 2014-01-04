---
title: Performance in jQuery
categories: [Varie]
tags: [Javascript, jquery, performance]
---
L'altro giorno, mentre assieme a <a href="http://www.dellicarri.it">Tommaso</a> stavamo controllando un problema di performance su alcuni script JS, per puro sbaglio mi è capitato di vedere usare jQuery con dei selettori usati in maniera che **credevo** essere impropria, a prima vista mi sembrava un errore, per questo motivo ho fatto alcuni test per vedere se lo era e i risultati sono stati inaspettati.
<!--break-->
La selezione di elementi (in javascript, quindi anche in <a href="http://jquery.com">jQuery</a>) è uno dei punti critici prestazionali in uno script, sopratutto quando la struttura del DOM è molto complessa o si hanno pagine molto corpose, per questo motivo solitamente si creano variabili che contengono gli elementi più comuni e si utilizzano ricerche all'interno di questo gruppo. Sempre per questo motivo (ma non solo), quando si creano plugin le ricerche interne vengono fatte all'interno del subset su cui si è istanziato il plugin.

Per capirci, se creiamo un plugin che necessiti di effettuare una ricerca su tutti i link all'interno del menù, solitamente le ricerche al suo interno vengono fatto usando come riferimento per la ricerca l'istanza del plugin, quindi:
~~~language-php

$('a', this).each(function () { /* */ });

~~~

questo limita la ricerca all'interno della parte selezionata inizialmente quando abbiamo agganciato il plugin, limitando quindi la parte del DOM che deve essere attraversata per raggiungere gli elementi che ci interessano. Fin qui tutto è lineare e abbastanza normale, cosa succede quando invece andiamo a cercare una serie di elementi nella pagina utilizzerei la ricerca facendo:
~~~language-php

$('#menu-container a').each(function () { /* */ });

~~~

In questo modo viene effettuata la ricerca per gli elementi indicati in tutto il documento. L'utilizzo che ne ho visto fare, invece, è la seguente:
~~~language-php

$('a', '#menu-container').each(function () { /* */ });

~~~

in questo caso mi sarei aspettato una doppia ricerca (il secondo risultato, non è più un oggetto del DOM, ma una stringa, quindi deve essere cercata nella pagina), una prima per identificare il contenitore principale (il _menu-container_) e un'altra per la ricerca del tag _a_ dentro il primo risultato della ricerca, quindi mi sarei aspettato un tempo di ricerca degli elementi maggiore nel secondo caso che non nel primo.

Andando ad effettuare dei test facendo una ricerca per un centinaio di volte e usando le funzioni di debug di <a href="http://www.getfirebug.com">FireBug</a>, eseguendo il seguente codice:
~~~language-php

$(document).ready(function () {
  console.time("select element nested");
  for(var i = 0; i < 100; i++ ) {
    $('#menu-container a');
  };
  console.timeEnd("select element nested");
});

~~~

che sarebbe come l'avrei scritto io, e la seconda versione del codice:
~~~language-php

$(document).ready(function () {
  console.time("select element single");
  for(var i = 0; i < 100; i++ ) {
    $('a', '#menu-container');
  };
  console.timeEnd("select element single");
});

~~~

in cui invece si ha una doppia ricerca, vediamo che i risultati (in tempo) della ricerca sono notevolmente differenti, infatti abbiamo:

   * **select element nested**: 1270ms
   * **select element single**: 26ms

il che è a dir poco stupefacente, circa il 4800% in più nella velocità della ricerca, ma ancora più stupefacente è il risultato della ricerca quando non sono presenti risultati (ma questo è già più accettabile), infatti

   * **select element nested**: 1440ms
   * **select element single**: 9ms

è ben 16000% più efficace nel "non trovare" il risultato.

Sono dati estratti su alcune pagine su cui ho effettuato il test usando la versione 1.3.2 di jQuery, usando la versione precedente, la 1.2.6 pare che invece questo problema non sia presente, infatti in entrambi i casi i tempi sono paragonabili con un guadagno del 10% appena nell'utilizzo della seconda forma.
Appena avrò tempo farò anche dei test uando la versione 1.4, vedremo che sorprese ci riserva, anche in funzione dell'incremento prestazionale tanto dichiarato al momento del rilascio.