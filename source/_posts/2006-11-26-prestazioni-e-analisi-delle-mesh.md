---
title: Prestazioni e analisi delle mesh
categories: [OpenFOAM]
tags: [gmsh, mesh non strutturate, mesh strutturate]
---
In questo articolo vedremo come &egrave; possibile ottimizzare le prestazioni per il calcolo di una semplice geometria utilizzando delle griglie appropriate ed in particolare come varia la velocit&agrave; di calcolo per griglie costituite da triangoli o quadrangoli, oltre che in base alla densit&agrave; della griglia di calcolo.
Come dominio si &egrave; utilizzato quello rappresentato nella seguente figura (le dimensioni sono indicate in metri):
<a href="/files/image/21/geometry.png"><img src="/files/image/21/geometry.png" alt="Dimensioni e struttura della geometria sottoposta ad analisi." /></a>

Il tutto &egrave; stato risolto per un caso bidimensionale e usando il risolutore _simpleFoam_ (ovvero adatto a un fluido non comprimibile e viscosit&agrave; costante) e usando le caratteristiche tipiche dell'acqua. E' evidente che nel caso di geometrie tridimensionali le differenze che si riscontreranno saranno ancora pi&ugrave; accentuate.

L'ingresso avviene dalla parete superiore sinistra (INLET) con una velocit&agrave; di 5m/s e l'uscita &egrave; dalla parete inferiore destra (OUTLET) dove viene ipotizzata una pressione nulla opposta al flusso del fluido.
Le ipotesi per le pareti sono di assenza di scorrimento lungo di esse.

Le mesh sono state generate tramite <a href="http://www.geuz.org/gmsh/">gmsh</a> e utilizzando dei parametri, per permettere di modificare la densit&agrave; della griglia di calcolo senza dover ricostruire il modello per le differenti mesh. Potete scaricare i file necessari per la generazione di mesh <a href="/files/21/triangoli.geo">triangolari</a> e <a href="/files/21/rettangoli.geo">rettangolari</a>.

Per le mesh rettangolari il parametro da modificare per variare la densit&agrave; della griglia &egrave; **nm** che indica la quantit&agrave; di elementi in cui viene suddiviso ogni decimetro della struttura, &egrave; evidente che la densit&agrave; della griglia &egrave; proporzionale al quadrato di questo parametro ed in particolare il numero di elementi che la compongono &egrave; pari a:
~~~language-php
180 * nc^2
~~~

Per la modificare la densit&agrave; delle mesh triangolari &egrave; necessario modificare il parametro **lc** che indica quanto densa deve essere la griglia.

La generazione della mesh viene effettuata da shell  tramite il seguente comando:
~~~language-php
gmsh -3 _file_input.geo_ -o _file_mesh.msh_
~~~

ove, ovviamente, andranno utilizzati i nomi appropriati per i file in ingresso e uscita.

Per la realizzazione del caso da studiare tramite OpenFOAM si rimanda agli articoli precedenti, in particolare si veda <a href="/prima_simulazione_openfoam">Esempio di simulazione con OpenFOAM</a> e <a href="/seconda_simulazione_openfoam">Seconda simulazione</a>.
L'importazione della mesh prodotta precedentemente a gmsh avviene tramite il comando:
~~~language-php
gmshToFoam _root_ _case_ _file_mesh.msh_
~~~

Dove ovviamente andranno modificati i parametri necessari.

Di seguito sono riportate le mesh ricavate. Per ognuna di esse trovate il tipo di elementi utilizzati per la realizzazione della griglia di calcolo il valore del parametro (nm o lc) utilizzato e il numero di elementi che la compongono. Per evitare di inserire molte immagini ripetitive viene riportato solo la mesh meno densa, le altre le pote visualizzare presso seguendo i  link indicati.
Maggiori informazioni su ogni griglia possono essere ottenuti tramite il comando _checkMesh_.

**Mesh triangolari**
<a href="/files/image/21/triangoli/752_grid.png"><img src="/files/image/21/752_grid.png" title="Disegno della mesh" alt="Disegno della mesh" /></a>
Triangolare - lc = 0.07 - 752


 * <a href="/files/image/21/triangoli/1451_grid.png" title="Disegno della mesh" >Triangolare - lc = 0.05 - 1451</a>
 * <a href="/files/image/21/triangoli/2329_grid.png" title="Disegno della mesh"  >Triangolare - lc = 0.04 - 2329</a>
 * <a href="/files/image/21/triangoli/4106_grid.png" title="Disegno della mesh" >Triangolare - lc = 0.03 - 4106</a>
 * <a href="/files/image/21/triangoli/9327_grid.png" title="Disegno della mesh" >Triangolare - lc = 0.02 - 9327</a>
 * <a href="/files/image/21/triangoli/16528_grid.png" title="Disegno della mesh" >Triangolare - lc = 0.015 - 16258</a>


