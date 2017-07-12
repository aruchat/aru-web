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

Aru.login = function() {
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

Aru.removeUser = function(name) {
	//query our custom attribute
	var div = document.querySelector("div.chat-online-username[u="+name+"]")[0];
	var hr = document.querySelector("hr[u="+name+"]")[0];
	var userlist = document.getElementById("online");
	//remove
	userlist.removeChild(div);
	userlist.removeChild(hr);
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
	time.appendChild(document.createTextNode("Today at "+date.getHours()+":"+date.getMinutes()));
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
	att.value = "false";
	namechannel.classList.add("chat-channel");
	namechannel.setAttributeNode(att)
	channel.classList.add("chat-container-invisible");
	container.appendChild(channel);
	namecontainer.appendChild(namechannel);
}
