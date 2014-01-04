---
title: Rendere valida una pagina con Views e Fivestar
categories: [Drupal]
tags: [fivestar, theme, views, XHTML]
---
Quando si crea un sito spesso si cerca di renderlo valito secondo lo standard XHTML, se non altro perché questo migliora la visibilità dello stesso e aumenta il suo punteggio alla vista dei motori di ricerca. Per fare questo, il nostro sistema di pubbilcazione contenuti preferito non ha problemi, tuttavia ci sono alcune situazioni in cui può essere necessario andare a fare qualche piccola modifica per ottenere il risultato sperato.

Una di queste situazioni è la creazione di views in cui compare un field di tiipo fivestar, inquanto ciò va ad invalidare l'output generato, poichè si trovano dei div all'interno di span (block element in inline element) e il meccanismo di validazione immancabilmente ce lo segnala.

Vediamo come correggere questo problema.
<!--break-->
Innanzitutto accediamo alla nostra views e da qui andiamo a selezionare il _display_ che provoca l'errore, nel mio caso si tratta di un blocco, di conseguenza questo sarà l'elemento selezionato, a questo punto clicchiamo su Theme: Information.
<img src="/files/articolo/69/views_selection_jpeg_26517.jpeg" alt="Immagine della pagina di editing della views" />

Nella parte sottostante compariranno una serie di informazioni, come riportato di seguito (i nomi cambiano in funzione al nome assegnato alla views):
~~~language-php
    * Display output: views-view.tpl.php, views-view--top-page.tpl.php, views-view--block.tpl.php, views-view--top-page--block.tpl.php, views-view--block-1.tpl.php, views-view--top-page--block-1.tpl.php
    * Style output: views-view-list.tpl.php, views-view-list--top-page.tpl.php, views-view-list--block.tpl.php, views-view-list--top-page--block.tpl.php, views-view-list--block-1.tpl.php, views-view-list--top-page--block-1.tpl.php
    * Row style output: views-view-fields.tpl.php, views-view-fields--top-page.tpl.php, views-view-fields--block.tpl.php, views-view-fields--top-page--block.tpl.php, views-view-fields--block-1.tpl.php, views-view-fields--top-page--block-1.tpl.php
    * Field Node: Title (ID: title): views-view-field.tpl.php, views-view-field--title.tpl.php, views-view-field--top-page.tpl.php, views-view-field--top-page--title.tpl.php, views-view-field--block.tpl.php, views-view-field--block--title.tpl.php, views-view-field--top-page--block.tpl.php, views-view-field--top-page--block--title.tpl.php, views-view-field--block-1.tpl.php, views-view-field--block-1--title.tpl.php, views-view-field--top-page--block-1.tpl.php, views-view-field--top-page--block-1--title.tpl.php
    * Field Voting API results: Value (ID: value): views-view-field.tpl.php, views-view-field--value.tpl.php, views-view-field--top-page.tpl.php, views-view-field--top-page--value.tpl.php, views-view-field--block.tpl.php, views-view-field--block--value.tpl.php, views-view-field--top-page--block.tpl.php, views-view-field--top-page--block--value.tpl.php, views-view-field--block-1.tpl.php, views-view-field--block-1--value.tpl.php, views-view-field--top-page--block-1.tpl.php, views-view-field--top-page--block-1--value.tpl.php

~~~

Di questo elenco dobbiamo andare a sovrascrivere un file ben specifico, che nel mio caso risulta essere _views-view-fields--top-page--block-1.tpl.php_, nel vostro caso sarà l'ultimo nome fornito nell'elemnco **Row style output**.

Una volta individuato l'elemento da svorasrivere aprimo un editor di testo (io vi consiglio gedit) e andiamo a inserire il seguente codice:
~~~language-php
<?php foreach ($fields as $id => $field): ?>
  <?php
    $field->inline_html = 'div';
    $field->element_type = 'div';
  ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>

  <<?php print $field->inline_html;?> class="views-field-<?php print $field->class; ?>">
    <?php if ($field->label): ?>
      <label class="views-label-<?php print $field->class; ?>">
        <?php print $field->label; ?>:
      </label>
    <?php endif; ?>
      <<?php print $field->element_type; ?> class="field-content"><?php print $field->content; ?></<?php print $field->element_type; ?>>
  </<?php print $field->inline_html;?>>
<?php endforeach; ?>

~~~

ed a questo punto andiamo a selezionare **Rescan Template files**, a questo punto dovreste aver risolto il problema e la vostra pagina dovrebbe essere diventata valida (a meno di altri errori in altre visualizzazione che potrebbero dover essere modificate).