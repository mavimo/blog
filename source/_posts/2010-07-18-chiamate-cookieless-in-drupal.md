---
title: Chiamate cookieless in Drupal
categories: [Drupal]
tags: [cookies, performance]
---
Come visto negli articoli precedenti riguardanti le <a href="http://mavimo.org/varie/chiamate_cookieless_assets_usando_google_analytics_getclicky">chiamate cookieless</a> e le<a href="http://mavimo.org/drupal/imagecache_subdomain_frontend_performance"> ottimizzazioni del front end</a> di Drupal ci sono diversi modi per migliorare il modo in cui è possibile effettuare l'ottimizzazione del frontend. Ora vedremo come integrare alcune delle cose viste nei due articoli precedenti e come migliorare ulteriormente le performance con Drupal.
<!--break-->
Nel caso visto precedetemente del tracciamento con <a href="http://mavimo.org/varie/chiamate_cookieless_assets_usando_google_analytics_getclicky">Google Analytics</a> l'operazione è abbastanza semplice, si tratta di andare all'interno della pagina di amministrazione del modulo Google Analytics (quindi Admin &raquo; Settings &raquo; Google Analytics) ed impostare all'interno del campo _Code snippet (before)_ la scritta:
~~~language-php

pageTracker._setDomainName(".www.demo.tdl");
~~~

dove dovrete sostituire il nome di dominio con quello del vostro sito.

Per quanto riguarda getClicky, invece, è necessario andare a patchare il modulo usando la patch che trovate allegata a questo documento. Vi ricordo che per applicare una patch è necessario eseguire il comando:
~~~language-php
patch < nome-file.patch
~~~

quindi per patchare il modulo getclicky eseguiamo i comandi:
~~~language-php

wget http://mavimo.org/files/clicky-fix-crossdomain-tracking.patch
wget http://ftp.drupal.org/files/projects/getclicky-6.x-1.4.tar.gz
tar -xzf getclicky-6.x-1.4.tar.gz
patch < clicky-fix-crossdomain-tracking.patch
~~~


Un altro problema noto è dato dal fatto che il javascript che setta il cookie **has_js** utilizza il nome di dominio generico, pertanto è necessario andare ad effettuare un piccola modifica al javascript _misc/drupal.js_ andando a sostituire la riga:
~~~language-php

document.cookie = 'has_js=1; path=/;';
~~~

con
~~~language-php

document.cookie = 'has_js=1; path=/; domain=.' + location.hostname + ';';
~~~

Anche in questo caso potete usufruire della patch che trovate allegata a questo articolo:
~~~language-php
wget http://mavimo.org/files/drupal-js-fix-crossdomain-tracking.patch
patch < drupal-js-fix-crossdomain-tracking.patch
~~~


Proseguiamo ulteriormente andando a eliminare i cookies per le immagini (che troveremo nel dominio _img.demo.tdl_).
Per comodità (non necessitiamo di una vera CDN <href="#note-1">[1]</a>) il sottodominio punta alla stessa directory di Drupal, in modo da poter usare tranquillamente i preset di imagecache per la gestione delle immagini. Purtroppo in questo modo, però, il sistema creerà sempre il cookies. Per evitare questo creiamo un installazione multisite del nostro server immagini in modo che le chiamate verso di questo vengano effettuate su uno spazio configurato per non servire cookies.

All'interno della nostra directory sites troveremo quindi:
~~~language-php
sites/www.demo.tdl/settings.php
sites/www.demo.tdl/default.settings.php
sites/www.demo.tdl/files
sites/img.demo.tdl/settings.php
sites/img.demo.tdl/default.settings.php
~~~


Per far si che all'interno del sottodominio immagini non vengano aggiunti cookies è sifficiente andare a commentare, all'interno di _settings.php_ della configurazione di _img.demo.tdl_ la parte:
~~~language-php
ini_set('arg_separator.output',     '&amp;');
ini_set('magic_quotes_runtime',     0);
ini_set('magic_quotes_sybase',      0);
ini_set('session.cache_expire',     200000);
ini_set('session.cache_limiter',    'none');
ini_set('session.cookie_lifetime',  2000000);
ini_set('session.gc_maxlifetime',   200000);
ini_set('session.save_handler',     'user');
ini_set('session.use_cookies',      1);
ini_set('session.use_only_cookies', 1);
ini_set('session.use_trans_sid',    0);
ini_set('url_rewriter.tags',        '');
~~~

inserendo subito dopo:
~~~language-php

ini_set('session.use_cookies',      0);
~~~

Che eviterà di avere, a questo punto, le chiamate con i cookies. Firebug e Page Speed ringrazieranno :)

<p id="note-1">Per la gestione delle immagini su sottodomini differenti, sopratutto per le immagini generate da imagecache, vi sono diversi modi, quello che utilizzo è dato da un modulo che ho scritto che si occupa proprio di riscrivere il path, ma poteste benissimo usare <a href="http://drupal.rg/project/cdn">CDN</a>, anche se lo trovo fin tropo complesso per simulare una CDN al solo scopo di evitare le chiamate tramite cookie agli assets.</p>