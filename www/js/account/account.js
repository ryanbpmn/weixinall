/**
 * Created by Administrator on 2015/11/30.
 */
angular
.module("Account",[])
  .controller('SltCommCtrl', function ($scope, $state, localStorageService, AuthService, AuthFactory,weixinSDK,Tip,$ionicScrollDelegate) {
    //1.初始化数据变量, 2.获取小区列表,3.初始小区列表操作方法.4.初始页面操作动作.
    alert("进入SltCommCtrl");
    var con = $scope;
    console.log("$scope:",$scope);
    con.isLoad = false;
    con.properties = [];
    con.propertNames = [];
    con.initProperties = [];
    con.words = [];
    con.count = 10;
    con.start = 0;
    con.loc = {
      longitude:-1,
      latitude:-1,
      start:0,
      count:20
    };
    var chars = 'ABCDEFGHIJKLIMNOPQRSTUVWXYZ';
    for (var i = 0; i < chars.length; i++) {
      con.words.push(chars.charAt(i));
    }

    //no weixin enviroment ..
    //var noRes = {longitude:104.021675,latitude:30.70915,start:0,count:10};
    //businessCall(noRes);
    var sappid = localStorage.getItem("wx_appid");
    alert("selectcomm.html"+sappid);
    //sappid = "wx88d5abaeadab2a1e";   //just for test..
    weixinSDK.getAreas(sappid).then(function(result){
      Tip.show("搜索附近小区中........",3000);
      var sign = result.signature;
      weixinSDK.config.signature = sign;
      weixinSDK.config.appId = sappid;
      weixinSDK.config.signature = sign;
      wx.config(weixinSDK.config);
      wx.ready(function(){
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {   // this is bussiness function call.
            businessCall(res);
          }
        });

      })

    });
    function businessCall(res){
      alert("微信地址"+res.latitude + "-"+res.longitude);
      var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90 30.709246， 104.02174
      var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
      var speed = res.speed; // 速度，以米/每秒计
      var accuracy = res.accuracy; // 位置精度
      weixinSDK.location = res;
      con.loc.longitude = res.longitude;
      con.loc.latitude = res.latitude;
      con.loc.start = 0;
      con.loc.count = 10;
      //location = res;
      weixinSDK.getAreasBackend(con.loc,"").then(function(data){
        alert("获取小区列表成功"+data.r);
        if (data.r ===0){
          Tip.hide();
          var list = data.pagination.list;
          $scope.hasNext = data.pagination.hasPageDown;
          $scope.properties = list;
          $ionicScrollDelegate.resize();
        }
      })
    }
    //initAreaOpt();
    //initNgOpt();




    $scope.loadMore = function(){
      Tip.show("搜索中.....");
      var key = $scope.schar == undefined ? "" : $scope.schar;
      $scope.loc.start = $scope.loc.start + $scope.loc.count;
      alert($scope.loc.longitude+"--"+$scope.loc.latitude+"--"+$scope.loc.start+"--"+$scope.loc.count);
      weixinSDK.getAreasBackend($scope.loc,key).then(function(data){
        alert("获取小区列表成功"+data.r);
        if (data.r ===0){
          var list = data.pagination.list;
          var newProperties = $scope.properties;
          angular.forEach(list,function(v,k){
            newProperties.push(v);
          });
          $scope.properties = newProperties;;
          $scope.hasNext = data.pagination.hasPageDown;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          alert("ionicScrollDelegate.resize()"+$ionicScrollDelegate);
        }
      })
      $ionicScrollDelegate.resize();
    }
    $scope.select = function(schar){
      console.log($scope.schar);
      Tip.show("加载中...........",4000);
      var loc = {longitude:-1,latitude:-1,start:con.start,count:con.count};
      weixinSDK.getAreasBackend(loc,schar).then(function(data){
        alert("获取小区列表成功"+data.r);
        if (data.r ===0){
          var list = data.pagination.list;
          $scope.hasNext = data.pagination.hasPageDown;
          $scope.properties = list;;
          $ionicScrollDelegate.resize();
        }

      });
      Tip.hide();
    }
    $scope.goUrl = function (comm, pname) {
      var commInfo = {cNO: comm.toUpperCase(), property: pname};
      AuthFactory.setCommInfo(commInfo)
      $state.go('login');
    }

  })
/**
 * @ngdoc
 * @author jeff
 * @desc 登录成功后,将openid传入到后台,供以后使用,如果登录过,则不再用用户名和密码登录.
 *
 */
