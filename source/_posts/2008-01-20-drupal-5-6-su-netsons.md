---
title: Drupal 5.6 su Netsons
categories: [drupal]
tags: [installazione, netsons]
redirect: [drupal/installazione_versione_56_netsons, node/50]
meta:
    description: Anche se drammaticamente in ritardo ecco a voi la versione patchata per l'installer di Drupal 5.6 per Netsons. Purtroppo per ora non funziona il modulo Search che richiede delle patch ulteriori (che per ora non ho applicato), ma in alternativa è possibile utilizzare l'ottimo modulo <a href="http://drupal.org/project/google_cse">Google Co-op CSE</a> che utilizza il servizio <a href="http://www.google.com/coop/">CSE di Google</a> (quello che vedete in funzione su questo sito).
    tags: [drupal, installazione, netsons]
---
Anche se drammaticamente in ritardo ecco a voi la versione patchata per l'installer di Drupal 5.6 per Netsons. Purtroppo per ora non funziona il modulo Search che richiede delle patch ulteriori (che per ora non ho applicato), ma in alternativa è possibile utilizzare l'ottimo modulo <a href="http://drupal.org/project/google_cse">Google Co-op CSE</a> che utilizza il servizio <a href="http://www.google.com/coop/">CSE di Google</a> (quello che vedete in funzione su questo sito).<!--break-->

Ricordo a tutti che questa versione è necessaria solo in caso di account free, per gli account fast non è necessaria nessuna modifica per aggirare le LOCK TABLE essento disponibili i privilegi sul proprio account MySQL. Vediamo ora la procedura di installazione da seguire, anche se molto semplice.

Iniziamo scaricando i due file che trovate allegati a questo articolo e carichiamoli nella cartella del nostro server dove vogliamo installare il CMS. Se non avete altri applicativi in funzione vi consiglio di usare la _root_ del sito. Il file zippato non deve essere decompresso e non deve essere rinominato, mentre il file _start_install.php.txt_ deve essere rinominato in _start_install.php_.

Ora possiamo andare all'indirizzo _http://vostronome.netsons.org/start_install.php_ e inserire i parametri di login su <a href="http://www.netsons.org">Netsons</a>. A questo punto verranno caricate le diverse tabelle sul server e onfigurato con i corretti parametri di ingresso. Finita questa procedura nella vostra email _vostronome@netsons.org_ riceverete una mail con i dati di accesso al vostro sito come amministratore e potrete procedere con le configurazioni aggiuntive.

Nella procedura di installazioni usando questo paccehtto verranno automaticamente installati e configurati due moduli (<a href="http://drupal.org/project/spam">spam</a> e <a href="http://drupal.org/project/smtp">smtp</a>) che permettono di migliorare l'usabilità del nostro sito. Nel caso in cui non siano richiesti o vogliate apportare ulteriori modifiche potete farlo dal pannello di amministrazione.

<h3>Note</h3>
L'utore non si assume la responsabilità per l'errato funzionamento delle modifiche o per la pardita di dati ad esse correlate. Siete inoltre pregati di non rimuovere il testo contenuto nel footer presente ad installazione avvenuta. Sono presenti i credit dell'hoster, del cms Drupal e la community italiana e miei che ho modificato il tutto per farlo funzionare su Netsons.