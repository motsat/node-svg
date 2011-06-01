// デザインパターンのfactory
// 親オブジェクトで共通クラスを定義し、また親オブジェトが子オブジェクトを生成する
// 子オブジェクトはfactoryメソッドで固有の処理を生成し返す
function ObjectMaker() {};

ObjectMaker.prototype.setMediator = function(mediator) {this.mediator = mediator};
ObjectMaker.prototype.setStatus   = function(status) {this.status = status};
ObjectMaker.prototype.getStatus   = function(status) {return this.status};
ObjectMaker.prototype.isLocked    = function(status) {return this.getStatus() == OBJECT_STATUS.LOCK};
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

    var onDragStart = function(x, y, event)
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
  var onDrag = function(x, y){
    if (this.parent.isLocked()) {
      return;
    }
    this.attr({"cx":this.ox + x, "cy":this.oy + y})
  };


  var onDragEnd = function(event) {
    if (this.parent.isLocked()) {
      return;
    }

    var attr = {"cx" : this.attr('cx'),
                "cy" : this.attr('cy')};

    this.mediator.onObjectDragEnd(this.id, attr);

    this.attr({opacity:'1.0'});
  }
  this.object.drag(onDrag, onDragStart, onDragEnd);
}

ObjectMaker.Path = function (raphael){
  this.type = OBJECT_TYPE.PATH;
  this.object = raphael.path("M00 00 L50 100")
      .attr({"stroke":"darkred", "stroke-width":2});

      //raphael.path("M00 00 L50 100")
      //.attr({"stroke":"darkblue", "stroke-width":2})
      //.translate(0, 10); // x, y
// M=始点、L=終点？
  var onDragStart = function(event){
    if (this.parent.isLocked()) {
      return;
    }

    // this.ox = this.attr("cx");
    // this.oy = this.attr("cy");
    //   this.attr();
    //   fill: "none"
    //   path: Array[2]
    //   0: Array[3]
    //   1: Array[3]
    //   length: 2
    //   toString: function () {
    //   __proto__: Array[0]
    //   stroke: "darkred"
    //   stroke-width: 2

    this.opath = this.attr().path;


    this.attr({opacity:'0.4'});
    this.mediator.onObjectDragStart(this.id);
  }
  var onDrag = function(x, y){
    var opath = this.opath;

    // path[0][1] = opath[0][1] + x,
    // path[0][2] = opath[0][2] + y;
    // path[1][1] = opath[1][1] + x;
    // path[1][2] = opath[1][2] + y;
    //console.log(x,y);
    //console.log(this.translate(_x, _y));
    log(' path drag');
  }
  var onDragEnd = function(event){
    log(' path drag end');
  }
  this.object.drag(onDrag, onDragStart, onDragStart);
}
