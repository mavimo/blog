---
title: Installare OpenFOAM
categories: [openfoam]
tags: [installazione]
redirect: [openfoam/installare_versione_13, node/6]
meta:
    description: Questa &egrave; una piccola guida su come installare <a href="http://www.openfoam.org">OpenFOAM 1.3</a> su di un sistema linux. 
    tags: [openfoam, installazione]
---
Questa &egrave; una piccola guida su come installare <a href="http://www.openfoam.org">OpenFOAM 1.3</a> su di un sistema linux. 
Innanzitutto bisogna scaricare dal <a href="http://www.openfoam.org/download.html">sito</a> il pacchetto <a href="http://surfnet.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.3.General.gtgz">_OpenFOAM-1.3.General.gtgz_</a>, il pacchetto per l'esecuzione in <a href="http://puzzle.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.3.linuxGcc4SPOpt.gtgz">singola precisione</a> e in <a href="http://puzzle.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.3.linuxGcc4DPOpt.gtgz">doppia precisione</a>, i pacchetti qui riportati sono compilati per architettura Intel a 32bit, ma sul sito sono disponibili altre versioni (ottimizzati per AMD64, processori Alpha, etc..).
~~~language-php
$ wg&#101;t http://surfnet.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.3.General.gtgz
$ wg&#101;t http://puzzle.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.3.linuxGcc4DPOpt.gtgz
$ wg&#101;t http://heanet.dl.sourceforge.net/sourceforge/foam/OpenFOAM-1.3.linuxGcc4SPOpt.gtgz
~~~

I file qui indicati andanno rinominati (altrimenti si avranno problemi in fase di decompressione, non ho ancora capito il perch&eacute;):
~~~language-php
$ mv OpenFOAM-1.3-General.gtgz OpenFOAM-1.3-General.gz 
$ mv OpenFOAM-1.3.linuxGcc4DPOpt.gtgz OpenFOAM-1.3.linuxGcc4DPOpt.gz
$ mv OpenFOAM-1.3.linuxGcc4SPOpt.gtgz OpenFOAM-1.3.linuxGcc4SPOpt.gz
~~~

e successivamente decompressi (due volte di seguito):
~~~language-php
$ tar xzf OpenFOAM-1.3-General.gz 
$ tar xzf OpenFOAM-1.3-General.gz
$ tar xzf OpenFOAM-1.3.linuxGcc4DPOpt.gz
$ tar xzf OpenFOAM-1.3.linuxGcc4DPOpt.gz
$ tar xzf OpenFOAM-1.3.linuxGcc4SPOpt.gz
$ tar xzf OpenFOAM-1.3.linuxGcc4SPOpt.gz
~~~

Dovremo, quindi, copiare la cartella ottenuta nella HOME dell'utente
~~~language-php
$ mkdir ~/OpenFOAM 
$ cp -r OpenFOAM-1.3.General ~/OpenFOAM/OpenFOAM-1.3
$ cp -r OpenFOAM-1.3.linuxGcc4DPOpt ~/OpenFOAM/OpenFOAM-1.3
$ cp -r OpenFOAM-1.3.linuxGcc4SPOpt.gz ~/OpenFOAM/OpenFOAM-1.3
~~~

Controllare di avere installato <span style="font-style: italic;">rsh </span>o <span style="font-style: italic;">ssh </span>in accesso sul computer (non basta un client, serve il server per accedere, Poich&eacute; openfoam comunica con se stesso tramite ssh) e controllare che si riesca a pingare _localhost_ e _nome_pc_; Per esempio:
~~~language-php
$ ping localhost
$ ping fisso
~~~

per farlo &egrave; possibile anche lanciare da shell lo script: 
~~~language-php
$ ~/OpenFOAM/OpenFOAM-1.3/bin/foamSystemCheck
~~~

Se tutto va a buon termine &egrave; possibile inserire al termine di _~/.bashrc_ la seguente linea:
~~~language-php
. ~/OpenFOAM/OpenFOAM-1.3/.OpenFOAM-1.3/bashrc
~~~

per aggiungere le variabili di ambiente necessarie all'esecuzione del programma.
ATTENZIONE: in questo modo aggiunge sempre una marea di variabili globali, meglio sarebbe creare un utente esclusivamente per OpenFOAM e aggiungere al suo <span style="font-style: italic;">.bashrc</span> la direttiva e usare sempre questo utente per le simulazioni. Aprire una shell e controllare che non vi siano errori, dovrebbe comparire un cosa simile a:
~~~language-php
Executing: /home/utente/OpenFOAM/OpenFOAM-1.3/.bashrc 
Executing: /home/utente/OpenFOAM/OpenFOAM-1.3/.OpenFOAM-1.2/apps/ensightFoam/bashrc 
Executing: /home/utente/OpenFOAM/OpenFOAM-1.3/.OpenFOAM-1.2/apps/paraview/bashrc 
utente@pcname :~$
~~~

