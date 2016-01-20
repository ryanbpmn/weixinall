/**
 * Created by Administrator on 2016/1/12.
 */
/**
 * @auth jeff
 * @name love
 * @desc 社区公益模块.
 * @date 2016-1-12.
 *
 *   9:49 开始， 但是爱心墙没有数据，  9：57 还没有找到人去弄数据.
 *   9:57开始 ，弄爱心墙的  tab .
 */
angular
  .module("love",[])
  .constant("loveUrl",{
    loveHomeUrl:"/yc/donationMain.do",
    loveAdv:"",
    loveFund:"",
    loveGive:"/yc/donate.do",
    loveWallUrl:"/yc/donationStatList.do",
    loveInter:"",
    loveMessage:""
  })
  .controller("loveHomeCon",loveHomeCon)
  .controller("loveAdvCon",loveAdvCon)
  .controller("loveFundCon",loveFundCon)
  .controller("loveGiveCon",loveGiveCon)
  .controller("loveWallCon",loveWallCon)
  .controller("loveInterCon",loveInterCon)
  .controller("loveMessageCon",loveMessageCon)
  .service("loveService",loveService);

var loveHomeCon = ['$scope','$state','loveService',function($scope,$state,loveService){
    var con = this;
    /**
     * @name initVariables
     * @desc init variables in the begging.init the variables in the scope.
     * @param no params.
     * @return no return.
     */
    con.initVariables = function(){
      $scope.is = [];
      $scope.n = [];
      $scope.bbs = [];
      $scope.restFund = [];
    }
    /**
     * @name initHome
     * @desc init love home data.
     * @param no params.
     * @return is[] n[] bbs[] restFund.
     */
    con.initHome = function(){
      loveService.loveHome().then(function(data){
        if (data.r === 0) {
          $scope.is = data.result.is;
          $scope.n = data.result.n;
          $scope.bbs = data.result.bbs;
          $scope.restFund = 88;//data.result.restFund;
        }
      })
    }
    /**
     *
     */
    con.go = function(module) {
      $state.go(module);
    }
    /** start...**/
    con.initVariables();
    con.initHome();
    $scope.go = con.go;
  }];
var loveAdvCon = ['','','',function loveAdvCon(){

  }]
  function loveFundCon(){

  }
  function loveGiveCon($scope,loveService,$ionicLoading){
      var con = this;
    /**
     * @name initVariables
     * @desc 初始话变量
     */
      con.initVariables = function(){
        $scope.money = 0;
        $scope.isName = false;
      }
    /**
     * @name donate
     */
      con.donate = function(){
          if ($scope.money <=0) {
            $ionicLoading.show({template:"请输入大于0的金额"});
            $ionicLoading.hide();
          }
          loveService.loveGive($scope.money,$scope.isName).then(function(result){
            if (result.r ===0) {
              Tip.show("捐赠成功");
            }
          })
      }

      con.initVariables();
      $scope.donate = con.donate;
  }
  function loveWallCon($scope,loveService){
    //默认本月.
    var month = new Date().getMonth() + 1;
    loveService.loveWall(3,20,0).then(function(data){
      console.log("result",data);
      if(data.r ===0 ) {

      }
    });
    $scope.nearThirty = function(){
      loveService.loveWall("2",20,0,"").then(function(data){
        console.log("result",data);
        if(data.r ===0 ) {

        }
      });
    }
    $scope.allHistory = function(){
      loveService.loveWall("3",20,0,"").then(function(data){
        if(data.r ===0 ) {

        }
      });
    }
  }
  function loveInterCon(){

  }
  function loveMessageCon(){

  }
  function loveService(loveUrl,ProxyService,AuthFactory){
    var loveService = {
      loveHome:function(){
        var param = {
          path : loveUrl.loveHomeUrl,
          data : {
            t: AuthFactory.getAuthUser().t
          }
        }
        return ProxyService.request(param);
      },
      loveWall:function(type,count,startIndex,month){
          var param = {};
          param.path = loveUrl.loveWallUrl,
          param.data = {};
          param.data.t= AuthFactory.getAuthUser().t;
          param.data.startIndex=0;
          param.data.count=20;
          param.data.type=""+type;
          //param.data.month=month
          //}
        //}
        console.log(param);
        return ProxyService.request(param);
      },
      loveGive:function(donatedMoney,isAnoymous){
        var param = {};
        param.path = loveUrl.loveGive;
        param.data = {};
        param.data.t = AuthFactory.getAuthUser().t;
        param.data.pp = "";
        param.data.donatedMoney  = donatedMoney;
        param.data.isAnoymous = isAnoymous;
        return ProxyService.request(param);
      }
    }
    return loveService;
  }
