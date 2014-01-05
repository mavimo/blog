---
title: Ralizzazione di modelli
categories: [cfd]
tags: [gmsh, mesh, salome]
redirect: [cfd/gmsh_genera_mesh, node/19]
meta:
    description: Per realizzare un modello di cui poter effettuare una simulazione CFD si possono utilizzare molti programmi sia open source che closed source. Fra tutti quelli disponibili soffermeremo un p&ograve; la nostra attenzione sul programma <a href="http://geuz.org/gmsh/">gmsh</a>.
    tags: [cfd, gmsh, mesh, salome]
---
Per realizzare un modello di cui poter effettuare una simulazione CFD si possono utilizzare molti programmi sia open source che closed source. Fra tutti quelli disponibili soffermeremo un p&ograve; la nostra attenzione sul programma <a href="http://geuz.org/gmsh/">gmsh</a>, che potete installare da sorgente o tramite un semplice
~~~language-php
sudo apt-get install gmsh
~~~

se utilizzate un sistema operativo Linux; ne esistno anche la versione per <a href="http://geuz.org/gmsh/bin/MacOSX/gmsh-1.65.0-MacOSX.tgz">Mac</a> e <a href="http://geuz.org/gmsh/bin/Windows/gmsh-1.65.0-Windows.zip">Microsoft Windows</a>.<!--break-->
Una volta completata l'installazione &egrave; possibile lanciare l'interfaccia che si presenter&agrave; come indicato nell'immagine seguente, ed in particlare  composta da una finestra in cui si ha la visione 3D del nostro modello, una finestra che permette a gestione delle operazioni principali. Compiendo determinate operazioni (per esempio l'inserimento di punti) verranno aperte finestre specifiche che permettono di svolgere l'operazione che vogliamo svolgere.
<img src="/files/image/19/immagine1.png" alt="" />
Scaricate e decomprimete il file <a href="/files/19/esempio1.geo">Esempio 1</a>. Una volta eseguita questa operazione apriamo il file con gmsh. Nella finestra della visuale 3D comparir&agrave; un banalissimo cubo, ma ci permetter&agrave; di familiarizzare con i comandi per la modifica della visuale tramite mouse.
Premendo il tasto sinistro (e mantenendolo premuto) possiamo ruotare tridimensionalmente il nostro modello, premendo il tasto destro possiamo traslare il modello all'interno della finestra, mentre premendo il pulsante centrale del mouse abbiamo a disposizione uno strumento di zoom. Prendete familiarit&agrave; con queste semplici operazioni, torneranno comode quando avremmo modelli complessi in cui dovremo destreggiarci.
Realizziamo ora un nuovo modello, sar&agrave; la rappresentazione 3D di una condotta cilindrica che sfocia all'interno di una camera rettangolare e da cui avremo un'uscita, posizionata ortogonalmente all'ingresso tramite una condotta di sezione rettangolare di dimensioni variabili.
Il programma gmsh opera con un suo formato di salvataggio dei dati (_geo_) che é un file di testo formattato in maniera appropriata (provate ad aprire con un text editor i file di esempio), ma é anche in grado di leggere i file STL e permette di esportare oltre che in questi formati anche nei formati immagine (PNG, GIF, JPEG, ...), EPS, PS e LaTeX, rendendo semplice l'esportazione dele immagini del modello.
Il programma opera inserendo dei punti chiave che verranno poi collegati per realizzare delle lienee, queste linee potranno essere unite per realizzare delle superfici, che a loro volta faranno da confine per dei volumi. Per inserire un punto si scelga dal menu a discesa _Geometry_ (o si prema G), dai pulsanti sotto disponibili si scielga _Elementary_ (ci indica che inseriamo un elemento base del nostro modello), quindi sceglieremo aggiungi (_Add_) un nuovo (_New_) punto (_Point_). A questo punto ci comparir&agrave; una nuova finestra in cui ci chieder&agrave; di inserire le coordinate **X**, **Y** e **Z** in cui vorremo inserire il punto. Abbiamo anche un ulteriore parametro da settare, chiamata lunghezza caratteristica, ovvero l'importanza del punto nella successiva fase di meshing. Tanto piu' questo numero sar&agrave; basso tanto maggiore sara' la densità della griglia nella vicinanza del punto; per ora ci limiteremo a lasciare questo valore impostato al valore di default (0.1). Inserite le coordinate del punto premiamo il pulsate aggiungi (_Add_).
Potremmo determinare le coordinate dei vari punti anche spostandoci con il mouse nella finestra della visualizzazione 3D del modello, ma in questo modo non avremo la possibilit&agrave; di un buon controllo sulle coordinate.
Per collegare tra di loro due punti con una lineaa retta utilizziamo il pulsante Straight line e premiamo sul primo punto che vogliamo collegare con il mouse e di seguito sul secondo punto.
L'inserimento di linee curve pu&ograve; essere effettuato in due modi: come arco di cerchio (_Circle arc_), dove é necessario indicare il punto di partenza, il centro dell'arco di cerchio e il punto di fine o come arco di ellisse (_Ellipse arc_), dove bisogna indicare i punti di partenza, di fine e due punti attraverso cui passa l'asse principale dell'ellisse.
Inseriamo ora i punti indicati di seguito che utilizzeremo dopo per costruire il nostro modello:
<table>
<tr><td>X</td><td>Y</td><td>Z</td></tr>
<tr><td>-0.1</td><td>1</td><td>1</td></tr>
<tr><td>0.1</td><td>1</td><td>1</td></tr>
<tr><td>-0.1</td><td>1</td><td>0.8</td></tr>
<tr><td>0.1</td><td>1</td><td>0.8</td></tr>
<tr><td>-0.2</td><td>0.2</td><td>0.7</td></tr>
<tr><td>0.2</td><td>0.2</td><td>0.7</td></tr>
<tr><td>-0.1</td><td>0.5</td><td>1</td></tr>
<tr><td>0.1</td><td>0.5</td><td>1</td></tr>
<tr><td>-0.1</td><td>0.5</td><td>0.8</td></tr>
<tr><td>0.1</td><td>0.5</td><td>0.8</td></tr>
<tr><td>-0.2</td><td>-0.2</td><td>1</td></tr>
<tr><td>-0.2</td><td>0.2</td><td>1</td></tr>
<tr><td>0.2</td><td>0.2</td><td>1</td></tr>
<tr><td>0.2</td><td>-0.2</td><td>1</td></tr>
<tr><td>-0.2</td><td>-0.2</td><td>0.5</td></tr>
<tr><td>-0.2</td><td>0.2</td><td>0.5</td></tr>
<tr><td>0.2</td><td>0.2</td><td>0.5</td></tr>
<tr><td>0.2</td><td>-0.2</td><td>0.5</td></tr>
<tr><td>0.0</td><td>0.0</td><td>0.5</td></tr>
<tr><td>0.1</td><td>0.0</td><td>0.5</td></tr>
<tr><td>-0.1</td><td>0.0</td><td>0.5</td></tr>
<tr><td>0.0</td><td>0.1</td><td>0.5</td></tr>
<tr><td>0.0</td><td>-0.1</td><td>0.5</td></tr>
<tr><td>0.0</td><td>0.0</td><td>0.0</td></tr>
<tr><td>0.1</td><td>0.0</td><td>0.0</td></tr>
<tr><td>-0.1</td><td>0.0</td><td>0.0</td></tr>
<tr><td>0.0</td><td>0.1</td><td>0.0</td></tr>
<tr><td>0.0</td><td>-0.1</td><td>0.0</td></tr>
</table>
Trovate il file con i punti gi&agrave; inseriti all'interno del file <a href="/files/19/esempio2.geo">Esempio 2</a>. Ora colleghiamo questi punti usando gli strumenti gi&agrave; visti precedentemente per ottenere il modello rappresentato qui sotto. Trovate il file con tutti i punti gi&agrave; collegati all'interno del file <a href="/files/19/esempio3.geo">Esempio 3</a>, in ogni caso vi consiglio di provare a realizzare il modello per prendere familiarit&agrave; con i comandi di base del programma. Dovete fare attenzione, nella fase di realizzazione delle linee curve, di usare l'arco di cerchio e di suddividere ogni circonferenza in 4 archi di cerchio. Alla fine dovreste ottenere un risultato simile a:
<img src="/files/image/19/immagine2.png" alt="" />
Ora dobbiamo collegare le linee del nostro modello per ottenere le superfici che faranno da confine del nostro dominio di calcolo. La realizzazione delle superfici pu&ograve; essere effettuata per pareti piane tramite il comando _Geometry_, _Add_, _New_, _Plane surface_ e successivamente selezionando le linee ch fanno da contorno alla nostra superficie. Per realizzare le superfici curve della tubatura rotonda si utilizza il comando _Ruled surface_. Alla fine otterremo quello rappresentato nella immagine qui di seguito, e disponibile come file <a href="/files/19/esempio4.geo">Esempio 4</a>
<img src="/files/image/19/immagine3.png" alt="" />
Ora dobbiamo realizzare il volume in cui andare a effettuare la simulazione; per fare questo dobbiamo scegliere il comando _Geometry_, _Elmentary_, _Add_, _New_, _Volume_ e selezionare le superfici che confinano il nostro dominio d calcolo. Il file che contene il risultato finale é <a href="/files/19/esempio5.geo">Esempio 5</a>.
L'ultima operazione che dobbia compiere é la realizzazione della griglia di calcolo (mesh) che utilizzeremo per la simulazione CFD. Per fare questo dal menu a discesa selezioniamo _Mesh_ (o premiamo m) e scegliamo che tipo di mesh vogliamo realizzare, _1D_ effettuer&agrave; una realizzazione di mesh sul dominio 1D, ovvero sugli spigoli del modello, _2D_ effettuera' la mesh sulle superfici, mentre con _3D_ avremo la mesh del volume (che e' quello che ci interessa). Scegliendo _Mesh 3D_ otterremo un risltato simile a quanto rappresentato dalla segunte immagine:
<img src="/files/image/19/immagine4.png" alt="" />
Se proviamo a modificare il parametro la lungezza caratteristica dei punti utilizzati per la realizzazione de modello avremmo una mesh pi&ugrave; o meno fitta in base al valore inserito. per esempio applicando ai punti che definiscono la condotta cilindrica una lunghezza caratteristica di un'ordine di grandezza inferiore (file <a href="/files/19/esempio6.geo">Esempio 6</a>) otterremmo un risultato simile a quello rappresentato nella figura seguente:
<img src="/files/image/19/immagine5.png" alt="" />
Dove é evidente l'aumento della densit&agrave; della griglia nei pressi dei punti in cui si é diminuita la lunghezza critica. Il salvataggio della mesh viena effettuato scegliendo dal menu _File_ il sottomenu _Save mesh_.
In un prossimo articolo vedremo come importare la msh cos&igrave; generato all'interno di una simulazione con <a href="/introduzione_openfoam">OpenFOAM </a>e come impostare le condizioni iniziali per le varie pareti. Per ora vi consiglio di prendere un qualche dominio semplice e provate a relizzarne un modello 3D, un buon esempio potrebbe essere la schematizzazione dell'esterno edificio in cui vivete (ovviamente senza entrare TROPPO nel dettaglio, ma comunque senza tralsciare elementi importanti); lo utilizeremo prossimmente per vedere quali sono i moti del vento che colpisce il nostro edificio.
