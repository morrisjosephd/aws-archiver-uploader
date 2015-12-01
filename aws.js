var aws = require('aws-sdk');
require('dotenv').load();

//aws.config.loadFromPath('/Users/josephmorris/Projects/aws-archiver-uploader/AwsConfig.json');

var s3 = new aws.S3();

exports.createBucket = function(bucketName) {
  s3.createBucket({Bucket: bucketName}, function(err) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('created the bucket[' + bucketName + ']');
      console.log(arguments);
      listAllBuckets();
    }
  });
};

var listAllBuckets = function() {
  s3.listBuckets(function(err, data) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      for (var i in data.Buckets) {
        var bucket = data.Buckets[i];
        console.log('Bucket ' + bucket.Name + ':' + bucket.CreationDate);
      }
    }
  });
};