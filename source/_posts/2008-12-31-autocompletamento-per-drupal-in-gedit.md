---
title: Autocompletamento per drupal in gedit
categories: [Drupal]
tags: [autocomplete, code, fapi, gedit, hook, info, installazione, linux, moduli, snippet]
---
Parlando sul forum di <a href="http://www.drupalitalia.org/node/5770" title="Buon IDE per Drupal, discussione su DrupalItalia">drupalitalia</a> su quale fosse il miglior IDE per sviluppare su drupal ognuno proponeva la sua soluzione, personalmente utilizzo PSPad quando mi trovo su sistemi windows mentre su Linux utilizzo <a href="http://live.gnome.org/Gedit" title="Pagina del progetto gedit">gedit</a>, un programma che di base è molto scarno, ma che grazie ai <a href="http://live.gnome.org/Gedit/Plugins" title="Pagina dei plugin di gedit">plugin</a> riesce a diventare uno strumento potentissimo.

Innanzitutto diciamo  che non voglio scatenare guerre di religione, che non c'è l'IDE perfetto e che ognuno usa quello che conosce meglio e che ritiene migliore, ma se siete qui credo che gedit sia il vostro IDE (o uno dei vostri IDE preferiti).
<!--break-->
Un IDE deve fornire almeno:
<ol>
  * l'evidenziazione della sintassi
  * visualizzazione dei numeri di riga
  * autocompletamento della sintassi
  * elencazione delle funzioni presenti
</ol>

Per i primi due punti la cosa è praticamente già pronta e perfettamente integrata in gedit, basta andare in _Edit_, _Preferences_ e quindi spuntare la casella **Display line numbers** (io uso anche **Higlight current line**, per non impazzire con linee lunghe, e **Highlight matching bracket** per evidenziare le parentesi che corrispondono, ma non è necessario).

Per il primo punto andiamo ad configurare il programma per usare come evidenziazione della sintassi il codice PHP, quindi _View_, _Highlight mode_ e quindi _Scripts_, infine selezioniamo **PHP**.

l'autocompletamento della sintassi può essere attivato utilizzando il plugin snippet, per fare questo dobbiamo installarlo, con ubuntu e simili è sufficente utilizzare:
~~~language-php
sudo apt-get install gedit-plugins

~~~

e fargli terminare l'installazione; a questo punto andiamo sempre nell'interfaccia di configurazione _Edit_, _Preferences_ ed entriamo nella scheda _Plugins_ (l'ultima della lista), infine andiamoad abilitarle il plugin **Snippet**. A questo punto nel momento in cui andiamo ad aprire un file PHP e stiamo scrivendo del codice è sufficiente andare ad insere alcune sigle predefinite per attivare l'autocompletamento, per esempio per inserire un costrutto _select-case_ è sufficiente scrivere:
<?php
switch
?>
e premere il pulsante tab per ottenere:
<?php
switch (variable)
{
	case 'value':
		# code...
	break;
	default:
		# code...
	break;
}
?>
come si può vedere la cosa è molto comoda e veloce, ma non ci fermiamo qui. premiamo il tasto di tabulazione, vederemo che ogni volta il nostro cursore evidenzia una parte predefinita dello statement inserito, così da velocizzare la creazione di codice.

Tutto questo è comodissimo per scrivere codice PHP, ma a noi serve qualche cosa di più potente che ci permetta di creare rapidamente codice di moduli per drupal, in particolare vogliamo che vengano aggiunti velocemente i diversi _hook_ senza doverceli ricordare a memoria o doverli cercare ogni volta su <a href="http://api.drupal.org">Drupal API</a> (che comunque rimane sempre la nostra guida di riferimento), la struttura completa dei moduli (_module_, _info_ e _install_), le chiamate alle funzioni del database e le _Form API_.

Come prima cosa scarichiamo i pacchetti che trovate in allegato a questo articolo; in funzione di cosa vogliamo andare a visualizzare nell'autocompletamento sceglieremo i file opportuni, fatto questo andiamo in _Tools_, _Manage snippets..._ e quindi su _Import snippets_ (la cartella che trovate in basso a sinistra). Importiamo i pacchetti che ci servono, a questo punto il nostro sistema funzionerà senza problemi. Vediamo alcuni esempi.

<h3>Inserimento di HOOK</h3>
Iniziamo a scrivere hook all'interno del nostro documento nel punto in cui vogliamo andare ad inserire l'hook, digitiamo la parola **hook** e quindi premiamo il tasto TAB; automaticamente ci comparirà un menu a tendina in cui potremo scegliere l'hook che ci serve (o potremmo scrivere il nome dell'hook che ci interessa).
<img src="/files/61/drupal_hook.png" alt="Interfaccia di selezione degli hook" />

Fatto questo preimiamo invio e automaticamente il fiel verrà popolato con il testo dell'hook che abbiamo scelto, in alcuni casi ci sarà molto più di quello che ci serve, sarà sufficiente andare a rimuovere quello che non ci serve. 
<img src="/files/61/drupal_hook_generated.png" alt="Hook inserito" />

Da notare che una volta inseriti i vari snippet premento il pulsante TAB si passerà alle parti di codice da customizzare e in alcuni casi l'editazione di una sola parte di codice modifica automaticamente quelle correlate ad essa.

