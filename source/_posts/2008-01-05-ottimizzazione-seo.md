---
title: Ottimizzazione SEO
categories: [Drupal]
tags: [clean urls, google, meta tags, ottimizzazione, seo]
---
Come tutti sapete attualmente l'importanza di un sito è data dalla posizione che questo assumo all'interno di un motore di ricerca, quindi quanto più in alto si compare cercando una determinata parola tanto più il sito è importante. Per questo motivo sono nati i cosiddetti esperti SEO (ovvero _Search engine optimization_, esperti di ottimizzazione dei motori di ricerca), che dovrebbero migliorare la posizione del sito all'interno della classifica dei principali motori di ricerca. Senza affidarci a uno di questi esperti vediamo cosa possiamo fare nel nostro piccolo, questa pagina sarà in continua evoluzione, quindi ogni tanto passate a visitarla, magari c'è qualche novità rilevante.<!--break-->
<h3>Clean urls</h3>
**Modulo:** <a href="http://drupal.org/">Core</a>
**Importanza:** +10
I motori di ricerca scansionano un sito seguendo tutti i link che trovano all'interno della pagina e più collegamenti trovano tra le pagine e verso le pagine più il punteggio associato alla pagina aumenta portandola a posizioni superiori del motore di ricerca, quindi è sempre buona cosa avere pagine che linkano il sito e le varie pagine. Gli spider dei motori di ricerca hanno (o meglio li avevano) problemi a seguire URLs contenti caratteri che non facevano parte della tabella ASCI, quindi erano da evitarsi quanto più possibile, inoltre una pagina con link contente caratteri non alfanumerici (come tutte quelle che contengono parametri passati tramite _GET_) oltre ad avere problemi di indicizzazione ricevono punteggi inferiori.

Per ovviare a questo problema su Drupal esiste una funzione che fa parte del pacchetto base di Drupal che permette di avere i cosiddetti _clear urls_. Per abilitarla il vostro server deve supportare l'_.htaccess_ (quindi non server IIS, ma non so chi sia il pazzo che lo usi :P) e avere il modulo _mod_rewrite_ attivo. Fatto questo andate alla pagina _http://vostrosito.org/?q=admin/settings/clean-urls_ e cliccate sul link che trovate riportante _esegui il test per i clean urls_, in caso di successo potrete abilitare i _clean url_ per il vostro sito.

<h3>Meta tag</h3>
**Modulo:** <a href="http://drupal.org/project/nodewords">Node words</a>
**Importanza:** +8

Iniziamo dicendo che alle origini le pagine venivano indicizzate dai primi crowler (spider dei motori di ricerca), analizzando le parole contenute nei tag meta presenti nell'header della pagina. A causa di persone che si divertivano a infarcire i meta di migliaia di parole (e frasi) che servivano solo ad attirare i visitatori tramite i motori di ricerca questa tecnica venne abbandonata a favore di una ricerca dell'interno contenuto della pagina e di conseguenza i _meta tags_ vennero abbandonati.

In questo ultimo periodo i motori di ricerca hanno preso a riutilizzare entrambe le tecniche di scansione (con pesi differenti e non ben noti), quindi inserire i meta tag di una pagina è sicuramente una mossa vincete. Per far questo esiste un modulo per  Drupal che si chiama <a href="http://drupal.org/project/nodewords">Node words</a> che ha proprio lo scopo di permettere all'utente di personalizzare il contenuto dei _meta tags_ della pagina.

Se vi capita di analizzare il vostro sito con uno dei tanti sistemi di anlisi della validità vi accrogerete presto che su alcuni vi viene segnalato un errore a causa della mancanza del tag meta per _author_, questo perchè nel modulo in questione non è stato siluppato il sistema di gestioen degli utenti. Per ovviare a questo problema scaricate il file <a href="/files/48/author.inc">author.inc</a> allegato a questo articolo e inserito nella cartella _/sites/all/modules/nodewords/metatags/_ e attivatelo come tutti gli altri. Questo plug-in per il modulo va a inserire anche il campo author andandolo a completare con il nome utente di colui che ha realizzato il nodo.

<h3>Nome dei link</h3>
**Modulo:** <a href="http://drupal.org/project/pathauto">Path auto</a>
**Importanza:** +6

Tutti i link interni di Drupal sono generati come link a dei numeri, e questo non piace molto ai motori di ricerca che devono indicizzare le pagine. Per evitare questo è possibile scriversi i percorsi a mano o usare il modulo in questione per fare in modo che i link vengano automaticamente generati in base ai nomi e ai termini che vengono utilizzati. indubbiamente molto più comodo che generarsi i percorsi a mano, con il rischio di dimenticarsene qualche d'uno.

Fate attenzione che la lnghezza massima dei link influisce sul posizionamento; se troppo corti non va bene perchè non sono abbastanza identificativi del contenuto, se tropo lunghi il motore di indicizzazione sembra penalizzi il tutto, in pratica dovete essere _bravi_ a creare path abbastanza corti ma chiari.

<h3>Conclusioni</h3>
Questi sono ovviamente accorgimenti abbastanza banali per chi inizia  e si avvicina per la prima volta a queste tematiche SEO, quindi non vuole essere nulla di particolarmente innovativo o un colpo di genio, ma delle buone regole da usare su siti Drupal. Attendete qualche settimana prima di vedere i veri risultati del lavoro, quindi non allarmatevi se le modifiche non hanno effetto immediato. Se proprio non potete fare a meno di un vostro esperto SEO vi consiglio di seguire le <a href="http://www.google.com/support/webmasters/bin/answer.py?hl=it&answer=35291">linee guida di Google</a>.