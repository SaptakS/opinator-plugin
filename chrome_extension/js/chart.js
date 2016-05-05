

function addPieChart(datapoints) {
  
	var piechart = new CanvasJS.Chart("pieChartContainer",
	{
		theme: "theme2",
		title:{
			text: "Pie Chart Of Product Sentiments"
		},		
		data: [
		{       
			type: "pie",
			showInLegend: true,
			toolTipContent: "#percent %",
			legendText: "#percent % reviewers had {indexLabel} opinion",
			dataPoints: datapoints
		}
		]
	});

  piechart.render();
}

function addScatter(datapoints) {
	var scatterchart = new CanvasJS.Chart("scatterChartContainer",
	{
		theme: "theme2",
		title:{
			text: "Scatter Graph of Reviews According to Sentiment Values"
		},
		axisX:{
	      title: "Reviews",
	      minimum: 0,
	      maximum: 15
	    },
	    axisY:{
	      title: "Sentiment Values",
	      minimum: -3,
	      maximum: 3
	    },		
		data: [
		{       
			type: "scatter",
		    color: "#778899",
		    showInLegend: "true",
		    markerType: "cross",
		    markerSize: 7,
		    dataPoints: datapoints
		}
		]
	});

  scatterchart.render();
  
}

function addLineChart(datapoints) {
	var linechart = new CanvasJS.Chart("lineChartContainer",
	{

      title:{
      	text: "Variation in Review over Time"
      },
      axisX: {
      	title: "Year 2015",
        valueFormatString: "MMM",
        interval:1,
        intervalType: "month"
      },
      axisY:{
      	title: "Sentiment Value",
      	minimum: -3,
      	maximum: 3,
        includeZero: false

      },
      data: [
      {
        type: "line",

        dataPoints: datapoints
      }
      ]
    });
  linechart.render();
}

function addBarChart(datapoints) {
	var barchart = new CanvasJS.Chart("barChartContainer",
	{
      title:{
        text: "Featuristic Analysis"
      },
      axisY: {
        title: "Number of Reviews",
        maximum: 1000
      },
      data: datapoints
    });

  barchart.render();
}
	
	
	
