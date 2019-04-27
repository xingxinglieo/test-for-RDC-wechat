function getList() {
	$.ajax({
		type: "POST", //data 传送数据类型。post 传递
		url: url + '/getList',
		dataType: 'json',
		success: function(data) {
			friendlist.style.height = friendlist.parentNode.offsetHeight - friendlist.parentNode.children[0].offsetHeight -
			friendlist.parentNode.children[1].offsetHeight + 'px';//高度自适应
			myObj = {
				id:myID+0,
				nickname:'',
			}
			data.message.splice(myID+0,0,myObj)
			friendchat = data.message;
			//左边栏开始
			
			var friendlist_son = document.querySelector('#friendlist_son'); //左边
			var srcoll_son = document.querySelector('#srcoll_son'); //左滚动条
			var rightlist = document.querySelector("#rightlist"); //右边
			var rightscroll_son = document.querySelector('#rightcscroll_son');
			marklist = [];//存储左栏
			chatlist = [];//存储聊天窗口
			textlist = [];//储存内容
			scrolllist = [];
			var content = '';
			var rightcontent = '';
			for (i = 0; i < friendchat.length;i++) {
				if(i ==myID ){content += (content_one1 + i + content_one2 +'我'+ content_two);
					rightcontent += (content_three1 + i + content_three2 + friendchat[i].nickname + content_four);continue;}
				if (friendchat[i].nickname != '') {
					content += (content_one1 + i + content_one2 + friendchat[i].nickname + content_two);
					rightcontent += (content_three1 + i + content_three2 + friendchat[i].nickname + content_four);
				} else {
					content += (content_one1 + i + content_one2 + '未命名(id:' + friendchat[i].id + ')' + content_two);
					rightcontent += (content_three1 + i + content_three2 + '未命名(id:' + friendchat[i].id + ')' + content_four);
				}
			} //动态生成list内容
			friendlist_son.innerHTML = content;
			rightlist.innerHTML = rightcontent;
			for (i = 0; i < friendchat.length; i++) {
				chatlist[i] = document.createElement('div');
				scrolllist[i] = document.createElement('div');
				chatlist[i].className = 'chat_son';
				scrolllist[i].className = 'chatscroll';
				scrolllist[i].innerHTML = '<div class ="chatscroll_son"></div>'
				document.querySelector('#chat_content').appendChild(chatlist[i]);
				document.querySelector('#chat_content').appendChild(scrolllist[i]);
				marklist[i] = friendlist_son.children[i];
				textlist[i] = '';
				getChathistory(i+'');
				
				marklist[i].onclick = function(){

					for(i = 0;i<marklist.length;i++){
					marklist[i].style.backgroundColor = 'transparent';
					chatlist[i].style.display = 'none';}
					this.style.backgroundColor = '#3A3F45';
					scrolllist[chatmark].style.display = 'none';
					chatmark = this.getAttribute("mark");
					getChathistory(chatmark);
					if(timeIP){clearInterval(timeIP)}
					timeIP=setInterval(function(){getChathistory(chatmark)},2000)
					document.querySelector('#chattext').value = textlist[chatmark];
					chatlist[chatmark].style.display = 'block';
					scrolllist[chatmark].style.display = 'block';
					document.querySelector('#chat_top').innerText = this.children[1].children[0].innerText;
				}
			}
			setTimeout(function(){for(i=friendchat.length-1;i>=0;i--){
				if(marklist[i].children[1].children[1].innerText !=""){
				friendlist_son.insertBefore(marklist[i], friendlist_son.children[0])};
			}},1000)
			
			// chat_son[2].style.display = 'block';
// 			for (i = 0; marklist.length; i++) {
// 				marklist[i].onclick = function(){
// 					consolo.log(this.getAttribute("mark"));
// 				}
// 			}
			scrollfun(friendlist_son, srcoll_son);//滚动条
			scrollfun(rightlist, rightscroll_son); //左右栏结束	
			document.querySelector("#main").style.display = 'none';
			rightlist.onclick = function(e) {
				e.target.parentNode.click();
				// var d = e.target.getAttributeNode("mark").value;
				chatmark = e.target.getAttributeNode("mark").value
				message(chatmark);//点击右栏时候的变化

			}
			document.querySelector('#barleft').click();//让页面回到左栏
			for(i=1;i<friendchat.length;i++){
				message(''+i);
			}//获取每
			rightlist.children[0].click();//让画面显示回第一个
		}, //这里是sceess的函数的结尾别混了
	})
}

function message(e) {
	var friendmessage = $.ajax({
		type: "GET", //data 传送数据类型。post 传递
		url: url + '/getUserInfor',
		data: {
			id: e
		},
		dataType: 'json',
		success: function(data) {
			document.querySelector('#nickname').style.color = 'black';
			if (data.message.nickname == '')
				document.querySelector('#nickname').innerText = '未命名(id:' + e + ')';
			else
				{document.querySelector('#nickname').innerText = data.message.nickname;
				document.getElementsByClassName('right_friendname')[e].innerText = data.message.nickname;
				if(e!=myID)
				marklist[e].children[1].children[0].innerText = data.message.nickname;
				}
			if (data.message.introduction == '')
				document.querySelector('#introdution').innerText = '签名:    ';
			else
			document.querySelector('#introdution').innerText = '签名:    ' + data.message.introduction;
			document.querySelector('#age').innerText = '年龄:    ' + data.message.age;
			document.querySelector('#address').innerText = '居住:    ' + data.message.address;
			document.querySelector('#mailbox').innerText = '邮箱:    ' + data.message.mailbox;
			
		},
		error: {
			function() {
				document.querySelector('#nickname').style.color = 'red';
				document.querySelector('#nickname').innerText = '返回错误,请检查网络'
			}

		}
	})
} //message结尾

