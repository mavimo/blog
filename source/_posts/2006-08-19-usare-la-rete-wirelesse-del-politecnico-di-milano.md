---
title: Usare la rete wirelesse del Politecnico di Milano
categories: [Linux]
tags: [Politecnico di Milano, wireless, wpa_supplicant]
---
Per tutti coloro che utilzzano un PC con Windows XP sono presenti sul sito dell'<a href="http://www.asi.polimi.it/rete/wifi/istruzioni.html">ASI</a> le informazioni necessarie al collegamento alle rete wi-fi, io mi soffermer&ograve; su coloro che hanno un sistema operativo linux e mi baser&ograve; sulla distribuzione Ubuntu 6.06, in ogni caso con piccole modifiche lo stesso procedimento potr&agrave; essere utilzzato anche su altre distribuzioni (Debian, Fedora, Mandriva, Slakware, Gento...). 
<!--break-->
La prima cosa da fare sar&agrave; installare i pacchetti per la propria scheda wireless (la mia &egrave; la IPW2200, ovvero la scheda standard per i PC Intel Centrino): 

~~~language-php
$ sudo apt-get install ipw2200
~~~


La stessa cosa dovr&agrave; essere fatta per il pacchetto di wpa_supplicat che &egrave; necessario per l'autenticazione alla rete:

~~~language-php
$ sudo apt-get install wpa_supplicant
~~~
  

Ovviamente potremmo anche voler compilare a manina tutti i pacchcetti, ma il mio consiglio &eacute; di non farlo, fidatevi di chi lo fa per voi :)

A questo punto dovremmo collegarci alla rete wireless del politecnico non protetta _polimi_ da cui potremmo scaricarci il nostro nuovissimo e fiammante <a href="https://www.asi.polimi.it/rete/wifi/richiesta_certificato.html">certificato</a>, ottenuto il quale potremmo iniziare a effettuare la configurazione per l'autenticazione.  
Innanzitutto dovremmo modificare il file _/etc/wpa_supplicant/wpa_supplicant.conf_ che in base alle distribuzioni usate potr&agrave; trovarsi in posizioni differenti. Come editor io uso _gedit_, ma potete sare il vostro preferito, che sia _emacs_, _vim_, _nano_ o altro!
Il file dovr&agrave; contenere:

~~~language-php
ctrl_interface=/var/run/wpa_supplicant 
ctrl_interface_group=0 network={
  ssid=&quot;internet&quot;
  scan_ssid=1
  proto=WPA
  key_mgmt=WPA-EAP
  pairwise=TKIP
  group=TKIP
  eap=TLS
  identity=&quot;S**MATRICOLA**&quot;   
  password=&quot;**PASSWORD POLISELF**&quot;    
  ca_cert=&quot;/etc/wpa_supplicant/certificati/asi.pem&quot; 
  private_key=&quot;/etc/wpa_supplicant/certificati/CertificatoASI.pk12&quot;    
  private_key_passwd=&quot;**PASSWORD  
  CERTIFICATO**&quot;       
}
~~~


NB: Dovete mantenere la **S** davanti al numero della matricola!

fatto questo vedete che il certificato non &egrave; ancora a posto, infatti dovremmo lanciare openssl per convertire il nostro certificato:

~~~language-php
sudo mkdir /etc/wpa_supplicant/certificati
~~~

~~~language-php
sudo openssl pkcs12 -in Cerificato.p12 -out /etc/wpa_supplicant/certificati/asi.pem
~~~


Inserendo la password rilasciata al momento della richiesta del certificato. Dovremmo anche copiare il certificato originale nella cartella appena creata, quindi: 

~~~language-php
sudo cp CertificatoASI.p12 /etc/wpa_supplicant/certificati
~~~


Ora potremo lanciare la nostra connessione con il comando:

~~~language-php
sudo wpa_supplicant -B -i eth0 -c /etc/wpa_supplicant/wpa_supplicant.conf -D wext
~~~


Per e opzioni utilizzate _man wpa_supplicant_, come potete notare anche se con i _centrino_ avremmo dovuto utilizzare _ipw _ho utilzzato _wext_, ovvero i driver generici, inquanto con quelli specifici non si collegava a causa di un errore interno. Come potete notare, inoltre, ho dovuto l'anciare l'opzione da utente root.
Attendete qualche attimo (a volte impiega anche 40 secondi o pi&ugrave; ad autenticarsi) e a questo punto potete far assegnare l'indirizzo IP della scheda, lanciando:

~~~language-php
sudo dhclient eth1
~~~


Ricordatevi di impstare il proxy di ateneo come descritto sul sito dell'asi alla pagina <a href="http://www.asi.polimi.it/rete/proxy/configurazione.html">configurazione proxy</a>.

Per il collegamento ho realizzato un script che potete trovare <a href="/files/4/collegarsi_poli.zip">qui</a> (decomprimete il file).
L'utilizzo &egrave; decisamente banale, basta dare il comando:
~~~language-php
./collegarsi_poli.sh start
~~~

per avviare la connessione e 
~~~language-php
./collegarsi_poli.sh stop
~~~

per arrestarla.
Poich&eacute; &egrave; necessario modificare dei paramentri per la connessione verr&agrave; richiesta la password dell'utente (per elevare i privilegi di alcuni comandi tramite _sudo_).
Attenzione, potrebbe essere necessario modificare l'interfaccia di rete da utilizzare, nel qual caso aprite lo script con un programma di testo e modificate la parte che vi interessa (credo si abbastanza ben commentata, altrimenti chiedete pure)