#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var archiver = require('archiver');
var aws = require('./aws');

program
    //.usage('<dirctory>')
    .option('-l, --localDirectory [directory]', 'Local directory name to zip')
    .option('-b, --bucketName [bucketName]', 'Name of bucket to create on S3')
    .option('-z, --zipName [zipName]', 'Name of zip to create')
    .parse(process.argv);

if (!program.localDirectory || !program.bucketName) {
  program.help();
}

var localDirectory = program.localDirectory;
var bucketName = program.bucketName;
var zipName;

if (program.zipName) {
  zipName = program.zipName;
} else {
  zipName = createZipFileName();
}

var filesInDirectory = fs.readdirSync(localDirectory);
var fileCount = filesInDirectory.length;
console.log('Number of files to archive: ' + fileCount);

var zipFileLocation = localDirectory + zipName;
var output = fs.createWriteStream(zipFileLocation);
var archive = archiver.create('zip', {});

output.on('close', function() {
  var bytesToMegabytes = 1048576;
  var megabytes = (archive.pointer() / bytesToMegabytes).toFixed(2);
  console.log('archive created and the output file has closed.');
  console.log(megabytes + ': total megabytes in archive');
  aws.process(bucketName, zipFileLocation, zipName);
});

archive.on('error', function(error) {
  console.log('Archiving error: ' + error);
  throw err;
	process.exit(1);
});

archive.pipe(output);

archive.bulk([
  { expand: true, cwd: localDirectory, src: ['*.NEF', '*.tif', '*.jpg', '*.pdf'] }
]);

archive.finalize();

function createZipFileName() {
  var d = new Date();
  var today = (d.getMonth() + 1) + '_' + d.getDate() + '_' + d.getFullYear();
  return 'temporaryArchive_' + today + '.zip';
}
