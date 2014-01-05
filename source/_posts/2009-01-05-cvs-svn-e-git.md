---
title: CVS, SVN e GIT!
categories: [varie]
tags: [commit, cvs, git, repository, svn, versioni]
redirect: [varie/cvs_svn_git, node/64]
meta:
    description: Spesso capita di dover sviluppare codice, a volte anche in colaborazione con altri, in ogni caso avere un reposotory in cui memorizzare i file risulta un ottima soluzione. Il perchè risulti comodo averlo potete immaginarlo, in ogni caso vediamo i motivi per cui ritengo che un repository in cui memorizzare i file risulti comodo, se non fondamentale.
    tags: [varie, commit, cvs, git, repository, svn, versioni]
---
Spesso capita di dover sviluppare codice, a volte anche in colaborazione con altri, in ogni caso avere un reposotory in cui memorizzare i file risulta un ottima soluzione. Il perchè risulti comodo averlo potete immaginarlo, in ogni caso vediamo i motivi per cui ritengo che un repository in cui memorizzare i file risulti comodo, se non fondamentale.

Inizio dicendo che esistono diversi sistemi per il versioning dei file (creazione di copie di file man mano che vengono fatte modifiche), tra questi i principali e più utilizzati sono gli storici:

  * <a href="http://www.nongnu.org/cvs/">CVS</a>
  * <a href="http://subversion.tigris.org/">SVN</a>
  * <a href="http://git.or.cz/">GIT</a>

A cui si stanno aggiungendo in questo periodo i più moderni

  * Mercurial
  * Bazaar

