var util = (function(){
	var u = {
		unique: function(arr){ //数组去重
			var param = {}, result = [], len = arr.length, val, type;
			    for (var i = 0; i < len; i++) {
			        val = arr[i];
			        type = typeof val;
			        if(!param[val]){
			            param[val] = [type];
			            result.push(val);
			        }else if(param[val].indexOf(type) < 0) {
			            param[val].push(type);
			            result.push(val);
			        }
			    }
			return result;
		},
		compare: function(pro){ //对象数组根据属性排序 比较函数
			return function(a,b){
				if(a && b && typeof a === 'object' && typeof b === 'object'){
					var param1 = a[pro],
						param2 = b[pro];
					if(param1 === param2){
						return 0;
					}
					if(typeof param1 === typeof param2){
						return param1 < param2 ? -1 : 1;
					}
					return typeof a < typeof b ? -1 : 1;
				}else{
					throw('error');
				}
			}
		},
		isEmptyObject: function(obj){ //判断对象是否为空
			for (var pro in obj) {
				return false;
			}
			return true;
		},
		//获取url ? 后面的参数
		getUrlParam: function(name){
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', "ig").exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},
		//加载样式文件
		loadStyle: function(url){
			try {
	            document.createStyleSheet(url);
	        } catch(e) {
	            var cssLink = document.createElement('link');
	            cssLink.rel = 'stylesheet';
	            cssLink.type = 'text/css';
	            cssLink.href = url;
	            var head = document.getElementsByTagName('head')[0];
	            head.appendChild(cssLink);
	        }
		},
		//获取ie版本号 9以下，其他浏览器返回false
		getIeVersion: function(){
			var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		    while (
		        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		        all[0]
		    );
		    return v > 4 ? v : false ;
		},
		//添加类class（ie8+）
		addClass: function(el, className){
			if (el.classList){
			  	el.classList.add(className);
			}else{
			  	el.className += ' ' + className;
			}
		},
		//自定义tap事件(解决cick 300ms 延迟问题)
		createTapEvent: function(){
			if(!HTMLElement.prototype.addTapEvent) {
				HTMLElement.prototype.addTapEvent = function(callback) {
					var tapStartTime = 0,
						tapEndTime = 0,
						tapTime = 500, //tap等待时间，在此事件下松开可触发方法
						tapStartClientX = 0,
						tapStartClientY = 0,
						tapEndClientX = 0,
						tapEndClientY = 0,
						tapScollHeight = 15, //水平或垂直方向移动超过15px测判定为取消（根据chrome浏览器默认的判断取消点击的移动量)
						cancleClick = false;
					this.addEventListener('touchstart', function() {
						tapStartTime = event.timeStamp;
						var touch = event.changedTouches[0];
						tapStartClientX = touch.clientX;
						tapStartClientY = touch.clientY;
						cancleClick = false;
					})
					this.addEventListener('touchmove', function() {
						var touch = event.changedTouches[0];
						tapEndClientX = touch.clientX;
						tapEndClientY = touch.clientY;
						if((Math.abs(tapEndClientX - tapStartClientX) > tapScollHeight) || (Math.abs(tapEndClientY - tapStartClientY) > tapScollHeight)) {
							cancleClick = true;
						}
					})
					this.addEventListener('touchend', function() {
						tapEndTime = event.timeStamp;
						if(!cancleClick && (tapEndTime - tapStartTime) <= tapTime) {
							callback();
						}
					})
				}
			}
		},
		stopBubble: function(e){
		    e = e || window.event;  
		    if(e.stopPropagation){
		        e.stopPropagation();  //W3C阻止冒泡方法  
		    }else {
		        e.cancelBubble = true; //IE阻止冒泡方法  
		    }  
		},
		backTop: function(btnId) {
		    var btn = document.getElementById(btnId);
		    var d = document.documentElement;
		    var b = document.body;
		    window.onscroll = set;
		    btn.style.display = "none";
		    btn.onclick = function() {
		        btn.style.display = "none";
		        window.onscroll = null;
		        this.timer = setInterval(function() {
		            d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
		            b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
		            if ((d.scrollTop + b.scrollTop) == 0) clearInterval(btn.timer, window.onscroll = set);
		        }, 10);
		    };
		    function set() {
		        btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block': "none"
		    }
		},
		checkNetwork: function(){
	      	return navigator.onLine ? true : false;
		},
		validate: {
			isEmail: function(str){
				return  /^(?:\w+\.)*\w+@\w+(?:\.\w+)+$/i.test(str);
			},
			isIdCard: function(str){
				return /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(str);
			},
			isPhone: function(str){
				return /^1[3-9]\d{9}$/.test(str);
			},
			isUrl: function(str){
				return /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i.test(str);
			}
		},
		device: {
			isWeChat: function(){
        		return /MicroMessenger/i.test(navigator.userAgent);
			},
			isIOS: function(){
		        return /ipad|iphone|iPod|Macintosh|mac os/i.test(navigator.userAgent);
		   	},
		   	isAndroid: function () {
		        return /Android/i.test(navigator.userAgent);
		    }
		}
	}
	return u;
})();