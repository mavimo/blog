---
title: Views styler
categories: [drupal]
tags: [css, grid, module, views]
---
Precedentemente avevo scritto una patch per views che pemetteva di andare ad indicare delle classi specifiche alle singole righe delle views. Considerato che modificare il codice di un modulo lo considero una delle cose più pericolose nonché sbagliate, e in considerazione del fatto dell'enorme modularità raggiunta da Drupal 7 con le funzioni di autoloading, ho deciso di separare la patch creando un modulo apposito. Attualmente questo modulo si trova in una sandbox, vediamo come ottenerlo e come usarlo (e perché!).
<!--break-->

## L'installazione

Innazitutto dobbiamo sapere che le sandbox non consentono di scaricare direttamente dei pacchetti, mentre è possibile ottenere quello che è presente al loro interno attraverso GIT. Per ottenere, quindi, il codice sorgente di questo modulo è necessario avere git installato sulla propria macchina e scaricare il modulo attraverso i comandi, specificati anche nella [apposita pagina della sandbox](http://drupal.org/project/1189116/git-instructions):

~~~language-bash
git clone --branch master mavimo@git.drupal.org:sandbox/mavimo/1189116.git views_styler
~~~

Il modulo così ottenuto può essere installato nella solita modalità, quindi procediamo con il copiare il modulo nella cartella:

~~~language-bash
sites/all/modules/contrib
~~~

e all'interno del pannello _Admin_ &raquo; _Module_ attivare il modulo **Views Styles**, a questo punto possiamo accedere e vedere le nuove funzionalità (visibili nell'interfaccia di views, come indicato nell'[articolo precedente](http://mavimo.org/drupal/views_3_grid_system_patch)) per andare a modificare le configurazioni, senza per questo andare a dover patchare il modulo views.

## L'uso

Ok, abbiao questo modulo, ma come possiamo usarlo? A cosa dovrebbe servirci? Ovviamente gli utilizzi sono molteplici, ma lo scopo iniziale per cui è nato, e per cui lo utilizzo, è la realizzazione di viste con strutture complesse quando è utilizzato in concomitanza con temi basati su griglie (nel mio caso specifico con [omega](http://drupal.org/projects/omega)).

Ipotizziamo di voler realizzare una vista i cui elementi hanno un posizionamento, ad esempio come rappresentato in

![](/images/posts/views-styler/demo3_png_21210.png)

per farlo è sufficiente andare ad impostare, all'interno della vista che genra l'elenco di questi contenuti, la seguente configurazione:

![](/images/posts/views-styler/demo3_config_png_92747.png)

in cui per ogni riga viene specificata la dimensione della riga nella griglia; ovviamente è possibile avere anche elementi con una struttura più uniforme, ad esempio:

![](/images/posts/views-styler/demo1_png_12287.png)

La cui configurazione è, come visibile nella sghermata successiva, basata sulle righe pari e dispari per indicare per le due colonne il posizionamento degli elementi, mentre il primo e l'ultimo elemento della griglia vengono visualizzati a tutta colonna.

![](/images/posts/views-styler/demo1_config_png_62278.png)

Il limite è esclusivamente alla nostra fantasia (ed ovviamente utilità), possiamo anche ottenere viste in cui gli elementi della pagina hanno tutti dimensioni differenti:

![](/images/posts/views-styler/demo2_png_18194.png)

semplicemente configurando le dimensioni della griglia per gli elementi specificati, come indicato nella configurazione di seguito indicata:

![](/images/posts/views-styler/demo2_config_png_60344.png)

Potremmo procedere così quasi all'infinito, ma credo che la cosa migliore sia provare e analizzare le potenzialità di questo strumento, che permette di ridurre drasticamente i tempi di realizzazione della struttura delle pagine, anche se molto complessa, senza dover andare a scrivere righe di CSS ridondanti.

Suggerimenti o critiche come sempre ben accetti.
