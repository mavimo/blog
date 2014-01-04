---
title: Esempio di simulazione con OpenFOAM
categories: [OpenFOAM]
tags: [dinamica, fluido in condotta]
---
Realizziamo un esempio sull'utilizzo di <a href="http://www.openfoam.org">OpenFOAM</a> per l'analisi della dinamica di un fluido all'interno di una condotta.
Ogni nuovo caso da analizzare deve essere inserito in una nuova directory realizzata appositamente, in cui saranno inseriti tutti i parametri per la simulazione.
<!--break-->
Iniziamo realizzando la struttura base della simulazione:
~~~language-php
$ mkdir ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**
$ mkdir ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/constant
$ mkdir ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/constant/polyMesh
$ mkdir ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/system
~~~

La prima &egrave; la cartella che raccoglie tutte le informazioni sula simulazione, la cartella <i>constant</i> contiene le informazioni della simulazione che non mutano nel tempo e nella sua sottodirectory _polyMesh_ troviamo le informazioni sulla struttura (_2D_ o _3D_) del dominio in analisi. La cartella _system_ contiene tutte le informazioni indispensabili al simulatore quali la durata del processo da considerare, l'intervallo di tempo tra due step successivi, quali informazioni salvare e ogni quanto tempo, etc...
Iniziamo a realizzare il dominio della simulazione. Questa operazione pu&ograve; essere svolta con numerosi programmi di preprocessing (quali _gMsh_, _Salome_, ...), oppure editando direttamente un file di testo. Per questa volta, data la semplicit&agrave; della struttura, utilizzeremo quest'ultimo metodo, in una prossimo articolo affronteremo in maniera pi&ugrave; completa la realizzazione di strutture complesse con altri programmi.
Il file conterr&agrave; le informazioni della struttura sar&agrave;:
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/constant/polyMesh/blockMeshDict
~~~

In questo file andremo ad inserire:
~~~language-php

/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    class           dictionary;
    object          blockMeshDict;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
convertToMeters 0.1;
vertices 
(
);
blocks
(
);
edges
(
);
patches
(
);
mergePatchPairs 
(
);
// ************************************************************************* //
~~~

come si pu&ograve; notare non si &egrave; inserta alcuna informazioni circa la struttura, ma abbiamo creato la struttura di base da cui poi si otterranno tutte le informazioni necessarie. L'opzione convertToMeters indica quale &egrave; l'unit&agrave; di misura scelta , nel nostro caso 0.1m ovvero 10cm. All'interno del blocco vertices andremo ad inserire le coordinate di ognuno dei vertici della nostra struttura secondo la tripletta (X Y Z). All'interno di blocks andremo a realizzare quali sono i vertici correlati in modo da avere dei blocchi che saranno il dnominio della simulazione, infine in patches si avranno le informazioni per indicare le pareti della struttura, ognuna caratterizzata da differenti propriet&agrave;.
La struttura che vogliamo realizzare &egrave; qu&igrave; rappresentata e ogni suo vertice deve essere inserito (oltre ad alcuni vertici di supporto) cos&igrave; da permettere la ricostruzione esatta del dominio.

<img src="files/image/10/condotta.png" />

I numeri in rosso indicano i vertici posizionati a quota 0, mentre quelli in blui sono posizionati a Z=1. Iniziamo quindi inserendo:
~~~language-php

