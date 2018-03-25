var Aru = {}
Aru.serverName = "";
Aru.currentChannel = "";
Aru.popper = null;

Aru.hideIpNick = function() {
	//get our elements to do the stuff to
	var diag = document.getElementById("ip-nick");
	var bg = document.getElementById("blurfilter");
	//this will have a shrinking effect
	if(!diag.classList.contains('hide')) {
		diag.classList.add('hide');
	}
	//this will fade and unblur
	if(!bg.classList.contains('trasparent')) {
		bg.classList.add('transparent');
	}
	//hide after the animation is complete
	setTimeout(function(){
		bg.classList.add('hidden');
		diag.classList.add('hidden');
	}, 100);
	beginConnection();
}

Aru.addUser = function(name, disc, avatar, id, status, color) { //Are we gonna use color?
	color = color || "#E7E7E9"; //color if we use it
	//make our elements and add a nice attribute to them to find them later
	var div = document.createElement("DIV");
	var img = document.createElement("DIV");
	var badge = document.createElement("DIV");
	var span = document.createElement("SPAN");
	var onclick = document.createAttribute("onClick");
	onclick.value = "Aru.showUserPopper(" + id.toString() + ");";
	div.classList.add("chat-online-username");
	img.classList.add("avatar-small");
	div.setAttributeNode(onclick);
	badge.className = "status " + status;
	img.style.backgroundImage = "url(" + avatar + ")";
	img.id = "img-" + id.toString();
	div.id = "user-" + id.toString();
	span.id = "name-" + id.toString();
	span.innerHTML = name + '<span class="chat-online-typing">#' + disc + '</span>';
	div.style.color = color;
	var hr = document.createElement("HR");
	div.setAttribute("u", name);
	hr.setAttribute("u", name);
	img.appendChild(badge);
	div.appendChild(img);
	div.appendChild(span)
	div.appendChild(hr)
	var userlist = document.getElementById("online");
	userlist.appendChild(div)
}

Aru.generateUserInfo = function(avatar, name) {
	var uname = document.getElementById('app-user-name');
	var avatarcontainer = document.getElementById('app-user-avatar');
	uname.innerHTML = name;
	avatarcontainer.style.backgroundImage = "url(" + avatar + ")";
}

Aru.updateUserPresence = function(presence, id) {
	if (document.getElementById("presence-" + id) == undefined) {
		var div = document.createElement("div");
		var userblock = document.getElementById("user-" + id);

		div.id = "presence-" + id;
		div.className = "user-presence";
		if (presence["type"] == "rich") {
			div.innerHTML = 'In <span style="font-weight: 700">' + presence["name"] + "</span> ⌨";
			var presence_attrib = document.createAttribute("data-rpc");
			presence_attrib.value = JSON.stringify(presence["rich"]);
			div.setAttributeNode(presence_attrib); 
		} else {
			div.innerHTML = 'In <span style="font-weight: 700">' + presence["name"] + "</span>"; 
		}
		userblock.insertBefore(div, userblock.lastChild);
	} else {
		if (presence["method"] == "update") {
			document.getElementById("presence-" + id).innerHTML = "In " + presence["name"];
		} else {
			document.getElementById("presence-" + id).remove();
		}
	}
}

