Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

angular.module('ecom.filters.fomatter', []).filter('fomatterWeek', function() {
    return function(input) {
        var weekDay = ["日", "一", "二", "三", "四", "五", "六"];
        var myDate = new Date(Date.parse(input.replace(/-/g, "/")));
        return weekDay[myDate.getDay()];
    };
}).filter('fomatterMd',function(){
    return function(input){
        var myDate = new Date(Date.parse(input.replace(/-/g, "/")));
        return myDate.Format("MM月dd日");
    }
});
