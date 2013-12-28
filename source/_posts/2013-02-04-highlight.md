---
title: Syntax Highlighting
categories: [features]
---
You're all programmers, right? And you're writing code snippets on your Sculpin
powered blog? Yeah. So you want some highlighting with your static site generation?
Here you go!

~~~language-php
/**
 * This file is a part of Sculpin.
 *
 * (c) Dragonfly Development Inc.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mavimo\Sculpin\Bundle\ProjectsBundle;

use Sculpin\Contrib\ProxySourceCollection\ProxySourceItem;

/**
 * Project.
 *
 * @author Marco Vito Moscaritolo <marco@mavimo.org>
 * @author Beau Simensen <beau@dflydev.com>
 */
class Project extends ProxySourceItem
{
    public function date()
    {
        self::test();
        return $this->data()->get('calculated_date');
    }

    public function title()
    {
        return $this->data()->get('title');
    }

    public function previousProject()
    {
        return $this->previousItem();
    }

    public function setPreviousItem(ProxySourceItem $item = null)
    {
        parent::setPreviousItem($item);

        // expose additional metadata
        $this->data()->set('previous_project', $item);
    }

    public function nextProject()
    {
        return $this->nextItem();
    }

    public function setNextItem(ProxySourceItem $item = null)
    {
        parent::setNextItem($item);

        // expose additional metadata
        $this->data()->set('next_project', $item);
    }
}
~~~

You can also use [fenced code blocks][fcb] with a syntax declaration at the top.
The markers are `~` instead of <code>`</code>.

[fcb]: http://michelf.ca/projects/php-markdown/extra/#fenced-code-blocks

~~~language-php
if ($fencedCodeBlock->syntax !== 'PHP') {
    throw new UnexpectedValueException("wat");
}
~~~
Like this addition to the skeleton? You can thank for [@Pawka](https://github.com/Pawka)
for suggesting it. :)
