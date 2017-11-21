
// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("color");
  var color = select.children[select.selectedIndex].value;
  localStorage["favorite_color"] = color;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

function Buttonchange(btntype,state){
	if (state=="selected"){
		document.getElementById(btntype).style.backgroundColor='#FD6464';
	}else if(state=="unselected"){
		document.getElementById(btntype).style.backgroundColor='#D1D1D1';
	}
}

function ChangeSettings(type,state){
	var cmd;
	cmd=type+state;
	chrome.runtime.sendMessage({cmd: cmd},function(response) {});
}


function restore(){

  var Showscore = localStorage["Showscore"];
  if (!Showscore) {
    localStorage["Showscore"] = "enabled";
  }
  
  if(Showscore=="enabled"){
		Buttonchange('scoreenabled','selected');
		Buttonchange('scoredisabled','unselected');
  }else{
		Buttonchange('scoreenabled','unselected');
		Buttonchange('scoredisabled','selected');
  }
  
  //ChangeButtontype("GPA",ShowGPA);
  
  var Timecheck=localStorage["Timecheck"];
  if (!Timecheck) {
    localStorage["Timecheck"] = "enabled";
  }
 if(Timecheck=="enabled"){
	Buttonchange('timecheckenabled','selected');
	Buttonchange('timecheckdisabled','unselected');
 }else {
	Buttonchange('timecheckenabled','unselected');
	Buttonchange('timecheckdisabled','selected');
 }
  

   
  var newver=localStorage["NewVer"];
  if (!newver) {
    localStorage["NewVer"] = "enabled";
  }
  
  if(newver=="enabled"){
	Buttonchange('newverenabled','selected');
	Buttonchange('newverdisabled','unselected');
  }else {
	Buttonchange('newverenabled','unselected');
	Buttonchange('newverdisabled','selected');
 }
  
  
  	var Stu = localStorage["Stu"];
	if(localStorage["Beta"]==1){
		Beta="内测版";
		document.getElementById("beta").style.color='red';
		document.getElementById("beta").innerHTML="用户："+Stu+"（"+Beta+"）";
	}else {
		Beta="稳定版";
			Buttonchange('newverenabled','unselected');
			Buttonchange('newverdisabled','unselected');
		ChangeSettings('NewVer','disabled');
		document.getElementById("beta").style.color='black';
		document.getElementById("beta").innerHTML="用户："+Stu+"（"+Beta+'）<br>灰色功能受限，开通权限后请重启浏览器.<a href="https://enrollment.zju-lab.cn/apply/" target="_blank">申请内测</a>';
	}
}

function infoabout(){
	chrome.runtime.sendMessage({cmd: "about"},function(response) {
        if(localStorage["Beta"]==1){
            verdescription="内测版";
        }else {
            verdescription="公开稳定版";
        }
        document.getElementById("versionInfo").innerHTML="版本："+response+" "+verdescription+"<br>插件作者：苏酥甜心糕<br>教师评分数据来源：<br>@ZJU学习帝";
        //alert("版本："+response+" "+verdescription+"\n插件作者：苏酥甜心糕\n\n教师评分数据来源：@ZJU学习帝");
	});
}

$(document).ready(function() { 
	restore();
	document.getElementById("scoreenabled").onclick=function(){
		//if(localStorage["Beta"]!=1){
			//ChangeSettings('score','ban');
			//ChangeSettings('GPA','ban');
			
			//Buttonchange('scoreenabled','unselected');
			//Buttonchange('GPAenabled','unselected');
			//Buttonchange('scoredisabled','selected');
		//}else {
			ChangeSettings('score','enabled');
			Buttonchange('scoreenabled','selected');
			Buttonchange('scoredisabled','unselected');
		//}
		
	};

	document.getElementById("scoredisabled").onclick=function(){
			ChangeSettings('score','disabled');
			Buttonchange('scoreenabled','unselected');
			Buttonchange('scoredisabled','selected');
	};
	//document.getElementById("GPAdisabled").onclick=function(){
		//if(localStorage["Beta"]!=1){
		//	ChangeSettings('GPA','ban');
		//}else {
		//	ChangeSettings('GPA','disabled');
		//}
	//};
	
	document.getElementById("timecheckenabled").onclick=function(){
		ChangeSettings('timecheck','enabled');
		Buttonchange('timecheckenabled','selected');
		Buttonchange('timecheckdisabled','unselected');
		};
	document.getElementById("timecheckdisabled").onclick=function(){
		ChangeSettings('timecheck','disabled');
		Buttonchange('timecheckenabled','unselected');
		Buttonchange('timecheckdisabled','selected');
	};
		
	document.getElementById("newverenabled").onclick=function(){
		if(localStorage["Beta"]!=1){
			ChangeSettings('NewVer','disabled');
			Buttonchange('newverenabled','unselected');
			Buttonchange('newverdisabled','unselected');
		}else{
			ChangeSettings('NewVer','enabled');
			Buttonchange('newverenabled','selected');
			Buttonchange('newverdisabled','unselected');
		}
	};
	
	document.getElementById("newverdisabled").onclick=function(){
		if(localStorage["Beta"]!=1){
			ChangeSettings('NewVer','disabled');
			Buttonchange('newverenabled','unselected');
			Buttonchange('newverdisabled','unselected');
		}else{
			ChangeSettings('NewVer','disabled');
			Buttonchange('newverenabled','unselected');
			Buttonchange('newverdisabled','selected');
		}
	};	
				
		
	//document.getElementById("sparecheckenabled").onclick=function(){ChangeSettings('sparecheck','enabled');};
	//document.getElementById("sparecheckdisabled").onclick=function(){ChangeSettings('sparecheck','disabled');};
	//document.getElementById("about").onclick=infoabout;
    infoabout();
}); 



