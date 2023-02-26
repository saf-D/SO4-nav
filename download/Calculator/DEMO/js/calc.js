
/**
 * APP配置信息
 */

window.onload = function(){
    //点击功能
    clickFunc();
};

function clickFunc(){
	var container = document.getElementById("container");
    var calc = document.getElementById("calc"),
        spans = document.getElementById("win-tool").getElementsByTagName("span"),
        equals = document.getElementById("equals"),     //等于号
        remove = document.getElementById("remove");     //删除符号

//  /*** 三个小按钮 ***/
//  var close = document.getElementById("close"),       //关闭按钮

    var resultDiv = document.getElementById("result");  //结果区域

    /*** 历史记录 ***/
    var historyBox = document.getElementById("historyBox"),
        delBtn = historyBox.querySelector(".remove a");
    var historyUl = historyBox.querySelector("ul");


    /***********关闭按钮***********/
//  close.onclick = function(e){
//      var h = calc.offsetHeight + 15;
//      calc.style.webkitTransform = "translateY("+ h+"px)";
//      calc.style.transform = "translateY("+ h+"px)";
//      e.stopPropagation();
//  };
    

    /***********点击键盘***********/
    var keyBorders = document.querySelectorAll("#bottom span"),
        express = document.getElementById("express"),//计算表达式
        res =  document.getElementById("res"),  //输出结果
        keyBorde = null;        //键盘
    var preKey = "",            //上一次按的键盘
        isFromHistory = false;  //是否来自历史记录
    //符号
    var symbol = {"+":"+","-":"-","×":"*","÷":"/","%":"%","=":"="};

    /***********键盘按钮***********/
    for(var j=0; j <keyBorders.length; j++){
        keyBorde = keyBorders[j];

        keyBorde.onclick = function() {
            var number = this.dataset["number"];
            clickNumber(number);
        };
    }
    
    /**
     * 点击键盘进行输入
     * @param {string} number 输入的内容
     * */
    function clickNumber(number){
    	var resVal = res.innerHTML;		//结果
        var exp = express.innerHTML;	//表达式
        //表达式最后一位的符号
        var expressEndSymbol = exp.substring(exp.length-1,exp.length);
        //点击的不是删除键和复位键时才能进行输入
        if(number !== "←" || number !== "C"){
        	//是否已经存在点了，如果存在那么不能接着输入点号了,且上一个字符不是符号字符
        	var hasPoint = (resVal.indexOf('.') !== -1)?true:false;
        	if(hasPoint && number === '.'){
        		//上一个字符如果是符号，变成0.xxx形式
        		if(symbol[preKey]){
        			res.innerHTML = "0";
        		}else{
        			return false;
        		}
        	}
            //转换显示符号
            if(isNaN(number)){
                number = number.replace(/\*/g,"×").replace(/\//g,"÷");
            }
            //如果输入的都是数字，那么当输入达到固定长度时不能再输入了
            if(!symbol[number] && isResOverflow(resVal.length+1)){
                return false;
            }
            //点击的是符号
            //计算上一次的结果
            if(symbol[number]){
            	//上一次点击的是不是符号键
                if(preKey !== "=" && symbol[preKey]){
                    express.innerHTML = exp.slice(0,-1) + number;
                }else{
                    if(exp == ""){
                        express.innerHTML = resVal + number;
                    }else{
                        express.innerHTML += resVal + number;
                    }
                    if(symbol[expressEndSymbol]){
                        exp = express.innerHTML.replace(/×/g,"*").replace(/÷/,"/");
                        res.innerHTML = eval(exp.slice(0,-1));
                    }
                }                  
            }else{
                //如果首位是符号，0
                if((symbol[number] || symbol[preKey] || resVal=="0") && number !== '.'){
                    res.innerHTML = "";
                }
                res.innerHTML += number;
            }
            preKey = number;
        }
    }

    /***********相等，计算结果***********/
    equals.onclick = function(){
        calcEques();
    };
    
    function calcEques(){
    	var expVal = express.innerHTML, val = "";
        var resVal = res.innerHTML;
        //表达式最后一位的符号
        if(expVal){
            var expressEndSymbol = expVal.substring(expVal.length-1,expVal.length);
            try{
                if(!isFromHistory){
                    var temp = "";
                    if(symbol[expressEndSymbol] && resVal){
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                        temp = eval(temp.slice(0,-1)) + symbol[expressEndSymbol] + resVal;
                    }else{
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                    }
                    val = eval(temp);
                }else{
                    val = resVal;
                }
            }catch(error){
                val = "<span style='font-size:1em;color:red'>Erro：计算出错！</span>";
            }finally{
                express.innerHTML = "";
                res.innerHTML = val;
                preKey = "=";
                saveCalcHistory(expVal+resVal+"="+val);
                isResOverflow(resVal.length);
                isFromHistory = false;
            }
        }
    }
	
	
    /***********移动端拨号功能***********/
    //移动端长按事件
    $(equals).on("longTap",function(){
    	//console.log("sdsdsd");
    	var num = res.innerHTML;
        if(num && num !== "0"){
			var regx = /^1[0-9]{2}[0-9]{8}$/;
			if(regx.test(num)){
				//console.log("是手机号码");
				var telPhone = document.getElementById("telPhone");
	            telPhone.href = "tel:"+num;
	            telPhone.target = "_blank";
	            telPhone.click();
			}
        }
    });
    


    /***********复位操作***********/
   	var resetBtn = document.getElementById("reset");       //复位按钮
    resetBtn.onclick = function(){
        res.innerHTML = "0";
        express.innerHTML = "";
    };

    /***********减位操作***********/
    remove.onclick = function(){
        var tempRes = res.innerHTML;
        if(tempRes.length>1){
            tempRes = tempRes.slice(0,-1);
            res.innerHTML = tempRes;
        }else{
            res.innerHTML = 0;
        }
    };

    /***********历史功能***********/
    var history = document.getElementById("history"),
        historyBox = document.getElementById("historyBox");
    var about = document.getElementById("about");
    about.onclick = history.onclick = function(e){
        e = e || window.event;
        var target = e.target.id || window.event.srcElement.id;

        historyBox.style.webkitTransform = "none";
        historyBox.style.transform = "none";
        e.stopPropagation();
        //点击的是历史
        if(target == "h"){
        	//恢复显示删除按钮
        	delBtn.style.display = "inline-block";
        	
            var keyArray = Mybry.wdb.getKeyArray();
            var separate = Mybry.wdb.constant.SEPARATE;
            keyArray.sort(function(a,b){
                var n = a.split(separate)[1];
                var m = b.split(separate)[1];
                return m - n;
            });
            var html = [],val = "";
            for(var i=0; i<keyArray.length; i++){
                val = Mybry.wdb.getItem(keyArray[i]);
                html.push("<li>"+val+"</li>");
            }
            if(html.length>0){
                historyUl.innerHTML = html.join("");
            }else{
                historyUl.innerHTML = "尚无历史记录";
            }

            //把历史记录一条数据添加到计算器
            var hLis = historyUl.querySelectorAll("li");
            for(var i=0; i<hLis.length; i++){
                hLis[i].onclick = function(){
                    var express = this.innerHTML;
                    var exp = express.split("=")[0],
                        res = express.split("=")[1];
                    resultDiv.querySelector("#express").innerHTML = exp;
                    resultDiv.querySelector("#res").innerHTML = res;
                    isFromHistory = true;
                };
            }
        }
        //点击的是关于
        if(target == "au"){
        	// 取消删除按钮显示
        	delBtn.style.display = "none";
            historyBox.children[0].children[0].innerHTML = "<div style='padding:5px;color:#000;'>"
                + "<p><i class='iconfont'>&#xe60f;</i> 一款 H5 APP.</p>"
                + "<p><i class='iconfont'>&#xe60f;</i> 在 APP 上，输入手机号码后长按 '=' 可以拨打电话</p>"
                + "<p><i class='iconfont build'>&#xe60f;</i>Version：1.0.0</p>"
                + "</div>";
            
            //检查新版本
            updateApp();    
        }
    };

    window.onclick = function(e){
        var e = e || window.event;
        var target = e.target.className || e.target.nodeName;
        //如果点击的是历史记录DIV和删除按钮DIV就不隐藏
        var notTarget =  {"con":"con","remove":"remove","UL":"UL","P":"P"};
        if(!notTarget[target]){
            //如果设置了最小化
            var ts = historyBox.style.transform || historyBox.style.webkitTransform;
            if(ts && ts == "none"){
                historyBox.style.webkitTransform = "translateY(102%)";
                historyBox.style.transform = "translateY(102%)";
            }
        }
        //恢复显示删除按钮
        //historyBox.children[1].children[0].className = "icon_del";
    };


    /***********清空历史记录***********/
    delBtn.onclick = function(e){
        var e = e || window.event;
        e.stopPropagation();
        if(Mybry.wdb.deleteItem("*")){
            historyUl.innerHTML = "尚无历史记录";
        }
    };

    /**
     * 保存计算历史记录
     * @param val 要记录的表达式
     */
    function saveCalcHistory(val){
        var key = Mybry.wdb.constant.TABLE_NAME + Mybry.wdb.constant.SEPARATE + Mybry.wdb.getId();
        window.localStorage.setItem(key,val);
    }

    /**********自动设置文字大小************/
    function isResOverflow(leng){
        var calc = document.getElementById("calc");
        var w = calc.style.width || getComputedStyle(calc).width || calc.currentStyle.width;
            w = parseInt(w);

        //判断是否是移动端
        if((Mybry.browser.versions.android || Mybry.browser.versions.iPhone || Mybry.browser.versions.iPad) && !symbol[preKey]) {
            if(leng > 15){
                return true;
            }
        }else{
            if(leng > 10){
                if(w == 300) {
                    maxCalc();
                }else{
                    if(leng > 16){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
}





