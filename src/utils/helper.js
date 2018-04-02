import qrImage from 'qr-image';
import strings from "../assets/strings";

//获取系统时间

export function getSystemTime() {

    if(nowTime){
       return timeString(new Date(nowTime).getTime() / 1000)
    }else{
        return timeString(new Date().getTime() / 1000)
    }
}

export function inSize(w, h, ...sizes) {
    if(sizes[0].indexOf(':') > -1){
        const rate = sizes[0].split(':');
        return (w / h).toFixed(2) == (rate[0] / rate[1]).toFixed(2);
    }
    return sizes.indexOf(`${w}x${h}`) > -1
}

// 时间不能大于当前时间
export function validator (value) {
    var myDate = new Date();
    var now = myDate.valueOf();
    var time = new Date(value * 1000).valueOf();
    if (now > time) {
        return true;
    } else {
        return false;
    }
}
/**
 *  将文本转成二维码
 * @param text
 * @returns {string}
 */
export function getQRImage(text) {
    if (text == null) {
        return '';
    }
    let pngBuffer = qrImage.imageSync(text, {
        type: 'png',
        margin: 1
    });
    return 'data:image/png;base64,' + pngBuffer.toString('base64');
}

/**
 **文本格式
 **/
export function getString(template, ...pattern) {
    let result = strings.getString(template)
    if (pattern.length == 0) {
        return result;
    }
    return result.replace(/{(\d+)}/g, (match, number) => pattern[number] !== undefined ? pattern[number] : match)
}

/**
 * 时间格式化
 * @param time
 */
export function timeString(time) {
    //console.log(time);
    let date = new Date(time * 1000);
    //console.log(date.Format('yyyy-MM-dd h:m:s'));
    //return date.toLocaleString('zh-CN', {hour12: false})
    return date.Format('yyyy-MM-dd hh:mm:ss')
}

export function timeStringFormat(time,format) {
    //console.log(new Date(time).getTime())
    let date = new Date(time * 1000);

    return date.Format(format);
}


/**
 *  计算购物车产品的数量
 * @param products
 * @returns {number}
 */
export function getCartProductsNumber(products) {
    let sum = 0;
    for (let i = 0, l = products.length, product; i < l; i++) {
        product = products[i];
        sum += product.quantity;
    }
    return sum;
}
/**
 *  获取未过期商品的数量
 * @param  {[type]} good [description]
 * @return {[type]}      [description]
 */
export function getUnspentGoodNum(good){
    let num = 0;
    let unspentArr = [];
    let smal = null;
    let hasUnspent = false;
    const {device_items} = good;
    for(let deviceL = device_items.length, i = deviceL - 1, item; i >= 0; i--) {
        item = device_items[i];
        const {expire_list} = item;

        if(expire_list != null) {
            for(let expireL = expire_list.length, j = 0, expire; j < expireL; j++) {
                expire = expire_list[j];
                hasUnspent = true;
                if(!compareDate(expire)) {
                    num += 1;
                    unspentArr.push({expire, time: dateToTime(expire)});
                }else {
                    break;
                }
            }
        }else {
            break;
        }
    }

    if(unspentArr.length >1) {
        smal = unspentArr[0];
        for(let k = 1, unspentArrL = unspentArr.length, u; k < unspentArrL - 1; k++) {

            u = unspentArr[k];
            if(smal.time > u.time) {
                smal = u;
            }
        }
    }else if(unspentArr.length == 1){
        smal = unspentArr[0];
    }


    if(!good.hasOwnProperty('unspent') && hasUnspent) {
        good['unspent'] = num;
    }else if(!good.hasOwnProperty('unspent') && !hasUnspent) {
        good['unspent'] = good.stock;
    }

    if(!good.hasOwnProperty('unspentDate') && smal) {
        good['unspentDate'] = dateToText(smal);
    }else if(!good.hasOwnProperty('unspentDate') && !smal){
        good['unspentDate'] = null;
    }

    if(good['unspent'] >= 0 ) {
        return good['unspent'];
    } else if( good['unspent'] < 0) {
        return 0;
    }
}

/**
 *  比较日期大小
 * @param  {[type]} expire  [description]
 * @param  {[type]} nowDate [description]
 * @return {[type]}         [description] 当为 true ，表示已过期
 *
 */
export function compareDate(expire) {
    const nDate = Date.now();

    const eDate = dateToTime(expire);

    if( nDate > eDate ) {
        return true;
    }

    return false;
}
/**
 * 日期字符串转成时间戳
 * @param  {[type]} expire [description]
 * @return {[type]}        [description]
 */
export function dateToTime(expire) { 

    let year = expire.substr(0,2);
    let math = expire.substr(2,2);
    let day = expire.substr(4,2);
    year = '20' + year;
    math = math | 0;
    day = day | 0;
    const d = new Date(year + '/' + math + '/' + day);
    const eDate = d.getTime() + 24*60*60*1000;
    return eDate;
}

/**
 *  日期字符串转成xx月 xx日
 *
 * @param  {[type]} expire [description]
 * @return {[type]}        [description]
 */
export function dateToText(expire) {
    let e = expire.expire;
    let math = e.substr(2,2);
    let day = e.substr(4,2);
    math = math | 0;
    day = day | 0;

    return math + '月' + day + '日';
}

export function getPrice(price) { 
    if(price == undefined) {
        return 0.00;
    }
    return (parseFloat(price) / 100).toFixed(2);
}
/**
 * 替换url {0}为id
 */
export function getReplUrl(url,id){
    var str = url;
    var str1 = str.replace('{0}', id);
    return str1;
}

/**
 * initWeiXinConfig
 */
export function initWeiXinConfig() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1) {
        //window.load();
    }
}


/**
 * 时间格式
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


/***
 **验证提示
 ***/
export function validatorTip(text) {
    const tip = document.getElementById('validator_tips');
    if(tip){
        return;
    }
    const div = document.createElement('div');
    div.innerHTML = text;
    div.id = 'validator_tips';
    div.setAttribute('class',"validator_tips");
    document.getElementById('endings-content').appendChild(div);
    setTimeout(function () {
        div.setAttribute('class',"validator_tips hide");
    },1300)
    setTimeout(function () {
        document.getElementById('endings-content').removeChild(div);
    },1800)
}

export function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 **测试页面
 **/
export function isTestPage() {
    let id = localStorage.getItem('access_deviceId');
    return id && id == 'MSD13430367235';
    //return id && id == 'MSD15920150690';
}

/***
 ** 特定机台
 ***/

export function specifiedMachine() {
    const specifiedMachine =  sessionStorage.getItem('specifiedMachine');
    const flag  = specifiedMachine && specifiedMachine == 'true';
    return flag
}

/**
*** 图片http的改为https
 * **/
export function ImgUrlChange(url) {
    if(!url){
        return
    }
    // if(url.indexOf("https") > -1 ) {
    //
    //
    // }else{
    //     url = url.replace("http", "https");
    // }
    // console.log(url)
    return url
}

// js获取url指定参数值
export function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


