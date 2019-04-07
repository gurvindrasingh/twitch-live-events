<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TwitchTv;
use App\Models\User;
use App\Models\Favourite;
use App\Models\UserTwitchSubscription;
use Validator;
use Carbon\Carbon;
use Auth;
class UserController extends Controller
{
    /**
     * To login
     *
     * @param object $request
     * @var object $obj
     * @var string $url
     * @return view login
     */
    public function login(Request $request){
        $obj = new TwitchTv;
        $url = $obj::authenticate();
        //return view
        return view('twitch.login',['url'=>$url]);
    }

    /**
     * Logged
     *
     * @param object $request
     * @return view on succes, Http redirect login on failed
     */
    public function logged(Request $request){
        $params = $request->all();
        if(isset($params['code'])){
            $obj = new TwitchTv;
            $access_token = $obj::access_token($params['code']);
            if(!$access_token['status']){
                //redirect to error page
                return redirect(route('login'));
            }
            $token = $access_token['response']['access_token'];
            $authenticate_user = $obj::authenticate_user($token);
            if(!$authenticate_user['status']){
                //redirect to error page
                return redirect(route('login'));
            }
            if(isset($authenticate_user['response']['token']['error'])) {
                //return 'Unauthorized';
                //redirect to error page
                return redirect(route('login'));                
            }
            $authenticated_user = $obj::authenticated_user($token);
            if(!$authenticate_user['status']){
                //redirect to error page
                return redirect(route('login'));
            }
            $user=User::where('twitch_id',$authenticated_user['response']['_id'])->first();
            if($user){
                $user->display_name = $authenticated_user['response']['display_name'];
                $user->name = $authenticated_user['response']['name'];
                $user->type = $authenticated_user['response']['type'];
                $user->logo = $authenticated_user['response']['logo'];
                $user->email = $authenticated_user['response']['email'];
                $user->access_token = $token;
                $user->update();
                $user_id=$user->id;
            }else{
                $input['twitch_id'] = $authenticated_user['response']['_id'];
                $input['display_name'] = $authenticated_user['response']['display_name'];
                $input['name'] = $authenticated_user['response']['name'];
                $input['type'] = $authenticated_user['response']['type'];
                $input['logo'] = $authenticated_user['response']['logo'];
                $input['email'] = $authenticated_user['response']['email'];
                $input['access_token'] = $token;
                $create = User::create($input);
                $user_id=$create->id;
            }
            //autheticate with id
            Auth::loginUsingId($user_id);
            //redirect to home
            return redirect(route('home'));
        }else{
            //return 'Unauthorized';
            //redirect to error page
            return redirect(route('login'));    
        }
    }

    /**
     * To logout
     *
     * @return Http redirect login
     */
    public function logout(){
        //remove session
        Auth::logout();
        //redirect to login
        return redirect()->route('login');
    }

    /**
     * Mark Favourite
     *
     * @param object $request
     * @return Http 200
     */
    public function markFavourite(Request $request){
        //user instance
        //$user = App('user');
        $user = Auth::user();
        $params = $request->all();
        //define the rules of validation
        $rules = array(
                '_id' => 'required',
                'display_name' => 'required',
                'logo' => 'required'
        );
        //validate params
        $validation = Validator::make($params,$rules);
        if($validation->fails()){
            return response()->json(array('success'=>0,'msg'=>$validation->getMessageBag()->first()), 400);
        }
        $favourite = Favourite::where('user_id',$user->id)->where('twitch_id',$params['_id'])->count();
        if($favourite){
            return response()->json(array('success'=>0,'msg'=>'Already in favourite list'), 200);
        }
        $params['user_id'] = $user->id;
        $params['twitch_id'] = $params['_id'];
        $fav=Favourite::create($params);
        if($fav){
            return response()->json(array('success'=>1,'msg'=>'Added to favourite list'), 200);
        }else{
            return response()->json(array('success'=>0,'msg'=>'Failed to add in favourite list'), 200);
        }
    }

    /**
     * Home
     *
     * @param object $request
     * @var object $user
     * @var object $favourites
     * @var int $most_fav_id
     * @var string $time_left
     * @return home view
     */
    public function home(Request $request){
        $user = Auth::user();
        $favourites = Favourite::where('user_id',$user->id)
                                ->orderBy('created_at','desc')
                                ->get();
        $most_fav_id=0;
        $time_left=0;
        if(isset($favourites[0])){
            $most_fav_id = $favourites[0]->twitch_id;
            $time_left = UserTwitchSubscription::subscribe($most_fav_id);
        }
        
        //return view
        return view('twitch.home',compact('favourites','most_fav_id','time_left'));
    }

    /**
     * subscribe
     *
     * @param object $request
     * @var object $favourite
     * @var string $time_left
     * @return Http 200
     */
    public function subscribe(Request $request){
        $params = $request->all();
        //define the rules of validation
        $rules = array(
                'twitch_id' => 'required'
        );
        //validate params
        $validation = Validator::make($params,$rules);
        if($validation->fails()){
            return response()->json(array('success'=>0,'msg'=>$validation->getMessageBag()->first()), 400);
        }
        $favourite = Favourite::where('twitch_id',$params['twitch_id'])->count();
        if(!$favourite){
            return response()->json(array('success'=>0,'msg'=>'This user is not in your favourite list'), 200);
        }
        $time_left = UserTwitchSubscription::subscribe($params['twitch_id']);
        if($time_left){
            return response()->json(array('success'=>1,'msg'=>'Subscribed','time'=>$time_left), 200);
        }else{
            return response()->json(array('success'=>0,'msg'=>'Failed to subscribe'), 200);
        }
    }

    /**
     * Steamer
     *
     * @param int $id
     * @var object $streamer
     * @var string $time_left
     * @return streamer view
     */
    public function streamer($id){
        $streamer = Favourite::where('twitch_id',$id)->first();
        $time_left = UserTwitchSubscription::subscribe($id);
        //return view
        return view('twitch.streamer',compact('streamer','time_left'));
    }
}
