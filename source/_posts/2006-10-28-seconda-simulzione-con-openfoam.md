---
title: Seconda simulzione con OpenFOAM
categories: [OpenFOAM]
tags: [fluido, gmsh, simulazione]
---
Riprendiamo il modello realizzato nello <a href="/gmsh_genera_mesh">scorso articolo</a>, dove abbiamo un condotto cilindrico che confluisce all'interno di una camera rettangolare; a sua volta il fluido fuoriesce da essa tramite una condotta a sezione rettangolare e di dimensioni variabili. <!--break-->
Per poter effettuare una simulazione per lo meno verosimile &egrave; necessario modificare la densit&agrave; della griglia all'interno del modello realizzato; per fare questo dobbiamo modificare il file <a href="/files/19/esempio5.geo">esempio5.geo</a> cambiando il parametro di _Lunghezza Caratteristica_ dei vari nodi del modello, possiamo quindi aprire tramite un comune editor di testo il file e cambiare (utilizzando lo strumento **Cerca** o **Sostituisci**) tutte le righe che definiscono un nuovo punto da:
~~~language-php
Point(1) = { 0.0, 0.0, 0.0, 0.1};
~~~

a
~~~language-php
Point(1) = { 0.0, 0.0, 0.0, 0.02};
~~~

Potete trovare scaricare direttamente il file modificato <a href="/files/20/modello.geo">modello.geo</a>. Effettuata questa operazione dobbiamo rigenerare la _mesh_ (vi ricordate come fare?), non preoccupatevi se la CPU schizza al 100% per qualche minuto, al termine ricordatevi di salvare il risultato ottenuto (File -> Save Mesh).
Per importare il file di mesh cos&igrave; generato dobbiamo utilizzare l'utility _gmshToFoam_ fornita con <a href="/introduzione_openfoam">OpenFOAM</a>, quindi iniziamo a creare la directory principale e le accessorie per la simulazione tramite i comandi:
~~~language-php
cd ~/OpenFOAM/numeutente-1.3/run/
mkdir esempio2
mkdir esempio2/system
mkdir esempio2/constant
mkdir esempio2/constant/polyMesh
mkdir esempio2/0
~~~

e realizziamo i file per la gestione della simulazione, in particolare:
~~~language-php
gedit esempio2/sytem/controlDict
~~~

che deve contenere il seguente codice (per il significato vi rimando allo scorso articolo e alla guida di OpenFOAM):
~~~language-php
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    class           dictionary;
    object          controlDict;
}
application turbFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         0.2;
deltaT          0.005;
writeControl    timeStep;
writeInterval   10;
purgeWrite      0;
writeFormat     ascii;
writePrecision  6;
writeCompression uncompressed;
timeFormat      general;
timePrecision   6;
runTimeModifiable yes;

~~~

Dopo di che dobbiamo impostare il file:
~~~language-php
gedit esempio2/system/fvSchemes
~~~

che conterr&agrave;:
~~~language-php
ddtSchemes
{
    default         Euler;
}
gradSchemes
{
    default         Gauss linear;
    grad(p)         Gauss linear;
}
divSchemes
{
    default         Gauss linear;
    div(phi,U)      Gauss linear;
}
laplacianSchemes
{
    default         Gauss linear corrected;
    laplacian(nu,U) Gauss linear corrected;
    laplacian(1|A(U),p) Gauss linear corrected;
}
interpolationSchemes
{
    default         linear;
    interpolate(HbyA) linear;
}
snGradSchemes
{
    default         corrected;
}
fluxRequired
{
    default         no;
    p;
}
~~~

e
~~~language-php
gedit esempio2/system/fvSolution
~~~

che a sua volta conterr&agrave;:
~~~language-php
solvers
{
    p               ICCG 1e-06 0.01;
    U               BICCG 1e-05 0.1;
    k               BICCG 1e-05 0.1;
    epsilon         BICCG 1e-05 0.1;
    R               BICCG 1e-05 0.1;
    nuTilda         BICCG 1e-05 0.1;
}
SIMPLE
{
    nNonOrthogonalCorrectors 0;
}
relaxationFactors
{
    p               0.3;
    U               0.7;
    k               0.7;
    epsilon         0.7;
    R               0.7;
    nuTilda         0.7;
}
~~~

Questi file li potete trovare direttamente alegati a questo articolo con il nome <a href="/files/20/fvFiles.tar.gz">fvFiles</a>, decomprimeteli e posizionateli nella cartella opportuna.

Ora generiamo il nostro dominio di calcolo con il comando:
~~~language-php
gmshToFoam . esempio2 percorso/del/file/mesh.msh
~~~

con questo comando il programma genera tutte le informazioni necessarie della griglia che ci permetteranno, poi, di impostare le condizioni al contorno per il nostro problema. Al termine dell'operazione di conversione (non dovremmo avere nessun errore), proviamo a visualizzare il nostro modello e come &egrave; stato convertito. Per fare questo ci affidiamo al programma <a href="http://www.paraview.org">paraview</a> (o meglio alla sua versione modificata paraFoam):
~~~language-php
paraFoam . esempio2
~~~

