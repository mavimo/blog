---
title: Installare Drupal 4.7 su netsons
categories: [Drupal]
tags: [installazione, lock tables, netsons]
---
Abbiamo scelto di installare drupal come CMS,  bene, adesso vediamo cosa bisogna fare per farlo funzionare su _netsons.org_, poich&eacute; necessita di alcune modifiche per funzionare correttamente a causa delle limitazioni sul _LOCK_ del database imposte al nostro utente.<!--break-->
Innanzitutto bisogna avere a disposizione un client FTP per effettuare l'upload dei file nella cartella che ci viene assegnta. Di client ne esistono a dozzine, quindi scegliete quello che preferite/sapete gi&aacute; usare, io utilizzo <a href="http://www.sourceforge.net/projects/filezilla">FileZilla</a> (su windows) e <a href="http://ww.gnome.org">Nautilus</a> (su linux), ma quasiasi altro va bene.
Configuriamolo per accedere alla nostra area impostando i parametri che vi vengono assegnati quando create il vostro account:
~~~language-php
Indirizzo: nomeutente.netsong.org
Utente:    **nomeutente@netsons.org**
Password:  **vostra_password**
Porta:     21
~~~

dove, ovviamente, i parametri del **nome tente** e **password** saranno i vostri dati personali che potete vedere nel vostro pannello.
Effettuata questa operazione provate a collegarvi per vedere se tutto funziona (come dovrebbe) oppure se da qualche problema di accesso, nel qual caso chiederte nella sezione appropriata del <a href="http://www.netsons.org/viewforum.php?f=2">forum</a>.
Ora che possiamo accedere alla nostra cartella dobbiamo procurarci il materiale da caricarci, quindi andate sul sito di <a href="http://www.drupal.org">Drupal</a> e scaricatevi l'ultima versione stabile del CMS (quando scrivo &egrave; la 4.7.3); decomprimetela in una cartella locale sul vostro PC.
A questo punto per funzionare correttamente nel nostro spazio su _netsons.org_ vanno effettuate alcune semplici modifiche. Per semplicit&agrave; indicheremmo ora i file utilizzando il percorso relativo dall'interno della cartella in cui avete estratto il pacchetto di Drupal.
Individuate il file _/includes/bootstrap.inc_ e cercate la funzione **variable_set** che dovrebbe trovarsi all'incirca alla riga 230. Sostituitela con:
~~~language-php
function variable_set($name, $value) {
  global $conf;
  db_query("SELECT name FROM {variable} WHERE name = '%s' FOR UPDATE", $name);
  db_query("REPLACE INTO {variable} (name, value) VALUES ('%s', '%s')", $name, serialize($value));
  if (!db_affected_rows()) {
    db_query("INSERT INTO {variable} (name, value) VALUES ('%s', '%s') FOR UPDATE", $name, serialize($value));
  }
  cache_clear_all('variables');
  $conf[$name] = $value;
}
~~~

nello stesso file dovete sostituire la funzione **cache_set** con:
~~~language-php
function cache_set($cid, $data, $expire = CACHE_PERMANENT, $headers = NULL) {
  db_query("SELECT cid FROM {cache} WHERE cid = '%s' FOR UPDATE", $cid);
  db_query("REPLACE INTO {cache} (cid, data, created, expire, headers) VALUES ('%s', %b, %d, %d, '%s')", $data, time(), $expire, $headers);
  if (!db_affected_rows()) {
    db_query("INSERT INTO {cache} (cid, data, created, expire, headers) VALUES ('%s', %b, %d, %d, '%s') FOR UPDATE", $cid, $data, time(), $expire, $headers);
  }
}
~~~

Salvate le modifiche fatte e chiudete, o in alternativa prelevate il file gi&agrave; modificato <a href="/files/1/bootstrap.zip">bootstrap</a> allegato a questo articolo. Aprite ora il file _/includes/database.mysql.inc_ (attenzione non l'_/includes/database.mysql**i**.inc_ e anche qui sostituite la funzione **db_next_id** con:
~~~language-php
function db_next_id($name) {
  $name = db_prefix_tables($name);
  $id = db_result(db_query("SELECT id FROM {sequences} WHERE name = '%s' FOR UPDATE", $name)) + 1;
  db_query("REPLACE INTO {sequences} VALUES ('%s', %d)", $name, $id);
  return $id;
}
~~~

Salvate e chuidete (il file <a href="/files/1/database.mysql.zip">database.mysql.inc</a> &egrave; disponibile allegato a questo articolo).
Ora bisogna impostare i paramentri di accesso al **database** del sito, quindi apriamo il file _/sites/default/settings.php_ e modifichiamo le segueti voci:
~~~language-php
$db_url = 'mysql://**nomeutente**:**password**@**server_MySQL**/**username**'
~~~

usando i parametri forniti per il database MySQL, visibili nel pannello di controllo (ricordatevi di attivare MySQL e PHP per il vostro account).

Inseriamo anche la stringa che segnala quale &egrave; l'indirizzo del nostro sito:
~~~language-php
$base_url = 'http://**nomeutente**.netsons.org';
~~~

L'ultima modifica da effettuare al codice &egrave; quella di inserire alla fine della pagina _index.php_ la seguente riga:
~~~language-php
session_write_close();
~~~

Effettuata questa operazione possiamo effettuare l'upload del contenuto della cartella nello spazio web fornitoci e procedere con le operazioni di instalazioni standard (creazione dell'utente amministratore, etc).