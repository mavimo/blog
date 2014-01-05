---
title: Drupal API in gedit
categories: [drupal]
tags: [drupal api, gedit, plugin, python]
redirect: [drupal/drupal_api_gedit, node/80]
meta:
    description: Non sono ancora riuscito a convincervi ad usare <a href="http://live.gnome.org/Gedit">gedit</a>, nonostante i fantastici <a href="/drupal/gedit_drupal_snippet">snippet</a>? vediamo se ques'altra estensione per Drupal vi invonglierà a tentare il passaggio.
    tags: [drupal, drupal api, gedit, plugin, python]
---
Non sono ancora riuscito a convincervi ad usare <a href="http://live.gnome.org/Gedit">gedit</a>, nonostante i fantastici <a href="/drupal/gedit_drupal_snippet">snippet</a>? vediamo se ques'altra estensione per Drupal vi invonglierà a tentare il passaggio.
<!--break-->
Cosa serve ad uno sviluppatore? Sicuramente poter accedere alla guida del sitema che sta usando velocemente, e quindi cosa cè di meglio che avere un browser integrato all'interno dell'editor che permetta di mostrare le funzioni che sta usando?

Ecco, questo è la funzionalità del plugin che trovate in allegato a questo articolo, serve a fare in modo che effettuando il triplo click (si, triplo, di solito i singolo e doppio sono già usati per altri compiti) su di una funzione permette di aprire la pagina che ne contiene la definizione, e questo vale sia per le funzioni definite all'interno di qualche modulo di Drupal, sia che per gli hook, il sistema intercetterà il corretto hook in funzione del nome del modulo e vi presenterà la pagina con la definizione dell'hook corretta.

Di seguito trovate l'esempio per una funzione comune (la calssica _node_load_), mentre in cima a questo articolo vedete la chiamata all'_hook_theme_.
<img src="/files/articolo/80/function_jpeg_15240.jpeg" alt="Esempio di interfaccia per il caricamento della funzione." />

Vediamo rapidamente come possiamo andare ad installare questo plugin per gedit ed eventualmente come apportare alcune modifiche che potrebbero tornare utili.

Per l'installazione è sufficiente iniziate ad installare il alcune classy di python necessarie, quindi su sistemi deb based andiamo con:
~~~language-php

sudo apt-get install python-gnome2-extras
~~~

dopo di che scaricare il file e decomprimerlo all'interno della cartella _~/.gnome2/gedit/plugins_, dopo di che aprendo gedit ed andando in edit &raquo; preferences &raquo; Plugins selezionare **Drupal API**.

La personalizzazione del plugin è ancora abbastanza grezza, e si tratta di andare ad aprire il file _drupalapi.py_ che troverete nelal cartella sopra indicata ed andare a modificare la linea:
~~~language-php

self._dapi_panel.load_url('http://api.drupal.org/api/function/' + function + '/6')
~~~

andando a indicare la versione di drupal che volete utilizzare (5, 6 o 7) o anche modificando il percorso in cui andare a cercare la documentazione, operazione che ci permette di andare a lavorare con una copia della documentazione locale evitandoci di attendere i tempi di risposta di http://api.drupal.org,
