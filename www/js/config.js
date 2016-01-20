/**
 * Created by Administrator on 2015/11/30.
 */
angular.module('config', [])
  .constant('wx',{
    AppID:"wx394d0054a95db231",
    AppSecret:"8788e1413f60a11079d64b7598f06c1f",
    WXCodeCallBack:location.origin+ '/ecomApp/weixinapi/wx-callback.html'
  })
 // .constant('HOST_NAME', 'http://www.yichenghome.com:9080/ECP')

  //.constant('HOST_NAME', 'http://54.223.211.254:7080/ECP/')
  .constant('HOST_NAME', 'http://www.yichengshequ.com:9080/ECP')
  .constant('AUTH_OPTION_USER', 'AUTH_OPTION_USER_1019')
  // .constant('ProxyURL','http://test.1wuye.com:8080/ecomApp/app/SimpleRestProxy.jsp') bpm18911328085.6655.la
  .constant('ProxyURL','http://localhost/all/www/SimpleRestProxy.jsp')
  .constant("WXCodeCallBack",location.origin+ '/weixin/www/view/wx/callback.html')
  //物业小区接口
  // .constant('PropertyURL','http://www.yichenghome.com:9080/ECP/communityinfo/list.do?callback=JSON_CALLBACK')
  .constant('PropertyURL','asserts/data.json')

  .constant('UseProxy',true)
  .constant('GoodsPageSize',20)
  .constant('ProductsPageSize',20)
  .constant('PageSize',20)
  .constant('ORDERINFO','ORDER')
  //物业INOF
  .constant('COMMINFO','COMMINFO_1019')


;
