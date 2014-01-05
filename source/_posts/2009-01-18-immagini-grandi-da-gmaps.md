---
title: Immagini (grandi) da GMaps
categories: [varie]
tags: [bash, gmap, imagemagik, immagini, linux, php]
redirect: [varie/immagini_grandi_gmaps, node/68]
meta:
    description: Se a qualcuno di voi sono servite delle immagini satellitari, sicuramente siete corsi su gmap, ma l'impossibilità di scaricare le immagini direttamente porta a notevoli problemi, ci sono diversi workaround per risolvere, come andare a stampare il monitor, salvare l'immagine, ritagliarla; se però ci servono mappe che non stanno s di un unica pagina? Qui iniziano i problemi e le perdite di tempo, si passa a sctampare diverse immagini, attaccarle assieme, cosa non certo comoda, soprattutto per avere immagini su grandi formati.
    tags: [varie, bash, gmap, imagemagik, immagini, linux, php]
---
Se a qualcuno di voi sono servite delle immagini satellitari, sicuramente siete corsi su gmap, ma l'impossibilità di scaricare le immagini direttamente porta a notevoli problemi, ci sono diversi workaround per risolvere, come andare a stampare il monitor, salvare l'immagine, ritagliarla; se però ci servono mappe che non stanno s di un unica pagina? Qui iniziano i problemi e le perdite di tempo, si passa a sctampare diverse immagini, attaccarle assieme, cosa non certo comoda, soprattutto per avere immagini su grandi formati.

Di recente mi è servito ottenere un immagine da stampare su di un cartellone (A2) per una scuola, quindi serviva un immagine molto grande, all'incirca 50MPx per avere una risoluzione decente per la stampa, per fare questo (odiando perdere tempo per stare li a fare le diverse operazioni a mano), mi sono inventato una serie di script che fanno queste operazioni, vediamo come usarli e ottenere il risultato finale.
<!--break-->
Innazitutto dobbiamo avere uno spazio web dove possiamo mettere in esecuzione questo script (PHP) per ottenere le immagini da google (tramite il sevizio <a href="http://code.google.com/apis/maps/documentation/staticmaps/" title="Static Maps">Static Maps</a>), e poi dobbiamo avere una chiave di google maps per poter scaricare le immagini sul nostro server. Per ottenere la chiave andiamo alla <a href="http://code.google.com/apis/maps/signup.html">pagina di richiesta</a> di Google, inseriamo l'indirizzo del nostro sito ed accettiamo le condizioni, ovviamente dobbiamo avere un account google per avere la chiave, ma ormai chi non lo ha?

Fatta questa prima operazione dobbiamo andare a capire quale zona vogliamo esportare, ci serivranno le coordinate GPS del punto iniziale e finale della mappa che vogliamo ottenere, in pratica le coordinate dei due angoli (superiore sinistro ed inferiore destro) dello spazio che vogliamo estrapolare, il nostro script estrarrà un pò di spazio in più ai lato, ma poi potremmo andare a ritagliarlo. Per trovare le coordinate... ci sono molti modi, vi rimando ad una breve ricerca con google sul come fare.

Fatto questo andiamo a modificare il nostro script inserendo le informazioni così estratte:
~~~language-php
<html>
  <body>
    <h2>File aviable</h2>

<?php
  $i = 1;
  // Mettere qui la chiave di google ottenuta
  $key = 'qwertyuiooooopasdfghjkllzxcvbnm1234567890qwertyuiopasdfghjklzxcvbnm3456789';
  // Mettere qui le coordinate di partenza e di arrivo
  $start['lat'] = 44.100;
  $start['lng'] = 9.500;
  $stop['lat'] = 45.100;
  $stop['lng'] = 10.500;
  // Scarico le immagii sul server
  for( $lat = $start['lat']; $lat < $stop['lat'];$lat += 0.009) {
    $j = 1;
    for( $lng = $start['lng']; $lng < $stop['lng']; $lng += 0.0135) {
      # Genrate file url
      $file_in = 'http://maps.google.com/staticmap?center=' . $lat . ',' . $lng .
                  '&zoom=16&maptype=satellite&size=640x640&key=' . $key;
      $file_out = 'mappa_' . $i . '-' . $j . '.jpg';
      print ' * ' . $file_out . '';
      # Save file
      download($file_in, $file_out);
      $j++;
    }
    $i++;
  }