Lanciare nella shell appena aperta il comando 
~~~language-php
$ foamInstallationTest
~~~

se aveta gi&agrave; tutto pronto l'istallazione &egrave; andata a buon fine, altrimenti bisogna controllare gli errori che riporta lo script. Gli errori che dava a me lo script _foamInstallationTest_ sono stati sistemati come di seguito riportato.
<h2>Installare java</h2> 
Scaricare dal <a href="http://www.openfoam.org/download.html">sito</a> il pacchetto <a href="http://ovh.dl.sourceforge.net/sourceforge/foam/j2sdk1.4.2_05.linux.tgz">_j2sdk1.4.2_05.linux.tgz_</a>. Decomprimerlo 
~~~language-php
$ tar xzf j2sdk1.4.2_05.linux.tgz
~~~

Creare le cartelle dove posizionarlo:
~~~language-php
$ mkdir ~/OpenFOAM/linux
~~~

Copiare i file nella directory creata:
~~~language-php
$ cp -r sdk1.4.2_05 ~/OpenFOAM/linux/sk1.4.2_05
~~~

Ora dovreste poter lanciare nuovamente
~~~language-php
$ foamInstallationTest
~~~

e l'errerore che segnala la mancanza di <span style="font-style: italic;">java</span> dovrebbe essere scomparso.
<h2>gcc 4.1</h2>
Il gcc deve essere la stessa versione con cui &egrave; stato compilato OpenFOAM, cio&egrave; la 4.1 o superiori (con il gcc 4.1 di ubuntu funziona). Scaricare dal <a href="http://www.openfoam.org/download.html">sito</a> il pacchetto <a href="http://puzzle.dl.sourceforge.net/sourceforge/foam/gcc-4.1.0.linux.tgz">_gcc-4.1.0.linux.tgz_</a>. Decomprimerlo 
~~~language-php
$ tar xzf gcc-4.1.0.linux.tgz
~~~

Copiate la cartella 
~~~language-php
$ cp -r gcc-4.1.0 ~/OpenFOAM/linux/gcc-4.1.0
~~~

Per funzionare necessita anche delle librerie <span style="font-style: italic;">libstdc++</span> aggiornate, quindi sarebbe meglio installare il pacchetto per il gcc 4 della vostra distribuzione, cos&igrave; da risolvere automaticamente tutte le dipendenze. Per esempio con Debian e derivate (ubuntu, knotix..) 
~~~language-php
$ sudo apt-get install gcc4
~~~

Nel caso non sia il compilatore di default da ancora un Warning, ma dovrebbe trovare automaticamente le libstdc++ nuove e quindi funzionare lo stesso, altrimenti impostarlo come compilatore di default 
~~~language-php
$ sudo rm /usr/bin/gcc 
$ sudo ln -s /usr/bin/gcc-4.0 /usr/bin/gcc
~~~

E anche in questo caso verificate che l'errore visualizzato sia scomparso.
<h3 class="with-tabs">ParaView 2.4.2</h3>
Scaricare dal <a href="http://www.openfoam.org/download.html">sito</a> il pacchetto <a href="http://mesh.dl.sourceforge.net/sourceforge/foam/paraview-2.4.2.linux.tgz">_paraview-2.4.2.linux.tgz_</a>. Decomprimerlo
~~~language-php
$ tar xzf paraview-2.4.2.linux.tgz
~~~

Copiate la cartella 
~~~language-php
$ cp -r paraview-2.4.2 ~/OpenFOAM/linux/paraview-2.4.2
~~~

<h2>Operazioni finali</h2>Creare la cartella per l'utente utilizzato
~~~language-php
$ mkdir ~/utente-foam-1.2/
$ mkdir ~/utente-foam-1.2/run
~~~

dove bisogna inserire il nome utente al posto di <span style="font-style: italic;">utente</span> e copiare i file di prova al suo interno:
~~~language-php
$ cp -r ~/OpenFoam/OpenFOAM-1.2/tutorials
~/utente-foam-1.2/run/
~~~

<h2>Qualche prova</h2>Per visualizzare l'interfaccia grafica di OpenFOAM lanciare il comando: 
~~~language-php
$ FoamX
~~~

mentre visualizzare l'iinterfaccia grafica di ParaView localizzarsi nella cartella della simulazione da analizzare e lanciare il comando
~~~language-php
$ paraFoam . <span style="font-style: italic;">nome_simulazione</span>
~~~

In un prossimo articolo vedremo di realizzare un semplice esempio (ma non tanto semplice da essere banale) su come utilizzare alcune delle potenzialit&agrave; messe a disposizione da OpenFOAM.