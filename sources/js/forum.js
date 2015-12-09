var pri = {};

pri.threads = [];
pri.sem = 0;

//pri.tps = 0;
//pri.name_ent = "CAC 40";
//pri.donnes_courbe = [];
//pri.mem_portefeuille = "";
//pri.date = "";
//pri.interv_search;


/* Script sur action "click" */
pri.init = function () {
	document.addEventListener("click", pri.on_click);
	
	pri.get_threads_id();	
};


pri.on_click = function (ev) {
	// .target désigne la cible(le noeud DOM) concerné par le chang. d'état sur événement "click"
	var src = ev.target;
	if (src.has_class("new_thread")) {
		//pri.new_thread();
	} else if (src.has_class("raf_threads")) {
		pri.get_threads_id();
	}
};

/*
pri.new_thread = function() {
	// Récupération des données dans les balises de la classe associée
    var a = document.cookie;
	//alert("Valeurs : " + a);
	
    var data = {log_temp: a, act: "deconnect"};
	client.post(data, pri.post1_back);
};

pri.post1_back = function () {
	if (this.readyState == 4 && this.status == 200) {
		window.location.assign("/acceuil.html");
	}
};
*/
/*
pri.search = function (click_ent) {
	var i = 0;
	var cpt = 0;
	var mem_ent = "";
	var sup = "SA S.A. SE REG NV GROUP CAC 40";
	var ext = "Liquide Paribas Agricole Générale";
	var entreprise, ent_temp = "";
	var ent_save = new Array();
	var article = document.getElementById("article"+i);
	
	if (click_ent) {
		if (click_ent == "Compagnie de Saint-Gobain") {
			entreprise = click_ent.toLowerCase();
		} else if (click_ent == "Electricité de France S.A.") {
			entreprise = "edf";
		} else {
			ent_save = click_ent.split(" ");
			// console.log("1 - " + ent_save);
			
			for (var j = 0; j < 2; j++) {
				
				if (sup.indexOf(ent_save[j]) >= 0) {
					ent_save[j] = "";
				}
			}
			
			if (ext.indexOf(ent_save[0]) >= 0 || ext.indexOf(ent_save[1]) >= 0) {
				entreprise = ent_save[0] + " " + ent_save[1];
			} else {
				entreprise = ent_save[0]
			}
		
			entreprise = entreprise.toLowerCase();
		}
	} else {
		entreprise = document.getElementsByClassName("entreprise")[0].value.toLowerCase();
		
		var reg = new RegExp("é", "g");
		entreprise = entreprise.replace(reg, "e");
	}
	
	// console.log(" - " + entreprise);
	while (article) {
		if (entreprise) {
			article = document.getElementById("article"+i);
			
			if (!article)
				break;
			cpt++;
			article = article.innerHTML.toLowerCase();
			// console.log(article);
			// var reg = new RegExp("é", "g");
			// article = article.replace(reg, "e");
			
			if (article.indexOf(entreprise) < 0) {
				document.getElementById("article"+i).classList.add("hidden");
				cpt--;
			} else {
				document.getElementById("article"+i).className = "col-xs-12";
			}
		} else {
			article = document.getElementById("article"+i);
			
			if (!article)
				break;
			article = article.className;
			
			if (article.indexOf("hidden") >= 0) {
				document.getElementById("article"+i).className = "col-xs-12";
				cpt--;
			}
		}
		i++;
		// console.log(cpt);
		
		if (entreprise != mem_ent) {
			if (cpt == 0) {
				document.getElementById("article_fin").className = "col-xs-12";
			} else {
				document.getElementById("article_fin").classList.add("hidden");
			}
		}
	}
	entreprise = mem_ent;
}
*/


pri.get_threads_id = function() {
	var path = "get_threads";
	var data = {};
	client.post(path, data, pri.get_threads_id_back);
};


pri.get_threads_id_back = function() {
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);

		if(typeof(r) == "object") {
			var threads_id = r.threads;
			//console.log(threads_id);
			pri.threads = [];

			if(threads_id.length > 30) {
				for (var i = threads_id.length - 1; i >= threads_id.length - 30; i--) {
					//console.log(new Date(+threads_id[i]));
					pri.get_thread(+threads_id[i]);
					pri.sem++;
					//console.log("entree: " + pri.sem);
				}
			} else {
				for (var i in threads_id) {
					//console.log(new Date(+threads_id[i]));
					pri.get_thread(+threads_id[i]);
					pri.sem++;
					//console.log("entree: " + pri.sem);
				}
			}

			/*
			// Delete all threads
			var path = "delete_thread";
			var data = {};
			for (var i in threads_id) {
				data.id = threads_id[i];
				client.post(path, data, pri.delete_threads_back);
			}
			*/

		} else {
			alert("Erreur - Récupération des threads impossible");
		}
	}
};

/*
pri.delete_threads_back = function() {
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);
		console.log("ok");
	}
};
*/

pri.get_thread = function(date) {
	var path = "show_thread";
	var data = {id: date};	
	client.post(path, data, pri.get_thread_back);
};


