/*
 var item=document.getElementById("jsgrid");
 var tbody=item.getElementsByTagName("tbody")[0];
 var trs=tbody.getElementsByTagName("tr");
 var xmlhttp;


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

 var tdstitle;
 var adjustinner;
 var teaEncodes=new Array();
 var teas=new Array();
 var teainfos=new Array();
 */
var busytime="";
var enrollinfo=new Array();
var title;
var courseitem;
var teacheritem;
var sort=0;

function doScrollCheck() {
    title=$(".leaf");
    if (title.length==0) {
        return setTimeout(doScrollCheck, 1000);
    }else{
        console.log(title);
    }
}

function doScrollCheck2() {
    courseitem=$(".panel-info");
    if (courseitem.length==0) {
        return setTimeout(doScrollCheck2, 1000);
    }else{
        Addbtn();
        //console.log(courseitem);
        isnext=$("#more").get(0);
        if(isnext.style.display!="none"){
            isnext.addEventListener("click", function(){
                doScrollCheck2();
            });
        }
    }
}

function Superchoose(id,btnstate){
    //console.log(courseitem);
    additem=$(courseitem[id]).find("tr[class='active']").get(0);
    if(btnstate==0){

        deloper=$(additem).find("th").get(10);
        $(deloper).remove();
        marktitle=$(additem).find("th").get(0);
        $(marktitle).after('<th nowrap="nowrap" id="score">评分</th>');
        titlesort=$(courseitem[id]).find("tr[class='active']").get(0);
        titlesort=$(titlesort).find("th");
        //console.log(titlesort);
        titlesort.get(1).onmouseover=Changecursor;
        titlesort.get(3).onmouseover=Changecursor;
        titlesort.get(4).onmouseover=Changecursor;
        titlesort.get(8).onmouseover=Changecursor;

        titlesort.get(1).addEventListener("click", function(){
            sortTable(code,2,'float');
        });
        titlesort.get(3).addEventListener("click", function(){
            sortTable(code,4,'string');
        });
        titlesort.get(4).addEventListener("click", function(){
            sortTable(code,5,'string');
        });
        titlesort.get(8).addEventListener("click", function(){
            sortTable(code,9,'int');
            //this.innerText=this.innerText+"↑"
        });
    }



    coursecode=courseitem[id].innerText.match(/\(.{1,}\)/);
    coursecode=coursecode[0].replace(/\({0,1}\){0,1}/g,"");
    //console.log(coursecode);
    idtemp=parseInt(id)+1;
    code="tbody_"+coursecode+"_"+idtemp;

    teacheritem=$(courseitem[id]).find("tbody").get(0);
    teacheritem=$(teacheritem).find("tr");

    if (teacheritem.length==0) {
        //courseitem=$(".panel-info");
        //return setTimeout(doScrollCheck3, 50);
    }else{
        //console.log(teacheritem);

        for(var t=0;t<teacheritem.length;t++){
            var timeok=1;
            var spareok=1;
            CourseInfo=teacheritem.get(t);
            teacher=$(CourseInfo).find("td[class='jsxm']").get(0).innerText;

            teacher=teacher.split('\n')[0];
            teacher=teacher.split(' ')[0];
            //teacheritem.get(t).setAttribute('style','color:#C2C2C2');
            //teacheritem.get(t).setAttribute('class','success');
            //teacheritem.get(t).setAttribute('class','warning');
            if(btnstate==0){
                scoredigit=$(CourseInfo).find("td[class='jsxm']").get(0);
                $(scoredigit).after('<td id="scoredigit">暂无</td>');
            }
            //console.log(CourseInfo);
            enroll=$(CourseInfo).find("td[class='an']").get(0);
            chosen=$(enroll).find("button").get(0).innerHTML;
            //console.log($(enroll).find("button"));
            courseterm=$(CourseInfo).find("td[class='xxq']").get(0).innerText;
            coursetime=$(CourseInfo).find("td[class='sksj']").get(0).innerText;
            coursespace=$(CourseInfo).find("td[class='rsxx']").get(0).innerText;

            if(Spare(coursespace)==0&&chosen=="选课"){
                enroll.setAttribute('style','visibility:hidden');
                spareok=0;
            }else{
                spareok=1;
            }

            coursetime=coursetime.replace(/\n/g,'<br>');
            if(Time(coursetime,courseterm,coursecode)==0){
                CourseInfo.setAttribute('style','color:#C2C2C2');
                timeok=0;
            }else {
                CourseInfo.setAttribute('style','color:#000000');
                timeok=1;
            }
            //console.log(chosen);
            if (chosen=="退选"){
                CourseInfo.setAttribute('class','danger');
            }else if (timeok==1&&spareok==1){
                CourseInfo.setAttribute('class','success');
            }else {
                CourseInfo.setAttribute('class','body_tr');
            }



        }

        getScores(0,id);
    }
}

