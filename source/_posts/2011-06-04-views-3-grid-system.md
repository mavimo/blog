---
title: Views 3 e Grid system (patch)
categories: [drupal]
tags: [css, omega, patch, views]
meta:
    description:
    tags: []
---
Ultimamente, lavorando con Omega in diversi siti, mi è capitato di dover fare un pò di "magie" per riuscire ad ottenere il risultato desiderato. Il problema principale che ho riscontrato è che le views permettono di aggiungere classi ai singoli field, al wrapper della vista stessa, o una classe uguale per tutti le righe, ma non permette di inserire classi personalizzate per ogni riga. Questo, nelal versione per Drupal 6 e views 2, era risolvibile ricorrendo a [Semantic Views](http://drupal.org/project/semanticviews), ma per Views 3 non abbiamo ancora uno strumento che ci permette di fare quanto richiesto. Per risolvere questo problema ho scritto una piccola patch (attenzione, non mi assumo responsabilità in merito :) ) che permette di definire per ogni singola riga, o per righe particolari (prima/ultima, pari/dispari) delle classi specifiche. Vediamo come applicare questa patch e come funziona.
<!--break-->
Per applicare la patch la strada più comoda è di prelevare le informazioni direttamente dal GIT e applicarla con git stesso, in particolare:
~~~language-bash
git clone --branch 7.x-3.x http://git.drupal.org/project/views.git
cd views
git checkout 7.x-3.0-beta3
wget http://drupal.org/files/views-rows-class-1188216-1.patch
git apply -v views-rows-class-1188216-1.patch
~~~

Dove abbiamo provveduto a scaricarci la versione 3.0-beta3 di Views (la versione attualmente pubblicata), abbiamo scaricato la patch che si trova sul sito di Drupal e quindi abbiamo proceduto ad applicare la patch ai sorgenti scaricati.

In alternativa è possibile scaricare il pacchetto disponibile sul sito [drupal.org](http://drupal.org/projects/views) e sostituire il file presente nella directory _plugins_ con il file _views_plugin_style.inc_ che trovate in allegato a questo articolo.

Una volta applicato possiamo usare i file così ottenuti come versione di views. Attivando il modulo, ed entrando nella views che ci interessa, possiamo vedere che all'interno dei settings del sistema di visualizzazione che abbiamo:

![](/images/posts/views-grid/test_patch_views_png_75354.png)

dei nuovi settaggi:

![](/images/posts/views-grid/demo_png_12355.png)

In particolare possiamo impostare le classi agli elementi indicati precedentemente.

Questo viene particolarmente comodo nel caso in cui dobbiate applicare (ad esempio) al primo ed ultimo elemento della vista le classi **alpha** e **omega** piuttosto che voler applicare classi griglia differenti ad elementi diversi della vista.

Come sempre commenti e critiche sono graditi :)
