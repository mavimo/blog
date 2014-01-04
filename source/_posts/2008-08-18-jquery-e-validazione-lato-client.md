---
title: jQuery e validazione lato client
categories: [Drupal]
tags: [Javascript, jquery, validazione client]
---
<?php
drupal_add_js('files/57/jquery.validate.js');
drupal_add_js('files/57/additional-methods.js');
drupal_add_js('files/57/additional-methods-it.js');
drupal_add_js('files/57/demo.js');
?>
<p>Drupal si occupa esclusivamente della validazione lato server delle informazioni, ma spesso è consigliabile prevedere ad una prima validazione dei dati inseriti dall'utente lato client, in modo da evitare l'invio della richiesta limitando quindi le possibilità di errore. Ovviamente la validazione lato client non deve essere l'unica attiva, essendo facilmente bypassabile disabilitando i JS sul client, e si rischierebbero danni notevoli.</p>

<p>Vediamo ora come sfruttare una nota libreria di validazione che utilizza jQuery come framework (lo stesso di Drupal, evitandoci, quindi, complicazioni inutili), questa libreria è la <a href="http://bassistance.de/jquery-plugins/jquery-plugin-validation/">jquery.validation</a>.</p>
<!--break-->
<p>Iniziamo scaricando il file della libreria di validazione e il ile aggiuntivo che permette di aggiungere nuove validazioni dal sito, in particolare ci servono i file presenti in questo <a href="http://jquery.bassistance.de/validate/jquery.validate.zip">pacchetto</a>.</p>

<p>Una volta scaricato andremo a fare in modo che nelle pagine in cui serve la validazione vengano caricati anche i due file in questione (_jquery.validate.js_, o la versione min o pack e il file _additional-methods.js_).</p>

<p>Questi due file mettono a disposizione tutta una serie di controlli (dal numero di telefono, agli indirizzi e-mail ai link, al fatto che alcune caselle contengano solo numeri o solo testo, a testi di lunghezze minime e massime prefissate, ...). Purtroppo essendo realizzate da stranieri alcune cose non vanno bene per noi italiani, pertanto ho creato un nuovo pacchetto aggiuntivo a quello che abbiamo già scaricato e che potete trovare allegato alla fine di questo articolo, contiene il file _additional-methods-it.js_ che prevede la validazione dei numeri telefonici italiani (telefoni fissi e cellulari), partita iva, codice fiscale o entrambi (utile quando si vuole far immettere la ragione sociale). Nel caso ci sera uno di questi quattro meccanismi di validazione aggiungiamo lo script indicato oltre ai due precedenti.</p>

<p>Una volta caricato lo script dobbiamo spiegare al client come utilizzare questi script per validare i campi, iniziamo a creare un nuovo file javascript contente il classico:
<div class="codeblock">~~~language-php
$(document).ready(function () {
});

~~~
</div>
all'interno andiamo a inserire le diverse specifiche per la validazione, iniziando ad indicare quale è il form che dobbiamo validare. Presupponiamo che il nostro form da validare sia il seguente:
<div class="codeblock">~~~language-php
&lt;form id="node-form"&gt;
  &lt;label for="telefono" class="desc"&gt;Telefono:&lt;/label&gt;
    &lt;input type="text" name="telefono" id="telefono" value="" /&gt;
  &lt;label for="cf" class="desc"&gt;CF:&lt;/label&gt;
    &lt;input type="text" name="cf" id="cf" value="" /&gt;
  &lt;label for="pi" class="desc"&gt;PI:&lt;/label&gt;
    &lt;input type="text" name="pi" id="pi" value="" /&gt;
  &lt;label for="picf" class="desc"&gt;PI or CF:&lt;/label&gt;
    &lt;input type="text" name="picf" id="picf" value="" /&gt;
  &lt;input type="submit" name="op" id="edit-submit" value="Submit"  class="form-submit" /&gt;
&lt;/form&gt;

~~~
</div>
andiamo a spiegare che il form da validare è quello indicato nel seguente modo:
<div class="codeblock">~~~language-php
$("#node-form").validate();

~~~
</div>
</p>
<p>Ora ci occuperemo di andare ad inserire la validazione dei singoli campi in particolare del numero telefonico, della partita iva (PI) codice fiscale (CF) e di entrambi (PI o CF), per fare questo aggiungiamo una nuova regola ad ogni elemento:
<div class="codeblock">~~~language-php
$('#telefono').rules('add', { required: true, phoneitaly: true });
$('#cf').rules('add', { cfitaly: true });
$('#pi').rules('add', { piitaly: true });
$('#picf').rules('add', { picfitaly: true });

~~~
</div>
dove questi meccanismi di validazione sono presenti nella mia estensione della libreria italiana. Come vedete aggiungendo alla regola l'opzione _required: true_ il campo diventa obbligatorio, aggiungendo _phoneitaly_ il campo deve essere un numero di telefono italiano comprensivo di prefisso internazionale (+39 o 0039), _cfitaly_ richiede il codice fiscale italiano valido, _piitaly_ richiede un valore di partita iva valido (per ora solo le 11 cifre), mentre _picfitaly_ richiede l'inserimento di partita iva o codice fiscale valido.</p>

<p>A questo punto quando inseriamo un valore e questo sarà errato verrà indicato che si tratta di un valore errato e il form non verrà inviato fino a che i valori non verranno corretti.</p>

<p>Possiamo anche migliorare l'aspetto di visualizzazione di questo meccanismo di validazione, per esempio visualizzando un messaggio nel momento in cui la validazione sia corretta, andando ad inserire all'interno delle opzioni di validazione una funzione che scriva _Ok!_, per esempio:
<div class="codeblock">~~~language-php
$("#node-form").validate({ success: function(label) { label.addClass("valid").text("Ok!"); }});

~~~
</div></p>

<p>Possiamo migliorare l'aspetto grafico utilizzando dei CSS, applicando le regole dei css per cui alla classe _.valid_ saranno le proprietà CSS applicate alla label per il messaggio di validazione passata con successo, mentre a quella _.error_ le regole per la validazione fallita.</p>

<p>Qui di seguito potete vedere un esempio di validazione customizzata per visualizzare delle icone (usando i CSS) in caso di validazione occorsa con o senza successo.</p>

<form id="node-form-demo">
  <label for="telefono" class="desc">Telefono:</label> <input type="text" name="telefono" id="telefono" value="" /><br><br>
  <label for="cf" class="desc">CF:</label> <input type="text" name="cf" id="cf" value="" /><br><br>
  <label for="pi" class="desc">PI:</label> <input type="text" name="pi" id="pi" value="" /><br><br>
  <label for="picf" class="desc">PI or CF:</label> <input type="text" name="picf" id="picf" value="" /><br><br>
  <input type="submit" name="op" id="edit-submit" value="Submit"  class="form-submit" />
</form>
<p>Essendo una libreria molto potente e flessibile per ora abbiamo affrontato solo un primo aspetto, vedremo prossimamanete come integrare la validazione con richieste lato server tramite ajax.</p>

<p>**NB:** non mi assumo nessuna responsabilità per l'errato funzionamento dello script, e vi pregherei di riportare i possibili bug o ampliamenti che apporterete.</p>