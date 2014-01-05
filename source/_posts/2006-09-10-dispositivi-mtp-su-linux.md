---
title: Dispositivi MTP su linux
categories: [linux]
tags: [libmtp, mtp, zen vision:m]
redirect: [linux/dispositivi_mtp, node/9]
meta:
    description: In questo articolo vedremo come collgare un dispositivo multimediale portatile ad un computer con installato una versione del sistema operativo GNU/Linux tramite protocollo MTP.
    tags: [linux, libmtp, mtp, zen vision:m]
---
In questo articolo vedremo come collgare un dispositivo multimediale portatile ad un computer con installato una versione del sistema operativo GNU/Linux tramite protocollo MTP. Il protocollo MTP (Media Transfer Protocol) &egrave; l'evoluzione del PTP (Picture Transfer Protocol), sviluppato da microsoft, e viene utilizzato per inviare, tramite USB (Universal Serial Bus), immagini, file audio e video ai dispositivi multimediali allegando le informazioni necessarie per la loro gestione sottoforma di metadati, tra cui le informazioni sul DRM dei file trasferiti.
Proprio per i vantaggi sulla tecnica di protezione dei contenuti digitali ha fatto si che le principali aziende produttrici di PMP (Portable Media Player), tra cui Creative con la linea Zen, Samsung, Sandisk, Toshiba, Archos e iRiver, lo utilizzassero come protocollo standard per la comunicazione con i computer.
<!--break-->
Attualmente il protocollo MTP &egrave; supportato da <a href="http://www.microsoft.com">Windows XP</a>, tramite Windows Media Player 10, Windows Vista, XBox360 e da Mac OS X per mezzo di XNJB, mentre l'utilizzo con linux &egrave; permesso dalle librerie libmtp.
Le librerie <a href="http://sourceforge.net/projects/libmtp">libmtp</a>,  e attualmente (Settembre 2006) alla versione 0.11 sono ancora in beta, ma forniscono gi&agrave; una stabilit&agrave; sufficiente ada permetterne l'utilizzo. Difficilmente troverete i pacchetti gi&agrave; compilati per la vostra distribuzione, quindi sar&agrave; necessario compilarne i sorgenti; vediamo ora come fare.
Innanzitutto sar&agrave; necessario procurarsi i sorgendi sacricando l'ultima versione disponibile sul sito. Fatto questo dovremmo decomprimere il pacchetto cos&igrave; ottenuto
~~~language-php
$ tar xzf libmtp-0.11.tar
~~~

e proseguire con la compilazione tramite i consueti:
~~~language-php
$ ./configure
$ make
$ sudo make install
~~~

Per la compilazione &egrave; necessario avere installato <a href="http://www.sourceforge.net/projects/libusb/">libusb</a> e rendere disponibile i loro sorgenti (solitamente &egrave; necessario installare il pacchetto libusb-dev).
Se tutto &egrave; andato a buon fine dovreste aver compilato e installato la libreria necessaria, altrimenti vi verr&agrave; restituito l'errore che dovrete correggere per proseguire l'installazione.
Ora si deve lanciare lo script
~~~language-php
$ ./hotplug.sh
~~~

che imposta automaticamente i parametri di accesso, oppure, se la volstra distribuzione utilizza udev &egrave; necessario il file /etc/udev/rules.d/libmtp.rules e inserirvi il seguente testo:
~~~language-php
SUBSYSTEM!="usb_device", ACTION!="add", GOTO="libmtp_rules_end"
# Creative Zen Vision:M
SYSFS{idVendor}=="**041e**", SYSFS{idProduct}=="**413e**", SYMLINK+="libmtp-%k", MODE="666"
LABEL="libmtp_rules_end"
~~~

Modificando il codice _idVendor_ e _idProduct_ visibili, un volta collegato il vostro PMP alla porta USB e digitando:
~~~language-php
$ lsusb
~~~

a questo punto il nostro dispositivo dovrebbe essere riconosciuto automaticamente una volta collegato (ricordatevi di riavviare udev o tutto il sistema).
Lanciando il seguente comando da shell il nostro dispositivo dovrebbe essere riconosciuto, e dovrebbe mostrare a schermo alcune informazioni sulla tipologia del dispositivo portatile e la sua configurazione:
~~~language-php
$ sudo mtp-detect
~~~

La libreria mette a disposizione una serie di programmi, gi&agrave; predisposti per l'utilizzo da parte dell'utente per le pi&ugrave; comuni operazioni, come il trasferimento di file, creazione di cartella, ... e il cui nome inizia con _mtp-_ .
Il trasferimento di file dal computer al dispositivo portatile pu&ograve; essere effettuato tramite il comando:
~~~language-php
$ sudo mtp-sendfile -t mp3 -f "Music" /nome/file.mp3
~~~

dove il parametro _-t_ indica la tipologia di file da trasferire, -f la directory di destinazione (opzionale) e di seguto il file che deve essere trasferito.
Il trasferimento di file video pu&ograve; essere effettuato modificando l'opzione _-t_, per esempio:
~~~language-php
$ sudo mtp-sendfile -t avi -f "Video" /nome/file.avi
~~~

