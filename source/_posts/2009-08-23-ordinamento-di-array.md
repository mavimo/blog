---
title: Ordinamento di array
categories: [varie]
tags: [array, oop, ordinamento, php]
redirect: [varie/ordinamento_array, node/95]
meta:
    description: Se vi capita di scrivere un array di oggetti (o di array) e di doverlo poi ordinare secondo criteri definiti, quale sono gli strumenti che php ci mette a disposizione? Vediamo ora come creare dei propri criteri di ordinamento e come ordinare questi array.
    tags: [varie, array, oop, ordinamento, php]
---
Se vi capita di scrivere un array di oggetti (o di array) e di doverlo poi ordinare secondo criteri definiti, quale sono gli strumenti che php ci mette a disposizione? Vediamo ora come creare dei propri criteri di ordinamento e come ordinare questi array.
<!--break-->
Nel caso preso in esempio si crea un array di oggetti di tipo _rectangle_ e si vuole ordinare l'array per l'area che questi hanno.

Iniziamo definendo la classe:
<?php
class rectangle {
  protected $w;
  protected $h;

  // Constructor
  public function __construct($width = 0, $height = 0) {
    $this->w = $width;
    $this->h = $height;
  }
  // Convert to string
  public function __toString() {
  return "width:  " . $this->w . "\n" .
         "height: " . $this->h . "\n" . "\n";
  }
  // Calculate rectangle area
  public function area() {
    return $this->w * $this->h;
  }
  // Other method (not rilevant)
  // ...
}
?>
A questo punto generiamo un array di oggetti (in questo caso con dimensioni random)
<?php
$rectangles = array();
for($i = 0; $i < 10; $i++ )
{
  $width  = rand(1, 100);
  $height = rand(1, 100);

  $rec = new rectangle($width, $height);

  print $rec;

  $rectangles[$rec->area()] = $rec;
}
?>
andiamo a visualizzare il nostro elenco di rettangoli e avremmo qualche cosa simile a:
~~~language-php

Array
(
  [609] => rectangle Object
    (
      [w:protected] => 21
      [h:protected] => 29
    )
  [7776] => rectangle Object
    (
      [w:protected] => 81
      [h:protected] => 96
    )
  // ...
  [2552] => rectangle Object
    (
      [w:protected] => 44
      [h:protected] => 58
    )
  [448] => rectangle Object
    (
      [w:protected] => 7
      [h:protected] => 64
    )
)

~~~

a questo punto, per poter effettuare l'operazione di ordinamento andiamo a usare la funzione **uasort** che ci permette di definire una funzione di callback che può essere usata per la generazione della condizione di ordinamento.

La funzione passata come funzione di callback non deve fare altro che restiruire un valore positivo (+1) se il primo termine è maggiore del secondo, o negativo (-1) nel caso contrario. Nel nostro caso andiamo ad inserire questa funzione all'interno della classe _rectangle_, definendola come statica, quindi:
<?php
class rectangle {
  // ...
  static function order(rectangle $a, rectangle $b) {
    if ($a->area() < $b->area())
    {
      return -1;
    }
    else
    {
      return 1;
    }
  }
}
?>
Avendo ovviamente omesso tutte le funzioni non necessarie. A questo punto possiamo procedere con l'ordinamento dell'array tramite:
<?php
uasort($rectangles, 'rectangle::order');
?>
ovviamente essendo una caratteristica del nostro oggetto _rectangle_ la soluzione migliore è di creare un metodo statico per l'ordinamento dell'array, in modo da lasciare al suo interno gli algoritmi necessari. Otterremo, quindi, il seguente codice nella classe:
<?php
class rectangle {
  // ...
  public static function order(&$rectangles) {
    uasort($rectangles, 'rectangle::order_info');
  }
  private static function order_info(rectangle $a, rectangle $b) {
    if ($a->area() < $b->area())
    {
      return -1;
    }
    else
    {
      return 1;
    }
  }
}
?>
quindi per poter ordinare il nostro array di rettangoli è sufficiente scrivere:
<?php
rectangle::order($rectangles);
?>
In allegato il codice risultante di questo esempio.

Come sempre domande e suggerimenti sono ben accetti!
