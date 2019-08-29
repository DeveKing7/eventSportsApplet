const app = getApp();
const baseurl = require('baseurl.js');


const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function getQueryString(uri, name) {
    var reg = new RegExp("[\?\&]" + name + "=([^\&]+)", "i");
    var r = uri.match(reg);
    if (r != null) return r[1];
    return null;
}
//删除数组中某一个元素  
function remove(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}


const isPhone = str => {
    let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return phoneReg.test(str);
}

const isSMSCode = str => {
    let smsCodeReg = /^[0-9]{4}$/;
    return smsCodeReg.test(str);
}
const isCardNumber = str => {
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    if (reg.test(str) === false) {
        return true;
    }
    return false;
}

const noLoginCode = "401";
const session_key = "session_key";
const temp_session_key = "temp_session_key";
const noneUserCode = "404";
const sessionKeyRequired = "405";
const unableCode = "403";
const authenticationRequired = "406";
const phoneRequired = "407";
const login_route = "pages/user/login/login";

const getLastPage = function() {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
}

/**
 * 查看当前页是否为登录页
 */
const isInLoginPage = function() {
    if (getLastPage().route == login_route) return true;
    return false;
}

const setCodeInLoginPage = function(code) {
    if (isInLoginPage) {
        getLastPage().setData({
            code: code
        });
    }
}

const getSessionId = function() {


    if (getInfoFromStorage(session_key)) {
        return getInfoFromStorage(session_key);
    } else {
        return getInfoFromStorage(temp_session_key);
    }


}

const setSessionId = function(session_id) {
    setInfoToStorage(session_key, session_id);
}

const setTempSessionId = function(session_id) {
    setInfoToStorage(temp_session_key, session_id);
}

const getInfoFromStorage = function(key) {
    return wx.getStorageSync(key);
}

const setInfoToStorage = function(key, value) {
    wx.setStorageSync(key, value);
}

/**
 * 用户登陆
 * func 登陆后执行方法(无参)
 */
const login = function(func, func_fail) {
    console.log(new Date() + "开始登陆");
    wx.login({
        success: function(res) {
            if (res.code) {
                //发起网络请求
                sendRequest({
                    url: '/api/activity/user/login',
                    data: {
                        code: res.code,
                        applet: "SSLNAPPLETMAIN"
                    },
                    method: 'POST',
                    isLogin: true
                }).then(function(obj) {

                    if (obj.errorCode != 0) {
                        if (func_fail) {
                            func_fail();
                        }
                        return;
                    }


                    getApp().globalData.userInfo = obj.user;
                    func(obj);
                }, function(obj) {
                    if (func_fail) {
                        func_fail();
                    }

                    console.log(obj);
                });
            } else {
                console.log('获取用户登录态失败！' + res.errMsg)
            }
        }
    });

}


/**
 * 发起网络请求。
 * options具体参数详见：https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html
 * options新增isForm参数, 默认是true，即为表单提交方式（传递参数为key-value）
 *     若为false，则参数为json形式（具体后台即为@RequestBody）
 * options新增isLoading参数, 默认是false，是否显示加载中提示框
 * 
 * options中无需包含 success fail 通过promise.then(function(){}, function(){})调用  
 *    两者均可空
 */
