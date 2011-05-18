// 以下の仲介役
ObjectMediator = function() {};
ObjectMediator.prototype.setUp           = function() {};
ObjectMediator.prototype.onObjectDragStart = function(id){
    socket.send({'action': ACTION_TYPE.REQUEST_LOCK, 'id': id})
};
ObjectMediator.prototype.onObjectDragEnd = function(id, attr){
    socket.send({"action": ACTION_TYPE.REQUEST_EDIT,
                 "id"    : id,
                 "attr"  : attr});
};

ObjectMediator.prototype.setUp  = function() {
   var collection = new ObjectCollection();
       socket     = new io.Socket('motoki.local',{port:8000}),
       raphael    = Raphael(document.getElementById('svg_campus'), 500, 500);

     socket.connect();
     socket.on('message', function(msg)
     {
       switch (msg.action) {
         case ACTION_TYPE.CREATE:
           createObject(msg.id, msg.type);
           break;
         case ACTION_TYPE.LOCK:
           updateObject(msg.id, {'status':OBJECT_STATUS.LOCK});
           break;
         case ACTION_TYPE.EDIT:
           updateObject(msg.id, {'status':OBJECT_STATUS.NONE, 'attr':msg.attr});
           break;
       }
     });

     $('#creae_button').bind('click', function() {
         socket.send({"action":ACTION_TYPE.REQUEST_CREATE,
           "type"  :$('#object_type').val()});
         });

// mediator.crateObject(id, type)
var createObject = function (id, type)
{
    var objectName;
    switch (type) {
      case  OBJECT_TYPE.CIRCLE:
        objectName = 'Circle';
        break;
      case  OBJECT_TYPE.PATH:
        objectName = 'Path';
        break;
      default:
        throw('unknown type ' + type);
        break;
    }
    collection.add(ObjectMaker.factory(objectName, raphael, id, mediator)); 
};

// mediator.updateObject(id, type)
var updateObject = function(id, param)
{
    var obj = collection.find(id);
    if (param.status != '') {
        obj.setStatus(param.status);
    }
    if (typeof param.attr == 'object'){
        obj.object.animate(param.attr, 300);
    }
}
};