Aru.showUserPopper = function(id) {
	var popper = document.getElementById("popper");
	var reference = document.getElementById("user-" + id.toString());

	var context = {
		avatar: "",
		name: "",
		status: "",
		inapp: false,
		role_info: "NO ROLES"
	}

	if (Aru.popper != null) {
		popper.innerHTML = "";
		popper.style.display = "none";
		popper.className = "";
		Aru.popper.destroy();
	}
	
	context["avatar"] = document.getElementById("img-" + id.toString()).style.backgroundImage;
	context["name"] = document.getElementById("name-" + id.toString()).innerHTML;
	context["status"] = document.getElementById("img-" + id.toString()).firstChild.className;

	if (document.getElementById("presence-" + id) != undefined) {
		var presence_info = document.getElementById("presence-" + id);
		context["inapp"] = true;
		if (presence_info.getAttribute("data-rpc") != undefined) {
			var parsed = JSON.parse(presence_info.getAttribute("data-rpc"));
			context["appname"] = "APPLICATION";
			context["rich"] = true;
			context["rich-img"] = parsed["icon"];
			context["rich-title"] = parsed["title"];
			context["rich-desc"] = parsed["desc"];
		} else {
			context["appname"] = presence_info.children[0].innerHTML;
		}
	}

	if (true) { //TODO
		context["role_info"] = "NO ROLES";
		context["roles"] = [];
	}

	popper.style.display = "block";
	popper.className = "move";
	var source = document.getElementById("tmpl-popper").innerHTML;
	var template = Handlebars.compile(source);
	popper.innerHTML += template(context);
	Aru.popper = new Popper(reference, popper, {placement: 'left'});
}

Aru.addMessage = function(name, msg, color, channel, avatar_src, embed, id) {
	color = color || "#E7E7E9"; //color if we use it
	id = id || "";

	var date = new Date();
	var humandate = (date.getHours()<10?'0':'') + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();

	var context = {
		avatar: avatar_src,
		id: id,
		nick: name,
		color: color,
		time: humandate,
		additional: "",
		message: "",
		embed: ""
	}

	var embedblock = Aru.createEmbed(embed);
	var divblock = document.getElementById(channel);
	var shouldScroll = ((divblock.scrollTop + divblock.clientHeight + 50) > divblock.scrollHeight);

	var pings = msg.match(/@![0-9]*/g);
	if (pings != null) {
		for (var i = 0; i < pings.length; i++) {
			var pinged = pings[i].replace("@!", "");
			try {
				var name = document.getElementById("name-" + pinged).firstChild.data;
			} catch (e) {
				var name = "invalid-user";
			}
			msg = msg.replace(pings[i], '<a href="#">@' + name + "</a>");
			if (pinged == userInfo["id"]) {
				context["additional"] = 'class="pinged"';
			}
		}
	}

	var m = msg.split("\n");
	m.pop();

	if (m.length > 1) {
		context["message"] += m.join("<br>");
	} else {
		context["message"] += msg;
	}

	if(embedblock != "") {
		context["embed"] = embedblock;
	}

	var source = document.getElementById("tmpl-message").innerHTML;
	var template = Handlebars.compile(source);
	divblock.innerHTML += template(context);

	if (channel != Aru.currentChannel) {
		var selector = document.getElementById("channel-" + channel);
		selector.className = "channel-new-unread";
	}

	if (shouldScroll)
		divblock.scrollTop = divblock.scrollHeight - divblock.clientHeight;
}

Aru.addChannel = function(name, main) {
	var container = document.getElementById("channel-container");
	var namecontainer = document.getElementById("channels");
	var channel = document.createElement("DIV");
	var namechannel = document.createElement("span");
	var att = document.createAttribute("selected");
	var id = document.createAttribute("id");
	var selectid = document.createAttribute("id");
	var onclick = document.createAttribute("onClick");
	if(main == true) {
		Aru.currentChannel = name;
		Aru.mainChannel = name;
		att.value = "true";
		channel.classList.add("chat-container");
		Aru.setTitle(userInfo["name"], Aru.mainChannel, 0);
	} else {
		att.value = "false";
		channel.classList.add("chat-container-invisible");
	}
	id.value = name;
	onclick.value = "Aru.changeChannel(this);";
	selectid.value = "channel-" + name;
	namechannel.classList.add("chat-channel");
	namechannel.setAttributeNode(att);
	namechannel.setAttributeNode(selectid);
	namechannel.setAttributeNode(onclick);
	channel.setAttributeNode(id);
	namechannel.appendChild(document.createTextNode("#" + name + " "));
	container.appendChild(channel);
	namecontainer.appendChild(namechannel);
}

Aru.removeChannel = function(name) {
	document.getElementById(name).remove();
	document.getElementById("channel-" + name).remove();
}

