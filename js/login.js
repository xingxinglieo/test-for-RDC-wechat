//登之前确保登出;
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 116) {
			e.preventDefault();
			out();
			location.reload(true); //要做的其他事情
		}
	}, false);
	var url = 'http://120.77.247.10';
	var timeIP;
	var content_one1 = '<div class="chat" mark="';
	var content_one2 = '"><img src="img/friend.png" class="friendhead"><div class="info"><p class="friendname">';
	var content_two = '</p><p class = "chattip"></p></div><div class="dot"></div></div>'
	var content_three1 =
		'<div class="right_chat" mark="';
	var content_three2 = '"><img src="img/friend.png" class="right_friendhead"><p class="right_friendname">'
	var content_four = '</p></div>';
	var content_five1 = '<div class="timetip">';
	var content_five2 =  '</div>';
	var content_right = '</div><div class="chathead" style="float: right;background-image: url(img/myicon.png);"></div><div class="chats rightchat">'
	var content_left =  '</div><div class="chathead" style="float: left;background-image:url(img/friend.png);"></div><div  class="chats leftchat">'
	//content+timetip+right/left+内容+content_five2;
	var login_contain = document.querySelector('#login_contain');
	var login_btn = document.querySelector('#login_btn');
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
		// login('hxy', '123');
		document.querySelector("#lout").onclick = function() {
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
					document.querySelector('#cmailbox').value = data.message.mailbox;
				},
			})
			document.querySelector('#change').style.display = 'block';
		};
		$.ajax({
			type: "POST",
			url: url + '/getChatRecord',
			data: {
				id: '1',
			},
			dataType: 'json',
			success: function(data) {},
		});
	}
	// login_btn.click();
	document.querySelector('#login_password').onkeydown = function(e) {
		if (e.keyCode == 13)
			login_btn.click();
	}
	document.querySelector('#mask_btn').onclick = function() {
		document.querySelector('#mask').style.display = 'none';
	};
	document.querySelector('#barleft').onclick = function() {
		document.querySelector('#barleft').onclick = 'none';
		document.querySelector('#barmiddle').style.display = 'none';
		document.querySelector('#barright').style.display = 'none';
	}
	document.querySelector('#chattext').onkeydown = function(e) {
		if (e.keyCode == 13)
			document.querySelector('#textbtn').click();
		textlist[chatmark] = this.value;
	}


	document.querySelector('#textbtn').onclick = function() {
		// 	document.querySelector('#rotate').style.display = 'none';
		// 	document.querySelector('#rotate').style.display = 'block';
		document.querySelector('#textbtn_before').style.display = 'block';
		friendlist_son.insertBefore(marklist[chatmark], friendlist_son.children[0]); //将聊天头像提前
		srcoll_son.style.top = '0px';
		friendlist_son.style.top = '0px';
		var text = document.querySelector('#chattext'); //滚动提前
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
				setTimeout(function(){document.querySelector('#textbtn_before').style.display = 'none';},300)
				
				getChathistory(chatmark);
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
		e.stopPropagation();
	};
	document.onclick = function() {
		// if(document.querySelector('#login_out').style.display =='block')
		document.querySelector('#login_out').style.display = 'none';
	};
	document.querySelector('#friendlist').style.height = '593px';
	document.querySelector('#outl').onclick = function() {
		out();
		document.querySelector('#mask_btn').onclick = function() {
			location.reload(true);
		}
	};
	document.querySelector('#xx').onclick = function() {
		document.querySelector("#change").style.display = 'none';
	}
	document.querySelector('#barleft').onclick = function() {
		listhidden();
		document.querySelector('#chatcontain').style.display = 'block'
		document.querySelector("#friendlist_son").style.display = 'block';
		document.querySelector('#srcoll').style.display = 'block';

	}
	document.querySelector('#barmiddle').onclick = function() {
		listhidden();
		document.querySelector('#frame').style.display = 'block'
		document.querySelector('#middlelist').style.display = 'block';
		document.querySelector('#middlescroll').style.display = 'block';
	}
	document.querySelector('#barright').onclick = function() {
		listhidden();
		document.querySelector('#messagedetail').style.display = 'block'
		document.querySelector('#rightlist').style.display = 'block';
		document.querySelector('#rightcscroll').style.display = 'block';
	}

	function listhidden() {
		document.querySelector('#chatcontain').style.display = 'none'
		document.querySelector('#frame').style.display = 'none'
		document.querySelector('#messagedetail').style.display = 'none'
		document.querySelector("#friendlist_son").style.display = 'none';
		document.querySelector('#srcoll').style.display = 'none';
		document.querySelector('#middlelist').style.display = 'none';
		document.querySelector('#middlescroll').style.display = 'none';
		document.querySelector('#rightlist').style.display = 'none';
		document.querySelector('#rightcscroll').style.display = 'none';
	}
	document.querySelector('#send_btn').onclick = function() {
		document.querySelector('#barleft').click();
		marklist[chatmark].click();
	}
