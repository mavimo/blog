<?php

class SculpinKernel extends \Sculpin\Bundle\SculpinBundle\HttpKernel\AbstractKernel
{
    protected function getAdditionalSculpinBundles()
    {
        return array(
           'Mavimo\Sculpin\Bundle\EditorBundle\SculpinEditorBundle',
           'Mavimo\Sculpin\Bundle\RedirectBundle\SculpinRedirectBundle'
        );
    }
}
