//登录运行的第一个函数
function login(a, p) {
	if (a == '' || p == '') {
		maskshow('账号或密码不能为空');
		return;
	}
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
				}, 50)
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
			dotmark = [];
			hisintroduction = [];
			var content = '';
			var rightcontent = '';
			for (let i = 0; i < friendchat.length; i++) {
				content += (content_one1 + i + content_one2 + content_two); //i是mark的标记
				rightcontent += (content_three1 + i + content_three2 + content_four);
			} //动态生成list内容
			friendlist_son.innerHTML = content; //聊天好友列表的内容插入
			rightlist.innerHTML = rightcontent; //详情信息列表的内容插入
			scrollfun(rightlist, rightscroll_son);
			for (let i = 0; i < friendchat.length; i++) { //这里是创造窗口对象
				dotmark[i] = 0;
				chatlist[i] = document.createElement('div');
				scrolllist[i] = document.createElement('div');
				chatlist[i].className = 'chat_son';
				scrolllist[i].className = 'chatscroll';
				scrolllist[i].innerHTML = '<div class ="chatscroll_son"></div>';
				marklist[i] = friendlist_son.children[i]; //记录聊天列表原始位置
				textlist[i] = '';
				chatlist[i].onclick = function(e) {
					if (e.target.className == 'chathead') {
						document.querySelector('#chatmessege').style.display = 'block';
						document.querySelector('#chatmessege').style.top = e.pageY + 'px';
						document.querySelector('#chatmessege').style.left = e.pageX + 'px';
						e.stopPropagation();
						if (e.target.style.float == 'left') {
							document.querySelector('#chatmessege_one').innerText = hisname[chatmark];
							document.querySelector('#chatmessege_two').innerText = '签名 :  ' + hisintroduction[chatmark];
						}
						if (e.target.style.float == 'right') {
							document.querySelector('#chatmessege_one').innerText = hisname[myID + ''];
							document.querySelector('#chatmessege_two').innerText = '签名 :  ' + hisintroduction[myID + ''];
						}
					}
				}
				marklist[i].onclick = function() { //聊天列表的点击事件
					for (let i = 0; i < marklist.length; i++) {
						marklist[i].style.backgroundColor = 'transparent';
					} //先清空颜色 
					document.querySelector('#chat_content').removeChild(document.querySelector('.chat_son'));
					document.querySelector('#chat_content').removeChild(document.querySelector('.chatscroll'));
					this.style.backgroundColor = '#ececed'; //再给点击对象更新颜色
					document.querySelector('#newtip').style.display = 'none'; //使聊天框的提示消失
					textlist[chatmark] = document.querySelector('#chattext').value; //保存内容
					chatmark = this.getAttribute("mark");
					dotmark[chatmark] = 0;
					marklist[chatmark].children[2].style.display = 'none'; //隐藏红点?
					document.querySelector('#chattext').value = textlist[chatmark];
					document.querySelector('#chat_content').appendChild(chatlist[chatmark]);
					document.querySelector('#chat_content').appendChild(scrolllist[chatmark]);
					scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
					chatlist[chatmark].addEventListener("wheel", TopHistory)
					if (historymark[chatmark] == 0) {
						Lasthistoryson();
					}
					document.querySelector('#chat_top').innerText = this.children[1].children[0].innerText;
					document.querySelector('#chattext').focus();
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
				rightlist.children[i].ondblclick = function(e){
					document.querySelector('.send_btn').click();
				}
			}
			FirstnewMessage();
			document.querySelector('#chat_content').appendChild(chatlist[0]); //加入好友列表
			document.querySelector('#chat_content').appendChild(scrolllist[0]);
			document.querySelector('#barleft').click(); //让页面回到左栏
			for (let i = 0; i < friendchat.length; i++) {
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
			if (data.message.nickname == undefined || data.message.nickname == '')
				hisname[e] = '未命名(id:' + e + ')'; //对方未命名时 加上未命名
			else {
				hisname[e] = data.message.nickname;
			}
			hisintroduction[e] = data.message.introduction || '';
			if (e != myID) {
				marklist[e].children[1].children[0].innerText = hisname[e];
				document.querySelectorAll('.right_friendname')[e].innerText = hisname[e];
			} else {
				marklist[e].children[1].children[0].innerText = '我';
				document.querySelectorAll('.right_friendname')[e].innerText = '我';
			}
			messagelist[e] = message_one + message_two + data.message.introduction + message_three + data.message.age +
				message_four + data.message.address + message_five + data.message.mailbox + message_six;
			if (e == 0) {
				document.querySelector('#messagedetail').innerHTML = messagelist[e];
				document.querySelector('.nickname').innerText = hisname[e];
			}
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
			var aumark = 0;
			if(data.message.length>0) flash_title(hisname[data.message[data.message.length-1].sender]);
			for (let i = 0; i < data.message.length; i++) {
				if (data.message[i].sender != chatmark)
					dotmark[data.message[i].sender]++;
				timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				chatlist[data.message[i].sender].innerHTML += (content_five1 + timecontent + content_left + pikatoImg(data.message[i].content) +
					content_five2);
				marklist[data.message[i].sender].children[1].children[1].innerText = data.message[i].content; //提示更新 内容更新
				marklist[data.message[i].sender].children[1].children[2].innerText = timecontent;
				scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
				if (data.message[i].sender != chatmark) //底部重置)
				{
					aumark++;
					marklist[data.message[i].sender].children[2].innerText = dotmark[data.message[i].sender];
					marklist[data.message[i].sender].children[2].style.display = 'block'; //显示红点
					if (marklist[chatmark].style.backgroundColor == friendlist_son.children[0].style.backgroundColor)
						friendlist_son.insertBefore(marklist[data.message[i].sender], friendlist_son.children[1]);
					else
						friendlist_son.insertBefore(marklist[data.message[i].sender], friendlist_son.children[0])
				}
				if (data.message[i].sender == chatmark) {
					if (chatlist[chatmark].offsetTop <= chatlist[chatmark].parentNode.offsetHeight -
						chatlist[chatmark].scrollHeight + 350) { //使在较低处的回到低处
						animate(scrolllist[chatmark].children[0], chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
							0].offsetHeight, 30, 'top');
						animate(chatlist[chatmark], chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight, 30,
							'top');
						marklist[chatmark].children[2].style.display = 'none';
					} else { //显示蓝色的提示
						document.querySelector('#newtip').innerHTML = data.message[i].content;
						document.querySelector('#newtip').style.display = 'block';

					}
				}
				RecordBefore();
			}
			if (aumark > 0) au.play();
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
				if (data.message.length > 0) au.play();
				for (let i = 0; i < data.message.length; i++) {
					dotmark[data.message[i].sender]++;
					marklist[data.message[i].sender].children[1].children[1].innerText = data.message[i].content;
					marklist[data.message[i].sender].children[2].innerText = dotmark[data.message[i].sender];
					marklist[data.message[i].sender].children[2].style.display = 'block'; //显示红点
					friendlist_son.insertBefore(marklist[data.message[i].sender], friendlist_son.children[0]); //
					RecordBefore();
				}
				var display = friendlist_son.children[0].children[2].style.display;
				friendlist_son.children[0].children[2].style.display = display;
				rightlist.children[0].click();
			}, 500)

			for (let i = 0; i < friendchat.length; i++) {
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
			for (let i = 0; i < data.message.length; i++) {
				var time = data.message[i].date;
				var timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				marklist[data.message[i].sender].children[1].children[2].innerText = timecontent;
				if (data.message[i].sender != myID) {
					contents += (content_five1 + timecontent + content_left + data.message[i].content + content_five2);
				} else {
					contents += (content_five1 + timecontent + content_right + data.message[i].content + content_five2);
				}
			}
			contents = pikatoImg(contents);
			chatlist[chatmark].innerHTML = contents;
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
			if (data.message.length > 0) {
				var timecontent = data.message[data.message.length - 1].date.substring(5, 10) + '  ' + data.message[data.message
					.length - 1].date.substring(11, 16);
				marklist[hisid].children[1].children[2].innerText = timecontent;
			}
			historymark[hisid] = 0;
			if (data.message.length > 0)
				marklist[hisid].children[1].children[1].innerText = data.message[data.message.length - 1].content;
			for (let i = 0; i < Math.ceil(data.message.length / 10); i++)
				historylist[hisid + 0][i] = [];
			for (var j = 0, i = data.message.length - 1; i >= 0; i--, j++) {
				var time = data.message[i].date;
				var timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				if (data.message[i].sender != myID) {

					historylist[hisid + 0][Math.floor(j / 10)][j % 10] = (content_five1 + timecontent + content_left + pikatoImg(data.message[
						i].content) + content_five2)
				} else {
					historylist[hisid + 0][Math.floor(j / 10)][j % 10] = (content_five1 + timecontent + content_right + pikatoImg(data.message[
						i].content) + content_five2)
				}
			}

		},
	})

}

function maskshow(q) {
	document.querySelector('#mask').style.display = 'block';
	document.querySelector('#alert').innerText = q;
}
