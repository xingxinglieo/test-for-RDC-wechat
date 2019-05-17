// var timerId = null;
// 封装动画的函数
function animate(element, target, interval, direction) {
	// 通过判断，保证页面上只有一个定时器在执行动画
	if (element.timerId) {
		clearInterval(element.timerId);
		element.timerId = null;
	}
	if (direction == 'left') {
		element.timerId = setInterval(function() {
			// 步进  每次移动的距离
			var step = 30;
			// 盒子当前的位置
			var current = element.offsetLeft;
			// 当从400 到 800  执行动画
			// 当从800 到 400  不执行动画

			// 判断如果当前位置 > 目标位置 此时的step  要小于0
			if (current > target) {
				step = -Math.abs(step);
			}

			// Math.abs(current - target)   <= Math.abs(step)
			if (Math.abs(current - target) <= Math.abs(step)) {
				// 让定时器停止
				clearInterval(element.timerId);
				// 让盒子到target的位置
				element.style.left = target + 'px';
				return;
			}
			// 移动盒子
			current += step;
			element.style.left = current + 'px';
		}, interval);
	}
	if (direction == 'top') {
		element.timerId = setInterval(function() {
			// 步进  每次移动的距离
			var step = 30;
			// 盒子当前的位置
			var current = element.offsetTop;
			// 当从400 到 800  执行动画
			// 当从800 到 400  不执行动画

			// 判断如果当前位置 > 目标位置 此时的step  要小于0
			if (current > target) {
				step = -Math.abs(step);
			}

			// Math.abs(current - target)   <= Math.abs(step)
			if (Math.abs(current - target) <= Math.abs(step)) {
				// 让定时器停止
				clearInterval(element.timerId);
				// 让盒子到target的位置
				element.style.top = target + 'px';
				return;
			}
			// 移动盒子
			current += step;
			element.style.top = current + 'px';
		}, interval);
	}
}
function drag(dom) {
	var boxleft, boxtop;
	var marked =false;
	dom.addEventListener("mousedown", function(e) {
		marked =true;
		dom.style.cursor = 'move';
		boxleft = e.pageX - dom.offsetLeft; //获取鼠标在盒子中横向位置
		boxtop = e.pageY - dom.offsetTop; //获取鼠标在盒子中的枞向位置
		document.addEventListener("mousemove",function(e) {
			if (marked) {
				dom.style.top = (e.pageY - boxtop) + 'px';
				dom.style.left = (e.pageX - boxleft) + 'px';
			}
		}) 
	})

	dom.addEventListener("mouseup", function() {
		marked = false;
		dom.style.cursor = 'default';
	})
}

