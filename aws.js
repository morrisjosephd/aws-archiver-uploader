var fs = require('fs');
var aws = require('aws-sdk');
require('dotenv').load();

var params = {accessKeyId : process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY};

var s3 = new aws.S3(params);

exports.process = function(bucketName, upload, zipName) {
  var cb = uploadFiles(upload, zipName);
  createBucket(bucketName, cb);
  listAllBuckets();
};

function createBucket(bucketName, cb) {
  params.Bucket = bucketName;
  s3.createBucket({Bucket: bucketName}, function(err, data) {
    if (err) {
      console.log('Error creating bucket ' + '[' + bucketName + ']' + ': ' + err);
    } else {
      var bucketCreated = data.Location.replace(/^\/+/, "");
      console.log('Bucket created: ' + bucketCreated);
      cb();
    }
  });
}

function uploadFiles(upload, fileName) {
  return function() {
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
}

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
}