const sendRequest = function(options, fail_func) {
    return new Promise(function(r, j) {
        if (options.isLoading) showLoading();

        if (!options) options = {};
        options.data = options.data ? options.data : {};
        options.method = options.method ? options.method.toUpperCase() : "GET";
        options.dataType = options.dataType ? options.dataType : "json";
        options.responseType = options.responseType ? options.responseType : "text";
        options.isForm = options.isForm != null ? options.isForm : true;
        options.data.source = "APPLET";
        wx.request({
            url: convertUrl(options.url),
            data: options.data,
            header: preRequestHeader(options.isForm, options.isLogin),
            method: options.method,
            dataType: options.dataType,
            responseType: options.responseType,
            success: function(res) {

                if (res.header && res.header['Set-Cookie']) {
                    if (options.isLogin) {
                        setSessionId(res.header['Set-Cookie']);
                    } else {
                        setTempSessionId(res.header['Set-Cookie']);
                    }

                }
              // console.log(res.data);
                // console.debug(new Date() + "发送请求：" + convertUrl(options.url) + " 成功，返回值：" + JSON.stringify(res));
                if (res.data.hasErrors) {
                    if (res.data.errorCode == noLoginCode) {
                        //未登陆状态，需登陆
                        login(function() {
                            sendRequest(options).then(r, j);
                        }, fail_func);
                    } else if (res.data.errorCode == unableCode) {
                        //未审核
                        if (!isInLoginPage()) {
                            redirectTo({
                                url: "/pages/user/login/login",
                                params: {
                                    code: unableCode
                                }
                            });
                        } else {
                            setCodeInLoginPage(unableCode);
                        }
                    } else if (res.data.errorCode == noneUserCode) {
                        //不存在该用户
                        // setSessionId(res.data.thirdSessionId);
                        j(res.data);

                    } else if (res.data.errorCode == authenticationRequired) {
                        navigateTo({
                            url: "/pages/user/authentication/authentication"
                        });
                    } else if (res.data.errorCode == phoneRequired) {
                        navigateTo({
                            url: "/pages/user/abnormalAuthentication/abnormalAuthentication"
                        });
                    } else if (res.data.errorCode == sessionKeyRequired) {
                        login(function() {
                            sendRequest(options).then(r, j);
                        }, fail_func);
                    } else if (res.data.errorCode == '100') {
                      r(res.data);
                    } else {
                        showError(res.data.errorMessage);
                        hideLoading();

                        // j();

                    }

                } else {
                    r(res.data);
                }
            },
            fail: function(res) {
                // console.debug(new Date() + "发送请求：" + convertUrl(options.url) + " 失败原因：" + JSON.stringify(res));
                if (options.fail) j(res.data);
            },
            complete: function(res) {
                // console.debug(new Date() + "发送请求：" + convertUrl(options.url));
                if (options.isLoading) hideLoading();
            }
        });
    });
}

/**
 * 转换url，将url拼接baseurl的content作为前缀
 */
const convertUrl = function(url) {
    if (url.indexOf("/") != 0) {
        url = "/" + url;
    }

    return getBaseUrl() + url;
}

/**
 * 获取baseurl
 */
const getBaseUrl = function() {
    return baseurl.content;
}

const getBaseWssUrl = function() {
    return baseurl.wssContent;
}

/**
 * 组装header，添加sessionId
 */
const preRequestHeader = function(isForm, isLogin) {
    var header = {};
    if (isForm) header = {
        'content-type': 'application/x-www-form-urlencoded'
    };
    else header = {
        'content-type': 'application/json'
    };
    if (isLogin) {
        let temp = getInfoFromStorage(session_key);
        if (temp) {
            header.Cookie = temp;
            return header;

        }
    }

    let sessionId = getSessionId();
    if (sessionId) {
        header.Cookie = sessionId;
    }

    return header;
}

/**
 * 错误提示框
 * msg 错误信息
 * sucFn 点击确定按钮后执行方法
 */
const showError = function(msg, sucFn) {
    wx.showModal({
        content: msg,
        showCancel: false,
        // confirmColor: '#fc0000',
        success: function(res) {
            if (sucFn) sucFn(res);
        }
    });
}

const confirm = function(title, msg, sucFn) {
    title = title ? title : "提示";
    wx.showModal({
        title: title,
        content: msg,
        showCancel: true,
        success: function(res) {
            if (sucFn) sucFn(res);
        }
    })
}

/**
 * 显示loading框
 */
const showLoading = function(options) {
    if (!options) options = {};
    options.title = options.title ? options.title : '请稍后';

    options.mask = options.mask ? options.mask : true;
    // console.log(options)
    wx.showLoading(options);
}

/**
 * 隐藏loading框
 */
const hideLoading = function() {
    wx.hideLoading();
}

/**
 * 保留当前页面，跳转到应用内的某个页面，使用navigateBack可以返回到原页面。
 * https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxnavigatetoobject
 * 注：options中的url属性，不需要拼接参数，所需的参数设置在options.params属性中
 *    options.params中不能再包含任何对象
 */
