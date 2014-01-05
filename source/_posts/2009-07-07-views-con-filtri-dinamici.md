---
title: Views con filtri dinamici
categories: [drupal]
tags: [module, php, taxonomy, views]
redirect: [drupal/views_filtri_dinamici, node/86]
meta:
    description: Le viste sono uno strumento estremamente potente e permettono di andare ad elaborare le informazioni creando degli elementi (pagine, blocchi, ...) di presentazione. La possibilità di usare dei filtri esposti ne fa degli strumenti adatti alla creazione di strumenti di ricerca dei contenuti.
    tags: [drupal, module, php, taxonomy, views]
---
Le viste sono uno strumento estremamente potente e permettono di andare ad elaborare le informazioni creando degli elementi (pagine, blocchi, ...) di presentazione. La possibilità di usare dei filtri esposti ne fa degli strumenti adatti alla creazione di strumenti di ricerca dei contenuti.

L'utilizzo della tassonomia come filtro esposto per la ricerca, però, non è così intuitivo, poiché l'eventuale albero viene presentato tutto all'interno di un unica select con una struttura indentata, cosa che per l'utente fruitore medio non è così intuibile.
Nel caso di vocabolario con un elevato numero di termini questo è anche scomodo perchè verranno presentati tutti i termini avendo quindi una lista molto lunga di elementi, decisamente scomoda quando si cerca di trovare un informazione.

Vediamo ora come ricorrere ad una serie di menu a tendina che presentano le informazioni della tassonomia su livelli separati (una select per oogni livello), in cui i livelli successivi vengono caricati in maniera asincrona in base alla selezione precedente.
<!--break-->
Innanzitutto non si tratta di un modulo _installa e funziona_, per lo meno non ancora, ma ha bisogno di qualche piccola modifica a mano all'interno del codice in funzione del sito in cui deve essere usato (nulla di particolare, si tratta di dire il corretto vocabolario, e la views da usare).

Iniziamo creando il vocabolario che vogliamo usare per categorizzare i contenuti. Attualmente è pensato per funzionare con un vocabolario su due livelli, ma nulla vieta di estenderlo per supportarne un numero illimitato.
Il vocabolario creato (come esempio) è composto dai seguenti termini:
~~~language-php

1
 - 1a
 - 1b
2
 - 2a
 - 2b
3
 - 3a
 - 3b

~~~

Assegnamo il vocabolario al contenuto che vogliamo categorizzare e salviamo. Annotiamoci il numero de[[IMMAGINE]]
l vocabolario, datoche ci servirà dopo ed inseriamo i diversi contenuti.

Passiamo ora alla creazione della vista. Nulla di particolare, configuriamola come meglio crediamo con tutte le opzioni che ci servono, e alla fine aggiungiamo due filtri.

Per aggiungere i filtri selezionare il + a fianco del titolo della sezione, nella partee che compare sotto selezionare _Taxonomy_ ed infini _Taxonomy: Term_, come indicato dall'immagine successiva.
<img src="/files/articolo/86/2_jpeg_20300.jpeg" width="480" alt="Finestra di selezione del tipo di filtro" />
Confermando  verrà presentata una seconda interfaccia simile:
<img src="/files/articolo/86/1_jpeg_87998.jpeg" width="480" alt="Configurazione del filtro della tassonomia" />
Andiamo a configurare questo filtro indicando il vocabolario da usare e confermiamo. Nell'interfaccia successiva andiamo ad esporre il  filtro agli utenti (tasto _Expose_ a destra in alto), il risultato dovrebbe essere simile a quanto possiamo vedere nell'immagine qui di seguito:
<img src="/files/articolo/86/4_jpeg_80393.jpeg" width="480" alt="Finestra delle impostazione del filtro della tassonomia" />
A questo punto configuriamola come riportato, facendo attenzione ad evidenziare TUTTI i termini del vocabolario (per ora non è ancora prevista la possibilità di presentare solo alcuni termini).
Annotiamoci il nome del filtro inserito (il valore immesso in _filter identifier_) e ripetiamo il tutto una seconda volta per la creazione di un secondo filtri esposto **identico** al primo **tranne** che per il nome del filtro. Annotiamoci anche questo secondo nome.

Ora apriamo il file _ajax_filter_views.module_ del modulo che abbiamo scaricato e nella parte superiore andiamo a modificare:
<?php
define('VOCABULARY_VID', 1);
define('FIRST_LEVEL_NAME',    'first');
define('SECOND_LEVEL_NAME',   'second');
?>
andando ad inserire i parametri che ci siamo segnati precedentemente. Al posto di _1_ del VOCABULARY_VID andiamo ad inserire l'ID del vocabolario prima indicato, mente al posto di _first_ e _second_ andiamo ad inserire i _filter identifier_ assegnati precedentemente.

Il risultato finale lo possiamo vedere nell'immagine seguente.
<img src="/files/articolo/86/3_jpeg_20680.jpeg" width="480" alt="Finestra delle impostazione del filtro della tassonomia" />
Allegato a questo articolo trovate una views di esempio da importare ed il modulo da installare (che per la views indicata è già configurato), ovviamente consiglie e critiche sono ben accetti.
