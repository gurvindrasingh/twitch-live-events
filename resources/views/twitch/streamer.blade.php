@extends('twitch.layouts.app')

@section('title', 'Login')

@section('content')
    @include('twitch.layouts.headerbar')
    <script type="text/javascript">
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
			    	}
			    },
			    error: function(err){
			    	return '0';
			    }
			});
		}
		function subscribe_onload(){
			var onload_twitch_id = '{{$streamer->twitch_id}}';
			var onload_time = '{{$time_left}}'; 
			setTimeout(function(){
		    	subscribe(onload_twitch_id)
			},onload_time);	
		}
		subscribe_onload()
    </script>
    <div class="row">
    	<div class="col-xs-12 col-sm-12 col-md-12">
    		<img src="{{$streamer->logo}}" alt="streamer-logo" class="img-rounded img-responsive" style="width: 48px;" />
    		<p>{{$streamer->display_name}}</p>
    	</div>
    </div>
    <div class="row streamer-container">
        <div class="col-xs-12 col-sm-3 col-md-3 streamer-events">
        	<div id="event-wrapper-inside">
			    <p>Live Events</p>
			    <ul class="event-nav" id="event-list">
			    </ul>
			</div>
        </div>
        <div class="col-xs-12 col-sm-5 col-md-5">
        	<iframe
			    src="https://player.twitch.tv/?channel={{$streamer->display_name}}"
			    height="400"
			    width="450"
			    frameborder="0"
			    scrolling="no"
			    allowfullscreen="true">
			</iframe>
        </div>        
        <div class="col-xs-12 col-sm-4 col-md-4">
            <iframe frameborder="0"
		        scrolling="no"
		        id="{{$streamer->display_name}}"
		        src="https://www.twitch.tv/embed/{{$streamer->display_name}}/chat"
		        height="400"
		        width="350">
		    </iframe>
        </div>
    </div>
    <script src="https://js.pusher.com/3.1/pusher.min.js"></script>
    <script type="text/javascript">
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
		    var size = $('#event-list li').length;
		    if(size>9){
		    	$('#event-list li').last().remove();
		    }
		    var listItem = $("<li></li>");
		    listItem.html(data.message);
		    $('#event-list').prepend(listItem);
		  }
	</script>
@endsection