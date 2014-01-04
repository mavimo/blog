---
title: Drupal.behaviors, lo sconosciuto
categories: [Drupal]
tags: [ahah, ajax, behaviors, Javascript, jquery]
---
Può capitare di avere elementi della pagina che devono essere caricati in maniera asincorna, di consegunenza non sono disponibili al termine del primo caricamento della pagina, ultimamente sempre più spesso capita che questi elementi debbano a loro volta essere ancorati ad altri eventi javascript (binding).

Fintanto che il caricamento di questi secondi elementi viene svolto attraverso script scritti da noi è sufficiente mettere in coda al caricamento dell'elemento tramite $.getAjax() la funzione che si decide di ancorare agli elementi, ma cosa succede quando questo viene svolto in maniera "automatica" ricorrendo a script predefiniti (si, per capirci il caricamento tramite AHAH Form di Drupal)?
<!--break-->
A questo punto le  possibilità sono poche, o riusciamo a modificare lo script complessivo di caricamento (il che può provocare più danni che altro), oppure potremmo fruttare alcuni eventi degli elementi caricati per far partire alcune funzioni che agganciano queste procedure (per esempio mettendo negli elementi caricati l'attributo onblur che richiama le funzioni necessarie), oppure...

...bhè siamo qui per parlare del behaviors, quindi? Esatto,usiamo Drupal.behaviors!

Questa procedura permette di andare ad aggiungere delle funzioni che verranno richiamate al termine del caricamento degli elementi nella pagina tramite AJAX, in questo modo possiamo fare in modo che la funzione venga ancorata ed eseguita sui nuovi elementi aggiunti.

Questa procedura è alquanto banale una volta compresa, vediamola:
~~~language-php

if (Drupal.jsEnabled) {
  /**
   * Operazione svolta al caricamento della pagina
   */
  $(document).ready(function() {
    // Chiamo la mia funzione che svoolge le operazioni che mi ero prefisso.
    myFunction($('.selector'));
  });
  
  Drupal.behaviors.myBehaviorsFunction = myBehaviorsFunction;
}

/**
 * La mia funzione che aggancia la myFunction ai nuovi elementi
 */
function myBehaviorsFunction(context) {
  myFunction($('.selector', context));
}

/**
 * La mia funzione che cambia il colore di sfondo
 */
function myFunction(element) {
  $(element).css({'background-color' : red });
}

~~~


Analizzando velocemente il codice vediamo che esiste una funzione che preleva un elemento e cambia il colore di sfondo in rosso:
~~~language-php

/**
 * La mia funzione che cambia il colore di sfondo
 */
function myFunction(element) {
  $(element).css({'background-color' : red });
}

~~~


Questa funzione viene chiamata al caricamento della pagina all'interno del document.ready() (svolto, solo nel caso in cui _Drupal.jsEnabled_ abbia valore positivo):
~~~language-php

if (Drupal.jsEnabled) {
  /**
   * Operazione svolta al caricamento della pagina
   */
  $(document).ready(function() {
    // Chiamo la mia funzione che svoolge le operazioni che mi ero prefisso.
    myFunction($('.selector'));
  });
}

~~~


Il secondo punto in cui viene richiamata è all'interno della funzione _myBehaviorsFunction_ che ha l'importante compito di prendere l'elemento che viene generato e di processarlo per svolgere le operazioni che abbiamo definito precedentemente:
~~~language-php

/**
 * La mia funzione che aggancia la myFunction ai nuovi elementi
 */
function myBehaviorsFunction(context) {
  myFunction($('.selector', context));
}

~~~


Per fare in modo che questa funzione venga richiamata c'è da aggiungere nella coda delle funzioni che vengono richiamate (presenti nell'oggetto **Drupal.behaviors**) la chiamata alla funzione, operazione che deve essere svolta al caricamento della pagina:
~~~language-php

if (Drupal.jsEnabled) {
  // ...
  Drupal.behaviors.myBehaviorsFunction = myBehaviorsFunction;
}

~~~

in questo modo al caricamento degli elementi della pagina vengono processati con la nuova funzione (ovviamente è possibile effettuare il binding di eventi sui nuovi oggetti per scatenare a loro volta altre chiamate ahah e così via).

Spero vi sia servito e di essere stato chiaro, altrimenti, come sempre, commentate ;)