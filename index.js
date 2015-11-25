var commander = require('commander');
var fs = require('fs');
var archiver = require('archiver');
var request = require('request');

var output = fs.createWriteStream(__dirname + '/example-output.zip');
var archive = archiver('zip');

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(error) {
  throw err;
});

archive.pipe(output);

archive.bulk([
  { expand: true, cwd: '<commander directory argument>/', src: ['*.NEF', '*.tif'] }
]);
