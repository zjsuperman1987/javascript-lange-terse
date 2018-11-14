//默认分辨率设置
var UA = navigator.userAgent,
	isIos = /(iPhone|iPad|iPod|iOS)/i.test(UA) && !isAndroid, // 部分国产机UA会同时包含 android iphone 字符
	isIphone = /(iPhone|iPod)/i.test(UA),
	isAndroid = /(Android)/i.test(UA),
	isWeixin = /(MicroMessenger)/i.test(UA),
// isAppcan = /(Appcan)/i.test(UA),
//isAppcan=(window.parent.uexDevice==null),
	sw = screen.width,
	sh = screen.height,
	cw = document.documentElement.clientWidth,
	ch = document.documentElement.clientHeight,
	isLandscape = sw > sh ? 1 : 0;
(function (doc, win) {
    docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
		    //var clientWidth = docEl.clientWidth;
		    if (isIphone) {
		        clientWidth = Math.min(sw, sh, cw, 414)
		    } else if (isAndroid) {
		        clientWidth = Math.min(sw, sh, cw, 360)
		    } else {
		        clientWidth = Math.min(sw, sh, cw, 480)
		    }
		    if (!clientWidth) return;
		    localStorage.setItem("fontSize", clientWidth);
		    docEl.style.fontSize = 100 * (clientWidth / 320) + 'px';
		};
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var $$ = function (selector) {
    return document.querySelector(selector);
}
var $$$ = function (selector) {
    return document.querySelectorAll(selector);
}

//----------------------AJAX----------------------
PubAjax = (function () {
    return {
        post: function (BusinessType, date, successFun, errorFun, completeFunc) {
            date = date || {};
            date.voucher = sessionStorage.getItem("voucher");
            if (BusinessType) {
                date.BusinessType = BusinessType;
            }
            date.BusinessData = {};
            var result;
            $.ajax({
                type: "POST",
                url: "/Mobile/WeChat/HttpRequest.aspx",
                cache: false,
                data: date,
                dataType: "json",
                async: false,
                success: successFun,
                error: errorFun,
                complete: completeFunc
            });
        }
    }
})();

//----------------------request----------------------
PubRequest = (function () {
    return {
        Query: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r !== null) {
                return unescape(r[2]);
            }
            return ""; //返回参数值
        },
        TxQuery: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r !== null) {
                return decodeURI(r[2]);
            }
            return ""; //返回参数值
        }
    }
})();

//----------------------util----------------------
PubUtil = (function () {
    return {
        Set: function (array, json) {
            $.each(array, function (i, item) {
                if (!PubUtil.isEmptyObject(json)) {
                    if ($("#" + item + "").length > 0 && json.hasOwnProperty(item)) {
                        $("#" + item + "").text(json[item] == null ? '' : json[item]);
                    }
                }
            });
        },
        isEmptyObject: function (json) {
            var t;
            for (t in json)
                return !1;
            return !0
        }
    }
})();

