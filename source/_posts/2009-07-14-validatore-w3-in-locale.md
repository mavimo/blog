---
title: Validatore W3 in locale
categories: [Linux]
tags: [apache, ubuntu, validatore, w3c, XHTML]
---
Chi di voi utilizza il validatore del codice (X)HTML del <a href="http://www.w3.org/">W3C</a> per controllare che quello che generiamo sia codice pulito? Su le mani.

Troppe poche mani alzate, quindi come prima cosa abbituiamoci a controllare il codice. Alcuni buoni motivi? Bhè, innazitutto avere del codice validato ci permette di rendere il nostro contenuto più facilmente fruibile agli utenti che vi accedono con browser non convenzionali (per capirci screen-reader, browser per dispositivi mobili, ...); inoltre, nonostante alcuni <a href="http://www.seomoz.org/">SEO Expert</a> dicano che il vantaggio è minimo, è comunque un vantaggio dal punto di vista S.E.O. e non per ultimo, essendo l'XHTML uno standard **va rispettato**.

Anche se nella fase iniziale stiamo particolarmente attenti a chiudere tag, a non inserire _block element_ in _inline element_ può capitare che, per riutilizzo del codice o per necessità impellenti, questo non venga controllato, proprio per aiutarci in questa fase di debug l'utizzo del validatore del W3C ci aiuta.
<!--break-->
Ora, oltre a utilizzare il <a href="http://validator.w3.org">validatore raggiungibile sul web</a> potrebbe essere utile averne una copia locale da utilizzare per validare il nostro codice.

<h3>Perché una copia locale?</h3>
innanzitutto con una copia locale i tempi di risposta sono decisamente più veloci, inoltre ipotiziamo di avere un sito in sviluppo sulla nostra macchina.

In aggiunta, cosa succede nel momento in cui vogliamo andare a validare il codice? Non possiamo passare gli indirizzi locali e saremmo costretti a trasferire continuamente codice copiando il sirgente della pagina generata e incollandola nel validatore, operazione senza dubbio scomoda.

Altri motivi potrebbero essere quelli di non voler inviare in rete il nostro codice (per evitare che un progetto supersegreto venga svelato :D), o non avete una connessione always-on (o magari pagate profumatamente la vostra banda e sarebbe uno spreco).

<h3>L'installazione</h3>
L'installazione può avvenire usando i pacchetti forniti dal sistema fo dostribuzione del vostro OS, quindi su sistemi Ubuntu:
~~~language-php

sudo apt-get install w3c-marckup-validator
~~~

dopo di che andiamo ad avviare i moduli necessari di Apache:
~~~language-php
sudo a2enmod perl include
sudo apache2ctl restart
~~~

Ed andando all'indirizzo:

   * http://www.tuosito.tpl/w3c-validator/

possiamo vedere il nostro validatore. Purtoppo, però, il validatore non valida i domini che hanno un IP locale, siccome probabilmente la validazione sarà su siti di test che stiamo realizzandoo e per fare questo useremmo indirizzi locale andiamo a modificare le configurazioni del validatore per ovviare a questo problema.

<h3>La configurazione</h3>
Apriamo con il nostro editor di testo il file di configurazione:
~~~language-php

sudo gedit /etc/w3c/validator.conf
~~~

ed andiamo a trovare la riga contente _Allow Private IPs_ portandola da **no** a **yes**;
~~~language-php

Allow Private IPs = yes
~~~

A questo punto potremmo validare le pagine del nostro sito anche se si trovano sulla macchina locale.

Vederemo prossimamente come automatizzare la validazione di tutte le pagine del sito tramite alcuni semplici script che analizzano i link presenti nelle diverse pagine e analizzano, effettuando un report, le pagine realizzate (in pratica lavorano come degli spider).

<h3>Il controllo dei link</h3>
Per controllare, invece, che i link presenti nel nostro sito siano funzionanti, ricorriamo ad un altro validatore, sempre del W3C. Anche in questo caso il processo di installazione è veramente semplice:
~~~language-php

sudo apt-get install w3c-linkchecker
~~~

e per validare i link all'interno delle pagine è sufficiente andare all'indirizzo:

   * http://www.tuosito.tpl/cgi-bin/checklink/

ed anche in questo caso se si tratta di un indirizzo locale dobbiamo andare a modificarne le impostazioni, quindi:
~~~language-php

sudo gedit /etc/w3c/checklink.conf
~~~

ed andiamo a cercare:
~~~language-php

# Allow_Private_IPs = 0
~~~

sostituendo 0 con 1 e decommentando la linea (il cancelletto all'inizio della riga). A questo punto possiamo procede alla validazione delle pagine locali.