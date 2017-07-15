/*
                                                                     /$$
                                                                    | $$
 /$$   /$$  /$$$$$$$  /$$$$$$         /$$$$$$   /$$$$$$   /$$$$$$$ /$$$$$$
| $$  | $$ /$$_____/ /$$__  $$       /$$__  $$ /$$__  $$ /$$_____/|_  $$_/
| $$  | $$|  $$$$$$ | $$$$$$$$      | $$  \ $$| $$  \ $$|  $$$$$$   | $$
| $$  | $$ \____  $$| $$_____/      | $$  | $$| $$  | $$ \____  $$  | $$ /$$
|  $$$$$$/ /$$$$$$$/|  $$$$$$$      | $$$$$$$/|  $$$$$$/ /$$$$$$$/  |  $$$$/
 \______/ |_______/  \_______/      | $$____/  \______/ |_______/    \___/
                                    | $$
                                    | $$
                                    |__/
                                                               /$$
                                                              | $$
  /$$$$$$   /$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$$ /$$$$$$   /$$$$$$$
 /$$__  $$ /$$__  $$ /$$__  $$| $$  | $$ /$$__  $$ /$$_____/|_  $$_/  /$$_____/
| $$  \__/| $$$$$$$$| $$  \ $$| $$  | $$| $$$$$$$$|  $$$$$$   | $$   |  $$$$$$
| $$      | $$_____/| $$  | $$| $$  | $$| $$_____/ \____  $$  | $$ /$$\____  $$
| $$      |  $$$$$$$|  $$$$$$$|  $$$$$$/|  $$$$$$$ /$$$$$$$/  |  $$$$//$$$$$$$/
|__/       \_______/ \____  $$ \______/  \_______/|_______/    \___/ |_______/
                          | $$
                          | $$
                          |__/
                              /$$                 /$$
                             | $$                | $$
  /$$$$$$   /$$$$$$$ /$$$$$$$| $$$$$$$   /$$$$$$ | $$  /$$$$$$
 |____  $$ /$$_____//$$_____/| $$__  $$ /$$__  $$| $$ /$$__  $$
  /$$$$$$$|  $$$$$$|  $$$$$$ | $$  \ $$| $$  \ $$| $$| $$$$$$$$
 /$$__  $$ \____  $$\____  $$| $$  | $$| $$  | $$| $$| $$_____/
|  $$$$$$$ /$$$$$$$//$$$$$$$/| $$  | $$|  $$$$$$/| $$|  $$$$$$$
 \_______/|_______/|_______/ |__/  |__/ \______/ |__/ \_______/
*/
//it isn't that hard
var Aru = {}

Aru.postMessage = function() {
	//TODO your code here
}

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
	}, 100)
}

Aru.addUser = function(name, color) { //Are we gonna use color?
	color = color || "#E7E7E9"; //color if we use it
	//make our elements and add a nice attribute to them to find them later
	var div = document.createElement("DIV");
	div.classList.add("chat-online-username");
	div.style.color = color;
	div.appendChild(document.createTextNode(name))
	var hr = document.createElement("HR");
	div.setAttribute("u", name);
	hr.setAttribute("u", name);
	var userlist = document.getElementById("online");
	userlist.appendChild(div)
	userlist.appendChild(hr)
}

Aru.addMessage = function(name, msg, color, channel) {
	color = color || "#E7E7E9"; //color if we use it
	var div = document.createElement("DIV");
	var span = document.createElement("SPAN");
	var time = document.createElement("SPAN");
	var divblock = document.getElementById(channel);
	var shouldScroll = ((divblock.scrollTop + divblock.clientHeight + 50) > divblock.scrollHeight);
	var date = new Date();
	div.classList.add("chat-message");
	span.classList.add("chat-msg-username");
	time.classList.add("chat-msg-time");
	span.appendChild(document.createTextNode(name));
	span.style.color = color;
	time.appendChild(document.createTextNode("Today at " + (date.getHours()<10?'0':'') + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()));
	div.appendChild(span);
	div.appendChild(time);
	div.appendChild(document.createElement("BR"));
	div.appendChild(document.createTextNode(msg));
	divblock.appendChild(div);
	divblock.appendChild(document.createElement("HR"));
	if (shouldScroll)
		divblock.scrollTop = divblock.scrollHeight - divblock.clientHeight;
}

Aru.addChannel = function(name) {
	var container = document.getElementById("channel-container");
	var namecontainer = document.getElementById("channels");
	var channel = document.createElement("DIV");
	var namechannel = document.createElement("span");
	var att = document.createAttribute("selected");
	var id = document.createAttribute("id");
	var selectid = document.createAttribute("id");
	var onclick = document.createAttribute("onClick");
	att.value = "false";
	id.value = name;
	onclick.value = "Aru.changeChannel(this);";
	selectid.value = "channel-" + name;
	namechannel.classList.add("chat-channel");
	namechannel.setAttributeNode(att);
	namechannel.setAttributeNode(selectid);
	namechannel.setAttributeNode(onclick);
	channel.setAttributeNode(id);
	namechannel.appendChild(document.createTextNode("#" + name + " "));
	channel.classList.add("chat-container-invisible");
	container.appendChild(channel);
	namecontainer.appendChild(namechannel);
}

Aru.deleteUsers = function() {
	var node = document.getElementById("online");
	while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
	}
}

Aru.changeChannel = function(el) {
	var changed = document.getElementById(el.getAttribute("id").replace("channel-", ""));
	var current = document.querySelector(".chat-container");
	var input = document.getElementById("chat-input");
	document.querySelector("span[selected=true]").setAttribute("selected", "false");
	current.classList.add("chat-container-invisible");
	current.classList.remove("chat-container");
	changed.classList.add("chat-container");
	changed.classList.remove("chat-container-invisible");
	input.setAttribute("placeholder", "Message #"+el.getAttribute("id").replace("channel-", ""));
	el.setAttribute("selected", "true");
}
