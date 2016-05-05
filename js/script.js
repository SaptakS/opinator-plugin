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
		var pagerank_neg = "<a href='" + summary['google_page_rank']['negative'] + "' target='_blank'>Read Entire Summary</a>";
		var pagerank_pos = "<a href='" + summary['google_page_rank']['positive'] + "' target='_blank'>Read Entire Summary</a>";
		
		$('#negSumm').append(bushy_neg);
		$('#negSumm').append(pagerank_neg);
		$('#posSumm').append(bushy_pos);
		$('#posSumm').append(pagerank_pos);
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

	function getSummary(product_review_url) {
		$(document).ajaxStart(function() {
			$('div#contentShow').css("display", "none");
			$('div.loading img').css("display", "block");
		});
		$(document).ajaxComplete(function() {
			$('div.loading img').css("display", "none");
			$('div#contentShow').css("display", "block");
		});

/*		//Sample Code to make the extension work. Can be used for front end testing
		var datapoints1 = [
	        {  y: 8, indexLabel: "Excellent" },
	        {  y: 42, indexLabel: "Good" },
	        {  y: 10, indexLabel: "Neutral" },
	        {  y: 35, indexLabel: "Bad"},
	        {  y: 5, indexLabel: "Very Bad" }
	      ];

		     var datapoints2 = [

		     { x: 1, y: 2 },
		     { x: 2, y: 0},
		     { x: 3, y: 1},
		     { x: 4, y: 1},

		     { x: 5, y: 1},
		     { x: 6, y: 0},
		     { x: 7, y: -1},
		     { x: 8, y: 1},
		     { x: 9, y: -1},
		     { x: 10, y: -2}


			];

		var datapoints3 = [
        { x: new Date(2012, 00, 1), y: 1.8 },
        { x: new Date(2012, 01, 1), y: 1.9},
        { x: new Date(2012, 02, 1), y: 2, indexLabel: "highest",markerColor: "red", markerType: "triangle"},
        { x: new Date(2012, 03, 1), y: 1.98 },
        { x: new Date(2012, 04, 1), y: 1.77 },
        { x: new Date(2012, 05, 1), y: 1.5 },
        { x: new Date(2012, 06, 1), y: 1 },
        { x: new Date(2012, 07, 1), y: 0.3 },
        { x: new Date(2012, 08, 1), y: -0.3 , indexLabel: "lowest",markerColor: "DarkSlateGrey", markerType: "cross"},
        { x: new Date(2012, 09, 1), y: 0.87 },
        { x: new Date(2012, 10, 1), y: 1.1 },
        { x: new Date(2012, 11, 1), y: 1.2 }
        ];

        var datapoints4 = [
      {
        type: "bar",
        showInLegend: true,
        legendText: "Good",
        color: "green",
        dataPoints: [
        { y: 198, label: "Feature1"},
        { y: 201, label: "Feature2"},
        { y: 202, label: "Feature3"},
        { y: 236, label: "Feature4"},
        { y: 395, label: "Feature5"},
        { y: 957, label: "Feature6"}
        ]
      },
      {
        type: "bar",
        showInLegend: true,
        legendText: "Neutral",
        color: "yellow",
        dataPoints: [
        { y: 19, label: "Feature1"},
        { y: 20, label: "Feature2"},
        { y: 200, label: "Feature3"},
        { y: 436, label: "Feature4"},
        { y: 195, label: "Feature5"},
        { y: 95, label: "Feature6"}
        ]
      },
      {
        type: "bar",
        showInLegend: true,
        legendText: "Bad",
        color: "red",
        dataPoints: [
        { y: 1, label: "Feature1"},
        { y: 21, label: "Feature2"},
        { y: 22, label: "Feature3"},
        { y: 23, label: "Feature4"},
        { y: 390, label: "Feature5"},
        { y: 9, label: "Feature6"}
        ]
      }
      ];

		addReview(datapoints1, datapoints2, datapoints3, datapoints4);
		var summary = {
					bushy: {
							negative: "This is the short summary for negative reviews",
							positive: "This is the short summary for positive reviews"
						},
					google_page_rank: {
							negative: "abcd",
							positive: "abcd",
						}
				};

		var counts = {
					negative: "91",
					neutral: "77",
					positive: "137",
					very_negative: "2",
					very_positive: "3"
				};
		var data1 = [];
		for (count in counts) {
			var data = {};
			data['y'] = parseInt(counts[count]);
			data['indexLabel'] = count;
			data1.push(data);
		}
		addReview(data1);
		addSummary(summary);*/


		// The flask server
		/*var SERVER = "http://172.19.15.248:5001/";

		//here we put the code to send the product code to driverphp to extract review and do sentiment analysis.
		var data = {
		    'product_id':   pCode,
		    'url':          url,
		    'website_name': 'amazonIN',
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
			addReview(data1);
			addSummary(result['summary']);
			alert("hello");
			console.log("done");
			//alert("Sentiment: " + result['sentiment'] + "\nScore: " + result['sentiment_score']);
			console.log(result);
			var data1 = result['counts'];
		});*/

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

/*		//Sample Code to make the extension work. Can be used for front end testing
		var datapoints1 = [
	        {  y: 8, indexLabel: "Excellent" },
	        {  y: 42, indexLabel: "Good" },
	        {  y: 10, indexLabel: "Neutral" },
	        {  y: 35, indexLabel: "Bad"},
	        {  y: 5, indexLabel: "Very Bad" }
	      ];

		     var datapoints2 = [

		     { x: 1, y: 2 },
		     { x: 2, y: 0},
		     { x: 3, y: 1},
		     { x: 4, y: 1},

		     { x: 5, y: 1},
		     { x: 6, y: 0},
		     { x: 7, y: -1},
		     { x: 8, y: 1},
		     { x: 9, y: -1},
		     { x: 10, y: -2}


			];

		var datapoints3 = [
        { x: new Date(2012, 00, 1), y: 1.8 },
        { x: new Date(2012, 01, 1), y: 1.9},
        { x: new Date(2012, 02, 1), y: 2, indexLabel: "highest",markerColor: "red", markerType: "triangle"},
        { x: new Date(2012, 03, 1), y: 1.98 },
        { x: new Date(2012, 04, 1), y: 1.77 },
        { x: new Date(2012, 05, 1), y: 1.5 },
        { x: new Date(2012, 06, 1), y: 1 },
        { x: new Date(2012, 07, 1), y: 0.3 },
        { x: new Date(2012, 08, 1), y: -0.3 , indexLabel: "lowest",markerColor: "DarkSlateGrey", markerType: "cross"},
        { x: new Date(2012, 09, 1), y: 0.87 },
        { x: new Date(2012, 10, 1), y: 1.1 },
        { x: new Date(2012, 11, 1), y: 1.2 }
        ];

        var datapoints4 = [
      {
        type: "bar",
        showInLegend: true,
        legendText: "Good",
        color: "green",
        dataPoints: [
        { y: 198, label: "Feature1"},
        { y: 201, label: "Feature2"},
        { y: 202, label: "Feature3"},
        { y: 236, label: "Feature4"},
        { y: 395, label: "Feature5"},
        { y: 957, label: "Feature6"}
        ]
      },
      {
        type: "bar",
        showInLegend: true,
        legendText: "Neutral",
        color: "yellow",
        dataPoints: [
        { y: 19, label: "Feature1"},
        { y: 20, label: "Feature2"},
        { y: 200, label: "Feature3"},
        { y: 436, label: "Feature4"},
        { y: 195, label: "Feature5"},
        { y: 95, label: "Feature6"}
        ]
      },
      {
        type: "bar",
        showInLegend: true,
        legendText: "Bad",
        color: "red",
        dataPoints: [
        { y: 1, label: "Feature1"},
        { y: 21, label: "Feature2"},
        { y: 22, label: "Feature3"},
        { y: 23, label: "Feature4"},
        { y: 390, label: "Feature5"},
        { y: 9, label: "Feature6"}
        ]
      }
      ];

		addReview(datapoints1, datapoints2, datapoints3, datapoints4);
		var summary = {
					bushy: {
							negative: "This is the short summary for negative reviews",
							positive: "This is the short summary for positive reviews"
						},
					google_page_rank: {
							negative: "abcd",
							positive: "abcd",
						}
				};

		var counts = {
					negative: "91",
					neutral: "77",
					positive: "137",
					very_negative: "2",
					very_positive: "3"
				};
		var data1 = [];
		for (count in counts) {
			var data = {};
			data['y'] = parseInt(counts[count]);
			data['indexLabel'] = count;
			data1.push(data);
		}
		addReview(data1);
		addSummary(summary);*/


		/*// The flask server
		var SERVER = "<host:port>";

		//here we put the code to send the product code to driverphp to extract review and do sentiment analysis.
		var data = {
		    'product_id':   pCode,
		    'url':          url,
		    'website_name': website,
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
			addReview(data1);
			addSummary(result['summary']);
			alert("hello");
			console.log("done");
			alert("Sentiment: " + result['sentiment'] + "\nScore: " + result['sentiment_score']);
			console.log(result);
			var data1 = result['counts'];
		});*/

	}

	function crawl() {
		console.log(localStorage.title);
	}
}
