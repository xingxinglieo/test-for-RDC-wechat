//登录运行的第一个函数
function login(a, p) {
	login_tip.innerText = '请稍候..';
	$.ajax({
		type: "POST", //data 传送数据类型。post 传递
		url: url + '/login',
		data: {
			account: a,
			password: p
		}, //传送的数据
		dataType: 'json',
		cache: true,
		timeout: 10000,
		success: function(data) {
			if (document.querySelector('#remember').checked) {
				localStorage.setItem("username", document.querySelector('#login_account').value)
				localStorage.setItem("password", document.querySelector('#login_password').value) //设置cookie
				localStorage.setItem("status", "true")
			} else {
				localStorage.clear("username");
				localStorage.clear("password");
				localStorage.setItem("status", "false");
			} //设置cookie
			if (data.result == 'success') {
				login_tip = document.querySelector('#login_tip');
				myID = data.userid;
				login_tip.style.color = 'gray';
				login_tip.innerText = '登录成功...';
				var timetip = ' ,你好';
				$.ajax({
					type: "GET", //data 传送数据类型。post 传递
					url: url + '/getUserInfor',
					data: {
						id: myID
					},

					dataType: 'json',
					success: function(data) {
						// data.message[myID]["nickname"] = data.message.nickname;
						document.querySelector('#myname').innerText = data.message.nickname;
					},
				});
				getList();
				setTimeout(function() {
					login_contain.style.display = 'none';
					document.querySelector('#icon').style.display = 'none';
					document.querySelector('#copyright').style.display = 'none';
					document.querySelector("#main").style.visibility = 'visible';
					document.querySelector("#main").style.display = 'block';
				}, 600)
			} else {
				login_tip.style.color = 'red';
				login_tip.innerText = '账户密码错误或未登出,请检查或者f5刷新后重试';
			}

		},
		error: function() {
			login_tip.style.color = 'red';
			login_tip.innerText = '连接服务器失败,请检查网络或者联系管理员'
		},
	})
} //login结尾
//获取chatlist 和friendlist的函数
function getList() {
	$.ajax({
		type: "POST", //data 传送数据类型。post 传递
		url: url + '/getList',
		dataType: 'json',
		success: function(data) {
			friendlist.style.height = friendlist.parentNode.offsetHeight - friendlist.parentNode.children[0].offsetHeight -
				friendlist.parentNode.children[1].offsetHeight - 3 + 'px'; //高度自适应
			myObj = {
				id: myID + 0,
				nickname: '我',
			}
			data.message.splice(myID + 0, 0, myObj);
			window.friendchat = data.message;
			//左边栏开始
			var friendlist_son = document.querySelector('#friendlist_son'); //左边
			var srcoll_son = document.querySelector('#srcoll_son'); //左滚动条
			var rightlist = document.querySelector("#rightlist"); //右边
			var rightscroll_son = document.querySelector('#rightcscroll_son');
			marklist = []; //存储左栏
			chatlist = []; //存储聊天窗口
			textlist = []; //储存内容
			scrolllist = [];
			messagelist = [];
			hisname = [];
			historylist = [];
			historymark = [];
			// setTimeout(function(){console.log(historylist)},10000)
			var content = '';
			var rightcontent = '';
			for (i = 0; i < friendchat.length; i++) {
				content += (content_one1 + i + content_one2 + content_two); //i是mark的标记
				rightcontent += (content_three1 + i + content_three2 + content_four);
			} //动态生成list内容
			friendlist_son.innerHTML = content; //聊天好友列表的内容插入
			rightlist.innerHTML = rightcontent; //详情信息列表的内容插入
			scrollfun(friendlist_son, srcoll_son); //bar的三个滚动条
			scrollfun(rightlist, rightscroll_son);
			scrollfun(document.querySelector('#middlelist'), document.querySelector('#middlescroll_son'));
			for (i = 0; i < friendchat.length; i++) { //这里是创造窗口对象
				chatlist[i] = document.createElement('div');
				scrolllist[i] = document.createElement('div');
				chatlist[i].className = 'chat_son';
				scrolllist[i].className = 'chatscroll';
				scrolllist[i].innerHTML = '<div class ="chatscroll_son"></div>';
				marklist[i] = friendlist_son.children[i]; //记录聊天列表原始位置
				textlist[i] = '';
				marklist[i].onclick = function() { //聊天列表的点击事件
					for (i = 0; i < marklist.length; i++) {
						marklist[i].style.backgroundColor = 'transparent';
					} //先清空颜色 全部隐藏
					document.querySelector('#chat_content').removeChild(document.querySelector('.chat_son'));
					document.querySelector('#chat_content').removeChild(document.querySelector('.chatscroll'));
					this.style.backgroundColor = '#3A3F45'; //再给点击对象更新颜色
					document.querySelector('#newtip').style.display = 'none'; //使聊天框的提示消失
					textlist[chatmark] = document.querySelector('#chattext').value;//保存内容
					chatmark = this.getAttribute("mark");
					marklist[chatmark].children[2].style.display = 'none'; //隐藏红点?
					document.querySelector('#chattext').value = textlist[chatmark];
					document.querySelector('#chat_content').appendChild(chatlist[chatmark]);
					document.querySelector('#chat_content').appendChild(scrolllist[chatmark]);
					scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
					chatlist[chatmark].addEventListener("wheel", TopHistory)
					if (historymark[chatmark] == 0) {
						document.querySelector('#lasthistory').click();
						if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight) {
							scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[
								chatmark].children[
								0].offsetHeight + 'px';
							chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight +
								'px'; //回到底部
						}
					}
					document.querySelector('#chat_top').innerText = this.children[1].children[0].innerText;
				}
				rightlist.children[i].onclick = function(e) {
					chatmark = this.getAttribute("mark");
					document.querySelector("#messagedetail").innerHTML = messagelist[chatmark];
					document.querySelector('.nickname').innerText = hisname[chatmark];
					document.querySelector('.send_btn').onclick = function() { //详情页面发送按钮的点击事件
						document.querySelector('#barleft').click();
						marklist[chatmark].click();
						friendlist_son.insertBefore(marklist[chatmark], friendlist_son.children[0]); //将聊天头像提前
						RecordBefore();
						document.querySelector('#srcoll_son').style.top = '0px';
						document.querySelector('#friendlist_son').style.top = '0px';

					};
				}
			}
			FirstnewMessage();
			document.querySelector('#chat_content').appendChild(chatlist[0]); //加入好友列表
			document.querySelector('#chat_content').appendChild(scrolllist[0]);
			document.querySelector("#main").style.display = 'none';
			document.querySelector('#barleft').click(); //让页面回到左栏
			for (i = 0; i < friendchat.length; i++) {
				message('' + i);
			}
		}, //这里是sceess的函数的结尾别混了
	})
}
//关于列表名字和详细信息的获取在此
function message(e) {
	$.ajax({
		type: "GET", //data 传送数据类型。post 传递
		url: url + '/getUserInfor',
		data: {
			id: e
		},
		dataType: 'json',
		success: function(data) {
			var name;
			if (data.message.nickname == undefined || data.message.nickname == '')
				name = '未命名(id:' + e + ')'; //对方未命名时 加上未命名
			else {
				name = data.message.nickname;
			}
			hisname[e] = name;
			if (e != myID) {
				document.querySelectorAll('.friendname')[e].innerText = name;
				document.querySelectorAll('.right_friendname')[e].innerText = name;
			} else {
				document.querySelectorAll('.friendname')[e].innerText = '我';
				document.querySelectorAll('.right_friendname')[e].innerText = '我';
			}
			messagelist[e] = message_one + message_two + data.message.introduction + message_three + data.message.age +
				message_four + data.message.address + message_five + data.message.mailbox + message_six;
		},
		error: {
			function() {
				document.querySelectors('.nickname')[e].style.color = 'red';
				document.querySelectors('.nickname')[e].innerText = '返回错误,请检查网络';
			}

		}
	})
} //message结尾
function newMessage() {
	$.ajax({
		url: url + '/getUnreadChatRecord',
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var timecontent;
			for (i = 0; i < data.message.length; i++) {
				timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				chatlist[data.message[i].sender].innerHTML += (content_five1 + timecontent + content_left + data.message[i].content +
					content_five2);
				marklist[data.message[i].sender].children[1].children[1].innerText = data.message[i].content; //提示更新 内容更新
				scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
				if (data.message[i].sender != chatmark); //底部重置)
				{marklist[data.message[i].sender].children[2].style.display = 'block'; //显示红点
				if(marklist[chatmark].style.backgroundColor==friendlist_son.children[0].style.backgroundColor)
				friendlist_son.insertBefore(marklist[data.message[i].sender], friendlist_son.children[1]);
				else
				friendlist_son.insertBefore(marklist[data.message[i].sender], friendlist_son.children[0])
				}
				if (data.message[i].sender == chatmark && chatlist[chatmark].offsetTop <= chatlist[chatmark].parentNode.offsetHeight -
					chatlist[chatmark].scrollHeight + 200) {//使在较低处的回到低处
					scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
						0].offsetHeight + 'px';
					chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight +
						'px';
					marklist[chatmark].children[2].style.display = 'none';	
				}
				if (data.message[i].sender == chatmark && chatlist[chatmark].offsetTop >= chatlist[chatmark].parentNode.offsetHeight -
					chatlist[chatmark].scrollHeight + 200) {//显示蓝色的提示
					document.querySelector('#newtip').innerHTML = data.message[i].content;
					document.querySelector('#newtip').style.display = 'block';

				}
				RecordBefore();
			}
		},
		error: function() {

		}
	});
}

