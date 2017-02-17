//chrome.windows.onRemoved.addListener(function (windowId){
//		console.log('ddd');
//});
var Debugmode;
var isgenuine=0;
var codebase;
var appid;
var nowver;
var upenabled;
var version;

function checkUpdate(){
    var updatelogs="";
    //if (localStorage["Beta"]==1){
    checkurl="https://enrollment.zju-lab.cn/user/checkUpdate/";
    //}
    //else {
    //}
    $.get(chrome.extension.getURL('manifest.json'), function(info){
        nowver = info.version;
        Checkpermit();
        $.ajax({
            type:"GET",
            timeout : 5000,
            cache: false,
            url:checkurl,
            dataType: "json",
            success:function(data){
                console.log(data);
                codebase=data.codebase;
                version=data.version;
                if (version>nowver){
                    upenabled=1;
                    /*updatelog=$.ajax({
                     type:"GET",
                     timeout : 5000,
                     async:false,
                     cache:false,
                     url: "http://www.zjuchoosehelper.icoc.cc/nd.jsp?id=9"
                     }).responseText;
                     updatelog=updatelog.match(/richContent3'>\n.{0,}\n<\/div>/);
                     updatelog=updatelog[0].match(/<p>.{0,}<\/p>/g);
                     updatelog=updatelog[0].split("</p>");
                     for (var i=0;i<updatelog.length-1;i++){
                     log=updatelog[i].replace("</p>","");
                     log=log.replace("<p>","");
                     updatelogs=updatelogs+log+"\n";
                     }*/
                    //alert("选课助手要更新啦啦啦~点击确定下载！主人记得安装哦！！\n\n当前版本："+nowver+"\n\n最新版本："+version+"\n\n更新日志：\n"+updatelogs);
                    //window.open(codebase);
                }
                else{
                    upenabled=0;
                }
            }
        });
    }, 'json');
}

checkUpdate();

function Checkpermit(){
    ajaxTimeoutTest=$.ajax({
        url: "https://enrollment.zju-lab.cn/user/permit?uid="+localStorage["Stu"]+"&type=1&ver="+nowver,
        timeout : 3000,
        type : 'GET',
        dataType:'json',
        async:false,
        cache:false,
        success:function(targetdata){
            permit=targetdata.valid;
            localStorage["Beta"]=permit;
        },
        complete:function(XMLHttpRequest,status){
            if(status=='timeout'){
                //ajaxTimeoutTest.abort();
                localStorage["Beta"]=0;
            }
            if(status=='error'){//超时,status还有success,error等值的情况
                localStorage["Beta"]=0;
            }
        }
    });
}


function isFirstrun(){
    var firstrun=localStorage["isFirstrun"];
    if (!firstrun||firstrun==0) {
        window.open(chrome.extension.getURL('help.html'));
        localStorage["isFirstrun"] = 1;
    }
    var Showinfo=localStorage["Showinfo"];
    if (!Showinfo) {
        localStorage["Showinfo"] = 1;
    }
}

isFirstrun();

function GenuineVerify(){
    var targetappid_sha = "df70bb47192516150ad8582f10b4ae848682d555";
    var targetappid_sha_google = "fd5f59a082364ddcb6aaa9d6d558f70c6a4ebb24";
    appid= chrome.app.getDetails().id;
    chrome.management.get(appid,function (t) {
        Debugmode=t.installType;
        if (Debugmode!="development"&&hex_sha1(appid)!=targetappid_sha&&hex_sha1(appid)!=targetappid_sha_google){
            isgenuine=0;
        }else{
            isgenuine=1;
        }
        console.log(isgenuine);
    });
}
GenuineVerify();