.controller("AccountLogin",function($scope,$state,AccountService,AuthFactory,Tip,$ionicLoading){

    $scope.error="error";
    $scope.p = 10;
    $scope.login = {};
    //console.log(AccountService.isAuthed());
    //alert("AccountService.isAuthed:是否已经授权:"+AccountService.isAuthed());
    //if (AccountService.isAuthed()) {
    //  $state.go("home");
    //}

    $scope.p = 60;
    var _commInfo = AuthFactory.getCommInfo();
    if (!_commInfo || !_commInfo.cNO) {
      $state.go('loginIndex');
      return false;
    }
    _commInfo = {};
    _commInfo.cNO = "LBWY";
    $scope.loginAction = function(){
      $ionicLoading.show({template:"<ion-spinner icon='lines' class='spinner-calm'></ion-spinner><br>正在登录.....{{p}}%",hideOnStateChange:true,scope:$scope});
      if (angular.isUndefined($scope.login.username) && angular.isUndefined($scope.login.password)) {
        Tip.show('请入用户名和密码');
        return false;
      }else {
        $scope.p = 50;
        AccountService.login($scope.login.username,$scope.login.password,_commInfo).then(function(data){
          $scope.p = 90;
          alert("accountLoginCon,after login():"+data);
          if (data.r === 0) {
            AccountService.setAuthUser(data);
            $ionicLoading.hide();
            $state.go("home");
          }
        })
      }
    }
  })
  .controller("AccountCon",function($scope,$state,AccountService){
      //0.初始化数据
      $scope.infos = {};
      //$scope.tab.page=4;
      $scope.toBe = {};
      //1.获取账号信息,2.退出,3.获取我的未读信息
      AccountService.getAccountInfo().then(function(data){
        console.log("结果:",data);
        if (data.r ===0) {
          $scope.infos = data.infos;
        }
      })
     //2.退出
    console.log("AccountCon",$scope);
      $scope.exit = function(){
        AccountService.signUp();
        $state.go('login');
      };
     //3.获取我的信息
      AccountService.getMePage().then(function(data){
        if (data.r === 0) {
          $scope.toBe = { pay:data.to_be_pay,
            process:data.to_be_process,
            confirm:data.to_be_confirm,
            comment:data.to_be_comment,
            refund:data.refund};
        }
      })
      //4.go

    $scope.orders = function(type){
      console.log(type);
      $state.go("orderList",{type:type});
    }
      $scope.go = function(str){
        $state.go(str);
      }
  })
  .controller("AccountRegCon",function($scope,$state,Tip,AccountService,$ionicPopover,COMMINFO){

      $scope.goBack = function () {
        $state.go('login');
      }
      var commInfo = AccountService.getCommInfo();
      console.log("reg commInfo:",commInfo);
      $scope.formModel = {
        commNo: commInfo == null ? "": commInfo.cNO
      }
      //1.获取验证码,2.注册,3.选择小区.4.获取小区列表
      $scope.getCode = function(){
          //验证手机号码是否ok
         var isTrue =  util.checkMobile($scope.formModel.username);
         if(!isTrue) {
           Tip.show("手机号码输入错误");
           return false;
         }
        var param = {msdn: $scope.formModel.username, proCode: $scope.formModel.cNO, optType: 1};
         AccountService.getCode(param).then(function(data){
            console.log(data);
            if(data.r === 0) {
              Tip.show("验证码已发送");
            } else {
              Tip.show("获取失败:"+data.m);
            }
         })
      }
      $scope.register = function(){
        console.log("1.注册开始........................");
        if (!$scope.formModel.propertyId) {
          Tip.show('请选择小区！');
          return;
        }
        if ($scope.formModel.pass != $scope.formModel.pass2) {
          Tip.show('两次密码输入不一致！');
          return;
        }
        var param = {
          msdn: $scope.formModel.username,
          pwd: hex_md5($scope.formModel.pass).toUpperCase(),
          proCode: commInfo.commNo,
          comId: $scope.formModel.propertyId,
          cm: "",
          code: $scope.formModel.checkCode
        };
        AccountService.reg(param).then(function(data){
          if(data.r === 0) {
            Tip.show('注册成功！');
            $state.go('login');
          }
        })
      }
      $scope.selectArea = function(){
        console.log("3.选择小区............................");
        console.log(event);

      }
      $scope.getAreaList = function(){
        console.log("5.获取小区列表............................");
        var param = {proCode: $scope.formModel.commNo};
        AccountService.getAreaList(param).then(function(data){
          console.log("结果",data);
          if ($scope.isBlankObject(data)){
              data = [{id:1,name:"清水湾"},{id:2,name:"小"}]
              $scope.properties = data;
          }
          if (data.r ===0){
            $scope.properties = data.result.props;
          }
        })
      };
      $scope.getAreaList();
      $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
      $scope.isBlankObject = function(obj){
        for(p in obj){
          return false;
        }
        return true;
      }
  })
  //我的账号
  .controller("MyAccountCon",function($scope,AccountService){
      //0.初始化
    $scope.infos = {};
    $scope.amount = {};
    //1.获取数据
    var accountParam = {};
    AccountService.getAccountInfo(accountParam).then(function(data){
      if(data.r ===0) {
        $scope.infos = data.infos;
      }
    })
    var restParam = {};
    AccountService.getRestService(restParam).then(function(data){
      if(data.r ===0){
        $scope.amount={};
        $scope.amount.rest = data.rest;
        $scope.amount.pr = data.pr;
        $scope.amount.st = data.st;
        $scope.amount.ls = data.ls;
        $scope.amount.isSetPayPas = data.isSetPayPas;
      }
    });
  })
  //我的收藏
  .controller("MyCollectCon",function($scope,$location,AccountService){
      //0.init variables and behaviour
    $scope.search = {c:1};
    var url = $location.url(); //获取url中"?"符后的字串
    console.log(url);
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      $scope.search.c = str.split("=")[1];
    }
    //if(StorageService.getSession('collectCategory')){
    //    $scope.search = {c:StorageService.getSession('collectCategory')};
    //}else{
    //    $scope.search = {c:1};
    //}
    $scope.back = function(){
      window.history.go(-1);
    };
    $scope.page = 0;
    $scope.cates =[
      {id:5,name:'跳蚤'},
      {id:9,name:'菜谱'},
      {id:32,name:'笑话'}];
    $scope.collects = [];
    getCollect(0);
    //下拉刷新
    $scope.doRefresh = function(){
      $scope.canLoad = true;
      getCollect(0);
    };
    //上拉加载更多
    $scope.loadMore = function(){
      getCollect();
    };
    //筛选数据
    $scope.searchData = function(){
      getCollect(0);
      //StorageService.setSession('collectCategory',$scope.search.c);
    };

    $scope.goCollect = function(id){
      if($scope.search.c==1){
        $state.go('aroundDetails',{id:id});
      }
      if($scope.search.c==9){
        $state.go('recipeDetail',{id:id});
      }
    };
    function getCollect(n){
      var param = {category:$scope.search.c,startIndex:$scope.page,count:10};
      if(n==undefined||n==null){
        $scope.page += 1;
      }else if(n==0){
        $scope.collects = [];
        $scope.page = 0;
      }
      AccountService.getCollectService(param).then(function(data){
        if(data.collect_infos.length<param.count){
          $scope.canLoad = false;
        }
        angular.forEach(data.collect_infos,function(t){
          $scope.collects.push(t);
        });
      }).finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      })
    }
  })
  //我的消息
  .controller("MyMessageCon",function($scope,AccountService,Tip){
    //0.init variables and behav..
    $scope.isClick = false;
    $scope.messages = [];
    $scope.search = 0;
    $scope.canLoad = true;  //默认可以加载更多来搜索更多数据.
    $scope.cates = [{id:0,name:'全部'},{id:1,name:'商家'},{id:2,name:'物业'},{id:3,name:'平台'}];
    var param = {
      startIndex:0,
      count:20,
      category:0,
      timestamp:'2014-12-01 10:11:00'
    };
    $scope.amount = 0;
    //指定搜索. 更新type(category),序号和数量重置默认.
    /**
     * 3.指定搜索(条件搜索) : 更新type(category), 起始查询index = 0;
     */
    $scope.changeType = function(x){
      console.log("3.指定搜索.............................",param);
      //清空之前的查询结果
      $scope.messages = [];
      $scope.type = x.name;  //only use in changeType().显示在分类旁边的一个字符串,仅是显示，不和其他变量有任何关联.
      $scope.isClick = false;   //only use in changeType().将分类content 隐藏
      //更新type和初始化index.
      param.category = x.id;
      param.startIndex = 0;
      console.log("type search:",param);
      AccountService.getMessageService(param).then(function(data){
        console.log("data:",data);
        if (data.r === 0) {
          console.log(param.count, data.msgs.length);
          if (param.count > data.msgs.length){
            $scope.canLoad = false;   //如果count > 数据长度，不再滚动.
          }
          $scope.messages = data.msgs;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      })
    }
    //刷新搜索,需要type(category),序号和数量重置默认.
    $scope.refresh = function(){
      param.startIndex = 0;
      param.count = 20;
      AccountService.getMessageService(param).then(function(data){
        if (data.r ===0) {
          $scope.messages = data.msgs;
        }
      }).finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      })
    }
    /** 2.加载搜索
     *  加载搜索，需要follow当前的指定条件type(category),更新startIndex,
     *  因为默认搜索查询的数据为20条,
     *  所以 初次有20条数据.第一次执行loadMore()的起始index = 20,
     *       初次小于20条数据,则默认搜索方法里就判断是否可以执行loadMore(),通过设置canLoad = false;
     *  first loadMore() : startIndex = $scope.messages.length = 20.
     *  second loadMore(): startIndex = $scope.messages.length = 40
     *  third loadMore() : startIndex = $scope.messages.length = 60
     *  inner loadMore() ,we need check the length of the results ,if the length of results < param.count, 则说明没有更多的数据了，不需要再执行loadMore()
     *        set canLoad = false;
     */
    $scope.loadMore = function(){
      //如果当前的查询请求数量大于现有的数量,说明数据全部获取了
      param.startIndex =$scope.messages.length;
      console.log("加载搜索()........",param.startIndex + "-----"+param.count);
      AccountService.getMessageService(param).then(function(data){
        console.log("data.r ===",data.r);
        if (data.r ===0) {
          console.log($scope.messages,data.msgs);
          if (param.count > data.msgs.length){
            $scope.canLoad = false;
          }
          angular.forEach(data.msgs,function(v,k){
            $scope.messages.push(v);
          })
        } else {
          Tip.show(data.m);
          $scope.canLoad = false;
        }
      },function(error){
        console.log("error",error);
      }).finally(function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    /** 1.init data ,
     * 默认搜索,获取前20条数据;同时判断数据是否已经全部获取,如果全部获取则不需要加载搜索,否则需要加载搜素.
     * 如果初次搜索的结果data的长度小于 20条数据，说明数据已经全部获取了,set canLoad = false ,
     */

    AccountService.getMessageService(param).then(function(data){
      console.log("1.默认搜索........................");
      if (data.r ===0){
        $scope.messages = data.msgs;
        console.log("查询数量20","结果数量;"+data.msgs.length);
        if ($scope.messages.length < param.count) {
          $scope.canLoad = false;
        }
      }
    })
  })
  .service("AccountService",function($http,AuthFactory,ProxyService,weixinSDK){
    var url = {
      login:"/yc/login.do",
      openidLogin:"/yc/weixin/login.do",
      //login:"/yc/wxLoginUser.do",
      reg:"/yc/register.do",
      arealist:"/yc/registerInfo.do",
      code:"/yc/codeObtain.do",
      account_info:"/yc/people_info.do",
      collect:'/yc/collection_list.do',
      message:'/yc/message_list.do'
    }
    var accountService = {
      signUp :function(){
        AuthFactory.signUp();
      },
      setAuthUser:function(t){
        AuthFactory.setAuthUser(t);
      },
      isAuthed:function(){
        return AuthFactory.isAuthenticated();
      },
      oepnidLogin:function(openid){
          var param = {
            path : url.openidLogin,
            data:{
              "openid":openid
            }
          };
          return ProxyService.request(param,true);
      },
      login : function(username,password,_commInfo,openid){
        var param = {
          path : url.login,
          data:{
            "n":username,//"13965072079",//15928869264
            "p":hex_md5(password).toUpperCase(),//"E10ADC3949BA59ABBE56E057F20F883E",//E10ADC3949BA59ABBE56E057F20F883E
            "cn":_commInfo.cNO,//commNo,//"HZSW",
            "client_type":"2",
            "openid": localStorage.getItem("wx_openid")   //for test...
          }
        }
        return ProxyService.request(param,true);
      },
      reg:function(param){
        var reqParam = {path:url.reg,data:param};
        return ProxyService.request(reqParam);
      },
      getAccountInfo:function(param){
        var reqParam = {path:url.account_info,data:param};
        return ProxyService.request(reqParam);
      },
      //我的收藏
      getCollectService:function(param){
        var reqParam = {path:url.collect,data:param};
        return ProxyService.request(reqParam);
      },
      //我的消息
      getMessageService:function(param){
        var reqParam = {path:url.message,data:param};
        return ProxyService.request(reqParam);
      },
      getMePage:function(param){
        var reqParam = {path: '/yc/me_page.do',data:param};
        return ProxyService.request(reqParam);
      },
      //2.6.4.1账户余额查询接口
      getRestService:function(param){
        var restRequestObj = {}
        restRequestObj.path = '/yc/rest.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj)
      },
      getCommInfo:function(){
        return AuthFactory.getCommInfo();
      },
      setCommInfo:function(){
        return AuthFactory.setCommInfo();
      },
      removeCommInfo:function(){
        return AuthFactory.removeCommInfo();
      },
      getAreaList:function(param){
          var req = {};
          req.data = param;
          req.path = url.arealist;
          return ProxyService.request(req,true);
      },
      getCode:function(param){
          var req = {};
          req.data = param;
          req.path= url.code;
          return ProxyService.request(req,true);
      }
    }
    return accountService;
  })
