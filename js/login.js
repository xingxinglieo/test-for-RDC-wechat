//登之前确保登出;
document.cookie = "id=1";
var url = 'http://120.77.247.10';
var timeIP;
var newsdata;
var content_one1 = '<div class="chat" mark="';
var content_one2 = '"><img src="img/friend.png" class="friendhead"><div class="info"><div class="friendname">';
var content_two = '</div><div class = "chattip"></div></div><div class="dot"></div></div>'
var content_three1 =
	'<div class="right_chat" mark="';
var content_three2 = '"><div class="right_friendname">'
var content_four = '</div></div>';
var content_five1 = '<div class="timetip">';
var content_five2 = '</div>';
var content_right =
	'</div><div class="chathead" style="float: right;background-image: url(img/myicon.png);"></div><div class="chats rightchat">'
var content_left =
	'</div><div class="chathead" style="float: left;background-image:url(img/friend.png);"></div><div  class="chats leftchat">'
//content+timetip+right/left+内容+content_five2;
message_content = '';
var message_one =
	'<div class="message_contain"><div class="ring letmiddle">详细信息</div><div class="ringg" style="background-image: url(img/friend.png);"></div><p class="nickname">'
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
var rightwidth = document.querySelector('#three_contain').offsetWidth;
document.querySelector("#frame").style.left = -rightwidth + 'px'
document.querySelector('#messagedetail').style.left = -2 * rightwidth + 'px';
if (localStorage.getItem("status") == "true") {
	document.querySelector('#remember').checked = true;
	document.querySelector('#login_account').value = localStorage.getItem('username');
	document.querySelector('#login_password').value = localStorage.getItem('password');
} else
	document.querySelector('#remember').checked = false; //保存密码函数

chatmark = 0;
friendlist = document.querySelector('#friendlist'); //这个是包含三个容器的
//使list高度自适应
login_btn.onclick = function() {

	$.ajaxSetup({
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true
	});
	login($('#login_account').val(), $('#login_password').val());
}
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
// login_btn.click();
document.querySelector('#login_password').onkeydown = function(e) {
	if (e.keyCode == 13)
		login_btn.click();
}
document.querySelector('#mask_btn').onclick = function() {
	document.querySelector('#mask').style.display = 'none';
};
document.querySelector('#chattext').addEventListener("keydown", function(e) {
	if (e.keyCode == 17) ctr = 1;
	if (e.keyCode == 13) {
		if (ctr == 0) {
			document.querySelector('#textbtn').click();
			e.preventDefault();
		} else this.value += '\n'
	}
	textlist[chatmark] = this.value;
})
document.querySelector('#chattext').addEventListener("keyup", function(e) {
	if (e.keyCode == 17)
		ctr = 0;
})
document.querySelector('#textbtn').onclick = function() {
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
			chatlist[chatmark].innerHTML += content_five1 + content_right + textvalue + content_five2;
			marklist[chatmark].children[1].children[1].innerText = textvalue;
			scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
			scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
				0].offsetHeight + 'px';
			if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight)
				chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight +
				'px'; //底部重置
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
document.querySelector('#mask_btn').onclick = function() {
	document.querySelector('#mask').style.display = 'none';
}
document.querySelector('#xx').onclick = function() {
	document.querySelector("#change").style.display = 'none';
}
document.querySelector('#barleft').onclick = function() {
	listhidden();
	animate(document.querySelector('#content_contain'), 0, 7, 'left');
	document.querySelector("#friendlist_son").style.display = 'block';
	document.querySelector('#srcoll').style.display = 'block';

}
document.querySelector('#barmiddle').onclick = function() {
	listhidden();
	animate(document.querySelector('#content_contain'), rightwidth, 7, 'left');
	document.querySelector('#middlelist').style.display = 'block';
	document.querySelector('#middlescroll').style.display = 'block';
}
document.querySelector('#barright').onclick = function() {
	listhidden();
	animate(document.querySelector('#content_contain'), 2 * rightwidth, 7, 'left');
	document.querySelector('#rightlist').style.display = 'block';
	document.querySelector('#rightcscroll').style.display = 'block';
}
document.querySelector('#newtip').onclick = function() {
	this.style.display = 'none';
	scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
		0].offsetHeight + 'px';
	chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight + 'px'; //点击后回滚底部
	marklist[chatmark].children[2].style.display = 'none';
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
		// location.reload(true); //要做的其他事情
	}
}, false);
document.querySelector('#barleft img').onmouseenter = function() {
	this.src = 'img/聊天(1).png';
}
document.querySelector('#barleft img').onmouseleave = function() {
	this.src = 'img/聊天.png';
}
document.querySelector('#barmiddle img').onmouseenter = function() {
	this.src = 'img/公众号.png';
}
document.querySelector('#barmiddle img').onmouseleave = function() {
	this.src = 'img/公众号 (1).png';
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
			return;
		}
		var content = '';
		for (i = historylist[chatmark + 0][historymark[chatmark]].length - 1; i >= 0; i--) {
			content += historylist[chatmark + 0][historymark[chatmark]][i];
		}
		var Height = chatlist[chatmark].scrollHeight;
		chatlist[chatmark].innerHTML = content + chatlist[chatmark].innerHTML;
		historymark[chatmark]++;
		scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]); //更新滚动条长度
		if (Height <= 20) return;
		if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight) { //这种情况是之前肯定有滚动条
			chatlist[chatmark].style.top = Height - chatlist[chatmark].scrollHeight +
				'px'; //记录加载之前的总高 用前总高-现总高 就是负增量 也就是 需要的top值(使保持原位置不动)
			var target = -(scrolllist[chatmark].children[0].offsetHeight /
				chatlist[chatmark].parentNode.offsetHeight) * (Height - chatlist[chatmark].scrollHeight);
			animate(scrolllist[chatmark].children[0], target, 5, 'top');
		} //回到上一次滚动地方
		load = 1;
	}, 400)
}

