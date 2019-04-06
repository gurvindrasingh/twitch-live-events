<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\TwitchEvent;
use Carbon\Carbon;
class EventHandlerController extends Controller
{
    /**
     * To Handle Following Twitch Event
     *
     * @param object $request and user id
     * @return http 200
     */
    public function following(Request $request,$id){
        $params = $request->all();
        if ($request->isMethod('post')) {
            if(isset($params['data'][0])){
                $data['message'] = $params['data'][0]['from_name'].' started following '.$params['data'][0]['to_name'];
            }else{
                $data['message'] = '';
            }
            $data['id'] = $id;            
            event(new \App\Events\TwitchEvent($data));
        }else{            
            $hub_mode = $params['hub_mode'] ?? NULL;
            switch ($hub_mode) {
                case 'subscribe':
                    $tk = $params['hub_challenge'] ?? NULL;
                    //return response
                    return response($tk, 200)->header('Content-Type', 'text/plain');
                    break;
                
                case 'unsubscribe':
                    $tk = $params['hub_challenge'] ?? NULL;
                    //return response
                    return response($tk, 200)->header('Content-Type', 'text/plain');
                    break;
                
                case 'denied':
                    //return response
                    return response('200 OK', 200)->header('Content-Type', 'text/plain');
                    break;
                
                default:
                    break;
            }
        }
    }

    /**
     * To Handle Follower Twitch Event
     *
     * @param object $request and user id
     * @return http 200
     */
    public function follower(Request $request,$id){
        $params = $request->all();
        if ($request->isMethod('post')) {
            if(isset($params['data'][0])){
                $data['message'] = $params['data'][0]['from_name'].' started following '.$params['data'][0]['to_name'];
            }else{
                $data['message'] = '';
            }
            $data['id'] = $id;  
            event(new \App\Events\TwitchEvent($data));
        }else{            
            $hub_mode = $params['hub_mode'] ?? NULL;
            switch ($hub_mode) {
                case 'subscribe':
                    $tk = $params['hub_challenge'] ?? NULL;
                    //return response
                    return response($tk, 200)->header('Content-Type', 'text/plain');
                    break;
                
                case 'unsubscribe':
                    $tk = $params['hub_challenge'] ?? NULL;
                    //return response
                    return response($tk, 200)->header('Content-Type', 'text/plain');
                    break;
                
                case 'denied':
                    //return response
                    return response('200 OK', 200)->header('Content-Type', 'text/plain');
                    break;
                
                default:
                    break;
            }
        }
    }

    /**
     * To Handle Streams Twitch Event
     *
     * @param object $request and user id
     * @return http 200
     */
    public function streams(Request $request,$id){
        $params = $request->all();
        if ($request->isMethod('post')) {
            if(isset($params['data'][0])){
                $data['message'] = ($params['data'][0]['type'] == 'live') ? ($params['data'][0]['user_name'].' has started a live video "'.$params['data'][0]['title']).'"' : 'Error';
            }else{
                $data['message'] = '';
            }
            $data['id'] = $id;            
            event(new \App\Events\TwitchEvent($data));
        }else{            
            $hub_mode = $params['hub_mode'] ?? NULL;
            switch ($hub_mode) {
                case 'subscribe':
                    $tk = $params['hub_challenge'] ?? NULL;
                    //return response
                    return response($tk, 200)->header('Content-Type', 'text/plain');
                    break;
                
                case 'unsubscribe':
                    $tk = $params['hub_challenge'] ?? NULL;
                    //return response
                    return response($tk, 200)->header('Content-Type', 'text/plain');
                    break;
                
                case 'denied':
                    //return response
                    return response('200 OK', 200)->header('Content-Type', 'text/plain');
                    break;

                default:
                    break;
            }
        }
    }
}
