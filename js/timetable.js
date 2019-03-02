function getTime() {
    if ($('div.outer_xkxx_list').length <= 0) {
        return;
    }
    if ($('#timesheet1').length > 0) {
        $('#timesheet1').remove();
        $('#timesheet2').remove();
        $('#hidebutton').remove();
    }

    $("body").append("<div id='timesheet1' style='z-index:100;opacity:0.8;float:right;position:fixed;top:32px;right:32px;background-color:white;width:280px;height:300px'></div>")
    $("body").append("<div id='timesheet2' style='z-index:100;opacity:0.8;float:right;position:fixed;top:364px;right:32px;background-color:white;width:280px;height:300px'></div>")
    $("body").append("<div id='hidebutton' style='z-index:100;color:white;cursor:pointer;opacity:1.0;display:inline-block;width:64px;height:20px;text-align:center;float:right;position:fixed;top:0px;right:32px;background-color:#0483d4;'>隐藏课表</div>")

    $("#hidebutton").click(function () {
        $('#timesheet1').remove();
        $('#timesheet2').remove();
        $('#hidebutton').remove();
    });

    var alist = $('div.outer_xkxx_list');
    var weekday = new Array("一", "二", "三", "四", "五", "六", "日");
    for (var k = 0; k < 7; k++) {
        $("#timesheet1").append("<div style='width:31px;display:inline-block;height:15px;position:absolute;top:5px;text-align:center;left:" + (32 + 32 * k) + "px'>" + weekday[k] + "</div>");
        $("#timesheet2").append("<div style='width:31px;display:inline-block;height:15px;position:absolute;top:5px;text-align:center;left:" + (32 + 32 * k) + "px'>" + weekday[k] + "</div>");

    }
    $("#timesheet1").append("<div style='width:31px;display:inline-block;height:15px;position:absolute;top:5px;text-align:center;left:5px'>秋/春</div>");
    $("#timesheet2").append("<div style='width:31px;display:inline-block;height:15px;position:absolute;top:5px;text-align:center;left:5px'>冬/夏</div>");

    for (var k = 0; k < 14; k++) {
        $("#timesheet1").append("<div style='width:31px;display:inline-block;height:15px;position:absolute;top:5px;text-align:center;top:" + (48 + k * 16) + "px'>" + (k + 1) + "</div>");
        $("#timesheet2").append("<div style='width:31px;display:inline-block;height:15px;position:absolute;top:5px;text-align:center;top:" + (48 + k * 16) + "px'>" + (k + 1) + "</div>");

    }
    var len = alist.length;
    var x;
    var y;
    for (var i = 0; i < len; i++) {
        var name = $(alist[i]).find("a.jump").html();
        name = name.replace(/\([a-zA-Z0-9]+\)([^-]+)-.+/ig, "$1");
        for (var q = 0; q < $(alist[i]).find("p.xxq").length; q++) {
            var term = $($(alist[i]).find("p.xxq")[q]).html();
            var dity = $($(alist[i]).find("p.time")[q]).html().split("<br>");
            for (var n = 0; n < dity.length; n++) {
                for (var k = 0; k < 7; k++) {
                    if (dity[n].search(weekday[k]) != -1) {
                        x = 32 + 32 * k;
                    }
                }
                var timelist = new Array();
                dity[n].replace(/[^0-9|,]/ig, "");
                dity[n].replace(/(\d+)/ig, function ($1) {
                    timelist.push(parseInt($1));
                    return "";
                });
                for (var m = 0; m < timelist.length; m++) {
                    if (term.search("春") >= 0 || term.search("秋") >= 0) {
                        $("#timesheet1").append("<div style='font-size:6px;color:white;overflow:hidden;width:31px;height:15px;position:absolute;background-color:#0483d4;top:" + (32 + timelist[m] * 16) + "px;left:" + x + "px'>" + name + "</div>");
                    }
                    if (term.search("夏") >= 0 || term.search("冬") >= 0) {
                        $("#timesheet2").append("<div style='font-size:6px;color:white;overflow:hidden;width:31px;height:15px;position:absolute;background-color:#0483d4;top:" + (32 + timelist[m] * 16) + "px;left:" + x + "px'>" + name + "</div>");
                    }
                }
            }
        }

    }
    //alert($(alist[i]).html());
    if ($('tr.body_tr').length > 0) {
        $('tr.body_tr').mouseover(function () {
            var id = $(this).attr("id");
            if ($("[classid='" + id + "']").length == 0) {
                var term = $(this).children("td.xxqmc").html();
                var time = $(this).children("td.sksj").html();
                console.log(term)
                var dity = time.split("<br>");
                var x;
                for (var n = 0; n < dity.length; n++) {
                    for (var k = 0; k < 7; k++) {
                        if (dity[n].search(weekday[k]) != -1) {
                            x = 32 + 32 * k;
                        }
                    }
                    var timelist = new Array();
                    dity[n].replace(/[^0-9|,]/ig, "");
                    dity[n].replace(/(\d+)/ig, function ($1) {
                        timelist.push(parseInt($1));
                        return "";
                    });
                    for (var m = 0; m < timelist.length; m++) {
                        if (term.search("春") >= 0) {
                            $("#timesheet1").append("<div classid='" + id + "' style='opacity:0.3;width:31px;height:15px;position:absolute;background-color:red;top:" + (32 + timelist[m] * 16) + "px;left:" + x + "px'></div>");
                        }
                        if (term.search("夏") >= 0) {
                            $("#timesheet2").append("<div classid='" + id + "' style='opacity:0.3;width:31px;height:15px;position:absolute;background-color:red;top:" + (32 + timelist[m] * 16) + "px;left:" + x + "px'></div>");
                        }
                    }
                }
            }

        });
        $('tr.body_tr').mouseleave(function () {
                var id = $(this).attr("id");
                $("[classid='" + id + "']").remove();
            }
        );

    }
}

