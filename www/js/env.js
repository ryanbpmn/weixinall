/**
 * Created by Administrator on 2016/1/4.
 */
angular.module("envs",[])
  .constant("env",{
    /** 微信环境相关配置信息参数
     * 1.config 是微信调用jssdk的官方配置.
     * 2.bisConfig: 是应用的配置信息,保存signature,openid,等等信息.
     * **/
    weixin: {
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
      bisConfig:{
        openid:"",
        signature:"",
        oauthToken:"",
        accessToken:"",
        ticket:"",
        appid:""
      }
    },
    /** 后台相关接口配置信息参数 **/
    backend:{
      interface:{
        wxSecret:{
          path:"/yc/wxSecret.do",
          reqBody:{"appid":""},
          respBody:{"secret":""}
        },
        wxSignature:"/yc/wxSignature.do"
      }
    },
    requestMapping:{

    }
  });



