---
title: Installare OpenFOAM 1.4 su Ubuntu 7.04
categories: [OpenFOAM]
tags: [installazione]
---
A seguito dell'uscita della nuova versione di <a href="http://www.ubuntu-it.org">Ubuntu</a> (ora alla versione 7.04) e di <a href="http://www.openfoam.org">OpenFOAM</a> (arrivato alla versione 1.4), vediamo come effettuare l'installazione su una macchina con il sistema operativo installato a cui non sono stati aggiunti altri pacchetti.<!--break-->
Come prima operazioni vanno installati alcuni pacchetti che non sono presenti nell'installazione di base di Ubuntu, in particolare è necessario installare il pacchetto per la compilazione~~~language-php
sudo apt-get install build-essential
~~~
il server ssh necessario al programma per poter comunicare con altri eventuali macchine e comunque con se stesso~~~language-php
sudo apt-get install openssh-server
~~~
ed infine le librerie per l'ssl necessarie per poter eseguire l'interfaccai grafica in Java _FoamX_:~~~language-php
sudo apt-get install libssl0.9.7
~~~
Poiché l'installazione di OpenFOAM richiede il settaggio di alcune variabili globai che potrebbero rallentare  o comunque rendere scomodo l'utilizzo quotidiano del computer per le applicazioni standard andiamo a creare un nuovo utente il cui unico scopo sarà quello di effettuare le simulazioni. Per creare un nuovo utente, da shell, diamo il seguente comando~~~language-php
sudo adduser _simulation_
~~~
dove con _simulation_ abbiamo indicato il nome dell'utente che svolgerà le simulazioni. Di seguito si indicherà sempre con questo nome l'utente che svolge le simulazioni. Rispondiamo alle domande che ci vengono poste per il nuovo utente e terminiamo la creazione di questo.
Al termine della realizzazione del nuovo utente dobbiamo abilitare la possibilità di accedere tramite ssh a questo; poiché di default il server ssh richiede che il collegamente avvenga tramite protezione con certificato dobbiamo creare i certificati e esportarli. Come prima cosa diventiamo l'utente _simulation_ con il comando ~~~language-php
su _simulation_
~~~
ed inseriamo la password che abbiamo scelto precedentemente. A questo punto creiamo le chiavi con il comando~~~language-php
ssh-keygen -t dsa
~~~
e lasciamola pure senza nessuna password (quindi diamo 2 volte Ok). Possiamo vedere le chiavi generare con ~~~language-php
ls .ssh/*
~~~
Esportiamo ora le chiavi verso il nostro utente dando il comando:~~~language-php
ssh-copy-id -i .ssh/id_dsa.pub _vostro_utente_@localhost
~~~
dove, ovviamente, _vostro_utente_ è l'utente che usate di solito sulla macchina. Alla prima richiesta digitate _yes_, mentre di seguito vi chiederà la password per il vostro utente. Ora possiamo uscire dall'utente _simulation_ e tornate vostro utente, è sufficiente digitare:~~~language-php
exit
~~~
Collegiamoci ora tramite ssh all'utente _simulation_:~~~language-php
ssh _simulation_@localhost
~~~
e creaimo la direcotory dove installare _OpenFOAM_ ed entriamoci:~~~language-php
mkdir OpenFOAM
cd OpenFOAM
~~~
Proseguiamo con il download dei pacchetti necessari, potete scegliere se scaricarli dal <a href="http://www.opencfd.co.uk/openfoam/download.html#download">sito ufficiale</a> o direttamente dai repository, nel caso usiate una versione di linux a 32bit è sufficiente dare i comandi:~~~language-php
wget http://mesh.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.4.General.gtgz
wget http://mesh.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.4.linuxGcc4SPOpt.gtgz
wget http://mesh.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.4.linuxGcc4DPOpt.gtgz
~~~
una volta terminato il download dell'ultimo pacchetto decomprimiamoli:~~~language-php
tar -xzf OpenFOAM-1.4.General.gtgz
tar -xzf OpenFOAM-1.4.linuxGcc4SPOpt.gtgz
tar -xzf OpenFOAM-1.4.linuxGcc4DPOpt.gtgz
~~~
e controlliamo se possiamo proseguire con l'installazione tramite il comando:~~~language-php
~/OpenFOAM/OpenFOAM-1.4/bin/foamSystemCheck
~~~
Effettiuamo la modifica al file _~/.bashrc_ dando:~~~language-php
nano ~/.bashrc
~~~
e aggiungendo al termine del file la seguente riga:~~~language-php
. $HOME/OpenFOAM/OpenFOAM-1.4/.OpenFOAM-1.4/bashrc
~~~
Salviamo premendo contemporaneamente i tasti _CRTL+O_ e usciamo con _CTRL+X_L'operazione successiva prevede la realizzazione della cartella per l'utente che dovrà utilizzare i  programmi di simulazione e:~~~language-php
mkdir -p ~/OpenFOAM/${LOGNAME}-1.4/run
~~~
e la successiva copia dei file di esempio:~~~language-php
cp -r ~/OpenFOAM/OpenFOAM-1.4/tutorials ~/OpenFOAM/${LOGNAME}-1.4/run
~~~
Ora usciamo dalla connessione ssh e rientriamo per permettere di ricarica re il file _~/.bashrc_, quindi diamo:~~~language-php
exit
ssh _simulation_@localhost
~~~
Per controlare se tutto è andato a buon fine possiamo lanciare la simulazione di esempio presente nei tutorial:~~~language-php
cd ~/OpenFOAM/simulation-1.4/run/tutorials/icoFOAM/
blockMesh . cavity
icoFoam . cavity
~~~
Se tutto termina con successo l'installazione di base è terminata, ma è necessario installare altri programmi per poter effettivamente trarre utilità dei programmi finora installati; in particolare sono necessari _paraFoam_ per la visualizzazione dei risultati, _Java_ per poter usare FoamX come interfaccia grafica e il compilatore _gcc_ per la compilazione di nuovi risolutori.
<h3>Visualizzatore ParaView</h3>
Per l'installazione del visualizzatore grafico è necessario creare una nuova cartella e posizionarvici all'interno:~~~language-php
mkdir ~/OpenFOAM/linux
cd ~/OpenFOAM/linux
~~~
Ora si deve scaricare il pacchetto contente i binari:~~~language-php
wget http://mesh.dl.sourceforge.net/sourceforge/foam/paraview-2.4.4.linux.tgz
~~~
e la successiva decompressione:~~~language-php
tar -xzf paraview-2.4.4.linux.tgz
~~~
A questo punto l'applicativo è stato installato.
<h3>Framework Java</h3>
Un operazione simile a quella necessari aper ParaView è necessaria er l'installazione di Java, quindi entriamo nella cartella precedentemente realizzata, scarichiamo il file e decomprimiamolo:~~~language-php
cd ~/OpenFOAM/linux
wget http://mesh.dl.sourceforge.net/sourceforge/foam/j2sdk1.4.2_05.linux.tgz
tar -xzf j2sdk1.4.2_05.linux.tgz
~~~
Anceh in questo caso l'installazione di Java è terminata.
<h3>Compilatore gcc</h3>
Come visto precedentemente diamo i comandi:~~~language-php
cd ~/OpenFOAM/linux
wget http://mesh.dl.sourceforge.net/sourceforge/foam/gcc-4.1.2.linux.tgz
tar -xzf gcc-4.1.2.linux.tgz
~~~


Al termine dell'installazione di tutti i programmi necessari usciamo e riconnettiamoci tramite ssh, ricordandoci di passare l'ozione -X, necessaria a poter lanciare applicazioni grafiche, quindi:~~~language-php
exit
ssh -X _simulation_@localhost
~~~
Per controlare che tutto funzioni diamo il comando:~~~language-php
foamInstallationTest
~~~
che dovrebbe confermarci che tutto funziona correttamente.
Possiamo ora visualizzare i risultati della simulazione risolta precedentemente:~~~language-php
cd ~/OpenFOAM/simulation-1.4/run/tutorial/icoFoam/
paraFoam . cavity
~~~
A questo punto possiamo dedicarci al nostro lavoro o passare alla compilazione di tutti gli applicativi per l'ottimizzazione rispetto all'arhchitettura della nostra macchina.