function FirstnewMessage() {
	$.ajax({
		url: url + '/getUnreadChatRecord',
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			setTimeout(function() {
				Relist();
				for (i = 0; i < data.message.length; i++) {
					marklist[data.message[i].sender].children[1].children[1].innerText = data.message[i].content;
					marklist[data.message[i].sender].children[2].style.display = 'block'; //显示红点
					friendlist_son.insertBefore(marklist[data.message[i].sender], friendlist_son.children[0]); //
					RecordBefore();
				}
				var display = friendlist_son.children[0].children[2].style.display;
				friendlist_son.children[0].click();
				friendlist_son.children[0].children[2].style.display = display;
				setTimeout(function(){friendlist_son.children[0].children[2].style.display = 'none';},2500)
			}, 1500)

			for (i = 0; i < friendchat.length; i++) {
				History('' + i);
			}
			setInterval(newMessage, 2000);
		},
	})
}

function out() {
	$.ajax({
		type: "GET",
		url: url + '/logout',
		dataType: 'json',
		success: function() {
			document.querySelector("#main").style.display = 'none'; //登出成功后隐藏界面
			document.querySelector('#mask').style.display = 'block';
			maskshow('登出成功');
			document.querySelector('#mask_btn').onclick = function() {
				location.reload(true)
			}; //刷新页面
		},
		error: function() {
			maskshow('登出失败,请检查网络或者刷新页面')
		}
	});
}
//out结尾