function Lasthistoryson() {
	if (historymark[chatmark] < 0 || historymark[chatmark] >= historylist[chatmark + 0].length) {
		chatlist[chatmark].removeEventListener("wheel", TopHistory);
		chatlist[chatmark].style.top = '0px';
		scrolllist[chatmark].children[0].style.top = '0px';
		return;
	}
	var content = '';
	for (i = historylist[chatmark + 0][historymark[chatmark]].length - 1; i >= 0; i--) {
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
document.querySelector('#emojicontain').onclick = function(e) {
	if (e.target.getAttribute("mark"))
		document.querySelector('#chattext').value += e.target.getAttribute("mark");
	document.querySelector('#chattext').focus();
	textlist[chatmark] = document.querySelector('#chattext').value;
}
document.querySelector('#emojibar').onclick = function(e) {
	document.querySelector('#emojicontain').style.display = 'block';
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
	// setTimeout(function(){if(document.querySelector('#change').style.display =='block')
	// document.querySelector('#change').style.display = 'none';},10);
	// if(document.querySelector('#change').style.display =='none')
	// return;
	// else
	document.querySelector('#change').style.display = 'none';
	document.querySelector('#emojicontain').style.display = 'none'
}

function RecordBefore() {
	var record = '';
	for (i = 0; i < friendlist_son.children.length; i++) {
		if (i == friendlist_son.children.length - 1)
			record += friendlist_son.children[i].getAttribute("mark");
		else
			record += (friendlist_son.children[i].getAttribute("mark") + '!')
	}
	localStorage.setItem("record", record);
}

function Relist() { //给消息排序,记得写一个排序函数 记录顺序
	if (localStorage.getItem("record") == undefined) return;
	var record = localStorage.getItem("record");
	var mark = record.split("!");
	for (i = marklist.length - 1; i >= 0; i--) {
		friendlist_son.insertBefore(marklist[mark[i]], friendlist_son.children[0]);
	}
}
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
				newscontent += (news_one + newsdata.dy[i].picInfo[0].url + news_two + newsdata.dy[i].link + news_end + newsdata.dy[
					i].title + news_three);
		}
		document.querySelector('#middlelist').innerHTML = newscontent;
		document.querySelector('#middlelist').onclick = function(e) {
			document.querySelector('#frame').src = e.target.getAttribute("link");
		}
		document.querySelector('#frame').src = document.querySelector('#middlelist').firstElementChild.firstElementChild.getAttribute(
			"link");
	}
})
function scrollfun(friendlists, scroll_son) { //内容 滚动条子元素
	if (friendlists.offsetHeight <= friendlists.parentNode.offsetHeight) return;
	var scroll_scale = friendlists.scrollHeight / friendlists.parentNode.offsetHeight; //设置比例 一定要加var 不然会有bug!
	scroll_son.parentNode.style.height = friendlists.parentNode.offsetHeight + 'px'; //设置滚动父元素高度
	scroll_son.style.height = friendlists.parentNode.offsetHeight / scroll_scale + 'px'; //设置滚动子元素高度
	scroll_son.onmousedown = function(e) {
		var initial = e.pageY;
		var b = scroll_son.offsetTop;
		var a = friendlists.offsetTop; //点击鼠标拖动
		document.onmousemove = function(e) {
			var now = e.pageY - initial;
			now < -b ? now = -b : now = now;
			now > friendlists.parentNode.offsetHeight - scroll_son.offsetHeight - b ? now = friendlists.parentNode.offsetHeight -
				scroll_son.offsetHeight - b : now = now; //防止移出范围
			scroll_son.style.top = b + now + 'px';
			friendlists.style.top = a - now * scroll_scale + 'px';
		}
	}
	document.onmouseup = function() {
		document.onmousemove = null; //一定要设置这个 否则鼠标会一直跟着走;
	}
	friendlists.onwheel = function(e) {
		e = e || window.event;
		var b = scroll_son.offsetTop;
		var a = friendlists.offsetTop;
		var scroll_target = 15;
		var abs = e.detail || e.wheelDelta;
		// var scroll_target = 2;
		// var scrollabs = e.wheelDelta || e.
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
				if (scroll_son.offsetTop > friendlists.parentNode.offsetHeight - scroll_son.offsetHeight) {
					scroll_son.style.top = friendlists.parentNode.offsetHeight - scroll_son.offsetHeight + 'px';
					friendlists.style.top = friendlists.parentNode.offsetHeight - friendlists.scrollHeight + 'px';
					clearInterval(timeID);
					return;
				}

			}
		}, 1) //定时器末尾

	};

} //滚动结尾
