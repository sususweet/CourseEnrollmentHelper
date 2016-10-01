
function Converttime(time){
	var res="";
	if (time.indexOf("1")>=0&&time.indexOf("10")<0&&time.indexOf("11")<0&&time.indexOf("12")<0&&time.indexOf("13")<0) {res=res+",01";}
	if (time.indexOf("2")>=0&&time.indexOf("12")<0) {res=res+",02";}
	if (time.indexOf("3")>=0&&time.indexOf("13")<0) {res=res+",03";}
	if (time.indexOf("4")>=0) {res=res+",04";}
	if (time.indexOf("5")>=0) {res=res+",05";}
	if (time.indexOf("6")>=0) {res=res+",06";}
	if (time.indexOf("7")>=0) {res=res+",07";}
	if (time.indexOf("8")>=0) {res=res+",08";}
	if (time.indexOf("9")>=0) {res=res+",09";}
	if (time.indexOf("10")>=0) {res=res+",10";}
	if (time.indexOf("11")>=0) {res=res+",11";}
	if (time.indexOf("12")>=0) {res=res+",12";}
	if (time.indexOf("13")>=0) {res=res+",13";}
	return res;
}
	
function Convertterm(term){
	//获取课程所在学期
	var termcache="";
	if (term.indexOf("秋")>=0){termcache=termcache+",01";}
	if (term.indexOf("冬")>=0){termcache=termcache+",02";}
	if (term.indexOf("春")>=0){termcache=termcache+",03";}
	if (term.indexOf("夏")>=0){termcache=termcache+",04";}
	return termcache;
}

function Convertweekly(week){
	//获取课程所在学期
	var weekcache="";
	if (week.indexOf("双周")>=0){weekcache = weekcache+",d";}
	else if (week.indexOf("单周")>=0){weekcache = weekcache+",s";}
	else {weekcache = weekcache+",d,s";}
	return weekcache;
}

function GetSubject(){
	//获取课程名
	subject = document.getElementById("Label_jbxx").innerText;
	subject = subject.match(/课程名称：.*学分/);
	subject = subject[0].substr(5);
	subject=trimStr(subject.substr(0,subject.length-2));
}


	
function Convertday(coursetime,courseterm){
	
	coursetime=coursetime.split("<br>");
	var convert="";
	var res="";
	termcache=Convertterm(courseterm).split(",");

for (var h=1;h<termcache.length;h++){ 
	
	for(var i=0;i<coursetime.length;i++){ 
	//console.log(coursetime[i]);
		weekcache=Convertweekly(coursetime[i]).split(",");

		if (coursetime[i].indexOf("周一")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"1x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		
		if (coursetime[i].indexOf("周二")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"2x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		if (coursetime[i].indexOf("周三")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"3x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		if (coursetime[i].indexOf("周四")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"4x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		
		if (coursetime[i].indexOf("周五")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"5x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		
		if (coursetime[i].indexOf("周六")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"6x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		
		if (coursetime[i].indexOf("周日")>=0) {
		var cache = Converttime(coursetime[i]).split(",");
			for(var j=1;j<cache.length;j++){
				for (var w=1;w<weekcache.length;w++){
				convert=convert+"7x"+cache[j]+termcache[h]+weekcache[w]+",";
				}
			}
		}
		
	
	}
}
	return convert;
}


function Checktime(student,adjustinner){
try{
	var courseinfo=new Array();
	var busytime="";
	NProgress.inc();
	data=$.ajax({ 
	type:"GET", 
	async: false,
	timeout : 5000,
	url: adjustinner+"/xskbcx.aspx?xh="+student,
	error:function (XMLHttpRequest,status,e){
		swal("获取课表错误！", "呜呜……选课小精灵发现教务网好像出了什么问题~主人快检查下能否正常进入教务网哦~", "error");
	}
	}).responseText; 
	NProgress.done();
		data=data.match(/<A href='#' onclick="window.open\('.{1,}','kcb','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1'\)">(<i><font color=red>){0,1}.{1,}(<\/font><\/i>){0,1}<\/a><\/td><td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td>/ig);
	//console.log (data);
	//console.log (data.length-1);


	for(var i=0;i<data.length;i++){ 
	
	var course=data[i].match(/<A href='#' onclick="window.open\('.{1,}','kcb','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1'\)">(<i><font color=red>){0,1}[0-9A-Z]{8}(<\/font><\/i>){0,1}<\/A>/g);
	
	course=course[0].match(/[0-9A-Z]{8}/);
	course=course[0];
	//console.log (course);
	
	
	//var coursesite=data[i].match(/<\/a><\/td>.{1,}<\/td>/g);
	//coursesite=coursesite[0].match(/<td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td>/g);
	//console.log (coursesite);
	
	try{
	var courseterm=data[i].match(/<td>[\u4e00-\u9fa5]{1,2}<\/td>/);
	courseterm=courseterm[0].match(/[\u4e00-\u9fa5]{1,2}/);
	courseterm=courseterm[0];
	//console.log (courseterm);
	}
	catch (err){
	courseterm="0";
	}
	
	try{
	var coursetime=data[i].match(/周[\u4e00-\u9fa5]{1}第.{1,}节.{0,4}<\/td>/g);
	//console.log (coursetime);
	coursetime=coursetime[0];
	//console.log (coursetime);
	coursetime=coursetime.replace("</td>","");
	//上课时间调试入口：console.log (coursetime);
	}
	catch (err){
	coursetime="0";
	}
	courseinfo[i]={course: course,courseterm: courseterm,coursetime: coursetime};

	console.log(courseinfo[i]);
	
	
	//res=Convertday(coursetime);
	//console.log(res);
	if (coursetime!="0"&&courseterm!="0"){
	busytime=busytime+Convertday(coursetime,courseterm);
	}
	
	}	

//console.log (busytime);
return busytime;
}
catch (err){
	swal("上课时间获取模块错误！", "呜呜……/(ㄒoㄒ)/~选课小精灵无法工作啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~\n\n错误信息：\n"+err, "error");
	console.log(err);
}	
}



function GetPermit(targetdata,student){
try{
	targetdata=targetdata.match(/richContent3'>\n.{0,}\n<\/div>/);
	targetdata=targetdata[0].match(/<p>\d{1,}<\/p>/g);
	for(var i=0;i<targetdata.length;i++){ 
		target=targetdata[i].match(/\d{1,}/);
		target=target[0];
		if (student==target){
			return 1;
		}
	}
	return 0;
}
catch(err)
{
	swal("身份验证模块错误！", "呜呜……/(ㄒoㄒ)/~小阿狸崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~\n\n错误信息：\n"+err, "error");
	console.log(err);
}
}


/*-------------------------------------核心函数结束-------------------------------*/

