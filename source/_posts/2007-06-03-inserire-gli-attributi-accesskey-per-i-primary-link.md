---
title: Inserire gli attributi accesskey per i primary link
categories: [drupal]
tags: [accessibilità, accesskey, php, primary link, xhtml]
redirect: [drupal/inserire_gli_attributi_accesskey_per_i_primary_link, node/37]
meta:
    description: Sempre pi&ugrave; spesso si sente parlare di accessibilità, degli enormi vantaggi che derivano dal suo utilizzo e sopratutto dalla necessità dei siti della PA di rispettare le regole che sono inserite nella famosa <a href="http://www.pubbliaccesso.gov.it/normative/legge_20040109_n4.htm">legge Stanca</a> che obbligano a rispettare le direttive WAI (o per lo meno dovrebbe essere così, anche se vedendo alcuni siti.. ma lasciamo perdere, non voglio entrare in polemica).
    tags: [drupal, accessibilità, accesskey, php, primary link, xhtml]
---
Sempre pi&ugrave; spesso si sente parlare di accessibilità, degli enormi vantaggi che derivano dal suo utilizzo e sopratutto dalla necessità dei siti della PA di rispettare le regole che sono inserite nella famosa <a href="http://www.pubbliaccesso.gov.it/normative/legge_20040109_n4.htm">legge Stanca</a> che obbligano a rispettare le direttive WAI (o per lo meno dovrebbe essere così, anche se vedendo alcuni siti.. ma lasciamo perdere, non voglio entrare in polemica).
Una tra le varie caratteristiche che devono essere presente nel sito &egrave; la necessità che i link (per lo meno i pi&ugrave; importanti) abbiano l'attributo _accesskey_ che permette ai diversamente abili di poter visitare il link senza doverlo selezionare con un mouse, ma semplicemente il tasto della tastiera corrispondente alla lettera che &egrave; stata assegnata.<!--break-->
Ovviamente non &egrave; possibile che all'interno della stessa pagina ci siano due attributi  _accesskey_ con lo stesso valore, cos&igrave; come l'attributo _accesskey_ deve essere facilmente comprensibile e collegabile al link. Per poter facilmente capire qule &egrave; l'accesskey spesso
si ricorre ad un piccolo stratagemma, ovvero di inserire la lettera corrispondente tra parentesi quadre. Noi sfrutteremo proprio questa peculiarità per la gestione degli _accesskey_.
Per oggi ci limitiamo a inserire l'attributo per i primary e secondary link, pi&ugrave; avanti vedremo come applicare questo anche ai menu.
Come prima cosa apriamo il file _template.php_ presente nella directory del nostro tema e, se non &egrave; gi&agrave; presente una funzione che si chiama _nometema_links_ dove, ovviamente, _nometema_ &egrave; il nome del tema che state utilizzando. Se cos&igrave; non fosse copiate al suo interno il seguente codice e modificate _nometema_ con il nome del vostro tema.~~~language-php
function nometema_links($links, $attributes = array('class' =&gt; 'links')) {
  $output = '';
  if (count($links) &gt; 0) {
    $output = '&lt;ul'. drupal_attributes($attributes) .'&gt;';
    $num_links = count($links);
    $i = 1;
    foreach ($links as $key =&gt; $link) {
      $class = '';
      if (isset($link['attributes']) && isset($link['attributes']['class'])) {
        $link['attributes']['class'] .= ' ' . $key;
        $class = $key;
      }
      else {
        $link['attributes']['class'] = $key;
        $class = $key;
      }
      $extra_class = '';
      if ($i == 1) {
        $extra_class .= 'first ';
      }
      if ($i == $num_links) {
        $extra_class .= 'last ';
      }
      $output .= '&lt;li class="'. $extra_class . $class .'"&gt;';
      $html = isset($link['html']) && $link['html'];
      $link['query'] = isset($link['query']) ? $link['query'] : NULL;
      $link['fragment'] = isset($link['fragment']) ? $link['fragment'] : NULL;
      if (isset($link['href'])) {
        $output .= l($link['title'], $link['href'], $link['attributes'], $link['query'], $link['fragment'], FALSE, $html);
      }
      else if ($link['title']) {
        if (!$html) {
          $link['title'] = check_plain($link['title']);
        }
        $output .= '&lt;span'. drupal_attributes($link['attributes']) .'&gt;'. $link['title'] .'&lt;/span&gt;';
      }
      $i++;
      $output .= "&lt;/li&gt;\n";
    }
    $output .= '&lt;/ul&gt;';
  }
  return $output;
}
~~~
Dopo aver inserito questo codice salvate il file e controllate che aprendo una qualsiasi pagina del vostro sito (in cui sono presenti dei primary o secondary link non vi siano errori. Se tutto &egrave; andato bene possiamo proseguire andando a modificare la riga ~~~language-php
$output .= l($link['title'], $link['href'], $link['attributes'], $link['query'], $link['fragment'], FALSE, $html);
~~~

con il seguente codice~~~language-php
$pos_start = strrpos($link['title'], '[');
$output .= l($link['title'],
$link['href'],
($pos_start) ? $link['attributes'][] = array('accesskey' => strtolower($link['title']{$pos_start + 1})) : $link['attributes'],
$link['query'],
$link['fragment'],
FALSE,
$html);
~~~
Ora per abilitare l'_accesskey_ ai menu &egrave; sufficiente andare nella sezione di amministrazione, nella sezione del menu e modificare le voci per cui vogliamo attivare l'_accesskey_, ponendo la lettera che deve essere utilizzata come valore dell'attributo tra parentesi quadre.
<h3>Vediamo ora che lettera usare e come visualizzarla.</h3>
Innanzitutto &egrave; preferibile utilizzare lettere che abbiano attinenza con il link, quindi se per esempio vogliamo visualizzare il link al _Forum_ potremmo scegliere la lettera **F**, cos&igrave; come per la _Home Page_ una buona scelta sarebbe la **H**, la **E** per l'_e-mail_ dell'amministratore e cos&igrave; via. Ovviamente bisogna ricordarsi che non possono essere due lettere uguali, quindi se usiamo la **E** per il link _Esempi_ non possiamo utilizzarlo per _e-mail_ e cos&igrave; via.
Per la visualizzazione potremmo non volere visualizzare la lettera da utilizzare, visto che con alcuni browser l'evidenziazione delle lettere dell'_accesskey_ avviene in automatico, ma non &egrave; l'atteggiamento da preferire, sono invece preferibili le seguenti strade:

 * Porre la lettera tra parentesi quadre prima del nome del link (per esempio _[F] Forum_)
 * Porre la lettera tra parentesi quadre dopo del nome del link (per esempio _Forum [F]_)
 * Porre la lettera tra parentesi quadre nel nome del link (per esempio _[F]orum_)

La scelta &egrave; a discrezione dell'amministratore del sito. Prossimamente vedremo come rimuovere la lettera tra parentesi all'interno del link (cosa che sconsiglio fortemente) e come andare a far si che appaiano gli _accesskey_ anche per i menu.
