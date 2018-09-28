var student;
var busytime = "";
var commonBusyTime = "";
var tykBusytime = "";
var enrollinfo = [];
var title;
var courseitem;
var teacheritem;
var sort = 0;
var Showscore;
var Timecheck;
var nowver;

$(document).ready(function () {
    try {
        student = $("#sessionUserKey").val();
        chrome.runtime.sendMessage({cmd: "Stu", data: student}, function (response) {
        });
    } catch (err) {
        errorHandler("获取学号信息错误！",err);
    }

    chrome.runtime.sendMessage({key: "update"}, function (res) {
        console.log(res);
        try {
            upenabledvalue = res.upenabled;
        } catch (err) {
            upenabledvalue = 0;
        }
        nowver = res.nowver;
        if (upenabledvalue == 1) {
            swal({
                title: "检测到主程序更新",
                text: "选课助手要更新啦~点击确定下载~记得安装哦！！\n\n当前版本：" + nowver + "\n\n最新版本：" + res.latestver + "\n\n为保证用户体验，插件需要更新才能使用哦~",
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
        chrome.runtime.sendMessage({key: "Genuine"}, function (isgenuine) {
            if (isgenuine == 0) {
                swal("主程序错误！", "检测到插件被二次打包！\n为保护作者版权，请重新下载官方版本！\n下载地址：" + res.updateurl, "error");
                //infoGather(document.getElementsByTagName('html')[0].innerHTML);
            }
            else {
                chrome.runtime.sendMessage({key: "Getsettings"}, function (response) {
                    response = response.split(",");
                    Showscore = response[0];
                    Timecheck = response[2];
                    NewVer = response[4];
                    permit = response[3];
                    Main();
                    /*if (permit == 1) {

                    } else if (permit == 0) {
                        NewVer = "disabled";
                        swal("插件功能受限！", '新系统适配还在内测阶段哦~\n酷爱来这里申请内测权限吧~:https://enroll.zjuqsc.com/apply/', "warning");
                    }*/
                });
            }
        });
    });
});

function Main() {
    try {

        title = $(".leaf");
        if (title.length === 0) {
            return setTimeout(Main, 1000);
        } else {
            //WaitForReady();
            if ($("#outer_xkxx").length > 0) {
                // infoGather(document.getElementsByTagName('html')[0].innerHTML);
            }
            for (var i = 0; i < title.length; i++) {
                var dropdown = $(title.get(i)).find(".dropdown-menu");
                var addevent;
                if (dropdown.length == 0) {
                    addevent = title.get(i);
                    addevent.addEventListener("click", function () {
                        doScrollCheck2();
                        // infoGather(document.getElementsByTagName('html')[0].innerHTML);
                    });
                } else {
                    addevent = $(dropdown).find("li");
                    for (var k = 0; k < addevent.length; k++) {
                        addevent.get(k).addEventListener("click", function () {
                            doScrollCheck2();
                            // infoGather(document.getElementsByTagName('html')[0].innerHTML);
                        });
                    }
                }
            }

            var course_has_enroll = $(".jump");
            $.each(course_has_enroll, function (index, value, array) {
                value.addEventListener("click", function () {
                    var search_button = $("#btn_cxjxb").get(0);
                    if (!search_button) {
                        return setTimeout(doScrollCheck2, 1000);
                    }
                });
            });


            doScrollCheck2();
        }


    } catch (err) {
        errorHandler("Main 函数错误！", err);
    }
}

function WaitForReady() {
    try{
        title = $(".leaf");
        if (title.length === 0) {
            return setTimeout(WaitForReady, 1000);
        } else {
            console.log(title);
        }
    }catch (err){
        errorHandler("WaitForReady 函数错误！",err);
    }
}

function doScrollCheck2() {
    courseitem = $(".panel-info");

    if (courseitem.length == 0) {
        return setTimeout(doScrollCheck2, 1000);
    }

    search_button = $("#btn_cxjxb").get(0);
    if (search_button) {
        if (search_button.getAttribute('addClick') != 1){
            search_button.addEventListener("click", function () {
                doScrollCheck2();
            });
            search_button.setAttribute('addClick', 1);
        }
    }

    Addbtn();

    //console.log(courseitem);
    isnext = $("#nextPage").get(0);
    if (isnext != null && isnext.style.display != "none") {
        if (isnext.getAttribute('addClick') != 1){
            isnext.addEventListener("click", function () {
                doScrollCheck2();
            });
            isnext.setAttribute('addClick', 1);
        }
    }
}

function Addbtn() {
    //console.log(courseitem);
    try{
        if ($(courseitem[0]).find(".nodata").length != 0) return;

        var that = $(courseitem[0]).find(".kc_head").get(0);
        if(that.getAttribute('state') == null){
            that.setAttribute('state', 0);
            var addfunc = function(){
                //console.log(that)
                if ($(that).parent().find("tbody").get(0).childElementCount === 0){
                    return setTimeout(addfunc, 1000);
                }
                Superlookup(0, that.getAttribute('state'));
                that.setAttribute('state', 1);
            };

            addfunc();
        }

        for (var j = 1; j < courseitem.length; j++) {
            var thats = $(courseitem[j]).find(".kc_head").get(0);
            if (thats.getAttribute('state') == null){
                thats.setAttribute('checkid', j);
                thats.setAttribute('state', 0);
                thats.addEventListener("click", function () {
                    try {
                        if ($(this).find(".expand1").get(0) != null){
                            var searchState = this.getAttribute('state');
                            var that = this;
                            var func = function () {
                                if ($(that).parent().find("tbody").get(0).childElementCount === 0) {
                                    return setTimeout(func, 1000);
                                }
                                Superlookup(that.getAttribute('checkid'), searchState);
                                if (searchState == 0) {
                                    that.setAttribute('state', 1);
                                }
                            };

                            func();
                        }
                        //console.log(courseitem[j]);
                        //console.log(courseitem.find("tr[class='body_tr']"));
                    } catch (err) {
                        errorHandler("AddEventListener 函数错误！", err);
                    }
                });
            }

            additem = $(courseitem[j]).find("tr[class='active']").get(0);
            //console.log($(additem).find("button[type='button']").length);

            if ($(additem).find("button[type='button']").length == 0) {
                //if(titlestate==0){
                addbutton = $(additem).append('<th style="display: none" width="5%"><button class="btn btn-warning" type="button" checkid=' + j + ' state="0">开始查询</button></th>');
                addbutton = addbutton[0];
                //}
                //console.log(additem);
                buttonitem = $(additem).find("button[type='button']").get(0);
                buttonitem.addEventListener("click", function () {
                    try {
                        btnstate = this.getAttribute('state');

                        //console.log("btnstate", btnstate);

                        Superlookup(this.getAttribute('checkid'), btnstate);
                        if (btnstate == 0) {
                            this.setAttribute('state', 1);
                        }
                        //console.log(courseitem[j]);
                        //console.log(courseitem.find("tr[class='body_tr']"));
                    } catch (err) {
                        errorHandler("ButtonaddEventListener 函数错误！", err);
                    }
                });
            }
        }
    }catch(err){
        errorHandler("Addbtn 函数错误！",err);
    }

}

function Checktime(student, id, btnstate) {
    try{
        commonBusyTime = "";
        tykBusytime = "";

        var enrollCourseInfo = $(".outer_xkxx_list");
        //console.log(enrollCourseInfo);

        if (!enrollCourseInfo.length) return;

        for (var j = 0; j < enrollCourseInfo.length; j++) {
            var courseCode =  $($(enrollCourseInfo[j]).find("h6")[0]).find("a")[0].text;
            courseCode = courseCode.match(/\(.+?(\)+?)/);
            if (courseCode != null){
                courseCode = trimStr(courseCode[0]);
                courseCode = courseCode.replace("(","").replace(")","");
            }else{
                swal("课程列表为空？", "请查看右侧课程篮子，检查是否有课程！", "error");
                break;
            }

            //console.log(courseCode);


            var courseArray;
            courseArray = $($(enrollCourseInfo[j]).find("ul")[0]).find("li");

            //courseArray = $($($(enrollCourseInfo[j]).find("ul")[0]).find("table")[0]).find("tr");
			
            for (var index = 0; index < courseArray.length; index++){
                var courseTerm;
                try {
                    courseTerm = $($(courseArray[index]).find("table")[0]).find("[class='xxq']")[0].innerHTML;
                    courseTerm = trimStr(courseTerm);
                } catch (err) {
                    courseTerm = "0";
                }

                var courseTime;
                try {
                    courseTime = $($(courseArray[index]).find("table")[0]).find("[class='time']")[0].innerHTML;
                    courseTime = trimStr(courseTime);
                    if (courseTime === "--") courseTime = "0";
                }
                catch (err) {
                    courseTime = "0";
                }

                enrollinfo[j] = {course: courseCode, courseterm: courseTerm, coursetime: courseTime};

                console.log(enrollinfo[j]);

                //res=Convertday(coursetime);
                //console.log(res);
                if (courseTime !== "0" && courseTerm !== "0") {
                    var convertTime;
                    convertTime = Convertday(courseTime, courseTerm);
                    commonBusyTime += convertTime;
                    if (courseCode != "tyk" && !(courseCode.indexOf("4010") == 0)) tykBusytime += convertTime;
                }
            }
        }
        //console.log(commonBusyTime);
        Superchoose(id, btnstate);
    }catch(err){
        errorHandler("Checktime 函数错误！",err);
    }

}

/**
 * @return {string}
 */
function ChangeSortTitie(str){
    if (str.indexOf("▼") != -1) return str.replace("▼","▲");
    if (str.indexOf("▲") != -1) return str.replace("▲","▼");
    return str += "▼";
}

function Superchoose(id, btnstate) {
    try{
        //console.log(courseitem);
        additem = $(courseitem[id]).find("tr[class='active']").get(0);
        if (btnstate == 0) {

            //deloper = $(additem).find("th").get(10);
            //$(deloper).remove();
            marktitle = $(additem).find("th").get(0);
            $(marktitle).after('<th nowrap="nowrap" id="score">评分/人数</th>');
            titlesort = $(courseitem[id]).find("tr[class='active']").get(0);
            titlesort = $(titlesort).find("th");
            if (titlesort.get(1) != null){
                //console.log(titlesort);
                titlesort.get(1).innerText += "▲";
                titlesort.get(1).onmouseover = Changecursor;
                titlesort.get(3).innerText += "▲";
                titlesort.get(3).onmouseover = Changecursor;
                titlesort.get(4).innerText += "▲";
                titlesort.get(4).onmouseover = Changecursor;
                titlesort.get(8).innerText += "▲";
                titlesort.get(8).onmouseover = Changecursor;

                titlesort.get(1).addEventListener("click", function () {
                    sortTable(code, 2, 'float');
                    titlesort.get(1).innerText = ChangeSortTitie(titlesort.get(1).innerText);
                });
                titlesort.get(3).addEventListener("click", function () {
                    sortTable(code, 4, 'string');
                    titlesort.get(3).innerText = ChangeSortTitie(titlesort.get(3).innerText);
                });
                titlesort.get(4).addEventListener("click", function () {
                    sortTable(code, 5, 'string');
                    titlesort.get(4).innerText = ChangeSortTitie(titlesort.get(4).innerText);
                });
                titlesort.get(8).addEventListener("click", function () {
                    sortTable(code, 9, 'int');
                    titlesort.get(8).innerText = ChangeSortTitie(titlesort.get(8).innerText);
                    //this.innerText=this.innerText+"↑"
                });
            }

        }

        if (courseitem[id] == null) return;
        coursecode = courseitem[id].innerText.match(/\(.{1,}\)/);
        if (coursecode == null) return;
        coursecode = coursecode[0].replace(/\({0,1}\){0,1}/g, "");
        //console.log(coursecode);
        idtemp = parseInt(id) + 1;
        code = "tbody_" + coursecode + "_" + idtemp;

        teacheritem = $(courseitem[id]).find("tbody").get(0);
        teacheritem = $(teacheritem).find("tr");

        if (teacheritem.length == 0) {
            //courseitem=$(".panel-info");
            //return setTimeout(doScrollCheck3, 50);
        } else {
            //console.log(teacheritem);

            var isTyk = false;
            if ($("#tykTool")[0].getAttribute("aria-expanded") == "true"){
                isTyk = true;
                busytime = tykBusytime;
            }else{
                busytime = commonBusyTime;
            }
            //console.log("istyk:"+isTyk);
            //console.log(busytime);

            for (var t = 0; t < teacheritem.length; t++) {
                var timeok = 1;
                var spareok = 1;
                CourseInfo = teacheritem.get(t);
                teacher = $(CourseInfo).find("td[class='jsxm']").get(0).innerText;

                teacher = teacher.split('\n')[0];
                teacher = teacher.split(' ')[0];
                //teacheritem.get(t).setAttribute('style','color:#C2C2C2');
                //teacheritem.get(t).setAttribute('class','success');
                //teacheritem.get(t).setAttribute('class','warning');
                if (btnstate == 0) {
                    scoredigit = $(CourseInfo).find("td[class='jsxm']").get(0);
                    $(scoredigit).after('<td id="scoredigit">暂无</td>');
                }
                //console.log(CourseInfo);
                enroll = $(CourseInfo).find("td[class='an']").get(0);
                chosen = $(enroll).find("button").get(0).innerHTML;
                //console.log($(enroll).find("button"));
                courseterm = $(CourseInfo).find("td[class='xxq']").get(0).innerText;
                coursetime = $(CourseInfo).find("td[class='sksj']").get(0).innerText;
                coursespace = $(CourseInfo).find("td[class='rsxx']").get(0).innerText;

                if (Timecheck == "enabled"){
                    if (Spare(coursespace) == 0 && chosen == "选课") {
                        enroll.setAttribute('style', 'visibility:hidden');
                        spareok = 0;
                    } else {
                        spareok = 1;
                    }

                    coursetime = coursetime.replace(/\n/g, '<br>');
                    if (Time(coursetime, courseterm, coursecode) == 0) {
                        CourseInfo.setAttribute('style', 'color:#C2C2C2');
                        timeok = 0;
                    } else {
                        CourseInfo.setAttribute('style', 'color:#000000');
                        timeok = 1;
                    }
                    //console.log(chosen);
                    if (chosen == "退选") {
                        CourseInfo.setAttribute('class', 'danger');
                    } else if (timeok == 1 && spareok == 1) {
                        CourseInfo.setAttribute('class', 'success');
                    } else {
                        CourseInfo.setAttribute('class', 'body_tr');
                    }
                }


            }
            getScoresAll();
            //getScores(0, id);
        }
    }catch(err){
        errorHandler("Superchoose 函数错误！",err);
    }

}

function Superlookup(id, btnstate) {
    //additem=$(courseitem[id]).find("tr[class='active']").get(0);
    //btn=$(additem).find("button[checkid='"+id+"']").button('loading');
    //student=window.document.location.search.match(/userName=\d{1,}/)[0].replace("userName=","");
    student = $("#sessionUserKey").val();
    Shownotice(Timecheck,Showscore);
    Checktime(student, id, btnstate);

}


function trimStr(str) {
    if (typeof(str)=="undefined") return;
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


//数据类型转换函数
function convert(sValue, sDataType) {
    switch (sDataType) {
        case "int":
            return parseInt(sValue);
        case "float":
            return parseFloat(sValue);
        case "date":
            return new Date(Date.parse(sValue));
        default:
            return sValue.toString();
    }
}

function Sort() {
    for (var s1 = 0; s1 < teacheritem.length; s1++) {
        for (var s2 = s1; s2 < teacheritem.length; s2++) {
            temp1 = teacheritem.get(s2);
            $(temp1).find("td[class='rsxx']").get(0).innerText;
            temp2 = teacheritem.get(s1);
            $(temp2).find("td[class='rsxx']").get(0).innerText;

            try {
                var vValue1 = convert(temp1, "");
            }
            catch (err) {
                vValue1 = 0;
            }
            try {
                var vValue2 = convert(temp2, "");
            }
            catch (err) {
                vValue2 = 0;
            }

            if (vValue1 > vValue2) {
                var teacheritem1 = teacheritem.get(s2);
                var teacheritem2 = teacheritem.get(s2 + 1);
                teacheritem1 = temp2;
                teacheritem2 = temp1;
            }
        }

    }
}


function Converttime(time) {
    var res = "";
    if (time.indexOf("1") >= 0 && time.indexOf("10") < 0 && time.indexOf("11") < 0 && time.indexOf("12") < 0 && time.indexOf("13") < 0) {
        res = res + ",01";
    }
    if (time.indexOf("2") >= 0 && time.indexOf("12") < 0) {
        res = res + ",02";
    }
    if (time.indexOf("3") >= 0 && time.indexOf("13") < 0) {
        res = res + ",03";
    }
    if (time.indexOf("4") >= 0) {
        res = res + ",04";
    }
    if (time.indexOf("5") >= 0) {
        res = res + ",05";
    }
    if (time.indexOf("6") >= 0) {
        res = res + ",06";
    }
    if (time.indexOf("7") >= 0) {
        res = res + ",07";
    }
    if (time.indexOf("8") >= 0) {
        res = res + ",08";
    }
    if (time.indexOf("9") >= 0) {
        res = res + ",09";
    }
    if (time.indexOf("10") >= 0) {
        res = res + ",10";
    }
    if (time.indexOf("11") >= 0) {
        res = res + ",11";
    }
    if (time.indexOf("12") >= 0) {
        res = res + ",12";
    }
    if (time.indexOf("13") >= 0) {
        res = res + ",13";
    }
    return res;
}

function Convertterm(term) {
    //获取课程所在学期
    var termcache = "";
    if (term.indexOf("秋") >= 0) {
        termcache = termcache + ",01";
    }
    if (term.indexOf("冬") >= 0) {
        termcache = termcache + ",02";
    }
    if (term.indexOf("春") >= 0) {
        termcache = termcache + ",03";
    }
    if (term.indexOf("夏") >= 0) {
        termcache = termcache + ",04";
    }
    return termcache;
}

function Convertweekly(week) {
    //获取课程所在学期
    var weekcache = "";
    if (week.indexOf("双周") >= 0) {
        weekcache = weekcache + ",d";
    }
    else if (week.indexOf("单周") >= 0) {
        weekcache = weekcache + ",s";
    }
    else {
        weekcache = weekcache + ",d,s";
    }
    return weekcache;
}

function Convertday(coursetime, courseterm) {
    coursetime = coursetime.split("<br>");
    var convert = "";
    var res = "";
    termcache = Convertterm(courseterm).split(",");

    for (var h = 1; h < termcache.length; h++) {

        for (var i = 0; i < coursetime.length; i++) {
            //console.log(coursetime[i]);
            weekcache = Convertweekly(coursetime[i]).split(",");

            if (coursetime[i].indexOf("周一") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "1x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }

            if (coursetime[i].indexOf("周二") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "2x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }
            if (coursetime[i].indexOf("周三") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "3x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }
            if (coursetime[i].indexOf("周四") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "4x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }

            if (coursetime[i].indexOf("周五") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "5x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }

            if (coursetime[i].indexOf("周六") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "6x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }

            if (coursetime[i].indexOf("周日") >= 0) {
                var cache = Converttime(coursetime[i]).split(",");
                for (var j = 1; j < cache.length; j++) {
                    for (var w = 1; w < weekcache.length; w++) {
                        convert = convert + "7x" + cache[j] + termcache[h] + weekcache[w] + ",";
                    }
                }
            }


        }
    }
    return convert;
}

function AddSort(type) {
    tdstitle = trs[0].getElementsByTagName("td");
    chrome.runtime.sendMessage({key: "Showinfo"}, function (Showinfo) {
        if (Showinfo == 1) {
            swal("教师排序模块已激活", "现在你可以点击表头的相应文字对所有教师进行排序，同时点击教师评分和均绩可进入学习帝查看评论详情~", "info");
        }
    });
    if (type == 1) {
        tdstitle[1].onmouseover = Changecursor;
        tdstitle[1].onclick = function () {
            Sort(1, 'float');
        }
    }
    tdstitle[3 + type].onmouseover = Changecursor;
    tdstitle[3 + type].onclick = function () {
        Sort(3 + type, 'string');
    }
    tdstitle[4 + type].onmouseover = Changecursor;
    tdstitle[4 + type].onclick = function () {
        Sort(4 + type, 'string');
    }
    tdstitle[6 + type].onmouseover = Changecursor;
    tdstitle[6 + type].onclick = function () {
        Sort(6 + type, 'int');
    }
}

function Showprogress() {
    if (Timecheck == "enabled" && Showscore == "disabled") {
        chrome.runtime.sendMessage({cmd: "finish"}, function (response) {
        });
        AddSort(0);
        /*var title = document.getElementsByTagName('title')[0];
        if (!title) {
            var title = document.createElement('title');
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
            document.getElementsByTagName('head')[0].appendChild(title);
        }
        else {
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
        }*/
    }
    else if (Showscore == "enabled") {
        chrome.runtime.sendMessage({cmd: "finish"}, function (response) {
        });
        /*var title = document.getElementsByTagName('title')[0];
        if (!title) {
            var title = document.createElement('title');
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
            document.getElementsByTagName('head')[0].appendChild(title);
        }
        else {
            title.innerHTML = "选课助手已经完成主人交给的任务了呢~\(^o^)/！现在主人可以很方便地选课啦~";
        }*/
    }

    //chrome.runtime.sendMessage({cmd: "update",progress:progress},function(response) {});
    //console.log(progress);
}

function Shownotice(Timecheck, Showscore) {
    try{
        chrome.runtime.sendMessage({cmd: "clear"},function(response) {});
        //每隔3秒执行一次
        if (Showscore == "enabled") {
            //NProgress.start();
            //chrome.runtime.sendMessage({cmd: "create2",progress:progress},function(response) {});
            chrome.runtime.sendMessage({cmd: "create1"}, function (response) {
            });
            Showprogress();
        }
        else if (Timecheck == "enabled") {
            chrome.runtime.sendMessage({cmd: "create1"}, function (response) {
            });
            Showprogress();
        }
    }catch (err){}

}

function Time(Timedata, Termdata, Codedata) {
    //console.log("Codedata"+Codedata);
    try{
        //for(var i=1;i<trs.length;i++){
        //var tds=trs[i].getElementsByTagName("td");
        //var term=tds[2].innerHTML;
        //var time=tds[3].innerHTML;
        var flag = 0;
        var targettime = Convertday(Timedata, Termdata);
        targettime = targettime.split(",");
        //console.log(targettime);
        for (j = 0; j < targettime.length - 1; j++) {
            if (busytime.indexOf(targettime[j]) >= 0) {
                //input[0].setAttribute("disabled","disabled");
                //trs[i].style.color="#C2C2C2";
                flag = 0;
                break;
            }
        }
        if (j >= targettime.length - 1) {
            flag = 1;
        }

        //var course=document.getElementById("Label_jbxx").innerText;
        //course=course.match(/课程代码：.{8}/);
        //course=course[0].match(/[0-9A-Z]{8}/);
        //course=course[0];
        for (x = 0; x < enrollinfo.length; x++) {
            if (Codedata == enrollinfo[x].course) {
                if (Timedata == enrollinfo[x].coursetime && Termdata == enrollinfo[x].courseterm) {
                    flag = 1;
                }
            }
        }
        return flag;
    }
    catch(err) {
        errorHandler("时间冲突判断模块错误！",err);
    }
}

/**
 * @return {number}
 */
function Spare(Sparedata) {
    try{
        Sparedata = Sparedata.split("/")[0];
        if (Sparedata <= 0) {
            return 0;
        } else {
            return 1;
        }
    }
    catch(err){
        errorHandler("课程余量判断模块错误！",err);
    }
}

function getScoresAll(){
    var teacherArray = [];

    $.each(teacheritem,function(index,trsVal){
        var teacher = $(teacheritem.get(index)).find("td[class='jsxm']").get(0);
        if(teacher != null){
            teacher = teacher.innerText;
            teacher = teacher.split('\n')[0];
            teacher = teacher.split(' ')[0];
            teacherArray.push(teacher)
        }
    });

    $.ajax({
        type: "POST",
        dataType: "json",
        data:{
            student: student,
            teacher: JSON.stringify(teacherArray)
        },
        url: "https://enroll.zjuqsc.com/user/quickSearch",
        error:function(){
            swal("服务器响应超时", "貌似最近访问的人太多了，服务器忙不过来啦~", "error");
        },
        success: function (msgdata){
            if (msgdata.success === 0) {
                var teacherResultArray = msgdata.data;

                $.each(teacheritem, function (index, trsVal) {
                    var scoredigit;

                        var teacher = $(teacheritem.get(index)).find("td[class='jsxm']").get(0).innerText;
                        teacher = teacher.split('\n')[0];
                        teacher = teacher.split(' ')[0];

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


                    scoredigit = $(teacheritem.get(index)).find("td[id='scoredigit']").get(0);
                        scoredigit.innerHTML = score + "/" + scorenum;
                        scoredigit.onmouseover = Changecursor;
                        scoredigit.onclick = function () {
                            window.open("https://chalaoshi.cn/teacher/" + tid + "/");
                        };

                        if (score > 8.6) {
                            scoredigit.style.color = "red";
                        }
                        else {
                            scoredigit.style.color = "";
                        }

                });
            }
        }
    });

}

function getScores(times, courseid) {
    try{
        var tid;
        if (times >= teacheritem.length) {
            return;
        }
        teacher = $(teacheritem.get(times)).find("td[class='jsxm']").get(0).innerText;
        teacher = teacher.split('\n')[0];
        teacher = teacher.split(' ')[0];
        teacher = encodeURIComponent(teacher);

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "https://enroll.zjuqsc.com/user/search?name=" + teacher,
            error: function () {
                swal("服务器响应超时", "貌似最近访问的人太多了，服务器忙不过来啦~", "error");
            },
            complete: function (msg, statust) {
                //function(msg,i){
                //alert(times);
                //var tds=trs[times].getElementsByTagName("td");
                //var span=document.createElement("td");
                //var span2=document.createElement("td");
                try {
                    msgdata = msg.responseJSON;
                    tid = msgdata.ID;
                    score = msgdata.Score;
                    scorenum = msgdata.AssessNum;

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
                catch (err) {
                    score = 0.0;
                }
                scoredigit = $(teacheritem.get(times)).find("td[id='scoredigit']").get(0);
                scoredigit.innerHTML = score + "/" + scorenum;
                scoredigit.onmouseover = Changecursor;
                scoredigit.onclick = function () {
                    window.open("https://chalaoshi.cn/teacher/" + tid + "/");
                }
                if (score > 8.6) {
                    scoredigit.style.color = "red";
                }
                else {
                    scoredigit.style.color = "";
                }
                times++;
                getScores(times);

            }

        });
    }
    catch(err){
        errorHandler("教师评分及均绩查询模块错误！",err);
    }
}


function Changecursor() {
    this.style.cursor = "pointer";
}

function GetPermit(targetdata, student) {
    try {
        targetdata = targetdata.match(/richContent3'>\n.{0,}\n<\/div>/);
        targetdata = targetdata[0].match(/<p>\d{1,}<\/p>/g);
        for (var i = 0; i < targetdata.length; i++) {
            target = targetdata[i].match(/\d{1,}/);
            target = target[0];
            if (student == target) {
                return 1;
            }
        }
        return 0;
    }
    catch (err) {
       errorHandler("身份验证模块错误！",err);
    }
}

function infoGather(errmsg){
    $.ajax({
        url: "https://enroll.zjuqsc.com/user/errfeedback",
        timeout : 3000,
        type : 'POST',
        dataType:'json',
        data:{
            errname: "jwbinfo",
            errmessage: "jwbinfo",
            errlog: errmsg,
            userAgent: navigator.userAgent,
            stuid: student,
            version: nowver
        },
        cache:false
    });
}


function errorHandler(errdesc, errmsg){
    console.log(errmsg);
    swal(errdesc, "呜呜……/(ㄒoㄒ)/~选课助手崩溃啦，崩溃日志已经被上传到服务器，请等待作者回应。您还可以联系作者详细描述错误情形以帮助改进插件~\n\n错误信息：\n" + errmsg, "error");
    $.ajax({
        url: "https://enroll.zjuqsc.com/user/errfeedback",
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
    infoGather(document.getElementsByTagName('html')[0].innerHTML);
}


