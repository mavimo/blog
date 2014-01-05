---
title: Inserire codice XHTML in LaTeX
categories: [varie]
tags: [javascript, latex, listing, xhtml]
redirect: [varie/evidenziazione_sintassi_html_javascript_in_latex, node/44]
meta:
    description: Capita a volte di dover scriver documenti LaTeX che contengano stralci di codice dei più diversi linguaggi di programmazione, spesso risolta utile anche un evidenziazione della sintassi nel documento finale prodotto.
    tags: [varie, javascript, latex, listing, xhtml]
---
Capita a volte di dover scriver documenti LaTeX che contengano stralci di codice dei più diversi linguaggi di programmazione, spesso risolta utile anche un evidenziazione della sintassi nel documento finale prodotto. Per fare questo esistono diverse vie:
<ol>
 * inserire il pezzo di codice e formattarlo a mano in modo che rispetti esattamente le impostazioni che vogliamo noi.
 * appoggiarci a programmi esterni che facciano l'operazione appena descritta per noi.
 * usare una classe apposita per far fare l'operazione LaTeX
</ol>
Presuppongo che se siamo qui vogliamo seguire la terza strada l'operazione è abbastanza semplice, si tratta solamente di scaricare il pacchetto _listings_, per esempio da <a href="http://www.ctan.org/tex-archive/macros/latex/contrib/listings/">ctan.org</a>.
<!--break-->
Purtroppo tra gli stili presenti non vi è un XHTML, ma solo HTML e produce uno stile che personalmente non gradisco, per questo ho creato uno stile personalizzato. Per attivarlo creare un nuovo file nella cartella di _listings_ e all'interno inserirvi il seguente testo:~~~language-php
\ProvidesFile{lstlang4.sty}
    [2007/09/03 1.3 listings language file]
%%
%% XHTML definition (c) Marco Vito Moscaritolo
%%
%% XHTML definition (c) 2007 Marco Vito Moscaritolo
%%                              <mavimo@gmail.com>
%%
\lst@definelanguage{XHTML}%
  {
   morekeywords=[0]{xml,html,head,body,title,abbr,acronym,address,blockquote,br,cite,code,dfn,div,em,h1,h2,h3,h4,h5,h6,kbd,p,pre,q,samp,span,strong,var,a,dl,dt,dd,ol,ul,li,object,param,b,big,hr,i,small,sub,sup,tt,del,ins,bdo,button,fieldset,form,input,label,legend,select,optgroup,option,textarea,caption,col,colgroup,table,tbody,td,tfoot,th,thead,tr,img,area,map,meta,noscript,script,styleelement,link,base},%
   keywordstyle=[0]\color{blue!80!black!90}\texttt,
   morekeywords=[1]{http-equiv,name,content,version,encoding,xmlns,lang,accesskey,href,id,class,alt,height,href,http-equiv,id,label,lang,longdesc,media,name,onblur,onchange,onclick,ondblclick,onfocus,onkeydown,onkeypress,onkeyup,onload,onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onselect,onunload,rel,selected,src,standby,style,value,width,xmlns},
   keywordstyle=[1]\color{violet!80}\texttt,
   tag=**[s]<>,%
   morecomment=[s]{<!--}{-->},%
   sensitive=t,%
   showstringspaces=f,
   morestring=[d]",% ??? doubled
   breaklines=t,
   breakatwhitespace=t,
   backgroundcolor=\color{gray!5},
   frame=trbl,
   tabsize=4,% un tab corrisponde a N spazi
   numbers=left,% numero sulla sinistra
   firstnumber=1,% parto a numerare da 1
   commentstyle=\textit,
   stringstyle=\texttt,
   MoreSelectCharTable=%
      \lst@CArgX--\relax\lst@DefDelimB{}{}%
          {\ifnum\lst@mode=\lst@tagmode\else
               \expandafter\@gobblethree
           \fi}%
          \lst@BeginComment\lst@commentmode{ {\lst@commentstyle} }%
      \lst@CArgX--\relax\lst@DefDelimE{}{}{}%
          \lst@EndComment\lst@commentmode
  }[keywords,comments,strings,html]%
~~~

All'interno del file _listings.cfg_ presente nella directory del pacchetto installato inserire al posto della riga:~~~language-php
{lstlang0.sty,lstlang1.sty,lstlang2.sty,lstlang3.sty}
~~~
la riga~~~language-php
{lstlang0.sty,lstlang1.sty,lstlang2.sty,lstlang3.sty,lstlang4.sty}
~~~
per avere il pieno supporto al codice XHTML.
L'utilizzo del pacchetto all'interno di un file di LaTeX è banale, inserire nel preambolo del documento le righe:~~~language-php
\usepackage{listings}
~~~
mentre nel documento impostare il linguaggio predefinito a XHTML con il comando~~~language-php
\lstset{language=XHTML}
~~~
Ora ogni qualvolta nel nostro codice inseriamo l'elemento:~~~language-php

\begin{listings}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/2000/REC-xhtml1-20000126/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="author" content="Marco Vito Moscaritolo" />
		<meta name="keywords" content="parole, importanti, presenti, nella, pagina" />
		<meta name="description" content="La descrizione di questa pagina" />
		<title>Titolo della pagina</title>
	</head>
	<body>
		<h1>Titolo principale</h1>
	</body>
</html>
\begin{listings}

~~~

questo verrà correttamente evidenziato secondo quanto indicato dalla definizione indicata precedentemente, e le righe verranno numerate per una migliore comprensione. Per eventuali personalizzazioni vi rimando alla documentazione del pacchetto.
La stessa operazione si può fare anche per altri linguaggi, come per esempio il linguaggio Javascript, che spesso viene utilizzato all'interno di file XHTML; il codice da andare a mettere nel file _stlang4.sty_ è:
~~~language-php

%%
%% Javascript definition (c) Marco Vito Moscaritolo
%%
%% Javascript definition (c) 2007 Marco Vito Moscaritolo
%%                              <mavimo@gmail.com>
%%
\lst@definelanguage{Javascript}%
{morekeywords=[0]{abstract,boolean,break,byte,case,catch,char,class,%
      const,continue,default,do,double,else,extends,false,final,%
      finally,float,for,goto,if,implements,import,instanceof,int,%
      interface,label,long,native,new,null,package,private,protected,%
      public,return,short,static,super,switch,synchronized,this,throw,%
      throws,transient,true,try,void,volatile,while},%
   sensitive=t,%
   showstringspaces=f,
   morecomment=[l]//,%
   morecomment=[s]{/*}{*/},%
   morestring=[b]",%
   morestring=[b]',%
   breaklines=t,
   breakatwhitespace=t,
   backgroundcolor=\color{gray!5},
   frame=trbl,
   tabsize=4,% un tab corrisponde a N spazi
   numbers=left,% numero sulla sinistra
   firstnumber=1,% parto a numerare da 1
   commentstyle=\textit,
   stringstyle=\texttt,
  }[keywords,comments,strings]%
\endinput
%%
%% End of file `lstlang4.sty'.

~~~

mentre il codice viene definito da ~~~language-php
\lstset{language=Javascript}
~~~
 In allegato trovate il file contenente le definizioni dei due linguaggi indicati pronto per essere utilizzato.
