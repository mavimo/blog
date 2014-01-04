---
title: Amarok e dispositivi MTP
categories: [Linux]
tags: [Amarok, MTP, Zen Vision:M]
---
L'installazione di AmaroK non pu&ograve; essere effettuata semplicemente dai repository, poich&eacute; quelli di Ubuntu non sono compilati per avere il supporto ai dispositivi MTP, mentre quelli di Kubuntu non rilevano il dispositvo a causa della non integrazione con UDEV/HAL. 
Ci&ograve; ci porta a dover procedere con la compilazione di AmaroK, operazione comunque sufficientemente automatizzata.<!--break-->
Iniziamo inserendo tra i repository di APT quelli per il sorgente di AmaroK dai repository di Kubuntu (ha la versione 1.4.4 anzich&egrave; la 1.4.3 di Ubuntu), aggiungendo a  _/etc/apt/source.list_ la seguente riga:
~~~language-php
deb-src http://kubuntu.org/packages/amarok-144 edgy main
~~~

Salviamo e aggiungiamo le chiavi di autenticazione del repository:
~~~language-php
wg&#101;t http://people.ubuntu.com/~jriddell/kubuntu-packages-jriddell-key.gpg
sudo apt-key add kubuntu-packages-jriddell-key.gpg

~~~

e proseguiamo con i classici:
~~~language-php
sudo apt-get update
sudo apt-get upgrade
~~~

Proseguiamo creando una cartella nella nostra home:
~~~language-php
mkdir ~/amarok-mtp
~~~

e entriamoci:
~~~language-php
cd ~/amarok-mtp
~~~

proseguiamo scaricando i file per libmtp direttamente dal sito (quelli rei repository sono versioni troppo vecchie)
~~~language-php
wg&#101;t http://ovh.dl.sourceforge.net/sourceforge/libmtp/libmtp-0.1.1.tar.gz
~~~

Installiamo anche gli header delle libusb che servono per la compilazione:
~~~language-php
sudo apt-get install libusb-dev
~~~

e compiliamo il tutto:
~~~language-php
tar -zxvf libmtp-0.1.1.tar.gz
cd libmtp-0.1.2
./configure –prefix=/usr
sudo make
sudo make install
sudo cp libmtp.rules /etc/udev/rules.d/
~~~

Attenzione, la compilazione va va buon fine solo con le libmtb della versione 0.0.11, con la versioen 0.0.12 non &egrave; possibile compilare AmaroK con successo, quindi fate attenzione ala versione che utilizzate.
A questo punto preoccupiamoci di scaricare i file di AmaroK e tutti gli header file per la sua compilazione tramite:
~~~language-php
cd..
sudo apt-get source amarok
sudo chmod 777 amarok*
cd amarok-1.4*
sudo apt-get build-dep amarok
sudo ./configure --with-njb --with-mtp --prefix='kde-config --prefix'
sudo make
sudo make install
~~~

Attenzione ad utilizzare gli apici inversi per racchiudere il comando _kde-config --prefix_; al termine dovremmo avere il nostro programma installato e funzionante (ma non visibile in Synaptic)
Lanciamolo da shell in modo da poter intercettare eventuali errori:
~~~language-php
amarok
~~~

A questo punto andiamo a inserire lo ZEN tra i dispositivi portatili. Dal men&ugrave; _Settign_ segliamo _Configure AmaroK_ e poi andiamo sulla scheda _Dispositivi_. A questo punto scegliamo _aggiungi dispositivo_ e selezioniamo come plugin _Creative nomad JukeBox Media Device_, impostiamo il nome che vogliamo dare al dispositivo (per esempio _MP3 Creative_) e diamo l'Ok. chiudiamo e riavviamo Amarok e scegliamo dalla scheda dispositivi il nostro nuovo dispositivo e e premiamo connetti.

<h2>Kubuntu</h2>
Con Kubuntu le cose si semplificano notevolmente, infatti &egrave; sufficiente scaricare il certificato per i repository di Kubuntu:
~~~language-php
wg&#101;t http://people.ubuntu.com/~jriddell/kubuntu-packages-jriddell-key.gpg
~~~

dopo di che installiamolo:
~~~language-php
sudo apt-key add kubuntu-packages-jriddell-key.gpg

~~~

editiamo il file _/etc/apt/source.list_ e aggiungiamo:
~~~language-php
deb http://kubuntu.org/packages/amarok-144 edgy main
~~~

e a questo punto diamo i canonici:
~~~language-php
sudo apt-get upgrade 
sudo apt-get dist-upgrade
~~~

E instaliamo la versione di AmaroK per Kubuntu
~~~language-php
sudo apt-get install amarok
~~~

Proseguiamo nella configurazione del dispositivo come visto prima.

NB: Non ancora testato, &egrave; ancora una prima bozza, quindi non fidatevi molto, ma se volete darmi conferma del funzionamento ve ne sarei grato!