#!/usr/bin/env node

var fs = require('fs');

var program = require('commander');
var archiver = require('archiver');
var request = require('request');
var aws = require('./aws');
//require('dotenv').load();

//var path = process.env.LOCAL_PATH;

program
    //.usage('<dirctory>')
    .option('-l, --localDirectory [directory]', 'Local directory name to zip')
    .option('-b, --bucketName [bucketName]', 'Name of bucket to create on S3')
    .parse(process.argv);

if (!program.localDirectory || !program.bucketName) {
  program.help();
}

var localDirectory = program.localDirectory;
var bucketName = program.bucketName;

var filesInDirectory = fs.readdirSync(localDirectory);
var fileCount = filesInDirectory.length;
console.log('Number of files to archive: ' + fileCount);

var output = fs.createWriteStream('/Users/josephmorris/' + 'Desktop/pdf/testArchive.zip');
var archive = archiver.create('zip', {});

output.on('close', function() {
  var bytesToMegabytes = 1048576;
  var megabytes = (archive.pointer() / bytesToMegabytes).toFixed(2);
  console.log(megabytes + ': total megabytes in archive');
  console.log('archive created and the output file has closed.');
  aws.createBucket(bucketName);
});

archive.on('error', function(error) {
  throw err;
});

archive.pipe(output);

archive.bulk([
  { expand: true, cwd: localDirectory, src: ['*.NEF', '*.tif', '*.jpg', '*.pdf'] }
]);

archive.finalize();