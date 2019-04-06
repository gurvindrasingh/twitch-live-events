<div class="row">
    <div class="col-lg-12 headerbar">
        <div class="row">
	        <div class="col-xs-12 col-sm-6 col-md-6">
	        	<a href="{{route('home')}}" class="btn btn-primary home-btn">Home</a>             
	        </div>
	        
	        <div class="col-xs-12 col-sm-6 col-md-6">
	            <div class="dropdown stream-dropdown">
				  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				    <img src="{{$user->logo}}"> {{$user->display_name ?? $user->name}}
				  </button>
				  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
				    <a class="dropdown-item" href="{{route('logout')}}">Logout</a>
				  </div>
				</div>         
	        </div>
	    </div>
    </div>
</div>