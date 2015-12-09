var net = require('net');
var os = require('os');
var fs = require('fs');
var util = require('util');
var clients = [];

process.on('message', function(m) {
    console.log('CHILD got message:',m);
    if(m.ip) {
        startserv(m.ip);
    } else if(m.path){
        file.path = m.path;
        startstream(m.path);
    }
});

var file = {};
file.receve = 0;

file.flag = true;

for(var i in os.networkInterfaces()){
	if(!os.networkInterfaces()[i][0].internal){
		console.log("votre adresse ip est : " + os.networkInterfaces()[i][0].address);
	}
}
var server = net.createServer(function(socket) {
        console.log('client connected');
	    file.flag = true;

        socket.on('end', function() {
		    file.receve = 0;
            console.log('\nclient disconnected');
        });

        socket.on('data',function(data){
            if(file.flag){
                file.size = data;
                file = JSON.parse(data);
                file.receve = 0;
                file.flag = false;
                console.log(file.file_name);
                file.writeStream = fs.createWriteStream('../ecriture/'+file.file_name);
                socket.pipe(file.writeStream);
            }else{
                file.receve += data.length;
                process.stdout.cursorTo(0);
                var prog = Math.floor(file.receve*100/file.size);
                process.send({'prog':prog});
            }
        })

});
fs.exists('../ecriture', function(e){
    if(!e){
        fs.mkdir('../ecriture');
    }

});
server.listen(8124, function() {
        console.log('server bound');
});
