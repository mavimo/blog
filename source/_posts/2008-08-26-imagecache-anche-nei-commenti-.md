---
title: ImageCache anche nei commenti!
categories: [Drupal]
tags: [commenti, imagecache, template]
---
Uno dei moduli più potenti per la gestione delle immagini che possiamo utilizzare con Drupal è sicuramente <a href="http://drupal.org/project/imagecache">ImageCache</a> (ormai giunto alla release 2.1), a cui si aggiunge l'ottimo <a href="http://drupal.org/project/imagecache_actions">ImageCache Actions</a> che ci permette di aggiungere funzionalità a questo. Vediamo come usare questi strumenti per modificare gli avatar dell'utente all'interno dei commenti.
<!--break-->
Le funzionalità di ImageCache sono molteplici e vanno dal semplici rescaling dell'immagine, alla possibilità di virarne il colore, ruotare l'immagine, modificarne la luminosità, la possibilità di imprimere sopra l'immagine delle altre immagini e così via;

Questo strumento, però, non permette la modifica diretta degli avatar degli utenti, per permettere questo vi sono diverse possibilità, una di queste è quella di utilizzare il modulo <a href="http://drupal.org/project/imagecache_profiles">ImageCache Profiles</a>, che però modifica tutte le visualizzazioni degli avatar nel sito, ovunque queste si trovino, siano nell'articolo, piuttosto ceh nel commento, piuttosto che da altre parti. Questo è alquanto scomodo, pertanto vediamo di aggirare questo problema (anche senza utilizzare il modulo sopra citato).

Iniziamo creando un preset per l'immagine dell'avatar del nostro utente che dovrà essere presente nei commenti. Nel mo caso ho chiamato, con ben poca fantasia, il preset _user_avatar_comment_. Per questo ho impostato tutte le operazioni necessarie, dal rescaling alla sovrapposizione di altre immagini, per ottenere l'immagine che desideravo.

Fatto questo è sufficiente aprire il file _template.php_ del tema in uso, e scrivere all'interno il seguente codice
<?php
function nometema_comment($comment, $links = 0) {
  return _phptemplate_callback('comment', array(
    'author'    => theme('username', $comment),
    'comment'   => $comment,
    'content'   => $comment->comment,
    'date'      => format_date($comment->timestamp),
    'links'     => isset($links) ? theme('links', $links) : '',
    'new'       => $comment->new ? t('new') : '',
    'picture'   => theme_get_setting('toggle_comment_user_picture') ? theme('user_comment_picture', $comment) : '',
    'submitted' => t('Submitted by !a on @b.',
                      array('!a' => theme('username', $comment),
                            '@b' => format_date($comment->timestamp))),
    'title'     => l($comment->subject, $_GET['q'], NULL, NULL, "comment-$comment->cid")
  ));
}
?>dove dobbiamo sostituire _nometema_ nel nome della funzione con il nome del tema che stiamo utilizzando.

Inseriamo poi il seguente codice
<?php
function theme_user_comment_picture($account) {
  if (variable_get('user_pictures', 0)) {
    if ($account->picture && file_exists($account->picture)) {
      $picture = $account->picture;
    }
    else if (variable_get('user_picture_default', '')) {
      $picture = variable_get('user_picture_default', '');
    }
    if (isset($picture)) {
      $preset = 'user_avatar_comment';
      $alt = t("@user's picture", array('@user' => $account->name ? $account->name : variable_get('anonymous', t('Anonymous'))));
      $picture = theme('imagecache', $preset, $picture, $alt, $alt, array()); 
      if (!empty($account->uid)) {
        $picture = l($picture, "user/$account->uid", array('title' => t('View user page.')), NULL, NULL, FALSE, TRUE);
      }
      return "<div class=\"comment-picture\">$picture</div>";
    }
  }
}
?>
dove all'interno della variabile _$preset_ sostituiremo il nome presente con quello del preset che abbiamo precedentemente creato.

Fatto questo tutto funzionerà a dovere, nel caso l'immagine non si visualizzi controllate di avere abilitato l'avatar degli utenti nel commento e che nel file _comment.tpl.php_ sia presente da qualche parte la scritta
<?php
print $picture
?>
Ed ora bizzarritevi a modificare gli avatar nei commenti dei vostri utenti!