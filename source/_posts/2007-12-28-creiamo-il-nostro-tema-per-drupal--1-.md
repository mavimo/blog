---
title: Creiamo il nostro tema per Drupal (1)
categories: [Drupal]
tags: [modulo color, sviluppo, tema]
---
Data la mancanza di documentazione in questo campo e le continue richieste da parte degli utenti di avere una guida per la realizzazione di un tema, più o meno complesso, per <a href="http://drupal.org">Drupal</a>, ho iniziato a scrivere questa guida, che non pretende di essere completa ne troppo approfondita, ma spero che serva come base di partenza per tutti coloro che hanno intenzione di creare un proprio tema o cercare di capire come questo avviene.
<!--break-->
Questa guida si baserà sul motore di template basato su PHP, ovvero _PHPTemplate_. Drupal mette a disposizione molti engine di template, ma questo è il più usato e credo il più semplice per chi conosce già un pò di PHP. Oltre a questo engine verrà utilizzato il modulo _color_ che permette di variare da interfaccia grafica i colori del tema, permettendo così di creare un tema che potrà essere variato con un minimo forzo da parte dell'utente finale, permettendo di modificare i colori del layout adattandoli al contenuto del sito stesso.

<h3>Cosa ci serve</h3>
Bhè, innanzitutto una buona dose di volontà e tempo libero, poi cercheremo di realizzare il tutto usando software liberi e disponibili per più piattaforme, in particolare utilizzeremo <a href="http://www.inkscape.org">Inkscape</a> come programma di grafica vettoriale, <a href="http://www.gimp.org">Gimp</a> come editor di grafica raster e un editor testuale, possibilmente con evidenziazione della sintassi, per la creazione dei file PHP (io uso <a href="http://www.pspad.com/it/">PSPad editor</a> su piattaforma windows e gedit su piattaforma linux).

