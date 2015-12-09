var fs = require('fs');
var aws = require('aws-sdk');
require('dotenv').load();

var params = {accessKeyId : process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY};

var s3 = new aws.S3(params);

exports.process = function(bucketName, fileLocation, fileName) {
  createBucket(bucketName)
      .then(function(data) {
        var bucketCreated = data.Location.replace(/^\/+/, "");
        console.log('Bucket created: ' + bucketCreated);
        uploadFiles(fileLocation, fileName);
      })
      .catch(function(err) {
        console.log('The promise threw an error: ' + err);
      });
};

function createBucket(bucketName) {
  params.Bucket = bucketName;
  return new Promise(function(fulfill, reject) {
    s3.createBucket({Bucket: bucketName}, function(err, data) {
      if (err) {
        reject(err);
      } else {
        fulfill(data);
      }
    });
  });
}

function uploadFiles(fileLocation, fileName) {
  var fileToUpload = fs.createReadStream(fileLocation);

  params.Body = fileToUpload;
  params.Key = fileName;

  s3.upload(params)
      //.on('httpUploadProgress', function(evt) {
      //  console.log(evt);})
      .send(function(err, data) {
        if(err) {
          console.log('Upload error: ' + err);
        } else {
          console.log('Upload data: ' + data);
        }
      });
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

