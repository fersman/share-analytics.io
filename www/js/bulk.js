$(document).ready(function(){
	var isFetched = true;
	$( "#bulkForm" ).submit(function( e ) {
		e.preventDefault();
		var $form = $( this );
		url = "https://t4fzdgrbyi.execute-api.eu-west-1.amazonaws.com/prod/bulk-mass";
		urls = $form.find( "#urls" ).val();

		$.ajax({
			url: url,
			method: "POST",
			data: urls,
			contentType: "application/json",
			dataType: "json"
		}).done(function(data) {
			if(!isFetched)return;
			isFetched = false;

			var i = 0;
			$.each(data, function( url, value ) {
				if(url == undefined || value == undefined)return;
				if(i == 200)return;
				$("#results").append("<li>\
						<div class=\"row\">\
								<div class=\"col md-12\">\
								<h2><a href=\"" + url + "\">"+ url +"</a></h2\>\
						</div>\
						</div>\
						<div class=\"row\">\
								<div class=\"col-md-3 facebook\">\
								<span>Facebook likes</span>\
						<h3><i class=\"fa fa-icon fa-facebook-official\"></i> <span id=\"facebook"+i+"\"></span></h3>\
						</div>\
						<div class=\"col-md-3 twitter\">\
								<span>Twitter tweets</span>\
						<h3><i class=\"fa fa-icon fa-twitter\"></i> <span id=\"twitter"+i+"\"></span></h3>\
						</div>\
						<div class=\"col-md-3 google\">\
								<span>Google +1</span>\
								<h3><i class=\"fa fa-icon fa-google-plus\"></i> <span id=\"google"+i+"\"></span></h3>\
						</div>\
						<div class=\"col-md-3 linkedin\">\
								<span>LinkedIn shares</span>\
						<h3><i class=\"fa fa-icon fa-linkedin-square\"></i> <span id=\"linkedin"+i+"\"></span></h3>\
						</div>\
						</div>\
						</li>\
						");

				if(value['facebook-shares'] == undefined)value['facebook-shares'] = 0;
				if(value['twitter'] == undefined)value['twitter'] = 0;
				if(value['linkedin'] == undefined)value['linkedin'] = 0;
				if(value['googleplus'] == undefined)value['googleplus'] = 0;
				console.log(value['facebook-shares']);

				var facebook_min = parseInt(value['facebook-shares']) - 200 > 0 ? parseInt(value['facebook-shares']) - 200 : 0;
				animateValue("facebook"+i, facebook_min, value['facebook-shares'], 1000);

				var twitter_min = parseInt(value['twitter']) - 200 > 0 ? parseInt(value['twitter'])-200 : 0;
				animateValue("twitter"+i,twitter_min, value['twitter'], 1000);

				var linkedin_min = parseInt(value['linkedin']) - 200 > 0 ? parseInt(value['linkedin'])-200 : 0;
				animateValue("linkedin"+i,linkedin_min, value['linkedin'], 1000);

				if(value['googleplus'] == -1) {
					$('#google'+i).innerHTML = "Moc";
				}
				else {
					var google_min = parseInt(value['googleplus']) - 200 > 0 ? parseInt(value['googleplus']) - 200 : 0;
					animateValue("google"+i, google_min, value['googleplus'], 1000);
				}
				i++;
			});

			$("#results" ).css("display","block");
			$( "#content" ).css("display","none");
			$("#container").removeClass("stars");
			$("body").addClass("results");
			$("head").prepend("<link rel=\"stylesheet\" type=\"text/css\" href=\"css/bootstrap.min.css\" />");
		});

	});
});