pri.get_thread_back = function() {
	if (this.readyState == 4) {
		//pri.sem--;
		//console.log("sortie: " + pri.sem);

		if(this.status == 200) {
			var r = JSON.parse(this.responseText);

			if(typeof(r) == "object") {
				pri.threads.push(r);
			}
		}

		if(!--pri.sem) {
			//pri.sort_array();
			pri.display_threads();
		}
	}
};


pri.display_threads = function () {
	var output = "";

	for(var i in pri.threads) {

		var reg = new RegExp(" G", 'g');
		var date = ("" +new Date(+pri.threads[i].id)).split(reg)[0];

		var content = (pri.threads[i].thread[0]);

		if((pri.threads[i].thread[0]).match(/\[title\](.*)\[\/title\]/)) {
			var titre = (pri.threads[i].thread[0]).match(/\[title\](.*)\[\/title\]/).pop();
			content = content.replace(/\[title\](.*)\[\/title\]/, "");
		} else {
			var titre = "Titre non défini";
		}

		if((pri.threads[i].thread[0]).match(/\[author\](.*)\[\/author\]/)) {
			var auteur = (pri.threads[i].thread[0]).match(/\[author\](.*)\[\/author\]/).pop();
			content = content.replace(/\[author\](.*)\[\/author\]/, "");
		} else {
			var auteur = "Auteur non défini";
		}

		
		output += '<div id="thread'+i+'" class="col-xs-12" style="padding-right:0px;">' +  
				/*'<div class="hidden">'+pri.threads[i].id+'</div>'+*/
				'<div class="row accordion-toggle alert-active" data-toggle="collapse" data-target="#collapse'+i+'" style="margin:0px;">'+
					'<div class="col-xs-10" style="padding:10px; margin:0px;"><small>'+
						'<font color="#AAA">'+date+'</font><br/>' + 
						'<strong>'+titre+'</strong><br/>'+
						'<span style="margin:15px;">'+content+'</span><br/>'+
						'<font color="MediumBlue">'+auteur+'</font><br/>'+
					'</small></div>'+
					'<div class="col-xs-2" style="padding:10px;"><span class="badge">'+pri.threads[i].thread.length+'</span></div>'+
				'</div>' +
				'<hr/ style="margin:0px;">' +
				'<div class="row">'+
			'</div>' +
			'<div id="collapse'+i+'" class="col-xs-12 accordian-body collapse container-fluid" style="text-align:justify; margin:5px; padding-right:30px; padding-left:20px;" onmouseover="this.style.cursor=\'default\'">'+
				'<small>';

		if(pri.threads[i].thread.length <= 3) {
			for(var j in pri.threads[i].thread) {

				content = (pri.threads[i].thread[j]);

				if((pri.threads[i].thread[j]).match(/\[title\](.*)\[\/title\]/)) {
					titre = (pri.threads[i].thread[j]).match(/\[title\](.*)\[\/title\]/).pop();
					content = content.replace(/\[title\](.*)\[\/title\]/, "");
				} else {
					titre = "Titre non défini";
				}

				if((pri.threads[i].thread[j]).match(/\[author\](.*)\[\/author\]/)) {
					auteur = (pri.threads[i].thread[j]).match(/\[author\](.*)\[\/author\]/).pop();
					content = content.replace(/\[author\](.*)\[\/author\]/, "");
				} else {
					auteur = "Auteur non défini";
				}

				output += '<strong>'+titre+'</strong><br/>'+
					'<span style="margin:15px;">'+content+'</span><br/>'+
					'<font color="MediumBlue">'+auteur+'</font><br/><br/>';
			}
		} else {
			for(var j = 0; j < 3; j++) {

				var content = (pri.threads[i].thread[j]);

				if((pri.threads[i].thread[j]).match(/\[title\](.*)\[\/title\]/)) {
					titre = (pri.threads[i].thread[j]).match(/\[title\](.*)\[\/title\]/).pop();
					content = content.replace(/\[title\](.*)\[\/title\]/, "");
				} else {
					titre = "Titre non défini";
				}

				if((pri.threads[i].thread[j]).match(/\[author\](.*)\[\/author\]/)) {
					auteur = (pri.threads[i].thread[j]).match(/\[author\](.*)\[\/author\]/).pop();
					content = content.replace(/\[author\](.*)\[\/author\]/, "");
				} else {
					auteur = "Auteur non défini";
				}

				output += '<strong>'+titre+'</strong><br/>'+
					'<span style="margin:15px;">'+content+'</span><br/>'+
					'<font color="MediumBlue">'+auteur+'</font><br/><br/>';
			}
			output += "...<br/>";
		}

		output += '<span onmouseover="this.style.cursor=\'pointer\'"><font color="Orchid">Participer</font></span>'+
				'</small>'+
				'<hr/ style="margin-top:6px; margin-bottom:-5px;">' +
			'</div>'+
				'</div>';
	}
			
	output += 		'<div class="hidden" id="thread_fin" class="col-xs-12" style="margin:10px;" onmouseover="this.style.cursor=\'default\'">' +
					'<div style="margin:0px;">'+
						'<div class="col-xs-12" style="padding:0px; margin-top:10px; margin-right:10px;"><small>Aucun thread</small></div>' +
					'</div>' +
				'</div>' +
			'</div>';
			
	document.getElementById('threads').innerHTML = output;
};


window.onload = function () {
    setTimeout(pri.init, 1);
};