//----------------------弹出框统一封装----------------------
pop = (function () {
    function isDefine(para) {
        if (typeof para == "undefined" || para == "" || para == "[]" || para == null || para == undefined) {
            return false;
        } else if (typeof para == "number" || para == "number" || para == "null") {
            return true;
        } else if (para == null || para == undefined) {
            return true;
        } else {
            for (var o in para) {
                return true;
            }
            return false;
        }
    }
    return {
        notice: function (content, time) {
            //uexWindow.toast('0', '5', content, time*1000);
            var timeVal = 2;
            if (isDefine(time)) {
                timeVal = time;
            }
            //提示

            layer.open({
                content: content
                , skin: 'msg'
                , time: timeVal //2秒后自动关闭
             });
        },
        confirm: function (type, title, content, cb, conditions) {
            // appcan.window.confirm({
            // title:title,
            // content:content,
            // buttons:['是','否'],
            // callback:function(err,data,dataType,optId){
            // cb(data); //data=0表示第一个按钮 data=1表示第二个按钮
            // }
            // });

            //显示confirm内容
            var titleDom = "";
            if (isDefine(title)) {
                titleDom = '<div class="ub ub-ac ub-pc confirmsItem confirm_min_h">' + title + '</div>';
            }
            if (type == 1) {
                var btnLeft = "确定";
                if (isDefine(conditions)) {
                    btnLeft = conditions.btnLeft;
                }
                chooseTypeDom = '<div class="ub ub-ac ub-pc confirms-chooseType01 confirmBtnItem" data-index="0">' + btnLeft + '</div>';
            } else {
                var btnLeft = "是",
                btnRight = "否";
                if (isDefine(conditions)) {
                    btnLeft = conditions.btnLeft || "是";
                    btnRight = conditions.btnRight || "否";
                }
                chooseTypeDom = '<div class="ub ub-ac ub-pc confirms-chooseType01-left confirmBtnItem" data-index="0">' + btnLeft + '</div>'
                          + '<div class="ub ub-ac ub-pc confirms-chooseType01-right confirmBtnItem" data-index="1">' + btnRight + '</div>';
            }

            var $tipsDom = $('<div class="confirms">'
                        + '<div class="ub ub-ac ub-pc confirms_ub">'
                            + '<div class="ub ub-ac ub-pc ub-ver confirm_content">'
                                + titleDom
                                + '<div class="ub ub-ac ub-pc confirm_min_h content-msg confirms-padding">' + content + '</div>'
                                + '<div class="ub ub-pj confirmsItem confirm_min_h confirms-chooseType">'
                                  + chooseTypeDom
                                + '</div>'
                            + '</div>'
                        + '</div>'
                      + '</div>');
            $("body").append($tipsDom);

            //$(".scrollContent").addClass("overlay");

            //模拟器允许点击事件
            if (isSML) {
                //选择点击事件
                $(".confirmBtnItem").on("tap", function (e) {
                    var index = $(this).data("index");
                    // alert(index);
                    cb(index);

                    var $confirms = $(".confirms");
                    $confirms.remove();

                    e.stopPropagation(); //终止事件冒泡
                    e.preventDefault();
                })

                if (isDefine(conditions) && conditions.isAllowClose == 0) {
                    $(".confirms").on("tap", function (e) {
                        e.stopPropagation(); //终止事件冒泡
                        e.preventDefault();
                    })
                } else {
                    //点击销毁
                    $(".confirms").on("tap", function (e) {
                        var $confirms = $(".confirms");
                        $confirms.remove();

                        e.stopPropagation(); //终止事件冒泡
                        e.preventDefault();
                    })
                }
            } else { //手机上
                //选择点击事件
                $(".confirmBtnItem").on("touchend", function (e) {
                    var index = $(this).data("index");
                    // alert(index);
                    cb(index);

                    var $confirms = $(".confirms");
                    $confirms.remove();

                    e.stopPropagation(); //终止事件冒泡
                    e.preventDefault();
                })

                if (isDefine(conditions) && conditions.isAllowClose == 0) {
                    //点击销毁
                    $(".confirms").on("touchend", function (e) {
                        e.stopPropagation(); //终止事件冒泡
                        e.preventDefault();
                    })
                } else {
                    //点击销毁
                    $(".confirms").on("touchend", function (e) {
                        var $confirms = $(".confirms");
                        $confirms.remove();

                        e.stopPropagation(); //终止事件冒泡
                        e.preventDefault();
                    })
                }


                //阻止默认滑动事件
                $(".confirms").on("touchmove", function (e) {
                    e.stopPropagation(); //终止事件冒泡
                    e.preventDefault();
                })
            }

        },
        loading: function (content, time) {
            // layer.open({
            // type: 2,
            // className:"layer-loading",
            // content: (content)?content:"",
            // time:(time)?time:"",
            // shade: false,
            // shadeClose:false
            // });

            var $tipsDom = $('<div class="pop-loading pop">'
                        + '<div class="ub ub-ac ub-pc popLoading-box">'
                            + '<div class="ub ub-ac ub-pc popLoading_content">'
                                + '<div class="ub ub-ac ub-pc ub-ver popLoading_img_div">'
                                    + '<div class="ub ub-ac ub-pc loading_mask-div">'
                                        + '<div class="ub">'
                                            + '<img class="popLoading_img" src="image/loading_mask2.png"/>'
                                        + '</div>'
                                    + '</div>'
                                    + '<div class="loading_wave-div loading-show">'
                                        + '<img class="loading_wave" src="image/loading_wave.jpg"/>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                        + '</div>'
                      + '</div>');
            $("body").append($tipsDom);

            //点击销毁
            // $(".pop").on("touchend",function(){
            // var $pop=$(".pop");
            // $pop.remove();
            // e.stopPropagation();//终止事件冒泡
            // e.preventDefault();
            // })

            //阻止默认滑动事件
            $(".pop").on("touchmove", function (e) {
                e.stopPropagation(); //终止事件冒泡
                e.preventDefault();
            })
        },
        close: function (popname) { //popname为layer弹出层的名称
            var $pop = $(".pop");
            if (isDefine($pop)) {
                $pop.remove();
            } else {
                if (popname) {
                    layer.close(popname);
                } else {
                    layer.closeAll();
                }
            }
        }
    }
})();

