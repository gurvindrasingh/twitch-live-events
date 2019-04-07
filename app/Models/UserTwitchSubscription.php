<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Auth;

class UserTwitchSubscription extends Model
{    
    use SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'twitch_id',
        'callback',
        'topic_url',
        'lease_seconds',
        'expire_time',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    
    protected $hidden = ['deleted_at','updated_at'];  

    /**
     * Subsribe to twitch events follows and streams
     *
     * @param int $twitch_id 
     * @return number $time_left on success 
     * @return boolean false on fail
     */
    public static function subscribe($twitch_id){
        try{
            //$user = App('user');
            $user = Auth::user();
            $client = new Client(); 
            $subscriptions = array_flatten(Self::select('id')->where('user_id',$user->id)->where('twitch_id',$twitch_id)->where('expire_time','>',Carbon::now())->get()->toArray());
            if(count($subscriptions)==0){
                $follows_topic_url=config('twitch.base_url_helix').'users/follows?first=1&from_id='.$twitch_id;
                $res_follows = $client->request('POST', config('twitch.base_url_helix')."webhooks/hub", [
                    'headers' => [
                          'Authorization' => 'Bearer ' . $user->access_token,
                    ],
                    'form_params' => [
                        'hub.mode' => 'subscribe',
                        'hub.topic' => $follows_topic_url,
                        'hub.callback' => route('handler.following',[$user->id]),
                        'hub.lease_seconds' => 864000
                    ]
                ]);
                if($res_follows->getStatusCode()!=202){
                    return false;
                }

                $follower_topic_url=config('twitch.base_url_helix').'users/follows?first=1&to_id='.$twitch_id;
                $res_follower = $client->request('POST', config('twitch.base_url_helix')."webhooks/hub", [
                    'headers' => [
                          'Authorization' => 'Bearer ' . $user->access_token,
                    ],
                    'form_params' => [
                        'hub.mode' => 'subscribe',
                        'hub.topic' => $follower_topic_url,
                        'hub.callback' => route('handler.follower',[$user->id]),
                        'hub.lease_seconds' => 864000
                    ]
                ]);
                if($res_follower->getStatusCode()!=202){
                    return false;
                }

                $streams_topic_url=config('twitch.base_url_helix').'streams?user_id='.$twitch_id;
                $res_streams = $client->request('POST', config('twitch.base_url_helix')."webhooks/hub", [
                    'headers' => [
                          'Authorization' => 'Bearer ' . $user->access_token,
                    ],
                    'form_params' => [
                        'hub.mode' => 'subscribe',
                        'hub.topic' => $streams_topic_url,
                        'hub.callback' => route('handler.streams',[$user->id]),
                        'hub.lease_seconds' => 864000
                    ]
                ]);
                if($res_streams->getStatusCode()!=202){
                    return false;
                }               

                $expire_sec = 863700;
                //add subscriptions
                $expire_time = Carbon::now()->addSeconds($time_left);

                //subscribe to follows
                $params_follows['user_id'] = $user->id;
                $params_follows['twitch_id'] = $twitch_id;
                $params_follows['callback'] = route('handler.following',[$user->id]);
                $params_follows['topic_url'] = $follows_topic_url;
                $params_follows['expire_time'] = $expire_time;
                $params_follows['topic'] = 'follows';
                $follows = Self::create($params_follows);
                $subscriptions[]=$follows->id;
                
                //subscribe to follows
                $params_follows['user_id'] = $user->id;
                $params_follows['twitch_id'] = $twitch_id;
                $params_follows['callback'] = route('handler.follower',[$user->id]);
                $params_follows['topic_url'] = $follower_topic_url;
                $params_follows['expire_time'] = $expire_time;
                $params_follows['topic'] = 'follows';
                $follows = Self::create($params_follows);
                $subscriptions[]=$follows->id;

                //subscribe to streams
                $params_streams['user_id'] = $user->id;
                $params_streams['twitch_id'] = $twitch_id;
                $params_streams['callback'] = route('handler.streams',[$user->id]);
                $params_streams['topic_url'] = $streams_topic_url;
                $params_streams['expire_time'] = $expire_time;
                $params_streams['topic'] = 'streams';
                $streams = Self::create($params_streams);
                $subscriptions[]=$streams->id;
                //subscribe here 
            }else{
                $time=Self::find($subscriptions[0]);
                $carbon = Carbon::now();
                $finishTime = new Carbon($time->expire_time);
                $expire_sec = $finishTime->diffInSeconds($carbon);
            }

            //unsubscribe other old subscriptions
            $other_subscriptions = Self::where('user_id',$user->id)->whereNotIn('id',$subscriptions)->get();
            if(count($other_subscriptions)>0){
                foreach ($other_subscriptions as $sk => $other_subscription){
                    $os = $client->request('POST', config('twitch.base_url_helix')."webhooks/hub", [
                        'headers' => [
                              'Authorization' => 'Bearer ' . $user->access_token,
                        ],
                        'form_params' => [
                            'hub.mode' => 'unsubscribe',
                            'hub.topic' => $other_subscription->topic_url,
                            'hub.callback' => $other_subscription->callback
                        ]
                    ]);
                    if($os->getStatusCode()!=202){
                        return false;
                    }
                    //unsubscribe here 
                    $other_subscription->delete();   
                }
            }
            $time_left = $expire_sec*1000;
            return $time_left;
        }catch(\Exception $e){
            return false;
        }
    }  
}