function getChathistory(hisid) {
	if (hisid == myID) return;
	$.ajax({
		type: "POST",
		url: url + '/getChatRecord',
		data: {
			id: hisid,
		},
		dataType: 'json',
		success: function(data) {
			var contents = '';
			//这个for循环为更新聊天窗消息
			for (i = 0; i < data.message.length; i++) {
				var time = data.message[i].date;
				var timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				if (data.message[i].sender != myID) {
					contents += (content_five1 + timecontent + content_left + data.message[i].content + content_five2);
				} else {
					contents += (content_five1 + timecontent + content_right + data.message[i].content + content_five2);
				}
			}
			chatlist[chatmark].innerHTML = contents;
			// console.log(data.message[data.message.length-1].content);
			marklist[hisid].children[1].children[1].innerText = data.message[data.message.length - 1].content; //用户名 
			scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]); //更新滚动条长度
			if (chatlist[chatmark].scrollHeight > chatlist[chatmark].parentNode.offsetHeight) {
				scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
					0].offsetHeight + 'px';
				chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight +
					'px';
			}
			//回到底部
			historymark[hisid] = -1;
		},
	});
}

function History(hisid) {
	historylist[hisid + 0] = [];
	if (hisid == myID) return;
	$.ajax({
		type: "POST",
		url: url + '/getChatRecord',
		data: {
			id: hisid,
		},
		dataType: 'json',
		success: function(data) {
			historymark[hisid] = 0;
			if (data.message.length > 0)
				marklist[hisid].children[1].children[1].innerText = data.message[data.message.length - 1].content;
			for (i = 0; i < Math.ceil(data.message.length / 10); i++)
				historylist[hisid + 0][i] = [];
			for (var j = 0, i = data.message.length - 1; i >= 0; i--, j++) {
				var time = data.message[i].date;
				var timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				if (data.message[i].sender != myID) {

					historylist[hisid + 0][Math.floor(j / 10)][j % 10] = (content_five1 + timecontent + content_left + data.message[
						i].content + content_five2);
				} else {
					historylist[hisid + 0][Math.floor(j / 10)][j % 10] = (content_five1 + timecontent + content_right + data.message[
						i].content + content_five2);
				}
			}

		},
	})

}

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
function maskshow(q) {
	document.querySelector('#mask').style.display = 'block';
	document.querySelector('#alert').innerText = q;
}