Aru.deleteUsers = function() {
	var node = document.getElementById("online");
	while (node.hasChildNodes()) {
    	node.removeChild(node.lastChild);
	}
}

Aru.changeChannel = function(el) {
	Aru.currentChannel = el.getAttribute("id").replace("channel-", "");
	var changed = document.getElementById(el.getAttribute("id").replace("channel-", ""));
	var current = document.querySelector(".chat-container");
	var input = document.getElementById("chat-input");
	document.querySelector("span[selected=true]").setAttribute("selected", "false");
	current.classList.add("chat-container-invisible");
	current.classList.remove("chat-container");
	changed.classList.add("chat-container");
	changed.classList.remove("chat-container-invisible");
	input.setAttribute("placeholder", "Message #"+el.getAttribute("id").replace("channel-", ""));
	el.className = "chat-channel";
	el.setAttribute("selected", "true");
	Aru.setTitle(userInfo["name"], Aru.currentChannel);
}

Aru.removeTyping = function(id) {
	for (var i = 0; i < currentlyTyping.length; i++) {
		if (currentlyTyping[i]["id"] == id) {
			currentlyTyping.splice(i, 1);
		}
	}
	Aru.updateTyping();
}

Aru.updateTyping = function () {
	var block = document.getElementById('istyping');
	var length = currentlyTyping.length;

	if (length > 3) {
		block.innerHTML = '<span style="font-weight: 700;">Several people</span> are typing...';
	} else if (length == 3) {
		block.innerHTML = '<span style="font-weight: 700;">' + currentlyTyping[0]["name"] + "</span>, " + '<span style="font-weight: 700;">' + currentlyTyping[1]["name"] + "</span> and " + '<span style="font-weight: 700;">' + currentlyTyping[2]["name"] + "</span> are typing...";
	} else if (length == 2) {
		block.innerHTML = '<span style="font-weight: 700;">' + currentlyTyping[0]["name"] + "</span> and " + '<span style="font-weight: 700;">' + currentlyTyping[1]["name"] + "</span> are typing...";
	} else if (length == 1) {
		block.innerHTML = '<span style="font-weight: 700;">' + currentlyTyping[0]["name"] + "</span> is typing...";
	} else {
		block.innerHTML = "";
	}
}

Aru.setTitle = function(name, channel, unread) {
	if(unread == 0) {
		document.title = name + " | #" + channel + " - Aru";
	} else {
		document.title = "(" + unread.toString() + ") " + name + " | #" + channel + " - Aru";
	}
}

Aru.createEmbed = function(embed) {
	try {
		if(embed == "") {
			return "";
		}
		var oembed = JSON.parse(embed);
		console.log(oembed);
		if(oembed["error"] != undefined) {
			return "";
		}

		var context = {
			color: "",
			title: "",
			body: "",
			html: ""
		}

		if (oembed["color"] == undefined) {
			context["color"] = "#4C4C66";
		} else {
			context["color"] = oembed["color"];
		}

		if (oembed["type"] == "video") {
			context["title"] = oembed["author_name"] || oembed["title"] || "";
			context["body"] = oembed["title"];
			context["html"] = oembed["html"];

		} else if (oembed["type"] == "rich") {
			if(oembed["html"] != undefined) {
				context["html"] = oembed["html"];
			} else {
				context["html"] = oembed["thumbnail_url"];
			}

			context["title"] = oembed["title"] || oembed["author_name"] || "";

			if(oembed["description"] != undefined) {
				var m = oembed["description"].split("\n");
				if (m.length > 1) {
					context["body"] += m.join("<br>");
				} else {
					context["body"] += m;
				}
			} else {
				context["body"] = "";
			}
		}
		var source = document.getElementById("tmpl-embed").innerHTML;
		var template = Handlebars.compile(source);

		return template(context);

	} catch(e) {
		console.log(e);
		return "";
	}
}

Aru.addPing = function(id) {
	document.getElementById("chat-input").value += "@!" + id + " ";
}