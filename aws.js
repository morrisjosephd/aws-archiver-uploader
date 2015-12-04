var fs = require('fs');
var aws = require('aws-sdk');
require('dotenv').load();

var params = {accessKeyId : process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY};

var s3 = new aws.S3(params);

exports.createBucket = function(bucketName, upload) {
  params.Bucket = bucketName;
  s3.createBucket({Bucket: bucketName}, function(err) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('created the bucket[' + bucketName + ']');
      console.log(arguments);
    }
  });
};

exports.uploadFiles = function(upload, fileName) {
  params.Body = upload;
  params.Key = fileName + '.zip';
  s3.upload(params)
      .on('httpUploadProgress', function(evt) {
        console.log(evt);})
      .send(function(err, data) {
        if(err) {
          console.log('Upload error: ' + err);
        }
        console.log('Upload data: ' + data);
      });
};

exports.listAllBuckets =  function() {
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