...
...
convertToMeters 0.1;
vertices
(
    (0  0  0)    // Point 0 
    (10 0  0)    // Point 1 
    (0  1  0)    // Point 2
    (5  1  0)    // Point 3 
    (6  1  0)    // Point 4 
    (9  1  0)    // Point 5 
    (9  2  0)    // Point 6 
    (6  2  0)    // Point 7 
    (5  2  0)    // Point 8 
    (0  2  0)    // Point 9
...
...

~~~

e proseguiamo fino al ccompleto inserimento di tutti i vertici riportati.
I blocchi devono essere inseriti seguendo le specifiche riportate nel manuale di OpenFOAM, nel nostro caso utilizziamo dei parallelepiedi (per non compicare troppo le cose) quindi dovremmo inserirli come indicato:
~~~language-php
hex (0 28 3 2 14 38 17 16 ) (10 10 10) simpleGrading (1 1 1)
~~~

dove hex indica il tipo di blocco, gli otto numeri seguenti indicano i vercii del blocco partendo da quello in posizioneinferiore a sinistra e proseguendo in senso orario, per poi passare alla faccia superiore (sempre in senso orario). La tripletta successivi indica in quanti punti deve essere suddiviso il blocco per generare la griglia di calcolo, mentre simpleGrading (1 1 1) indica il rapporto che vi &egrave; tra i vari elementi della mesh che si andr&agrave; a realizzare; nel nostro caso la mesh sar&agrave; regolare. Proseguiamo in qesto modo fino al completamento della struttura:
~~~language-php
...
...
blocks
(
    hex (0 28 3 2 14 38 17 16 ) (10 10 10) simpleGrading (1 1 1)
    hex (28 29 4 3 38 39 18 17 ) (10 10 10) simpleGrading (1 1 1)
    hex (29 30 5 4 39 47 19 18 ) (10 10 10) simpleGrading (1 1 1)
    hex (30 1 36 5 47 15 40 19 ) (10 10 10) simpleGrading (1 1 1)
...
...
~~~

La parte finale per la generazione del dominio di calcolo &egrave; la realizzazione delle superfici al contorno (boundary), che vanno inserirte all'interno di patches, dove dovremmo indicare il tipo di boundary (se si tratta di una superficie attreverso cui il fluido pu&ograve; passare o meno), seguita dal nome e contenente i vertici delle pareti da considerare. Per una maggiore comprensione delle seguenti linee di codice consiglio la lettura del manuale utente, in ogni caso il risultato sar&agrave; simile a:
~~~language-php
...
...
patches
(
    // Faccia di ingresso
    patch inlet 
    (
        (0 14 16 2)
    )
    // Faccia di uscita
    patch outlet 
    (
        ( 10 24 25 11)
    )
..
...
~~~

La mesh finale ottenuta &egrave; visibile nell'immagine seguente:

<img src="/files/image/10/mesh_side.png" alt="Immagine della mesh utilizzata." />

Terminata la fase di realizzazione del dominio &egrave; necessario andare ad impostare le propriet&agrave; del fluido e della superficie (_boundary condiction_) per la simulazione. Le propriet&agrave; del fluido sono configurabili all'interno del file 
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/constant/transportProperties<br />
~~~

dove andremo ad inserire la viscosit&agrave; del fluido (simuliamo solamente i fenomeni di trasporto, nessun trasporto di calore o reazioni, miscelazione di pi&ugrave; fluidi, ...) quindi andremo a scrivere:
~~~language-php
/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    lass           dictionary;
    object          transportProperties;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
nu              nu [0 2 -1 0 0 0 0] 0.01;
// ************************************************************************* //
~~~

dove nu indica la viscosit&agrave;, il successivo vettore indica gli esponenti delle unit&agrave; di misura in cui &egrave; espressa infine il valore che assume; nel nostro caso abbiamo impostato le propriet&agrave; per il fluido acqua. Le informazioni sulle condizioni iniziali del fluido all'inizio della simulazione si trovano all'interno della cartella
~~~language-php
~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/0 
~~~

ed in particolare avremo:
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/0/p
~~~

che contiene:~~~language-php

/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    class           volScalarField;
    object          p;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
dimensions      [0 2 -2 0 0 0 0];
internalField   uniform 0;
boundaryField
{
    inlet
    {
        type            zeroGradient;
    }
    outlet
    {
        type            fixedValue;
        value           uniform 0;
    }
    border
    {
        type            zeroGradient;
    }
}
// ************************************************************************* //
~~~

Dove si indica che sulle superfici inlet e border il gradiente di ressione &egrave; nulla, mentre sulla superficie in uscita si ha pressione costante e pari a 0, ovvero la parete non fornisce nessuna resistenza all'uscita del fluido.
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/0/U
~~~

che invece contiene:
~~~language-php

/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    class           volVectorField;
    object          U;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
dimensions      [0 1 -1 0 0 0 0]
internalField   uniform (0 0 0);
boundaryField
{
    inlel
    {
        type            fixedValue;
        value           uniform (0.1 0 0);
    }
    outlet
    {
        type            zeroGradient;
    }
    border<br />    {
        type            fixedValue;
        value           uniform (0 0 0);
    }
}
// ************************************************************************* //
~~~

In questo caso la velocit&agrave; iniziale, espressa in m/s come indicato nella propriet&agrave; dimension, del fuido all'interno del dominio &egrave; impostata a 0 (internalField) e dalle superfici inlet il fluido entra con una velocit&agrave; di 0.1m/s, mentre sulle pareti la velot&agrave; del fluido &egrave; nulla; infine sulla parete di uscita la velocit&agrave; ha gradiente nullo.
Ora andremo ad impostare i paramentri per il simulatore che andremo ad utilizzare successivamente. Queste informazioni si trovano nel file
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/system/controlDict
~~~

che conterr&agrave;:
~~~language-php

/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
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
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
application icoFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         10;
deltaT          0.005;
writeControl    timeStep;
writeInterval   20;
purgeWrite      0;
writeFormat     ascii;
writePrecision  6;
writeCompression uncompressed;
timeFormat      general;
timePrecision   6;
runTimeModifiable yes;
// ************************************************************************* //
~~~

Dove abbiamo impostato il codice di simulazione che utilizzeremo (icoFoam), il tempo di partenza (starTime = 0s) e il termine della simulazione (endTime = 10s); il tempo trascorso tra due step della simulazione (deltaT = 0.005s), e di scrivere i risultati ogni 20 step (in pratica ogni 0.1s) infine indichiamo di salvare le informazioni in un file di testo non compresso con una precisione di 6 decimali e impostiamo la precisione del tempo a 6 decimali.
Le impostazioni per la tipologia di codice da utilizzare nella simulazione &egrave; indicata nel file:
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/system/fvSchemes
~~~

Al cui interno troveremo:
~~~language-php

/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    class           dictionary;
    object          fvSchemes;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
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
    default         none;
    div(phi,U)      Gauss linear;
}
laplacianSchemes
{
    default         none;
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
// ************************************************************************* //
~~~

Non approfondiremo in questa sede le impostazioni riportate, che fosse interessato cosulti il manuale utente di OpenFOAM. Le iformazioni che vogliamo salvare della simulazione (quelle su cui andremo ad effettuare le aalisi che ci interessano) si trovano nel file:
~~~language-php
$ gedit ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/system/fvSolution
~~~

che contiene:
~~~language-php

/*---------------------------------------------------------------------------*\
| =========                 |                                                 |
| \\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\    /   O peration     | Version:  1.3                                   |
|   \\  /    A nd           | Web:      http://www.openfoam.org               |
|    \\/     M anipulation  |                                                 |
\*---------------------------------------------------------------------------*/
FoamFile
{
    version         2.0;
    format          ascii;
    root            "";
    case            "";
    instance        "";
    local           "";
    class           dictionary;
    object          fvSolution;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
solvers
{
    p               ICCG 1e-06 0;
    U               BICCG 1e-05 0;
}
PISO
{
    nCorrectors     2;<br />    nNonOrthogonalCorrectors 0;
    pRefCell        0;
    pRefValue       0;
}
// ************************************************************************* //
~~~

In cui &egrave; indicato che ci interessa salvare le informazioni di pressione (p) e velocit&agrave; (U) del fluido all'interno del dominio.
Potete trovare la cartella con a struttura e i file fondamentali gi&agrave; preparati <a href="/files/10/test.tar.gz">qui</a>.
Al termine di tute queste operazioni &egrave; possibile lanciare il processo di simulazione con il comando:
~~~language-php
$ cd ~/OpenFOAM/**nome utente**-1.3/run/
$ blockMesh . **nome simulazione**
$ icoFoam . **nome simulazione**
~~~

Dove il primo comando ci porta nella directory radice della nstra simulazione, il secondo genera la mesh usando le informazioni indicate e il terzo effettua la simualzione vera e propria. Al termine dovremmo trovare all'interno della cartella **nome simulazione** una serie di cartelle, ognuna con il nome indicante il tempo in cui ci si trova (per esempio 3.5 indica che ci si trova a 3s e mezzo della simulazione), che contengono i file con i dati ottenuti.
~~~language-php
$ ls ~/OpenFOAM/**nome utente**-1.3/run/**nome simulazione**/
~~~

La fase successiva sar&agrave; la visualizzazione ed interpretazione dei dati cos&igrave; ottenuti, per esempio tramite paraView (se installato come indicato nell'articolo precedente) tramite il comando:
~~~language-php
<br />$ paraFoam . **nome simulazione**
~~~

L'utilizzo di paraFoam per le operazioni di postprocessing verranno affrontate in un altro articolo, in ogni caso eccovi alcune delle immagini ottenute dalla nostra simulazione.

<img src="/files/image/10/vel_side.png" alt="Immagine della velocit&agrave; nella sezione centrale lungo il piano z della condotta." />

Immagine della velocit&agrave; nella sezione centrale lungo il piano z della condotta.

<a href="/files/image/10/tube_vel.png"><img src="/files/image/10/tube_vel.png" alt="Immagine della velocit&agrave; del fluido nella condotta." /></a>
Immagine della velocit&agrave; del fluido nella condotta.