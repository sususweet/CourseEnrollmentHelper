
var item=document.getElementById("jsgrid");
var tbody=item.getElementsByTagName("tbody")[0];
var trs=tbody.getElementsByTagName("tr");
var xmlhttp;
var courseinfo=new Array();
var busytime="";
var progress=0;
var id;
var Showscore;
var ShowGPA;
var Timecheck;
var Sparecheck;
var student;
var permit=0;
var subject;
var Debugmode=1;
var sort=0;
var tdstitle;
var adjustinner;
var teaEncodes=new Array();
var teas=new Array();
var teainfos=new Array();

function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}

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


function Checktime(student){
    try{
        NProgress.inc();
        data=$.ajax({
            type:"GET",
            async: false,
            timeout : 5000,
            url: adjustinner+"/xskbcx.aspx?xh="+student,
            error:function (XMLHttpRequest,status,e){
                swal("获取课表错误！", "呜呜……选课助手发现教务网好像出了什么问题~主人快检查下能否正常进入教务网哦~", "error");
            }
        }).responseText;
        NProgress.done();
        data=data.match(/<A href='#' onclick="window.open\('.{1,}','kcb','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1'\)">(<i><font color=red>){0,1}.{1,}(<\/font><\/i>){0,1}<\/a><\/td><td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td><td>.{1,}<\/td>/ig);

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
    }
    catch (err){
        errorHandler("上课时间获取模块错误！", err);
    }

}

function Sort(item,type){
    sortTable('jsgrid',item,type);
    sort++;
    var temp=tdstitle[item].innerHTML;
    temp=temp.replace("▼","");
    temp=temp.replace("▲","");
    if (sort%2==0){
        tdstitle[item].innerHTML=temp+"▲";
    }else {
        tdstitle[item].innerHTML=temp+"▼";
    }
}

function AddSort(type){
    tdstitle=trs[0].getElementsByTagName("td");
    chrome.runtime.sendMessage({key: "Showinfo"},function(Showinfo) {
        if (Showinfo==1){
            swal("教师排序模块已激活", "现在你可以点击表头的相应文字对所有教师进行排序，同时点击教师评分和均绩可进入学习帝查看评论详情~", "info");
        }
    });
    if (type==1){
        tdstitle[1].onmouseover=Changecursor;
        tdstitle[1].onclick=function(){Sort(1,'float');}
    }
    tdstitle[3+type].onmouseover=Changecursor;
    tdstitle[3+type].onclick=function(){Sort(3+type,'string');}
    tdstitle[4+type].onmouseover=Changecursor;
    tdstitle[4+type].onclick=function(){Sort(4+type,'string');}
    tdstitle[6+type].onmouseover=Changecursor;
    tdstitle[6+type].onclick=function(){Sort(6+type,'int');}
}