**Mesh rettangolari**
<a href="/files/image/21/rettangoli/720_grid.png"><img src="/files/image/21/720_grid.png" alt="Disegno della mesh" title="Disegno della mesh" /></a>
Rettangolare - nm = 2 - 720

 * <a href="/files/image/21/rettangoli/1620_grid.png" title="Disegno della mesh" >Rettangolare - nm = 3 - 1620</a>
 * <a href="/files/image/21/rettangoli/2880_grid.png" title="Disegno della mesh" >Rettangolare - nm = 4 - 2880</a>
 * <a href="/files/image/21/rettangoli/4500_grid.png" title="Disegno della mesh" >Rettangolare - nm = 5 - 4500</a>
 * <a href="/files/image/21/rettangoli/11520_grid.png" title="Disegno della mesh" >Rettangolare - nm = 8 - 11520</a>
 * <a href="/files/image/21/rettangoli/18000_grid.png" title="Disegno della mesh" >Rettangolare - nm = 10 - 18000</a>

Una volta terminata l'importazione della mesh &egrave; necessario andare a modificare le tipologie delle pareti, in particolare &egrave; necessario settare, dal file _case_name/constant/polyMesh/boundary_:

 * patch0 - _patch_
 * patch1 - _patch_
 * patch2 - _patch_
 * patch3 - _empty_
 * defaultFaces - _empty_

Trovate il file <a href="/files/21/boundary">boudary</a> gi&agrave; pronto per uno dei vari <a href="/files/21/simulation_case.tar.gz">casi</a> che andremo risolvere in questo articolo.

L'operazione successiva &egrave; l'impostazione delle condizioni al contorno della nostra simulazione. Trovate un esempio gi&agrave; completo allegato a questo articolo.

Per l'esecuzione della comparazione sono state effettuate diverse prove per le farie tipologie di mesh in base al numero di elementi che la compongono. Come macchina di calcolo &egrave; stata utilizzata una CPU ADM 1700+ (operante a 1466MHz) equipaggiata di 768MB di RAM (operante a 200MHz) su cui si trova un sistema Linux con kernel 2.6.17.10

A seguito delle simulazioni svolte si sono riscontrati i seguenti risultati:

**Mesh triangolare**
<table>
<tr><td>_Numero di elementi della griglia_</td><td>_Tempo di calcolo (s) *_</td></tr>
<tr><td>752</td><td>22,64</td></tr>
<tr><td>1451</td><td>47,03</td></tr>
<tr><td>2329</td><td>84,79</td></tr>
<tr><td>4106</td><td>203,42</td></tr>
<tr><td>9327</td><td>902,25</td></tr>
<tr><td>16528</td><td>2481,25</td></tr>
</table>

**Mesh rettangolare**
<table>
<tr><td>_Numero di elementi della griglia_</td><td>_Tempo di calcolo (s) *_</td></tr>
<tr><td>720</td><td>15,74</td></tr>
<tr><td>1620</td><td>45,82</td></tr>
<tr><td>2880</td><td>99,2</td></tr>
<tr><td>4500</td><td>216,4</td></tr>
<tr><td>11520</td><td>1168,88</td></tr>
<tr><td>18000</td><td>2592,17</td></tr>
</table>

*) Il tempo di calcolo &egrave; stato misurato considerando l'utilizzo effettivo della CPU, escludendo i tempi di I/O sull'hard disk della macchina usata come sistema di calcolo. Nel caso si fosse utilizzato un sistema di calcolo distribuito sarebbero stati esclusi i tempi di latenza della rete che portano ad un aumento ulteriore del tempo di risoluzione.

Di seguito &egrave; visibile il grafico che paragona le prestazioni (come tempo di calcolo) ottenuto utilizzando le due diverse tipologie di griglie, ove risulta evidente una diminuzione di circa il 10% delle tempistiche di calcolo per le griglie rettangolari rispetto le griglie con pari numero di elementi triangolari.

<a href="/files/image/21/grafico_paragoni_mesh.png"><img src="/files/image/21/grafico_paragoni_mesh.png" alt= "Grafico paragone delle tempistiche di calcolo" /></a>

I risultati ottenuti per le diverse simulazioni svolte sono stati graficati considerando a velocit&agrave; del flusso dopo 100 e 1000 secondi dall'inizio del flusso per ogni tipo di griglia risolta. Onde evitare di rendere troppo lungo il seguente articolo potete visualizzarle cliccando sui link seguenti.


