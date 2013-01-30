/**
 * @author 12050231
 * 
 */
/*
    a simple JavaScript library for bookshop by PPanda
    my sametime： 12050231
    for ios 4.35+
*/

//a simple JavaScript library 
(function(w, S, undefined){
	if(w[S] === undefined){
		w[S] = {};
	}
	ST = w[S];
    var doc = w.document;
    //一些常用方法
	ST = {
        //get Element
		D: function(el){
            return typeof el == "string" ? doc.querySelector(el) : el;
        },
        //get Tags and className as a array
        DA: function(el){
            return typeof el == "string" ? doc.querySelectorAll(el) : el;
        },
        each: function(el, Fn){
            for(var i = 0,l = el.length; i < l; i++){
                Fn(i)
            }
        },
        dEach: function(){
            if(arguments.length == 0){return}
            if(typeof arguments[0] == "string"){
                if(arguments[0].indexOf(",") > -1){
                    var str = arguments[0].split(",");
                    var arr = [];
                    for(var i = 0; i < str.length; i++){
                        arr.push(doc.querySelector(str[i]));
                    }
                    return arr;
                }else{
                    return doc.querySelectorAll(arguments[0]);
                }
            }else{
                return arguments[0]
            }
        },
        find: function(el,tag){
            var a = arguments[0], t = null;
            if(typeof a == "string"){
                t = document.querySelector(el).querySelectorAll(tag);
            }else{
               if(a.length == null){
                  return a.querySelectorAll(tag);
               }
               for(var k = 0;k < a.length; k++){
                    for(var j = 0; j < a[k].querySelectorAll(tag).length; j++){
                        t.push(a[k].querySelectorAll(tag)[j]);
                    }
                } 
            }
            return t;
        },
        eq: function(el, i){
            return S.DA(el)[i]
        },
        bind: function(el, type, Fn){
            el.addEventListener(type, Fn, false);
        }
	}
    //
	ST.EVA = function(o, r){
		var p;
		for(p in r){
			o[p] = r[p]
		}
	}
    ST.DOM = function(p, Fn){
        HTMLElement.prototype[p] = Fn;
    }
    //
    ST.DeviceMotionEvent = function(Fn){
        var SHAKE_THRESHOLD = 1800;
        var lastUpdate = 0;
        var end = false;
        var x, y, z, last_x, last_y, last_z;
        if(window.DeviceMotionEvent){
            ST.bind(window, "devicemotion", shakeHandler)
        }
        function shakeHandler(eventData) {
          var acceleration = eventData.accelerationIncludingGravity;
          var curTime = new Date().getTime();
          if ((curTime - lastUpdate) > 100) {
              var diffTime = (curTime - lastUpdate);
              lastUpdate = curTime;
              x = acceleration.x;
              y = acceleration.y;
              z = acceleration.z;
              var speed = Math.abs(x+y+z-last_x-last_y-last_z) / diffTime * 10000;
              //
              if (speed > SHAKE_THRESHOLD && !end) {
                    end = true;
                    if(Object.prototype.toString.call(Fn) === "[object Function]"){
                        Fn();
                    }
                    setTimeout(function(){
                        end = false;
                    },800)
                    return;
              }
              last_x = x;
              last_y = y;
              last_z = z;
            } 
        }
    }
	window.S = ST;
})(window, "S");

;(function(S){
    ST.DOM("show", function(){
        this.style.display = "block";
    });
    ST.DOM("hide", function(){
        this.style.display = "none";
    });
})(ST)

