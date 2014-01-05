---
title: Omega 3, aggiungiamo le nostre griglie
categories: [drupal]
tags: [css, drupal 7, omega]
meta:
    description:
    tags: []
---
Chi avesse iniziato ad utilizzare [Drupal 7](http://drupal.org) si sarà senz'altro d'accordo che stanno nascendo dei temi di partenza molto sofisticati da cui partire per la realizzazione di temi, in particolare sta emergendo sempre più [Omega 3](http://drupal.org/project/omega).

Questi temi, però possono avere necessità di essere estesi per aggiungere nuove funzonalità, in particolare potremmo avere necessità di usare una griglia differente da quelle che queesto tema di partenza ci mette a disposizione; vediamo quindi come aggiungere una griglia customizzata nel nostro sottotema di Omega 3.
<!--break-->
Innazitutto abbiamo necessità di creare un tema che erediti da questo, procediamo quindi con la creazione di tutta la strututra necessaria. Ipotizziamo di chiamare il nostro tema **testgrid**.

Creiamo quindi la cartella _testgrid_ e inseriamo al suo interno un file che chiameremo _testgrid.info_, dopo di che andiamo ad inserire le informazioni necessarie, ad esempio:

~~~language-bash
name = Test Grid
description = Test grid theme for mavimo's tutorial
core = 7.x
engine = phptemplate
screenshot = screenshot.png
base theme = omega
~~~

A questo punto andiamo a creare la nuova griglia che vogliamo andare a realizzare. Omega 3 si basa su [960gs](http://960.gs), pertanto il modo più veloce per realizzazare la griglia che ci interessa è di andare all'interno del sito del grid system e andare ad usare lo strumento per la realizzazione della [griglia personalizzata](http://grids.heroku.com/).

Da questa pagina possiamo settare quale è il numero di colonne, la larghezza di ogni colonna e la spaziatura tra le stesse. In alternativa, spuntando **Check to edit the width** è possibile impostare la larghezza che la nostra griglia deve avere.

Una volta inserite le impostazioni che ci servono, procediamo andando a scaricarci la nostra griglia personalizzata.

Per poterla inserire all'interno di Omega 3 e farla riconoscere dallo stesso, è necessario andare ad inserire all'interno del file info precedentemente creato, le seguenti righe:

~~~language-bash
grids[testgrid_default][name] = Test Grid
grids[testgrid_default][layouts][normal] = Normal
grids[testgrid_default][columns][12] = 12 Columns
~~~

la direttiva **testgrid_default** definisce il nome della griglia riconosciuta dal sistema, mentre la direttiva:

~~~language-bash
grids[testgrid_default][name] = Test Grid
~~~

indica il noem visibile nell'interfaccia utente.

Per ogni griglia è possibile definire più layouts (normale, fluido, ...), questa operazione viene relaizzata utilizzando la direttiva:

~~~language-bash
grids[testgrid_default][layouts][normal] = Normal
~~~

Dove per ogni layout, riconosciuto da sistema con il nome macchina inserito all'interno delle parentesi quadre (in questo caso _normal_), viene indicato il nome visibile nell'interfaccia.

L'ultima direttiva indica il numero di colonne che il nostro sistema a griglia ha, oltre al nome che deve essere visibile all'interno dell'interfaccia utente.

~~~language-bash
grids[testgrid_default][columns][12] = 12 Columns
~~~

Una volta inserite queste indicazioni dobbiamo posizionare il nostro CSS con la griglia all'interno del tema per far si che questo lo riconosca. il percorso in cui deve essere posizionato è all'interno della cartella che andremo a creare.

Iniziamo creanto le cartelle ```css/grid``` al cui interno creiamo una cartella con il nome macchina della nostra griglia, quidni nel nostro caso ```testgrid```. All'interno di questa cartella creiamo poi una ulteriore cartella con il nome macchina del layout della nostra griglia (nel nostro caso ```normal```) e posizioniamo all'intenro il file CSS precedentemente scaricato.

Per poterlo fare riconoscere al sistema dovremo procedere rinominandolo nella maniera seguente:

 * Nome macchina della griglia sostituendo i _trattino bassi_ con _trattini semplici_.
 * Nome macchina del layout.
 * Numero di colonne della griglia.

nel nostro caso otteremo che il CSS si chiama ```testgrid-default-normal-12.css```.

Purtroppo il CSS generato dal sistema on-line ha alcune differenze che non permettono al sistema di essere utilizzato direttamente, quindi dobbiamo procedere con una sostituzione, in particolare ci saranno da sostituire:

 * ```.container_``` con ```.container-```
 * ```.grid_``` con ```.grid-```
 * ```.push_``` con ```.push-```
 * ```.pull_``` con ```.pull-```
 * ```.prefix_``` con ```.prefix-```
 * ```.suffix_``` con ```.suffix-```

Potete procedere usando cerca e sostituisci del vostro editor di testo preferito o usando sed con il comando:

~~~language-bash
sed s/_/-/ grid.css > grid-correct.css
~~~

Fatto questo il nostro sistema è perfettamente funzionante, se notiamo -però- manca la visualizzazione della griglia in anteprima, cosa che sicuramente ci torna comoda in fase di sviluppo del nostro tema. Per fare questo dobbiamo andare a vedere quale erano le dimensioni delle colonne del grid system (sono visibili all'interno dello strumento che abbiamo usato epr generare la griglia), e dovremo realizzare un immagine PNG di altezza 1px e larghezza pari alla larghezza della colonna più due volte le dimensioni della spaziatura impostata.

Ad esempio, se la colonna è di 70px e la spaziatura di 5px, l'immagine che andremo a creare avrà le dimensioni di 1px di altezza e 70+5*2 = 80px di larghezza. Questa immagine dovrà essere una PNG con canale alpha attivato (una immagine trasparente) che andremo a riempire, nello spazio interno, per la larghezza della colonna, lasciando lo stesso spazio su i due lati, di colore rosso con trasarenza del 30%.
Copiamo questa immagine all'interno della cartella dove abbiamo messo il nostro CSS e rinominiamola nello stesso modo (variando solo l'estensione). Fatto questo potremmo vedere perino la nostra grigli all'interno del nostro tema.

Come sempre consiglie critiche sono ben accetti.
