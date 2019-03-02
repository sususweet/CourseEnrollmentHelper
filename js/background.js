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
var broswer = broswer();

function doCheckUpdate(nowver) {
    var ajaxTimeoutTest = $.ajax({
        url: "https://enroll.zjuqsc.com/user/permit?uid="+localStorage["Stu"]+"&type=1&ver="+nowver,
        timeout : 3000,
        type : 'GET',
        dataType:'json',
        cache:false,
        success:function(targetdata){
            console.log(targetdata);
            permit=targetdata.valid;
            localStorage["Beta"]=permit;
            codebase=targetdata.codebase;
            version=targetdata.version;
            if (version>nowver){
                upenabled=1;
                //alert("选课助手要更新啦啦啦~点击确定下载！主人记得安装哦！！\n\n当前版本："+nowver+"\n\n最新版本："+version+"\n\n更新日志：\n"+updatelogs);
                //window.open(codebase);
            }
            else{
                upenabled=0;
            }
        },
        complete:function(XMLHttpRequest,status){
            if(status=='timeout'){
                // ajaxTimeoutTest.abort();
                localStorage["Beta"]=0;
            }
            if(status=='error'){//超时,status还有success,error等值的情况
                localStorage["Beta"]=0;
            }
        }
    });
}


function checkUpdate(){
    var manifestUri;
    var isSogou = false;
    if (broswer.chrome === true) {
        if (navigator.userAgent.toLowerCase().indexOf('se 2.x')>-1){
            nowver = sogouExplorer.runtime.getManifest().version;
            isSogou = true;
        } else {
            manifestUri = chrome.extension.getURL('manifest.json');
        }
    } else if (broswer.mozilla === true) manifestUri = browser.extension.getURL('manifest.json');

    if (isSogou) {
        doCheckUpdate(nowver)
    }else{
        if (manifestUri == '') return;
        $.get(manifestUri, function(info){
            nowver = info.version;
            doCheckUpdate(nowver)
        }, 'json');
    }
}

checkUpdate();

function isFirstrun(){
    var firstrun=localStorage["isFirstrun"];
    if (!firstrun||firstrun==0) {
        //window.open(chrome.extension.getURL('help.html'));
	window.open('https://enroll.zjuqsc.com/help');
	localStorage["isFirstrun"] = 1;
    }
    var Showinfo=localStorage["Showinfo"];
    if (!Showinfo) {
        localStorage["Showinfo"] = 1;
    }
}

isFirstrun();

function GenuineVerify(){
    if (broswer.mozilla === true) isgenuine=1;
    else if (navigator.userAgent.toLowerCase().indexOf('se 2.x')>-1) isgenuine=1;
    else {
        var targetappid_sha = "df70bb47192516150ad8582f10b4ae848682d555";
        var targetappid_sha_google = "ac3ecd0aecd67d47583cda67223b465cfb2b84d6";
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
}
GenuineVerify();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
        sendResponse(nowver);
        /*if(localStorage["Beta"]==1){
            verdescription="内测版";
        }else {
            verdescription="公开稳定版";
        }
        alert("版本："+nowver+" "+verdescription+"\n插件作者：苏酥甜心糕\n\n教师评分数据来源：@ZJU学习帝");*/
    }
    else if(request.cmd=="Stu"){
        localStorage["Stu"] = request.data;
    }
    else if(request.cmd=="Beta"){
        localStorage["Beta"] = request.data;
    }else if(request.key=="Getsettings"){
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
//教师均绩查询模块贡献者：Qui γ Far\n\n
/*chrome.extension.onRequest.addListener(function(request,sender,sendResponse) {
});*/

function create1(){
    var opt={
        type:"basic",
        title:"选课助手",
        message:"萌萌哒选课助手正在为你努力查询哦……o(〃'▽'〃)o",
        iconUrl:"/images/icon128.png",
    };
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
    };
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
    };
    chrome.notifications.update('1', opt);
}

function finish(){
    var opt={
        type:"basic",
        title:"选课助手",
        message:"选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~",
        iconUrl:"/images/finish.png",
    };
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
