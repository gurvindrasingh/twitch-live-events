@extends('twitch.layouts.app')

@section('title', 'Login')

@section('content')
    @include('twitch.layouts.headerbar')
    <script type="text/javascript">
    	function eve_subscribe(ele){
    		var most_fav_id = $(ele).attr('data-id');
			var res = subscribe(most_fav_id);
			$("#most_fav_id" ).val(most_fav_id);
			$('#event-list').empty();
			$('.sidebar-nav li').removeClass( "active" );
			$(ele).addClass( "active" );
			$(".a-streamer").attr('href','streamer/'+most_fav_id);
		}
		function subscribe(twitch_id){
			$.ajax({
			    type: "POST",
			    url: "/subscribe",
			    dataType:"json",
			    data: "twitch_id="+twitch_id,
			    success: function(result) {	
			    	if(result.success==0){
			    		return '0';
			    	}else{
			    		setTimeout(function(){
					    	subscribe(twitch_id)
						},result.time);
			    		//return '1';
			    	}
			    },
			    error: function(err){
			    	return '0';
			    }
			});
		}
		function subscribe_onload(){
			var onload_twitch_id = '{{$most_fav_id}}';
			var onload_time = '{{$time_left}}'; 
			setTimeout(function(){
		    	subscribe(onload_twitch_id)
			},onload_time);	
		}
		subscribe_onload();
		function markFavourite(ele){
	    	var display_name = $(ele).attr('data-name');
	        var logo = $(ele).attr('data-logo');
	        var _id = $(ele).attr('data-id');
	        $.ajax({
			    type: "POST",
			    url: "/mark-favourite",
			    dataType:"json",
			    data: "display_name="+display_name+"&logo="+logo+"&_id="+_id,
			    success: function(result) {	
			    	if(result.success==0){
			    		alert(result.msg);
			    	}else{
			    		var html_class;
			    		if($("#most_fav_id" ).val()==0){
			    			$(".a-streamer").attr('href','streamer/'+_id);
			    			html_class = 'active';
			    			$("#most_fav_id" ).val(_id);
			    			subscribe(_id);
			    		}
			    		var html = '<li class="'+html_class+'" data-id="'+_id+'" onClick="return eve_subscribe(this);"></a> <img src="'+logo+'" alt="streamer-logo" class="img-rounded img-responsive" /> <span>'+display_name+'</span></li>';
			    		$('#sidebar-wrapper .sidebar-nav').prepend(html);
			    		$('#sidebar-wrapper .sidebar-nav span.no-streamer').empty();
			    		alert(result.msg);
			    	}
			    	$('#streamer-profile').hide();
			    	$('#streamer_name').val('');
			        $("#streamer_name").focus();
			        $("#event-wrapper, .a-streamer").css('display','block');
			    },
			    error: function(err){
			    	console.log(err);
					return false;
			    }
			});
	    }
    </script>
    <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-6">
            <form id="search-streamer-form" class="form-inline">
			  <div class="form-group mb-2">
			    <input type="text" name="streamer_name" class="form-control" id="streamer_name" placeholder="Type username...">
			  </div> 
			  &nbsp;
			  <button type="button" id="serach-streamer" class="btn btn-primary mb-2">Search</button>
			  <img src="images/loader.gif" class="loader">
			</form>          
        </div>
    </div>
    <div class="row" id="streamer-profile">
        <div class="col-xs-12 col-sm-6 col-md-6 streamer-profile-container">
            <div class="streamer-profile-wrapper">
	            <ul id="fav-search-list">
	            </ul>
	        </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-4 favourite-streamers">
        	<div class="row">
        		<div class="col-xs-12 col-sm-12 col-md-12 my-favourites">
            		<span>My Favourites</span>
            	</div>
            </div>
            <div id="sidebar-wrapper">
	            <ul class="sidebar-nav">
	                @forelse($favourites as $key=>$val)
	                <li class="{{empty($key) ? 'active' : ''}}" data-id="{{$val->twitch_id}}" onClick="return eve_subscribe(this);"><a href="#"> <img src="{{$val->logo}}" alt="streamer-logo" class="img-rounded img-responsive" /> <span>{{$val->display_name}}</span></a></li>
	                @empty
	                <span class="no-streamer">No favourite streamer</span>
	                @endforelse
	            </ul>
	        </div>
        </div>
        <div class="col-xs-12 col-sm-1 col-md-1">
            &nbsp;
        </div>
        <div class="col-xs-12 col-sm-7 col-md-7 favourite-streamer-events">
            <div class="row">
				<div class="col-xs-12 col-sm-6 col-md-6" style="
				    padding: 7px 15px;
				">
				    <span>Live Events</span>
				</div>
				<div class="col-xs-12 col-sm-6 col-md-6">
					<a href="{{(empty($most_fav_id)) ? '' : route('streamer',[$most_fav_id])}}" class="btn btn-success a-streamer" style="display: {{(empty($most_fav_id)) ? 'none' : 'block'}};">View Streamer</a>         
				</div>
			</div>
            <div id="event-wrapper" style="display: {{(empty($most_fav_id)) ? 'none' : 'block'}};">
			    <ul class="event-nav" id="event-list"></ul>
			</div>
        </div>
    </div>
    <input type="hidden" id="most_fav_id" value="{{$most_fav_id}}">
    <script src="https://js.pusher.com/3.1/pusher.min.js"></script>
	<script>
	  //instantiate a Pusher object with our Credential's key
	  var pusher = new Pusher('fab38da82af0b1189cb9', {
	      //cluster: 'eu',
	      cluster: 'ap2',
	      encrypted: true
	  });

	  //Subscribe to the channel we specified in our Laravel Event
	  //var channel = pusher.subscribe('user.{{$user->id}}');
	  var channel = pusher.subscribe('user.{{$user->id}}');

	  //Bind a function to a Event (the full Laravel class)
	  channel.bind('App\\Events\\TwitchEvent', addMessage);

	  function addMessage(data) {
	    var listItem = $("<li></li>");
	    listItem.html(data.message);
	    $('#event-list').prepend(listItem);
	  }

    	jQuery(document).ready(function($){
    		$("#serach-streamer").click(function(){
		        $('#streamer-profile').hide();
		        var search = $('#streamer_name').val();
		        if(search==''){
		        	$("#streamer_name").focus();
					return false;
		        }
		        $('#serach-streamer').hide();
		        $('.loader').show();
		        $.ajax({
				    type: "GET",
				    url: "https://api.twitch.tv/kraken/search/users?query="+search+"&limit=5",
				    headers: {
				        "Authorization":"OAuth {{$user->access_token}}"
				    },
				    success: function(result) {	
				    	$('.loader').hide();
				        $('#serach-streamer').show();
				    	if(result.users.length)
				    	{
					    	html='';
					    	$.each(result.users, function (index, value) {
								html+=`<li>
							                <img src="`+value.logo+`" alt="streamer-logo" class="img-rounded img-responsive" />
							                <span>`+value.display_name+`</span>
							                <button type="button" data-id="`+value._id+`" data-name="`+value.display_name+`" data-logo="`+value.logo+`" onClick="return markFavourite(this);" class="btn btn-success">Mark as favourite</button>
							            </li>`;
							});
							$('#fav-search-list').empty().append(html);
					    	$('#streamer-profile').show();
					    }else{
					    	alert('No uesr found with this name');
					    	$("#streamer_name").focus();
					    }
				    },
				    error: function(err){
				    	if(err.responseJSON.message != 'undefined'){
				    		alert(err.responseJSON.message);
				    	}
				    	$('#streamer_name').val('');
				        $("#streamer_name").focus();
				        $('.loader').hide();
				        $('#serach-streamer').show();
						return false;
				    }
				});
		    });
		    $('#search-streamer-form').submit(function() {
			    event.preventDefault();
			});
    	});
    </script>
@endsection