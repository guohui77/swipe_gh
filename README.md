# 擦除组件效果说明 #
=============================
+ 1、 组件介绍
	原生JS实现，不需要依赖任何js库。实现了兼容pc与手机端，所有的参数都可以修改。
+ 2、 使用方法
	| 在HTML中擦创建一个id名为swipe的div; |  
	| id:字符串，canvas的class类名; |  
	| _w:数字，需要设置的画布的宽; |  
	| _h:数字，需要设置的画布的高; |  
	| radius:擦除圆点的半径; |  
	|  coverType:canvas的覆盖类型，可以有两种取值img或者color，img需要制定图片路径；|  
	| //如果是color则需要给出颜色值，可以使字符串或者十六进制或者rgb(); |  
	| mask://颜色,图片路径; |  
	| bgimg://背景图片路径; |  
	| percent://当透明面积查过此处指定的数字，则提示擦除完成; |  
	| callback://用户自定义回调函数名称; |  
	例如：
		// 需要给要加的地方id必须是swipe
		var obj = {
			id:"cas",
			_w:"375",
			_h:"667",
			radius:"20",
			coverType:"img",
			mask:"images/wipe2.jpg",
			bgimg:"images/wipe1.jpg",
			percent:50,
			callback:ok,
		};
		
+ 3、 回调函数
	用户在脱模完成之后继续操作必须写到此毁掉函数中
	例如：
	function ok(transPercent){
		if(transPercent>50){
		console.log("透明度超过百分之五十，查看底图");
		}
	}
+ 4、 联系方法
	邮箱：2221273125@qq.com