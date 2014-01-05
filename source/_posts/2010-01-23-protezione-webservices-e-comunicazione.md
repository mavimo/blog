---
title: Protezione WebServices e comunicazione
categories: [varie]
tags: [.htaccess, .htpasswd, apache, php, security, webservices]
redirect: [varie/protezione_webservices_htpasswd, node/103]
meta:
    description: Avevamo visto in un articolo precedente come <a href="/drupal/protezione_siti_sviluppo">proteggere i siti in fase di sviluppo</a> tramite <em>.htaccess</em> e <em>.htpassword</em>, ed effettivamente è un sistema molto comodo; tuttavia cosa succede quando è necessario sviluppare all'interno del sito dei <strong>WebServices</strong> che devono essere accessibili da remoto?
    tags: [varie, .htaccess, .htpasswd, apache, php, security, webservices]
---
Avevamo visto in un articolo precedente come <a href="/drupal/protezione_siti_sviluppo">proteggere i siti in fase di sviluppo</a> tramite _.htaccess_ e _.htpassword_, ed effettivamente è un sistema molto comodo; tuttavia cosa succede quando è necessario sviluppare all'interno del sito dei **WebServices** che devono essere accessibili da remoto?

Vediamo come possiamo risolvere questo problema, sia ricorrendo all'autenticazione nella chimatada codice  _PHP_ che consentendo l'accesso da determinate macchine senza autenticazione.
<!--break-->
<h3>Autenticazione nelle chiamate</h3>
Nel primo caso la procedura da utilizzare è quella di effettuare un'autenticazione usando le credenziali indicate all'interno del'_.htpasswd_; eventualmente create delle credenziali ad-hoc seguendo le indicazioni dell'<a href="/drupal/protezione_siti_sviluppo">articolo precedente</a>.

Una volta che il nostro servizio (rigorosamente _RESTFUL_) è funzionante, possiamo utilizzare il seguente codice PHP che permette l'accesso tramite autenticazione su _.htpassws_:
<?php
// Nome utente
$username = 'test';

// Password
$password = 'test';

// Creo l'header con le credenziali di autenticazione
$cred = sprintf('Authorization: Basic %s', base64_encode($username . ':' . $password));

// Creo gli options per la chiamata
$opts = array(
  'http' => array(
    'method' => 'GET',
    'header' => $cred,
  )
);

// Creo lo stream context
$ctx  = stream_context_create($opts);

// Url del servizio
$url = 'http://mavimo.org/crss';

// Ottengo la risposta della chiamata
$rss = file_get_contents($url, FALSE, $ctx);

// Elaboro il contenuto della chiamata..
// ...
?>
Lo svantaggio di procedere in questo modo è dato dal tempo necessario a far si che la richiesta venga autenticata e poi venga effettuata la richiesta con successiva risposta; fino a che si tratta di una richiesta una tantum non dovrebbe comportare grosse problematiche, ma nel caso di un numero elevato di richieste, magari per la gestione di operazioni di sincronizzazioni tra server, può diventare un problema a causa della latenza del processo.

Altro problema derivato da questo tipo di protezione è dato dal fatto che il traffico potrebbe essere sniffate e dato che i dadi sono presente solamente encodati in base 64 è possibile che qualcuno possa ottenere le credenziali di accesso al nostro sistema.

<h3>Accesso da IP fidati</h3>
La seconda alternativa, consigliabile quando possibile, è di ricorrere all'apertura del canale tra indirizzi IP fidati, per fare questo all'interno della direttiva del nostro .htaccess andiamo ad aggiungere:
~~~language-php
AuthUserFile /var/www/MIOSITO/.htpasswd
AuthGroupFile /dev/null
AuthName "SITO PROTETTO"
AuthType Basic
<Limit GET>
  Allow from 11.22.33.44
  require valid-user
  Satisfy Any
</Limit>

~~~

Dove appunto si chiede l'autenticazione di utenti validi, oppure (e questo è dato dalla clausula _Stasisfy Any_) da richieste provenienti dall'indirizzo IP indicato (che è appunto quello del server fidato da cui possono venire le richeste. Omettendo la regola **Satisfy Any** devono essere soddisfatte enntrambe le condizioni per poter aver accesso al servizio (e al sito stesso).

A questo punto non ci sono proprio più scuse per NON proteggere il nostro sito (o i nostri WebServices, ovviamente).

EDIT: grazie a eliosh per il lavoro di revisione ;)
