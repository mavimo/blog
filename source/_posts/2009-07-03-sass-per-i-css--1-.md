---
title: SASS per i CSS (1)
categories: [Varie]
tags: [css, ruby, sass]
---
I CSS sono uno degli elementi che nel corso degli anni, nel settore del web, si sono meno evoluti dal pundo ti vista della struttura utilizzata. Nelle corso delle diverse versioni sono state aggiunge solo proprietà e selettori nuovi.

Probabilmente penserete: 
~~~language-php

Se non sono cambiati tantomeglio, evito di dover imparare qualche cosa di nuovo!
~~~

Purtroppo, non essendosi evoluti non abbiamo a disposizione cose che potremmo ritenere molto comodo, pensate ad esempio alla possibilità di creare variabili con larghezze, poter effettuare dinamicamente operazioni sulle stesse (per esempio questa colonna è pari alla metà della larghezza della colonna principale), oppure il colore di un selettore è pari al colore definito come colore-base a cui viene rimosso "un pò" del colore rosso.

Bene, vediamo cosa si può fare per migliorare (e semplificare) il nostro lavoro di realizzazione di CSS.
<!--break-->
Esiste un metalinguaggio che permette di ridefinire il modo in cui vengono scritti i CSS rendendo il tutto più _semantico_ ed _ordinato_.
Questo metalinguaggio è il SASS, che sta ad indicare Syntactically Awesome StyleSheets, di cui potete trovare le specifiche alla <a href="http://haml.hamptoncatlin.com/docs/sass">pagina ufficiale del progetto</a>. Vediamo un attimo cosa ci permette di fare.

Innanzitutto si basa sull'indentazione del testo per assegnare le proprietà ai selettori, quindi:
~~~language-php

p em
  :border-size 1px
  :border-color #AAAAAAA
  :padding 0.1em
  :bacground-color #CCCCCC
~~~

e fin qui nulla di sconvolgente se non che ci siamo risparmiati l'utilizzo delle parentesi graffe

Possiamo anche definire delle costanti che poi possiamo utilizzare all'interno del foglio di stile
~~~language-php

!colore-elemento = #AAAAAA
p em
  :border-size: 1px
  :border-color: !colore-elemento
  :padding: 0.1em
p strong
  :border-size: 1px
  :border-color = !colore-elemento
  :padding: 0.1em
~~~

E già questo permette di ridefinire solo alcuni elementi e il tutto si riperquote in cascata, ma anche qui si potrebbe ovviare con una buona scrittura del foglio di stile e un pò di _Trova e Sostituisci_.

Proseguendo possiamo vedere che è possibile andare ad utilizzare strutture gerarchizzate semplicemente indentando correttamente il testo:
~~~language-php

!colore-elemento = #AAAAAA
p em
  :border-size 1px
  :border-color = !colore-elemento
  :padding 0.1em
  a
    :color black
    :border none
~~~

riducendo notevolmente il rischio di andare a sovrascrivere proprietà in maniera indiretta.

Ovviamente è anche possibile effettuare alcune operazioni matematiche basandosi sulle variabili precedentemente dichiarate:
~~~language-php

!larghezza-totale = 960px
!larghezza-principale = 600px
#container
  :width = !larghezza-totale
  #main
    :width = !larghezza-principale
  #right
    :width = !larghezza-totale - !larghezza-principale
~~~


Se questo non ci basta è possibile includere classi all'interno di altri elementi, in modo da rendere il tutto il più possibile mantenibile, per esempio:
~~~language-php

.clear-fix
  :clear both
#main
  .clear-fix
  :color purple
~~~


Oltre a queste ci sono molte altre cose interessanti, ma per ora mi interessava stuzzicare la vostra attenzione.