/*
	[*] - On loading the page, it checks whether the regex matches the url of the page.
		  If it does then it calss the function extractUrl() for extracting product code nd sending it to a php file
	[*] - after reviews are extracted and sentiment analysis is done, the addReview() funciton operates.
		  It will display the review to the page.
	[*] - In amazon there can be 2 kinds of product url mainly.
			(i)www.amazon.com/gp/product/<product_code>/
			(ii)www.amazon.com/<product-name>/dp/<product_code>/
		  We design the regex for checking accordingly and while extracting we take this into account.
*/
window.onload = function(){
	//sectionView();
	$("#crawl").click(crawl);
  $("#show-full").click(showFull);
	menu();

	if (localStorage.valid == "1"){
		extractUrl();

	} else {
		document.getElementsByTagName('body')[0].innerHTML = "<div style='color:#B3B3B3;font-size: 3em;position: absolute;top: 20%;text-align: center;'>Sorry, not a Product Page</div>";
	}

	function sectionView() {
		$('section.chart-sections').hide();
		var section = $('#cssmenu ul li.active').children("a").attr("href");
		$('section' + section).show();
	}

	function menu() {
		$('.menu .item').click(function(){
		    $('.menu .item').removeClass("active");
		    $(this).addClass("active");
		    //sectionView();
		});
	}

	//to display summary
	function addSummary(summary) {
		console.log(summary);
		var bushy_neg = summary['bushy']['negative'];
		var bushy_pos = summary['bushy']['positive'];

    var pagerank_neg = summary['google_page_rank']['negative'];
    var pagerank_pos = summary['google_page_rank']['positive'];

		$('#negSumm').html(bushy_neg);
		$('#goodSumm').html(bushy_pos);
    $('#negSumm-full').html(pagerank_neg);
    $('#goodSumm-full').html(pagerank_pos);
	}

  function showFull() {
    $('#whole-content').toggle();
  }


	//to display the review
	function addReview(data1) {
		console.log(data1);
		addPieChart(data1);
		/*(addScatter(data2);
		addLineChart(data3);
		addBarChart(data4);*/

	}

	//Create product review url and send it for review scraping and sentiment analysis.
	function getProductReviewUrl() {

		var url = localStorage.url;
		var amazon_replacing_regex = /\/dp\/|\/product\//g;		//product code extracting regex
		var flipkart_replacing_regex = /\/p\//g;
		var snapdeal_replacing_regex = /\/dp\/|\/product\/|\/p\//g;
		var review_url = "";
		if (url.includes('amazon')) {
			$('.menu .item').removeClass("active");
			$($('menu .item')[0]).addClass('active');
			review_url = url.replace(amazon_replacing_regex, '/product-reviews/');
		} else if (url.includes('flipkart')) {
			$('.menu .item').removeClass("active");
			$($('menu .item')[1]).addClass('active');
			review_url = url.replace(flipkart_replacing_regex, '/product-reviews/');
			review_url += "&type=all";
		} else if (url.includes('snapdeal')) {
			$('.menu .item').removeClass("active");
			$($('menu .item')[2]).addClass('active');
			review_url += "/reviews";
		}

		$('div.loading img').css("display", "none");
		//alert(review_url);

		return review_url;
	}

	//extract product code and send it for review scraping and sentiment analysis.
	function extractUrl() {
		var url = localStorage.url;
		var extracting_regex = /\/dp\/\w+\/|\/product\/\w+(\/|\?)/g;		//product code extracting regex
		var match = url.match(extracting_regex);					//match extracts the string which matches the regex from the url.
		match = ""+match;
		var pCode = "";

		/*if the extracted string has "product" then the beginning index of the product code in the string match is 9.
		else if it contains "dp" then the beginning index of the product code in the string match is 2.*/
		if(match.match(/product/g)) {
			pCode = match.slice(9, match.length-1);
		} else if(match.match(/dp/g)) {
			pCode = match.slice(4, match.length-1);
		}

		//alert(pCode);
	    match_ = url.match(/http:\/\/www.\w+.\w+/g)[0];
	    var website = match_.slice(11);

		$(document).ajaxStart(function() {
			$('div#contentShow').css("display", "none");
			$('div.loading img').css("display", "block");
		});
		$(document).ajaxComplete(function() {
			$('div.loading img').css("display", "none");
			$('div#contentShow').css("display", "block");
		});

		// The flask server
		var SERVER = "http://172.17.16.216:5001/home";


		//here we put the code to send the product code to driverphp to extract review and do sentiment analysis.
		var data = {
		    'product_id':   pCode,
		    'url':          url,
		    'website': website,
        'email': 'vivekanand1101@gmail.com'
		}

		// The transfer of data from the plugin to the server
		var posting = $.ajax({
		                    type:   "POST",
		                    url:    SERVER,
		                    data:   JSON.stringify(data, null, '\t'),
		                    contentType:    'application/json;charset=UTF-8',
		});

		// Put the results in a div
		posting.done(function(result) {
			var data1 = [];
			var counts = result['counts'];
			for (count in counts) {
				var data = {};
				data['y'] = parseInt(counts[count]);
				data['indexLabel'] = count;
				data1.push(data);
			}
			//addReview(data1);
      console.log("status: " + result['status']);
      if (result['status'] === false) {
        console.log("Some error occured");
      } else if (result['status'] === true) {
        console.log("Email will be sent later");
      } else {
			  addSummary(result['summary']);
      }
			//alert("hello");
			console.log("done");
			//alert("Sentiment: " + result['sentiment'] + "\nScore: " + result['sentiment_score']);
			console.log(result);
			var data1 = result['counts'];
		});

	}

	function crawl() {
		console.log(localStorage.title.trim());
    $('div#contentShow').css("display", "none");
    $('div.loading img').css("display", "block");
    var data = {
        'product_name':   localStorage.title.trim()
    }

    var posting = $.ajax({
                        type:   "POST",
                        url:    "http://127.0.0.1:5000/crawl/",
                        data:   JSON.stringify(data, null, '\t'),
                        contentType:    'application/json;charset=UTF-8',
    });

    posting.done(function(result) {
      console.log(result);
      $('div#contentShow').css("display", "block");
      $('div.loading img').css("display", "none");
      $('#crawl-link').show();
    });
	}
}