function Superlookup(id,btnstate) {

    //additem=$(courseitem[id]).find("tr[class='active']").get(0);
    //btn=$(additem).find("button[checkid='"+id+"']").button('loading');
    //student=window.document.location.search.match(/userName=\d{1,}/)[0].replace("userName=","");
    student=$("#sessionUserKey").val();
    Checktime(student,id,btnstate);

}

function Addbtn(){
    for (var j=0;j<courseitem.length;j++){
        //courseitem[j].setAttribute('checkid',j);

        additem=$(courseitem[j]).find("tr[class='active']").get(0);
        //console.log($(additem).find("button[type='button']").length);
        if ($(additem).find("button[type='button']").length==0){
            //if(titlestate==0){
            addbutton=$(additem).append('<th width="5%"><button class="btn btn-info" type="button" checkid='+j+' state="0">开始查询</button></th>');
            addbutton=addbutton[0];
            //}
            //console.log(additem);
            buttonitem=$(additem).find("button[type='button']").get(0);
            buttonitem.addEventListener("click", function(){
                btnstate=this.getAttribute('state');
                console.log("btnstate",btnstate);

                Superlookup(this.getAttribute('checkid'),btnstate);
                if(btnstate==0){
                    this.setAttribute('state',1);
                }

                //console.log(courseitem[j]);
                //console.log(courseitem.find("tr[class='body_tr']"));
            });
        }


    }
}

function Main(){

    doScrollCheck();

    for (var i=0;i<title.length;i++){
        dropdown=$(title.get(i)).find(".dropdown-menu");
        if (dropdown.length==0){
            addevent=title.get(i);
            addevent.addEventListener("click", function(){
                doScrollCheck2();
            });
        }else {
            addevent=$(dropdown).find("li");
            for (var k=0;k<addevent.length;k++){
                addevent.get(k).addEventListener("click", function(){
                    doScrollCheck2();
                });
            }
        }
        doScrollCheck2();

        /*title.get(i).addEventListener("click", function(){
         //titlestate=this.getAttribute('state');
         //if (!titlestate){
         //	this.setAttribute('state',1);
         //	titlestate=0;
         //}
         doScrollCheck2();



         for (var j=0;j<courseitem.length;j++){
         //console.log(courseitem[j]);
         //courseitem[j].setAttribute('checkid',j);

         additem=$(courseitem[j]).find("tr[class='active']").get(0);

         //if(titlestate==0){
         addbutton=$(additem).append('<th width="5%"><button class="btn btn-primary" type="button" checkid='+j+' state="0">开始查询</button></th>');
         addbutton=addbutton[0];
         //}
         console.log(additem);

         buttonitem=$(additem).find("button[type='button']").get(0);
         buttonitem.addEventListener("click", function(){
         btnstate=this.getAttribute('state');
         console.log("btnstate",btnstate);
         Superlookup(this.getAttribute('checkid'),btnstate);
         if(btnstate==0){
         this.setAttribute('state',1);
         }

         //console.log(courseitem[j]);
         //console.log(courseitem.find("tr[class='body_tr']"));
         });
         }

         });*/
    }

}


