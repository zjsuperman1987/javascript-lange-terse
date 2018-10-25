PubAjax = (function() {
    return {
        post: function(BusinessType, date, successFun, errorFun, completeFunc) {
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

window.onload = function() {

    //    commodityDetail.init();
    //    commodityDetail.clickAnnouncement();
    commodityDetail.initScroll();
}


var commodityDetail = (function() {
    return {
        init: function() {
            var ContractGUID = PubRequest.Query("contractguid");
            var CustomerGUID = PubRequest.Query("customerGUID");

            PubAjax.post("selectcommodityDetail", {
                    ContractGUID: escape(ContractGUID),
                    CustomerGUID: escape(CustomerGUID)
                },
                function(result) {
                    $('.brandInfoTitle').text(PubRequest.Query("brandName"));
                });
        },
        //点击公告
        clickAnnouncement: function() {
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
            $.each($('.secondMenu span'), function(i, item) {
                item.addEventListener("touchstart", function(e) {
                    this.classList.add("addShadow");
                })
                item.addEventListener("touchend", function(e) {
                    this.classList.remove("addShadow");
                    $(".secondMenu span i").removeClass("secondMenu_border_bottom").eq(i).addClass("secondMenu_border_bottom");
                    $('.secondMenuContent').hide().eq(i).show();
                })
            })
        },
        // 初始滚动
        initScroll: function() {
            var scaleValue = 10,
                searchOpacity = 0,

                mainScroll = new IScroll("#mainWrapper", {
                    probeType: 3,
                    bounce: false,
                    subMagin: -213
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

                // console.log(y);
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
                if (y <= -50) {
                    $('.header').addClass('headerPosition');
                    // 开启 所有 效果 最终值 例如 opacity 1 scale 1
                    setStatus(1);
                } else {
                    $('.header').removeClass('headerPosition');
                }

                if (y <= -213) {
                    $('.co_top').appendTo('body').addClass('con_top_position');
                    $('.co_container').css('margin-top', '.3rem');
                } else {
                    $('.co_top').prependTo('#scroller').removeClass('con_top_position')
                    $('.co_container').css('margin-top', 0)
                }

                if (y < -213 && this.startY > -213 || y > -213 && this.startY < -213) {
                    this.options.subMagin = -213;
                    this._translate(0, -213);
                    $('#scroller').css('transform', 'translate(0,0)');
                    $('.container').css('transform', 'translateY(' + -213 + 'px)');
                }

                // 设置 二级 定位

                if (y <= -774) {
                    $('.purple').appendTo('body').addClass('purple_test');
                    $('.test').css('margin-top', '.3rem');
                } else {
                    $('.purple').insertAfter($('.test')).removeClass('purple_test')
                    $('.test').css('margin-top', 0)
                }


                if (y < -774 && this.startY > -774 || y > -774 && this.startY < -774) {
                    this.options.subMagin = -774;
                    this._translate(0, -774);
                    $('#scroller').css('transform', 'translate(0,0)');
                    $('.container').css('transform', 'translateY(' + -774 + 'px)');
                }

                if (y === 0) {
                    // 关闭 所有 效果 最终值 opacity 0 scale 0
                    setStatus();
                }
            }

            mainScroll.on('scroll', animateScroll);
            mainScroll.on('scrollEnd', animateScroll); 
        },
        initSwiper: function() {

        }
    }
})();
