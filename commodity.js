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

window.onload = function () {

    //    commodityDetail.init();
    //    commodityDetail.clickAnnouncement();
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
            var mainScroll = new IScroll("#mainWrapper", {
                probeType: 3
                , bounce: false
            });

            var scaleValue = 10;
            var searchOpacity = 0;

            function animateScroll() {
                var y = this.y >> 0,
                    that = this;

                console.log(this);
                if (y <= 0) {
                    //                    $('.container').css('transform', 'translateY(' + y + 'px)');
                    //                    $('#scroller').css('transform', 'translate(0,0)');


                    if (y >= -10) {
                        $('.header img').css('filter', 'blur(' + -y + 'px)');
                    }

                    if (y === 0) {
                        $('.header img').css('filter', 'blur(0px)');
                        $('.brandIcon').css('transform', 'scale(1)');
                        $('.favoriteIcon').css('transform', 'scale(1)');
                        $('.spell').css('opacity', 1).show();
                        $('.header').removeClass('headerPosition');
                        $('.hswm_search').css({ 'display': 'none', 'opacity': 0 })
                        $('.container').css('transform', 'translateY(0px)');
                    }

                }
                if (y <= -10 && this.distY < 0 && scaleValue) {
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
                if (y >= -20 && this.distY > 0 && scaleValue < 10) {
                    //图标放大
                    scaleValue += 1;
                    $('.brandIcon').css('transform', 'scale(' + (scaleValue == 10 ? 1 : '.' + scaleValue) + ')');
                    $('.favoriteIcon').css('transform', 'scale(' + (scaleValue == 10 ? 1 : '.' + scaleValue) + ')');
                    $('.spell').css('opacity', scaleValue == 10 ? 1 : '.' + scaleValue);
                    if (scaleValue == 10) {
                        $('.spell').show();
                    }
                }
                if (y <= -30 && this.distY < 0 && searchOpacity < 10) {
                    searchOpacity += 1;
                    $('.hswm_search').css({ 'display': 'block', 'opacity': (searchOpacity == 10 ? 1 : '.' + searchOpacity) })
                }
                if (y > -30 && this.distY > 0 && searchOpacity) {
                    searchOpacity -= 1;
                    $('.hswm_search').css({ 'display': 'block', 'opacity': (searchOpacity == 0 ? 0 : '.' + searchOpacity) })
                    if (searchOpacity == 0) {
                        $('.hswm_search').hide();
                    }
                }
                if (y <= -50) {
                    $('.header').addClass('headerPosition');
                } else {
                    $('.header').removeClass('headerPosition');
                }

                if (y <= -213) {
                    $('.co_top').appendTo('body').addClass('con_top_position');
                    $('.co_container').css('margin-top', '.3rem');
                }
                else {
                    $('.co_top').prependTo('#scroller').removeClass('con_top_position')
                    $('.co_container').css('margin-top', 0)
                }
            }



            mainScroll.on('scroll', animateScroll);
            mainScroll.on('scrollEnd', animateScroll);


            var loscc_scroller = document.querySelector(".loscc_scroller");
            var startX = moveX = endX = leftX = 0;
            loscc_scroller.addEventListener('touchstart', function (e) {
                //起始坐标
                startX = e.touches[0].pageX;
            })
            loscc_scroller.addEventListener('touchmove', function (e) {
                // 移动点坐标
                moveX = e.touches[0].pageX;

                leftX = moveX - startX;
                $('.loscc_scroller').css('left', leftX + endX);
            })
            loscc_scroller.addEventListener('touchend', function (e) {
                // 移动距离
                endX += leftX;

            })
        }
    }
})();