Non ho alcuna intenzione di dire GIT è meglio di SVN che  meglio di CVS (opps, l'ho detto), stilare classifiche o altro, semplicemente mostrarvi la comodità di utilizzare uno strumento di questo tipo.
<!--break-->
<h3>I motivi per usare un VS</h3>
Innanzitutto per progetti di una certa portata avere dei file sparsi sull'hard disk rende molto difficile, quando non impossibile, lavorarci in maniera pulita, sia perchè si possono introdurre degli errori nel codice e quindi si vuole tornare alle versioni precedenti, sia perché per altri motivi si potrebbe perdere del codice e quindi si può ripristinarlo da versioni precedenti.

Un ulteriore motivo è la possibilità che si da a diverse persone che lavorano su uno stesso progetto di aggiungere pezzi al codice, facendo in modo che le aggiunte delle diverse parti vengano gestite in maniera pulita, evitando sovrascrizioni brutali, permettendo di analizzare le differenze tra i file presenti e così via.

Altro vantaggio che si ha, anche lavorando come singolo sviluppatore sul progetto, è data dalla (passatemi il termine) rigidezza imposta al programmatore, ogni file su cui si lavora può essere modificato e le modifiche devono essere inviate al server centrale che le sincronizza, nell'inviarle è anche possibile andare ad aggiungere dei testi di commento (cosa altamente consigliata) permettendo così di sapere quali modifiche sono state fatte e magari anche il motivo di queste modifiche.

Se tutti questi motivi non vi bastano... c'è qualche cosa che non va, sono motivazioni più che sufficienti per farvi capire che un sistema di versioning è quantomeno fontamentale per chi non voglia scrivere codice a casaccio.

<h3>Come funzionano i VS</h3>
Ogniun dei programmi sopra citati ha delle sue peculiarità, ma grossomodo si comportano tutti nello stesso modo, vi è un **repository** centrale in cui vengono mantenute le informazioni con tutte le modifiche fatte da tutti gli sviluppatori, con i relativi commenti.

Affianco ad esso ogni sviluppatore ha una copia locale del repository su cui può accedere e modificare i file, nel momento in cui le modifiche ad un file già esistente siano considerate dallo sviluppatore "stabili" questo si occupa di effettuare il **commit** sul repository, in pratica di aggiungere le modifiche al file anche sull'elemnto centrale, affiancando le modifiche a un mesasggio che spieghi sommariamente le modifiche.

Nel momento in cui lo sviluppatore inserisce un file per la rpima volta nel repository questo viene analizzato e memorizzato, e assieme ad esso anche il commento che viene inviato per descriverlo, i commit successivi vanno ad aggiungere o togliere pezzi a questo file, mantenendo anche copia di come era prima, in modo da poter in ogni momento ripristinare una qualsiasi versione del file di un momento precedente.

Oltre a queste funzioni base vi è la possibilità di poter controllare le differenze tra file di versioni precedenti, se vi sono modifiche fatte da altri sviluppatori sullo stesso file ed eventualmente se queste modifiche collidono con le nostre e così via.

Una volta che un certo codice si ritiene sufficientemente stabile o si decide di crearne una specie di snapshot si possono effettuare della cerazione di **versioni**, in modo da poter bloccare quel gruppo codice, possono poi esistere diversi rami di sviluppo (i cosiddetti **banch**).

Queste sono solo delle informazioni sommarie perinformazioni più specfiche vi rimando ai siti specializzati nei diversi VS (dove con VS intendiamo i Versioning System), dove troverete informazioni più dettagliate sul funzionamento di ogni singolo strumento.

<h3>Quale VS scegliere?</h3>
Come dicevo in apertura esistono diversi VS che fanno grossomodo le stesse cose, potete provarne diversi per vedere quello che ritenete più comodo, probabilmente vi toccherà utilizzarne almeno due o tre differenti in base al progetto a cui state collaborando, personalmente dopo aver usato SVN, con cui mi trovo decisamente meglio che non con CVS, che comunque uso in taluni casi, sopratutto verso repository gestiti da altri, ho provato GIT e devo dire che posso solo confermare le ottimi voci di coloro che ne parlano e ho quindi scelto di usarlo un pò più massivamente che non solo per fare delle prove.

In ogni caso questa è la MIA scelta personale, non ha nula da togliere alle scelte che ogni altro può fare, quindi chi preferisce utilizzare altri strumenti perchè li ritiene migliori lo può fare tranquillamente, il consiglio di provare GIT, però, mi permetto di darlo, se non altro per provare uno strumento potente e al tempo stesso semplice e pulito. Altro punto non meno importante è he è stato sviluppato con licenza GPL2, che permette di avere libero accesso al codice.

Avere degli account CVS, SVN e GIT in maniera gratuita non è cosa semplice, ci sono alcuni servizi a pagamento e altri gratuiti per progetti rilasciati sotto licenza GPL o simili. Citiamo i soliti nomi noti (e meno noti)

  * <a href="http://sourceforge.net/">Source Forge</a>
  * <a href="http://freshmeat.net/">Fresh Meat</a>
  * <a href="http://savannah.gnu.org/">Savannah</a>
  * <a href="http://github.com/">GitHUB</a>
  * <a href="http://launchpad.net/">Launch Pad</a>


Essendo gratuiti moti di questi hanno tempi di approvazioni bibilici, quindi ho scartato i primi tre abbastanza in fretta, sono invece piacevolmente sorpreso dagli ultimi due che si basano su GIT e su Bazaar2. In particolare mis ono soffermato su github, che è disponibile anche in versione a pagamento con la possibilità di creare repository privati a prezzi accettabili.

<h3>Usiamo github</h3>
Iniziamo installando sulla nostra macchina git, per gli utenti ubuntu/Debian è sufficiente usare:
~~~language-php
sudo apt-get install git-core

~~~

per gli utenti di altri sistemi operativi consiglio una lettura della pagina per l'<a href="http://git.or.cz/gitwiki/GitDocumentation">installazione di git</a>.

Come prima cosa dobbiamo creare un nostro account su <a href="http://github.com/">github</a>, fatto questo avremo la possibilità di realizzare tutti i repository che vogliamo e di riempirli con il codice dei nostri progetti, purchè siano rilasciati sotto licenza GPL o simile (leggetevi bene i ToS - term of service).

L'utentente viene autenticato autenticato tramite chiavi pubbliche/private, in modo da farvi riconoscere dal server, per fare questo dobbiamo innanzitutto controllare se esiste la chiave privata sul nostro PC, altrimenti dovremo crearla. Mi limiterò a spiegare come funziona su sistemi linux, su sitemi MacOSX o Windows vi consiglio di seguire le <a href="http://github.com/guides/providing-your-ssh-key">indicazioni del sito ufficiale</a>.

Controlliamo se abbiamo una chiave pubblica/privata sul PC:
~~~language-php
ls ~/.ssh/*

~~~

se sistono dei file che si chiamno _qualchecosa_ e _qualchecosa.pub_ le chiavi esistono, altrimenti generiamole noi andando a dare i comandi:
~~~language-php
cd ~/.ssh
ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/tom/.ssh/id_rsa): <invio>
Enter passphrase (empty for no passphrase): <digita la tua password>
Enter same passphrase again: <digita nuovamente la tua password>
Your identification has been saved in /home/TUO_UTENTE/.ssh/id_rsa.
Your public key has been saved in /home/TUO_UTENTE/.ssh/id_rsa.pub.
The key fingerprint is:
50:43:77:c6:97:af:61:82:dc:ea:9b:6b:67:d4:1b:61 TUO_UTENTE@volcano
~~~


a questo punto copiamo il contenuto del file _id_rsa.pub_ all'interno del nostro portachiavi disponibile nella nostra <a href="https://github.com/account">scheda di gestione per l'account</a> di github. a questo punto dovremmo comunicare facilmente e pote aggiungere e rimuovere file all'interno del nostro repository.

Una volta cerato il vostro repository , operazione semplice ed eseguibile dal vostro pannello di amministrazione sul sito, potete andare a creare il vostro  repository in locale, per fare questo lanciamo i comandi:
~~~language-php
mkdir NOMEPROGETTO
cd NOMEPROGETTO
git init
touch README
git add README~~~language-php

~~~

git commit -m 'Il mio primo commit'
git remote add origin git@github.com:USERNAME/NOMEPROGETTO.git
git push origin master
~~~

e verrà creato il repository in locale sui cui potete lavorare, nel moemnto in cui dovete aggiungere o aggioranre un file sul repository remoto è sufficiente dare i comandi:
~~~language-php
git init
git add NOME_FILE
git commit -m 'aggiornamento del file ....'
git push origin master
~~~

Il primo comando è sufficente darlo una volta sola, gli add del commit permettono di aggiungere tuttta una serie di file, in modo da inviarli al server tutti assieme. Nel trasferimento i file da inviare vengono compressi, in modo da limitare il consumo di banda.

A questo punto possiamo andare ad aggiungere modificare i file dal nostro repository secondo le nostre esigenze. Per amggiorni informazioni vi coniglio di leggervi le <a href="http://github.com/guides">FAQ di github</a>.

Nel momento in cui volete che altre persone possano ottenere il vostro repository in locale (magari in sola lettura), è sufficnete che anche loro abbiano installato git e che diano i comandi:
~~~language-php
mkdir MIOPROGETTO
cd MIOPROGETTO
git clone git@github.com:USERNAME/NOMEPROGETTO.git
~~~

e si troveranno tutti i file in locale.

questa è solo una brevissima introduzione, vedremo più avanti come andare ad utilizzare al meglio questo meccanismo di versioning.