$(document).ready(function() {
    try{
        student=$("#sessionUserKey").val();
        chrome.extension.sendMessage({cmd: "Stu",data:student},function(response) {});
    }catch (err){
        swal("获取学号信息错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~\n\n错误信息：\n"+err, "error");
        console.log(err);
    }

    chrome.extension.sendRequest({key: "update"}, function (res) {
        console.log(res);
        try {
            upenabledvalue = res.upenabled;
        } catch (err) {
            upenabledvalue = 0;
        }
        if (upenabledvalue == 1) {
            swal({
                title: "检测到主程序更新",
                text: "选课助手要更新啦~点击确定下载~记得安装哦！！\n\n当前版本：" + res.nowver + "\n\n最新版本：" + res.latestver + "\n\n为保证用户体验，插件需要更新才能使用哦~",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "开始升级",
                cancelButtonText: "取消升级",
                //closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
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
                    }, function (isConfirm) {
                        if (isConfirm) {
                        } else {
                            window.open(res.updateurl);
                        }
                    });
                }
            });
        }
        chrome.extension.sendRequest({key: "Genuine"}, function (isgenuine) {
            if (isgenuine == 0) {
                swal("主程序错误！", "检测到插件被二次打包！\n为保护作者版权，请重新下载官方版本！\n下载地址：" + res.updateurl, "error");
            }
            else {
                chrome.extension.sendRequest({key: "Getsettings"}, function (response) {
                    response = response.split(",");
                    Showscore = response[0];
                    ShowGPA = response[1];
                    NewVer = response[4];
                    permit = response[3];
                    if (permit == 1) {
                        Main();
                    } else if (permit == 0) {
                        NewVer = "disabled";
                        swal("插件功能受限！", '新系统适配还在内测阶段哦~\n酷爱来这里申请内测权限吧~:https://enrollment.zju-lab.cn/apply/', "warning");
                    }
                });
            }
        });
    });
});

function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}


//数据类型转换函数
function convert(sValue,sDataType)
{
    switch(sDataType)
    {
        case "int":return parseInt(sValue);
        case "float": return parseFloat(sValue);
        case "date":return new Date(Date.parse(sValue));
        default:return sValue.toString();
    }
}

function Sort(){
    for (var s1=0;s1<teacheritem.length;s1++){
        for (var s2=s1;s2<teacheritem.length;s2++){
            temp1=teacheritem.get(s2);
            $(temp1).find("td[class='rsxx']").get(0).innerText;
            temp2=teacheritem.get(s1);
            $(temp2).find("td[class='rsxx']").get(0).innerText;

            try{
                var vValue1=convert(temp1,"");
            }
            catch (err){
                vValue1=0;
            }
            try{
                var vValue2=convert(temp2,"");
            }
            catch (err){
                vValue2=0;
            }

            if(vValue1>vValue2) {
                teacheritem.get(s2)=temp2;
                teacheritem.get(s2+1)=temp1;
            }
        }

    }
}



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
    subject = trimStr(subject.substr(0,subject.length-2));
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


function Checktime(student,id,btnstate){
    timeurl = document.referrer.match(/http:\/\/.{1,}\//);
    NProgress.inc();
    $.ajax({
        type:"GET",
        //async: false,
        timeout : 5000,
        url: timeurl[0]+"xskbcx.aspx?xh="+student,
        error:function (XMLHttpRequest,status,e){
            swal("获取课表错误！", "呜呜……选课助手发现教务网好像出了什么问题~主人快检查下能否正常进入教务网哦~", "error");
        },
        complete: function (data,statust){
            NProgress.done();
            data=data.responseText;

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
                enrollinfo[i]={course: course,courseterm: courseterm,coursetime: coursetime};

                console.log(enrollinfo[i]);


                //res=Convertday(coursetime);
                //console.log(res);
                if (coursetime!="0"&&courseterm!="0"){
                    busytime=busytime+Convertday(coursetime,courseterm);
                }

            }

            console.log (busytime);

            Superchoose(id,btnstate);



        }

    });




}

/*function Sort(item,type){
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
 }*/

