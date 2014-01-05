---
title: Facciamoci un libro
categories: [varie]
tags: [latex, lulu, politecnico di milano]
redirect: [varie/fare_libro_latex, node/18]
meta:
    description: Recentemente &egrave; stato attivato anche per l'Italia il servizio di print-on-demand di <a href="http://www.lulu.com/it">lulu</a>, fondato qualche anno fa da Bob Young fondatore di RedHat. L'idea su cui si basa questo portale &egrave; quella di dare la possbilit&agrave; a chiunque di realizzare un proprio libro senza dovere sostenere spese esorbitanti per la stampa in proprio.
    tags: [varie, latex, lulu, politecnico di milano]
---
Recentemente &egrave; stato attivato anche per l'Italia il servizio di print-on-demand di <a href="http://www.lulu.com/it">lulu</a>, fondato qualche anno fa da Bob Young fondatore di RedHat. L'idea su cui si basa questo portale &egrave; quella di dare la possbilit&agrave; a chiunque di realizzare un proprio libro senza dovere sostenere spese esorbitanti per la stampa in proprio. Per chi non realizza libri potrebbe risultare comunque utile per la stampa di documenti corposi sia per la distribuzione che per uso privato (per esempio manuali di prodotti dell'azienda); ma &egrave; anche possbile utilizzare lo stesso servizio perla stampa di tesi, ottenendo cos&igrave; un buon risparmio sulla costo di stampa, anche se in questo caso il problema &egrave; che &egrave; necessario finire il documento da stampare con largo anticipo, cosa che difficilmente si riesce a ottenere.

Vediamo ora come ottenere il documento che andremo a stampare, utilizzando i tre principali software disponibili per la realizzazione di documenti. Tutti si chiederanno quali sono i tre programmi, visto che l'unico che viene in mente &egrave; Microsot Office Word (in tutte le sue varie versioni), ma esistono anche programmi OpenSource (che non vuol dire gratuiti, ma in questa occasione &egrave; vero anche che lo sono) che possono essere utilizzati per ottenere un risultato simile se non migliore.

Il pi&ugrave; semplice da utilizzare, sopratutto all'inizio per chi conosce gi&agrave; MS Office Word, &egrave; Open Office 2, essendo la sua interfaccia molto simile a quella del noto software commerciale, mentre quello che permette di ottenre i risultati migliori &egrave; senza dubbio LaTeX (che non &egrave; un vero e proprio programma ma un linguaggio). Entrambi questi due programmi esistono per diversi sitemi operativi, dalpi&ugrave; comune Microsoft Windows alle varie distribuzioni di Linux e per MAC.

L'utilizzo di MS Office Word e Open Office 2 verr&agrave; affrontato in un prossimo articolo, ora ci concentriamo sull'utilizzo di LaTeX; non spaventatevi se all'inizio vi sembrer&agrave; stranocome modo di realizzare documenti, il risultato ottenuto (come impaginazione) vi faranno rimpiangere di non aver imparato ad utilizzarlo prima!

La prima cosa da fare per poter realizzare i documenti partendo da testo che abbiamo (o che dobbiamo scrivere) &egrave; di ottenere un compilatore per il nostro codice LaTeX; per windows potete scaricarlo da <a href="http://miktex.org/">MiKeTeK</a>, mentre se utilizzate Linux sicuramente troverete i pacchetti precompilati per la vostra distribuzione, per esempio su debian e derivare (ubuntu fra tutte) &egrave; sufficiente dare: ~~~language-php
sudo apt-get install latex
~~~
.

Una volta ottenuto il compilatore utilizzeremo un'interfaccia per poter lavorara pi&ugrave; facilmente, infatti se &egrave; vero che potremmo scrvere tutto tramite un editor di testo banalissimo &egrave; altrettanto vero che l'utilizzo di software appositamente dedicati semplifica notevolmente il lavoro da fare. Per Microsoft Windows consiglio l'utilizzo di <a href="http://www.toolscenter.org">TeXnicCenter</a>, mentre per linux &egrave; possibile utilizzare un quasiasi text editor ch supporti la syntax heiglight per codice LaTeX, quali gedit, emacs, vim e molti altri.

Ora abbiamo tuto quello che ci serve per partire, il resto dovrete mettercelo voi!

Iniziamo a dire come funziona LaTeX: il documento che andremo a realizzare verr&agrave; scritto all'interno di un file di testo, mentre per applicare determinate propriet&agrave; al testo si ricorre all'utilizzo di parole chiave. Una volta realizzato il documento sul file di testo questo dovr&agrave; essere compilato per ottenere il file finale che andremo a distribuire, sottoforma di PDF (o se serve come DVI, PS, ...).

Per la realizzazione di documenti complessi esistono numerosi manuali (sia cartacei che disponibili in rete) che vi apriranno un mondo, noi per ora ci  limiteremo a realizzare un libro senza immagini o tabelle ne formule matematiche o grafici (vedremo in un prossimo articolo come inserire questi elementi) suddiviso in capitoli. Iniziate a scaricare un documento di esempio, dopo di che apritelo con il programma che avete scelto di utilizzare (_TeXnicCenter_ o altro, potrebbe andare bene persino il notepad) e analizziamolo passaggio per passaggio.

Il documento inizia con la dicitura:
~~~language-php
\documentclass[12pt,a4paper,twoside,openright]{book}

~~~


Che indica che il nostro documento &egrave; un libro, che il carattere standard &egrave; di 12 punti (12pt), la dimensione di pagina &egrave; A4 (a4paper) e che stamperemo su fronte e retro del foglio (twoside); inoltre indichiamo che tutti i capitoli inizieranno sulla pagina destra del libro (openright). &egrave; possibile modificare questi paramentri in funzione delle caratteristiche del prodotto che vogliamo ottenere e mandare in stampa.

Di default il testo viene posizionato a 4 cm dall'angolo superiore sinistro (per le pagine a sinistra) o destro (per le pagine a destra) e termina a 6 cm dal bordo opposto, questo per permettere ai documenti di essere rilegati tramite cuciture, attualmente questa medotodologia &egrave; superata (i libri ora non vengono pi&ugrave; cuciti a mano), quindi renderemo i margini uguali tramite l seguenti linee di codice:
~~~language-php
\setlength{\oddsidemargin}    {2. cm}
\setlength{\evensidemargin}   {2. cm}
\addtolength{\oddsidemargin}  {0. cm}
\addtolength{\evensidemargin} {0. cm}
~~~

Ovviamente possiamo allargare o diminuire i bordi, per fare questo vi rimando alla documentazione (o a un p&ograve; di prove).

Proseguendo nella lettura del testo troveremo:
~~~language-php
\linespread{1.1}
~~~

che indica l'interlinea utilizzata all'interno del documento, mentre le seguenti linee di codice inidcano ch stiamo scrivendo in italiano e aggiorner&agrave; le indicazioni del dcumento di cnseguenza.
~~~language-php
\usepackage[italian]{babel}
\usepackage[latin1]{inputenc}
~~~


Poich&eacute; ci&ograve; che otterremo &egrave; un documento PDF potrebbe risultarci utile avere dei collegamenti all'interno del documento (dal sommario verso i vari capitoli, per esempio). Ci&ograve; &egrave; effettuato tramite il comando
\usepackage{hyperref}
Questo comando non &egrave; indispensabile, ma potrebbe risultare comodo e i vari collegamenti possono essere colorati in maniera differente tramite i seguenti parametri
~~~language-php
\hypersetup{ 
    colorlinks=true,
    linkcolor=magenta,
    anchorcolor=magenta,
    citecolor=magenta,
    filecolor=magenta,
    menucolor=magenta,
    pagecolor=magenta,
    urlcolor=magenta,
}
~~~


Le impostazioni del documetno sono impostate tramite le seguenti linee:
~~~language-php
\hypersetup{
	pdftitle    = {Titolo del documetno},
	pdfsubject  = {Soggetto del documento},
	pdfkeywords = {parole, chiave, documento},
	pdfauthor   = {\textcopyright\ Autore del documento},
	pdfcreator  = {\LaTeX},
}
~~~


Ora avremo i seguenti comandi:
~~~language-php
\title{Titolo del documento}
\author{Autore del documento}
\date{\today}
~~~

che servono per realizzare la pagina che contiene il titolo del documento.

A questo punto ha inizio il documento vero e proprio, tramite il comando:
~~~language-php
\begin{document}
~~~

e termine con il comando:
~~~language-php
\end{document}
~~~

Al suo interno tutto ci&ograve; che scriviamo verr&agrave; visualizzato nel documento finale.
Per la realizzazione della pagina che funziona da copertina utilizzeremo il comando
~~~language-php
\maketitle
~~~


La suddivisione in capitoli pu&ograve; essere effettuata inserendo il comando:
~~~language-php
\chapter{Titolo del capitolo}
~~~

Se &egrave; necessario inserire dei sottocapitoli si ricorre all'uso del comando:
~~~language-php
\section{Nome del sottocapitolo}
~~~

mentre per eventuai sottsezioni si ricorre al comando:
~~~language-php
\subsection{Nome del sotto-sottocapitolo}
~~~


Inserendo il testo otterremo i vari paragrafi, per ottenere un nuovo paragrafo &egrave; necessario lasciare una linea vuota, mentre gli a capo inseriti alla fine della riga non vengono considerati.

Alla fine del documento (o all'inizio, in base alle nostre scelte) andr&agrave; inserito il sommario tramite il comando:
~~~language-php
\tableofcontents
~~~

si, avete capito bene, basta solo questa riga di codice!

Ora man mano che scriverete il vostro libro e i vostri capitoli il documento di testo che utilizzate diventer&agrave; sempre pi&ugrave; grande e ingestibile. Per ovviare a questo problema si ricorre all'utilizzo della direttiva:
~~~language-php
\include{altro_capitolo}
~~~

che permette di separare il documento in vari file, in fase d compilazion tutti questi file verranno uniti per ottenere un unico prodotto. All'interno del secondo file non bisogna reinserire tutto il codice visto fino ad ora, ma andr&agrave; inserito solamente il testo del nostro capitolo.

Ora siamo pronti a compilare il nostro lavoro per ottenere il PDF completo. questa operazione viene effettuata tramite il comando Build -> Current File -> Build (CTRL+F7) di MiKeTeX oppure, se volete compilare da console tramite
~~~language-php
latex nomefile.tex
~~~


Per ora vi lascio alle vostre prove, per chiarimenti o informazioni lasciate dei commenti.

Nei prossimi articoli vedremo come inserire immagini e tabelle nel nostro documento, come ottimizzare la gestione del nostro documento separano in maniera logica i nostri file e come inserire equazioni matematiche, anche molto complesse, all'interno del nostro libro.

Per chi fosse ancora dubbioso sulle capacit&agrave; di LaTeX provate a vedere se riuscite a fare qualche cosa di <a href="/files/2/cinetica.pdf">simile</a> (senza impazzire, ovviamente) usando un qualsiasi altro word editor (MS Office Word per esempio).