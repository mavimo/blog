---
title: Proteggere i siti di sviluppo
categories: [drupal]
tags: [drupal, htpasswd, protezione, server]
redirect: [drupal/protezione_siti_sviluppo, node/53]
meta:
    description: A quanti è capitato di avere un sito da dover configurare e si preferisce lavorare direttamente in remoto piuttosto che in locale e poi dover spostare il tutto? Quanti di questi si sono anche posti il problema di non rendere raggiungibili il sito prima che questo sia pronto? Bhé, io questo problema me lo sono posto, vediamo come risolvere.
    tags: [drupal, drupal, htpasswd, protezione, server]
---
A quanti è capitato di avere un sito da dover configurare e si preferisce lavorare direttamente in remoto piuttosto che in locale e poi dover spostare il tutto? Quanti di questi si sono anche posti il problema di non rendere raggiungibili il sito prima che questo sia pronto? Bhé, io questo problema me lo sono posto, vediamo come risolvere.<!--break-->

Innanzitutto diciamo che con Drupal possiamo sfruttare la modalità  off-line, ma questo ci permette di accedere al sito solo come utente loggato a livello amministrativo, il che può risultare particolarmente scomodo sopratutto perché non si vede cosa cosa vedrebbe l'utente anonimo, inoltre permette a chi passa di vedere un sito in lavorazione, il che può essere più o meno un problema.

L'alternativa è di agire a livello più basso, e anziché bloccare l'accesso a livello di codice PHP impedire l'accesso a livello di webserver (ovviamente parliamo di Apache), operazione abbastanza semplice, ma che deve essere compiuta con alcune precauzioni.

Iniziamo a modificare il nostro .htaccess inserendo come prime righe:~~~language-php
AuthUserFile /path/assoluto/.htpasswd
AuthType  Basic
AuthName  "Sito protetto"
Require valid-user
ErrorDocument 401 "Unauthorized"
AuthGroupFile /dev/null
~~~
In questo modo diciamo che possono accedere al sito protetto solo gli utenti validi la cui password si troverà nel file indicato dal path, in caso la password inserita per l'accesso non sia corretta si riceve un errore 401, e viene visualizzata una pagina bianca con la scritta _Unauthorized_.

Ora dobbiamo fare in modo di impostare la password all'interno del file _.htpasswd_ indicato. Per fare questo la cosa migliore sarebbe avere l'accesso ssh sul server e lanciare (per la prima volta) il seguente comando:~~~language-php
htpasswd -c /path/assoluto/.htpasswd nomeutente
~~~
e inserire due volte la password di protezione, mentre per gli utenti successivi è sufficiente ripetere l'operazione senza il parametro _c_, quindi:~~~language-php
htpasswd /path/assoluto/.htpasswd altroutente
~~~
Se per caso non potessimo accedere al server tramite SSH conviene utilizzare uno dei tanti servizi presenti in rete per la creazioni di chiavi, attenzione che spesso non funzionano perché ogni server potrebbe avere una sua chiave particolare per la generazione della chiave, quindi se con i primi non funziona fate un pò di prove, di solito qualche cosa se ne cava fuori.

Ultima operazione da compiere è di andare a controllare che nessuno dall'esterno possa andare a leggere il contenuto di _.htpasswd_, quindi è sufficiente che sia posizionato nella _root_ del nostro sito con _.htaccess_ per essere sufficientemente tranquilli (apache dovrebbe bloccarvi tutti i file _.ht*_), se siete paranoici (come me) mettetelo in un altra cartella del server, al di fuori della tipica _htdocs_ del server, ma assicuratevi che l'utente con cui gira apache riesca ad accedervi in lettura.

Questo è tutto, quindi visto ce è una operazione così semplice quando possiamo utilizziamola.

<h3>Note</h3>
Su alcuni server _htpasswd_ si chiama _htpasswd2_, oppure non è incluso nel path di default, quindi andate a vedere dove è posizionato con _slocate_ o cercando in rete in che posizione è inserito nella distribuzione che state usando.

Questo meccanismo funziona perfettamente anche con Drupal 5.7 (testato) e non da nessuna noia con i clean url ne altro.