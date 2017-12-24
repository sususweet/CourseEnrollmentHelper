var item=document.getElementById("DataGrid1");
if (item != null) {
    var tbody=item.getElementsByTagName("tbody")[0];
    var trs = tbody.getElementsByTagName("tr");
    var courseinfo = [];
    var busytime = "";
    var progress = 0;
    var id;
    var Showscore;
    var ShowGPA;
    var Timecheck;
    var Sparecheck;
    var student;
    var permit = 0;
    var sort = 0;
    var tdstitle;
    var adjustinner;
}

function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}

function Shownotice(Timecheck,Sparecheck,Showscore){
    //每隔3秒执行一次
    if (Showscore=="enabled"){
        //NProgress.start();
        //chrome.runtime.sendMessage({cmd: "create2",progress:progress},function(response) {});
        chrome.runtime.sendMessage({cmd: "create1"},function(response) {});
    }else if(Timecheck=="enabled"){
        chrome.runtime.sendMessage({cmd: "create1"},function(response) {});
    }
}

function Time(){
    try{
        for(var i=1;i<trs.length;i++){
            var tds=trs[i].getElementsByTagName("td");
            var term=tds[8].innerHTML;
            var time=tds[7].innerHTML;
            var targettime = Convertday(time,term);
            targettime=targettime.split(",");
            for (var j=0;j<targettime.length-1;j++){
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

            var course=tds[2].innerHTML;
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


function Highlight(){
    for(var i=1;i<trs.length;i++){
        var tds=trs[i].getElementsByTagName("td");
        //var input=tds[11].getElementsByTagName("input");
        if (trs[i].style.color=="black"){
            trs[i].style.backgroundColor="#CBFFBF";
            trs[i].onmouseout=function(){ this.style.backgroundColor="#CBFFBF";}
            trs[i].onmouseover=function(){ this.style.backgroundColor="#ACFF9B";}
        }
        /*if (input[0].checked==true){
            trs[i].style.backgroundColor="#FFDBCC";
            trs[i].onmouseout=function(){ this.style.backgroundColor="#FFDBCC";}
            trs[i].onmouseover=function(){ this.style.backgroundColor="#FFC5AC";}
        }*/
    }
}


function Changecursor(){this.style.cursor="pointer";}

function ChangeTitle(){
    var x=trs[0].insertCell(1);
    x.style.width="10%";
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

function Sort(item,type,init){
    var temp=tdstitle[item].innerHTML;
    temp=temp.replace("▼","");
    temp=temp.replace("▲","");

    if (init == false){
        sortTable('DataGrid1',item,type);
        sort++;
        if (sort%2==0){
            tdstitle[item].innerHTML=temp+"▲";
        }else {
            tdstitle[item].innerHTML=temp+"▼";
        }
    }else{
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
    tdstitle[0].onmouseover=Changecursor;
    tdstitle[0].onclick=function(){Sort(0,'string',false);};
    Sort(0,'string',true);

    if (type===1){
        tdstitle[1].onmouseover=Changecursor;
        tdstitle[1].onclick=function(){Sort(1,'string',false);}
        Sort(1,'string',true);
    }

    tdstitle[1+type].onmouseover=Changecursor;
    tdstitle[1+type].onclick=function(){Sort(1+type,'string',false);};
    Sort(1+type,'string',true);

    tdstitle[2+type].onmouseover=Changecursor;
    tdstitle[2+type].onclick=function(){Sort(2+type,'string',false);};
    Sort(2+type,'string',true);

    tdstitle[3+type].onmouseover=Changecursor;
    tdstitle[3+type].onclick=function(){Sort(3+type,'string',false);};
    Sort(3+type,'string',true);

    tdstitle[5+type].onmouseover=Changecursor;
    tdstitle[5+type].onclick=function(){Sort(5+type,'string',false);};
    Sort(5+type,'string',true);

    tdstitle[6+type].onmouseover=Changecursor;
    tdstitle[6+type].onclick=function(){Sort(6+type,'string',false);};
    Sort(6+type,'string',true);

    tdstitle[7+type].onmouseover=Changecursor;
    tdstitle[7+type].onclick=function(){Sort(7+type,'string',false);};
    Sort(7+type,'string',true);
}

function getScoresAll(){
    var teacherArray = [];

    $.each(trs,function(index,trsVal){
        if (index !== 0) {
            var teacher = trsVal.innerHTML;
            teacher = teacher.match(/target="_blank">.{1,}<\/a>/);
            teacher = teacher[0].match(/>.{1,}</);
            teacher = teacher[0].match(/[\u4e00-\u9fa5a-zA-Z\s]{1,}/);
            //teacher = encodeURIComponent(teacher);

            teacherArray.push(teacher[0])
        }

    });
    $.ajax({
        type: "POST",
        dataType: "json",
        data:{
            student: student,
            teacher: JSON.stringify(teacherArray)
        },
        url: "https://enrollment.zju-lab.cn/user/quickSearch",
        error:function(){
            swal("服务器响应超时", "貌似最近访问的人太多了，服务器忙不过来啦~", "error");
        },
        success: function (msgdata){
            if (msgdata.success === 0) {
                var teacherResultArray = msgdata.data;

                $.each(trs, function (index, trsVal) {
                    if (index !== 0) {
                        var teacher = trsVal.innerHTML;
                        teacher = teacher.match(/target="_blank">.{1,}<\/a>/);
                        teacher = teacher[0].match(/>.{1,}</);
                        teacher = teacher[0].match(/[\u4e00-\u9fa5a-zA-Z\s]{1,}/);
                        teacher = teacher[0];

                        var tds = trs[index].getElementsByTagName("td");
                        var span;

                        for (var i = 0; i < teacherResultArray.length; i++) {
                            if (teacher === teacherResultArray[i].Name) {
                                break;
                            }
                        }

                        if (i >= teacherResultArray.length) {
                            score = "0.00";
                            scorenum = 0.0;
                        } else {
                            var result = teacherResultArray[i];

                            try {
                                // msgdata = msg.responseJSON;
                                var tid = result.tea_id;
                                score = result.Score;
                                if (score == "N/A") score = "0.00";
                                //console.log(score);
                                scorenum = result.AssessNum;
                            }
                            catch (err) {
                                score = "0.00";
                            }
                            if (score == null) {
                                score = "0.00";
                            }
                            if (scorenum == null) {
                                scorenum = 0.0;
                            }
                        }

                        span = '<div style="height:15px"></div>';
                        tds[1].innerHTML = score + "/" + scorenum;
                        tds[1].onclick = function () {
                            window.open("http://chalaoshi.cn/teacher/" + tid + "/");
                        };
                        tds[1].onmouseover = Changecursor;
                        $(tds[0]).append(span);

                        if (score > 8.6) {
                            tds[1].style.color = "red";
                        }
                        else {
                            tds[1].style.color = "";
                        }
                    }
                });
            }
            AddSort(1);
        }
    });

}
function quickCheckTime(student){
    try{
        NProgress.inc();
        $.ajax({
            type:"GET",
            //async: false,
            timeout : 5000,
            url: adjustinner+"/xskbcx.aspx?xh="+student,
            error:function (XMLHttpRequest,status,e){
                swal("获取课表错误！", "呜呜……选课助手发现教务网好像出了什么问题~主人快检查下能否正常进入教务网哦~", "error");
            },
            success: function(data){

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
                Time();
                Highlight();
            }
        });


        //console.log (busytime);
    }
    catch (err){
        errorHandler("上课时间获取模块错误！", err);
    }

}
function Main(){
    if (item != null){
        $('#CheckBox1').attr("checked", true);
        try {
            //permit == 0
            chrome.runtime.sendMessage({cmd: "create1"},function(response) {});
            ChangeTitle();
            getScoresAll();
            quickCheckTime(student);
        }
        catch (err) {
            errorHandler("Main函数错误！", err);
        }
    }

}

function errorHandler(errdesc, errmsg){
    console.log(errmsg);
    swal(errdesc, "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，崩溃日志已经被上传到服务器，请等待作者回应。您还可以联系作者详细描述错误情形以帮助改进插件~\n\n错误信息：\n" + errmsg, "error");
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
}
/*-------------------------------------核心函数结束-------------------------------*/
/*-------------------------------------主程序开始-------------------------------*/
/*chrome.runtime.sendMessage({cmd: "mycmd"}, function (response) {
    console.log(response);
});*/
adjustinner=window.document.location.origin;
//获取学号信息
try{
    student=document.getElementById("cxbmform").action;
    student=student.match(/\?xh=\d{1,}/);
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
    nowver = res.nowver;
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

//}
});
chrome.runtime.sendMessage({key: "Genuine"},function(isgenuine) {
    if (isgenuine==0){
        swal("主程序错误！", "检测到插件被二次打包！\n为保护作者版权，请重新下载官方版本！\n下载地址："+res.updateurl, "error");
    }
    else{
        try{
            //NProgress.inc();
            chrome.runtime.sendMessage({key: "Getsettings"},function(response) {
                response=response.split(",");
                Showscore=response[0];
                ShowGPA=response[1];
                Timecheck=response[2];
                permit=1;
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