const navigateTo = function(options) {
    options.params = options.params ? options.params : {};
    wx.navigateTo({
        url: packParamToUrl(options.url, options.params),
        success: function(res) {
            if (options.success) {
                options.success(res);
            }
        },
        fail: function(res) {
            if (options.fail) {
                options.fail(res);
            }
        },
        complete: function(res) {
            if (options.complete) {
                options.complete(res);
            }
        }
    })
}

const redirectTo = function(options) {
    options.params = options.params ? options.params : {};
    wx.redirectTo({
        url: packParamToUrl(options.url, options.params),
        success: function(res) {
            if (options.success) {
                options.success(res);
            }
        },
        fail: function(res) {
            if (options.fail) {
                options.fail(res);
            }
        },
        complete: function(res) {
            if (options.complete) {
                options.complete(res);
            }
        }
    })
}

/**
 * 关闭当前页面，返回上一页面或多级页面
 * https://mp.weixin.qq.com/debug/wxadoc/dev/api/ui-navigate.html#wxnavigatebackobject
 * delta:决定需要返回几层
 */
const navigateBack = function(delta) {
    delta = delta ? delta : 1;
    wx.navigateBack({
        delta: delta
    });
}

/**
 * 将params组装到url中
 */
const packParamToUrl = function(url, params) {
    var paramsStr = "";
    for (var param in params) {
        paramsStr += param + "=" + params[param] + "&";
    }

    if (paramsStr != "") {
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);

        if (url.indexOf("?") > 0) {
            url += "&" + paramsStr;
        } else {
            url += "?" + paramsStr;
        }
    }

    return url;
}

/**
 * 将完整url中的参数解析
 * 若解析失败返回undefined
 */
const decodeParamsFromUrl = function(url) {
    try {
        let out = {};
        url = url.split("?")[1];
        url = url.split("&");
        for (let i = 0; i < url.length; i++) {
            let urlObj = url[i];
            if (urlObj) {
                let tmp = urlObj.split("=");

                if (tmp.length == 2) {
                    out[tmp[0]] = tmp[1];
                }
            }
        }

        return out;
    } catch (e) {

    }
}

const pay_request = function (uuid, jumpType, activityId) {
  var that = this;
    sendRequest({
      url: '/activitywechatpay/getacsignorderpayrequest',
      data: { acSignOrderUuid:uuid},
        method: "POST",
        isLoading: true,
    }).then(function(res) {
        var json = JSON.parse(res.jspay);
        wx.requestPayment({
            'timeStamp': json.timeStamp,
            'nonceStr': json.nonceStr,
            'package': json.package,
            'signType': json.signType,
            'paySign': json.paySign,
            'success': function(res) {
            
              redirectTo({
                url: "/pages/orderDetail/orderDetail?uuid=" + uuid + "&activityId=" + activityId
                 })

                console.log(1, res);

            },
            'fail': function(res) {
              // if (getApp().refresh) {
              //   getApp().refresh();
         
              // }
                console.log(4, res);
            },
            'complete': function(res) {
             
                console.log(7, res);
            }
        })
    });
}


module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    formatNumber: formatNumber,
    getQueryString: getQueryString,
    remove: remove,
    isPhone: isPhone,
    isSMSCode: isSMSCode,
    isCardNumber: isCardNumber,
    getSessionId: getSessionId,
    setSessionId: setSessionId,
    setTempSessionId: setTempSessionId,
    getInfoFromStorage: getInfoFromStorage,
    setInfoToStorage: setInfoToStorage,
    login: login,
    sendRequest: sendRequest,
    convertUrl: convertUrl,
    getBaseWssUrl: getBaseWssUrl,
    confirm: confirm,
    showError: showError,
    showLoading: showLoading,
    hideLoading: hideLoading,
    navigateTo: navigateTo,
    navigateBack: navigateBack,
    packParamToUrl: packParamToUrl,
    redirectTo: redirectTo,
    decodeParamsFromUrl: decodeParamsFromUrl,
    pay_request: pay_request
}