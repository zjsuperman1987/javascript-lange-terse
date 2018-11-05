PubAjax = (function () {
    return {
        post: function (BusinessType, date, successFun, errorFun, completeFunc) {
            date = date || {};
            date.voucher = ""
            if (BusinessType) {
                date.BusinessType = BusinessType;
            }
            date.BusinessData = {};
            var result;
            $.ajax({
                type: "POST",
                url: "/Mobile/WeChat/IndexPage.aspx",
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


var mySwiper;

window.onload = function () {



    // 设置 左边滚动菜单位置
    //    var leftHeight = $('.brandName').outerHeight() +
    //                            $('.evalute').outerHeight() +
    //                            $('.threshold').outerHeight() +
    //                            parseInt($('.threshold').css('marginTop')) +
    //                            $('.announceHide').outerHeight() +
    //                            $('.selectWrapper').outerHeight() +
    //                            $('.cocm_item_headImg').outerHeight() +
    //                            $('.specialPriceShow').outerHeight() +
    //                            $('.specialPriceShowImg').outerHeight() +
    //                            parseInt($('.GoodsList').css('marginTop'));

    //    $('#leftWrapper').css('top', leftHeight);
    //            







    //    commodityDetail.init();
    //    commodityDetail.clickAnnouncement();
    commodityDetail.initSwiper();
    commodityDetail.initScroll();
}


var commodityDetail = (function () {
    return {
        init: function () {
            var ContractGUID = PubRequest.Query("contractguid");
            var CustomerGUID = PubRequest.Query("customerGUID");

            PubAjax.post("selectcommodityDetail", {
                ContractGUID: escape(ContractGUID),
                CustomerGUID: escape(CustomerGUID)
            },
                function (result) {
                    $('.brandInfoTitle').text(PubRequest.Query("brandName"));
                });
        },
        //点击公告
        clickAnnouncement: function () {
            //公告
            var slide = document.querySelector('#wrapper')

            function toggleSlider() {
                if (slide.classList.contains('slide-up')) {
                    slide.classList.remove('slide-up');
                    $('.brandInfohide').show();
                    $('.brandInfoAnnouncementWrapper').hide();
                    $('.brandInfo_bottom').hide()
                    //底部显示
                    $('.bottom').removeClass('slide-up');
                } else {
                    slide.classList.add('slide-up');
                    $('.brandInfohide').hide();
                    $('.brandInfoAnnouncementWrapper').show();
                    $('.brandInfo_bottom').show()
                    //底部隐藏
                    $('.bottom').addClass('slide-up');
                }
            }
            $('.iconAnnouncement').on('click', toggleSlider);
            $('.brandInfo_bottom').on('click', toggleSlider);
            //选项卡
            $.each($('.secondMenu span'), function (i, item) {
                item.addEventListener("touchstart", function (e) {
                    this.classList.add("addShadow");
                })
                item.addEventListener("touchend", function (e) {
                    this.classList.remove("addShadow");
                    $(".secondMenu span i").removeClass("secondMenu_border_bottom").eq(i).addClass("secondMenu_border_bottom");
                    $('.secondMenuContent').hide().eq(i).show();
                })
            })
        },
        // 初始滚动
        initScroll: function () {
            var scaleValue = 10,
                searchOpacity = 0,
                arrayLiHeight = [],
                nextPosition = 0,
                prevPosition = 0,
                index = 0,
                isBoolean = true,
                isBottom = false,
                len;

            // 计算滑动距离
            $('.rightNav li').each(function (i, item) {
                i === 0 ? arrayLiHeight.push(-$(item).outerHeight() + $('.rn_title').outerHeight()) : arrayLiHeight.push((arrayLiHeight[i - 1] - $(item).outerHeight()));
                //                $(item).css('height', $(item).outerHeight() + 20);
            });
            len = arrayLiHeight.length;


            mainScroll = new IScroll("#mainWrapper", {
                probeType: 3,
                bounce: false,
                subMargin: -213,
                scrollbars: true
            });

            // 设置临界值状态(头部动画)
            function setStatus(status) {
                if (status) {
                    // 开启 模糊 缩小 等
                    $('.header img').css('filter', 'blur(10px)');
                    $('.brandIcon').css('transform', 'scale(0)');
                    $('.favoriteIcon').css('transform', 'scale(0)');
                    $('.spell').css('opacity', 0).hide();
                    $('.header').addClass('headerPosition');
                    $('.hswm_search').css({ 'display': 'block', 'opacity': 1 })
                } else {
                    // 关闭 模糊 缩小 等
                    $('.header img').css('filter', 'blur(0px)');
                    $('.brandIcon').css('transform', 'scale(1)');
                    $('.favoriteIcon').css('transform', 'scale(1)');
                    $('.spell').css('opacity', 1).show();
                    $('.header').removeClass('headerPosition');
                    $('.hswm_search').css({ 'display': 'none', 'opacity': 0 })
                    $('.container').css('transform', 'translateY(0px)');
                }
            }

            function animateScroll() {
                var y = this.y >> 0;

                //                console.log(y);
                if (y <= 0) {
                    $('.container').css('transform', 'translateY(' + y + 'px)');
                    $('#scroller').css('transform', 'translate(0,0)');
                }
                // 模糊
                if (y >= -10) {
                    $('.header img').css('filter', 'blur(' + -y + 'px)');
                }
                // 缩小
                if (y <= -10 && this.directionY > 0 && scaleValue) {
                    // 确保在通过 10px 移动后 模糊终值
                    $('.header img').css('filter', 'blur(' + 10 + 'px)');

                    //图标缩小
                    scaleValue -= 1;
                    $('.brandIcon').css('transform', 'scale(.' + scaleValue + ')');
                    $('.favoriteIcon').css('transform', 'scale(.' + scaleValue + ')');
                    $('.spell').css('opacity', '.' + scaleValue);
                    if (scaleValue == 0) {
                        $('.spell').hide();
                    }
                }
                // 放大
                if (y >= -20 && this.directionY < 0 && scaleValue < 10) {
                    //图标放大
                    scaleValue += 1;
                    $('.brandIcon').css('transform', 'scale(' + (scaleValue == 10 ? 1 : '.' + scaleValue) + ')');
                    $('.favoriteIcon').css('transform', 'scale(' + (scaleValue == 10 ? 1 : '.' + scaleValue) + ')');
                    $('.spell').css({ display: 'block', opacity: scaleValue == 10 ? 1 : '.' + scaleValue });
                    if (scaleValue == 10) {
                        $('.spell').show();
                    }
                }
                // 搜索栏 透明度 显示
                if (y <= -30 && this.directionY > 0 && searchOpacity < 10) {
                    searchOpacity += 1;
                    $('.hswm_search').css({ 'display': 'block', 'opacity': (searchOpacity == 10 ? 1 : '.' + searchOpacity) })
                }
                // 搜索栏 透明度 隐藏
                if (y > -30 && this.directionY < 0 && searchOpacity) {
                    searchOpacity -= 1;
                    $('.hswm_search').css({ 'display': 'block', 'opacity': (searchOpacity == 0 ? 0 : '.' + searchOpacity) })
                    if (searchOpacity == 0) {
                        $('.hswm_search').hide();
                    }
                }
                // 头部 模糊
                if (y <= -50) {
                    $('.header').addClass('headerPosition').css('clip', 'rect(0,' + window.clientWidth + 'px, .5rem, 0)');
                    // 开启 所有 效果 最终值 例如 opacity 1 scale 1
                    setStatus(1);

                } else {
                    $('.header').removeClass('headerPosition').css('clip', 'unset');
                }

                if (y <= -213) {
                    $('.selectWrapper').appendTo('body').addClass('con_top_position');
                } else {
                    $('.selectWrapper').insertAfter($('.container_inner_bottom')).removeClass('con_top_position');
                }

                if (y < -213 && this.startY > -213 || y > -213 && this.startY < -213) {
                    this.options.subMargin = -213;
                    this._translate(0, -213);
                    $('#scroller').css('transform', 'translate(0,0)');
                    $('.container').css('transform', 'translateY(' + -213 + 'px)');
                }

                // 设置 二级 定位

                if (y <= -553) {
                    if (isBoolean) {
                        $('#leftWrapper').appendTo('body').css('margin-top', '.82rem');
                        $('.rightNav li').eq(0).find('.rn_title').appendTo('body').addClass('active_rn_title');
                        $('.rightNav li').eq(0).css('margin-top', '.4rem');
                        isBoolean = false;
                    }

                    nextPosition = -553 + arrayLiHeight[index];
                    // 上拉
                    if (this.directionY > 0) {
                        if (y < nextPosition) {
                            // 把active 还原回自身li 设置bottom(添加active_rn_title_middle类)
                            $('.active_rn_title').prependTo($('.rightNav li').eq(index)).addClass('active_rn_title_middle');
                            prevPosition = nextPosition;
                            index = index === len - 1 ? len - 1 : index + 1;
                            $('.leftNav li').removeClass('activeLeft').eq(index).addClass('activeLeft');
                        }
                        if (prevPosition && y < prevPosition - 40) {
                            $('.rightNav li').eq(index - 1).find('.rn_title').removeClass('active_rn_title');
                            $('.rightNav li').eq(index)
                                            .css('margin-top', '.4rem')
                                            .find('.rn_title')
                                            .addClass('active_rn_title')
                                            .appendTo('body');
                        }
                        if (mySwiper.activeIndex != 0) {
                            $('.active_rn_title').hide();
                        } else {
                            $('.active_rn_title').show();
                        }
                    }
                    // 下拉
                    if (this.directionY < 0 || this.distY > 0) {
                        if (y > prevPosition - 40 && prevPosition) {
                            $('body>.active_rn_title').prependTo($('.rightNav li').eq(index).css('margin-top', 0))
                                                 .removeClass('active_rn_title');

                            $('.rightNav li').eq(index - 1).find('.rn_title').addClass('active_rn_title');
                            //                            isBottom = true;
                        }
                        if (y > prevPosition) {
                            $('.rightNav li').eq(index - 1).find('.rn_title').removeClass('active_rn_title_middle').appendTo('body');
                            index = index === 0 ? 0 : index - 1;
                            prevPosition = -553 + arrayLiHeight[index - 1];
                            isBottom = false;
                            $('.leftNav li').removeClass('activeLeft').eq(index).addClass('activeLeft');
                        }
                    }
                }
                else {
                    $('#leftWrapper').prependTo('.GoodsList').css('margin-top', 0);
                    $('body>.active_rn_title').prependTo($('.rightNav li').eq(0)).removeClass('active_rn_title');
                    $('.rightNav li').eq(0).css('margin-top', '0');
                    isBoolean = true;
                    index = 0;
                    prevPosition = 0;
                }
                if (y < -553 && this.startY > -553 || y > -553 && this.startY < -553) {
                    this.options.subMargin = -553;
                    this._translate(0, -553);
                    $('#scroller').css('transform', 'translate(0,0)');
                    $('.container').css('transform', 'translateY(' + -553 + 'px)');
                }

                if (y === 0) {
                    // 关闭 所有 效果 最终值 opacity 0 scale 0
                    setStatus();
                }
                if (y === this.maxScrollY) {
                    $('.leftNav li').removeClass('activeLeft').eq($('.leftNav li').length - 1).addClass('activeLeft');
                    key = true;
                }
                if (this.startY === this.maxScrollY && this.directionY < 0 && key) {
                    index = $('.leftNav li').length - 2;
                    key = false;
                    $('.leftNav li').removeClass('activeLeft').eq(index).addClass('activeLeft');

                }
            }
            function cancelScroll() {
                var y = this.y >> 0;

                $('#scroller').css('transform', 'translate(0,0)');
                $('.container').css('transform', 'translateY(' + y + 'px)');
            }


            mainScroll.on('scrollCancel', cancelScroll);
            mainScroll.on('scroll', animateScroll);
            mainScroll.on('scrollEnd', animateScroll);

            // 左边 滚动栏
            leftScroll = new IScroll('#leftWrapper', {
                probeType: 3,
                bounce: false
            });

            leftScroll.on('scroll', function () {
                var y = this.y >> 0;

                if (this.directionY < 0 && y === 0 && this.startY === 0) {

                }
            });



        },
        initSwiper: function () {
            // 点击 选项卡 阴影 
            function clickColor(elArray) {
                $.each(elArray, function (i, item) {
                    item.addEventListener('touchstart', function () {
                        this.style.background = 'rgba(128,128,128, .5)';
                    });
                    item.addEventListener('touchend', function () {
                        this.style.background = 'white';
                    });
                })
            }

            // 初始化中间分割线
            function setCss(index) {
                var index = index ? index : 0;
                var firstLineWidth = $('.co_top span').eq(index).outerWidth(),
                margin = ($('.co_top .cot_item').eq(0).outerWidth() - firstLineWidth) / 2;
                $('.border-line').css({ width: firstLineWidth, 'margin-left': margin, height: 2, background: '#1B8CE0', transition: 'width .1s' });
                $('.co_top span').css('color', 'black').eq(index).css('color', '#1B8CE0');
            }

            setCss();

            // 初始化swiper
            mySwiper = new Swiper('.swiper-container', {
                autoplay: false, //可选选项，自动滑动
                autoHeight: true, //enable auto height
                resistanceRatio: 0,
                on: {
                    setTranslate: function (translate) {
                        $('.border-line').css({ transform: 'translateX(' + -translate / 3 + 'px)' });
                    },
                    slideChangeTransitionStart: function () {
                        setCss(this.activeIndex);
                        if (this.activeIndex === 0) {
                            $('#leftWrapper').show();
                            $('.active_rn_title').show();
                        } else {
                            $('#leftWrapper').hide();
                            $('.active_rn_title').hide();
                        }
                    },
                    slideChangeTransitionEnd: function () {
                        
                    }
                }
            })

            clickColor($('.cot_item'));

            // 监听点击切换
            $('.co_top .cot_item').on('click', function () {
                mySwiper.slideTo($(this).index());
            });

            var mySwiperNest = new Swiper('.swiper-container-nest', {
                autoplay: false, //可选选项，自动滑动
                slidesPerView: 2.1,
                spaceBetween: 10,
                freeMode: true,
                nested: true,
                resistanceRatio: 0
            });

        }
    }
})();
