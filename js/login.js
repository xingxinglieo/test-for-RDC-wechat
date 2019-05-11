//登之前确保登出;
document.cookie ="id=1";
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
if(localStorage.getItem("status")=="true"){
	document.querySelector('#remember').checked = true;
	document.querySelector('#login_account').value = localStorage.getItem('username');
	document.querySelector('#login_password').value = localStorage.getItem('password');
}
else
document.querySelector('#remember').checked = false;//保存密码函数

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

			setTimeout(function() {
				document.querySelector('#textbtn_before').style.display = 'none';
				friendlist_son.insertBefore(marklist[chatmark], friendlist_son.children[0]); //将聊天头像提前
				srcoll_son.style.top = '0px';
				friendlist_son.style.top = '0px';
			}, 300)
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
document.querySelector('#newtip').onclick = function() {
	this.style.display = 'none';
	scrolllist[chatmark].children[0].style.top = chatlist[chatmark].parentNode.offsetHeight - scrolllist[chatmark].children[
		0].offsetHeight + 'px';
	chatlist[chatmark].style.top = chatlist[chatmark].parentNode.offsetHeight - chatlist[chatmark].scrollHeight + 'px'; //点击后回滚底部
	marklist[chatmark].children[2].style.display = 'none';
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
document.onclick = function() {
	document.querySelector('#login_out').style.display = 'none';
	// setTimeout(function(){if(document.querySelector('#change').style.display =='block')
	// document.querySelector('#change').style.display = 'none';},10);
	// if(document.querySelector('#change').style.display =='none')
	// return;
	// else
	document.querySelector('#change').style.display ='none';
}
document.querySelector('#change').onclick = function(e){
	e.stopPropagation()
}
document.addEventListener("keydown", function(e) {
	if (e.keyCode == 116) {
		e.preventDefault();
		$.ajax({
			type: "GET",
			url: url + '/logout',
			dataType: 'json',
			success: function() {
				document.querySelector("#main").style.display = 'none'; //登出成功后隐藏界面
				location.reload(true); //刷新页面
			},
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
document.querySelector('#lasthistory').onclick = function(){
	if(document.querySelector('.chatscroll_son').style.top<= 5){
		var content;
		console.log(historylist[chatmark+0],chatlist[chatmark].innerHTML);
		for(i = 0; i<historylist[chatmark+0][0].length;i++){
			content = historylist[chatmark+0][0][i] + content;
			console.log(content); 
	}
	console.log(content);
	chatlist[chatmark].innerHTML = content + chatlist[chatmark].innerHTML;
	scrollfun(chatlist[chatmark], scrolllist[chatmark].children[0]); //更新滚动条长度
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
	},
})