function download ($file_source, $file_target) {
  // Preparations
  $file_source = str_replace(' ', '%20', html_entity_decode($file_source)); // fix url format
  if (file_exists($file_target)) { chmod($file_target, 0777); } // add write permission
  // Begin transfer
  if (($rh = fopen($file_source, 'rb')) === FALSE) { return false; } // fopen() handles
  if (($wh = fopen($file_target, 'wb')) === FALSE) { return false; } // error messages.
  while (!feof($rh)) {
    // unable to write to file, possibly because the harddrive has filled up
    if (fwrite($wh, fread($rh, 1024)) === FALSE) { fclose($rh); fclose($wh); return false; }
  }
  // Finished without errors
  fclose($rh);
  fclose($wh);
  return true;
}
?>

    <h2>X: <?php print $i; ?><h2>
    <h2>Y: <?php print $j; ?><h2>
  </body>
</html>
~~~


A questo punto salviamo tutto in un file  _estraimappe.php_, carichiamolo sul server e mandiamolo in esecuzione (basta andare con il browser a visitare questa pagina). Il server ci mostrerà l'output con tutti i file scaricati.

Fatto questo il primo pezzoè fatto, ora apriamo il nostro client FTP preferito, e scarichiamo tutti i file che abbiamo scaricato, copiamoli sul nostro PC in una cartella apposita.

Ora per poter procede al montaggio è necesasrio che andiamo ad installare il paccehtto imagemagik, quindi:
~~~language-php

sudo apt-get install imagemagick
~~~


Nella stessa cartella andiamo a creare un file contenente lo script bash per andare a ritagliare e unire le diverse immagini. Lo script _makeimage.sh_ è il seguente:
~~~language-php

 #!/bin/sh
# Set data
tot_row=X # Numero righe
tot_col=6 # Numero colonne
col_px=629
row_px=598
# Crop image to remove unused element.
for i in $( seq 1 $tot_row ); do
  for j in $( seq 1 $tot_col ); do
    convert -crop $col_px\x$row_px\+0+0 +repage mappa_$i-$j.jpg mappa_$i-$j.jpeg
  done;
done;
# Generate horiz strip
for i in $( seq 1 $tot_row ); do
  montage -tile $tot_col\x1 -geometry +0+0 mappa_$i*.jpeg result_$(($tot_col - $i + 1)).jpeg;
done;
# Generate complete element
montage -tile 1x$tot_row -geometry +0+0 result_*.jpeg mappa_tot.jpeg;
# Remove temp image
rm mappa_[0-9]*.jpeg
rm result_*.jpeg

~~~

andate a modificare i valori di X ed Y in funzione dei valori che avete ottenuto dalla pagina web precedentemente aperta, fatto questo assegnamo i giusti permessi al nostro script e mandiamolo in esecuzione. Lo script deve essere inserito nella stessa cartella con tutte le immagini precedenti.
~~~language-php

chmod +x makeimage.sh
./makeimage.sh

~~~

Alla fine dovremmo trovarci una bella immagine con l'immagine satellitare della zona da noi indicata.

in questo modo abbiamo estratto al nostra immagine satellitare, ma nulla ci vieta di estrarre le le mappe anzichè le viste satellitari, o di andare ad aggiungere a queste le diverse informazioni (nome delle strade, dei paesi, ...), ovviamente non mi metterò a spiegare come fare qui, vi rimando alla <a href="http://code.google.com/apis/maps/documentation/staticmaps/">documentazione</a> di google maps, ma se serve fate un fischio nei commenti qui sotto.

Questo script è funzionante ma testato in maniera molto limitata, pertanto in caso di problemi o errori se prrovederete a segnalarmeli vedrò di correggerli.
