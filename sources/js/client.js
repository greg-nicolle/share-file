var util = require('util');
var net = require('net');
var fs  = require('fs');

var file = {};
process.on('message', function(m) {
      console.log('Client got message:',m);
      if(m.ip) {
        file.send = 0;
        startserv(m.ip);
      } else if(m.path){
          file.path = m.path;
        startstream(m.path);
      }
});

var events = require('events');
var ev = new events.EventEmitter();
var client = {};

var startserv = function(ip){
    client = net.connect({host:ip,port: 8124}, function() {
    });
    client.on('end', function() {
            console.log('client disconnected');
    });
};

var startstream = function(path){
	fs.stat(path, function (err, stats) {
        console.log(err+stats.size);
		tmp = {};
        file.size = stats.size;
		tmp.size = stats.size;
		tmp.file_name = file.path.split("/");
        tmp.file_name = tmp.file_name[tmp.file_name.length-1];
		client.write(JSON.stringify(tmp));
	});
	console.log("Go!");
	file.init_stream();
};

file.init_stream = function(){
	var _this = this;
	this.stream = fs.createReadStream(this.path);

	this.stream.on('open', function(chunk){ 
		_this.stream.pipe(client);
	});

	this.stream.on('error', function(err) {
    		console.log(err);
	});

	this.stream.on('end', function(err) {
		console.log("\ndone");
	});

	this.stream.on('data',function(data) {
        file.send+=data.length;
        var prog = Math.floor(file.send*100/file.size);
        process.send({'prog':prog});
	});

};
