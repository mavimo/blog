---
title: Controllo del codice di Drupal (anche in gedit)
categories: [drupal]
tags: [bash, code, drupal, gedit, linux, php, shell, standard]
redirect: [drupal/controllo_codice_drupal_gedit, node/62]
meta:
    description: Come abbiamo visto in un articolo precedente gedit è un editr che ci permette di scrivere codice per Drupal in maniera estremamente semplice, ma perché limitarci a questo? Come sapete per poter pubblicare codice sul CVS ufficiale di Drupal è necessario che il codice che produciamo rispetti una serie di regole; spesso risulta comodo fare in modo che il controllo di queste regole di sintassi venga svolto in maniera automatica. Vediamo come è possibile farlo e come integrare questa funzionalità in gedit.
    tags: [drupal, bash, code, drupal, gedit, linux, php, shell, standard]
---
Come abbiamo visto in un articolo precedente gedit è un editr che ci permette di scrivere codice per Drupal in maniera estremamente semplice, ma perché limitarci a questo? Come sapete per poter pubblicare codice sul CVS ufficiale di Drupal è necessario che il codice che produciamo rispetti una serie di regole; spesso risulta comodo fare in modo che il controllo di queste regole di sintassi venga svolto in maniera automatica. Vediamo come è possibile farlo e come integrare questa funzionalità in gedit.
<!--break-->
Innanzitutto partiamo con una lettura delle regole di scrittura del codice per Drupal, ovviamente queste regole devono essere a noi ben note, ma può capitare che per qualsiasi motivo venga commesso qualche errore, in ogni caso la documentazione finale da utilizzare per controllare l codice scritto la trovate alla pagina:

  * http://drupal.org/coding-standards

Appurato ch cercheremo quanto possibile di fare in modo che il nostro codice rispetti queste regole possiamo procedere con l'installazione di un comodissimo script che permette di controlare in automatico se il codice scritto funziona correttamente.

Iniziamo installando lo script <a href="http://cvs.drupal.org/viewvc.py/drupal/drupal/scripts/code-style.pl">code-style.pl</a>, per fare questo, se non volete andare a scaricarvelo da CVS, potete fare:
~~~language-php
wget -O code-style.pl http://cvs.drupal.org/viewvc.py/drupal/drupal/scripts/code-style.pl?revision=1.15

~~~

dopo di che diamogli i permessi di esecuzione:
~~~language-php
chmod +x code-style.pl

~~~

a questo punto potremmo andare a controllare i nostri moduli scrivendo:
~~~language-php
./code-style.pl my_module.module

~~~

dato che non sempre mi ricordo dove ho lasciato questo script trovo molto utile andare ad inserirlo tra gli applicativi di default, quindi:
~~~language-php
sudo mv code-style.pl /usr/sbin/drupalcs

~~~

a questo punto in qualsiasi punto mi trovo posso validare i moduli usando:
~~~language-php
drupalcs my_module.module

~~~


<img src="http://mavimo.org/files/gedit-code.png" alt="Interfaccia di controllo script in gedit" />

La cosa che trovo comoda è la possibilità di avere questo all'interno della stessa interfaccia di gedit, in modo da non dover andare a distogliere l'attenzione dal programma ceh ho aperto, come prima cosa si deve caricare il plugin **Terminale incorporato** da _Edit_, _Preferences_ e quindi _Plugin_. A questo punto visualizziamo il terminale incorporato tramite _View_, _Bottom Pane_ o più velocemente _CTRL_+_F9_.

Ora ci spostiamo nella cartella del nostro modulo e usando
~~~language-php
drupalcs my_module.module

~~~

possiamo andare a visualizzare gli errori presenti nel nostro codice, e tramite l'uso sapiente di _CTRL_+_i_ possiamo raggiungere la riga incriminata e correggere.

Fate attenzione che in alcuni casi lo script produce dei falsi errori, quindi tenete sempre sottomano la documentazione ufficiale per andare a controllare se delle segnalazioni non vi tornano.
