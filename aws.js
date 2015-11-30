var AWS = require('aws-sdk');

AWS.config.loadFromPath('./AwsConfig.json');

var s3 = new AWS.S3();

