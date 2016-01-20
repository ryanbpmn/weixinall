/**
 * Created by Administrator on 2015/11/30.
 */
angular
.module("common",[])

 .factory("AuthFactory", function(localStorageService,AUTH_OPTION_USER,COMMINFO) {
      return {
        getToken: function () {
          var t = "";
          USER = localStorageService.get(AUTH_OPTION_USER);
          if (USER != null) {
            t =USER.t;
          }
          console.log("getToken:",localStorageService);
          return t;
        },
        getUserName: function () {
          USER = localStorageService.get(AUTH_OPTION_USER);
          if (USER != null) {
            return USER.uid;
          }

          return undefined;
        },

        getAuthUser: function () {
          USER = localStorageService.get(AUTH_OPTION_USER);
          if (USER != null) {
            return USER;
          }

          return {};
        },

        setAuthUser: function (USER) {
          localStorageService.set(AUTH_OPTION_USER, USER);
          console.log("setAuthUser",localStorageService.get(AUTH_OPTION_USER));
        },
        signUp: function () {
          localStorageService.remove(AUTH_OPTION_USER);

        },
        isAuthenticated:function(){
          USER = localStorageService.get(AUTH_OPTION_USER);
          if (USER == null) {
            return false;
          }
          return true ;
        },

        setCommInfo: function (v) {
          localStorageService.set(COMMINFO,v);
        },
        getCommInfo: function () {
          return localStorageService.get(COMMINFO);
        },
        removeCommInfo: function () {
          return localStorageService.remove(COMMINFO);;
        }
      }

    })
  .factory('AuthService',['$http','ProxyService','PropertyURL','AuthFactory',function($http,ProxyService,PropertyURL,AuthFactory) {
    var restRequestObj = {};
    return{
      getProperties: function () {
        var restBaseUrl=PropertyURL;
        return $http.get(restBaseUrl) .then(
          function (result) {
            return result.data.list;
          });
      },

      //获取验证码
      getCodeObtain:function(param){
        restRequestObj.path = '/yc/codeObtain.do';
        restRequestObj.data = param;
        if(!restRequestObj.data.proCode)restRequestObj.data.proCode=AuthFactory.getCommInfo().commNo;
        return ProxyService.request(restRequestObj,true)
      },

      resetPass:function(param){
        restRequestObj.path = '/yc/resetPwd.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj,true)
      },

      //获取验证码
      getRegInfo:function(param){
        restRequestObj.path = '/yc/registerInfo.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj,true)
      },
      register:function(param){
        restRequestObj.path = '/yc/register.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj,true)
      }
    }
  }])
  .service("ProxyService",function ($http,$location,AuthFactory,HOST_NAME,ProxyURL,UseProxy,Tip) {
    var restBaseUrl = HOST_NAME;
    var sucDo = function (result) {
      console.log("成功",result);
      Tip.hide();
      if (result.data.r == 1) {
        if (result.data.m == -1) {
          Tip.show('会话过期');
          $location.path("/login");
        } else {
          Tip.show(result.data.m);
        }
        return result.data;
      }
      return result.data;
    };
    var errorDo = function (err) {
      console.log("失败",err);
      var data = {r: 1};
      if (err.status == 401 || err.status == 400) {
        data.m = "认证失败";
      } else if (err.status === 0 || err.status === 404) {
        data.m = "网络连接失败";
      } else {
        data.m = "THERE WAS AN ERROR, STATUS CODE: " + status;
      }

      var er = angular.extend({}, {}, data);
      // LoadingScreenService.hide();
      Tip.hide();
      Tip.show(data.m);
      //return er;
      return data;
    };

    return {
      request: function (restRequestObj, notToken) {
        var defaults = {
          method: 'post',
          path: "#",
          params: '',
          headers: '',
          data: {}
        };
        restRequestObj = restRequestObj || {};
        if(angular.isUndefined(restRequestObj.data))restRequestObj.data={};
        var  opts = angular.extend({}, defaults, restRequestObj);
        //alert("proxysevice token is exits :"+(!notToken&&angular.isUndefined(opts.data.t)));
        if (!notToken&&angular.isUndefined(opts.data.t)) {
          var token = AuthFactory.getToken();
          opts.data.t = token;
        }
        if (UseProxy) {
          return $http.post(ProxyURL,opts).then(sucDo,errorDo);
        }
        else {
          opts.url = restBaseUrl + restRequestObj.path;
          switch (opts.method.toUpperCase()) {
            case  'POST':
              return $http.post(opts.url, opts.data).then(sucDo,errorDo);
            case 'GET':
              return $http.get(opts.url, opts.data).then(sucDo,errorDo);
            case 'PUT':
              return $http.put(opts.url, opts.data).then(sucDo,errorDo);
            case 'DELETE':
              return $http.delete(opts.url, opts.data).then(sucDo,errorDo);
          }
        }
      }
    };
  })

  .service("BusinessService",function(ProxyService){
    var businessService = {
      getAd:function(){
        var param = {
          path:"/yc/ad.do",
          data:{}
        };
        return ProxyService.request(param);
      }
    }
    return businessService;
  })
  .service("BBSService",function(ProxyService,PageSize){
    var bbs = {
      list:"/yc/bbs_list.do",
      block:"/yc/bbs_block_list.do",
      detail:"/yc/info.do",
      create:"/yc/bbs_create.do",
      reply:"/yc/note_reply.do"
    }
    var bbsService = {
        getList:function(param){
            var reqParam = {
              path:bbs.list,
              data:param
            };
          reqParam.data.count = angular.isUndefined(reqParam.data.count)  ? PageSize : reqParam.data.count;
          return ProxyService.request(reqParam);
        },
        getBlockList:function(param){
          var reqParam = {
            path:bbs.block,
            data:param
          };
          return ProxyService.request(reqParam);
        },
        create:function(param){
          var reqParam = {
            path:bbs.create,
            data:param
          };
          return ProxyService.request(reqParam);
        },
        getDetail:function(param){
          var reqParam = {
            path:bbs.detail,
            data:param
          };
          reqParam.data.count = angular.isUndefined(reqParam.data.count)  ? PageSize : reqParam.data.count;
          return ProxyService.request(reqParam);
        },
        reply:function(param){
            var reqParam = {
              path:bbs.reply,
              data:param
            };
            return ProxyService.request(reqParam);
        }
    };
    return bbsService;
  })
  .service("RequestService",function(ProxyService){
    var req =  {
      reqParam:{path:"",data:{}},
      request:function(path,param,nottoken){
          reqParam.path = path;
          reqParam.param = param;
          return ProxyService.request(reqParam,nottoken);
      }
    }
  })