**Mesh triangolari**

 * <a href="/files/image/21/triangoli/2329_100.png">mesh di 2329 elementi al 100 s</a>
 * <a href="/files/image/21/triangoli/2329_100.png">mesh di 2329 elementi al 1000 s</a>
 * <a href="/files/image/21/triangoli/4106_100.png">mesh di 4106 elementi al 100 s</a>
 * <a href="/files/image/21/triangoli/4106_100.png">mesh di 4106 elementi al 1000 s</a>
 * <a href="/files/image/21/triangoli/9327_100.png">mesh di 9327 elementi al 100 s</a>
 * <a href="/files/image/21/triangoli/9327_100.png">mesh di 9327 elementi al 1000 s</a>
 * <a href="/files/image/21/triangoli/16528_100.png">mesh di 16528 elementi al 100 s</a>
 * <a href="/files/image/21/triangoli/16528_100.png">mesh di 16528 elementi al 1000 s</a>


**Mesh rettangolari**

 * <a href="/files/image/21/rettangoli/2880_100.png">mesh di 2880 elementi al 100 s</a>
 * <a href="/files/image/21/rettangoli/2880_100.png">mesh di 2880 elementi al 1000 s</a>
 * <a href="/files/image/21/rettangoli/4500_100.png">mesh di 4500 elementi al 100 s</a>
 * <a href="/files/image/21/rettangoli/4500_100.png">mesh di 4500 elementi al 1000 s</a>
 * <a href="/files/image/21/rettangoli/11520_100.png">mesh di 11250 elementi al 100 s</a>
 * <a href="/files/image/21/rettangoli/11520_100.png">mesh di 11250 elementi al 1000 s</a>
 * <a href="/files/image/21/rettangoli/18000_100.png">mesh di 18000 elementi al 100 s</a>
 * <a href="/files/image/21/rettangoli/18000_100.png">mesh di 18000 elementi al 1000 s</a>


Per i nostri fini ci limitiamo a considerarne alcune, in particolare &egrave; evidente che, per griglie rettangolari, quindi caratterizzate da una elevata regolarit&agrave;, usando un numero insufficiente di elementi (inferiori al migliaio) il sistema non porta ad una soluzione stabile, infatti come risultato si ha _solution singularity_. Ci&ograve; non avviene per mesh triangolari, poich&eacute; le irregolarit&agrave; nella griglia portano il sistema ad essere pi&ugrave; elastico e a gestire anche situazioni limite (seppur con tutte le approssimazioni che ne derivano).

Utilizzando un numero di elementi della griglia maggiori (ma inferiori alla decina di migliaia) si pu&ograve; notare che in entrambi i casi (mesh triangolari e rettangolari) a 100s dall'inizio non si notano in maniera evidente le ricircolazioni dei flussi in prossimit&agrave; della parete sinistra inferiore e dei due setti intermedi.

<a href="/files/image/21/rettangoli/4500_100.png"><img src="/files/image/21/4500_100.png" alt="Velocit&agrave; per mesh (4500 elementi) rettangolare a 100s"></a>

<a href="/files/image/21/triangoli/4106_100.png"><img src="/files/image/21/4106_100.png" alt="Velocit&agrave; per mesh (4106 elementi) rettangolare a 100s"></a>

Aumentando il numero di elementi della griglia (superiore alla decina di migliaia) il sistema tende a rappresentare im maniera pi&ugrave; precisa il sistema reale, a scapito dei tempi di calcolo necessari. E' altres&igrave; evidente che aumentando il numero di elementi della griglia tende a ridursi la differenza dei risultati ottenuti tra mesh rettangolari e triangolari.

<a href="/files/image/21/rettangoli/18000_100.png"><img src="/files/image/21/18000_100.png" alt="Velocit&agrave; per mesh (18000 elementi) rettangolare a 100s"></a>

<a href="/files/image/21/triangoli/16528_100.png"><img src="/files/image/21/16528_100.png" alt="Velocit&agrave; per mesh (16528 elementi) rettangolare a 100s"></a>

E inoltre arrivando a 1000s dall'inizio i risultati ottenuti sono gli stessi:
<a href="/files/image/21/rettangoli/18000_1000.png"><img src="/files/image/21/18000_1000.png" alt="Velocit&agrave; per mesh (18000 elementi) rettangolare a 1000s"></a>

<a href="/files/image/21/triangoli/16528_1000.png"><img src="/files/image/21/16528_1000.png" alt="Velocit&agrave; per mesh (16528 elementi) rettangolare a 1000s"></a>