L'interfaccia che ci si presenter&agrave; sar&agrave; simile a  quella rappresentata dalla seguente figura:
<img src="/files/image/20/immagine1.png" alt="" />
La parte che ora interessa a noi &egrave; quella visibile nella parte sinistra in basso, contrassegnata dalla dicitura _Region_, dove sono visibili una serie di pulsanti contrassegnati dalla dicitura _patch0_, _partch1_, etc . Questi indicano ognuno un pezzo delle pareti che noi abbiamo disegnato con il nostro programma; disattiviamo il pulsante _Internal Mesh_ che visualizza la mesh e premiano il pulsante _Accept_ (posizionato a destra nela parte superiore); in questo modo visualizzeremo il nostro modello. Anche in questo caso utilizzando il mouse (in maniera abbastanza simile a gmsh) per ruotare, traslare e zoommare il modello.
<img src="/files/image/20/immagine2.png" alt="" />
Ora spuntiamo tutte le superfici (patch1, patch2, ...) e, attivandole una per volta (aggiornando premendo il pulsante _Accept_), determiniamo quali sono le superfici attraverso cui il nostro fluido entrer&agrave; (patch4) e uscir&agrave; (patch12); le rimanenti saranno le pareti. Appurato questo possiamo chiudere il programma.
Poich&eacute; le pareti del modello sono tutte uguali (escluse le pareti di ingresso e uscita del fluido) non &egrave; necessario mantenerle separate; l'operazione di accorpamento &egrave; abbastanza complessa, per modificarla dovremmo andare a modificare il file _esempio2/constant/polyMesh/boundary_:
~~~language-php
gedit esempio2/constant/polyMesh/boundary
~~~

ora il file si presenter&agrave; in modo che ogni parete sia rappresentata da:
~~~language-php
patch0
{
    type patch;
    nFaces 342;
    startFace 226445;
}
~~~

dove avremo l'indicazione del nome della superficie (**patch0**), della tipologia della superficie (**type patch**), del numero di facce da cui &egrave; composta la superficie (**nFaces 342**) ed infine dalla faccia di partenza (**startFace 226445**). In pratica ogni faccia delle celle della griglia di calcolo che realizziamo &egrave; indicata da un numero (progressivo) e quindi in questo modo sappiamo che la superficie patch0 &egrave; formato da tutte le superfici delle celle che partono dalla 226445 e arrivano alla 226445+342. Raggruppando le varie superfici otteniamo:
~~~language-php
TUBO
{
    type patch;
    nFaces 1360;
    startFace 226445;
}
INLET
{
    type patch;
    nFaces 158;
    startFace 227805;
}
CAMERA1
{
    type patch;
    nFaces 4264;
    startFace 227963;
}
OUTLET
{
    type patch;
    nFaces 228;
    startFace 232227;
}
CAMERA2
{
    type patch;
    nFaces 4620;
    startFace 232455;
}
defaultFaces
{
    type patch;
    nFaces 0;
    startFace 237075;
}
~~~

dove sono stati dati dei nomi pi&ugrave; significativi alle varie superfici e sono state raggruppate in modo da averne un numero minore, quindi pi&ugrave; facilmente gestibile; i file completo lo trovate allegato con il nome <a href="/files/20/boundary">bounduary</a>.
L'impostazione delle condizioni iniziali vengono fatte configurando i file opportuni all'interno della cartella 0 (tempo di partenza). Vi evito la realizzazione manuale di questi file, li potete trovare nel file compresso <a href="/files/20/CondizioniIniziali.tar.gz">Condizioni Iniziali</a>, decomprimetelo e ponete questi file nella cartella indicata.
La nostra simulazione prevederebbe l'utilizzo di un calcolo che considera anche la turbolenza del fluido, ovvero _turbFoam_. Poich&eacute; questo programma &egrave; particolarmente sensibile a condizioni particolari, quali sono quelle iniziali in cui tutto il fluido &egrave; fermo e si imprime un moto (di conseguenza &egrave; facile che si abbia divergenza delle equazioni) si preferisce iniziare a effettuare una simulazione tramite un programma meno preciso, ma che sopporta meglio queste condizioni limite, avvieremo a nostra simulazione tramite il comando:
~~~language-php
simpleFoam . esempio2
~~~

Al termine dell'esecuzione si avr&agrave; una prima approssimazione di come si &egrave; comportato il fluido (tralasciando i fenomeni turbolenti). Ora dobbiamo avviare la simulazione che fornir&agrave; informazioni pi&ugrave; dettagliate sul comportamento del fluido, ma prima di fare questo va modificata la cartella contenete le condizioni iniziali, spostando i file risultati della prima simulazione (al tempo 0.2) nella cartella contenete i dati di partenza (cartella 0), quindi:
~~~language-php
mv esempio2/0.2/* esempio2/0
~~~

e di seguito eliminiamo le cartelle contenenti i risultati della prima simulazione:
~~~language-php
rm -r esempio2/0?*
~~~

Dobbiamo anche modificare il file che indica il metodo di risoluzione utilizzato, sostituiamo quindi il file _esempio2/system/fvSolution_ con quello allegato con il nome fvSolution (Turbolento). Ora possiamo avviare la simulazione con moto turbolento tramite il comando:
~~~language-php
turbFoam . esempio2
~~~

Al termine della simulazione avremmo quanto visibile nella seguente immagine, rappresentante l'andamento dei filetti di fluido nel nostro modello; &egrave; evidente il fenomeno di ricircolazione che si instaura negli angoli del recipiente di dimensioni maggiori.
<img src="/files/image/20/immagine3.png" alt="" />