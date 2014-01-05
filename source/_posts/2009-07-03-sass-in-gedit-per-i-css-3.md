---
title: SASS in gedit per i CSS (3)
categories: [varie]
tags: [css, gedit, ruby, sass]
redirect: [varie/sass_gedit_css_3, node/85]
meta:
    description: Negli <a href="/drupal/autocompletamento_drupal_gedit">articoli</a> <a href="/drupal/drupal_api_gedit">precedenti</a> ho ampiamente fatto capire che come editor utilizzo il nostro amato (e leggero) <a href="http://www.gnome.org/projects/gedit/">gedit</a>.
    tags: [varie, css, gedit, ruby, sass]
---
Negli <a href="/drupal/autocompletamento_drupal_gedit">articoli</a> <a href="/drupal/drupal_api_gedit">precedenti</a> ho ampiamente fatto capire che come editor utilizzo il nostro amato (e leggero) <a href="http://www.gnome.org/projects/gedit/">gedit</a>.

Ho anche fatto vedere le potenzialità offerte da un metalinguaggio come SASS per la scrittura dei CSS, ovviamente la potenza è nulla senza controllo, quindi vediamo come mettere tutto sotto il controllo di gedit ;)
<!--break-->
Per poter usare gedit non sono necessari stravolgimenti particolari, ma è innanzitutto consigliabile creare un nuovo myme-type per i file SASS, in questo modo possiamo far riconoscere al sistema in maniera automatica, all'apertura dei file, quale saranno le regole per l'evidenziazione della sintassi da utilizzare.

Per la creazione del mime-type è sufficiente dare i seguenti comandi:
~~~language-php
wget http://riznlog.com/assets/2007/11/9/rails.xml
sudo cp rails.xml /usr/share/mime/packages/rails.xml
sudo update-mime-database /usr/share/mime
~~~


Mentre per la cerazione del meccanismo di evidenziazione della sintassi si deve eseguire:
~~~language-php
wget http://riznlog.com/assets/2007/11/9/gedit_rails_syntax.zip
sudo unzip gedit_rails_syntax.zip -d /usr/share/gtksourceview-2.0/language-specs/
~~~


Per coloro che utilizzano sistemi basati su *deb (Ubuntu, Debian, ...) potete scaricare direttamente il file deb che trovate allegato ed installarlo.

Una volta effettuata questa operazione io vi consiglio di attivare il plugin _Terminale incorporato_ (se non sapete come fare andate a leggervi gli articoli precedenti), e operare da quello per andare a posizionarvi all'interno della corretta directory.

Fatto questo creiamo in nostro nuovo progetto, e mettiamo _compass_ in ascolto all'interno del nostro progetto:
~~~language-php

/var/lib/gems/1.8/bin/compass -f blueprint PROVASASS
/var/lib/gems/1.8/bin/compass --watch PROVASASS
~~~

in questo modo ad ogni salvataggio dei file SASS automaticamente verranno generati i file CSS corrispondenti. Il fatto di avere la shell sempre visibile ci permette di vedere gli eventuali errori di comppilazione che risultano da una nostra errata scrittura dei SASS.
