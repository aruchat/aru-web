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

Aru.updateUserPresence = function(presence, id) {
	if (document.getElementById("presence-" + id) == undefined) {
		var div = document.createElement("div");
		var userblock = document.getElementById("user-" + id);

		div.id = "presence-" + id;
		div.className = "user-presence";
		div.innerHTML = "In " + presence["name"]; 

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
	var avatar = document.createElement("div");
	var name = document.createElement("div");
	var status = document.createElement("div");

	if (Aru.popper != null) {
		popper.innerHTML = "";
		popper.style.display = "none";
		Aru.popper.destroy();
	}
	
	avatar.id = "popper-avatar";
	avatar.style.backgroundImage = document.getElementById("img-" + id.toString()).style.backgroundImage;
	name.id = "popper-name";
	name.innerHTML = document.getElementById("name-" + id.toString()).innerHTML;
	status.id = "popper-status";
	status.className = document.getElementById("img-" + id.toString()).firstChild.className;
	avatar.appendChild(status);
	popper.appendChild(avatar);
	popper.appendChild(name);

	if (document.getElementById("presence-" + id) != undefined) {
		popper.appendChild(document.createElement("hr"));
		var presence = document.createElement("div");
		var info = document.createElement("div");
		info.id = "popper-presence-info";
		presence.id = "popper-presence-status";
		presence.innerHTML = document.getElementById("presence-" + id.toString()).innerHTML;
		info.appendChild(presence);
		popper.appendChild(info);
	}

	popper.style.display = "block";
	Aru.popper = new Popper(reference, popper, {placement: 'left'});
}

Aru.addMessage = function(name, msg, color, channel, avatar_src, embed) {
	color = color || "#E7E7E9"; //color if we use it
	var div = document.createElement("DIV");
	var span = document.createElement("SPAN");
	var time = document.createElement("SPAN");
	var avatar = document.createElement("DIV");
	var embedblock = Aru.createEmbed(embed);
	var divblock = document.getElementById(channel);
	var shouldScroll = ((divblock.scrollTop + divblock.clientHeight + 50) > divblock.scrollHeight);
	var date = new Date();
	div.classList.add("chat-message");
	span.classList.add("chat-msg-username");
	time.classList.add("chat-msg-time");
	avatar.classList.add("avatar");
	span.innerHTML = name + " ";
	span.style.color = color;
	time.appendChild(document.createTextNode("Today at " + (date.getHours()<10?'0':'') + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()));
	if (avatar_src == "") {

	} else {
		avatar.style.backgroundImage = "url(" + avatar_src + ")";
		divblock.appendChild(avatar);
	}
	div.appendChild(span);
	div.appendChild(time);
	div.appendChild(document.createElement("BR"));
	var m = msg.split("\n");
	m.pop();
	if (m.length > 1) {
		div.innerHTML += m.join("<br>");
	} else {
		div.innerHTML += msg;
	}
	divblock.appendChild(div);
	if(embedblock != "") {
		divblock.appendChild(embedblock);
	}
	var hr = document.createElement("HR");
	hr.classList.add("hr-placeholder");
	divblock.appendChild(hr);
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
		block.innerHTML = "Several people are typing...";
	} else if (length == 3) {
		block.innerHTML = currentlyTyping[0]["name"] + ", " + currentlyTyping[1]["name"] + " and " + currentlyTyping[2]["name"] + " are typing...";
	} else if (length == 2) {
		block.innerHTML = currentlyTyping[0]["name"] + " and " + currentlyTyping[1]["name"] + " are typing...";
	} else if (length == 1) {
		block.innerHTML = currentlyTyping[0]["name"] + " is typing...";
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
		var resultembed = document.createElement("div");
		resultembed.className = "embed";
		if (oembed["color"] == undefined) {
			resultembed.style.borderLeft = "5px solid #4C4C66";
		} else {
			resultembed.style.borderLeft = "5px solid " + oembed["color"];
		}

		if (oembed["type"] == "video") {
			var author = document.createElement("div");
			var subtitle = document.createElement("div");
			var video = document.createElement("div");
			author.className = "embed-title";
			subtitle.className = "embed-body";
			video.className = "embed-img";
			author.innerHTML = oembed["author_name"] || oembed["title"] || "";
			subtitle.innerHTML = oembed["title"];
			video.innerHTML = oembed["html"];
			resultembed.appendChild(author);
			resultembed.appendChild(subtitle);
			resultembed.appendChild(video);
		} else if (oembed["type"] == "rich") {
			var title = document.createElement("div");
			var desc = document.createElement("div");
			if(oembed["html"] != undefined) {
				var thumbnail = document.createElement("div");
				thumbnail.innerHTML = oembed["html"];
			} else {
				var thumbnail = document.createElement("img");
				thumbnail.src = oembed["thumbnail_url"];
			}
			title.className = "embed-title";
			desc.className = "embed-body";
			thumbnail.className = "embed-img";
			title.innerHTML = oembed["title"] || oembed["author_name"] || "";
			if(oembed["description"] != undefined) {
				var m = oembed["description"].split("\n");
				if (m.length > 1) {
					desc.innerHTML += m.join("<br>");
				} else {
					desc.innerHTML += m;
				}
			} else {
				desc.innerHTML = "";
			}
			resultembed.appendChild(title);
			resultembed.appendChild(desc);
			resultembed.appendChild(thumbnail);		
		}
		return resultembed;
	} catch(e) {
		console.log(e);
		return "";
	}
}