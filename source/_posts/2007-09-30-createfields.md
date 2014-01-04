---
title: createFields
categories: [OpenFOAM]
tags: []
---
Nello sviluppo di nuovi risolutori all'interno di OpenFOAM pu&ograve; risultare necessario dichiarare nuove variabili che assumono un valore costante (o variabile) all'interno del dominio analizzato. Queste variabili, solitamente dichiarate all'interno del file _createFields.H_, possono essere dei semplici scalari, dei vettori di scalari, dei tensori i scalari o dei **dizionari**. A loro volta questi valori possono essere associati all'interno campo del dominio (all'interno volume) o solamente alla superficie del dominio; in funzione del tipo di variabile da dichiarare si utilizzaranno degli oggetti differenti.<!--break-->
Se consideriamo le variabili che hanno un valore solo sulla superficie abbiamo:

   * _surfaceScalarField_: definisce un valore scalare per ogni elemento della superficie.
   * _surfaceVectorField_: definisce un vettore di lunghezza 3 per ogni elemento della superficie.
   * _surfaceSphericalTensorField_: definisce un tensore a simmetria sferica per ogni elemento della superficie.
   * _surfaceSymmTensorField_: definisce un tensore simmetrico per ogni elemento della superficie.
   * _surfaceTensorField_: definisce un tensore per ogni elemento della superficie.

Mentre per variabili che devono assumere valori differenti all'interno del campo di dominio si hanno a disposizione:

   * _volScalarField_: definisce un valore scalare per ogni elemento dell'interno volume del dominio di calcolo.
   * _volVectorField_: definisce un vettore per ogni elemento dell'interno volume del dominio di calcolo.
   * _volSphericalTensorField_: definisce un tensore a simmetria sferica per ogni elemento dell'interno volume del dominio di calcolo.
   * _volSymmTensorField_: definisce un tensore simmetrico per ogni elemento dell'interno volume del dominio di calcolo.
   * _volTensorField_: definisce un tensore per ogni elemento dell'interno volume del dominio di calcolo.

<h3>Inizializzazione</h3>
Una volta definito il tipo di variabile di cui si necessita si procede ad inizializzarla; questa operazione viene compiuta tramite l'utilizzo dell'oggetto _IOobject_ che permette di effettuare la lettura dei dati contenuti all'interno dei file di partenza o dei differenti step di esecuzione, nel caso si interrompa l'esecuzione e la si riavvi in un secondo momento. La classe IOobject ha due costruttori, nel primo si definisce il nome che la variabile assume che &egrave; anche il nome del file che verr&agrave; utilizzato in fase di salvataggio; il secondo parametro &egrave; l'istanza a cui ci si riferisce. Solitamente come istanza si utilizza un valore costante (usando _runTime.constant()_) o l'istante temporaale in elaborazione (con _runTime.timeName()_), ma &egrave; possibile usare un qualsiasi testo che si riferisca ad una directory in cui si trover&agrave; il file in questione. Come terza variabili in input del costruttore si ha l'oggetto a cui viene assegnata la variabile in questione (solitamente &egrave; la mesh in elaborazione). Il quarto parametro si riferisce alle opzioni in lettura del file, che possono essere:

   * _NO_READ_: ovvero il file non viene letto.
   * _MUST_READ_: il file deve essere letto, se non esiste ritorner&agrave; un errore.
   * _READ_IF_PRESENT_: effettua la lettura del file, se non presente non ritorna un errore.

di dafault il valore assegnato, nel caso in cui si ometta questo campo &egrave; NO_READ.
Il quinto e ultimo parametro si riferisce alle opzioni di scrittura del file e pu&ograve; assumere il valore:

   * _AUTO_WRITE_: effettua al scrittura del file ogni volta che viene richiesto.
   * _NO_WRITE_: non effettua la scrittura del file con le informazioni.

di default il valore impostato &egrave; NO_WRITE.

Il secondo costruttore utilizazbile per la lettura di informazioni del file, decisamente meno usato, aggiunge un ulteriore parametro che si va a inserire tra il secondo e terzo parametro del costruttore precedente e rappresenta il posizionamento locale dei file.

La dichiarazione della variabile, oltre a richiedere l'inizializzazione acquisendo i dati dal file i questione deve essere associato ad un determinato oggetto che rappresenta il dominio, quindi solitamente alla mesh del dominio.

<h3>Esempi</h3>
Un esempio abbastanza comune dell'utilizzo di questo metodo per la dichiarazione di variabili &egrave; il seguente:
~~~language-php
volVectorField U
(
    IOobject
    (
        "U",
        runTime.timeName(),
        mesh,
        IOobject::MUST_READ,
        IOobject::AUTO_WRITE
    ),
    mesh
);
~~~

Analizzando questo codice si vede che viene dichiarata una nuova variabile di tipo _volVectorField_ chiamata _U_. Qusta variabile rappresenta la velocit&agrave; del fluido all'interno del dominio di clacolo per ogni elemento della mesh, il primo elemento del costruttore della variabile &egrave; dato dall'oggetto IOobject, mentre la seconda parte dall'oggetto a cui devone essere applicate le propriet&agrave; prelevate dal file (ovvero alla mesh precedentemente creata e inizializzata). L'oggetto IOobject legger&agrave; il file chiamato _U_ che si trover&agrave; nella directory che assume il nome del timestep che viene elaborato, che questi dati devono essere applicati alla mesh e che il file deve essere obbligatoriamente presente e leggibile (MUST_READ) e che verr&agrave; scritto ogni qualvolta viene richiesto (AUTO_WRITE).
Altro esempio &egrave; dato da:
~~~language-php
surfaceScalarField phi
(
    IOobject
    (
        "phi",
        runTime.timeName(),
        mesh,
        IOobject::NO_READ,
        IOobject::NO_WRITE
    ),
    mesh
);
~~~

In cui viene creata una variabile di tipo _surfaceScalarField_ che definisce un flusso di materia lungo una superficie. L'_IOobject_ ci dice che il file si chiamer&agrave; _phi_ e che si trover&agrave; nella cartella con il nome uguale al tempo di esecuzione considerato. Il file non deve essere letto ne scritto, opzioni tipiche di variabili utilzizate solo all'interno del codice che non hanno interesse al di fuori di esso.

Grazie ad <a href="http://albertopassalacqua.com/">AlbertoP</a> per avermi fatto rispolverare questo testo :D