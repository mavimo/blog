<?php

// require_once "phing/Task.php";
require_once "phing/tasks/ext/Service/Amazon/S3/S3PutTask.php";
// require_once "/usr/local/php5/lib/php/phing/tasks/ext/Service/Amazon/S3/S3PutTask.php";

class S3UploadTask extends S3PutTask
{
    protected $_maxage = null;
    protected $_gzipped = false;

    public function setMaxage($seconds)
    {
        $this->_maxage = $seconds;
    }

    public function getMaxage($seconds)
    {
        return $this->_maxage;
    }

    public function setGzip($gzipped)
    {
        $this->_gzipped = $gzipped;
    }

    public function getGzip($gzipped)
    {
        return $this->_gzipped;
    }

    protected function getHttpHeaders()
    {
        $headers = array();
        if (!is_null($this->_maxage)) {
            $headers['Cache-Control'] = 'max-age=' . $this->_maxage;
        }
        if ($this->_gzipped) {
            $headers['Content-Encoding'] = 'gzip';
        }
        return $headers;
    }

    protected function saveObject($object, $data)
    {
        $object = $this->getObjectInstance($object);
        $object->data = $data;
        $object->acl = $this->getAcl();
        $object->contentType = $this->getContentType();
        $object->httpHeaders = $this->getHttpHeaders();
        $object->save();

        if(!$this->isObjectAvailable($object->key)) {
            throw new BuildException('Upload failed');
        }
    }
}
