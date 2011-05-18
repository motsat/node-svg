// デザインパターンのfactory
// 親オブジェクトで共通クラスを定義し、また親オブジェトが子オブジェクトを生成する
// 子オブジェクトはfactoryメソッドで固有の処理を生成し返す
function ObjectMaker() {};

ObjectMaker.prototype.setMediator = function(mediator) {this.mediator = mediator};
ObjectMaker.prototype.setStatus   = function(status) {this.status = status};
ObjectMaker.prototype.getStatus   = function(status) {return this.status};
ObjectMaker.prototype.getObject   = function(status) {return this.raphaelObject};
ObjectMaker.prototype.setType     = function(status) {return this.type};
ObjectMaker.prototype.getType     = function(status) {return this.type};
ObjectMaker.prototype.getId       = function(status) {return this.id};

ObjectMaker.factory = function (type, raphael, id, factory)
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
  newObject.status        = OBJECT_STATUS.NONE;
  newObject.id            = id;
  newObject.object.id     = id; // drag処理のためのID
  newObject.object.parent = newObject; // dragだとraphaelがthisになるので対策
  newObject.object.mediator = mediator;

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
      this.ox = this.attr("cx");
      this.oy = this.attr("cy");
      this.attr({opacity:'0.4'});
      this.mediator.onObjectDragStart(this.id);
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

    var attr = {"cx" : this.attr('cx'),
                "cy" : this.attr('cy')};

    this.mediator.onObjectDragEnd(this.id, attr);

    this.attr({opacity:'1.0'});
  }
  this.object.drag(onCircleDrag, onCircleDragStart, onCircleDragEnd);
}

ObjectMaker.Path = function (raphael){
  this.type = OBJECT_TYPE.PATH;
  this.object = raphael.path("M00 00 L50 100")
      .attr({"stroke":"darkred", "stroke-width":2})
  var onCircleDragStart = function(event){
      log(' path drag start');
  }
  var onCircleDrag      = function(event){
      log(' path drag');
  }
  var onCircleDragEnd   = function(event){
      log(' path drag end');
  }
  this.object.drag(onCircleDrag, onCircleDragStart, onCircleDragEnd);
}