chrome.extension.onMessage.addListener(function(request) {
    if(request.cmd=="create1"){create1();}
    else if(request.cmd=="create2"){create2(request.progress);}
    else if(request.cmd=="update"){update(request.progress);}
    else if(request.cmd=="clear"){clear();}
    else if(request.cmd=="finish"){finish();}
    else if(request.cmd=="scoreenabled"){localStorage["Showscore"] = "enabled";}
    else if(request.cmd=="scoredisabled"){localStorage["Showscore"] = "disabled";}
    else if(request.cmd=="GPAenabled"){localStorage["ShowGPA"] = "enabled";}
    else if(request.cmd=="GPAdisabled"){localStorage["ShowGPA"] = "disabled";}
    else if(request.cmd=="timecheckenabled"){localStorage["Timecheck"] = "enabled";}
    else if(request.cmd=="timecheckdisabled"){localStorage["Timecheck"] = "disabled";}
    else if(request.cmd=="NewVerenabled"){localStorage["NewVer"] = "enabled";}
    else if(request.cmd=="NewVerdisabled"){localStorage["NewVer"] = "disabled";}
    else if(request.cmd=="about"){
        if(localStorage["Beta"]==1){
            verdescription="内测版";
        }else {
            verdescription="公开稳定版";
        }
        alert("版本："+nowver+" "+verdescription+"\n插件作者：熊熊看星星\n反馈邮箱：1017417552@qq.com\n\n教师评分数据来源：@ZJU学习帝");
    }
    else if(request.cmd=="Stu"){
        localStorage["Stu"] = request.data;
    }
    else if(request.cmd=="Beta"){
        localStorage["Beta"] = request.data;
    }
});
//教师均绩查询模块贡献者：Qui γ Far\n\n
chrome.extension.onRequest.addListener(
    function(request,sender,sendResponse) {
        if(request.key=="Getsettings"){
            var res1=localStorage["Showscore"];
            var res2=localStorage["ShowGPA"];
            var res3=localStorage["Timecheck"];
            var res4=localStorage["Beta"];
            var res5=localStorage["NewVer"];
            sendResponse(res1+","+res2+","+res3+","+res4+","+res5);
        }
        else if(request.key=="Showinfo"){
            var res=localStorage["Showinfo"];
            sendResponse(res);
            localStorage["Showinfo"] = 0;
        }
        else if(request.key=="Sparecheck"){
            var res=localStorage["Sparecheck"];
            sendResponse(res);
        }
        else if(request.key=="update"){
            checkUpdate();
            sendResponse({updateurl: codebase,upenabled:upenabled,nowver:nowver,latestver:version});
        }
        else if(request.key=="Genuine"){
            sendResponse(isgenuine);
        }

    });


function create1(){
    var opt={
        type:"basic",
        title:"选课助手",
        message:"萌萌哒选课助手正在为你努力查询哦……o(〃'▽'〃)o",
        iconUrl:"/images/icon128.png",
    }
    chrome.notifications.create('1', opt);
}


function create2(progress){
    var opt={
        type:"progress",
        title:"选课助手",
        message:"萌萌哒选课助手正在为你努力查询哦……o(〃'▽'〃)o",
        iconUrl:"/images/icon128.png",
        progress:  Math.round(progress),
        //eventTime: Date.now() + 20000,
        //priority:2,
    }
    chrome.notifications.create('1', opt);
}


function update(progress){
    var opt={
        type:"progress",
        title:"选课助手",
        message:"萌萌哒选课助手正在为你努力查询哦……o(〃'▽'〃)o",
        iconUrl:"/images/icon128.png",
        progress: Math.round(progress),
        //eventTime: Date.now() + 20000,
        //priority:2,
    }
    chrome.notifications.update('1', opt);
}

function finish(){
    var opt={
        type:"basic",
        title:"选课助手",
        message:"选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~",
        iconUrl:"/images/finish.png",
    }
    chrome.notifications.create('1', opt);
}


function clear(){
    chrome.notifications.clear('1');
}
var res=localStorage["Stu"];
if (!res) {localStorage["Stu"] = "未知用户";}

var res=localStorage["Beta"];
if (!res) {localStorage["Beta"] = 0;}

var res=localStorage["Showscore"];
if (!res) {localStorage["Showscore"] = "enabled";}
var res=localStorage["ShowGPA"];
if (!res) {localStorage["ShowGPA"] = "enabled";}
var res=localStorage["Timecheck"];
if (!res) {localStorage["Timecheck"] = "enabled";}
var res=localStorage["NewVer"];
if (!res) {localStorage["NewVer"] = "enabled";}
