---
title: Drupal 5.3 per Netsons
categories: [drupal]
tags: [netsons]
redirect: [drupal/installazione_versione_53_netsons, node/42]
meta:
    description: La nuova relase di Drupal (la versione 5.3) porta alla correzione di una serie di exploit che possono compromettere l'integrità del vostro database, quindi l'upgrade è altamente consigliato. Come per le versioni precedenti anche la versione 5.3 necessita di alcuni permessi sulle tabelle (<em>TEMPORARY TABLE</em> e <em>LOCK TABLE</em>) che non si hanno a disposizione su Netsons, quindi ho rilasciato questa versione customizzata per poter funzionare correttamente anche su questo hosting. Non mi soffermerò sulle modifiche effettuate, se siete interessati chiedete che vi risponderò :) 
    tags: [drupal, netsons]
---
La nuova relase di Drupal (la versione 5.3) porta alla correzione di una serie di exploit che possono compromettere l'integrità del vostro database, quindi l'upgrade è altamente consigliato. Come per le versioni precedenti anche la versione 5.3 necessita di alcuni permessi sulle tabelle (_TEMPORARY TABLE_ e _LOCK TABLE_) che non si hanno a disposizione su Netsons, quindi ho rilasciato questa versione customizzata per poter funzionare correttamente anche su questo hosting. Non mi soffermerò sulle modifiche effettuate, se siete interessati chiedete che vi risponderò :) <!--break-->
La procedura di installazione richiede una serie di passaggi necessari a consentire il corretto caricamento del CMS. Come prima cosa assicuriamoci sul nostro pannello di controllo di aver attivato sul nostro spazio il database MySQL e PHP; entrambi alla versione 5. Una volta confermato il loro funzionamento procediamo a scaricare i due file che trovate allegati a questo articolo. Copiare i due file nella cartella di installazione in cui volete attivare il CMS, tipicamente nella _root_ del sito.
Fatto questo rinominiamo il file _start_install.php.txt_ in _start_install.php_, dopo di che andiamo a visitare questa pagina con il nostro browser, in modo da avviare la decompressione dei file e farci mandare ala pagina di setup. A questo punto dobbiamo andare ad inserire l'_username_ e la _password_ di accesso a netsons, in modo che il nostro CMS possa andare a collegarsi al database e completare l'installazione.
Riceverete per mail la comunicazione della registrazione del primo account, che sarà poi l'account di amministrazione, che avrà lo stesso nome utente e password di quello utilizzato da netsons.
In questo profilo di installazione sono stati anche inseriti due moduli opzionali; il primo (smtp) permette di inviare mail autenticate attraverso il server di netsons, mentre il secondo (spam) permette di limitare i commenti inseriti dagli utenti che possono risultare essere spam. Per quest'ultimo sono anche state inserite alcune delle regole principali generate dall'apprendimento di questo modulo da quando è attivo su questo sito.
Ovviamente questa versione è AS IS, non mi assumo responsabilità sul suo utilizzo. V chiedo solamente se potete lasciare i link presenti nel footer della pagina.

Happy Drupal a tutti :)