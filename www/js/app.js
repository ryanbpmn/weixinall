// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('wbase', ['ionic','weixin',
    'config','common','LocalStorageModule','ecom.filters.fomatter',
    'home','Account',
    'love'
    ])
  .config(function($stateProvider,$urlRouterProvider){
        $stateProvider

          // 社区公益(爱心模块)
          .state("loveHome",{
            url:"/loveHome",
            templateUrl:"view/love/loveHome.html",
            controller:"loveHomeCon"
          })
          .state("loveAdv",{
            url:"/loveAdv",
            templateUrl:"view/love/loveAdv.html",
            controller:"loveAdvCon"
          })
          .state("loveFund",{
            url:"/loveFund",
            templateUrl:"view/love/loveFund.html",
            controller:"loveFundCon"
          })
          .state("loveGive",{
            url:"/loveGive",
            templateUrl:"view/love/loveGive.html",
            controller:"loveGiveCon",
          })
          .state("loveWall",{
            url:"/loveWall",
            templateUrl:"view/love/loveWall.html",
            controller:"loveWallCon"
          })
          .state("loveInter",{
            url:"/loveInter",
            templateUrl:"view/love/loveInter.html",
            controller:"loveInterCon"
          })
          .state("loveMessage",{
            url:"/loveMessage",
            templateUrl:"view/love/loveMessage.html",
            controller:"loveMessageCon"
          })
          // 社区公益(爱心)模块配置 结束.

          .state("login",{
            url:"/login",
            templateUrl:"view/login.html",
            controller:"AccountLogin"
          })
          .state('loginIndex', {
            url: "/loginIndex",
            templateUrl: "view/selectcomm.html",
            controller: 'SltCommCtrl'
          })
          .state("home",{
            url:"/home",
            templateUrl:"view/home.html",
            controller:"HomeCon"
          })
        $urlRouterProvider.otherwise("login");
    })
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