Ulteriori programmi sono in fase di sviluppo e forniscono una interfaccia grafica che utlizzando le libmtp ci permetta di gestire il dispositivo portatile. Tra di esse meritano di essere citate MTPDude, che attualmente non pu&ograve; essere utilizzato, inquanto lavora solo con la versione 0.6 della libreria libmtp, gnomad2 che &egrave; in continua evoluzione e supporta gi&agrave; alcune funzioni di base per l'interfacciamento con dispositivi MTP, inoltre l'ottimo amarok che dalla versione 1.4.3 ha introdotto il supporto ai dispositivi MTP, che per&ograve; non rivela se utilizzato al di fuori di KDE (ip problema pu&ograve; essere risolto ricompilando AmaroK, se vi interessa provate a seguire <a href="/amarok_mtp_ubuntu_gnome">questa guida</a>). Io vi consiglio, in ogni caso, la gestione del trasferimento di file da linea di comando, almeno finch&egrave; questi software non forniscano un maggior supporto al protocollo MTP.
Ora ci soffermeremo su come ottimizzare i file da trasferire verso il nostro dispositivo portatile, in particolare considereremo il dispositivo <a href="/zen_vision_m">Creative Zen Vision:M</a>. La scelta che mi ha portato a considerare questo prodotto, tra tutta la gamma di quelli in commercio &egrave; il supporto nativo che esso fornisce verso formati open-source, quali l'xvid e l'ogg, oltre ai formati proprietari come wma e wmv.
La maggior parte dei file audio disponibili in rete &egrave; diffuso con formato mp3 e in quanto tale non necessita di conversione, mentre i file video sono diffusi con i formati pi&ugrave; disparati, quindi devono essere convertiti verso uno standard che il dispositivo supporti, ovvero xvid. Per la conversione esistono diversi software, ma nessuno &egrave; configurabile e flessibile come mencoder, dato che supporta moltissimi formati (tramite i w32codec) e permette l'utilizzo da sola linea di comando (vedremo dopo il perch&eacute;).
Guide all'installazione di mplayer e mencoder ne esistono a centinaia, quindi sceglietene una e seguitela, altrettanto si pu&ograve; dire per la loro configurazione, oltre all'ottimo manuale visibile consultando:
~~~language-php
man mencoder
~~~

Ora vedremo le impostazioni fondamentali, ma potrete tranqullamente sbizzarrirvi a modificarle una volta acquuisita un minimo di dimestichezza.
Iniziamo a convertire un semplice filmato adattandolo alla risoluzione nativa del display del nostro dispositivo, ovvero 320x280 e codificandolo con il formato xvid.
~~~language-php
mencoder -o fileprodotto.avi -ovc xvid -xvidencopts bitrate=800 -oac mp3lame -vf scale=320:240 -endpos 0:1:0 fileiniziale.avi
~~~

Analizziamo ora le varie opzioni scelte:

 * -o Permette di scegliere il nome del file prodotto.
 * -ovc Indica il codec video da utilizzare (xvid)
 * -oac Indica il codec audio da utilizzare (mp3)
 * -xvidencopts Specifica le opzioni per il file video prodotto (in questo caso il bitrate)
 * -vf Indica la risoluzione del video in uscita (320x240)
 * -endpos Indica quando troncare la conversione del file (nel nostro caso dopo un minuto di video, stiamo solo facendo delle prove e non vogliamo aspettare molto)

Ora possiamo trasferire il nostro file sul dispositivo e vedere come viene visualizzato:
~~~language-php
sudo mtp-sendfile -t avi -f "TV" fileprodotto.avi
~~~

E' possible effettuare pi&ugrave; prove per vedere quale &egrave; il bitrare ottimale per il nostro video, oppure scegliere di effettuare l'encoding impostando, anzich&egrave; il bitrate, l'opzione -xvidencopts pass=2, in modo da lasciare al programma tutte le ottimizzazioni del caso. Poich&eacute; l' Zen Vision:M permette anche la trasmissione del videoverso una televisione potrebbe risultare spiacevole avere un video con risoluzione cos&igrave; bassa, quindi sarebbe opportuno usare la risoluzione di 720x576 pari alle specifiche PAL per le televisioni italiane, in modo da avere il miglior risultato per la visione su TV.
A questo punto avremmo a disposizione, tramite pochi comandi, un meccanismo per effettuare la conversione del video e il suo trasferimento verso il dispositivo portatil esclusivamente tramite shell, che quindi potranno essere eseguiti in uno script, che magari faremmo eseguire dal computer di notte per poterci alzare la mattina e avere il nostro filmato pronto per essere visto la mattina seguente mentre stiamo andando a scuola/lavoro sul pullman/treno.
In un prossimo articolo vedremo come impostare una scheda di acquisizione TV per salvare le nostre trasmissioni preferite sul PC e inviarle al dispositivo portatile.

<h2>Update</h2>
Con la nuova relase delle librerie MTP (0.1.2) i comandi da dare per il trasferimento dei file &egrave; diventato:
~~~language-php
 mtp-connect --sendfile FILE_DA_TRASFERIRE DIRECTORY_DI_ARRIVO
~~~

Per esempio:
~~~language-php
mtp-connect --sendfile freemusic.mp3 freemusic.mp3
mtp-connect --sendfile freevideo.avi freevideo.avi
~~~

Dove la prima volta che indichiamo il file è quello da trasferire, mentre la seconda volta il nome che vogliamo dargli sul lettore.
