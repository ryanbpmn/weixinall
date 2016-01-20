/**
 * Created by Administrator on 2015/11/30.
 */
angular
  .module("home",[])
  .controller("HomeCon",function($scope,$state
    //,HomeService,BusinessService,$ionicSlideBoxDelegate,ServerService, AuthFactory,HOST_NAME,Tip
  ){

    $state.go("loveHome");
    //
    //HomeService.getFirstSection().then(function(data){
    //  $scope.personInfo=data.welcome_msg;
    //  $scope.M2 = data.m2;
    //  $scope.M3 = data.m3;
    //  $scope.m2_title = data.m2_title;
    //});
    //HomeService.getSecondSection().then(function(data){
    //  // console.log("second",data);
    //});
    //BusinessService.getAd().then(function(data){
    //  console.log(data,"广告")
    //  if (data.r === 0){
    //    $scope.ads  = data.c;
    //    $scope.mainAdLength=data.c.length>1?'true':'false';
    //    $ionicSlideBoxDelegate.update();}
    //  else
    //    $scope.ads = [];  //需要默认img.
    //});
    //$scope.goMyAccount = function(){
    //  $state.go("account");
    //};
    //$scope.go = function(dst){
    //  $state.go(dst);
    //};
    //ServerService.getServices({type: 14, cid: AuthFactory.getAuthUser().pid}).then(function (data) {
    //  if(data.r==0){
    //    $scope.guanJia = data.results[0].s_infos.slice(0,4);
    //  }
    //  console.log($scope.guanJia,"管家");
    //});
    //$scope.goGj = function (t, id) {
    //  //$state.go('stewardInner',{id:id});
    //  ServerService.getService({id: id, cid: AuthFactory.getAuthUser().pid}).then(function (data) {
    //    if (data.r == 1) {
    //      Tip.show(data.m);
    //      $state.go('steward')
    //    }
    //    console.log(data);
    //    $scope.info = data.s_info;
    //    console.log(data.s_info.surl);
    //    var staticUrl = HOST_NAME + data.s_info.surl
    //      + '&token=' + AuthFactory.getToken() + '&serviceId=' + id;
    //    localStorage.setItem('STEARDIFRAMURL', staticUrl);
    //
    //    window.location.href = 'view/service/stewardIframe.html';
    //
    //  });
    //};
    //ServerService.getServices({type:2,cid:AuthFactory.getAuthUser().pid}).then(function(data){
    //  if(data.r==0){
    //    console.log(data);
    //    //$scope.services = data.s_infos;
    //    $scope.life = data.results[1].s_infos.slice(0,4);
    //    $scope.nc=data.results[0].s_infos;
    //    $scope.fw=data.results[1].s_infos;
    //    $scope.qs=data.results[2].s_infos;
    //    console.log($scope.life,"生活")
    //
    //  }else{
    //    Tip.show('失败');
    //  }
    //
    //})
    //$scope.goLife = function(t,id,e){
    //  //if(n=="金融宝"){
    //  //    $state.go('jrb');
    //  //}else if(n=="空调清洗"){
    //  //    $state.go('cleankt');
    //  //}else if(n=="发动机舱护理"){
    //  //    $state.go('engine');
    //  //};
    //  if(t==32){
    //    $state.go('joke');
    //  }else if(t==34){
    //    $state.go('recipe');
    //  }else if(t==35){
    //    $state.go('duke');
    //  }else if(t==2){
    //    $state.go('lifeService',{id:id});
    //  }
    //  else if(t==38){
    //    $state.go('dayHealth')
    //  }
    //  else if(t==33){
    //    $state.go('visit',{id:id})
    //  }
    //  else if(t==48){
    //    $state.go('lottery')
    //  }
    //  else if(t==43){
    //    $state.go('interest')
    //  }
    //  else if(t==52){
    //    $state.go('nc.tab1',{id:0})
    //  }
    //  if(e){
    //    //阻止事件冒泡
    //    e.stopPropagation();
    //  }
    //};
  })
  .service("HomeService",function(ProxyService,AuthFactory){
    var homeService = {
      getHomeInfo: function(){

      },
      getFirstSection:function(){
        console.log("in getFirstSection()");
        var param = {
          path:"/yc/get_mainpage.do",
          data:{}
        };
        console.log(ProxyService.request(param));
        return ProxyService.request(param);
      },
      getSecondSection:function(){
        var param = {
          path:"/yc/get_mainpage_sec.do",
          data:{}
        };
        return ProxyService.request(param);
      }
    };
    return homeService;
  })

