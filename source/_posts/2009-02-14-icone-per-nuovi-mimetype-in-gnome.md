---
title: Icone per nuovi mimetype in gnome
categories: [linux]
tags: [gnome, icone, mimetypes, ubuntu]
redirect: [linux/icone_nuovi_mimetype_gnome, node/73]
meta:
    description: Le icone, una delle prime cose che si personalizza chi passa molto tempo al computer, oltre che per esigenze anchegrafiche per il fatto che permette di riconoscere un file a colpo d'occhio, e quindi capirne la funzione senza dover andare a leggere nome del file e magari capire di cosa si tratta.
    tags: [linux, gnome, icone, mimetypes, ubuntu]
---
Le icone, una delle prime cose che si personalizza chi passa molto tempo al computer, oltre che per esigenze anchegrafiche per il fatto che permette di riconoscere un file a colpo d'occhio, e quindi capirne la funzione senza dover andare a leggere nome del file e magari capire di cosa si tratta.

Personalmente trovo una cosa comodissima poter assegnare icone alle cartelle, ma ancor di più poter personalizzare l'icona associata ad un be definito tipo di file, quindi vediamo come possiamo fare questo per tutti quei tipi di file uguali ma che dobbiamo differenziare per comodità nostra.
<!--break-->
Dico subito che tratterò dei file dei moduli di drupal, ma lo stesso principio vale anche per qualsiasi altro tipo di file, quindi potete "sbizzarrivi" (ovviamente è inutile avere 100000 elementi grafici diversi, si rischierebbe solo di peggiorare la situazione!)

Come prima cosa dobbiamo andare a creare un nuovo mimetype da andare ad associare al nostro tipo di file che ha un'estensione ben precisa. Per fare questo creiamo un nuovo file XMl con la struttura di seguito specificata:
~~~language-php

<?xml version="1.0" encoding="UTF-8"?>
<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
  <mime-type type="application/x-drupal-php">
    <comment>Drupal module script</comment>
    <comment xml:lang="it">Modulo di Drupal</comment>
    <sub-class-of type="text/plain"/>
    <generic-icon name="x-drupal-php"/>
    <magic priority="80">
      <match value="&lt;?php" type="string" offset="0:64"/>
    </magic>
    <glob pattern="*.install"/>
    <glob pattern="*.module"/>
    <glob pattern="*.info"/>
  </mime-type>
</mime-info>

~~~


Come potete vedere questo file contiene la definizione del nuovo mimetype (che ho chiamato _"application/x-drupal-php_) per i file il cui nome corrisponde a dei pattern ben precisi (_*.install_, _*.module_ e _*.info_). Oltre a questo abbiamo definito il nome del mimetype (_Drupal module script_) anche nelle versioni italiana (_Modulo di Drupal_) e il nome dell'icona che dovremmo usare (_x-drupal-php_).

Una volta creato questo file andiamo a salvarlo nella cartella _/usr/share/mime/packages_, per fare questo servono i privilegi di root, quindi se non li avete salvate il file nella vostra home e poi spostatelo nella cartella indicata. Nel mio caso il file l'ho chiamato _drupal.mime.xml_:
~~~language-php

gedit ~/drupal.mime.xml
~~~

e dopo averlo editato:
~~~language-php

sudo mv ~/drupal.mime.xml /usr/share/mime/packages/drupal.mime.xml
~~~


A questo punto andiamo ad aggioranre il database dei mimetype del nostro sistema dando:
~~~language-php

sudo update-mime-database /usr/share/mime
~~~


Fatto questo primo passaggio andiamo ad aggiungere l'icona che ci serve nel nostro set ti icone, per fare questo dobbiamo innanzitutto sapere quale è il set di icone che stiamo usando, nel mio caso uso il set _Tangerine_, ma lo stesso discorso può essere applicato a qualsiasi set di icone.

Andiamo a copiare questa icona che vogliamo usare nella cartella corretta, ora, siccome la mia icona era un icona vettoriale (SVG) la salverò nella cartella scalable, ma é possibile fare la stesas cosa per le immagini PNG, dovete solo essere sicuri che le dimensioni corrispondano al nome della cartella in cui andrete a salvarla (32x32, 64x64, 128x128). All'interno di quella cartella troverete una serie di sottocartelle, nel nostro caso si tratta di un icona per un certo mimetype, quindi la posizionerò in questa cartella.

Al termine dobbiamo aggioranre il database del seti di icone in cache.

Nel mio caso ho dato i comandi:
~~~language-php
sudo cp application-x-drupal-php.svg /usr/share/icon/Tangerine/scalable/mimetype/application-x-drupal-php.svg
cd /usr/share/icon
sudo gtk-update-icon-cache Tangerine
~~~


a questo punto dovremmo poter aprire una cartella contente questi file e vedremmo associati ad essi l'icona corretta, come potete vedere nell'immagine di apertura.

Se vi serve l'icona che ho utilizzato io la trovate allegata a questo articolo.
