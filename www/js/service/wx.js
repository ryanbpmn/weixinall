/**
 * Created by Administrator on 2015/12/8.
 */
angular
.module("wx",[])
/**
 * 先进入该控制器页面, 链接有appid和secret参数.
 * step:
 *  1.获取openid,signature 注入wx.cofig, 然后再wx.ready()里获取location. openid-->config-->ready-->location.
 *  2.是否注册,如果已注册或登录过则直接调用登录接口,进入首页.
 *             如果没有则,根据location的地址选择小区.
 *  1.获取secret,获取openid, 根据openid获取signature, 然后注入wx.config。再wx.ready()里获取location.
 *
 */
.controller("wxCon",function($scope,$state,$stateParams,weixinService,weixinSDK,WXCodeCallBack,localStorageService,$http,AccountService,Tip,$ionicLoading,env){
    /**
     * @auth jeff
     * @desc 1.获取链接的appid.保存到localstorageService里.
     * @type {string}
     */
    //Step 1. 获取appid.................................................................................
    $ionicLoading.show({template:"准备进入微信应用.....",hideOnStateChange:true,scope:$scope,duration:88000});
    var appid = $stateParams.appid ?  $stateParams.appid : "" ;
    //alert("参数appid="+appid);
    localStorage.setItem("wx_appid",appid);
    //alert("缓存appid="+localStorage.getItem("wx_appid"));
    var openid = "";
    var location ;
    var oauth_code = localStorage.getItem("wx_oauth_code");  //微信回调回来的code. ,第一次是没有的。
    //localStorageService.set("wx_code",oauth_code); //第二次存入localStorageService.
    //var session_code = localStorageService.get("wx_code");
    //alert("oauth_code is :"+oauth_code );
    var nowTime = new Date().getTime();
    var session_code_start = localStorage.getItem("wx_code_startTime") ? localStorage.getItem("wx_code_startTime") :nowTime;
    var reCode = false;
    //alert("nowTime="+nowTime+"--session_code_start="+session_code_start);
    if (nowTime - session_code_start > 1000 * 6000 && nowTime !== session_code_start) {
      //重新获取code.
      reCode = true;
    }
    //localStorageService.remove("wx_oauth_code");
    if(oauth_code === undefined || oauth_code === null || reCode === true) {
      var lhref = WXCodeCallBack + '?wx_id='+appid;
      //alert(lhref);
      window.location.href = lhref;
    } else {
      Tip.show("初始化环境中......",3200);
      //alert("获取code之后，进入business logic..."+localStorage.getItem("wx_oauth_appid"));
      var sappid = localStorageService.get("wx_appid") ? localStorageService.get("wx_appid")  :localStorage.getItem("wx_oauth_appid") ;  //因为第二遍刷新的时候没有appid
      //alert("sappid="+sappid);
      //sappid = "wx88d5abaeadab2a1e" ;//for test.
      weixinSDK.sdkConfig.code = oauth_code;            //sdkConfig ,关于业务的配置.
      weixinSDK.sdkConfig.appId =sappid;
      weixinSDK.config.appId  = sappid;                  //微信接口的配置
      //Step 2. 获取openid..................................................................
      var reOpenid = false;
      var openid = localStorage.getItem("wx_openid");
      var openidTime = localStorage.getItem("wx_openid_time");
      if (openidTime === undefined || openidTime === null) {
        openidTime = new Date().getTime();
      }
      var nowTime = new Date().getTime();
      if ((nowTime - openidTime) >= 6000 * 1000) {
        reOpenid = true;
      }
      if (reOpenid) {
        reGetOpenid(sappid,oauth_code);
      } else {
        if (openid === undefined || openid === null) {
          //alert("reopenid ="+(openid === undefined || openid === null));
          Tip.show("检测微信初始环境.....",2000);
          reGetOpenid(sappid,oauth_code);
        } else {
          //alert("step 3" +"缓存中的openid="+openid);
          openidOpt(openid);
        }
      }
    }

    function reGetOpenid(sappid,oauth_code){
      weixinSDK.getOpenidFromWx(sappid,oauth_code).then(function(result){
        if(result.r === 0) {
          var tokenBody = angular.fromJson(result.tokenBody);
          //alert(angular.isString(tokenBody) + "--"+(tokenBody));
          var openid = tokenBody.openid;
          localStorage.setItem("wx_openid",openid);
          localStorage.setItem("wx_openid_time",new Date().getTime());
          //alert("step 3");
          openidOpt(openid);
        } else {
          Tip.show("请联系微信公众号管理员查看链接是否正确"+result.m,1000);
        }
      })
    }
    //Step 3...................根据openid 判断是否注册, 如果注册过则直接用openid登录.如果没注册过则进入选择小区页面.

    function openidOpt(openid) {
      //alert("step3.........判断是否注册...............");
      Tip.show("正在登录应用中.....");
      weixinSDK.isReg(openid).then(function(result){
        //alert("是否注册+"+result.isRegister +"--isreg="+result.isRegister);
        if (result.r === 0) {
          if (result.isRegister === 1) {

            AccountService.oepnidLogin(openid).then(function(result){
              if(result.r ===0) {
                AccountService.setAuthUser(result);
                $state.go("home");
              }
             })
          } else {
            //alert("进入loginIndex");
            $state.go("loginIndex");
          }
        }
      })
    }



    //var appid = $stateParams.appid;
    //var secret = $stateParams.secret;
    //if (appid !== undefined) {
    //  localStorageService.set("wx_appid", appid);
    //  localStorageService.set("wx_secret", secret);
    //}
    //var openid = "";
    //var location ;
    //var oauth_code = localStorage.getItem("wx_oauth_code");
    //localStorage.removeItem("wx_oauth_code");
    //alert(oauth_code);
    //if(oauth_code === undefined || oauth_code === null) {
    //  var lhref = WXCodeCallBack + '?wx_id='+appid;
    //} else {
    //  var sappid = localStorageService.get("wx_appid");  //因为第二遍刷新的时候没有appid
    //  var ssecret = localStorageService.get("wx_secret");
    //  weixinSDK.initWeixinCode(oauth_code);
    //  weixinSDK.initWeixinApp(sappid,ssecret);
    //  weixinSDK.config.appId  = sappid;
    //  openid = weixinSDK.getOpenid(oauth_code);
    //  weixinSDK.sdkConfig.openid = openid;
    //  weixinSDK.initWeixin();
    //  alert("location:"+weixinSDK.sdkConfig.location);
    //  var isReg = weixinSDK.isReg(openid);
    //  if(!isReg) { //如果注册过则,登录后进入主页, 否则进入注册页面.
    //    $state.go("home");
    //  } else {
    //    $state.go("loginIndex");
    //  }
    //}



    function getOpenid(){
      var oauth_access_token = localStorage.getItem("wx_oauth_access_token");
      if(oauth_access_token === undefined || oauth_access_token === null) {
        var lhref = WXCodeCallBack + '?wx_id='+appid;
        window.location.href = lhref;
      }
    }

  })
  .service("weixinService",function(env,localStorageService,ProxyService){
    return  {
      isReg:function(openid) {
        alert("weixinService1111:"+openid);
        var reqBody = {
          path:"/yc/weixin/registerCheck.do",
          data:{
            openid:openid
          }
        }
        var result;
        alert("begin invoke ProxyService.request()");
       return  ProxyService.request(reqBody,true);
         //  .then(function(data){
         //  alert("ProxyService request.then()"+data.r+"--"+data.m+"--"+data.isRegister);
         //});
      },
      GetRequest:function(){
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          var strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      },
      SetWxOpenId:function(wxId,openId) {

        localStorageService.set(wxId,openId);
      },
      GetWxOpenId:function(wxId){
        return localStorageService.get(wxId);
      },
      RemoveWxOpenId:function(wxId) {
        localStorageService.remove(wxId);
      },
      getSecret : function(appid) {
        console.log("appid:",appid);
          var requestBody = env.backend.interface.wxSecret.reqBody;
          requestBody.appid = appid;
          var path = env.backend.interface.wxSecret.path;
          var requestBody = {
            path : env.backend.interface.wxSecret.path,
            data:{"appid":appid},
            method:"GET"
          }
          console.log("getSecret:",requestBody);
          var result = ProxyService.request(requestBody);
          console.log("secret result ",result);
      }
    }
  })

function noWeixinFunction(weixinService){
  alert("111111noWeixinFunction");
  openid = "otNiDs8Dne-lv4psmtgBaum6ehrU";
  alert(openid);
  weixinService.isReg(openid);
  //  .then(function(data){
  //  alert("weixinSDK.isReg().then"+data);
  //  if(!isReg) { //如果注册过则,登录后进入主页, 否则进入注册页面.
  //    $state.go("home");
  //  } else {
  //    $state.go("loginIndex");
  //  }
  //});

}
