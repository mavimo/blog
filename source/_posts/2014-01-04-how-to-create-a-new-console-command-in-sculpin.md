---
title: How to create a new console command in sculpin
draft: true
categories: [development]
tags: [sculpin, bundle, php]
---
Some days ago I start to rewrite my blog using a static site generator. I start to investigate this opportunity some months ago and after looking other tools like Jekyll, Octopress and Sphinx. After some test and investigation I moved to [Sculpin](http://sculpin.io), a REALLY nice  PHP static site generator based on [Symfony](http://symfony.com/) components.

I start to extend Sculpin to have a better productive environmet, like some helper to improve editor activity. To do that I create a new [Editor Bundle](http://github.com/mavimo/sculpin-editor-bundle) that
help start creating a new content. In this post we investigate how to create a new CLI commands in Sculpin.
<!--break-->
### Creating a new bundle
We need to start to create a new bundle. To do that I create a folder where I will store the bundle files and initialize git repo inside.

~~~language-bash
mkdir sculpin-editor-bundle
cd !$
git init
~~~

Now we need to create a ```composer.json``` file where define all information about our sculpin bundle. This is a sample file, you can find more options on [composer website](http://getcomposer.org/doc/01-basic-usage.md#composer-json-project-setup):

~~~language-javascript
{
    "name": "mavimo/sculpin-editor-bundle",
    "description": "Sculpin Editor Bundle",
    "homepage": "https://sculpin.io",
    "keywords": ["projects", "blogging", "blog", "static", "site"],
    "license": "MIT",
    "authors": [
        {
            "name": "Marco Vito Moscaritolo",
            "email": "marco@mavimo.org",
            "homepage": "http://www.mavimo.org"
        }
    ],
    "require": {
        "php": ">=5.3.2"
    },
    "autoload": {
        "psr-0": { "Mavimo\\Sculpin\\Bundle\\EditorBundle": "" }
    },
    "target-dir": "Mavimo/Sculpin/Bundle/EditorBundle",
    "minimum-stability": "beta"
}
~~~

as you can see I define some information like authors, requirements, keywords and autoload-target directory in accord to namespace we will use in our bundle.

After that we can commit our project definition:

~~~language-bash
git add .
git commmit -m "Project definition"
~~~

### Add bundle in our sculpin project
Firt of all we need to add a bundle definition in ```sculpin.json``` file; this allow sculpin to download our bundle and add autoloading capabilities related to our classes.

Edit ```sculpin.json``` adding our bundle definition:


~~~language-javascript
{
    // ...
    "require": {
        "mavimo/sculpin-editor-bundle":   "@dev"
    },
    // ...
}
~~~

our bundle is hosted in a local repository, so we need also to add the repository location in the same file:

~~~language-javascript
{
    // ...
    "require": {
        "mavimo/sculpin-editor-bundle":   "@dev"
    },
    // ...
    "repositories": [
        {
            "type": "vcs",
            "url": "/path/of/our/local/repo/sculpin-editor-bundle"
        }
    ],
    // ...
}
~~~

Now we can run ```sculpin install``` command and our project will be downloaded in ```.sculpin``` folder of our sculpin project.

### Creating the bundle code
We need to create a new class that extend the default sculpin bundle class. Create a new file (with the same name of the class inside it, see [PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md) standard) in the bundle root folder and insert the code inside it:

~~~language-php
<?php

/*
 * This file is a part of Sculpin.
 *
 * (c) Dragonfly Development Inc.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mavimo\Sculpin\Bundle\EditorBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Sculpin Editor Bundle.
 *
 * @author Marco Vito Moscaritolo <marco@mavimo.org>
 */
class SculpinEditorBundle extends Bundle
{

}
~~~
we are creating a new class that extend the default Bundle class.

### Create the command definition

We need also to create a new class that store the command definition inside it, so start creating a new folder ```Command``` and creating a new file that host the command class.

~~~language-bash
mkdir Command
touch Command\EditorCreateCommand.php
~~~

inside the file ```EditorCreateCommand.php```write the following code:

~~~language-php
<?php

/*
 * This file is a part of Sculpin.
 *
 * (c) Dragonfly Development Inc.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mavimo\Sculpin\Bundle\EditorBundle\Command;

use Sculpin\Core\Console\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Sculpin Editor Bundle.
 *
 * @author Marco Vito Moscaritolo <marco@mavimo.org>
 */
class EditorCreateCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        // ...
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // ..
    }
}
~~~

This class implements two methos, the first (```configure```) declare a new command, the second (```execute```) is the code executed on command invokation.

In the configure method we need to add:
~~~language-php
$this
    ->setName('editor:create')
    ->setDescription('Create a new content.')
    ->setHelp("The <info>editor:create</info> command create a new post content.")
    ->addOption('type', 't', InputOption::VALUE_REQUIRED, 'Type of content to create', 'post')
    ->addOption('date', 'd', InputOption::VALUE_REQUIRED, 'Date of content to create', date('Y-m-d'))
    ->addArgument('title', InputArgument::REQUIRED);
~~~
the ```setName``` method define the name of command exposed to use in CLI interface, and ```setDescription``` the command description; we can also set the help text using ```setHelp``` method.

After the command definition there are some most usefull methods used to add options and arguments to our command. This methods (```addArgument``` and ```addOption```, you can read method information in the official [Symfony documentation](http://api.symfony.com/2.3/Symfony/Component/Console/Command/Command.html)) use the ```InputOption``` and ```InputArgument``` class to define some constants, se ne need to add their usage:

~~~language-php
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
~~~

In the ```execute``` method we can use the defined arguments or options with:

~~~language-php
$type = $input->getOption('type');
$title = $input->getArgument('title');
~~~

and we can use this variables in our code.

### Instantiate the command

Now we have create the bundle and the command definition, we need only to inject the command in the sculpin CLI application; this is really easy but undocumented.
We need to overridete the method ```registerCommands``` in the class that extend Bundle (```SculpinEditorBundle```):

~~~language-php
    public function registerCommands(Application $application)
    {
        $application->add(new EditorCreateCommand());
    }
~~~

and, of course, add the class definitions:
~~~language-php
use Symfony\Component\Console\Application;
use Mavimo\Sculpin\Bundle\EditorBundle\Command\EditorCreateCommand;
~~~

The above definided method instantiate our command and add it in the application.

This allow our command to be added in our bundle.

Add our code in repo and commit.

~~~language-bash
git add .
git commit -m "Define the command and add to bundle."
~~~

### Enable bundle in sculpin application

We have create a new bundle, now sculpin need to know that this bundle is required. To do this add in the ```app/SculpinKernel.php``` file (create it if it do not exist) the new bundle definition:
~~~language-php
<?php

class SculpinKernel extends \Sculpin\Bundle\SculpinBundle\HttpKernel\AbstractKernel
{
    protected function getAdditionalSculpinBundles()
    {
        return array(
           'Mavimo\Sculpin\Bundle\EditorBundle\SculpinEditorBundle'
        );
    }
}
~~~

Update your sculpin dependencies to download the last version of our bundle:

~~~language-bash
sculpin update
~~~

When you run the sculpin CLI application you can see your command available, with their information:

~~~language-bash
marco@nebula ~/Development/mavimo/blog master  $ sculpin
Sculpin version 2.0.x-dev - app/dev/debug

Usage:
  [options] command [arguments]

# ...
editor
  editor:create   Create a new content.
# ...
~~~

and also:

~~~language-bash
marco@nebula ~/Development/mavimo/blog master  $ sculpin editor:create -h
Usage:
 editor:create [-t|--type="..."] [-d|--date="..."] title

Arguments:
 title
# ...
~~~

After writing the business logic of bundle you can share your bundle on [packagist](https://packagist.org/) and remove the _repositories_ definition in your ```sculpin.json``` file.

Happy fun with [Sculpin](http://sculpin.io)!
