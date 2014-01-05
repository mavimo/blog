---
title: Collegarsi alla rete wireless del Politecnico di Milano
categories: [linux]
tags: [politecnico di milano, wireless]
redirect: [linux/wireless_polimi_networkmanager, node/31]
meta:
    description: Vorrei iniziare questa miniguida ringraziando Slackwarelife  (non cito il nome e cognome per regole sulla privacy :D ) che ha contribuito dandomi alcune indicazioni per la configurazione di <em>network-manager</em>, un interfaccia grafica per la gestione delle reti wireless, per la connessione alla rete internet dal <a href="http://www.polimi.it">Politecnico di Milano</a>.
    tags: [linux, politecnico di milano, wireless]
---
Vorrei iniziare questa miniguida ringraziando Slackwarelife  (non cito il nome e cognome per regole sulla privacy :D ) che ha contribuito dandomi alcune indicazioni per la configurazione di _network-manager_, un interfaccia grafica per la gestione delle reti wireless, per la connessione alla rete internet dal <a href="http://www.polimi.it">Politecnico di Milano</a>.
<!--break-->
Iniziamo installando l'applet, quindi da console diamo:
~~~language-php

sudo apt-get install network-manager
~~~

Inserire la password e confermare i pacchetti da cui questo dipende, dopo poco ci troveremmo l'applet installata. Procediamo lanciandola, quindi da console diamo
~~~language-php

sudo NetworkManager
~~~

e sulla barra delle applet comparirà un icona formata da due monitor parzialmente sovrapposti. Poich&eacute; la rete _internet_ non viene rilevata automaticamente, essendo una rete nascosta, bisognerà andare ad impostare manualmente i parametri per la configurazione, quindi iniziamo collegandoci alla rete _polimi_, che invece viene correttamente rilevata e rechiamoci sul sito dell'<a href="http://www.asi.polimi.it">ASI</a> e scarichiamo il certificato necessario per l'autenticazione. Creiamo il certificato PEM come indicato nella <a href="/wireless_polimi_linux">guida per l'installazione tramite _wpa_supplicant_</a> e salviamo tutti i certificati in una cartella (_~/.certificati_ per esempio).
Clicchiamo con il tasto sinistro sull'icona indicata precedentemente e selezioniamo _Connect to Other Wireless Network_. Ci comparirà una finestra da cui andare ad impostare i paramentri per la connessione alla nuova rete.
Inseriamo come nome della rete _internet_ e come tipologia di connessione _WPA Enterprise_
<img src="/files/31/network_manager.png" alt="Impostazioni per la configurazione di una nuova rete su networkManager"/>
A questo punto dovrebbe comparire una serie di campi da completare per potersi autenticare. Il nome dela rete dovrà essere impostato su _internet_, la tipologia di rete _WPA Enterprise_, il metodo EAP da utilizzare &egrave; _TLS_ mentre il tipo di chiave deve essere impostato su _TKIP_.
Come nome utente andremo ad inserire il nostro numero di _matricola_ preceduto da un _S_, quindi qualcosa di simile a _S123456_; la password da utilizzare per l'autenticazione sarà, a sua volta, quella utilizzata dal _poliself_. Ora andiamo ad impostare i certificati da utilizzare, in particolare come certificato del client andremo ad utilizzare quello _generato con la procedura descritta precedentemente_, mentre come file dela chiave privata utilizzeremo il _certificato fornito dall'ASI_; subito sotto andrà inserita la password necessaria al download del certificato. Nell'immagine di seguito potete vedere le impostazioni necessarie.
<img src="/files/31/network_manager_config.png" alt="Impostazioni per l'autenticazione di NetworkManager"/>
A questo punto, prima di poter navigare comodamente in internet &egrave; necesario configurare il nostro browser per utilizzare il proxy d'ateneo, quindi apriamo il nostro browser (per esempio <a href="http://www.mozilla.org/firefox">Firefox 2.0</a>) e, dopo esserci recati nela scheda delle opzioni di configurazione del proxy (su Firefox la trovate seguendo: Edit &raquo; Preferences &raquo; Advanced &raquo; Network &raquo; Setting o nell'equivalente in italiano) e andiamo ad impostare la scheda che compare come indicato sul sito dell'<a href="http://www.asi.polimi.it">ASI</a>, o come visibile nell'immagine qui sotto.
<img src="/files/31/firefox_proxy_config.png" alt="Impostazione per la configurazione del Proxy all'interno di Firefox 2.0"/>
Adesso vediamo i problemi che ci sono usando questo programma, innanzitutto non &egrave; compatibile (o meglio, spesso va in conflitto) con l'applet _Network Monitor_ di gnome, vi consiglio quindi di rimuoverla dal pannello prima di procedere con le operazioni indicate (se l'avete attiva). Non memorizza la impostazioni, quindi ogni volta andrebbe rieseguita l'intera configurazione, il che non &egrave; decisamente comodo. Non c'&egrave; modo (per ora) di salvare il tutto, quindi, se accedete spesso alla rete, vi conviene configurare wpa_supplicant come spiegato nella guida vista precedentemente e usare lo script indicato per la connessione e disconnesione dalla rete.
Ultimo problema che ho notato &egrave; la diversa gestione della rete rispetto all'utilizzo di _wpa_supplicant_, per cui usando l'applet risulta pi&ugrave; instabile e (relativamente) lenta. Queste sono osservazioni fatte da me (aule Trifoglio orario di pranzo), mentre altri utenti non hanno di questi problemi.
Bh&egrave;, che altro dire... buona navigazione!
