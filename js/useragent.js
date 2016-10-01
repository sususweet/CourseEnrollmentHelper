
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders;
	var blockingResponse = modifyHeader(headers);
	return blockingResponse;
}, {
	urls : ["http://chalaoshi.cn/*"]
}, ["requestHeaders", "blocking"]);

//写cookies 

function setCookie(name,value) 
{ 
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 

//读取cookies 
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 

function modifyHeader(_headers){
	var blockingResponse = {};
	for (var j = 0; j < _headers.length; j++){
		if(_headers[j].name == "User-Agent"){
			_headers[j].value = "Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; 2014813 Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.85 Mobile Safari/537.36 XiaoMi/MiuiBrowser/8.0.9";
			//details.requestHeaders[i].value = "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19";
		}
		
	}
		_headers.push({name:'User-Agent',value:"Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; 2014813 Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.85 Mobile Safari/537.36 XiaoMi/MiuiBrowser/8.0.9"});
	
	/*for (var j = 0; j < _headers.length; j++){
		if(_headers[j].name == "Cookie"){
			_headers[j].value = "sessionid=6focsbf7h2keeotg94saab2ycda06uds";
		}
		
	}
		_headers.push({name:'Cookie',value:"sessionid=6focsbf7h2keeotg94saab2ycda06uds"});
*/
	
	blockingResponse.requestHeaders = _headers;
	return blockingResponse;
}
