/**
 * Created by Administrator on 2015/12/10.
 */
angular
  .module("weixin",[])
/**
 * @ngdoc
 * @author lvrui
 * @date 2015-12-11.
 * v1.0注意:
 * openid只有通过oauth2授权才能获取，普通jssdk api获取不到.
 * 流程:
 * 1.根据url获取appid和secret
 * 2.根据appid和secret获取openid.
 * 3.根据appid和secret获取access_token,jsapi_ticket, 然后获取到signature 服务于jssdk, 来获取位置.
 * 4.其他逻辑就
 *
 * config 配置信息
 * 1.初始化过程.
 *
 * 2.使用过程
 *
 * 3.缓存.
 *
 * 场景:
 * 所有的场景都一切从code开始,weixinSDK目前只实现了两中场景,
 * 1中是只有一个微信公总号的场景,appid和secret都是放在weixinSDK的config里的.
 * 2.一种是服务多个微信公众号的场景,appid和secret都是从后台返回过来的.
 * case 1:
 * weixinSDK is for one weixin. 公众号
 *
 * case 2:
 * weixinSDK is for multiple weixin 公众号
 *  参数就是appid,secret, 还有支付分两块业务，一块是支付给翼承的，一块是支付给商家物业的。
 */
  .service("weixinSDK",function(localStorageService,$http,ProxyService){
    var weixinSDK = {
      version: "1.0.0",
      appName: "wbase",
      isMultiple: false,
      isReady: false,
      access_token: "",
      tiket: "",
      /**
       * @ngdoc config
       * @author lvrui.
       * @appId params(appId) of the url attached on the weixin
       * @secret it will be removed, since secret is unsafe in the frontend. it will be retrived from the backend by the appId.
       * @ycAppId params(ycAppId) of the url attached on the weixin
       * @code the code that returned from weixin server , oauth2.0,
       * @openid the openid that returned from weixin server ,by https://api.weixin.qq.com/sns/oauth2/access_token?appid=[appid]&&grant_type=authorization_code
       *            the results is {"access_token":..,"expires_in":7200,"refresh_token":...,"openid":otNi..ne-lv....U,scope:"snsapi_base"}.
       *           openid is for Logon ,Register and isRegister. openid is
       * @backend  tokenUrl is for retriving the access_token , this access_token is different from the token of oauth2. this access_token can used to invoke
       *                      JSSDK.
       *             ticketUrl is for retrieving the jsapi_ticket, need access_token .
       *             signatureUrl is for retrieving the signature,
       */
      sdkConfig: {
        appId: "",
        secret: "",
        ycAppId: "",
        ycSecret: "",
        code: "",
        openid: "",
        webAccessToken: "",
        accessToken: "",
        jsapi_ticket: "",
        signature: "",
        timestamp: Math.ceil(new Date().getTime() / 1000).toString(),
        nonceStr: "1234567890",
        url: "",   //调用微信API的页面地址.
        backend: {
          tokenUrl: "http://bpm18911328085.6655.la/weixin/sdk_access_token",
          ticketUrl: "http://bpm18911328085.6655.la/weixin/jsapi_ticket",
          signatureUrl: "http://bpm18911328085.6655.la/weixin/signature",
          oauthTokenUrl: "http://bpm18911328085.6655.la/weixin/access_token",
          sigUrl:"http://bpm18911328085.6655.la/ECP/yc/wxSignature.do",
        },
        location:{}
      },
      //微信API的config.
      /**
       * @ngdoc
       * @author lvrui
       * @appid  retrieved the params of the url .
       * @timestamp  date time. 时间戳.
       * @nonceStr 随机串,可以随便输入.
       * @signature returned by the backend . 签名,后台生产
       * @jsApiList the api list that we need to invoke .
       * this config is the template of weixin config,  Use this config to invoke wx.config().
       */
      config: {
        debug: false,
        appId: 'wx88d5abaeadab2a1e',
        timestamp: Math.ceil(new Date().getTime() / 1000).toString(),
        nonceStr: '1234567890',
        signature: '123',
        jsApiList: [
          "openLocation"
        ]
      },
      /**
       * @ngdoc 判断是否有微信组件js
       */
      isHaveWeixin:function(){
        if(wx)
          return true;
        else
          return false;
      },
      /**
       * @ngdoc  判断是否在微信中.
       */
      isWeixin:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == "micromessenger")
          return true;
        else
          return false;
      },
      getSignature:function(){
        alert("ECP.getSignature");
        var reSignature = false;
        var signature = localStorageService.get("wx_signature");
        var nowTime = new Date().getTime;
        var wx_signature_time = localStorageService.get("wx_signature_time");
        if (wx_signature_time === undefined || wx_signature_time === null) {
          wx_signature_time = nowTime;
        }
        if (nowTime - wx_signature_time > 6000 * 1000 || nowTime - wx_signature_time === 0) {
          reSignature = true;
        }
        if (signature === undefined || signature === null) {
          signature = weixinSDK.getSignatureOne();
        } else {
          if (reSignature) {
            signature = weixinSDK.getSignatureOne();
          }
        }
      },
      // 一步就获取signature,只请求一次就获取signature, 参数有: appid,secret,timestapm,noncestr,url.
      getSignatureOne:function(){
          console.log(weixinSDK.sdkConfig);
          var _this = this;
          var requestBody = {
            path:"/yc/weixin/signature.do",
            data: {
              //"openid":"123",
              "appid": _this.sdkConfig.appId,
              "timestamp": _this.config.timestamp,
              "nonceStr": _this.config.nonceStr,
              "url": window.location.href.substring(0,window.location.href.indexOf("#"))  //调用微信接口的APP地址.
            }
          }
        alert("signature url11111111:"+requestBody.data.url);
        ProxyService.request(requestBody,true).then(function(data){
          alert("获得signature");
          console.log("getSignatureOne()'s result:",data);
          for(var i in data){
            alert(i+"--"+data[i]);;
          }
          if(data.r ===0){

          }
          alert("data.signature"+data);
          weixinSDK.config.signature = data.signature;
          wx.config(weixinSDK.config);
          wx.ready(function () {  //wx.config注入成功后，会调用ready.
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                weixinSDK.sdkConfig.location = res;
                alert("wx.ready(获取物理地址:"+weixinSDK.location);
              }
            })
          })
          wx.error(function (res) {
            alert("wx init error..........");
          })
          alert("微信注册完毕");
        }) ; //true 不用我们的token.;
      },

      initWeixinCode: function (code) {
        this.sdkConfig.code = code;
      },
      initWeixinApp: function (appid, secret) {
        this.sdkConfig.appId = appid;
        this.sdkConfig.secret = secret;
      },
      initWeixinMultiple: function (appid, secret) {
        this.sdkConfig.appId = appid;
        this.sdkConfig.secret = secret;
      },
      /**
       * @ngdoc
       * @author lvrui
       *
       * the function is for initing weixin environment.first. we retrieve signature from the backend,
       * note: we placed wx.config() in $http.get("").success(function(date) { wx.config} ,because ,if not  wx.ready can be first invoked then wx.config invoked.
       *  wx.getLocation() in wx.ready().
       */
      initWeixin: function () {
        alert("initWeixin():"+this.sdkConfig.appId);
        //weixinSDK.getSignatureOne();
        var _this = this;
        var requestBody = {
          path:"/yc/weixin/signature.do",
          data: {
            //"openid":"123",
            "appid": _this.sdkConfig.appId,
            "timestamp": _this.config.timestamp,
            "nonceStr": _this.config.nonceStr,
            "url": window.location.href.substring(0,window.location.href.indexOf("#"))  //调用微信接口的APP地址.
          }
        }
        alert("signature url11111111:"+requestBody.data.url);
        ProxyService.request(requestBody,true).then(function(data){
          alert("获得signature");
          console.log("getSignatureOne()'s result:",data);
          for(var i in data){
            alert(i+"--"+data[i]);;
          }
          if(data.r ===0){

          }
          alert("data.signature"+data);
          weixinSDK.config.signature = data.signature;

          wx.config(weixinSDK.config);
          wx.ready(function () {  //wx.config注入成功后，会调用ready.
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                weixinSDK.sdkConfig.location = res;
                alert("wx.ready(获取物理地址:"+weixinSDK.location);
              }
            })
          })
          wx.error(function (res) {
            alert("wx init error..........");
          })
          alert("微信注册完毕");
        }) ; //true 不用我们的token.;

      },
      getWeixinSignature:function(appid){
        var _this = this;
        //_this.config.appId = appid;
        var requestBody = {
          path:"/yc/weixin/signature.do",
          data: {
            //"openid":"123",
            "appid": _this.config.appId,
            "timestamp": _this.config.timestamp,
            "nonceStr": _this.config.nonceStr,
            "url": window.location.href.substring(0,window.location.href.indexOf("#"))  //调用微信接口的APP地址.
          }
        };
        console.log("getWeixinSignature():",requestBody);
        alert(requestBody.data.appid+"---weixinSignature");
        return  ProxyService.request(requestBody,true);
      },
      getAreas:function(appid){
          //只有openid没有绑定的时候，才会调用到小区列表接口为注册和登录服务. 也就是只需要一次.
          //if (!location && !weixinSDK.sdkConfig.location){
            //1.初始化微信, 1.1:获取signature, 1.2 注册, 1.3ready里调用位置服务api.
           console.log("getAreas():",appid);
            weixinSDK.config.appId = appid;
            alert("appid"+appid);
           return  weixinSDK.getWeixinSignature(appid);

      },
      getAreasBackend:function(location,queryStr){
          var params = {};
          params.path = "/yc/weixin/getNearPropertyList.do";
          params.data = {
            lon :location.longitude,
            lat :location.latitude,
            queryStr:queryStr,
            start: location.start,
            count :location.count
          }
        return ProxyService.request(params,true);
      },
      //根据网页返回的code去获取openid.
      getOpenid: function (sappid,code) {
        alert("getOpenid() function...");
        var reOpenid = false;
        var openid = localStorageService.get("wx_openid");
        var openidTime = localStorageService.get("wx_openid_time");
        if (openidTime === undefined || openidTime === null) {
          openidTime = new Date().getTime();
        }
          var nowTime = new Date().getTime();
       // alert(nowTime + "-" + openidTime + "nowTime - openidTime" + (nowTime - openidTime));
          if ((nowTime - openidTime) >= 6000 * 1000) {
            reOpenid = true;
          }
          //判断是否需要重新获取openid;
          alert("reOpenid:"+reOpenid);
          if (reOpenid) {
            weixinSDK.getOpenidFromWx(sappid,code).then(function(result){
               console.log("result:",result);
               alert("result"+result.r);
               return result.tokenBody.openid;
             });
          } else {
            if (openid === undefined || openid === null) {
              weixinSDK.getOpenidFromWx(sappid,code).then(function(result){
                console.log("result:",result);
                alert("result"+result.r);
                return result.tokenBody.openid;
              })
            } else {
              return openid;
            }
          }

      },
      isReg:function(openid) {
          var reqBody = {
            path:"/yc/weixin/registerCheck.do",
            data:{
              openid:openid
            }
          }
        var result;
        return ProxyService.request(reqBody,true);
      },
      getWxApp: function () {

      },
      /**
       *
       * @param appid
       * @param secret
       * @param wx
       */
        getLocation:function(){
      },
      getRedirectSignature: function (appid, secret) {
        var signature = null;
        var reSign = false;
        localStorageService.remove("wx_signature");
        signature = localStorageService.get("wx_signature");
        var sig_time = localStorageService.get("wx_signature_time");
        var now_time = new Date().getTime();
        if (sig_time === undefined || sig_time === null) {
          sig_time = now_time;
        }
        if (now_time - sig_time >= 6000 * 1000 || sig_time === now_time) {
          reSign = true;
        }
        if (signature === undefined || signature === null) {
          signature = weixinSDK.getSignatureFromWx(appid, secret);
        } else{
          wx.config(weixinSDK.config);
        }
      },
      getSignatureWx:function(appid,secret){
          var tokenUrl = "";
          var ticketUrl = "";
          var signatureUrl = "";
          $http.get(tokenUrl).success(function(){

          })
      },
      getSignatureFromWx: function (appid, secret) {
        var accessToken = "";
        var backUrl = weixinSDK.sdkConfig.backend.tokenUrl + "?appid=" + this.sdkConfig.appId + "&secret=" + this.sdkConfig.secret;
        var tokenUrl =  weixinSDK.sdkConfig.backend.tokenUrl;
        var tokenConfig = {
              method:"get",
              url:backUrl,
              timeout:1,
              params:{"appid":this.sdkConfig.appId,
                       "secret":this.sdkConfig.secret
                      }
        };

        var tokenRequest = $http(tokenConfig).then(tokenCallback,eCallback);
        function tokenCallback() {
          alert(arguments);
        }
        function eCallback(){
          alert("e:"+arguments);
        }
        $http.get(backUrl).success(function (data) {
          accessToken = data.access_token;
          weixinSDK.sdkConfig.accessToken = accessToken;    //..............token
          localStorageService.set("wx_access_token", accessToken);
          localStorageService.set("wx_access_token_time", new Date().getTime());
          var ticket = null;
          var ticketUrl =  weixinSDK.sdkConfig.backend.ticketUrl + "?access_token=" + accessToken;
          $http.get(ticketUrl).success(function (data) {
            ticket = data.ticket;
            weixinSDK.sdkConfig.jsapi_ticket = ticket;      //..............ticket
            localStorageService.set("wx_ticket", ticket);
            localStorageService.set("wx_ticket_time", new Date().getTime());
            //...................signature
            var timestamp = weixinSDK.config.timestamp;
            var nonceStr = weixinSDK.config.nonceStr;
            var url = window.location.href.substring(0,window.location.href.indexOf("#"));
           // alert("signature's url:"+url);
            //url不能保护进好
            var signatureUrl = weixinSDK.sdkConfig.backend.signatureUrl + "?jsapi_ticket=" + ticket + "&timestamp=" + timestamp + "&noncestr=" + nonceStr + "&url=" + url;

            $http.get(signatureUrl).success(function (data) {
              signature = data;                             //...............signature
              weixinSDK.config.signature = data;
              localStorageService.set("wx_signature",data);
              localStorageService.set("wx_signature_time",new Date().getTime());
              wx.config(weixinSDK.config);
            }).error(function (err) {
              alert(err);
            })
          }).error(function (err) {
            alert(err);
          })
        }).error(function (err) {
          alert(err);
        })
      },
      getAccessToken: function () {
        var reAccessToken = false;
        var accessToken = localStorageService.get("wx_access_token");
        //判断是否需要重新获取accesstoken.
        var nowTime = new Date().getTime();
        var wx_access_token_time = localStorageService.get("wx_access_token_time");
        if (wx_access_token_time === undefined || wx_access_token_time === null) {
          wx_access_token_time = new Date().getTime();
        }
        if (nowTime - wx_access_token_time >= 6000 * 1000) {
          reAccessToken = true;
        }
        if (accessToken === undefined || accessToken === null) {
          accessToken = weixinSDK.getAccessTokenFromWx();
        } else {
          if (reAccessToken) {
            accessToken = weixinSDK.getAccessTokenFromWx();
          }
        }
        return accessToken;
      },
      //jsapi_ticket有效期7200秒.
      getTicket: function (token) {
        var reTicket = false;
        var ticket = localStorageService.get("wx_ticket");
        alert("localStorageService.ticket=" + ticket);
        //判断是否需要重新获取ticket.
        var nowTime = new Date().getTime();
        var wx_ticket_time = localStorageService.get("wx_ticket_time");

        if (wx_ticket_time === undefined || wx_ticket_time === null) {
          wx_ticket_time = nowTime;
        }
        //如果现在时间减去上次缓存ticket的时间超过6000秒，则重新获取ticket.
        alert("nowTime - wx_ticket_time " + (nowTime - wx_ticket_time ));
        alert(nowTime - wx_ticket_time >= 6000 * 1000);
        if (nowTime - wx_ticket_time >= 6000 * 1000 || nowTime - wx_ticket_time === 0) {
          reTicket = true;
        }
        if (ticket === undefined || ticket === null) {
          ticket = weixinSDK.getTicketFromWx(token);
        } else {
          if (reTicket) {
            ticket = weixinSDK.getTicketFromWx(token);   //超过有效期，重新获取ticket.
          }
        }
        this.sdkConfig.jsapi_ticket = ticket;
        return ticket;
      },
      //获取openid 从微信
      getOpenidFromWx: function (sappid,code) {
        var requestBody = {
          path:"/yc/weixin/accessToken.do",
          data:{
            appid:sappid,
            code:code
          }
        }
        return ProxyService.request(requestBody,true);
      },
      getSignature2: function (ticket) {
        var reSignature = false;
        var signature = localStorageService.get("wx_signature");
        var nowTime = new Date().getTime;
        var wx_signature_time = localStorageService.get("wx_signature_time");
        if (wx_signature_time === undefined || wx_signature_time === null) {
          wx_signature_time = nowTime;
        }
        if (nowTime - wx_signature_time > 6000 * 1000 || nowTime - wx_signature_time === 0) {
          reSignature = true;
        }
        if (signature === undefined || signature === null) {
          signature = weixinSDK.getSignatureFromWx(ticket);
        } else {
          if (reSignature) {
            signature = weixinSDK.getSignatureFromWx(ticket);
          }
        }
      }
    }
    return weixinSDK;
  })