function login(a, p) {
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
				login_tip.innerText = '登录成功,请稍候..';
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
					document.querySelector('#lang').style.display = 'none';
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
						if (data.result == 'success'){
							document.querySelector('#change').style.display = 'none';
							maskshow('修改成功!');}

						else
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
function out() {
	$.ajax({
		type: "GET",
		url: url + '/logout',
		dataType: 'json',
		success: function() {
			document.querySelector("#main").style.display = 'block';
			login_contain.style.display = 'block';
			document.querySelector('#icon').style.display = 'block';
			document.querySelector('#lang').style.display = 'block';
			document.querySelector('#copyright').style.display = 'block';
			login_tip.innerText = '';
			document.querySelector('#mask').style.display = 'block';
			maskshow('登出成功');
		},
		error: function() {
			maskshow('登出失败,请检查网络或者刷新页面');
		},
	});
} //out结尾
function scrollfun(friendlists, scroll_son) { //内容 滚动条子元素
	if(friendlists.offsetHeight<=friendlists.parentNode.offsetHeight)return;
	var scroll_scale = friendlists.scrollHeight / friendlists.parentNode.offsetHeight; //设置比例
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
		var scroll_target = (friendlists.parentNode.offsetHeight - scroll_son.offsetHeight) * 0.2;
		// var scrollabs = e.wheelDelta || e.
		var mark = Math.abs(e.wheelDelta) / e.wheelDelta;
		var timeID = setInterval(function() {
			scroll_son.style.top = scroll_son.offsetTop - 5 * mark + 'px';
			friendlists.style.top = friendlists.offsetTop + 5 * scroll_scale * mark + 'px';
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
				if (scroll_son.offsetTop >= b + scroll_target) {
					scroll_son.style.top = b + scroll_target + 'px';
					friendlists.style.top = a - scroll_target * scroll_scale + 'px';
					clearInterval(timeID);
				}
				if (scroll_son.offsetTop >= friendlists.parentNode.offsetHeight - scroll_son.offsetHeight) {
					scroll_son.style.top = friendlists.parentNode.offsetHeight - scroll_son.offsetHeight + 'px';
					friendlists.style.top = (scroll_son.offsetHeight - friendlists.parentNode.offsetHeight) * scroll_scale + 'px';
					clearInterval(timeID);
					return;
				}

			}
		}, 1) //定时器末尾
	}
	 function addMouseWheelEvent(element,func) {
 
     if (typeof element.onmousewheel == "object") {
       element.onmousewheel = function() {
         func();
      };
    }
 
    if (typeof element.onmousewheel == "undefined") {
       element.addEventListener("DOMMouseScroll",func,false);
    } 
  }
}//滚动结尾
function UserInfor(UserID) {
	$.ajax({
		type: "GET",
		url: url + '/getUserInfor',
		data: {
			id: UserID
		},
		dataType: 'json',
		success: function(data) {
		},
	});
}
function sendChat(receiver) {
		var text  = document.querySelector('#chattext');
	textvalue = text.value;
	$.ajax({
		type: "POST",
		url: url + '/sendContent',
		data: {
			receiver:receiver,//被接收者的userid
			content:textvalue//字符串，消息内容
		},
		dataType: 'json',
		success: function(data) {
			
		},
		error:function(data){
			
		}
	});
}
function maskshow(q) {
	document.querySelector('#mask').style.display = 'block';
	document.querySelector('#alert').innerText = q;
// 	setTimeout(function() {
// 		document.querySelector('#mask').style.display = 'none';
// 	}, 10000);
}
function getChathistory(hisid){
	if(hisid == myID) return;
	$.ajax({
		type: "POST",
		url: url + '/getChatRecord',
		data: {
			id: hisid,
		},
		dataType: 'json',
		success: function(data) {
			var content ='';
			
			for( i=0;i<data.message.length;i++){
				var time = data.message[i].date;
				var timecontent = data.message[i].date.substring(5,10)+'  '+data.message[i].date.substring(11,16);
				if(data.message[i].sender!=myID){
					content+= (content_five1+timecontent+content_left+data.message[i].content+content_five2);
				}
				else{
					content+= (content_five1+timecontent+content_right+data.message[i].content+content_five2);
				}
			}
			chatlist[chatmark].innerHTML = content;
			marklist[hisid].children[1].children[1].innerText = data.message[data.message.length-1].content;
			scrollfun(chatlist[chatmark],scrolllist[chatmark].children[0]);
							if(chatlist[chatmark].onwheel){
					chatlist[chatmark].style.top =chatlist[chatmark].parentNode.offsetHeight-chatlist[chatmark].scrollHeight+'px';
					scrolllist[chatmark].children[0].style.top =(chatlist[chatmark].scrollHeight-chatlist[chatmark].parentNode.offsetHeight)/
					(chatlist[chatmark].scrollHeight/chatlist[chatmark].parentNode.offsetHeight)+'px';
				}
		},
	});
}
