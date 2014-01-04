---
title: Drupal 5.7 per netsons
categories: [Drupal]
tags: [netsons]
---
Ormai come di consuetudine al rilascio della nuova versione di Drupal segue l'aggiornamento del pacchetto di installazione personalizzato per <a href="http://www.netsons.org">Netsons</a>.
La procedura di installazione richiede una serie di passaggi necessari a consentire il corretto caricamento del CMS. Come prima cosa assicuriamoci sul nostro pannello di controllo di aver attivato sul nostro spazio il database MySQL e PHP; entrambi alla versione 5.<!--break-->
Una volta confermato il loro funzionamento procediamo a scaricare i due file che trovate allegati a questo articolo. Copiare i due file nella cartella di installazione in cui volete attivare il CMS, tipicamente nella _root_ del sito.

Fatto questo rinominiamo il file _start_install.php.txt_ in _start_install.php_, dopo di che andiamo a visitare questa pagina con il nostro browser, in modo da avviare la decompressione dei file e farci mandare ala pagina di setup. A questo punto dobbiamo andare ad inserire l'_username_ e la _password_ di accesso a netsons, in modo che il nostro CMS possa andare a collegarsi al server e terminare la procedura di installazione.

Effettuati questi passaggi riceveremo una e-mail al nostro indirizzo riportante le informazioni di accesso come admin (che poi saranno le stesse dell'account di netsons), ovviamente vi consiglio di cambiarla immediatamente.

<h2>Note</h2>
L'autore non si assume la responsabilità per l'errato funzionamento delle modifiche o per la perdita di dati ad esse correlate. Siete inoltre pregati di non rimuovere il testo contenuto nel footer presente ad installazione avvenuta. Sono presenti i crediti dell'hoster, del cms Drupal e la community italiana e miei che ho modificato il tutto per farlo funzionare su Netsons.