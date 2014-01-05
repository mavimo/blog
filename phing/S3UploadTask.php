<?php

require_once "phing/tasks/ext/Service/Amazon/S3/S3PutTask.php";

/**
 * Task to upload object in S3 adding some metadata.
 */
class S3UploadTask extends \S3PutTask
{
    /**
     * Extension content type mapper
     *
     * @var array
     * @access protected
     */
    protected $_extensionContentTypeMapper = array(
      'js'  => 'application/x-javascript',
      'css' => 'text/css',
      'html'  => 'text/html',
      'gif' => 'image/gif',
      'png' => 'image/png',
      'jpg' => 'image/jpeg',
      'jpeg'  => 'image/jpeg',
      'txt' => 'text/plain',
      'xml' => 'application/xml'
    );

    /**
     * Object maxage (in seconds).
     *
     * @var int
     */
    protected $_maxage = null;

    /**
     * Content is gzipped.
     *
     * @var boolean
     */
    protected $_gzipped = false;

    /**
     * Set seconds in max-age, null value exclude max-age setup.
     *
     * @param int $seconds
     */
    public function setMaxage($seconds)
    {
        $this->_maxage = $seconds;
    }

    /**
     * Get seconds in max-age or null.
     *
     * @return int
     *   Number of seconds in maxage or null.
     */
    public function getMaxage()
    {
        return $this->_maxage;
    }

    /**
     * Set if content is gzipped.
     *
     * @param boolean $gzipped
     */
    public function setGzip($gzipped)
    {
        $this->_gzipped = $gzipped;
    }

    /**
     * Return if content is gzipped.
     *
     * @return booleand
     *   Indicate if content is gzipped.
     */
    public function getGzip()
    {
        return $this->_gzipped;
    }

    /**
     * Generate HTTPHEader array sent to S3.
     *
     * @return array
     *   HttpHeader to set in S3 Object.
     */
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

    /**
     * {@ineritDocs}
     */
    protected function saveObject($object, $data)
    {
        $object = $this->getObjectInstance($object);
        $object->data = $data;
        $object->acl = $this->getAcl();
        $object->contentType = $this->getContentType();
        $object->httpHeaders = $this->getHttpHeaders();
        $object->save();

        $this->log($object->key);

        if (!$this->isObjectAvailable($object->key)) {
            throw new BuildException('Upload failed');
        }
    }
}