function Showprogress(progress){
    //修改浏览器标题栏
    if (Showscore=="enabled"){
        //chrome.runtime.sendMessage({cmd: "update",progress:progress},function(response) {});
        NProgress.set(progress/100);
        var title = document.getElementsByTagName('title')[0];
        if (!title) {
            var title = document.createElement('title');
            title.innerHTML = "萌萌哒选课助手正在为你努力地工作哦……o(〃'▽'〃)o已完成："+Math.round(progress)+"%";
            document.getElementsByTagName('head')[0].appendChild(title);
        }
        else {title.innerHTML = "萌萌哒选课助手正在为你努力地工作哦……o(〃'▽'〃)o已完成："+Math.round(progress)+"%";}

        if (progress==100){
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
            chrome.runtime.sendMessage({cmd: "finish"},function(response) {});
            NProgress.done();
            window.clearInterval(id);
        }
    }else if(Timecheck=="enabled"&&Showscore=="disabled"){
        chrome.runtime.sendMessage({cmd: "finish"},function(response) {});
        AddSort(0);
        var title = document.getElementsByTagName('title')[0];
        if (!title) {
            var title = document.createElement('title');
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
            document.getElementsByTagName('head')[0].appendChild(title);
        }
        else {title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";}
        NProgress.done();
    }
    //chrome.runtime.sendMessage({cmd: "update",progress:progress},function(response) {});
    //console.log(progress);
}

function Shownotice(Timecheck,Sparecheck,Showscore){
    //每隔3秒执行一次
    if (Showscore=="enabled"){
        //NProgress.start();
        //chrome.runtime.sendMessage({cmd: "create2",progress:progress},function(response) {});
        chrome.runtime.sendMessage({cmd: "create1"},function(response) {});
        id = window.setInterval("Showprogress(progress)",1000);
    }else if(Timecheck=="enabled"){
        chrome.runtime.sendMessage({cmd: "create1"},function(response) {});
        Showprogress(progress);
    }
}

function Time(){
    try{
        for(var i=1;i<trs.length;i++){
            var tds=trs[i].getElementsByTagName("td");
            var term=tds[2].innerHTML;
            var time=tds[3].innerHTML;

            var targettime = Convertday(time,term);
            targettime=targettime.split(",");
            for (j=0;j<targettime.length-1;j++){
                if (busytime.indexOf(targettime[j])>=0) {
                    //console.log(targettime[j]);
                    //input[0].setAttribute("disabled","disabled");
                    trs[i].style.color="#C2C2C2";
                    break;
                }
                else{
                    trs[i].style.color="black";
                }
            }


            var course=document.getElementById("Label_jbxx").innerText;
            course=course.match(/课程代码：.{8}/);
            course=course[0].match(/[0-9A-Z]{8}/);
            course=course[0];
            for (j=0;j<courseinfo.length;j++){
                if (course==courseinfo[j].course){
                    if (time==courseinfo[j].coursetime && term==courseinfo[j].courseterm){
                        //if (term==courseinfo[j].courseterm){
                        trs[i].style.color="black";
                    }
                }
            }

            if(trs[i].style.color=="rgb(194, 194, 194)"){
                trs[i].onmouseout=function(){ this.style.color="#C2C2C2";}
                trs[i].onmouseover=function(){ this.style.color="#8B8B8B";}
            }
        }
    }
    catch(err)
    {
        errorHandler("时间冲突判断模块错误！", err);
    }
}

function Spare(){
    try{
        for(var i=1;i<trs.length;i++){
            var tds=trs[i].getElementsByTagName("td");
            var space=tds[6].innerHTML;
            space=space.match(/[-\d{1,}\/]/);
            space=space[0].match(/\d{1,}/);
            var input=tds[11].getElementsByTagName("input");
            if (space<=0){
                if (input[0].checked==false){
                    input[0].setAttribute("disabled","disabled");
                    input[0].style.display="none";
                }
            }
        }
    }
    catch(err) {
        errorHandler("课程余量判断模块错误！", err);
    }
}

function Adjustlineheight(){
    for(var i=1;i<trs.length;i++){
        var tds=trs[i].getElementsByTagName("td");
        var span=document.createElement("td");
        span.innerHTML='<div style="height:8px"></div>';
        tds[0].appendChild(span);
    }
}

function Highlight(){
    for(var i=1;i<trs.length;i++){
        var tds=trs[i].getElementsByTagName("td");
        var input=tds[11].getElementsByTagName("input");
        if (input[0].style.display!="none"&&trs[i].style.color=="black"){
            trs[i].style.backgroundColor="#CBFFBF";
            trs[i].onmouseout=function(){ this.style.backgroundColor="#CBFFBF";}
            trs[i].onmouseover=function(){ this.style.backgroundColor="#ACFF9B";}
        }
        if (input[0].checked==true){
            trs[i].style.backgroundColor="#FFDBCC";
            trs[i].onmouseout=function(){ this.style.backgroundColor="#FFDBCC";}
            trs[i].onmouseover=function(){ this.style.backgroundColor="#FFC5AC";}
        }
    }
}


function Changecursor(){this.style.cursor="pointer";}

function ChangeTitle(){
    var x=trs[0].insertCell(1);
    x.style.width="6%";
    x.innerHTML="评分/人数";
    for (var t=1;t<=trs.length-1;t++){
        x=trs[t].insertCell(1);
        x.innerHTML="";
    }
    for (var t=0;t<=trs.length-1;t++){
        var tds=trs[t].getElementsByTagName("td");
        trs[t].removeChild(tds[8]);
    }

}


function getScores(times){
    var mark;
    var gpa;
    var tid;

    try{
        if(times > trs.length-1){
            AddSort(1);
            progress=100;
            return;
        }
        progress=times/(trs.length-1)*100;

//获取教师分数

        var teacher=trs[times].innerHTML;
        teacher=teacher.match(/target="_blank">.{1,}<\/a>/);
        teacher=teacher[0].match(/>.{1,}</);
        teacher=teacher[0].match(/[\u4e00-\u9fa5a-zA-Z\s]{1,}/);
//teacher=teacher[0].substring(0,3);
        teacher=encodeURIComponent(teacher);
        $.ajax({
            type:"GET",
            dataType: "json",
            url: "https://enrollment.zju-lab.cn/user/search?name="+teacher,
            error:function(){
                swal("服务器响应超时", "貌似最近访问的人太多了，服务器忙不过来啦~", "error");
            },
            complete: function (msg,statust){
                //alert(times);
                var tds=trs[times].getElementsByTagName("td");
                var span=document.createElement("td");
                var span2=document.createElement("td");

                try
                {
                    msgdata=msg.responseJSON;
                    //console.log(msg);
                    tid=msgdata.ID;
                    score=msgdata.Score;
                    //console.log(score);
                    scorenum=msgdata.AssessNum;
                }
                catch(err)
                {
                    score=0.0;
                }
                if (score==null){
                    score=0.0;
                }
                if (scorenum==null){
                    scorenum=0.0;
                }

                if (false){
                    if (typeof(tid) == "undefined"){
                        tid=0;
                    }
                    $.ajax({
                        type: "GET",
                        url: "http://chalaoshi.cn/teacher/" + tid+"/",
                        cache:false,
                        error:function(){
                            swal("学习帝响应超时", "貌似最近访问的人太多了，学习帝忙不过来啦~", "error");
                        },
                        complete: function (t,statust) {
                            t=t.responseText;
                            //console.log(t);
                            try {
                                tmp=t.match(/<h2>.{0,}<\/h2>\s{0,}<p>\d{1,}/);
                                score=tmp[0].match(/<h2>.{0,}<\/h2>/);
                                score=score[0].match(/\d{1,3}\.\d{1,3}/);
                                score=score[0];
                            }
                            catch (err) {
                                //console.log(err);
                            }
                            try{
                                scorenum=tmp[0].match(/<p>\d{1,}/);
                                scorenum=scorenum[0].replace(/<p>/, "");

                            }catch (err) {
                                //console.log(err);
                                scorenum="N/A";
                            }
                            try{
                                var re =new RegExp("<p>"+subject+'<\/p><\/div><divclass="right"><p>[0-9]{0,3}\.[0-9]{0,3}\/[0-9]{0,1}');
                                gpa= t.replace(/\s/g, "").match(re);
                                gpa=gpa[0].match(/\d{1,3}\.\d{1,3}/);
                                gpa=gpa[0];
                            } catch (err) {
                                console.log(err);
                                gpa = "无";
                            }

                            if (score>8.6){

                                //span.innerHTML='<div style="width:60px"><font color="red">评分：' +mark+'</div>';
                                span.innerHTML='<div style="height:8px"></div>';
                                tds[1].innerHTML=score+"/"+scorenum;
                                tds[1].style.color="red";
                                tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                                tds[1].onmouseover=Changecursor;
                                tds[0].appendChild(span);
                            }
                            else{
                                span.innerHTML='<div style="height:8px"></div>';
                                tds[1].innerHTML=score+"/"+scorenum;
                                tds[1].style.color="";
                                tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                                tds[1].onmouseover=Changecursor;
                                tds[0].appendChild(span);
                                //span.innerHTML='<div style="width:60px"><font color="">评分：' +mark+'</div>';
                            }



                            span2.innerHTML ='<div style="width:70px">均绩：'+gpa+'</div>';
                            tds[0].appendChild(span2);
                            try{
                                div=tds[0].getElementsByTagName("div");
                                div[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                                div[1].onmouseover=Changecursor;
                            }
                            catch (err){}
                        }
                    });
                }else {
                    if (score>8.6){
                        span.innerHTML='<div style="height:8px"></div>';
                        tds[1].innerHTML=score+" / "+scorenum;
                        tds[1].style.color="red";
                        tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                        tds[1].onmouseover=Changecursor;
                        tds[0].appendChild(span);
                    }
                    else{
                        span.innerHTML='<div style="height:8px"></div>';
                        tds[1].innerHTML=score+" / "+scorenum;
                        tds[1].style.color="";
                        tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                        tds[1].onmouseover=Changecursor;
                        tds[0].appendChild(span);
                    }
                }
                //div=tds[0].getElementsByTagName("div");
                //console.log(tid);
                //tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                //div[0].onmouseover=Changecursor; 

                times ++;
                getScores(times);

            }

        });
    }
    catch(err) {
        errorHandler("教师评分及均绩查询模块错误！", err);
    }
}

function Main(){
    try{
        if (Timecheck=="disabled"&&Showscore=="disabled"){
           // swal("插件功能受限！", "主人貌似啥功能都没有开启哦~伐开心 TAT！快去浏览器右上角点击设置开启吧~", "warning");
        }else if (permit == 0 && Showscore == "enabled"){
            Showscore="disabled";
            chrome.runtime.sendMessage({cmd: "scoredisabled"},function(response) {});
            chrome.runtime.sendMessage({cmd: "GPAdisabled"},function(response) {});
            swal("插件功能受限！", '由于插件中的教师查询模块涉及@ZJU学习帝的版权问题，只面向小范围开放测试\n插件此项功能即将自动关闭！！可点击右上角图标重新启用\n酷爱来这里申请内测权限吧~:https://enrollment.zju-lab.cn/apply/', "warning");
        }else {
            Shownotice(Timecheck,Sparecheck,Showscore);
        }

        if (Timecheck=="enabled"){Time();Spare();}
        Highlight();

        if (Showscore=="enabled"){ChangeTitle();getScores(1);}
        else{Adjustlineheight();}
    }
    catch(err) {
        errorHandler("Main函数错误！", err);
    }
}

function errorHandler(errdesc, errmsg){
    $.ajax({
        url: "https://enrollment.zju-lab.cn/user/errfeedback",
        timeout : 3000,
        type : 'POST',
        dataType:'json',
        data:{
            errname: errmsg.name,
            errmessage: errmsg.message,
            errlog: errmsg.stack,
            userAgent: navigator.userAgent,
            stuid: student,
            version: nowver
        },
        cache:false
    });
    console.log(errmsg);
    swal(errdesc, "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，崩溃日志已经被上传到服务器，请等待作者回应。您还可以联系作者详细描述错误情形以帮助改进插件~\n\n错误信息：\n" + errmsg, "error");
}
/*-------------------------------------核心函数结束-------------------------------*/
/*-------------------------------------主程序开始-------------------------------*/
/*chrome.runtime.sendMessage({cmd: "mycmd"}, function (response) {
    console.log(response);
});*/
adjustinner=window.document.location.origin;
//获取学号信息
try{
    student=document.getElementById("Label_jbxx").innerText;
    student=student.match(/学号：\d{1,}/);
    student=student[0].match(/\d{1,}/);
    student=student[0];
    chrome.runtime.sendMessage({cmd: "Stu",data:student},function(response) {});
}catch (err){
    errorHandler("获取学号信息错误！", err);
}

chrome.runtime.sendMessage({key: "update"},function(res) {
    console.log(res);
    try{
        upenabledvalue=res.upenabled;
    }catch(err){
        upenabledvalue=0;
    }
    if (upenabledvalue==1){
        swal({
            title: "检测到主程序更新",
            text: "选课助手要更新啦~点击确定下载~记得安装哦！！\n\n当前版本："+res.nowver+"\n\n最新版本："+res.latestver+"\n\n为保证用户体验，插件需要更新才能使用哦~",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "开始升级",
            cancelButtonText: "取消升级",
            //closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm){
            if (isConfirm) {
                window.open(res.updateurl);
            } else {
                swal({
                    title: "取消升级",
                    text: "为保证用户体验，插件需升级到最新版本才可使用，确认要取消吗？点击取消将打开升级页面",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                    //closeOnCancel: false
                },function(isConfirm){
                    if (isConfirm) {
                    } else {
                        window.open(res.updateurl);
                    }
                });
            }
        });
    }
    //else {
    chrome.runtime.sendMessage({key: "Genuine"},function(isgenuine) {
        //if (isgenuine==0){
        if (false){
            swal("主程序错误！", "检测到插件被二次打包！\n为保护作者版权，请重新下载官方版本！\n下载地址："+res.updateurl, "error");
        }
        else{
            try{
                GetSubject();
				//NProgress.inc();
                chrome.runtime.sendMessage({key: "Getsettings"},function(response) {
                    response=response.split(",");
                    Showscore=response[0];
                    ShowGPA=response[1];
                    Timecheck=response[2];
                    permit=1;
                    if (Timecheck=="enabled"){
                        Checktime(student);
                    }
                    if (Showscore=="enabled"||ShowGPA=="enabled"){
                        if(permit==1){
                            chrome.runtime.sendMessage({cmd: "clear"},function(response) {});
                            //permit=targetdata.valid;
                            Main();
                        }else if (permit==0){
                            Showscore="disabled";
                            ShowGPA="disabled";
                            chrome.runtime.sendMessage({cmd: "clear"},function(response) {});
                            Main();
                        }
                    }
                    else {
                        NProgress.done();
                        chrome.runtime.sendMessage({cmd: "clear"},function(response) {});
                        Main();
                    }
                });
            }
            catch(err) {
                errorHandler("主程序错误！", err);
            }
        }
    });
//}
});
