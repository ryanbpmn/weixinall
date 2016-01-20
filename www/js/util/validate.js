/**
 * Created by Administrator on 2015/12/2.
 */
var validator = {};
validator.isBlankObject = function(obj){
  for(pro in obj) {
    return false;
  }
  return true;
}
validator.length = function(obj){
  if(angular.isArray(obj)) {
    return obj.length;
  }
  if(angular.isString(obj)) {
    return obj.length;
  }
  if(angular.isObject(obj) || angular.isUndefined(obj)){
    return false;
  }
}
