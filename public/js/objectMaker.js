// デザインパターンのfactory
// 親オブジェクトで共通クラスを定義し、また親オブジェトが子オブジェクトを生成する
// 子オブジェクトはfactoryメソッドで固有の処理を生成し返す
function ObjectMaker() {};

ObjectMaker.prototype.setStatus = function(status) {this.status = status};
ObjectMaker.prototype.getStatus = function(status) {return this.status};
ObjectMaker.prototype.getObject = function(status) {return this.raphaelObject};
ObjectMaker.prototype.setType   = function(status) {return this.type};
ObjectMaker.prototype.getType   = function(status) {return this.type};
ObjectMaker.prototype.getId     = function(status) {return this.id};

// 以下の仲介役
ObjectMediator = function() {};
ObjectMediator.prototype.setUp           = function() {};
ObjectMediator.prototype.setSocket       = function() {};
ObjectMediator.prototype.onCreateRequest = function() {};
ObjectMediator.prototype.onCreate        = function() {};
ObjectMediator.prototype.onEditRequest   = function() {};
ObjectMediator.prototype.onEdit          = function() {};


ObjectMediator.prototype.setUp  = function() {
   var collection = new ObjectCollection();
       socket     = new io.Socket('motoki.local',{port:8000}),
       raphael    = Raphael(document.getElementById('svg_campus'), 500, 500);

     socket.connect().on('message', function(msg)
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
    if (type == OBJECT_TYPE.CIRCLE) {
      var objectName = 'Circle';
    }
    collection.add(ObjectMaker.factory(objectName, raphael, id)); 
};

// mediator.updateObject(id, type)
var  updateObject  = function(id, param)
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

// 以下の仲介役
ObjectCollection = function(){this.objects = [];};
ObjectCollection.prototype.add  = function(object) {this.objects.push(object)};
ObjectCollection.prototype.find = function(id) {
    for (var i in this.objects) {
        if (id ==  this.objects[i].id) {
            return this.objects[i];
        }
    }
    throw 'object not found id:' + id;
};

// ObjectCollection.prototype.setObjectCollection  = function(objectCollection){this.objectCollection = objectCollection};
// ObjectMediator.prototype.setObjectManager = function(){this.objectManager = objectManager};
// ObjectMediator.prototype.setNavigation    = function(){this.navigation = navigation};


// dragstartの時
// socket.send({'action': ACTION_TYPE.REQUEST_LOCK, 'id': this.parent.getId()});
// dragEndの時
    //var attr = {
    //  "cx" : this.attr('cx'),
    //  "cy" : this.attr('cy')};
    //socket.send({"action": ACTION_TYPE.REQUEST_EDIT,
    //    "id"    : this.parent.getId(),
    //    "attr"  : attr});
// createボタンの時
// socket.send({"action":ACTION_TYPE.REQUEST_CREATE,
//             "type"  :$('#object_type').val()});

//ObjectMaker.factory = function (type)
ObjectMaker.factory = function (type, raphael, id)
{
  if (typeof ObjectMaker[type] !== 'function'){
    throw type + ' not found';
  }

  // 一度だけ親のプロトタイプを生成
  if (!ObjectMaker[type].prototype.getStatus !== 'function') {
    ObjectMaker[type].prototype = new ObjectMaker();
  }

  var newObject = new ObjectMaker[type](raphael);

  // 全Objectで共通の処理
  newObject.id        = id;
  newObject.object.id = id; // drag処理のためのID
  newObject.object.parent = newObject; // dragだとraphaelがthisになるので対策
  newObject.status = OBJECT_STATUS.NONE;

  return newObject;
}

// 個別のコード
ObjectMaker.Circle = function (raphael){
  this.type = OBJECT_TYPE.CIRCLE;
  this.object = raphael.circle(x=50, y=50, r=40)
    .attr({'gradient':'270-#9ACD32-#FFFF00'})

    var onCircleDragStart = function(x, y, event)
    {
      if (this.parent.getStatus() == OBJECT_STATUS.LOCK){
        log('object is locked');
        return;
      }
      socket.send({'action': ACTION_TYPE.REQUEST_LOCK, 'id': this.parent.getId()});
      this.ox = this.attr("cx");
      this.oy = this.attr("cy");
      this.attr({opacity:'0.4'});

    };
  var onCircleDrag = function(x, y){
    if (this.parent.getStatus() == OBJECT_STATUS.LOCK){
      return;
    }
    this.attr({"cx":this.ox + x, "cy":this.oy + y})
  };


  var onCircleDragEnd = function(event)
  {
    if (this.parent.getStatus() == OBJECT_STATUS.LOCK){
      log('object is locked');
      return;
    }

    var attr = {
      "cx" : this.attr('cx'),
      "cy" : this.attr('cy')};

    socket.send({"action": ACTION_TYPE.REQUEST_EDIT,
        "id"    : this.parent.getId(),
        "attr"  : attr});

    this.attr({opacity:'1.0'});
  }

  this.object.drag(onCircleDrag, onCircleDragStart, onCircleDragEnd);
}

ObjectMaker.Path = function (raphael){
  this.type = OBJECT_TYPE.PATH;
  // this.object = raphael.path("M00 00 L" + circle.attr("cx") + " " + circle.attr("cy"))
  this.object = raphael.path("M00 00 L50 100")
      .attr({"stroke":"darkred", "stroke-width":2})
}

