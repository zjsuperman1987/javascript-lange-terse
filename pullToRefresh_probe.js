/*!
* pull to refresh v2.0
*author:gzj / zj   IScroll.utils  不能调用
*2018-10-22
*/
(function (window, document, Math) {
    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 1000 / 60); };


    var refresher = {

        info: {
            "pullDownLable": "",
            "pullingDownLable": "Release to refresh...",
            "pullUpLable": "",
            "pullingUpLable": "Release to load more...",
            "loadingLable": "Loading..."
        },
        init: function (parameter) {
            var wrapper = document.getElementById(parameter.id);
            var div = document.createElement("div");

            div.className = "scroller";
            wrapper.appendChild(div);

            var scroller = wrapper.querySelector(".scroller");
            var list = wrapper.querySelector("#" + parameter.id + " ul");

            scroller.insertBefore(list, scroller.childNodes[0]);

            this.options = {};

            for (var i in parameter) {
                this.options[i] = parameter[i];
            }




            if (parameter.headAnimation) {
                var pullDown = document.createElement("div");
                pullDown.className = "pullDown";
                var loader = document.createElement("div");
                loader.className = "loader";
                for (var i = 0; i < 4; i++) {
                    var span = document.createElement("span");
                    loader.appendChild(span);
                }
                pullDown.appendChild(loader);
                var pullDownLabel = document.createElement("div");
                pullDownLabel.className = "pullDownLabel";
                pullDown.appendChild(pullDownLabel);
                scroller.insertBefore(pullDown, scroller.children[0]);
                var pullUp = document.createElement("div");
                pullUp.className = "pullUp";
                var loader = document.createElement("div");
                loader.className = "loader";
                for (var i = 0; i < 4; i++) {
                    var span = document.createElement("span");
                    loader.appendChild(span);
                }
                pullUp.appendChild(loader);
                var pullUpLabel = document.createElement("div");
                pullUpLabel.className = "pullUpLabel";
                var content = document.createTextNode(refresher.info.pullUpLable);
                pullUpLabel.appendChild(content);
                pullUp.appendChild(pullUpLabel);
                scroller.appendChild(pullUp);
                var pullDownEl = wrapper.querySelector(".pullDown");
                var pullDownOffset = pullDownEl.offsetHeight;
                var pullUpEl = wrapper.querySelector(".pullUp");
                var pullUpOffset = pullUpEl.offsetHeight;
            }
            if (parameter.semicircle) {
                var semicircle_up_wrapper = document.createElement('div');
                var semicircle_up = document.createElement('i');
                semicircle_up.classList.add('semicircle_up');
                semicircle_up_wrapper.classList.add('semicircle_up_wrapper');
                semicircle_up_wrapper.appendChild(semicircle_up);

                var semicircle_down_wrapper = document.createElement('div');
                var semicircle_down = document.createElement('i');
                semicircle_down.classList.add('semicircle_down');
                semicircle_down_wrapper.classList.add('semicircle_down_wrapper');
                semicircle_down_wrapper.appendChild(semicircle_down);

                scroller.insertBefore(semicircle_up_wrapper, scroller.children[0]);
                scroller.appendChild(semicircle_down_wrapper);

                this.semicircle_up_dom = semicircle_up_wrapper;
                this.semicircle_down_dom = semicircle_down_wrapper;

                if (parameter.semicircle) {
                    this.options.semicircleDragCount = 0;
                }
            }

            if (parameter.headAnimation) {
                this.scrollIt(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset);
            } else {
                this.scrollIt(parameter);
            }


        },
        scrollIt: function (parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset) {
            var that = this,
                semicircle_up_wrapper = this.semicircle_up_dom,
                semicircle_up = semicircle_up_wrapper.querySelector('i'),
                semicircle_down_wrapper = this.semicircle_down_dom,
                semicircle_down = semicircle_down_wrapper.querySelector('i');



            if (parameter.headAnimation) {
                eval(parameter.id + "= new IScroll('#' + parameter.id, { probeType: 3, startY: -40, headAnimation:true, minScrollY: -pullDownOffset, bounce:false, onRefresh: function () {refresher.onRelease(pullDownEl,pullUpEl);} })");
                pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
            } else {
                eval(parameter.id + "= new IScroll('#' + parameter.id, { probeType: 3, bounce:false, } )");
            }


            document.addEventListener('touchmove', function (e) {
                e.preventDefault();
            }, false);


            //滚动
            eval(parameter.id).on('scroll', function () {
                var y = this.y >> 0;
                console.log(y);
                if (parameter.headAnimation) {
                    if (y > -pullUpOffset) {
                        // pullDownEl.id = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
                        if (this.options.minScrollY) {
                            this.options.minScrollY = -pullUpOffset;
                        }
                    }
                    if (y > 0) {
                        pullDownEl.classList.add("flip");
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullingDownLable;
                        this.options.minScrollY = 0;
                    }
                    console.log(y, this.maxScrollY);
                    if (this.scrollerHeight < this.wrapperHeight && y < (-pullUpOffset) || this.scrollerHeight > this.wrapperHeight && y <= this.maxScrollY + 5) {
                        pullUpEl.style.display = "block";
                        pullUpEl.classList.add("flip");
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullingUpLable;
                    }
                    // if (this.scrollerHeight < this.wrapperHeight && y > (-pullUpOffset) && pullUpEl.id.match('flip') || this.scrollerHeight > this.wrapperHeight && y > (this.maxScrollY - pullUpOffset) && pullUpEl.id.match('flip')) {
                    //     pullDownEl.classList.remove("flip");
                    //     pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
                    // }
                }

                // 拖动半月阴影
                if (parameter.semicircle.drag) {
                    if (y === 0 && this.directionY < 0 && this.startY === 0 && that.options.semicircleDragCount <= 30 && !that.options.headAnimation) {
                        semicircle_up_wrapper.style.display = 'block';
                        semicircle_up.style.height = that.options.semicircleDragCount++ + 'px';
                    }
                    if (y === this.maxScrollY && this.directionY > 0 && this.startY === this.maxScrollY && that.options.semicircleDragCount <= 30) {
                        semicircle_down_wrapper.style.display = 'block';
                        semicircle_down.style.height = that.options.semicircleDragCount++ + 'px';
                    }
                }
            })





            //滚动结束
            eval(parameter.id).on("scrollEnd", function () {
                var y = this.y >> 0;
                 
                if (parameter.headAnimation) {
                    if (pullDownEl.className.match('flip') /*&&!pullUpEl.className.match('loading')*/) {
                        pullDownEl.classList.add("loading");
                        pullDownEl.classList.remove("flip");
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.loadingLable;
                        pullDownEl.querySelector('.loader').style.display = "block"
                        pullDownEl.style.lineHeight = "20px";
                        if (parameter.pullDownAction) parameter.pullDownAction();
                    }
                    if (pullUpEl.className.match('flip') /*&&!pullDownEl.className.match('loading')*/) {
                        pullUpEl.classList.add("loading");
                        pullUpEl.classList.remove("flip");
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.loadingLable;
                        pullUpEl.querySelector('.loader').style.display = "block"
                        pullUpEl.style.lineHeight = "20px";
                        if (parameter.pullUpAction) parameter.pullUpAction();
                    }
                }

                // 自动 半圆
                if (parameter.semicircle) {
                    if (y === 0 && this.startY !== 0 && !this.options.headAnimation) {
                        semicircle_up_wrapper.style.display = 'block';
                        semicircle_up.style.height = '30px';
                        that._animate(0, 0, 600, semicircle_up_wrapper);
                    }
                    if (y === this.maxScrollY && this.startY !== this.maxScrollY) {
                        semicircle_down_wrapper.style.display = 'block';
                        semicircle_down.style.height = '30px';
                        that._animate(0, 0, 600, semicircle_down_wrapper);
                    }
                    if (that.options.semicircleDragCount) {
                        if (this.directionY < 0) {
                            that._animate(0, 0, 600, semicircle_up_wrapper);
                        } else {
                            that._animate(0, 0, 600, semicircle_down_wrapper);
                        }
                        that.options.semicircleDragCount = 0;
                    }
                }

            })
        },
        onRelease: function (pullDownEl, pullUpEl) {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.classList.toggle("loading");
                pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
                pullDownEl.querySelector('.loader').style.display = "none"
                pullDownEl.style.lineHeight = pullDownEl.offsetHeight + "px";
            }
            if (pullUpEl.className.match('loading')) {
                pullUpEl.classList.toggle("loading");
                pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
                pullUpEl.querySelector('.loader').style.display = "none"
                pullUpEl.style.lineHeight = pullUpEl.offsetHeight + "px";
            }
        },
        _animate: function (destX, destY, duration, dom) {
            var that = this,
            // startX = this.x,
            // startY = this.y,
                semicircle = dom.querySelector('i')
            startY = parseInt(semicircle.style.height, 10),
                startTime = new Date().getTime(),
                destTime = startTime + duration;


            function step() {
                var now = new Date().getTime(),
                    newX, newY,
                    easing;

                if (now >= destTime) {
                    that.semicircleAnimation = false;
                    // that._translate(destX, destY);
                    dom.style.display = 'none';
                    semicircle.style.height = destY + 'px';
                    // dom.style.height = destX + 'px';

                    // if ( !that.resetPosition(that.options.bounceTime) ) {
                    //     that._execEvent('scrollEnd');
                    // }
                    return;
                }

                now = (now - startTime) / duration;
                easing = IScroll.utils.ease.circular.fn(now);
                // newX = ( destX - startX ) * easing + startX;
                newY = (destY - startY) * easing + startY;
                // that._translate(newX, newY);

                semicircle.style.height = newY + 'px';
                // dom.style.height = destX + 'px';

                if (that.semicircleAnimation) {
                    rAF(step);
                }

                // if ( that.options.probeType == 3 ) {
                //     that._execEvent('scroll');
                // }
            }

            this.semicircleAnimation = true;
            step();
        }
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = refresher;
    } else if (typeof define == 'function' && define.amd) {
        define(function () { return refresher; });
    } else {
        window.refresher = refresher;
    }

})(window, document, Math);
