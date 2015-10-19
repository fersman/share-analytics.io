$(document).ready(function(){
	var url = location.search.split('url=')[1];

	$.ajax({
		url: "https://t4fzdgrbyi.execute-api.eu-west-1.amazonaws.com/prod?url=" + url,
		contentType: "application/json",
		success : function(data) {
			if(data['facebook-shares'] == undefined)data['facebook-shares'] = 0;
			if(data['twitter'] == undefined)data['twitter'] = 0;
			if(data['linkedin'] == undefined)data['linkedin'] = 0;
			if(data['googleplus'] == undefined)data['googleplus'] = 0;

			var facebook_min = parseInt(data['facebook-shares']) - 200 > 0 ? parseInt(data['facebook-shares']) - 200 : 0;
			animateValue("facebook", facebook_min, data['facebook-shares'], 1000);

			var twitter_min = parseInt(data['twitter']) - 200 > 0 ? parseInt(data['twitter'])-200 : 0;
			animateValue("twitter",twitter_min, data['twitter'], 1000);

			var linkedin_min = parseInt(data['linkedin']) - 200 > 0 ? parseInt(data['linkedin'])-200 : 0;
			animateValue("linkedin",linkedin_min, data['linkedin'], 1000);

			if(data['googleplus'] == -1) {
				$('#google').innerHTML = "Moc";
			}
			else {
				var google_min = parseInt(data['googleplus']) - 200 > 0 ? parseInt(data['googleplus']) - 200 : 0;
				animateValue("google", google_min, data['googleplus'], 1000);
			}
			var array = {
				"facebook-comments": [],
				"facebook-shares": [],
				"googleplus": [],
				"linkedin": [],
				"twitter": []
			};

			var i = 0;
			$.each(data['graph_data'], function (key,value) {
				if(value['facebook-shares'] != undefined && value['facebook-shares'] != 0)array['facebook-shares'].push(value['facebook-shares']);
				if(value['googleplus'] != undefined && value['googleplus'] != 0)array['googleplus'].push(value['googleplus']);
				if(value['linkedin'] != undefined && value['linkedin'] != 0)array['linkedin'].push(value['linkedin']);
				if(value['twitter'] != undefined && value['twitter'] != 0)array['twitter'].push(value['twitter']);
			});

			var fb_shares = [];

			for (var i = 1; i <= array['facebook-shares'].length; i++) {
				fb_shares.push(i);
			}

			var lineChartData = {
				labels : fb_shares,
				datasets : [
					{
						label: "Facebook shares",
						fillColor: "rgba(59, 89, 152,0.2)",
						strokeColor: "rgba(59, 89, 152,1)",
						pointColor : "rgba(59, 89, 152,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(220,220,220,1)",
						data : array['facebook-shares']
					},
					{
						label: "Google+ shares",
						fillColor : "rgba(211, 72, 54,0.2)",
						strokeColor : "rgba(211, 72, 54,1)",
						pointColor : "rgba(211, 72, 54,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(220,220,220,1)",
						data : array['googleplus']
					},
					{
						label: "Linkedin",
						fillColor: "rgba(0, 123, 181,0.2)",
						strokeColor: "rgba(0, 123, 181,1)",
						pointColor: "rgba(0, 123, 181,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: array['linkedin']
					},
					{
						label: "Twitter",
						fillColor : "rgba(0, 172, 237,0.2)",
						strokeColor : "rgba(0, 172, 237,1)",
						pointColor : "rgba(0, 172, 237,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(220,220,220,1)",
						data : array['twitter']
					}
				]

			};

			var ctx = document.getElementById("canvas").getContext("2d");
			window.myLine = new Chart(ctx).Line(lineChartData, {
				responsive: true
			});

		},
		error : function(error) {

		}
	})
});
