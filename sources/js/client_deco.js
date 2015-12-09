var http = require('http');
var util = require('util');

var client = {};


client.options = {
    host: "127.0.0.1",
    port: "1337",
    path: "",
    method: ""
};


exports.register = function (user_id,user_mdp) {
        client.post({id:user_id, mdp:user_mdp, service:"register"});
};


client.post = function(obj) {
        data = obj;
        this.options.path = "/";
        this.options.method = "POST";

        var requete = http.request(this.options, this.callback_post);
        requete.write(JSON.stringify(data));
        requete.end();
};
