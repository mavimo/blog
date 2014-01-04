---
title: URLify... secondo i miei gusti.
categories: [Drupal]
tags: [traduzione, urlify]
---
Chi usa Drupal e ci tiene un pò a avere un buon rapporto con gli spider di rete avrà sicuramente abilitato il modulo _path_ e _clear url_, ma sicuramente si sarà accorto di quanto è noioso ogni volta andare a inserire il nome del path a mano per ogni contenuto (con la possibilità di commettere errori). Per ovviare a questo problema esiste un modulo che se abilitato converte automaticamente il titolo in un  path sostituendo gli spazi con il carattere &quot;-&quot; (ma vedremo dopo come inserire il carattere che più preferiamo) eliminando tutte quelle parole che si ritengono inutili (come _di_, _a_, ...).<!--break-->
come prima cosa dobbiamo scaricare il modulo (lo potete trovare <a href="http://drupal.org/project/urlify">qui</a>) e caricarlo, dopo averlo decompresso nella cartella _/modules_ della vostra installazione di Drupal. Fatto questo andiamo nel pannello di amministrazione e abilitiamo il modulo URLify, richiede anche che il modulo path sia già stato abilitato, altrimenti vi verrà chiesto di abilitarlo. Fatto queste semplici operazioni possiamo utilizzarlo direttamente, oppure possiamo personalizzarlo secondo le nostre esigenze. Personalmente trovo alquanto sgradevole avere le parole dell'URL separate da &quot;-&quot; e prediligo l'_underscore_. Per fare questo apriamo il file _/modules/urlify/urlify.module _ e troviamo la funzione ~~~language-php
function urlify_head()
~~~
Di questa funzione sostituiamo le righe ~~~language-php
  s = s.replace(/[^-A-Z0-9\s]/gi, '');
  s = s.replace(/^\s+|\s+$/g, '');
  s = s.replace(/[-\s]+/g, '-');
  s = s.toLowerCase();
~~~
con~~~language-php
  s = s.replace(/[^_A-Z0-9\s]/gi, '');
  s = s.replace(/^\s+|\s+$/g, '');
  s = s.replace(/[_\s]+/g, '_');
  s = s.toLowerCase();
~~~
Se per caso voleste utilizzare un qualche altro carattere (per esempio ~) andate a sostituirlo dove io ho messo il _ e dovreste essere a posto.
Il modulo non è localizzato in lingua italiana, ma trovate il file della traduzione da importare in allegato a questo articolo (per piacere segnalate eventuali errori, non ho avuto molto tempo per debuggarlo). Sempre per il fatto che il modulo è sviluppato per la lingua inglese di default rimuove alcune parlo "inutili" nei titoli in inglese, ma ciò non risponde alle nostre esigenze di persone che scrivono articoli in italiano, quindi dovremmo andare a effettuare ancora qualche modifica al codice, in particolare dobbiamo editare le funzioni _urlify_settings()_ e _urlify_head()_ trasformando l'array da ~~~language-php
array(
    "a", "an", "as", "at", "before", "but", "by", "for", "from",
    "is", "in", "into", "like", "of", "off", "on", "onto", "per",
    "since", "than", "the", "this", "that", "to", "up", "via",
    "with"
  );
~~~
 in ~~~language-php
array(
    "un", "una", "a", "alle", "dopo", "ma", "da", "di",
    "è", "in", "per", "con", "o", "su", "e", "fino", "gli",
    "la", "questo", "il", "quello", "quella", "fra", "oppure"
  );
~~~
dove ovviamente potete andare a inserire i termini che ritenete più inutili, l'importante è rimuovere i termini inglesi, poiché l'aggiunta di ulteriori termini italiani è effettuabili anche tramite l'interfaccia di amministrazione. Fatto questo salvate le modifiche fatte e usate tranquillamente il modulo. Il modulo già modificato lo trovate anch'esso allegato a questo articolo (sostituite il file _urlify.module_, lasciando il file _urlify.info_).