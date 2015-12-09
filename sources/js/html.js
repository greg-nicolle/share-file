var html = {};
html.friends = {};
var os = require('os');


html.friends.template = {};
html.friends.template.header = 
'   <div class="col-xs-12" style="padding:0px;">'
+'      <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">'
+'          <div class="panel panel-default">'
+'              <div class="panel-heading" role="tab" id="headingOne">'
+'                  <h4 class="panel-title">'
+'                      <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'
+'                          friends on-line'
+'                      </a>'
+'                  </h4>'
+'              </div>'
+'              <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">';


html.friends.template.middle = 
'       </div>'
+'  </div>'
+'  <div class="panel panel-default">'
+'      <div class="panel-heading" role="tab" id="headingTwo">'
+'          <h4 class="panel-title">'
+'              <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">'
+'                    friends off-line'
+'              </a>'
+'          </h4>'
+'      </div>'
+'      <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">';   


html.friends.template.end = 
'               </div>'
+'          </div>'
+'      </div>'
+'  </div>'
+'</div>';


html.friends.friends_online = function(friends,callback) {
        console.log(friends);
    
    var template = html.friends.template.header; 
    for(var i in friends){
        if(friends[i].s) {
            template += 
            '<div class="panel-body">'
            +'  <div class="col-xs-7">'
            +friends[i].id
            +'  </div>'
            +'  <div class="col-xs-5">'
            +'    <button class="select '+friends[i].id+' btn btn-primary" type="button">'
            +'        Send file'
            +'    </button>'
            +'    <button class="del '+friends[i].id+' btn btn-danger" type="button">'
            +'        Delete'
            +'    </button>'
            +'  </div>'
            +'</div>';
        }
    }
    template += html.friends.template.middle; 
    for(var i in friends){ 
        if(!friends[i].s) {
            template += 
            '<div class="panel-body">'
            +'  <div class="col-xs-9">'
            +friends[i].id
            +'  </div>'
            +'  <div class="col-xs-3">'
            +'    <button class="del '+friends[i].id+' btn btn-danger" type="button">'
            +'        Delete'
            +'    </button>'
            +'  </div>'
            +'</div>';
        }
    }
    template += html.friends.template.end; 
    callback(template);

};



html.offline = function(callback){

    var ip = '';
    for(var i in os.networkInterfaces()){
        if(!os.networkInterfaces()[i][0].internal){
            ip = "Your IP : " + os.networkInterfaces()[i][0].address;
        }
    }

    var tmp = 
    '<div class="col-xs-12" style="padding:0px;">'
    +   ip
    +'</div>'
    +'<div class="col-xs-8" style="padding:0px;">'
    +'  <div class="input-group" style="padding:5px;">'
    +'    <input type="text" class="ip form-control" placeholder="Friend\'s IP">'
    +'  </div>'
    +'</div>'
    +'<div class="col-xs-4" style="padding:0px;">'
    +'    <button class="send btn btn-primary" type="button">'
    +'        Send something'
    +'    </button>'
    +'</div>';
    

    callback(tmp);
};
html.drop = function(callback){
    var tmp = 
    '<div class="col-xs-12" style="background-color:#5bc0de;margin:5px;padding:50px;">'
    +'<h2>Drop your file here</h2>'
    +'</div>';
    callback(tmp);
};

html.prog = function(pr,callback){
   var tmp = 
    '<div class="col-xs-12" style="margin:5px;padding:50px;">'
    +'<div class="progress">'
    +'  <div class="progress-bar" role="progressbar" aria-valuenow="'+pr+'" aria-valuemin="0" aria-valuemax="100" style="width: '+pr+'%;">'
    +'      '+pr+'%'
    +'   </div>'
    +'</div>'
    +'</div>';
    callback(tmp);
};


exports.uptodate = html.friends.friends_online;

exports.offline = html.offline;

exports.drop = html.drop;

exports.prog = html.prog;
