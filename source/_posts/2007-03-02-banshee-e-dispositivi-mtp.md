---
title: Banshee e dispositivi MTP
categories: [Linux]
tags: [banshee, MTP, Zen Vision:M]
---
Precedentemente abbiamo visto come utilizzare dispositivi MTP su linux <a href="/linux_dispositivi_mtp">senza interfaccia grafica usando le libmtp</a>, oppure usando uno dei migliori <a href="/amarok_mtp_ubuntu_gnome">riproduttori audio in circolazione per KDE</a>, ovvero <a href="http://amarok.kde.org/">AmaroK</a>. Quest'ultimo, seppur disponga di un ottima interfaccia grafica, è sviluppato per KDE, quindi per chi (come me) utilizza princpalmente gnome, diventa necessario portarsi dietro tutte le librerie di KDE, che sicuramente appesantiscono il sistema (per lo meno come spazio occupato :D ). Affrontiamo ora l'installazione di un software sviluppato per gnome che permetta di gestire i dispositivi MTP.
<!--break-->
Il programma in questione non è <a href="http://gnomad2.sourceforge.net/">gnomad2</a> (che non mi piace) ma <a href="http://www.banshee-project.org/">banshee</a>, un ottimo  player che pur essendo ancora abbastanza agli esordi ha degli obbiettivi finali di tutto rispetto. I dispositivi MTP vengono gestiti dalla versione 0.11.6, che non è disponibile nei repository di ubuntu, quindi ci inoltreremo nella compilazione dei sorgenti prelevati direttamente dal server SVN (attualmente alla versione 0.11.7).
Iniziamo preparando l'ambiente per la compilazione del programma:
~~~language-php
sudo apt-get build-dep banshee
~~~

Facciamo installare tutti i pacchetti necessari e installiamo anche _subversion_ che ci servirà a prelevare l'ultima versione disponibibile:
~~~language-php
sudo apt-get install subversion
~~~

Fatto questo è necessario installare le ultime versioni delle librerie gphoto per il nostro sistema, inquanto solo dalla versione 2.3.1 è attivo il supporto per i dispositivi MTP. Poichè sui repository di ubuntu questa versione non è disponibili dovremmo compilarci le librerie manualmente. L'operazione è abbastanza banale, si inizia con lo scaricare i sorgenti dal sito:
~~~language-php
wget http://puzzle.dl.sourceforge.net/sourceforge/gphoto/libgphoto2-2.3.1.tar.gz
~~~

e con la loro decompressione:
~~~language-php
tar xfvz libgphoto2-2.3.1.tar.gz
~~~

per proseguire la compilazione e installazione secondo la procedura standard:
~~~language-php
cd libgphoto2-2.3.1
./configure --prefix=/usr
make
sudo make install
cd ..
~~~

Ora dobbiamo ripetere la stessa procedura per installare le librerie gphoto-sharp che non sno altro che i wrapper per mono delle librerie C++ appena installate. Anche qui il procedimento è simile, si inzia con il download del file:
~~~language-php
wget http://heanet.dl.sourceforge.net/sourceforge/gphoto/libgphoto2-sharp-2.3.0.tar.bz2
~~~

la decompressione:
~~~language-php
tar xfvz libgphoto2-sharp-2.3.0.tar.bz2
~~~

e la compilazione e installazione
~~~language-php
cd libgphoto2-sharp-2.3.0
./configure --prefix=/usr
make
sudo make install
cd ..
~~~

Passiamo ora alla compilazione del programma gphoto2 che si occupa di interagire con il dispositivo MTP. Indovinate un pò che operazioni vanno compiute? Esatto! Download:
~~~language-php
wget http://puzzle.dl.sourceforge.net/sourceforge/gphoto/gphoto2-2.3.1.tar.gz
~~~

Decompressione:
~~~language-php
tar xfvz gphoto2-2.3.1.tar.gz
~~~

Compilazione e installazione:
~~~language-php
cd gphoto2-2.3.1
./configure --prefix=/usr
make
sudo make install
cd ..
~~~

Passaimo ora a controllare se il nostro dispositivo viene correttamente rilevato e gestito. Iniziamo a collegarlo alla porta USP del nostro computer e da console diamo:
~~~language-php
gphoto2 -L
~~~

In questo modo dovrebbe rilevare il nostro dispositivo e listare tutte le cartelle presenti al suo interno.
Procediamo ora a far si che il nostro dispositivo venga gestito da <a href="http://freedesktop.org/wiki/Software_2fhal">HAL</a>, quindi posizioniamoci nella cartella delle librerie libgphoto e in partiolare nelle sottocartelle _packaging/generic/print-camera-list_ e generiamo il file da passare ad HAL:
~~~language-php
cd libgphoto2-2.3.1/packaging/generic/print-camera-list
./print-camera-list hal-fdi > 10-libgphoto2.fdi
~~~

A questo punto copiamo il codice nella cartella di gestione dei dispositivi di HAL:
~~~language-php
sudo mv 10-libgphoto2.fdi /usr/share/hal/fdi/information/10freedesktop/
cd ../../../..
~~~

A questo punto dibbiamo riavviare HAL, quindi iniziamo procurandoci il suo UID:
~~~language-php
sudo cat /etc/passwd | grep haldaemon | awk 'BEGIN { FS=":" } {print $3 }'
~~~

e successivamente uccidiamo tutto i processi di HAL con questo UID:
~~~language-php
ps -ef | grep hal | grep ^**XXX** | awk '{print $2}' | xargs sudo kill -9
~~~

dove avremo sostituito _XXX_ con il numero trovato precedentemente (nel mio caso 106).
Ora possiamo riavviare HAL che in questo modo riconoscerà anche i dispositivi che abbiamo aggiunto:
~~~language-php
sudo /usr/sbin/hald
~~~

A questo punto possiamo iniziare a scaricare banshee e a compilarlo per poi passare all'installazione! il download avviene direttamente dal server SVN, quindi diamo il comando:
~~~language-php
svn co http://svn.gnome.org/svn/banshee/trunk/banshee
~~~

Entriamo nella directory e procediamo con la configurazione e compilazione:
~~~language-php
cd banshee
./autogen.sh --prefix=/usr --enable-mtp
make
sudo make install
~~~

a questo punto dovrebbe aver installato banshee che supporta anche i dispositivi MTP! Procediamo lanciando il programma con le opzioni di debug per accertarci che tutto vada per il meglio:
~~~language-php
banshee --debug
~~~

Quado questo è avviato provate a collegare il ostro dispositivo MTP, dovrebbe riconoscerlo e farlo comparire come dispositivo MP3, bene ora potete gestirlo tramite banshee... e buon ascolto!

<h3>Note:</h3>
Purtroppo _banshee_ è ancora un pò instabile, a me da problemi con la gestione delle copertine degli album, se cerco di fagli trovare le copertine di tutta la collezione crasha quando arriva a circa 100, mentre altre persone mi hanno detto che quando cercano di sincronizzare il dispositivo con la collezione locale si blocca dopo aver copiato circa una cinquantina di brani.