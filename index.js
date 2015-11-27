#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var archiver = require('archiver');
var request = require('request');


program
    //.usage('<dirctory>')
    .option('-l, --localDirectory [directory]', 'Local directory name')
    .parse(process.argv);

if (!program.localDirectory) {
  program.help();
}

var localDirectory = program.localDirectory;

var filesInDirectory = fs.readdirSync(localDirectory);
var fileCount = filesInDirectory.length;
console.log('Number of files to archive: ' + fileCount);



//var output = fs.createWriteStream(__dirname + '/example-output.zip');
var output = fs.createWriteStream('/Users/josephmorris/Desktop/archiver/testArchive.zip');
var archive = archiver.create('zip', {});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(error) {
  throw err;
});

archive.pipe(output);

archive.bulk([
  { expand: true, cwd: localDirectory, src: ['*.NEF', '*.tif', '*.jpg'] }
]);

archive.finalize();