//----------------------字符串相关API----------------------
PubString = (function () {
    return {
        format: function (source, opts) {
            var data = Array.prototype.slice.call(arguments, 1), toString = Object.prototype.toString;
            if (data.length) {
                data = data.length == 1 ?
                /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
	    	            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
	    	            : data;
                return source.replace(/\{(.+?)\}/g, function (match, key) {
                    var replacer = data[key];
                    // chrome 下 typeof /a/ == 'function'
                    if ('[object Function]' == toString.call(replacer)) {
                        replacer = replacer(key);
                    }
                    return ('undefined' == typeof replacer ? '' : replacer);
                });
            }
            return source;
        }
    }
})()


//----------------------时间相关API----------------------
PubDate = (function () {
    return {
        datetime: function () {
            var now = new Date();

            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日

            var hh = now.getHours();            //时
            var mm = now.getMinutes();          //分

            var clock = year + "-";

            if (month < 10)
                clock += "0";

            clock += month + "-";

            if (day < 10)
                clock += "0";

            clock += day + " ";

            if (hh < 10)
                clock += "0";

            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm;
            return (clock);
        },
        date: function () {
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
              : nowDate.getMonth() + 1;
            var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
              .getDate();
            var dateStr = year + "-" + month + "-" + day;
            return dateStr;
        },
        diff: function (datepart, startdate, enddate) {
            if (startdate == "" || enddate == "") {
                return "";
            }
            startdate = typeof startdate == "string" ? new Date(startdate.replace(/-/g, '/')) : startdate;
            enddate = typeof enddate == "string" ? new Date(enddate.replace(/-/g, '/')) : enddate;
            var interval = enddate.getTime() - startdate.getTime(); //相差毫秒
            switch (datepart.toLowerCase()) {
                case "y": return $.toInt(enddate.getFullYear() - startdate.getFullYear());
                case "m": return $.toInt((enddate.getFullYear() - startdate.getFullYear()) * 12 + (enddate.getMonth() - startdate.getMonth()));
                case "d": return $.toInt(interval / 1000 / 60 / 60 / 24);
                case "w": return $.toInt(interval / 1000 / 60 / 60 / 24 / 7);
                case "h": return $.toInt(interval / 1000 / 60 / 60);
                case "s": return $.toInt(interval / 1000);
            }
        },
        add: function (datepart, number, date, pattern) {
            if (!date) {
                return "";
            }
            if (!pattern) {
                pattern = "yyyy-MM-dd";
            }

            var dtTmp = typeof date == "string" ? new Date(date.replace(/-/g, '/')) : date;
            var newDate;
            switch (datepart) {
                case 'y': newDate = new Date((dtTmp.getFullYear() + number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); break;
                case 'm': newDate = new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); break;
                case 'd': newDate = new Date(Date.parse(dtTmp) + (86400000 * number)); break;
                case 'w': newDate = new Date(Date.parse(dtTmp) + ((86400000 * 7) * number)); break;
                case 'h': newDate = new Date(Date.parse(dtTmp) + (3600000 * number)); break;
                case 's': newDate = new Date(Date.parse(dtTmp) + (1000 * number)); break;
            }
            if (pattern) {
                return PubDate.format(newDate, pattern)
            }
            return newDate;
        },
        getDaysInMonth: function (year, month) {
            month = parseInt(month, 10) + 1;
            var temp = new Date(year + "/" + month + "/0");
            return temp.getDate();
        },
        //格式化日期
        /*
        Arguments：
        1.pattern-(sring)， 格式化模式
        hh: 带 0 补齐的两位 12 进制时表示<br>
        h: 不带 0 补齐的 12 进制时表示<br>
        HH: 带 0 补齐的两位 24 进制时表示<br>
        H: 不带 0 补齐的 24 进制时表示<br>
        mm: 带 0 补齐两位分表示<br>
        m: 不带 0 补齐分表示<br>
        ss: 带 0 补齐两位秒表示<br>
        s: 不带 0 补齐秒表示<br>
        yyyy: 带 0 补齐的四位年表示<br>
        yy: 带 0 补齐的两位年表示<br>
        MM: 带 0 补齐的两位月表示<br>
        M: 不带 0 补齐的月表示<br>
        dd: 带 0 补齐的两位日表示<br>
        d: 不带 0 补齐的日表示
        Examples:
        var date = new Date();
        alert(PubDate.format(date,"yyyy-MM-dd HH:mm:ss"))   
        */
        format: function (date, pattern) {
            if ('string' != typeof pattern) {
                return date.toString();
            }
            function replacer(patternPart, result) {
                pattern = pattern.replace(patternPart, result);
            }
            //对目标字符串的前面补0，使其达到要求的长度
            function pad(source, length) {
                var pre = "",
                negative = (source < 0),
                string = String(Math.abs(source));

                if (string.length < length) {
                    pre = (new Array(length - string.length + 1)).join('0');
                }

                return (negative ? "-" : "") + pre + string;
            }
            var year = date.getFullYear(),
             month = date.getMonth() + 1,
            date2 = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

            replacer(/yyyy/g, pad(year, 4));
            replacer(/yy/g, pad(year.toString().slice(2), 2));
            replacer(/MM/g, pad(month, 2));
            replacer(/M/g, month);
            replacer(/dd/g, pad(date2, 2));
            replacer(/d/g, date2);

            replacer(/HH/g, pad(hours, 2));
            replacer(/H/g, hours);
            replacer(/hh/g, pad(hours % 12, 2));
            replacer(/h/g, hours % 12);
            replacer(/mm/g, pad(minutes, 2));
            replacer(/m/g, minutes);
            replacer(/ss/g, pad(seconds, 2));
            replacer(/s/g, seconds);

            return pattern;
        },
        /*比较两个日期的大小
        Arguments：
        1.date1  -(string) ,日期1
        2.date2 -({string}) ,日期2
        3:compareNull - (bool),存在空值时是否比较
        Result:
        如果date1>date2，返回true，否则返回false;
        Examples:
        PubDate.gt('2011-02-01','2011-02-05')  //false
        */
        //大于等于
        isGreaterEqual: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 >= date2;
            } else {
                return compareNull ? false : true;
            }
        },
        //小于等于
        isLessEqual: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 <= date2;
            } else {
                return compareNull ? false : true;
            }
        },
        //大于
        isGreater: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 > date2;
            } else {
                return compareNull ? false : true;
            }
        },
        //小于
        isLess: function (date1, date2, compareNull) {
            if (date1 && date2) {
                return date1 < date2;
            } else {
                return compareNull ? false : true;
            }
        },
        toDate: function (date) {
            return new Date(date.replace(/-/g, '/'));
        }
    }
})()


