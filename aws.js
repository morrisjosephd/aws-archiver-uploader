var aws = require('aws-sdk');

aws.config.loadFromPath('/Users/josephmorris/Projects/nodeScripts/aws-archiver-uploader/AwsConfig.json');

var s3 = new aws.S3();

module.exports.createBucket = createBucket;

function createBucket(bucketName) {
  s3.createBucket({Bucket: bucketName}, function() {
    console.log('created the bucket[' + bucketName + ']');
    //console.log(arguments);
  });
};
