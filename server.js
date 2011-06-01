var io            = require('socket.io'),
    express       = require('express'),
    objects      =  [],
    ACTION_TYPE   = {'REQUEST_CREATE' : 'REQUEST_CREATE',  // クライアントからの作成要求
                     'CREATE'         : 'CREATE'        ,  // クラインとへの作成指示（REQUEST_CREATE後)
                     'REQUEST_LOCK'   : 'REQUEST_LOCK'  ,  // サーバへのロック要求
                     'LOCK'           : 'LOCK'          ,  // クラインとへのロック指示(REQUEST_EDIT)要求クライアント以外に送るもの
                     'REQUEST_EDIT'   : 'REQUEST_EDIT'  ,  // サーバへの編集要求
                     'EDIT'           : 'EDIT'             // クライントへの編集指示（REQUEST_EDIT後)
                    };

var app = express.createServer();
app.configure(function(){
    app.set('views', __dirname + '/views')
       .use(express.static(__dirname + '/public'))
       .set("view options", { layout: false })
       .get('/', function(req, res) {
         res.render('svg.ejs');
       });
});

app.listen(8000);

var socket = io.listen(app);
socket.on('connection', function(client){
  client.on('message', function(msg) {onMessage(msg, client);});
  client.on('disconnect', function() {onDisconnect(client)});
});

function addMessage(msg)
{
  msg.id        = objects.length + 1;
  msg.createdAt = nowDate();
  if (msg.option.color == '') {
    msg.option.color = 'black';
  }
  objects.push(msg);

  return msg;
}


function onDisconnect(client)
{
  msg  = {"data"      : client. sessionId+"が切断されました",
          "type"      : ACTION_TYPE.STGING,
          "option"    : {"color" : "red"},
          "createdAt" : nowDate()} ;
}

function onMessage(msg, client)
{
  console.log(msg);
  /* サーバ側のオブジェクトのstatus、attrかえる処理未実装 */
  switch (msg.action) {
  case ACTION_TYPE.REQUEST_CREATE:
    var obj = {"id"       : objects.length + 1,
               "action"   : ACTION_TYPE.CREATE,
               "type"     : msg.type,
               "status"   : '',
               "clientId" : client. sessionId};
    objects.push(obj);
    client.send(obj);
    break;
  case ACTION_TYPE.REQUEST_LOCK:
    // fix me
    var obj = {"action" : ACTION_TYPE.LOCK,
               "id"     : msg.id};
    break;
  case ACTION_TYPE.REQUEST_EDIT:
    var obj = {"action": ACTION_TYPE.EDIT,
               "attr"  : msg.attr,
               "id"    : msg.id};
    break;
  }
  client.broadcast(obj);
}
function nowDate(){
  d = new Date();
  return  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()+ " "+ d.getHours()+':' +d.getMinutes()+':' + d.getSeconds();
}
//}}}