//----------------------数字相关的函数----------------------
PubNumber = (function () {
    return {
        calc: function (num1, num2, operation, round, format) {
            var fltNum1 = (num1.toString().replace(/,/g, "")); //去掉千分位中的","
            var fltNum2 = (num2.toString().replace(/,/g, ""));
            fltNum1 = fltNum1 == "" ? "0" : fltNum1;
            fltNum2 = fltNum2 == "" ? "0" : fltNum2;
            if (!round) {
                round = 0
            }

            var intNum1Digit = 1, intNum2Digit = 1, intDigit = 1;   //需要放大多少位

            var blnNumber = !isNaN(fltNum1) && fltNum1 !== "" && !isNaN(fltNum2) && fltNum2 !== ""; //判断是否是数值，包括字符窜的数值
            if (blnNumber) {
                if (fltNum2 == 0 && operation == "/") {
                    return 0
                }

                var returnValue;
                if (fltNum1.indexOf(".") > 0) {
                    intNum1Digit = Math.pow(10, fltNum1.length - fltNum1.indexOf(".") - 1); //数1需要放大多少小数位
                }
                if (fltNum2.indexOf(".") > 0) {
                    intNum2Digit = Math.pow(10, fltNum2.length - fltNum2.indexOf(".") - 1); //数2需要放大多少小数位
                }
                if (operation == '*') {
                    intDigit = intNum1Digit * intNum2Digit;
                    num1 = PubNumber.round(parseFloat(fltNum1) * intNum1Digit);   //放大成整数进行运算
                    num2 = PubNumber.round(parseFloat(fltNum2) * intNum2Digit);
                }
                else {
                    intDigit = Math.max(intNum1Digit, intNum2Digit);
                    num1 = PubNumber.round(parseFloat(fltNum1) * intDigit);   //放大成整数进行运算
                    num2 = PubNumber.round(parseFloat(fltNum2) * intDigit);
                }

                switch (operation) {
                    case '+':
                        returnValue = (num1 + num2) / intDigit;
                        break;
                    case '-':
                        returnValue = (num1 - num2) / intDigit;
                        break;
                    case '*':
                        returnValue = (num1 * num2) / intDigit;
                        break;
                    case '/':
                        returnValue = num1 / num2;
                        break;
                    default:
                        throw new Error("calcDoubleFix只支持加减乘除运算");
                }
                //大余6位小数位会以指数形式显示
                if (round < 6) {
                    var pow = Math.pow(10, round);
                    returnValue = PubNumber.round(returnValue * pow) / pow;
                } else {
                    returnValue = PubNumber.round(returnValue * 1000000) / 1000000;
                }
                return format ? PubNumber.format(returnValue, round, true) : returnValue;
            }
            else {
                throw new Error("calcDoubleFix不支持字符串的乘除减运算");
            }
        },
        //四舍五入
        round: function (dec, decimals) {
            dec = $.toNum(dec);
            var step;
            var temp;

            dec = Math.round(dec * 100000000) / 100000000;

            if (dec == 0) {
                return dec;
            }
            else {
                temp = Math.abs(dec);
                if (decimals == 0 || decimals == undefined) {
                    temp = Math.round(temp);
                }
                else if (decimals > 0) {
                    step = Math.pow(10, decimals);
                    temp = Math.round(temp * step) / step;
                }

                if (dec > 0) { dec = temp; }
                else { dec = -temp; }
            }
            return dec;
        },
        /** 
        * 将数值四舍五入后格式化. 
        * 
        * @param num 数值(Number或者String) 
        * @param cent 要保留的小数位(Number) 
        * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型); 
        * @return 格式的字符串,如'1,234,567.45' 
        * @type String 
        */
        format: function (num, cent, isThousand) {
            num = num.toString().replace(/\$|\,/g, '');
            cent = !cent ? 2 : cent;
            isThousand = isThousand == 0 ? 0 : 1;

            // 检查传入数值为数值类型   
            if (isNaN(num)) {
                num = "0";
            }

            // 获取符号(正/负数)   
            sign = (num == (num = Math.abs(num)));

            num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);  // 把指定的小数位先转换成整数.多余的小数位四舍五入   
            cents = num % Math.pow(10, cent);              // 求出小数位数值   
            num = Math.floor(num / Math.pow(10, cent)).toString();   // 求出整数位数值   
            cents = cents.toString();               // 把小数位转换成字符串,以便求小数位长度   

            // 补足小数位到指定的位数   
            while (cents.length < cent)
                cents = "0" + cents;

            if (isThousand) {
                // 对整数部分进行千分位格式化.   
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            }

            if (cent > 0)
                return (((sign) ? '' : '-') + num + '.' + cents);
            else
                return (((sign) ? '' : '-') + num);
        },
        /** 
        * 将千分位格式的数字字符串转换为浮点数 
        * @public 
        * @param string sVal 数值字符串 
        * @return float 
        */
        unformat: function (sVal) {
            var fTmp = parseFloat(sVal.replace(/,/g, ''));
            return (isNaN(fTmp) ? 0 : fTmp);
        }
    }
})();
 
