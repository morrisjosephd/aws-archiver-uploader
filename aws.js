var aws = require('aws-sdk');
require('dotenv').load();

var s3Credentials = {accessKeyId : process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY};

var s3 = new aws.S3(s3Credentials);

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

function listAllBuckets() {
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