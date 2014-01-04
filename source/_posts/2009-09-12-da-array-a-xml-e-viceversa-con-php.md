---
title: da Array a XML e viceversa con PHP
categories: [Varie]
tags: [array, classi, code, codice, oop, PHP, static, xml]
---
Può essere utile, a volte, avere a disposizione delle funzioni che permettono di trasformare degli array in elementi XML, per esempio perché c'è necessità di fornire dei feed, o è necessario realizzare degli elementi particolari per comunicazioni verso altri dispositivi con chiamate REST (per esempio vogliamo creare delle API interrogabili e che possono fornire risposte in diversi linguaggi, come JSON, XMl, PHP serialized, ....), o con applicativi flash/flex/...

Reinventare ogni volta la ruota diventa scomodo e le problematiche che si hanno a gesitre il tutto tramite chiamate a _SimpleXMLElement_ può non essere comodissimo, per questo ho realizzato questa classe che permette di trasformare (in maniera ricorsiva) degli array PHP in XML e viceversa, con la "particolarità" che gestisce senza problemi anche gli attributi per gli elementi.
<!--break-->
La classe (il cui codice trovate allegato a questo articolo) è una class che contiene due metodi statici che possono essere usati per la conversione da array a XMl e vice versa, in particolare la classe definisce:
<?php
class ArrayToXML {
  static public toXml() { // ... }
  static public toArray() { // ... }
}
?>
oltre ad alcune funzionalità e costanti interne, vediamo come usare questa classe.

Innazitutto andiamo ad aggiungere la nostra classe nel codice che dobbiamo usare e creiamo l'array contenente le informazioni che vogliamo convertire:
<?php
include_once('ArrayToXML.php');

$items = array(
  'item' => array(
    // Nodo semplice
    array(
      'key1' => 'value1',
      'key2' => 'value2',
    ),
    // Nodo con attributi
    array(
      'key1' => 'value1',
      'key2' => 'value2',
      'attributes'  => array(
        'attr1' => 'attr_value_1',
        'attr2' => 'attr_value_2',
      ),
    ),
    // Nodo semplice
    array(
      'key1' => 'value1',
      'key2' => 'value2',
    ),
    // Nodo con attributi
    array(
      'key1' => 'value1',
      'key2' => 'value2',
      'attributes'  => array(
        'attr1' => 'attr_value_1',
        'attr2' => 'attr_value_2',
      ),
    ),
  ),
  // Nodo vuoto con attributi
  'altro' => array (
    'attributes'  => array(
        'attr1' => 'attr_value_1',
        'attr2' => 'attr_value_2',
    ),
  ),
  // Attributi della radice
  'attributes'  => array(
        'attr1' => 'attr_value_1',
        'attr2' => 'attr_value_2',
  ),
);
?>

Come potete vedere l'array può essere annidiato su più livelli e può contenere delle chiavi chiamate _attributes_, che vedremo successivamente, vengono elaborate come attributi del nodo a cui appartengono; è anche possibile fare in modo che vengano creati elementi multipli con lo stesso tag (possibile in XML ma non possibile in PHP) andando a usare un array di elementi con la stessa chiave.

Per convertire il nostro array in XML e vice versa andiamo a usare le funzioni statiche precedentemente dichiarate:
<?php
$xml = ArrayToXML::toXml($items, 'items');
$array = ArrayToXML::toArray($xml);
?>
nella prima linea convertiamo il nostro array in XML e nel secondo caso convertiamo l'XML in array. La prima chiamata ha un secondo parametro, oltre -ovviamente- all'array che deve essere convertito, che rappresenta il nome del tag padre dell'XML.

Nel caso sia necessario realizzare dei nodi che abbiamo il nome _attributes_, l'utilizzo della classe così come è ora non lo consente, dobbiamo quindi passare attraverso una piccola modifica del codice della classe principale modificando la riga 14 che contiene:
<?php
const attr_arr_string = 'attributes';
?>
in qualche stringa che non dobbiamo utilizzare come tag (potrebbe anche trattarsi di una strinaga completamente random (io preferisco mantenere la chiave attributes perchè è più parlante), e verranno usate le chiavi degli array contenti questa stringa per la generazione dei nodi degli attributi.

Ovviamente l'operazione di conversione da array a XMl e vice versa restituisce lo stesso oggetto, possiamo verificarlo effettuando la differenza tra i due array:
<?php
echo array_diff($items, $array);
?>
che ci restituisce un array vuoto, ad indicare che non vi sono differenze.

In allegato trovate anche un file di esempio da usare per capire il funzionamento della classe, ma se ci sono domande o richieste di chiarimenti fatevi avanti.