//一些书城专用绝对封装的组建方法库，不允许随便修改
ST.Widget = Object.create({
    //滚动加载方法，未做延迟载入，需要一个id="#load_placeholder"的标签在页面底部
    ScrollLoad: function(Fn){
        var placeholder = S.D("#load_placeholder");
        S.bind(window, "scroll", function(){
            if(window.pageYOffset + window.innerHeight > placeholder.offsetTop - 2){
                placeholder.innerHTML = "<img width='9' height='9' src='images/loading.gif' style='vertical-align:middle;' /> 正在加载";
                if(Object.prototype.toString.call(Fn) === "[object Function]"){
                    Fn();
                }
            }
        })
    },
    //搜索框随机排序功能
    SearchPop: function(boxEl, subEl){
        var box = ST.D(boxEl);
        var a = ST.DA(subEl);
        //var arr = [[],[]];
        //var arrOffset = [[],[]];
        var arrTmp = [];
        var offline_html = document.createDocumentFragment();
        ST.each(a, function(i){
            var randomColor = Math.random().toString(16).substr(3,6);

            a[i].style.color = "#" + randomColor;
            arrTmp.push(a[i])
            
            // var randomL = parseInt(Math.random() * 320);
            // var randomT = parseInt(Math.random() * 300);
            // arrOffset[0] = a[i].offsetWidth;
            // arrOffset[1] = a[i].offsetHeight;
            // arr[0] = randomL;
            // arr[1] = randomT;

            // if(i%3){
            //     console.log(i)
            // }
            // arrTmp.push(arr)
            // //console.log(arrOffset)
            // setPos();
            //console.log(arrTmp);
            // for(var j = 0; j<arrTmp.length;j++){
            //     for(var k = 0; k<arrTmp.length; k++){
            //         console.log(arrTmp[k][1])
            //         if(arrTmp[j][1] - arrTmp[k][1] < 34){
            //             arrTmp[j][1] = parseInt(Math.random() * 300);
            //             //console.log(arr)
            //         }else{
            //             setPos()
            //         }
            //     }
            // }
            
            // function setPos(){
            //     a[i].style.left = randomL-a[i].offsetWidth < 0 ? 0 : randomL-a[i].offsetWidth + "px";
            //     a[i].style.top = randomT-a[i].offsetHeight < 0 ? 0 : randomT-a[i].offsetHeight + "px";
            // }
            

                
        })
        
        function showList(){
            box.innerHTML = "";
            arrTmp.sort(function(){return (Math.random()<0.5?1:-1)});
            for(var i =0,l = arrTmp.length; i < l; i++){
                offline_html.appendChild(arrTmp[i]);
            }
            box.appendChild(offline_html);
            box.style.display = "block";
        }
        showList();
            
    },
    //搜索框异步获取数据随机排序功能
    Shake: function(){
        ST.DeviceMotionEvent(getData);
        function getData(){
            ST.D("#search_box").innerHTML = "<img width='9' height='9' src='images/loading.gif' style='vertical-align:middle;' /> 正在加载";
            ST.get("data/search_data.html", function(data){
                ST.D("#search_box").innerHTML = data;
                ST.Widget.SearchPop("#search_box","a");
            });
        }  
    },
    //评论功能
    Comment: function(){
        var comment_trigger = ST.D("#write_comment"),
            comment_area_box = ST.D("#comment_area"),
            comment_star = ST.find(ST.D("#choose_star"), "span"),
            comment_textarea = ST.find(comment_area_box, "textarea")[0],
            comment_close = ST.find(comment_area_box, ".close")[0]
            len = comment_star.length,
            mask = document.createElement("div"),
            fullHegiht = document.body.offsetHeight;
            mask.id = "maskA";
            mask.style.height = fullHegiht + "px";
        ST.bind(comment_trigger,"click", function(){
            document.body.appendChild(mask)
            comment_area_box.show();
            comment_textarea.focus();
            ST.each(comment_star, function(i){
                (function(i){
                    ST.bind(comment_star[i], "touchstart", function(){
                        for(var k = i;k<len;k++){
                            comment_star[k].className = "starB";
                        }
                        for(var j = i;j>-1;j--){
                            comment_star[j].className = "starB-on";
                        }
                    })
                })(i)
            });
            ST.bind(comment_close, "click", function(){
                comment_area_box.hide();
                mask.parentNode.removeChild(mask);
            })
        })
    }
});
//简单的ajax get方法，无post
ST.EVA(ST, {
    get: function(url, Fn){
        var xhr;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                Fn(xhr.responseText);
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    }
});