Gli hook inseriti non sono tutti quelli presenti ma solo i principali e sono (in ordine alfabetico):

  * hook_access
  * hook_block
  * hook_comment
  * hook_cron
  * hook_delete
  * hook_filter
  * hook_form_alter
  * hook_form
  * hook_help
  * hook_insert
  * hook_install
  * hook_link
  * hook_menu
  * hook_nodeapi
  * hook_perm
  * hook_schema
  * hook_search
  * hook_taxonomy
  * hook_theme
  * hook_uninstall
  * hook_update
  * hook_update_N
  * hook_user
  * hook_validate


<h3>Inserimento di FAPI</h3>
L'inserimento di form generati tramite FAPI segue lo stesso principio di quello che abbiamo appena  visto per gli hook, è sufficiente scrivere _fapi_ em premere TAB per avere l'elenco delle FAPI disponibili (anche qui non è la lista completa, ma solo quelli più utilizzati).
<img src="/files/61/drupal_fapi.png" alt="Interfaccia di selezione delle FAPI" />

Scegliendo la FAPI necessaria automaticamente viene inserito l'array degli elemento scelto, con la maggior parte delle impostazioni configurabili, che in alcuni casi potrebbero non essere necessarie.
<img src="/files/61/drupal_fapi_generated.png" alt="FAPI inserita" />

Le FAPI inserite riguardano (in ordine alfabetico):

  * button
  * checkbox
  * checkboxes
  * date
  * fieldset
  * file
  * hidden
  * markup
  * password
  * radios
  * select
  * textarea
  * textfield


<h3>Creazione modulo</h3>
La creazione di moduli richiede, in fase iniziale, la scrittura di una serie di elementi molto standard, quindi risulta comodo automatizzare anche la procedura di creazione, dei file principali, per fare questo utilizziamo la stessa procedura seguita per gli hook e le FAPI, usando i comandi:
<dl>
<dt>info</dt><dd>Crea la parte riguardante le informazioni relative al modulo.</dd>
<dt>install</dt><dd>Crea la parte riguardante le informazioni relative all'installazione modulo, inserendo anche gli hook principali necessari.</dd>
<dt>module</dt><dd>Crea l'initestazione del modulo, andando ad aggiungere in maniera automatica alcuni elementi, quali autore, data, ...</dd>
</dl>

<h3>Funzioni DB</h3>
L'interazione con il database è una di quelle operazioni che si effettua spesso, quindi le funzini si ricordano praticamente sempre, ma avere un meccanismo che iniserisca automaticamente le funzioni è sicuramente utile, per inserire le funzioni relative al database è sufficiente scrivere _db_ e premere TAB per fare in modo che automaticamente appaiano le tre funzioni principali, ovvero:

  * db_query
  * db_fetch_array
  * db_fetch_object


Il codice è stato provato, ma potrebbero esservi errori o imprecisioni, pertanto se ne trovate e me le segnalerete sarò ben felice di correggerle; invece se avete tempo e voglia di estendere questi script aggiungendo le parti mancanti sarò ben lieto di aggiungerle.

<h3>Elenco delle funzioni</h3>

Per l'elencazione della sintassi all'interno di gedit utilizzeremo il plugin <a href="http://sourceforge.net/projects/symbol-browser/">symbol browser</a>, che funziona in concomitanza con <a href="http://ctags.sourceforge.net/">ctags</a>, il quale si occupa di estrarre una serie di informazioni dai file aperti, quali le funzioni, le variabili, le classi, etc presenti. Un esempio del risultato finale lo potete vedere nell'immagine seguente:
<img src="/files/61/gedit_function_list.png" alt="Esempio di elenco funzioni per il file aperto" />

Per effettuare l'installazione iniziamo installando ctag, in particolare:
~~~language-php
sudo apt-get install exuberant-ctags

~~~


e facciamo in modo che anche i file _*.module_ e _*.install_ vengano interpretati come file con codice PHP, quindi aggiungiamo le direttive al file .ctags o più velocemente:

~~~language-php
echo '--langmap=php:+.module.install' >> ~/.ctags

~~~


A questo punto scarichiamo il plugin per gedit dal <a href="http://sourceforge.net/projects/symbol-browser/">sito del progetto</a>, se non sono disponibili i binari per la vostra configurazione potete provare a vedere se nella vostra distribuzione sono già presenti o dovrete conmpilarveli manualmente; fiortunatamente nel mio caso i binari per AMD64 sono disponibili, quindi mi limito a scaricarli, decomprimerli e caricarli nella cartella dei plugin:

~~~language-php

wget http://kent.dl.sourceforge.net/sourceforge/symbol-browser/gedit-symbol-browser-plugin-bin-ubuntu-AMD64-0.1.tar.gz
tar -xzf gedit-symbol-browser-plugin-bin-ubuntu-AMD64-0.1.tar.gz
sudo mv plugins/* /usr/lib/gedit-2/plugins/
mv symbols ~/.gnome2/gedit
~~~


Ora è sufficiente andare nella scheda di configurazione di gedit e abilitare il plugin, nella parra laterale veranno visualizzate le informazioni relative alle funzioni disponibili nei file aperti (e salvati).