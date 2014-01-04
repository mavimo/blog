---
title: Git in gedit
categories: [Varie]
tags: [gedit, git, linux, versioni]
---
Precedentemente abbiamo visto come usare gedit come IDE per velocizzare lo sviluppo di codice,<a href="/drupal/coding_drupal_gedit_ancora_snippet">gedit come IDE per Drupal</a>, e come alcuni suoi plugin possano risultare particolamrnete comodi, come per esempio la <a href="/drupal/controllo_codice_drupal_gedit">validazione del codice per Drupal</a>.

Non meno inportante è l'<a href="/varie/cvs_svn_git">utilizzo di un sistema di versioning dei file</a> per permetterci di coordinarci con altri (e anche conn noi stessi).
<!--break-->
Abbiamo visto che la nostra (mia) scelta è ricaduta su git, per diversi motivi, alcuni dei quali già elencati (vi consiglio in ogni caso la lettura di <a href="http://it.whygitisbetterthanx.com">Perchè GIT è meglio di X</a>), altri che verranno spiegati prossimamente, appoggiandoci a <a href="http://github.com/">github</a> per la pubblicazione di file andando ad inviare il tutto tramite shell, ora, nel momento in cui questa operazione viene svolta spesso risulta scomodo andare a effettuare l'operazione manualmente ogni volta.

Un alternativa è quella di creare nel nostro IDE (si, parliamo sempre di gedit) delle scorcatoie per fare in modo che questa procedura venga automatizzata. Per fare questo andiamo ad abilitare il plugin **Tools Extension**, ormai dovresti essere in grado di caricare un plugin in gedit, se così non fosse andate a rispolverarvi i <a href="/drupal/autocompletamento_drupal_gedit">vecchi articoli</a> che spiegano come fare,

Fatta questa prima operazione dobbiamo scaricare e aggiungere ai nostri toos quello per la pubblicazione diretta del file correntemente aperto. Per fare questo abbiamo due modi, andare ad aprire il tool per l'editazione degli script esterni, andando in _Tools_, _External tools..._ e configurarlo come qui sotto indicato:
<img src="/files/gedit-et-git.png" alt="Schermata di configurazione dell'external tools" />
ed inserendo nella scheda del codice il seguente script:
~~~language-php
#!/bin/sh
# Ask message for commit
COMMIT_MESSAGE=`zenity --text-info --editable --width=500 --title="Commit message - gedit" --text="Insert commit message for this file"`
# go into directory
cd $GEDIT_CURRENT_DOCUMENT_DIR
# go into repository main folder
cd `git-rev-parse --git-dir`/..
# start git
git init > /dev/null
# add current file into reposotory
git add $GEDIT_CURRENT_DOCUMENT_PATH
# Commit current file with previous message
git commit -m "$COMMIT_MESSAGE"
# Put file into repository
git push origin master
~~~


L'alternativa è di creare una cartella per i tools nella nostra home e successivamente caricarvi il file allegato in questo articolo. Vediamo come fare:
~~~language-php
mkdir ~/.gnome2/getid/tools
cd ~/.gnome2/gedit/tools
wget http://mavimo.org/files/commit-git.tar_.gz
tar -xzf commit-git.tar_.gz
chmod +x *
~~~

a questo punto dovremmo aver installato il nostro tools esterno.

Ora dobbiamo anche installare un pacchetto che contiene il comando per trovare la directory di git, per fare questo diamo:
~~~language-php
sudo apt-get install git

~~~


Effettuata l'installazione nel momento in cui stiamo modificando un file presente in un reporistory (o un file che dobbiamo aggiungere), andiamo a premere, dop averlo salvato, il tasto **F5**, a questo punto il sistema ci mostrerà  una finestra in cui inserire il commento per il commit e si preoccuperà di inviarlo sul server.

Ovviamente la prima volta l'operazione di creazione del repository locale dovrà essere fatto ancora manualmente, così come le operazioni "particolari", di sicuro questo script ci permette di velocizzare le classiche operazioni di commit invogliandoci a mantenere il nostro lavoro aggiornato sul repository.