/**
 * Created by Administrator on 2015/12/2.
 */
var util = {};
util.reg = {
  mobile:/^1\d{10}$/
}
util.checkMobile = function(m){
  var re = util.reg.mobile;
  if(re.test(m)) {
    return true;
  } else {
    return false;
  }
}
util.isNull = function(o) {
  return o === null;
}

