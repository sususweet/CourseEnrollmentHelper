
var data;
var adjustinner;
var item=document.getElementById("kcmcgrid"); 
var tbody=item.getElementsByTagName("tbody")[0]; 
var trs=tbody.getElementsByTagName("tr"); 
var student;
var busy;				

function getAjaxEnabled(t){
try{
if(t >= trs.length-1){
return; 
}
var tds=trs[t].getElementsByTagName("td"); 
tds=tds[0].innerHTML.match(/window.open.{0,}xsxjs/);
tds=tds[0].replace("window.open('","");
tds=tds.replace("','xsxjs","");
var _color=trs[t]; 
url=adjustinner+'/'+tds;
	
$.ajax({
        type: "GET",
        url: tds,
		cache:false,
success: function (datat) {
	datat=datat.match(/target='_blank'>.{1,}<\/a><\/td><td>.{1,}<\/td>/g);
	var _timeok;
	var _spareok;
	
	for (var i=0;i<datat.length;i++){
	NProgress.inc(); 
		
		//console.log(datat[i]);
		try{
		var term=datat[i].match(/<td>[\u4e00-\u9fa5]{1,2}<\/td>/);
		term=term[0].match(/[\u4e00-\u9fa5]{1,2}/);
		term=term[0];
		//console.log (term);
		}
		catch (err){
		term="0";
		}
		
		try{
		var time=datat[i].match(/周[\u4e00-\u9fa5]{1}第.{1,}节.{0,4}<\/td>/g);
		//console.log (coursetime);
		time=time[0];
		//console.log (coursetime);
		time=time.replace("</td>","");
		//console.log (time);
		}
		catch (err){
		time="0";
		}
		
		try{
		var spare=datat[i].match(/-{0,1}\d{1,}\/\d{1,}/);
		spare=spare[0].match(/-{0,1}\d{1,}\//);
		spare=spare[0].replace("/","");
		//console.log(spare);
		}
		catch (err){
			spare="0";
		}
		
		var targettime = Convertday(time,term);
		targettime=targettime.split(",");

		for (j=0;j<targettime.length-1;j++){
			if (targettime[j]!=""){
				if (busy.indexOf(targettime[j])>=0) {
					_timeok=0;
					break; 
				}
				else{
					_timeok=1;
				}
			}
		}
		
		if (spare>0){
			_spaceok=1;
		}else {
			_spaceok=0;
		}
		if (_spaceok==1&&_timeok==1){
			_color.style.backgroundColor="#CBFFBF";
			_color.onmouseout=function(){ this.style.backgroundColor="#CBFFBF";}
			_color.onmouseover=function(){ this.style.backgroundColor="#ACFF9B";}	
			break;
		}

	}
			NProgress.done();
}

});
		t ++;
		getAjaxEnabled(t); 
}
catch(err){
	console.log(err);
	swal("课程冲突判断模块错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~", "error");

}
}

chrome.extension.sendRequest({key: "Getsettings"},function(response) {
	response=response.split(",");
	Timecheck=response[2];

	if (Timecheck=="enabled"){
	student=window.document.location.search.match(/xh=\d{1,}/);
	student=student[0].replace("xh=","");
	adjustinner=window.document.location.origin;

	busy=Checktime(student,adjustinner);

	getAjaxEnabled(1);
	}
}
);