StaticModel = {
    USER: {},
    /*0：天气；1：商城；2：服务；3：社区空间；4：缴费；5：我的订单；6：交流互动；7：热点新闻；8：小区公告；
     11:物物交换； 13：周边；14：管家； 15：购物车；16：我的账户；17：个人中心；18：设置；20：体验馆；
     21：爱心捐助；22：便民；23: 证券24: 历史会话 25:刮刮卡26：积分商城 27：充值 28：扫一扫 29：签到
     30:社区空间板块（当没有id的时候，和类型3一样，当有id的时候，id代表的是社区空间的板块“高谈阔论等等”列表）
     31: 环境监测，32：笑话，33：商品分类，34：菜谱，35：周公解梦、36：违章查询，37：邻里帮，38：每日健康，
     39：编辑资料，40：待评价订单，41：意见反馈，42：邀请好友，43：趣味问答，44：物管处介绍，45：物管处常用电话，
     46：翼社区介绍 47：抽奖(老虎机)，48：试手气（老虎机抽积分），
     49：团购，50：抢购，51:走不丢，52:智能移车，53:智能家居，55:防丢卡片*/
    Module: {
        //天气
        Weather: {flag: '0', url: '', tt: '天气'},

        //社区空间
        Bbs: {flag: '3', url: 'funny', tt: '社区空间'},
        //跳蚤
        Flea: {flag: '11', url: 'flea', tt: '跳蚤'},
        Arround: {flag: '13', url: 'around', tt: '周边'},
        //跳蚤数量
        FleaNumber: {flag: '90011', url: '', tt: '跳蚤数量'},
        //体验
        Experience: {flag: '20', url: 'experience', tt: '体验'},
        //笑话
        Joke: {flag: '32', url: '', tt: '笑话'},
        //健康
        Health: {flag: '38', url: '', tt: '健康'},
        //趣味问答
        Interest: {flag: '43', url: '', tt: '趣味问答'},
        //团购
        GroupBuy: {flag: '49', url: 'groupPurchase', tt: '团购'},
        //抢购
        PanicBuy: {flag: '50', url: 'panicBuy.tab2', tt: '抢购'},
        //合作加盟
        Corporation: {flag: '80000', url: '', tt: '合作加盟'},
        //
        Love: {flag: '21', url: 'love', tt: '爱心'},
        Integral: {flag: '26', url: 'integral', tt: '积分'},
        News: {flag: '8', url: 'news.notice', tt: '新闻'},
        Payment: {flag: '4', url: 'payment', tt: '缴费'},
        Losing: {flag: '51', url: 'main.losing', tt: '走不丢'},
        Intelligent: {flag: '52', url: 'main.intelligent', tt: '智能挪车'},
        Steward: {flag: '14', url: 'steward', tt: '管家'},
        Arrive: {flag: '29', url: 'arrive', tt: '签到'},
        Comm: {flag: '44', url: 'spec.comm', tt: '物管处介绍'}

    },
    ShoppingCart: {
        productNum: 0,
        //商家
        stores: [],
        //商品
        products: [
            {
                id: '',
                did: '',
                bc: ''
                // price:''
            }
        ]
    }
    ,

    LoveArray: [
        {
            year: 1,
            month: 1,
            subArray: [{}, {}]
        }
    ]
}







