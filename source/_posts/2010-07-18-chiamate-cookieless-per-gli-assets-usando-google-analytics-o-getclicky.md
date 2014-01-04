---
title: Chiamate cookieless per gli assets usando Google Analytics o GetClicky
categories: [Varie]
tags: [cookies, getclicky, google analytics, Javascript, performance]
---
Come abbiamo visto nell'<a href="http://mavimo.org/drupal/imagecache_subdomain_frontend_performance">articolo precedente</a> è cosa buona e giusta che le richieste effettuate per la ricezione di file statici (immagini, css e js) avvengano attraverso chiamate a cui non sono impostati cookies, in modo da ridurre il traffico generato e le richieste effettuate. Questo è consigliato sia da <a href="https://developer.yahoo.com/performance/rules.html">Yahoo</a> che da <a href="http://code.google.com/intl/it-IT/speed/page-speed/docs/rules_intro.html">Google</a>. Un modo molto semplice è usare un dominio differente o un sottodominio andando ad impostare i cookies in modo che questi non rispondano al dominio indicato.

Spesso, però, questo non è proprio così semplice da realizzare a causa dei sistemi di tracciamento utilizzati. Vedremo come risolvere questo problema per i più comuni.
<!--break-->
Innanzitutto indichiamo come nostro sito _www.demo.tdl_ ed ipotiziamo di avere inserito le immagini nel sottodominio _img.demo.tdl_. Se attiviamo <a href="http://www.google.com/analytics">Google Analytics</a> o <a href="http://getclicky.com">getClicky</a> vedremo che vengono creati dei cookies che si rivolgono all'interno dominio _demo.tdl_ e di conseguenza anche gli asset presenti in _img.demo.tdl_ verrebbero tracciati attraverso i cookies.

<h2>Google Analytics</h2>
Per risolvere è necessario specificare che i cookies si riferiscono esclusivamente al dominio principale _www.demo.tdl_. Con Google Analytics è necessario andare ad inserire, prima della chiamata al tracciamento della pagina, la chiamata che specifica a che dominio andare ad assegnare i cookies che verranno creati, quindi per esempio avremo:
~~~language-php
var pageTracker = _gat._getTracker("UA-AAAAAAAA-X");
pageTracker._setDomainName(".www.demo.tdl");
pageTracker._trackPageview();

~~~

in questo caso le chiamate al domino _img.demo.tdl_ non verranno tracciate usado i cookies. Notate il punto prima del _www_ all'interno della dichiarazione del dominio.

<h2>GetClicky</h2>
Nel caso in cui, invece, come strumento di tracciamente steste usando getclicky le cose sono leggermente più complesse, infatti questo strumento automaticamente rimuove il _WWW_ iniziale del dominio prima di settare i cookies, ma è comunque possibile risolvere usando il seguente codice:
~~~language-php
clicky.set_cookie = function (name, value) {
  var ex = new Date; ex.setTime(ex.getTime() + 20 * 365 * 86400 * 1000);
  document.cookie = name + "=" + value + ";expires=" + ex.toGMTString() + ";path=/;domain=." + location.hostname + ";";
}
clicky.init(XXXXXX);
~~~

in questo caso specifichiamo che il dominio di cui effettuare il tracciamento è solamente il dominio principale.

Con questi accorgimenti con entrambi i traccianti le richieste verso i sottodomini non effettueranno le chiamate con i cookies riducendo così i tempi di caricamento per l'utente finale.