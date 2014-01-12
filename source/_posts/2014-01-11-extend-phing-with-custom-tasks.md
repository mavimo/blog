---
title: Extend Phing tasks with custom code
categories: [php]
tags: [phing, php, s3]
image:
    folder: phing-custom-task
    alt: Create custom phing task to upload S3 files.
meta:
    description: How to extend phing task to add new feature required in our projects, with sample based on AWS S3 put task.
    tags: [php, phing, s3, task, automatization]
---
I use [phing](http://phing.info) to manage task in my projects; phing is a task manager build in PHP that use XML configuration file. Phing is delivered with a [large amount of task](http://www.phing.info/docs/guide/stable/) available, but sometime they are not sufficient and is required extend or create new one.

On refactoring of my blog I used [S3](http://aws.amazon.com/s3) to store files, but the phing task do no support some feature that I require (set max-age and gzip headers). I resolved this issues extending phing task, let me explain what I do.
<!--break-->
### Creating phing.xml base file

Phing can be used to execute task defined in a ```xml``` file, by default it use ```build.xml```. We can create a new build file that define a sample task that upload a file in a S3 bucket.

We can upload files in S3 bucket using S3PutTask, that can be configured using:
~~~language-markup
<?xml version="1.0" encoding="UTF-8"?>

<project name="MavimoBlog" description="Build and deploy Mavimo's blog" default="deploy_s3">
  <target name="deploy_s3">
    <echo>Deploy files on S3</echo>
    <s3put
      bucket="${amazon.bucket}"
      key="${amazon.key}"
      secret="${amazon.secret}"
      source="homepage.html."
      object="index.html" />
  </target>
</project>
~~~

That upload file in a S3 bucket using AWS credentials. All this information are stored in property file that is included in build execution. We need to create a property file ```build.prod.properties```:
~~~language-bash
amazon.bucket=mavimo-test-bucket
amazon.key=HPRL2FWUJKNN17U0902G
amazon.secret=tUxJzHamh6cy5noUyw/L2b7kcT3SyC3/sIXpSNE7
~~~

and we can execute phing using:
~~~language-bash
phing -propertyfile build.prod.properties -f build.xml deploy_s3
~~~

This command correctly upload file in S3 bucket.

Our uploaded file miss some foundamental HTTP header to improve performance on client and reduce the number of request that client execute to server. We can improve it creating a custom task as described in the next section.

### Create a new task class

We need to extend the default ```S3PutTask``` to introduce some more sophisticate S3 upload procedure. We can start to create a new class, my class name is ```S3UploadTask```, then i generate a new file ```S3UploadTask``` that extend ```S3PutTask```:

~~~language-php
<?php

require_once "phing/tasks/ext/Service/Amazon/S3/S3PutTask.php";

/**
 * Task to upload object in S3 adding some metadata.
 */
class S3UploadTask extends \S3PutTask
{

}
~~~

now we can extend the default class adding some method that allow us to set some properties in the task. We need to set the maxage value to set in S3 object, to do that we need to define a new publi method ```setMaxage```:
~~~language-php
<?php

require_once "phing/tasks/ext/Service/Amazon/S3/S3PutTask.php";

/**
 * Task to upload object in S3 adding some metadata.
 */
class S3UploadTask extends \S3PutTask
{
    /**
     * Object maxage (in seconds).
     *
     * @var int
     */
    protected $_maxage = null;

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
}
~~~
and override the ```saveObject``` method to add this value in headers:

~~~language-php
/**
 * Task to upload object in S3 adding some metadata.
 */
class S3UploadTask extends \S3PutTask
{
    // ...

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
~~~

This allow us to define ```maxage``` attribute in the task and this attribute is set on S3 object.

### Import the task
We need to include own task in ```build.xml``` file, this can be do using ```taskdef``` tag, eg:

~~~language-markup
<?xml version="1.0" encoding="UTF-8"?>

<project name="MavimoBlog" description="Build and deploy Mavimo's blog" default="deploy_s3">
  <taskdef name="s3upload" classname="S3UploadTask" />

  <!-- ... -->
</project>
~~~

Phing need also to search the defined class in files available in our folder, to do that swe can use ```includepath``` definition. I saved my class in a subfolder called _phing_, then I need to define in my ```build.xml```:

~~~language-markup
<?xml version="1.0" encoding="UTF-8"?>

<project name="MavimoBlog" description="Build and deploy Mavimo's blog" default="deploy_s3">
  <includepath classpath="phing" />
  <taskdef name="s3upload" classname="S3UploadTask" />

  <!-- ... -->
</project>
~~~

### Use the task

We can use our defined task with tags defined in the ```taskdef``` tag:
~~~language-markup
<?xml version="1.0" encoding="UTF-8"?>

<project name="MavimoBlog" description="Build and deploy Mavimo's blog" default="deploy_s3">
  <includepath classpath="phing" />
  <taskdef name="s3upload" classname="S3UploadTask" />
  <target name="deploy_s3">
    <echo>Deploy files on S3</echo>
    <s3upload
      bucket="${amazon.bucket}"
      key="${amazon.key}"
      secret="${amazon.secret}"
      source="homepage.html."
      object="index.html" />
  </target>
</project>
~~~
and we can also set the attributes defined in our class:
~~~language-markup
<!-- ... -->
    <s3upload
      bucket="${amazon.bucket}"
      key="${amazon.key}"
      secret="${amazon.secret}"
      source="homepage.html."
      object="index.html"
      maxage="864000" />
<!-- ... -->
~~~

Our object uploaded in S3 bucket now have the _Cache-Control_ header with _max-age_ attribute set with the value we define in the _maxage_ tag attribute.

### Conclusion

**Phing** is an awesome tool that allow us to execute complex activities using XML configuration file. If there isn't already available class to execute some required task we can extend or create custom task and include it in our build file to match our requirements.

PS: this change in ```S3PutTask``` maybe will integrate in phing, see [Pull request 259](https://github.com/phingofficial/phing/pull/259) on github.

Let me know if you have some nice task/tips that can be used in phing :)
