---
title: Chiamate javascript tra sottodomini differenti
categories: [Varie]
tags: [domini, Javascript, web]
---
in alcune situazioni può capitare di dover aprire finestre figlie di quella padre, operazione che si può effettuare tramite javascript ricorrendo al semplice
~~~language-php

window.open("http://www.miosito.tpl/finestra.html");

~~~

e può anche essere necessario trasferire informazioni dalla finestra figlia a quella padre.

Anche in questo caso javascript ci viene in contro, infatti possiamo utilizzare la chiamata:
~~~language-php

window.opener.nomeFunzione(parametro);

~~~

per poter arrivare a trasferire l'informazione da una finestra all'altra; ovviamente nella finestra padre deve essere presente la funzione _nomeFunzione_ e questa deve occuparsi di elaborare il parametro (o i prametri) in ingresso.
<!--break-->
Questo passaggio, però, è valido solo se operaimo all'interno dello stesso sito, infatti se aprissimo una finestra presente in _sito1.tpl_ da una pagina che si trova in _sito2.tpl_ non potremmo effettuare le chiamate Questa operazione viene svolta per proteggere l'esecuzione di script maligni (cross-site scripting).

Nonostante tutto questo può essere necessario, in ogni caso, riuscire ad effettuare questa operazione da domini differenti, per esempio perché stiamo facendo dialogare due applicativi web differenti, che non possono o non devono trovarsi sullo stesso dominio (si trovano proprio su due server differenti).

Questa operazione, anche se non è possibile su domini differenti è possibile all'interno di due domini di terzo livello che appartengono allo stesso dominio di secondo livello, per esempio:
~~~language-php

http://www.sito.tpl
http://sub.sito.tpl

~~~

infatti entrammbi condividono il dominio di secondo livello _sito.tpl_.

Per fare si che comunque tutto questo funzioni, però, è necessario impostare per le chiamte il document.domain in modo che siano equivalenti ed entrambi corrispondano al dominio di secondo livello che condividono.

Il risultato è che gli script risulteranno essere, per la finestra principale:
~~~language-php

function apriFinestra(url) {
  document.domain = 'sito.tpl';
  window.open(url);
  return false;
}
function eseguiComando(text) {
  alert(text);
  return false;
}

~~~

mentre per la pagina che viene aperta:
~~~language-php

function inviaInformazioni(text) {
  document.domain = 'sito.tpl';
  window.openr.eseguiComando(text);
  return false;
}

~~~


In allegato trovate due pagine di esempio da testare, ricordatevi di modificare il nome del dominio con quello da voi utilizzato.

Potete trovare maggiori informazioni relative al _document.domain_ su:

  * <a href="http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-2250147" title="definizione del document domain del W3C">definizione del W3C</a>
  * <a href="https://developer.mozilla.org/en/DOM/document.domain" title="definizione del document domain del W3C">spiegazioni su Mozilla Developer</a>
