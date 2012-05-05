var	fs = require('fs'),
		express = require('express'),
		util = require('util'),
		format = util.format,
		exec = require('child_process').exec;

var app = express.createServer(
	express.bodyParser({uploadDir: './uploads'})
);

app.get('/', function(req, res){
	res.send("<pre>Try POST.</pre>");
});

app.post('/', function(req, res, next){
  console.log('posting...');
	
	patchFile(req.files.orig, req.files.patch, function(result, error, stdout, stderr) {
		util.print('stdout: ' + stdout);
		util.print('stderr: ' + stderr);
		if (error !== null) {
			util.print('exec error: ' + error);
		}
		
		res.download(result, function(err) {
			// delete files
			fs.unlinkSync(req.files.orig.path);
			fs.unlinkSync(req.files.patch.path);
			fs.unlinkSync(result);
		});
		
	});
	
});

app.listen(3000);
console.log('Express started on port 3000');

function patchFile(orig, patch, callback) {
	var result = './uploads/' + getGuid();
	var cmd = format("patch %s -i %s -o %s --binary", orig.path, patch.path, result);
	exec(cmd, function (error, stdout, stderr) {
		callback(result, error, stdout, stderr);
	});
}

function getGuid() {
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}