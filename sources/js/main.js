var path = require('path');
var html = require(path.join(process.cwd(),"/sources/js/html.js"));
var gui = window.require('nw.gui');
var http = require('http');
var util = require('util');
var events = require('events');
var ev = new events.EventEmitter();
var os = require('os');


var cp = require('child_process');

var n = cp.fork(path.join(process.cwd(),'/sources/js/client.js'));

n.on('message', function(m) {
//      console.log('PARENT got message from client:'+ util.inspect(m));
      if(m.prog){
            if(m.prog==100){
                if(user.logtemp){
	                client.post({logtemp: user.logtemp,service:"get_friends"},pri.callback_friend);
                }
                else{
                    pri.utd('');
                }
            }else{
                html.prog(m.prog,pri.utd);

            }
      }
});
n.on('error', function(m) {
      console.log('PARENT got error from client:'+ m);
});

n.send({ 'hello': 'world' });


var s = cp.fork(path.join(process.cwd(),'/sources/js/server.js'));

s.on('message', function(m) {
  //    console.log('PARENT got message from server:'+ m);
        if(m.prog){
            if(m.prog==100){
                if(user.logtemp){
	                client.post({logtemp: user.logtemp,service:"get_friends"},pri.callback_friend);
                }
                else{
                    pri.utd('');
                }
            }else{
                html.prog(m.prog,pri.utd);

            }
      }
});
s.on('error', function(m) {
      console.log('PARENT got error from server:'+ m);
});


var client = {};

client.options = {
    host: "127.0.0.1",
    port: "1337",
    path: "/",
    method: "POST"
};

var win = gui.Window.get();
var pri = {};
var user = {};


window.ondragover = function(e){
    e.preventDefault();
    return false;
};
window.ondrop = function(e){
    e.preventDefault();
    n.send({'path': e.dataTransfer.files[0].path});
    return false;
};

/* Script sur action "click" */
pri.init = function () {
    document.addEventListener("click", pri.on_click);
};


pri.on_click = function (ev) {
    var src = ev.target;
    if (src.has_class("login")) {
       pri.login();
    } else if (src.has_class("register")) {
        pri.register();
    } else if (src.has_class("select")) {
        pri.send();
        html.drop(pri.utd);
    } else if (src.has_class("add")) {
        pri.add();
    } else if (src.has_class("exit")) {
        pri.exit();
    } else if (src.has_class("go_offline")) {
        html.offline(pri.utd);
    } else if (src.has_class("send")) {
        var ip = document.getElementsByClassName("ip")[0].value;
        n.send({'ip':ip});
        html.drop(pri.utd);
    } else if (src.has_class("del")) {
        pri.del();
    }

    
};

win.on('close', function() {
    pri.exit();
});


HTMLElement.prototype.has_class = function (c) {
        return (this.className.indexOf(c) >= 0);
};


window.onload = function(){

    setTimeout(pri.init,1);
};

pri.login = function(){

    user.username = document.getElementsByClassName("log_username")[0].value;
    user.password = document.getElementsByClassName("log_password")[0].value;

	client.post({id: user.username, mdp: user.password, service:"login"},pri.callback_login);
};

pri.register = function(){
    user.username = document.getElementsByClassName("reg_username")[0].value;
    user.password = document.getElementsByClassName("reg_password")[0].value;

	client.post({id:user.username, mdp:user.password, service:"register"},pri.callback_login);
};

pri.add = function(){
    client.post({logtemp : user.logtemp ,friend: document.getElementsByClassName("add_friend")[0].value,service:"add_friend"},pri.callback_all);
};

pri.send = function(){
    
    for(var i in user.friends){
        if(user.friends[i].id = document.getElementsByClassName("select")[0].classList[1]){
            n.send({'ip':user.friends[i].s});
        }
    }
};
pri.del = function(){
    client.post({logtemp : user.logtemp ,friend: document.getElementsByClassName("del")[0].classList[1],service:"delete_friend"},pri.callback_all);
    

};
pri.exit = function() {
    win.hide();
    console.log("Il va faire tout noire");
    if(user.logtemp){
	    client.post({logtemp: user.logtemp,statut:"",service:"set_info"},pri.callback_all);
	    client.post({logtemp:user.logtemp, service:"logout"},pri.callback_logout);
    }
    n.kill();
    s.kill();
    win.close(true);
};

pri.utd = function(chaine){
    document.getElementById('friends').innerHTML = chaine;
};


client.post = function(obj,callback) {
	data = obj;

	var requete = http.request(this.options, callback);
	requete.write(JSON.stringify(data));
	requete.end();
};
pri.callback_register = function(response) {
	var msg = '';

	response.on('data', function (chunk) {
		msg += chunk;
	});

	response.on('end', function () {
	});
};
pri.callback_login = function(response){
    var msg = '';

	response.on('data', function (chunk) {
		msg += chunk;
	});

	response.on('end', function () {
		msg = JSON.parse(msg);
        if(msg.r = "login ok"){
            user.logtemp = msg.logtemp;

	        client.post({logtemp: user.logtemp,service:"get_friends"},pri.callback_friend);
            var ip = '';
            for(var i in os.networkInterfaces()){
                if(!os.networkInterfaces()[i][0].internal){
                    ip = os.networkInterfaces()[i][0].address;
                }
            }

	        client.post({logtemp: user.logtemp,statut:ip,service:"set_info"},pri.callback_all);
        }
	});
};
pri.callback_friend= function(response){
    var msg = '';

	response.on('data', function (chunk) {
		msg += chunk;
	});

	response.on('end', function () {
	    msg = JSON.parse(msg);
        user.friends = msg.f;
       html.uptodate(user.friends,pri.utd);
	});
};
pri.callback_all = function(response){
    var msg = '';

	response.on('data', function (chunk) {
		msg += chunk;
	});

	response.on('end', function () {
		msg = JSON.parse(msg);
        var tmp = msg.r.split(" ");
        if(tmp[tmp.length-1] == "ok"){
	        client.post({logtemp: user.logtemp,service:"get_friends"},pri.callback_friend);
        }
        if(msg.logtemp){
            user.logtemp = msg.logtemp;
        }
	});
};