$(document).ready(function () {
    var weekday = new Array("一", "二", "三", "四", "五", "六", "日");
    $("#yhgnPage").bind('DOMNodeInserted', function (e) {

        if ($('tr.body_tr').length > 0) {
            $('tr.body_tr').mouseover(function () {
                var id = $(this).attr("id");
                if ($("[classid='" + id + "']").length == 0) {
                    var term = $(this).children("td.xxq").html();
                    var time = $(this).children("td.sksj").html();
                    var dity = time.split("<br>");
                    var x;
                    for (var n = 0; n < dity.length; n++) {
                        for (var k = 0; k < 7; k++) {
                            if (dity[n].search(weekday[k]) != -1) {
                                x = 32 + 32 * k;
                            }
                        }
                        var timelist = new Array();
                        dity[n].replace(/[^0-9|,]/ig, "");
                        dity[n].replace(/(\d+)/ig, function ($1) {
                            timelist.push(parseInt($1));
                            return "";
                        });
                        for (var m = 0; m < timelist.length; m++) {
                            if (term.search("春") >= 0 || term.search("秋") >= 0) {
                                $("#timesheet1").append("<div classid='" + id + "' style='opacity:0.3;width:31px;height:15px;position:absolute;background-color:red;top:" + (32 + timelist[m] * 16) + "px;left:" + x + "px'></div>");
                            }
                            if (term.search("夏") >= 0 || term.search("冬") >= 0) {
                                $("#timesheet2").append("<div classid='" + id + "' style='opacity:0.3;width:31px;height:15px;position:absolute;background-color:red;top:" + (32 + timelist[m] * 16) + "px;left:" + x + "px'></div>");
                            }
                        }
                    }
                }

            });
            $('tr.body_tr').mouseleave(function () {
                    var id = $(this).attr("id");
                    $("[classid='" + id + "']").remove();
                }
            );

        }
    });
    //onClickMenu.call(this,'/xsxk/zzxkzdb_cxZzxkZdbIndex.html','N253516');
    //$("ul#navbar-nav li:eq(2)")..trigger("click");
});
if ($("#showbutton").length == 0) {
    $("body").append("<div id='showbutton' style='color:white;cursor:pointer;opacity:1.0;display:inline-block;width:64px;height:20px;text-align:center;float:right;position:fixed;top:0px;right:32px;background-color:#0483d4'>显示课表</div>")
    $("#showbutton").click(function () {
        getTime();
    });
}
getTime();