function AddSort(type){
    tdstitle=trs[0].getElementsByTagName("td");
    chrome.extension.sendRequest({key: "Showinfo"},function(Showinfo) {
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
    if (ShowGPA=="enabled"){
        //chrome.extension.sendMessage({cmd: "update",progress:progress},function(response) {});
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
            chrome.extension.sendMessage({cmd: "finish"},function(response) {});
            NProgress.done();
            window.clearInterval(id);
        }

    }
    else if((Timecheck=="enabled"||Sparecheck=="enabled")&&(Showscore=="disabled")){
        chrome.extension.sendMessage({cmd: "finish"},function(response) {});
        AddSort(0);
        var title = document.getElementsByTagName('title')[0];
        if (!title) {
            var title = document.createElement('title');
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
            document.getElementsByTagName('head')[0].appendChild(title);
        }
        else {title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";}
    }
    else if (Showscore=="enabled"){
        chrome.extension.sendMessage({cmd: "finish"},function(response) {});
        var title = document.getElementsByTagName('title')[0];
        if (!title) {
            var title = document.createElement('title');
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
            document.getElementsByTagName('head')[0].appendChild(title);
        }
        else {title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";}
    }

    //chrome.extension.sendMessage({cmd: "update",progress:progress},function(response) {});
    //console.log(progress);
}

function Shownotice(Timecheck,Sparecheck,Showscore){
    //每隔3秒执行一次
    if (ShowGPA=="enabled"){
        //NProgress.start();
        //chrome.extension.sendMessage({cmd: "create2",progress:progress},function(response) {});
        chrome.extension.sendMessage({cmd: "create1"},function(response) {});
        id = window.setInterval("Showprogress(progress)",1000);
    }
    else if(Timecheck=="enabled"||Sparecheck=="enabled"){
        chrome.extension.sendMessage({cmd: "create1"},function(response) {});
        Showprogress(progress);
    }
}

function Time(Timedata,Termdata,Codedata){

    //console.log("Codedata"+Codedata);
//try{
    //for(var i=1;i<trs.length;i++){
    //var tds=trs[i].getElementsByTagName("td");
    //var term=tds[2].innerHTML;
    //var time=tds[3].innerHTML;
    var flag=0;
    var targettime = Convertday(Timedata,Termdata);
    targettime=targettime.split(",");
    //console.log(targettime);
    for (j=0;j<targettime.length-1;j++){
        if (busytime.indexOf(targettime[j])>=0) {
            //input[0].setAttribute("disabled","disabled");
            //trs[i].style.color="#C2C2C2";
            flag=0;
            break;
        }
    }
    if (j>=targettime.length-1){
        flag=1;
    }

    //var course=document.getElementById("Label_jbxx").innerText;
    //course=course.match(/课程代码：.{8}/);
    //course=course[0].match(/[0-9A-Z]{8}/);
    //course=course[0];
    for (x=0;x<enrollinfo.length;x++){
        if (Codedata==enrollinfo[x].course){
            if (Timedata==enrollinfo[x].coursetime && Termdata==enrollinfo[x].courseterm){
                flag=1;
            }
        }
    }
    return flag;
}
//if(trs[i].style.color=="rgb(194, 194, 194)"){
//	trs[i].onmouseout=function(){ this.style.color="#C2C2C2";}
//	trs[i].onmouseover=function(){ this.style.color="#8B8B8B";}
//}
//}
//}
//catch(err)
//{
//	swal("时间冲突判断模块错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~\n\n错误信息：\n"+err, "error");
//	console.log(err);
//}

function Spare(Sparedata){
//try{
    Sparedata=Sparedata.split("/")[0];
    if (Sparedata<=0){
        return 0;
    }else {
        return 1;
    }
//}


///catch(err)
//
//	swal("课程余量判断模块错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~", "error");
//}
}



function getScores(times,courseid){

    var mark;
    var gpa;
    var tid;
    if(times >= teacheritem.length){
//AddSort(1);
        return;
    }
    teacher=$(teacheritem.get(times)).find("td[class='jsxm']").get(0).innerText;
    teacher=teacher.split('\n')[0];
    teacher=teacher.split(' ')[0];

    //console.log(teacher);
    teacher=encodeURIComponent(teacher);




//progress=times/(trs.length-1)*100;

//获取教师分数
    /*
     var teacher=trs[times].innerHTML;
     teacher=teacher.match(/target="_blank">.{1,}<\/a>/);
     teacher=teacher[0].match(/>.{1,}</);
     teacher=teacher[0].match(/[\u4e00-\u9fa5a-zA-Z\s]{1,}/);
     teacher=teacher[0].substring(0,3);
     */
    $.ajax({
        type:"GET",
        dataType: "json",
        url: "https://enrollment.zju-lab.cn/user/search?name="+teacher,
        error:function(){
            swal("服务器响应超时", "貌似最近访问的人太多了，服务器忙不过来啦~", "error");
        },
        complete: function (msg,statust){
            //function(msg,i){
            //alert(times);
            //var tds=trs[times].getElementsByTagName("td");
            //var span=document.createElement("td");
            //var span2=document.createElement("td");
            try
            {
                msgdata=msg.responseJSON;
                tid=msgdata.ID;
                score=msgdata.Score;
                scorenum=msgdata.AssessNum;

                /*msg=msg.responseText;
                 //console.log(msg);
                 tid=msg.match(/teacher\/\d{1,4}/);
                 tid=tid[0].match(/\d{1,4}/);
                 tid=tid[0];
                 score=msg.match(/<h2>.{3,4}<\/h2>/);
                 score=score[0].match(/\d{1,2}\.\d{1}/);
                 score=score[0];
                 //console.log(score);
                 //alert(span);*/
            }
            catch(err)
            {
                score=0.0;
            }

            if (score>8.6){
                scoredigit=$(teacheritem.get(times)).find("td[id='scoredigit']").get(0);
                scoredigit.innerHTML=score;
                scoredigit.style.color="red";
                scoredigit.onmouseover=Changecursor;

                //span.innerHTML='<div style="height:8px"></div>';
                //tds[1].innerHTML=score;
                //tds[1].style.color="red";
                scoredigit.onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                //tds[1] 
                //tds[0].appendChild(span);
            }
            else{
                scoredigit=$(teacheritem.get(times)).find("td[id='scoredigit']").get(0);
                scoredigit.innerHTML=score;
                scoredigit.style.color="";
                scoredigit.onmouseover=Changecursor;
                scoredigit.onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                //span.innerHTML='<div style="height:8px"></div>';
                //tds[1].innerHTML=score;
                //tds[1].style.color="";
                //tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
                //tds[1].onmouseover=Changecursor; 
                //tds[0].appendChild(span);
            }
//}
            //div=tds[0].getElementsByTagName("div");
            //console.log(tid);
            //tds[1].onclick=function (){window.open("http://chalaoshi.cn/teacher/" + tid+"/");}
            //div[0].onmouseover=Changecursor; 

            times ++;
            getScores(times);

        }

    });
//}
    /*catch(err)
     {
     console.log(err);
     swal("教师评分及均绩查询模块错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~", "error");
     }*/
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
    x.style.width="4%";
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
        swal("身份验证模块错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~\n\n错误信息：\n"+err, "error");
        console.log(err);
    }
}





/*-------------------------------------核心函数结束-------------------------------*/
/*-------------------------------------主程序开始-------------------------------*/
/*alert("ok");
 adjustinner=window.document.location.origin;
 chrome.extension.sendRequest({key: "update"},function(res) {
 console.log(res);
 if (res.upenabled==1){
 swal({
 title: "检测到主程序更新",
 text: "选课助手要更新啦啦啦~点击确定下载！主人记得安装哦！！\n\n当前版本："+res.nowver+"\n\n最新版本："+res.latestver+"\n\n为保证用户体验，插件需要更新才能使用哦~",
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
 }else {
 chrome.extension.sendRequest({key: "Genuine"},function(isgenuine) {
 if (isgenuine==0){
 swal("主程序错误！", "检测到插件被二次打包！\n为保护作者版权，请重新下载官方版本！\n下载地址："+res.updateurl, "error");
 }
 else{
 //获取学号信息
 student=document.getElementById("Label_jbxx").innerText;
 student=student.match(/学号：\d{1,}/);
 student=student[0].match(/\d{1,}/);
 student=student[0];
 Checktime(student);
 chrome.extension.sendMessage({cmd: "Stu",data:student},function(response) {});
 try{
 GetSubject();
 NProgress.inc();
 chrome.extension.sendRequest({key: "Getsettings"},function(response) {
 response=response.split(",");
 Showscore=response[0];
 ShowGPA=response[1];
 Timecheck=response[2];
 permit=response[3];
 if (Showscore=="enabled"||ShowGPA=="enabled"){
 if(permit==1){
 chrome.extension.sendMessage({cmd: "clear"},function(response) {});
 //permit=targetdata.valid;
 Main();
 }else if (permit==0){
 Showscore="disabled";
 ShowGPA="disabled";
 chrome.extension.sendMessage({cmd: "clear"},function(response) {});
 Main();
 }
 }
 else {
 NProgress.done();
 chrome.extension.sendMessage({cmd: "clear"},function(response) {});
 Main();
 }
 });
 }
 catch(err)
 {
 swal("主程序错误！", "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，主人检查下浏览器版本是否最新哦，或者联系作者详细描述错误情形以帮助改进插件吧~\n\n错误信息：\n"+err, "error");
 console.log(err);
 }
 }
 });
 }
 });*/