Detto il software che ci serve vediamo le conoscenze che invece dobbiamo avere: iniziamo dicendo che serve un minimo di buon gusto per creare un tema piacevole alla vista e usabile, poi sicuramente sono necessarie buone conoscenze di HTML (meglio se di <a href="http://www.w3.org/TR/xhtml11">XHTML Strict</a>), CSS (anche qui possibilmente all'ultima versione, cioè <a href="http://www.w3.org/TR/REC-CSS2">CSS2</a>), un pò di conoscenza di PHP e di certo non fa male avere una minima introduzione sul funzionamento di Drupal (anche se questo cercherò di spiegarlo man mano). come conoscenze opzionali (ma sarebbe bene averle) abbiamo le regole basi dell'accessibilità e dell'usabilità di un sito.

<h3>Iniziamo</h3>
Una volta che abbiamo a disposizione tutto questo iniziamo a lavorare. Come prima cosa spegniamo il computer, apriamo il cassetto della stampante e prendiamo un foglio di carta bianco, una matita (io preferisco le morbide, ma va a gusti) e una gomma. Pensiamo un attimo a come deve essere la struttura del nostro sito e iniziamo a abbozzare qualche cosa che potrebbe essere il nostro layout. Dopo qualche tentativo, dovremmo riuscire ad ottenere una pseudo bozza (che vedrete cambierà anche molto nel corso dell'evoluzione del nostro tema). 

<img src="/files/43/bozza_main_ridotta_ombra.png" alt="Bozza di rappresentazione fatta a mano del layout completo del sito." width="630" height="689" style="margin: auto;" />

Dopo aver immaginato la nostra struttura di base cerchiamo anche di rappresentare i dettagli del nostro tema (le parti principali, non soffermiamoci troppo sui dettagli, le cose anche in questo caso verranno sistemate man mano). Per esempio trovo comodo immaginarmi come dovranno essere rappresentati i menu e le barre di dei titoli dei diversi nodi, ma se volgiamo possiamo andare a rappresentare le diverse schede di una pagina o elementi di altro tipo. di seguito abbiamo due esempi, uno per rappresentare i menu e uno per i titoli:

<img src="/files/43/bozza_block_ridotta_ombra.png" alt="Bozza di rappresentazione fatta a mano del blocco del menu" width="330" height="416" style="margin: auto;" />
<img src="/files/43/bozza_title_ridotta_ombra.png" alt="Bozza di rappresentazione fatta a mano della barra del titolo." width="330" height="137" style="margin: auto;" />

PS: ovviamente lasciate perdere le mie ignobili capacità artistiche, sono solo dei bozzetti fatti per capire cosa intendo per rappresentare solo alcuni pezzetti.

<h3>Capiamo _color_</h3>
Il modulo color ha il compito di cambiare il colore del nostro tema da interfaccia grafica, darci la possibilità di visualizzare l'anteprima delle modifiche effettuate e, in caso di conferma, rigenerare tutti i file delle immagini necessari per realizzare il layout. Per fare in modo che tutto questo venga svolto come indicato è necessario fare alcune considerazioni sul suo funzionamento. In fase di conferma il modulo color prende un file immagine (solitamente indicato indicato come _base_) che contiene un immagine con canale _alpha_ (per capirci la trasparenza). Questa immagine viene posizionato come strato superiore di una serie di livelli che poi verranno uniti e e di conseguenza avremmo l'immagine da cui andare a ritagliare le sotto immagini che ci servono nel nostro layout.

Un immagine dovrebbe spiegare più di tutte le parole:
<img src="/files/43/livelli_ombra.png" alt="Rappresentazione dei livelli di color." width="481" height="239" style="margin: auto;" />

I livelli che abbiamo indicato hanno delle funzioni ben definite:

   * _base_: è l'immagine che sovrapporremo ai livelli inferiori e permetterà di creare alcuni effetti particolari (per esempio di sfumatura).
   * _gradiente_: Conterrà un unica zona in cui vi sarà un gradiente tra due colori.
   * _sfondo_: conterrà il colore di sfondo che verrà impostato. Possono esserci alcune zone di colore differente, ma ogniuna di queste sarà di un colore omogeneo.


<h3>Portiamo la bozza sul monitor</h3>
Per ora l'unica cosa che abbiamo del nostro tema è una bozza rappresentata su di un foglio di carta che useremo come linea guida di partenza (NB: di partenza!) del nostro tema. Come primi cosa, quindi, dobbiamo andare a trasportarla sul monitor. Iniziamo aprendo inkscape e inserendo in questo tre livelli chiamandoli, rispettivamente, sfondo, gradiente e base. Il nome non è rilevante ma ci servirà a non fare confusione mentre prepariamo la nostra bozza. A questo punto andiamo a dimensionare la nostra area di lavoro (tanto per capire dove dobbiamo lavorare), quindi dal menu File, Proprietà del documento, impostiamo una larghezza e altezza del documento idonea. Solitamente è sufficiente usare una superficie di 750x1000, ma a volte è sufficiente anche un arie minore e in alcune situazioni serve un area maggiore, ma dipende dai casi.

Fatto questo andiamo a disegnare sul livello base un rettangolo che occupi esattamente tutta la superficie del documento, apriamo l'interfaccia _Riempimento e Contorni_ (CRTL+MAIUSC+F) e dalla scheda sfondo scegliamo un colore che useremo come sfondo (ci serve solo in fase di prototipazione del tema, poi potremo cambiarla in automatico con color), rimuoviamo ogni bordo e salviamo il tutto. Blocchiamo il livello in modo da evitare, per errore, di modificarlo.

Posizioniamoci nel livello gradiente e disegniamo le area (o le aree) che dovranno essere riempite da un gradiente. Poiché il gradiente è uno solo e avrà una unica direzione bisogna ricordarsi che non è così facile andare a avere più zone con gradiente, ma non impossibile, vedremo più avanti come fare. A questo punto dovremmo avere un immagine simile a:
<img src="/files/43/1_ombra.png" alt="Passo uno: base più zona gradiente." width="480" height="630" style="margin: auto;" />

Ora aggiungeremo il gradiente (anche questo verrà modificato automaticamente con l'interfaccia fornita da color). Per fare questo creiamo un nuovo gradiente composto da solo due passi (il colore di partenza e di arrivo); selezioniamo l'elemento che deve contenere il gradiente e applichiamoglielo, se vi sono più elementi che devono contenere il gradiente (sempre lo stesso gradiente), applichiamolo ad entrambi facendo attenzione che la distanza tra i due nodi di partenza e di arrivo sia all'incirca la stessa, in modo da avere una anteprima fedele del nostro risultato.
<img src="/files/43/2_ombra.png" alt="Passo uno: base più gradiente dei colori." width="480" height="630" style="margin: auto;" />
Una volta costruite queste zone possiamo andare a inserire le sfumature sul livello base. Per fare questo io vi consiglio di bloccare i primi due livelli in modo che non possiate, nemmeno incidentalmente, andare a modificare quanto fatto, e lavorare sull'unico livello disponibile. Su questo livello potete andare ad utilizzare qualsiasi colore, sfumatura, elemento che dovrà rimanere fisso nel tema. Usare più colori potrebbe risultare complesso inquanto il tema finale, potendo cambiare colori in maniera arbitraria, difficilmente si riuscirà ad usare colori sufficientemente neutri da poter essere abbinati con qualsiasi altro. Solitamente gli unici due colori che vengono utilizzati sono il colore nero (notazione esadecimele #000000; ) e bianco (notazione esadecimele #FFFFFF; ). In questa fase potete dare sfogo a tutta la vostra creatività, usando le molteplici funzioni di inkscape (ed eventualmente gimp) potete creare un layout veramente carino. Siccome graficamente non ho proprio dei gusti ineccepibili il risultato che ho ottenuto è quello ceh potete vedere di seguito.

Ovviamente l'intera operazione viene eseguita facendo varie prove, quindi inserendo prima alcuni elementi a cui poi, successivamente, si potrà far cambiare gradiente:
<img src="/files/43/3_ombra.png" alt="Passo due: inserimento dei colori sfumati sulla base." width="480" height="630" style="margin: auto;" />

Aggiungendo successivamente altri elementi:
<img src="/files/43/4_ombra.png" alt="Passo due: inserimento dei colori sfumati sulla base." width="480" height="630" style="margin: auto;" />

Ed infine gli elementi accessori che possono dare quel tocco di stile in più al vostro tema (per esmempio i bordini bianchi):
<img src="/files/43/5_ombra.png" alt="Passo due: inserimento di dettagli sulla base." width="480" height="630" style="margin: auto;" />

Per controllare l'effetto che otteniamo al variare del colore proviamo a modificare i colori utilizzati nello sfondo e nei vari gradienti, così da controllare che il tutto funzioni bene anche modificando i colori:
<img src="/files/43/6_ombra.png" alt="Passo due: modifica dei colori del gradiente e della base per controllare l'effetto delle sfumature." width="480" height="630" style="margin: auto;" />

Per oggi ci fermiamo qui, è solo un abbozzatura del lavoro, ma vi garantisco che continueremo tra pochi giorni, nel frattempo prendeteci mano e fate un pò di prove, non limitatevi al primo tentativo.