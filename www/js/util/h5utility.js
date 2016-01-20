
var H5Util= function() {
    var callBack = function () {
    };
    var callFlag = false;
    var fileObj = {};
    var handleFileSelect = function (evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            readAsBinaryString(f);
            readAsDataURL(f);


        }
    };

    this.selectImgFiles = function (fileCtlId, _callBack) {
        //判断浏览器是否支持FileReader接口
        if (typeof FileReader == 'undefined') {
            alert("你的浏览器不支持FileReader接口");
            //使选择控件不可操作
            // file.setAttribute("disabled","disabled");
            return;
        }
        document.getElementById(fileCtlId).addEventListener('change', handleFileSelect, false);
        callBack = _callBack;
        fileObj.ctlId = fileCtlId;
        return $('#' + fileCtlId).click();
    }


    //图片转换成二进制
    var readAsBinaryString = function (file) {
        var reader = new FileReader();
        //将文件以二进制形式读入页面
        reader.readAsBinaryString(file);
        reader.onload = function (f) {
            fileObj.binaryString = this.result;
            if (fileObj.base64Url && !callFlag) {
                callFlag = true;
                callBack(fileObj);
            }
        }
    };


    //Base64
    var readAsDataURL = function (file) {
        //检验是否为图像文件
        if (!/image\/\w+/.test(file.type)) {
            alert("看清楚，这个需要图片！");
            return false;
        }
        var reader = new FileReader();
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            fileObj.base64Url = this.result;
            if (fileObj.binaryString && !callFlag) {
                callFlag = true;
                callBack(fileObj);
            }
        }
    }

}
