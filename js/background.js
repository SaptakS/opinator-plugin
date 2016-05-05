/*
	[*] - init() is the function to iniatialize the details of the current tab.
	[*] - script.js is the file which makes a regex check and extracts the product code from the url.
*/
function init() {

	// set the id of the current tab
	chrome.tabs.query({ lastFocusedWindow: true, active: true }, function (tabs) {
		currentTabId = tabs[0].id;
	});

	//checkValid(localStorage.url);

}

function titleExtract() {
	chrome.tabs.executeScript(null, {code:
		'document.getElementById("productTitle").textContent'
	}, function(results) {
		localStorage.title = results;
		//console.log(localStorage.title);
	});
}

chrome.tabs.onActivated.addListener(function(activeInfo){
	var url = chrome.tabs.executeScript(null, {code:"document.URL"},
	function(results){
		console.log(results);
		if(results != undefined){
			localStorage.url = results;
		//alert(localStorage.url);

			var regex_valid = /www.amazon.+\/gp\/product\/\w+(\/|\?)|www.amazon.+\/*\/dp\/\w+(\/|\?)|www.flipkart.+\/*\/p\/\w+|www.snapdeal.+\/product\/\w+/g;	//regex to check whether the url is valid or not
			var n = localStorage.url.search(regex_valid);
			//alert(url);
			// search() returns -1 if the url doesnt contain the regex.
			if(n == -1){
				localStorage.valid = 0;
				//localStorage.url = "null";
			}

			else if(n != -1){
				//valid url
				localStorage.valid = 1;
				titleExtract();
			}

			//alert(localStorage.valid);
		}else{
			console.log("url is undefined");
		}
	});
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
	var url = chrome.tabs.executeScript(null, {code:"document.URL"},
	function(results){
		console.log(results);
		if(results != undefined){
			localStorage.url = results;
		//alert(localStorage.url);

			var regex_valid = /www.amazon.+\/gp\/product\/\w+(\/|\?)|www.amazon.+\/*\/dp\/\w+(\/|\?)|www.flipkart.+\/*\/p\/\w+|www.snapdeal.+\/product\/\w+/g;	//regex to check whether the url is valid or not
			var n = localStorage.url.search(regex_valid);
			//alert(url);
			// search() returns -1 if the url doesnt contain the regex.
			if(n == -1){
				localStorage.valid = 0;

				//localStorage.url = "null";
			}

			else if(n != -1){
				//valid url
				localStorage.valid = 1;
				titleExtract();
			}

			//alert(localStorage.valid);
		}else{
			console.log("url is undefined");
		}
	});
});

//execute the script when a new url is loaded in the tab or when the page is refreshed
chrome.tabs.onUpdated.addListener(function(activeInfo){
	/*chrome.tabs.executeScript(null, {file: "jquery-1.11.1.js"});
	chrome.tabs.executeScript(null, {file: "url.js"});*/
	var url = chrome.tabs.executeScript(null, {code:"document.URL"},
	function(results){
		console.log(results);
		if(results != undefined){
			localStorage.url = results;
		//alert(localStorage.url);

			var regex_valid = /www.amazon.+\/gp\/product\/\w+(\/|\?)|www.amazon.+\/*\/dp\/\w+(\/|\?)|www.flipkart.+\/*\/p\/\w+|www.snapdeal.+\/product\/\w+/g;	//regex to check whether the url is valid or not
			var n = localStorage.url.search(regex_valid);
			//alert(url);
			// search() returns -1 if the url doesnt contain the regex.
			if(n == -1){
				localStorage.valid = 0;
				//localStorage.url = "null";
			}

			else if(n != -1){
				//valid url
				localStorage.valid = 1;
				titleExtract();
			}

			//alert(localStorage.valid);
		}else{
			console.log("url is undefined");
		}
	});
});

//execute the script when a new tab is created with a url
chrome.tabs.onCreated.addListener(function(tab) {
	/*chrome.tabs.executeScript(null, {file: "jquery-1.11.1.js"});
	chrome.tabs.executeScript(null, {file: "url.js"});*/
	var url = chrome.tabs.executeScript(null, {code:"document.URL"},
	function(results){
		console.log(results);
		if(results != undefined){
			localStorage.url = results;
		//alert(localStorage.url);

			var regex_valid = /www.amazon.+\/gp\/product\/\w+(\/|\?)|www.amazon.+\/*\/dp\/\w+(\/|\?)|www.flipkart.+\/*\/p\/\w+|www.snapdeal.+\/product\/\w+/g;	//regex to check whether the url is valid or not
			var n = localStorage.url.search(regex_valid);
			//alert(url);
			// search() returns -1 if the url doesnt contain the regex.
			if(n == -1){
				localStorage.valid = 0;
				//localStorage.url = "null";
			}

			else if(n != -1){
				//valid url
				localStorage.valid = 1;
				titleExtract();
			}

			//alert(localStorage.valid);
		}else{
			console.log("url is undefined");
		}
	});
});