/** alert popup tip ....**/
  .factory('Tip',['$ionicLoading',function($ionicLoading){
    var _loadingOptions = {
      delay: 0,
      template: '<span class="icon ion-load-c f-3"></span>',
      noBackdrop: false
    };
    var isShowing=false;
    return{
      show:function(mess,duration){
        isShowing=true;
        if(!angular.isUndefined(mess)){
          _loadingOptions.template=mess;
        }
        if(!angular.isUndefined(duration)){
          _loadingOptions.duration = duration;
        }
        if(angular.isUndefined(_loadingOptions.duration))
        {
          _loadingOptions.duration=1000;
        }

        $ionicLoading.show(_loadingOptions);
      },
      hide:function(){
        if(isShowing)
          $ionicLoading.hide();
        isShowing=false;
        _loadingOptions.template='<span class="icon ion-load-c f-3"></span>';
      },
      isShow:function(){
        return isShowing;
      },
      //不加载提示，比如分页时用到
      setShow:function() {
        isShowing=true;
      }

    }
  }])
  .factory('StorageService',[function() {
    var session = window.sessionStorage;
    var local = window.localStorage;
    return {
      getSession:function(key){
        return session.getItem(key);
      },
      setSession:function(k,v){
        return session.setItem(k,v);
      },
      getLocal:function(key){
        return local.getItem(key);
      },
      setLocal:function(k,v){
        return local.setItem(k,v);
      },
      clearSession:function(){
        return session.clear();
      },
      clearLocal:function(){
        return local.clear();
      }
    }
  }])

  .factory('Alert',['$ionicLoading',function($ionicLoading){
    var loadingOptions = {
      duration: 1000,
      delay: 0,
      template: '<i class="icon ion-loading-c"></i>\n<br/>\nLoading...',
      noBackdrop: false
    };
    return{
      show:function(mess,min){

        loadingOptions.template=mess;
        if(loadingOptions!==null){
          $ionicLoading.hide();
        }
        if(typeof(min)!='undefined' && min!=null){
          loadingOptions.duration=min;
        }else{
          loadingOptions.duration=1000;
        }
        $ionicLoading.show(loadingOptions);
      },
      hide:function(){
        $ionicLoading.hide();
      }
    }
  }])
  .factory("Modal",['$ionicModal',function ($ionicModal) {
    var scope;
    return {
      show : function (scope, templateId, showType) {
        this.scope = scope;
        return $ionicModal.fromTemplateUrl(templateId, {
          scope : this.scope,
          animation : showType,
          focusFirstInput:true
        }).then(function (modal) {
          scope.modal = modal;
          scope.modal.show();
          return true;
        })
      },
      hide : function () {
        scope.modal.hide();
      }

    }
  }])

  .factory('Popup',['$ionicPopup',function($ionicPopup){
    //var saveCallBack=function(){};
    var popup={
      /*template: '<input type="password" ng-model="data.wifi">',
       title: 'Enter Wi-Fi Password',
       subTitle: 'Please use normal things',
       scope: $scope,*/
      saveCallBack:function(){alert('xxxx')},
      buttons: [
        { text: '关闭' ,type: 'button-assertive button-small'},
        {
          text: '<b>保存</b>',
          type: 'button-assertive button-Custom',
          onTap: function(e) {
            popup.saveCallBack(e);
          }
        },
      ]
    };
    return {
      show:function(opts){
        var myPopup =ionic.extend(popup,opts||{});
        angular.element(myPopup.buttons[0]).addClass('button-small');
        return $ionicPopup.show(myPopup);
      }
    }

  }])
  .factory('ProductService',['ProxyService',function(ProxyService) {
    var restRequestObj = {};
    return {
      //商品首页信息
      getGoodMain: function (param) {
        restRequestObj.path = '/yc/goods_main.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);

      },
      //商品信息列表
      getProducts: function (param) {
        restRequestObj.path = '/yc/commoditys.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //商品评价
      getProductsComment: function (param) {
        restRequestObj.path = '/yc/goods_comments.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //获取商品详情
      getGoodDetail: function (param) {
        restRequestObj.path = '/yc/goods_detail.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //加入购物车
      addCar: function (param) {
        restRequestObj.path = '/yc/add_car.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //查看购物车
      orderCar: function (param) {
        restRequestObj.path = '/yc/order_cars.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //订单生成接口
      createGoodsOrder: function (param) {
        restRequestObj.path = '/yc/goods_order_create.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      }
    }
  }])
  .factory('HomeServiceSecond',['ProxyService','AuthFactory',function(ProxyService,AuthFactory) {
    var restRequestObj = {};
    return{
      //welcome:function(){
      //    var user = AuthFactory.getAuthUser();
      //    if(!angular.isUndefined(user.pid)) {
      //        restRequestObj.path = '/yc/get_mainpage.do';
      //        //restRequestObj.data = {cid:user.cid};
      //        return ProxyService.request(restRequestObj);
      //    }
      //},
      //第一首页
      welcome:function(param){
        restRequestObj.path = '/yc/get_mainpage.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //第二首页
      welcomeSecond:function(param){
        restRequestObj.path = '/yc/get_mainpage_sec.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //获取抢购批次
      getQG:function(param){
        restRequestObj.path = '/yc/group_purchase.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //获取体验馆列表
      getExperience:function(param){
        restRequestObj.path = '/yc/experience.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      }
      ,
      //获取积分商城列表
      getScoreGoodsList:function(param){
        restRequestObj.path = '/yc/score_goods_list.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //意见反馈
      getCreateSuggest:function(param){
        restRequestObj.path = '/yc/create_suggest.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      }
    }
  }])
 .factory('ShoppingCartSvc',['localStorageService',function(localStorageService) {
    function exitProduct(products,proc) {
      if (!products || products.length==0)return false;
      for (var i = 0; i < products.length; i++) {
        if (products[i].id == proc.id && products[i].did == proc.did) {
          products[i].bc+=proc.bc;
          return true;
        }
      }
      return false;
    }

    function exitStore(stores,rec) {
      var ret=false;
      if (!stores || stores.length==0)ret = false;
      for (var i = 0; i < stores.length; i++) {
        if (stores[i].si == rec.si) {
          stores[i].products.push(rec);
          ret= true;
          break;
        }
      }
      if(!ret){
        var store={sn : rec.sn,
          si : rec.si,products:[]
        };
        store.products.push(rec);
        stores.push(store);
      }
    }

    return {
      addCart: function (proc) {
        var cart = this.getCart();
        if(!exitProduct(cart.products,proc)){
          cart.products.push(proc);
          cart.productNum++;
        }
        localStorageService.set('ShoppingCart',cart);
        return cart.productNum;
      },
      getCartIds:function(){
        var cart =this.getCart();
        var cids=[];
        if(cart&&cart.products.length>0){
          cart.products.forEach(function(d){
            cids.push(d.cid);
          })
        }
        return cids;
      },
      reBuiltStorageCart:function(obj) {
        var cart = {};
        cart.products=[];
        cart.productNum=0;
        if(obj) {
          angular.forEach(obj.carts, function (c) {
            for (var i = 0; i < c.products.length; i++) {
              cart.products.push(c.products[i]);
              cart.productNum++;
            }
          });
        }
        localStorageService.set('ShoppingCart',cart);
      },
      rmStorageCart: function (procs) {
        var cart = this.getCart();
        procs.forEach(function (d) {
          if (cart.products.contains(d)) {
            cart.productNum--;
            cart.products.remove(d);
          }
        })
        localStorageService.set('ShoppingCart', cart);
        return {};
      },
      getCart: function () {
        var cart = localStorageService.get('ShoppingCart');
        var newCart = angular.extend({}, StaticModel.ShoppingCart, cart || {});
        return newCart;
      },

      getCartList:function(results){
        var carts=[];
        var store={};
        angular.forEach(results,function(d){
          exitStore(carts,d);
        });
        return carts;
      },
      /* getCartProductNum:function(obj){
       angular.forEach(obj.carts, function (c) {
       for (var i = 0; i < c.products.length; i++) {
       obj.productNum++;
       }
       });
       },*/
      setChecked:function(vType,checked,obj) {
        obj.checkedCarts = [];

        var totalPrice = 0;
        switch (vType) {
          case 'Store':
            angular.forEach(obj.carts, function (c) {
              if (c.si == obj.checkSid) {
                c.checked = checked;
                if (!checked) {
                  obj.checkedAll = false;
                }
                for (var i = 0; i < c.products.length; i++) {
                  c.products[i].checked = checked;

                }
              }
            })
            break;
          case 'Product':
            angular.forEach(obj.carts, function (c) {
              var retStoreCheckAll = true;
              if (c.si == obj.checkSid) {
                for (var i = 0; i < c.products.length; i++) {
                  if (c.products[i] == obj.checkPid) {
                    c.products[i].checked = checked;
                  }
                  retStoreCheckAll = retStoreCheckAll && c.products[i].checked;
                }

                if (!checked) {
                  obj.checkedAll = false;
                  c.checked = false;
                } else {
                  c.checked = retStoreCheckAll;
                }
              }
            })
            break;
          case 'All':
            angular.forEach(obj.carts, function (c) {
              c.checked = checked;
              for (var i = 0; i < c.products.length; i++) {
                c.products[i].checked = checked;
              }
            })
        }

        var checkAll=true;
        angular.forEach(obj.carts, function (c) {
          checkAll = checkAll && c.checked;
          for (var i = 0; i < c.products.length; i++) {
            if (c.products[i].checked) {
              totalPrice += c.products[i].op;
              obj.checkedCarts.push(c.products[i]);
            }
          }
        });

        obj.checkedAll=checkAll;
        obj.totalPrice = totalPrice.toFixed(2);
      },
      rmCart:function(obj,cids) {
        var rmProducts=[];
        var rmStores=[];
        angular.forEach(obj.carts, function (c) {
          for (var i = 0; i < c.products.length; i++) {
            if(cids.contains(c.products[i].cid)){
              obj.totalPrice-= c.products[i].op;
              rmProducts.push(c.products[i]);
              if(obj.checkedCarts)obj.checkedCarts.remove( c.products[i]);
              //  obj.oldCarts.remove(c.products[i]);
              //  c.products.remove(c.products[i]);

            }
          }
        });

        obj.carts.forEach(function(c){
          for(var i =0;i<rmProducts.length;i++){
            if(c.products.contains(rmProducts[i])){
              c.products.remove(rmProducts[i]);
            }
          }
          if(c.products.length==0){
            rmStores.push(c);
          }
        });
        console.log(rmStores.length,'rmStores.length');
        rmStores.forEach(function(s){
          if(obj.carts.contains(s)){
            obj.carts.remove(s);
          }
        })

        this.reBuiltStorageCart(obj);

      }
    }
  }])
  .factory('CommonService',['ProxyService',function(ProxyService) {
    var restRequestObj = {};
    return {
      //收藏
      collectShopper: function (param) {
        restRequestObj.path = '/yc/collectShopper.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      GetAd:function(param){
        restRequestObj.path = '/yc/ad.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      },
      //品牌广告
      getAdDetail: function (param) {
        restRequestObj.path = '/yc/ad_detail.do';
        restRequestObj.data = param;
        return ProxyService.request(restRequestObj);
      }
    }
  }])
  .controller('MyCollectCtrl',['$scope','$state','$location','$stateParams','StorageService','AccountServiceSecond',function($scope,$state,$location,$stateParams,StorageService,AccountServiceSecond) {
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
    $scope.cates = [{id:1,name:'商家'},
      {id:2,name:'商品'},
      {id:3,name:'服务'},
      {id:4,name:'通知公告'},
      {id:5,name:'跳蚤'},
      {id:6,name:'社区新闻'},
      {id:7,name:'交流互动'},
      {id:8,name:'品牌广告'},
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
      AccountServiceSecond.getCollectService(param).then(function(data){
        console.log(data,"收藏")
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
  }])



