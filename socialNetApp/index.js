var appId="sampleapp";
var appKey="tRtzAk6/M8onYrZEc2RTqg==";
var obj;
var noticeCount = 0;

//Initializing CloudBoost App
CB.CloudApp.init(appId,appKey);


$(document).ready(function() {
	//CloudBoost RealTime
		CB.CloudObject.on('feed','created',function(cloudObj){
			//getting realtime feeds
			$("#feed").prepend("<div class='panel panel-default'><div class='panel-body'><div class='col-md-1 col-sm-2 col-xs-3'><img src='image/profile.png' class='img-responsive img-circle'/></div><div><strong>"+cloudObj.get('name')+"</strong><br/>"+cloudObj.get('post')+"</div></div></div>");
			noticeCount = noticeCount + 1;
			$("#count").text(noticeCount);
			$("#noticeBar").empty().append("Your friend shared a post");
		},
		{
			success : function(){
				console.log("CloudObject.on executed");

			},
			error : function(err){
				console.log("error in CloudObect.on");
			}
		});

		//creating an object for 'feed'
		obj = new CB.CloudObject("feed");

		obj.isSearchable = true;

		//creating an object for querying 'feed' data
		var query = new CB.CloudQuery("feed");
		query.orderByDesc('createdAt');
		query.setLimit(70);
		query.find({
			//query will return a list of CloudObjects.
			success: function(list){
				//extracting and appending data into html page from list of CloudObjects
				for (i = 0; i < list.length; i++) {
					$("#feed").append("<div class='panel panel-default'><div class='panel-body' style=''><div class='col-md-1 col-sm-2 col-xs-3'><img src='image/profile.png' class='img-responsive img-circle'/></div><div><strong>"+list[i].get('name')+"</strong><br/>"+list[i].get('post')+"</div></div></div>");
				}
			},
			error: function(err){
				console.log("unable to fetch data");
			}
		});
});

$("#noticeicon").click(function() {
	$("$count").empty();
});

//post to feed
$("#postForm").submit(function() {
	obj.set("name", $("#name").val());
	obj.set("post",$("#text").val());
	//saving post
	obj.save({
		success: function(obj) {
			console.log('posted to sample app');
		},
		error: function(err) {
			console.log("oops!! a problem occured while posting.. please try again.");
		}
	});
	return false;
});

//CloudSearch Search
$("#searchForm").submit(function(){
	var searchObj = new CB.CloudSearch('feed');
	searchObj.searchQuery = new CB.SearchQuery();
	searchObj.searchQuery.searchOn('post', $('#search').val());
	searchObj.search({
		success: function(list){
			$("#feed").empty();
			if(list.length > 0){
				for (i = 0; i < list.length; i++) {
					$("#feed").append("<div class='panel panel-default'><div class='panel-body'><div class='col-md-1 col-sm-2 col-xs-3'><img src='image/profile.png' class='img-responsive img-circle'/></div><div><strong>"+list[i].get('name')+"</strong><br/>"+list[i].get('post')+"</div></div></div>");
				}
			} else{
				$("#feed").append("<div class='panel panel-default'><div class='panel-body'><strong>No Match Found</strong></div></div>");
			}
		},
		error: function(err){

		}
	});
	return false;
});
