---
title: Sito di sviluppo
categories: [Drupal]
tags: [drupal, installazione, moduli, rofiles, sito, sviluppo, test]
---
Spesso capita di dover sviluppare moduli o andare a personalizzare alcuni di questi e di necessitare di un sito di sviluppo per fare in modo che questo possa essere testato a dovere, o ancora che serva un sito con una serie di contenuti per vedere come si comporta Drupal in determinate occasioni.

Le strade percorribili sono molteplici, si va dalla creazione di un sito di sviluppo e poi una copia del database con tutte le impostazioni, a tecniche più avanzate che permettono customizzazioni più spinte.
<!--break-->
Questa prima soluzione (creazione del sito di sviluppo e successivo backup, con ripristino ogni qualvolta è necessario) ha degli indubbi vantaggi e epermette una personalizzazione del proprio sito di sviluppo molto spinta, ma al cntempo ha anche alcuni limiti. Innanzitutto tutti i siti di sviluppo saranno uguali, non vi saranno differenze e non sempre questa è la soluzione ideale, per esempio in alcuni casi potrebbero servire solo pochi utenti, mentre in altri ne potrebbero servire migliaia, stesso discorso per i vocabolari, i termini, i contenuti, i commenti.

Altra strada, che ho preferito percorrere, è quella di andare a creare un proprio profilo di installazione che automatizzi il più possibile questa procedura, e permetta una personalizzazione del sito di sviluppo molto più spinta con pochissime operazioni.

Iniziamo scaricando il pacchetto che trovate allegato a questo articolo e decomprimiamolo nella cartella _/profiles_ del nostro amato CMS, a questo andiamo a personalizzare il risultato che vogliamo ottenere andando a modificare a mano il file _/profiles/test/test.profile_, in particolare troviamo la funzione _test_profile_final_ e visualizziamo le righe contrassegnate subito sotto settings. Vi possiamo trovare il seguente codice i cui commenti credo siano sufficientemente esplicativi per il loro utilizzo:~~~language-php
  $num_user   = 10   // Numero di utenti
  $num_vocab  = 5;   // Numero di vocabolari
  $num_term   = 5;   // Numero di termini (lev 1)
  $num_term_2 = 3;   // Numero di termini (lev 2)
  $num_nodes  = 100; // Numero di nodi
  $num_comm   = 400; // numero di commenti
~~~

<dl>
<dt>$num_user  </dt><dd>Numero degli utenti (non amministratori) che verranno creati. Ogni utente avrà nome utente e password pari a _utenteN_. Verrà, inoltre, creato l’utente amministratore con nome e password pari a _test_</dd>
<dt>$num_vocab </dt><dd>Numero dei vocabolari presenti nel nuovo sito di test </dd>
<dt>$num_term </dt><dd> Numero dei termini di primo livello presenti all’interno di ogni vocabolario</dd>
<dt>$num_term_2 </dt><dd> Numero dei termini figli di ogni termine di ogni vocabolario</dd>
<dt>$num_nodes </dt><dd> Numero di contenuti di tipo misto tra story e page presente nel sito</dd>
<dt>$num_comm </dt><dd> Numero di commenti presenti nel sito</dd>
</dl>
Una volta completata questa semplice configurazione possiamo procedere alla consueta installazione del sito, al termine saranno già presenti utenti, vocabolari (popolati), contenuti con associati i diversi termini e relativi commenti. Per eventuali personalizzazioni o aggiunte si può andare ad agire direttamente sul codice del profilo di installazione.

Prossimamente configurazioni più avanzate saranno aggiunte, per suggerimenti delle funzionalità più richieste aggiungete le vostre richieste tra i commenti!
