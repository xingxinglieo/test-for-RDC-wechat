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
		success: function(data) {
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
						document.querySelector('#myname').innerHTML = data.message.nickname +
							'<span id="timetip" style="color: white;line-height: 40px;font-size:12px;">' + timetip + '</span>';
					},
				});
				getList();
				setTimeout(function() {
					login_contain.style.display = 'none';
					document.querySelector('#icon').style.display = 'none';
					document.querySelector('#copyright').style.display = 'none';
					document.querySelector("#main").style.visibility = 'visible';
					document.querySelector("#main").style.display = 'block';
				}, 500)
			} else {
				login_tip.style.color = 'red';
				login_tip.innerText = '账户密码错误或未登出,请检查或者f5刷新后重试';
			}
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
								document.querySelector('#myname').innerHTML = data.message.nickname +
									'<span id="timetip" style="color: white;line-height: 40px;font-size:12px;">' + timetip + '</span>';
							},
						})
					},
					error: function() {
						maskshow('修改失败,请检查网络或者刷新页面');
					},
				})
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
				friendlist.parentNode.children[1].offsetHeight + 'px'; //高度自适应
			myObj = {
				id: myID + 0,
				nickname: '我',
			}
			data.message.splice(myID + 0, 0, myObj);
			friendchat = data.message;
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
			var content = '';
			var rightcontent = '';
			for (i = 0; i < friendchat.length; i++) {
				if (i == myID) {
					content += (content_one1 + i + content_one2 + '我' + content_two);
					rightcontent += (content_three1 + i + content_three2 + friendchat[i].nickname + content_four);
					continue;
				}
				if (friendchat[i].nickname != '') {
					content += (content_one1 + i + content_one2 + friendchat[i].nickname + content_two);
					rightcontent += (content_three1 + i + content_three2 + friendchat[i].nickname + content_four);
				} else {
					content += (content_one1 + i + content_one2 + '未命名(id:' + friendchat[i].id + ')' + content_two);
					rightcontent += (content_three1 + i + content_three2 + '未命名(id:' + friendchat[i].id + ')' + content_four);
				}
			} //动态生成list内容
			friendlist_son.innerHTML = content; //聊天列表的内容插入
			rightlist.innerHTML = rightcontent; //好友列表的内容插入
			scrollfun(friendlist_son, srcoll_son); //滚动条
			scrollfun(rightlist, rightscroll_son);
			for (i = 0; i < friendchat.length; i++) {
				chatlist[i] = document.createElement('div');
				scrolllist[i] = document.createElement('div');
				chatlist[i].className = 'chat_son';
				scrolllist[i].className = 'chatscroll';
				scrolllist[i].innerHTML = '<div class ="chatscroll_son"></div>';
				document.querySelector('#chat_content').appendChild(chatlist[i]); //加入好友列表
				document.querySelector('#chat_content').appendChild(scrolllist[i]);
				marklist[i] = friendlist_son.children[i]; //记录聊天列表原始位置
				textlist[i] = '';
				// getChathistory(i+'');不能一开始就获取历史信息,否则未读消息无法获取
				marklist[i].onclick = function() { //聊天列表的点击事件
					for (i = 0; i < marklist.length; i++) {
						marklist[i].style.backgroundColor = 'transparent';
						chatlist[i].style.display = 'none';
					} //先清空颜色 全部隐藏
					this.style.backgroundColor = '#3A3F45'; //再给点击对象更新颜色
					document.querySelector('#newtip').style.display = 'none';//使聊天框的提示消失
					scrolllist[chatmark].style.display = 'none';
					chatmark = this.getAttribute("mark");
					// getChathistory(chatmark);不要一开始就让用户看到所有消息,让它点击之后再看
					marklist[chatmark].children[2].style.display = 'none';
					if (timeIP) {
						clearInterval(timeIP)
					}
					// timeIP = setInterval(function() {
					// 	getChathistory(chatmark);
					// }, 2000)//进入与某位用户的聊天窗口就每2秒更新一次并清除上次的可
					//重写
					document.querySelector('#chattext').value = textlist[chatmark];
					chatlist[chatmark].style.display = 'block';
					scrolllist[chatmark].style.display = 'block';
					document.querySelector('#chat_top').innerText = this.children[1].children[0].innerText;
				}
				rightlist.children[i].onclick = function(e) {
					for(i=0;i<messagelist.length;i++) 
					document.querySelector("#messagedetail").children[i].style.display = 'none';
					
					chatmark= this.getAttribute("mark");
					document.querySelector("#messagedetail").children[chatmark].style.display = 'block';
				}
			}
			setTimeout(function() {
				for (i = friendchat.length - 1; i >= 0; i--) {
					if (marklist[i].children[1].children[1].innerText != "") {
						friendlist_son.insertBefore(marklist[i], friendlist_son.children[0])
					};
				}
			}, 500)
			setInterval(function(){newMessage()},2000);
			// chat_son[2].style.display = 'block';
			// 			for (i = 0; marklist.length; i++) {
			// 				marklist[i].onclick = function(){
			// 					consolo.log(this.getAttribute("mark"));
			// 				}
			// 			}	
			document.querySelector("#main").style.display = 'none';

			document.querySelector('#barleft').click(); //让页面回到左栏
			for (i = 0; i < friendchat.length; i++) {
				message('' + i);
			}
			setTimeout(function() {
					for(i = 0 ;i<messagelist.length;i++){
						message_content+= messagelist[i];
					}

					document.querySelector('#messagedetail').innerHTML = message_content;
					for (i = 0; i < friendchat.length; i++) {
						document.querySelectorAll('.send_btn')[i].onclick = function() { //详情页面发送按钮的点击事件
							document.querySelector('#barleft').click();
							marklist[chatmark].click();
							friendlist_son.insertBefore(marklist[chatmark], friendlist_son.children[0]); //将聊天头像提前
							document.querySelector('#srcoll_son').style.top = '0px';
							document.querySelector('#friendlist_son').style.top = '0px';
							
						};
					};
					// message(chatmark); //点击右栏时候的变化
				} //左右栏结束
				, 2500);
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
			// console.log(e);
			var name;
			if (data.message.nickname == undefined || data.message.nickname == '')
				name = '未命名(id:' + e + ')'; //对方未命名时 加上未命名
			else {
				name = data.message.nickname;
				if (e != myID)
					marklist[e].children[1].children[0].innerHTML = data.message.nickname; //如果是我的id 聊天页面我的名字变成我
			}
			messagelist[e] = message_one + name + message_two + data.message.introduction + message_three + data.message.age +
				message_four + data.message.address + message_five + data.message.mailbox + message_six;
				// message(e+1);
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
				chatlist[data.message[i].sender].innerHTML +=(content_five1 + timecontent + content_left + data.message[i].content + content_five2);
				marklist[data.message[i].sender].children[1].children[1].innerText = data.message[i].content;//提示更新 内容更新
				scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
				if(data.message[i].sender==chatmark&&chatlist[chatmark].offsetTop<=chatlist[chatmark].parentNode.offsetHeight-chatlist[chatmark].scrollHeight+200){
				scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[0].offsetHeight + 'px';
				chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight-chatlist[chatmark].scrollHeight+'px';
				}
				if(data.message[i].sender==chatmark&&chatlist[chatmark].offsetTop>=chatlist[chatmark].parentNode.offsetHeight-chatlist[chatmark].scrollHeight+200){
										document.querySelector('#newtip').innerHTML = data.message[i].content;
					document.querySelector('#newtip').style.display = 'block';

				}
				if(data.message[i].sender!=chatmark);//底部重置)
				marklist[data.message[i].sender].children[2].style.display = 'block';//显示红点
				
			}
		},
		error: function() {

		}
	});
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
function sendChat(receiver) {
	var text = document.querySelector('#chattext');
	textvalue = text.value;
	$.ajax({
		type: "POST",
		url: url + '/sendContent',
		data: {
			receiver: receiver, //被接收者的userid
			content: textvalue //字符串，消息内容
		},
		dataType: 'json',
		success: function(data) {

		},
		error: function(data) {

		}
	});
}
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
			var content = '';
			//这个for循环为更新聊天窗消息
			for (i = 0; i < data.message.length; i++) {
				var time = data.message[i].date;
				var timecontent = data.message[i].date.substring(5, 10) + '  ' + data.message[i].date.substring(11, 16);
				if (data.message[i].sender != myID) {
					content += (content_five1 + timecontent + content_left + data.message[i].content + content_five2);
				} else {
					content += (content_five1 + timecontent + content_right + data.message[i].content + content_five2);
				}
			}
			chatlist[chatmark].innerHTML = content;
			// console.log(data.message[data.message.length-1].content);
			marklist[hisid].children[1].children[1].innerText = data.message[data.message.length - 1].content; //用户名 
			scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]);
			if(scrolllist[chatmark].children[0].scrollHeight>scrolllist[chatmark].children[0].offsetHeight)
			{ //更新滚动条长度
			scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[0].offsetHeight + 'px';
			chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight-chatlist[chatmark].scrollHeight+'px';
			}//回到底部
			// 			if(chatlist[chatmark].onwheel){
			// 	chatlist[chatmark].style.top =chatlist[chatmark].parentNode.offsetHeight-chatlist[chatmark].scrollHeight+'px';
			// 	scrolllist[chatmark].children[0].style.top =(chatlist[chatmark].scrollHeight-chatlist[chatmark].parentNode.offsetHeight)/
			// 	(chatlist[chatmark].scrollHeight/chatlist[chatmark].parentNode.offsetHeight)+'px';
			// }原用来每次有新消息时掉到最底部 有严重bug已荒废
		},
	});
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
		var b = scroll_son.offsetTop;
		var a = friendlists.offsetTop;
		var scroll_target = 8;
		// var scroll_target = 2;
		// var scrollabs = e.wheelDelta || e.
		var mark = Math.abs(e.wheelDelta) / e.wheelDelta;
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
					friendlists.style.top = friendlists.parentNode.offsetHeight-  friendlists.scrollHeight + 'px';
					clearInterval(timeID);
					return;
				}

			}
		}, 1) //定时器末尾
	}

} //滚动结尾
function maskshow(q) {
	document.querySelector('#mask').style.display = 'block';
	document.querySelector('#alert').innerText = q;
	// 	setTimeout(function() {
	// 		document.querySelector('#mask').style.display = 'none';
	// 	}, 10000);
}

