
function Swipe(){
	this.id = obj.id;
	this.bgimg = obj.bgimg;
	this._w = obj._w;
	this._h = obj._h;
	this.radius = obj.radius;
	this.posX = 0; //保存鼠标点击时的x坐标
	this.posY = 0; //保存鼠标点击时的y坐标
	this.isMouseDown = false; //鼠标状态，没按下为false，按下为true
	this.coverType = obj.coverType;
	this.mask = obj.mask;
	this.percent = obj.percent;
	this.callback = obj.callback;//用户自定义的函数名
	this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	this.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
	//创建画布
	this.scratch();
	//先调用初始化方法
	this.init();
	//添加事件
	this.addEvent();
	
}

// 创建画布
Swipe.prototype.scratch = function(){
	this.dom = document.createElement("canvas");
	this.dom.setAttribute("class",this.id);
	this.dom.setAttribute("width",this._w);
	this.dom.setAttribute("height",this._h);
	this.dom.setAttribute("style","background:url("+this.bgimg+");background-size: cover;");
	this.context = this.dom.getContext("2d");
	swipe.appendChild(this.dom);
};
//设置canvas的图形组合方式，并且填充颜色
Swipe.prototype.init = function(){
	// 如果coverType是颜色
	if(this.coverType === "color"){
		this.context.fillStyle = this.mask;
		this.context.fillRect(0,0,this._w,this._h);
		this.context.globalCompositeOperation = "destination-out";
	}
	// 如果coverType是图片
	if(this.coverType === "img"){
		var img01 = new Image();
		img01.src = this.mask;
		var that = this;
		img01.onload=function(){
			that.context.drawImage(img01,0,0,img01.width,img01.height,0,0,that._w,that._h);
			that.context.globalCompositeOperation = "destination-out";
		};
	};
};
//添加自定义监听事件PC端为mousedown，mousemove，移动端为touchstart，touchmove
Swipe.prototype.addEvent = function(){
	//检测用户的设备类型，移动端返回true，pc返回false
	this.o = this.getAllOffset(this.dom);
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	this.clickEvent = this.device ? "touchstart":"mousedown";
	this.moveEvent = this.device ? "touchmove":"mousemove";
	this.endEvent = this.device ? "touchend":"mouseup";
	var that = this;
	this.dom.addEventListener(this.clickEvent,function(evt){
		var event = evt || window.event;
		that.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		that.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		// 获取鼠标点击或者手指点击时视口的坐标
		that.posX = that.device?event.touches[0].clientX:event.clientX;
		that.posY = that.device?event.touches[0].clientY:event.clientY;
		that.drawArc((that.posX-that.o.allLeft)+that.scrollLeft,(that.posY-that.o.allTop)+that.scrollTop);
		that.isMouseDown = true; //鼠标按下
	});
	this.dom.addEventListener(this.moveEvent,function(evt){
		if( !that.isMouseDown ){
			return false;
		}else{
			var event = evt || window.event;
			// 调用canvas画线，将鼠标移动时坐标作为lineTo()参数传入。注意上一次点击时的坐标点作为画线的起始坐标
			that.drawLine((that.postX-that.o.allLeft)+that.scrollLeft,(that.posY-that.o.allTop)+that.scrollTop,(that.x2-that.o.allLeft)+that.scrollLeft,(that.y2-that.o.allTop)+that.scrollTop);
			that.x2 = that.device?event.touches[0].clientX:event.clientX;
			that.y2 = that.device?event.touches[0].clientY:event.clientY;
			//鼠标边移动边画线，因此需要把上一次移动的点作为下一次画线的起始点	
		}
	});
	this.dom.addEventListener(this.endEvent,function(evt){
		that.isMouseDown = false; //鼠标未按下
		//检测透明点的个数
		var n = that.getPercent();
		//调用同名的全局函数
		that.callback.call(null,n);
		if( n > that.percent ){
			// alert("擦除完成");
			that.context.clearRect(0,0,that._w,that._h);
		}
	});
};
// 画圆，圆心坐标为鼠标的坐标点
Swipe.prototype.drawArc = function(x1,y1){
	this.context.save();
	this.context.beginPath();
	this.context.arc(x1,y1,this.radius,0,2*Math.PI);
	this.context.fillStyle = "red";
	this.context.fill();
	this.context.stroke();
	this.context.restore();
};
Swipe.prototype.drawLine = function(x1,y1,x2,y2){
	this.context.save();
	this.context.beginPath();
	this.context.moveTo(x1,y1);
	this.context.lineTo(x2,y2);
	this.context.lineWidth =this.radius*2;  //笔刷线条的大小
	this.context.lineCap = "round"; // 连接点效果为圆的
	this.context.strokeStyle = "rgb(255,125,40)"; //笔刷的颜色
	this.context.stroke();	
	this.context.restore();

};
// 获取透明点占总像素点的百分比
 Swipe.prototype.getPercent = function(){
	this.num=0;
	this.imgData = this.context.getImageData(0,0,this._w,this._h);
	for (var i = 0; i < this.imgData.data.length; i+=4) {
		if( this.imgData.data[i+3] === 0){
			this.num++;
		}
	}
	this.transpercent = (this.num/(this._w*this._h))*100;
	console.log( "透明点占总面积的百分比："+ this.transpercent.toFixed(2) + "%" );
	return this.transpercent;
};
Swipe.prototype.getAllOffset = function (obj){
		var Top = 0;
		var Left = 0;
		while(obj){//隐式转换规则：null,nudefined,NaN,0,"",返回false；非0数字，非空字符串，对象返回true
			Top += obj.offsetTop+obj.clientTop; 
			Left += obj.offsetLeft+obj.clientLeft;
			obj = obj.offsetParent;
		}
		return {"allTop":Top,"allLeft":Left};
	};



