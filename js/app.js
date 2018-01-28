var ws = null;
var isFirstUserjoin = true;
function beginConnection() {
  ws = new WebSocket("ws://" + document.getElementById('ip').value + "/chat/" + document.getElementById('nick').value);
  ws.binaryType = "arraybuffer";

  ws.onopen = function() {
    document.getElementById('chat-status').innerHTML = "Connected to " + document.getElementById('ip').value;
    Aru.addChannel("general");
    var request = {"type": "req", "req": "userlist"};
    var request_framed = msgpack.encode(request);
    ws.send(request_framed);
  };

  ws.onmessage = function(msg) {
    var frame = msgpack.decode(new Uint8Array(msg.data));
    console.log(frame);
    if (frame["type"] == "client") {
      Aru.addMessage(frame["client"], frame["msg"], "#E7E7E9", "general", frame["avatar"]);
    } else if (frame["type"] == "update") {
      if (frame["update"] == "userlist") {
        var userlist = frame["users"];
        for(var i = 0; i < userlist.length; i++) {
          Aru.addUser(userlist[i]["name"], userlist[i]["avatar"], userlist[i]["id"], "#E7E7E9");
        }
      } else if (frame["update"] == "user-leave") {
        document.getElementById("online").removeChild(document.getElementById('user-' + frame["id"].toString()));
      } else if (frame["update"] == "user-join") {
        if (isFirstUserjoin) {
          isFirstUserjoin = false; // Workaround since first user-join event (you joining) is also sent to you
        } else {
          Aru.addUser(frame["name"], frame["avatar"], frame["id"], "#E7E7E9");
        }
      } else if (frame["update"] == "user-avatar") {
        document.getElementById("img-" + frame["id"].toString()).src = frame["avatar"];
      }
    } else {
      Aru.addMessage("SERVER", frame["msg"], "#ED145B", "general", "");
    }
  };

  document.onkeypress = function(event) {
    if (event.which == 13 || event.keyCode == 13) {
      sendMessage();
    }
    return true;
  };
}

function sendMessage() {
  var input = document.getElementById('chat-input');
  var payload = {"type": "msg", "msg": input.value, "markdown": true};
  var framed = msgpack.encode(payload);
  ws.send(framed);
  input.value = '';
}