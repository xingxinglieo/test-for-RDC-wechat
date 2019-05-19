//登之前确保登出;
var url = 'http://120.77.247.10';
var timeIP;
var newsdata;
var iam = false;
var iamthree = false;
var au = document.querySelector('#au');
var content_one1 = '<div class="chat" mark="';
var content_one2 = '"><img src="img/联系人.png" class="friendhead"><div class="info"><div class="friendname">';
var content_two ='</div><div class = "chattip floatl"></div><div class = "chattip floatr"></div></div><div class="dot"></div></div>'
var content_three1 ='<div class="right_chat" mark="';
var content_three2 ='"><div class="right_friendname">'
var content_four ='</div></div>';
var content_five1 = '<div class="timetip">';
var content_five2 = '</div>';
var content_right ='</div><div class="chathead" style="float: right;background-image: url(img/联系人.png);"></div><div class="chats rightchat">'
var content_left ='</div><div class="chathead" style="float: left;background-image:url(img/联系人.png);"></div><div  class="chats leftchat">'
var message_content = '';
var message_one ='<div class="message_contain"><div class="ring letmiddle">详细信息</div><div class="ringg" style="background-image: url(img/联系人.png);"></div><p class="nickname">'
var message_two = '</p><p class="introdution">签名:    ';
var message_three = '</p><p class="letmiddle age">年龄:    ';
var message_four = '</p><p class="letmiddle address">地址:    ';
var message_five = '</p><p class="letmiddle mailbox">邮箱:    ';
var message_six = '	</p><input type="button" name="" class="send_btn" value="发送消息" /></div>'
var news_one = '<div style="padding:10px 10px 0px 10px;"><img  src="';
var news_two = '" style="width: 64px;height: 40px;padding-right: 10px;"/><div class="middlelist_info" link="'
var news_twoo = '<div style="padding:10px 10px 0px 10px;"><h3 class="middlelist_info" style="width:100%;" link="'
var news_twooo = '<div style="padding:10px 10px 0px 10px;"><div class="middlelist_info" style="width:100%;" link="'
var news_end = '">';
var news_three = '</div></div>';
var news_threeo = '</h3></div>';
var login_contain = document.querySelector('#login_contain');
var login_btn = document.querySelector('#login_btn');
var ctr = 0;
var load = 1;
var winblur = true;
var chatmark = null;
var rightwidth = document.querySelector('#three_contain').offsetWidth;
document.querySelector("#iframe").style.left = -rightwidth + 'px'
document.querySelector('#messagedetail').style.left = -2 * rightwidth + 'px';
var friendlist = document.querySelector('#friendlist'); //这个是包含三个容器的
if (localStorage.getItem("status") == "true") {
	document.querySelector('#remember').checked = true;
	document.querySelector('#login_account').value = localStorage.getItem('username');
	document.querySelector('#login_password').value = localStorage.getItem('password');
} else
document.querySelector('#remember').checked = false; //保存密码函数
login_btn.onclick = function() {

	$.ajaxSetup({
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true
	});
	login($('#login_account').val(), $('#login_password').val());
}
window.onfocus = function(){winblur=false};
window.onblur = function(){winblur = true};
document.querySelector("#lout").onclick = function(e) {
	$.ajax({
		type: "GET", //data 传送数据类型。post 传递
		url: url + '/getUserInfor',
		data: {
			id: myID,
		},
		dataType: 'json',
		success: function(data) {
			document.querySelector('#cnickname').value = data.message.nickname;
			document.querySelector('#cage').value = data.message.age;
			document.querySelector('#caddress').value = data.message.address;
			document.querySelector('#cintroduction').value = data.message.introduction;
			document.querySelector('#cmailbox').value = data.message.mailbox
			document.querySelector('#change').style.display = 'block';
		},
	})
	document.querySelector('#login_out').style.display = 'none';
	e.stopPropagation();
};
document.querySelector('#mask_btn').onclick = function() {
	document.querySelector('#mask').style.display = 'none';
};
document.querySelector('#chattext').addEventListener("keydown", function(e) {
	if (e.keyCode == 17) ctr = 1;
	if (e.keyCode == 13) {
		if (ctr == 0) {
			document.querySelector('#textbtn').click();
			e.preventDefault();
		} else {
			var position = this.selectionStart;
			var newvalue = insertStr(this.value, position, '\n');
			this.value = newvalue;
		}
	}
	textlist[chatmark] = this.value;
})
document.querySelector('#chattext').addEventListener("keyup", function(e) {
	if (e.keyCode == 17)
		ctr = 0;
})
document.querySelector('#textbtn').onclick = function() {
	if (chatmark == myID) {
		maskshow('无法给自己发送消息');
		return;
	}
	var text = document.querySelector('#chattext');
	if (text.value.length == 0) {
		return;
	}
	document.querySelector('#textbtn_before').style.display = 'block';
	textvalue = text.value;
	text.value = '';
	textlist[chatmark] = '';
	$.ajax({
		type: "POST",
		url: url + '/sendContent',
		data: {
			receiver: chatmark, //被接收者的userid
			content: textvalue //字符串，消息内容
		},
		dataType: 'json',
		success: function(data) {

			setTimeout(function() {
				document.querySelector('#textbtn_before').style.display = 'none';
				friendlist_son.insertBefore(marklist[chatmark], friendlist_son.children[0]); //将聊天头像提前
				RecordBefore();
				srcoll_son.style.top = '0px';
				friendlist_son.style.top = '0px';
			}, 100)
			marklist[chatmark].children[2].style.display = 'none'; //红点消失
			chatlist[chatmark].innerHTML += content_five1 + content_right + pikatoImg(textvalue) + content_five2;
			marklist[chatmark].children[1].children[1].innerText = textvalue;
			scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
			scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
				0].offsetHeight + 'px';
			if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight) {
				animate(scrolllist[chatmark].children[0], chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
					0].offsetHeight, 30, 'top');
				var speed = chatlist[chatmark].parentNode.offsetHeight / chatlist[chatmark].scrollHeight;
				animate(chatlist[chatmark], chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight, 15 *
					speed, 'top');
			}
			// document.querySelector('#rotate').style.display = 'none';

		},
		error: function(data) {
			// 			document.querySelector('#rotate').style.display = 'none';
			// 			document.querySelector('#rotate').style.display = 'block';
		}
	});
}
document.querySelector("#menu").onclick = function(e) {
	document.querySelector('#login_out').style.display = 'block';
	e.stopPropagation(); //防止事件冒泡
};
document.querySelector("#csubmit").onclick = function() {
	maskshow('请稍候..');
	var g = document.querySelector('#cnickname').value;
	var h = document.querySelector('#cage').value;
	var j = document.querySelector('#caddress').value;
	var k = document.querySelector('#cintroduction').value;
	var l = document.querySelector('#cmailbox').value;
	var exp_age = /^\d{1,2}$/; //验证年龄为1-2位数字
	var exp_mail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //验证邮箱
	if (!exp_age.test(h) || !exp_mail.test(l)) {
		maskshow('您的填写有误');
		return;
	}
	$.ajax({
		type: "POST", //data 传送数据类型。post 传递
		url: url + '/updateUserInfor',
		data: {

			nickname: g, //字符串，用户的昵称
			age: h, //字符串，用户的年龄
			address: j, //字符串，表示地址
			introduction: k, //字符串，用户的自我介绍
			mailbox: l, //字符串，用户的email

		}, //传送的数据
		dataType: 'json',
		success: function(data) {
			if (data.result == 'success') {
				document.querySelector('#change').style.display = 'none';
				maskshow('修改成功!');
			} else
				maskshow(data.message);
			$.ajax({
				type: "GET", //data 传送数据类型。post 传递
				url: url + '/getUserInfor',
				data: {
					id: myID
				},
				dataType: 'json',
				success: function(data) {
					// data.message[myID]["nickname"] = data.message.nickname;
					document.querySelector('#myname').innerHTML = data.message.nickname;
				},
			})
		},
		error: function() {
			maskshow('修改失败,请检查网络或者刷新页面');
		},
	})
}
document.querySelector('#outl').onclick = out;
document.querySelector('#history').onclick = function() {
	getChathistory(chatmark);
}
document.querySelector('#mask_btn').onclick = function(e) {
	document.querySelector('#mask').style.display = 'none';
	e.stopPropagation()
}
document.querySelector('#xx').onclick = function() {
	document.querySelector("#change").style.display = 'none';
}
document.querySelector('#barleft').onclick = function() {
	listhidden();
	iamthree = 0;
	document.querySelector('#moved').style.display = 'block';
	animate(document.querySelector('#content_contain'), 0, 7, 'left');
	document.querySelector("#friendlist_son").style.display = 'block';
	document.querySelector('#srcoll').style.display = 'block';
}
document.querySelector('#barmiddle').onclick = function() {
	listhidden();
	document.querySelector('#moved').style.display = 'none';
	animate(document.querySelector('#content_contain'), rightwidth, 7, 'left');
	document.querySelector('#middlelist').style.display = 'block';
	document.querySelector('#middlescroll').style.display = 'block';
	scrollfun(document.querySelector('#middlelist'), document.querySelector('#middlescroll_son'));
}
document.querySelector('#barright').onclick = function() {
	listhidden();
	document.querySelector('#moved').style.display = 'block';
	iamthree = 2;
	animate(document.querySelector('#content_contain'), 2 * rightwidth, 7, 'left');
	document.querySelector('#rightlist').style.display = 'block';
	document.querySelector('#rightcscroll').style.display = 'block';
}
document.querySelector('#newtip').onclick = function() {
	this.style.display = 'none';
	animate(scrolllist[chatmark].children[0], chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
		0].offsetHeight, 30, 'top');
	var speed = chatlist[chatmark].parentNode.offsetHeight / chatlist[chatmark].scrollHeight;
	animate(chatlist[chatmark], chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight, 15 * speed,
		'top'); //点击后回滚底部
	marklist[chatmark].children[2].style.display = 'none';
}
document.oncontextmenu = function(e) {
	var target = e.target;
	var textmenu = document.querySelector('#textmenu');
	while (!target.getAttribute("mark") && target.getAttribute("id") != 'body') {
		target = target.parentNode;
	}
	if (target.getAttribute("mark")) {
		var x = e.pageX;
		var y = e.pageY;
		textmenu.style.left = x + 'px';
		textmenu.style.top = y + 'px';
		textmenu.style.display = 'block';
		document.querySelector('#clearlist').onclick = function() {
			document.querySelector('#friendlist_son').removeChild(target);
			RecordBefore();
			scrollfun(friendlist_son, srcoll_son); //bar的三个滚动条
			if (target.getAttribute("mark") == chatmark) document.querySelector('#friendlist_son').firstElementChild.click();
		}
		return false;
	}
}
document.querySelector('#refresh').onclick = function() {
	F5();
}
function listhidden() {
	document.querySelector("#friendlist_son").style.display = 'none';
	document.querySelector('#srcoll').style.display = 'none';
	document.querySelector('#middlelist').style.display = 'none';
	document.querySelector('#middlescroll').style.display = 'none';
	document.querySelector('#rightlist').style.display = 'none';
	document.querySelector('#rightcscroll').style.display = 'none';
}
document.querySelector('#change').onclick = function(e) {
	e.stopPropagation()
}
document.addEventListener("keydown", function(e) {
	if (e.keyCode == 116) {
		e.preventDefault();
		F5();
	}
	if (e.keyCode == 13) {
		if (document.querySelector('#login_contain').style.display != 'none')
			document.querySelector('#login_btn').click();
	}
}, false);
document.querySelector('#barleft img').onmouseenter = function() {
	this.src = 'img/聊天(1).png';
}
document.querySelector('#barleft img').onmouseleave = function() {
	this.src = 'img/聊天.png';
}
document.querySelector('#barmiddle img').onmouseenter = function() {
	this.src = 'img/公众号(1).png';
}
document.querySelector('#barmiddle img').onmouseleave = function() {
	this.src = 'img/公众号.png';
}
document.querySelector('#barright img').onmouseenter = function() {
	this.src = 'img/联系人信息(1).png';
}
document.querySelector('#barright img').onmouseleave = function() {
	this.src = 'img/联系人信息.png';
}
document.querySelector('#lasthistory').addEventListener("click", Lasthistory);
function Lasthistory() {
	if (load == 0) return;
	else load = 0; //load记录防止多次触发函数
	document.querySelector('#yanchi').style.display = 'block';
	setTimeout(function() {
		document.querySelector('#yanchi').style.display = 'none';
		if (historymark[chatmark] < 0 || historymark[chatmark] >= historylist[chatmark + 0].length) {
			chatlist[chatmark].removeEventListener("wheel", TopHistory);
			chatlist[chatmark].style.top = '0px';
			scrolllist[chatmark].children[0].style.top = '0px';
			load = 1;
			return;
		}
		var content = '';
		for (let i = historylist[chatmark + 0][historymark[chatmark]].length - 1; i >= 0; i--) {
			content += historylist[chatmark + 0][historymark[chatmark]][i];
		}
		var Height = chatlist[chatmark].scrollHeight;
		chatlist[chatmark].innerHTML = content + chatlist[chatmark].innerHTML;
		historymark[chatmark]++;
		scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]); //更新滚动条长度
		if (Height <= 20) {
			load = 1;
			return;
		}
		if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight) { //这种情况是之前肯定有滚动条
			chatlist[chatmark].style.top = Height - chatlist[chatmark].scrollHeight +
				'px'; //记录加载之前的总高 用前总高-现总高 就是负增量 也就是 需要的top值(使保持原位置不动)
			var target = -(scrolllist[chatmark].children[0].offsetHeight /
				chatlist[chatmark].parentNode.offsetHeight) * (Height - chatlist[chatmark].scrollHeight);
			animates(scrolllist[chatmark].children[0], target, 1, 'top', Height);
		} //回到上一次滚动地方
		load = 1;
	}, 300)
}
function Lasthistoryson() {
	if (historymark[chatmark] < 0 || historymark[chatmark] >= historylist[chatmark + 0].length) {
		chatlist[chatmark].removeEventListener("wheel", TopHistory);
		chatlist[chatmark].style.top = '0px';
		scrolllist[chatmark].children[0].style.top = '0px';
		return;
	}
	var content = '';
	for (let i = historylist[chatmark + 0][historymark[chatmark]].length - 1; i >= 0; i--) {
		content += historylist[chatmark + 0][historymark[chatmark]][i];
	}
	chatlist[chatmark].innerHTML = content + chatlist[chatmark].innerHTML;
	historymark[chatmark]++;
	scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]); //更新滚动条长度
	if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight) { //这种情况是之前肯定有滚动条
		scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
			0].offsetHeight + 'px';
		chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight + 'px'; //回到底部
	}
}
document.querySelector('#chattext').onblur = function() {
	window.myblur = this.selectionStart;
}
document.querySelector('#emojicontain').onclick = function(e) {
	if (e.target.getAttribute("marks")) {
		var newvalue = insertStr(document.querySelector('#chattext').value, myblur, e.target.getAttribute("marks"));
		document.querySelector('#chattext').value = newvalue;
		document.querySelector('#chattext').focus();
		textlist[chatmark] = document.querySelector('#chattext').value;
	}
}
document.querySelector('#pikacontain').onclick = function(e) {
	if (e.target.style.backgroundImage) {
		var newvalue = insertStr(document.querySelector('#chattext').value, myblur,'[Pika:'+pikatoCN(e.target.style.backgroundImage)+']');
		document.querySelector('#chattext').value = newvalue;
		document.querySelector('#chattext').focus();
		textlist[chatmark] = document.querySelector('#chattext').value;
	}
}
document.querySelector('#emojibar').onclick = function(e) {
	document.querySelector('#emojicontain').style.display = 'block';
	document.querySelector('#pikacontain').style.display = 'none';
	e.stopPropagation();
}
document.querySelector('#pikabar').onclick = function(e){
	document.querySelector('#emojicontain').style.display = 'none';
	document.querySelector('#pikacontain').style.display = 'block';
	e.stopPropagation();
}
function TopHistory(e) {
	var b = document.querySelector('.chatscroll_son').offsetTop;
	var abs = e.detail || e.wheelDelta;
	if (b == 0 && Math.abs(abs) / abs == 1) {
		document.querySelector('#lasthistory').click();
	}
}
document.onclick = function() {
	document.querySelector('#login_out').style.display = 'none';
	document.querySelector('#change').style.display = 'none';
	document.querySelector('#emojicontain').style.display = 'none';
	document.querySelector('#pikacontain').style.display = 'none';
	document.querySelector('#textmenu').style.display = 'none';
	document.querySelector('#chatmessege').style.display = 'none';
}
document.querySelector('#chatmessege').addEventListener('click',function(e){
	e.stopPropagation();
})
function RecordBefore() {
	var record = '';
	for (let i = 0; i < friendlist_son.children.length; i++) {
		if (i == friendlist_son.children.length - 1)
			record += friendlist_son.children[i].getAttribute("mark");
		else
			record += (friendlist_son.children[i].getAttribute("mark") + '!')
	}
	localStorage.setItem("record", record);
}
function Relist() { //给消息排序,记得写一个排序函数 记录顺序
	if (localStorage.getItem("record") == undefined || localStorage.getItem("myid") != (myID + '')) {
		scrollfun(friendlist_son, srcoll_son); //bar的三个滚动条
		localStorage.setItem("myid", myID);
		return;
	}
	localStorage.setItem("myid", myID);
	var record = localStorage.getItem("record");
	var mark = record.split("!");
	for (let i = mark.length - 1; i >= 0; i--) {
		friendlist_son.insertBefore(marklist[mark[i]], friendlist_son.children[0]);
	}
	for (let i = 0; i < marklist.length - mark.length; i++) {
		friendlist_son.removeChild(friendlist_son.lastElementChild)
	}
	scrollfun(friendlist_son, srcoll_son); //bar的三个滚动条
}
function F5() {
	$.ajax({
		type: "GET",
		url: url + '/logout',
		dataType: 'json',
		timeout: 1000,
		success: function() {
			document.querySelector("#main").style.display = 'none'; //登出成功后隐藏界面
			location.reload(true); //刷新页面
		},
		error: function() {
			location.reload(true);
		}
	});
}
function insertStr(soure, start, newStr) { //为字符串插入字符 其中soure为原字符串,start为将要插入字符的位置，newStr为要插入的字符   
	return soure.slice(0, start) + newStr + soure.slice(start);
}
function scrollfun(friendlists, scroll_son) { //内容 滚动条子元素
	if (friendlists.scrollHeight <= friendlists.parentNode.offsetHeight) return;
	var scroll_scale = friendlists.scrollHeight / friendlists.parentNode.offsetHeight; //设置比例 一定要加var 不然会有bug!
	var friendlists_parent = friendlists.parentNode;
	scroll_son.parentNode.style.height = friendlists_parent.offsetHeight + 'px'; //设置滚动父元素高度
	scroll_son.style.height = friendlists_parent.offsetHeight / scroll_scale + 'px'; //设置滚动子元素高度
	scroll_son.onmousedown = function(e) {
		var initial = e.pageY;
		var b = scroll_son.offsetTop;
		var a = friendlists.offsetTop; //点击鼠标拖动
		document.onmousemove = function(e) {
			var now = e.pageY - initial;
			now < -b ? now = -b : now = now;
			now > friendlists_parent.offsetHeight - scroll_son.offsetHeight - b ? now = friendlists_parent.offsetHeight -
				scroll_son.offsetHeight - b : now = now; //防止移出范围
			scroll_son.style.top = b + now + 'px';
			friendlists.style.top = a - now * scroll_scale + 'px';
		}
	}
	document.onmouseup = function() {
		document.onmousemove = null; //一定要设置这个 否则鼠标会一直跟着走;
	}
	friendlists.onwheel = function(e) {
		var b = scroll_son.offsetTop;
		var a = friendlists.offsetTop;
		var scroll_target = 15;
		var abs = (-e.deltaY) || e.wheelDelta;
		var mark = Math.abs(abs) / abs;
		var timeID = setInterval(function() {
			scroll_son.style.top = scroll_son.offsetTop - scroll_target * mark + 'px';
			friendlists.style.top = friendlists.offsetTop + scroll_target * scroll_scale * mark + 'px';
			if (mark > 0) {
				if (scroll_son.offsetTop <= b - scroll_target) {
					scroll_son.style.top = b - scroll_target + 'px';
					friendlists.style.top = a + scroll_target * scroll_scale + 'px';
					clearInterval(timeID);
				}
				if (scroll_son.offsetTop <= 0) {
					scroll_son.style.top = 0 + 'px';
					friendlists.style.top = 0 + 'px';
					clearInterval(timeID);
					return;
				}
			} else {
				if (scroll_son.offsetTop > b + scroll_target) {
					scroll_son.style.top = b + scroll_target + 'px';
					friendlists.style.top = a - (scroll_target) * scroll_scale + 'px';
					clearInterval(timeID);
				}
				if (scroll_son.offsetTop > friendlists_parent.offsetHeight - scroll_son.offsetHeight) {
					scroll_son.style.top = friendlists_parent.offsetHeight - scroll_son.offsetHeight + 'px';
					friendlists.style.top = friendlists_parent.offsetHeight - friendlists.scrollHeight + 'px';
					clearInterval(timeID);
					if( friendlists.className =='chat_son'&&document.querySelector('#newtip').style.display == 'block')
					document.querySelector('#newtip').style.display = 'none';
					return;
				}

			}
		}, 1) //定时器末尾}
	}
} //滚动结尾
function animates(element, target, interval, direction, s) {
	// 通过判断，保证页面上只有一个定时器在执行动画
	if (element.timerId) {
		clearInterval(element.timerId);
		element.timerId = null;
	}
	if (direction == 'top') {
		element.timerId = setInterval(function() {
			// 步进  每次移动的距离
			var step = 12;
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
				chatlist[chatmark].style.top = s - chatlist[chatmark].scrollHeight +
					'px';
				return;
			}
			// 移动盒子
			current += step;
			element.style.top = current + 'px';
		}, interval);
	}
}
function search(arr, chars) {
	var charmark = [];
	var j = 0;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i + ''].indexOf(chars) + 1) {
			charmark[j] = i + '';
			j++;
		}
	}
	return charmark;
}
document.querySelector('#sou').onfocus = function() {
	document.querySelector('#souresult').style.display = 'block';
}
document.querySelector('#sou').onblur = function() {
	setTimeout(function() {
		document.querySelector('#souresult').style.display = 'none';
	}, 200)
}
document.querySelector('#sou').onkeyup = function() {
	var markd = search(hisname, this.value);
	document.querySelector('#souresult').innerHTML = '';
	if (this.value == '') return;
	if (markd.length == 0) {
		var div = document.createElement("div");
		div.className = 'searchson';
		div.innerText = '无';
		document.querySelector('#souresult').appendChild(div);
		return;
	}
	for (let i = 0; i < markd.length; i++) {
		var div = document.createElement("div");
		div.className = 'searchson';
		div.innerText = hisname[markd[i]];
		div.setAttribute("marks", markd[i]);
		document.querySelector('#souresult').appendChild(div);
	}
}
document.querySelector('#souresult').onclick = function(e) {
	if (e.target.getAttribute("marks")) {
		rightlist.children[e.target.getAttribute("marks")].click();
		document.querySelector('#barright').click();
	}
};
document.querySelector('#music').onclick = function(e) {
	if (this.children[1].innerText == '关闭声音') {
		this.children[1].innerText = '开启声音';
		this.children[0].style.backgroundImage = 'url(img/关闭声音.png)';
		au.src = '';
	} else {
		this.children[1].innerText = '关闭声音';
		this.children[0].style.backgroundImage = 'url(img/开启声音.png)';
		au.src = 'img/ios.wav';
	}
}
document.querySelector('#moved').addEventListener("mousedown", function(e) {
	var three_contain = document.querySelector('#three_contain');
	window.mark_one = e.pageX;
	window.mark_width = three_contain.offsetWidth;
	iam = true;
	document.querySelector('#main').style.cursor = 'w-resize';
});
document.addEventListener("mouseup", function(e) {
	iam = false;
	document.querySelector('#main').style.cursor = 'default';
})
document.addEventListener("mousemove", function(e) {
	if (iam) {
		var distance = mark_one - e.pageX;
		if (distance > 300) distance = 300;
		if (distance < -400) distance = -400;
		document.querySelector('#three_contain').style.width = mark_width - 2 * distance + 'px';
		document.querySelector('#messagedetail').style.left = document.querySelector('#three_contain').offsetWidth + 'px';
		document.querySelector('#messagedetail').style.left = -2 * document.querySelector('#three_contain').offsetWidth +
			'px'
		document.querySelector('#iframe').style.left = -document.querySelector('#three_contain').offsetWidth + 'px';
		rightwidth = document.querySelector('#three_contain').offsetWidth;
		document.querySelector('#content_contain').style.left = iamthree * rightwidth + 'px';
	}
})
function mynews(){
	$.ajax({
		type: "GET", //data 传送数据类型。get 传递
		url: 'https://www.apiopen.top/journalismApi',
		dataType: 'json',
		success: function(o) {
			var newscontent = '';
			newsdata = o.data;
			for (i = 0; i < 8; i++) {
				newscontent += (news_twoo + newsdata.toutiao[i].link + news_end + newsdata.toutiao[i].title + news_threeo);
			}
			for (i = 0; i < newsdata.tech.length; i++) {
				if (newsdata.tech[i].picInfo.length == 0)
					newscontent += (news_twooo + newsdata.tech[i].link + news_end + newsdata.tech[i].title + news_three);
				else
					newscontent += (news_one + newsdata.tech[i].picInfo[0].url + news_two + newsdata.tech[i].link + news_end +
						newsdata.tech[i].title + news_three);
				if (newsdata.dy[i].picInfo.length == 0)
					newscontent += (news_twooo + newsdata.dy[i].link + news_end + newsdata.dy[i].title + news_three);
				else
					newscontent += (news_one + newsdata.dy[i].picInfo[0].url + news_two + newsdata.dy[i].link + news_end + newsdata
						.dy[
							i].title + news_three);
			}
			document.querySelector('#middlelist').innerHTML = newscontent;
			document.querySelector('#middlelist').onclick = function(e) {
				document.querySelector('#iframe').src = e.target.getAttribute("link");
			}
			var midlist = document.querySelector('#middlelist');
			var midson = document.querySelector('#middlescroll_son');
			scrollfun(document.querySelector('#middlelist'), document.querySelector('#middlescroll_son'));
			setTimeout(function() {
				scrollfun(document.querySelector('#middlelist'), document.querySelector('#middlescroll_son'));
			}, 2000)
		},
		error:function(){
			mynew();
		}
	})
}
function pikatoCN(c){
	var regular = /[\u4e00-\u9fa5]{2}/;
	return regular.exec(c)[0];
}
function pikatoImg(c){
	var regular_one = /\[Pika:[\u4e00-\u9fa5]{2}]/g;
	if(regular_one.test(c)) 
	{
	var newstring = c.match(regular_one)
	var img_one = '<img class="pikagif" src="face/';
	var img_two = '.gif" />'
	for(let i = 0 ; i< newstring.length ; i++){
		newstring[i] = newstring[i].replace('[Pika:',img_one);
		newstring[i] = newstring[i].replace(']',img_two);
		c= c.replace(/\[Pika:[\u4e00-\u9fa5]{2}]/,newstring[i]);
	}
	// c = c.replace(/\\/g , ''); 
	return c;
	}
	return c;
}
mynews();
drag(document.querySelector('#chatmessege'));
drag(document.querySelector('#change'));
drag(document.querySelector('#maskson'));
