// デザインパターンのfactory
// 親オブジェクトで共通クラスを定義し、また親オブジェトが子オブジェクトを生成する
// 子オブジェクトはfactoryメソッドで固有の処理を生成し返す
function ObjectMaker() {};
// property
//      type, status, id, attr, raphaelObject
// method
//      get(set)Status
//      isLocked ?
//      getObject(Raphael) // attr系はRaphaelオブジェクトに
ObjectMaker.prototype.setStatus = function(status) {this.status = status};
ObjectMaker.prototype.getStatus = function(status) {return this.status};
ObjectMaker.prototype.getObject = function(status) {return this.raphaelObject};
ObjectMaker.prototype.setType   = function(status) {return this.type};
ObjectMaker.prototype.getType   = function(status) {return this.type};

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
  newObject.status    = OBJECT_STATUS.NONE;

  return newObject;
}

// 個別のコード
ObjectMaker.Circle = function (raphael){
  this.type = OBJECT_TYPE.CIRCLE;
  var onCircleDrag = function(x, y){
    if (isObjectLocked(this.id)) {
      log('object locked');
      return;
    }
    this.attr({"cx":this.ox + x, "cy":this.oy + y})
  }

  this.object = raphael.circle(x=50, y=50, r=40)
      .attr({'gradient':'270-#9ACD32-#FFFF00'})
      .drag(onCircleDrag, onCircleDragStart, onCircleDragEnd);

}
ObjectMaker.Path = function (raphael){
    //this.object = raphael.path("M00 00 L" + circle.attr("cx") + " " + circle.attr("cy"))
  this.object = raphael.path("M00 00 L50 100")
      .attr({"stroke":"darkred", "stroke-width":2})
}
function onCircleDrag(x, y)
{
    if (isObjectLocked(this.id)) {
        log('object locked');
        return;
    }
    this.attr({"cx":this.ox + x, "cy":this.oy + y})
}
