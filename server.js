var io            = require('socket.io'),
    express       = require('express'),
    messages      = [],
    messageType   = {'GET_DATA' : 0, 'STRING' : 1} ;    // GET=取得要求、 STRING=チャットメッセージ


var app = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.set("view options", { layout: false });
  app.get('/', function(req, res) {
    res.render('index.ejs');
    });
});

app.listen(8000);

var socket = io.listen(app);
socket.on('connection', function(client){
  client.on('message',    function(msg) {onMessage(msg, client);});
  client.on('disconnect', function()    {onDisconnect(client)});
});

function addMessage(msg)
{
  msg.id        = messages.length + 1;
  msg.createdAt = getNowDate();
  if (msg.option.color == '') {
    msg.option.color = 'black';
  }
  messages.push(msg);

  return msg;
}


function onDisconnect(client)
{
  msg  = {"data"      : client. sessionId+"が切断されました",
          "type"      : messageType.STGING,
          "option"    : {"color" : "red"},
          "createdAt" : getNowDate()} ;
  socket.broadcast(msg);
}

function onMessage(msg, client)
{
  if (msg.type == messageType.GET_DATA) {
    if (typeof msg.more_id == 'number') {
      client.send(messages.slice(msg.more_id));
    }
  } else {
    addMessage(msg);
    client.send(msg);
    client.broadcast(msg);
  }
}

function getNowDate(){
  d = new Date();
  return  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()+ " "+ d.getHours()+':' +d.getMinutes()+':' + d.getSeconds();
}
//}}}
