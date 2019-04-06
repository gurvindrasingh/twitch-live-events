<?php
namespace App\Models;

use GuzzleHttp\Client;
class TwitchTv
{    
    /**
     * Twitch api base url
     *
     * @var string $base_url
     */
    private static $base_url;

    /**
     * Twitch client id
     *
     * @var string $client_id
     */
    private static $client_id;

    /**
     * Twitch client secret
     *
     * @var string $client_secret
     */
    private static $client_secret;

    /**
     * Twitch redirect url
     *
     * @var string $redirect_url
     */
    private static $redirect_url;

    /**
     * Twitch scopes array
     *
     * @var array $scope_array
     */
    private static $scope_array;

    /**
     * Create a new event instance.
     *
     * @var string $base_url,$client_id,$client_secret,$redirect_url
     * @var array scope_array
     */
    public function __construct(){
        Self::$base_url = config('twitch.base_url_kraken');
        Self::$client_id = config('twitch.client_id');
        Self::$client_secret = config('twitch.client_secret');
        Self::$redirect_url = config('twitch.redirect_url');
        Self::$scope_array = array(
            'user_read',
            'channel_read',
            'user_follows_edit',
            //'channel_editor',
            //'channel_commercial',
            //'channel_check_subscription',
            //'channel_commercial',
            //'channel_editor',
            //'channel_feed_edit',
            //'channel_feed_read',
            //'channel_stream',
            //'channel_subscriptions',
            //'chat_login',
            //'collections_edit',
            //'communities_edit',
            //'communities_moderate',
            //'openid',
            //'user_blocks_edit',
            //'user_blocks_read',
            //'user_subscriptions',
            //'viewing_activity_read',
            //'channel:moderate',
            //'chat:edit',
            //'chat:read',
            //'whispers:read',
            //'whispers:edit',
            //'bits:read',
            //'analytics:read:extensions',
            //'analytics:read:games',
            //'channel:read:subscriptions',
            //'clips:edit',
            //'user:edit',
            //'user:edit:broadcast',
            //'user:read:broadcast',
            //'user:read:email'
        );
    }

    /**
     * Create a auth url
     *
     * @var string scope_string
     * @return authentication url
     */
    public static function authenticate() {
        $i = 0;
        $scope_string = '';
        $len = count(Self::$scope_array);
        //loop through the scope array and create desired format string
        foreach (Self::$scope_array as $scope) {
            if ($i == $len - 1) {
                $scope .= "";
                $scope_string .= $scope;
            } else {
                $scope .= "+";
                $scope_string .= $scope;
            }

            $i++;
        }
        //create url of twitch tv server
        return Self::$base_url.'oauth2/authorize?response_type=code&client_id=' . Self::$client_id . '&redirect_uri=' . Self::$redirect_url . '&scope=' . $scope_string;
    }

    /**
     * To get the access token for perticular user.
     *
     * @param string $code
     * @return array authenticated data
     */
    public static function access_token($code) {
        try {
            $client = new Client();
            $res = $client->request('POST', Self::$base_url."oauth2/token", [
                'form_params' => [
                    'client_id' => Self::$client_id,
                    'client_secret' => Self::$client_secret,
                    'grant_type' => 'authorization_code',
                    'redirect_uri' => Self::$redirect_url,
                    'code' => $code
                    //'response_type' => 'json'
                ]
            ]);
            $response = json_decode($res->getBody(),true);
            return array('status'=>true,'response'=>$response);   
        } catch (\Exception $e) {
            return array('status'=>false);   
        }
    }

    /**
     * Authenticate user based on an access token.
     *
     * @param string $access_token
     * @return array authentication data
     */
    public static function authenticate_user($access_token) {
        try {
            $client = new Client();
            $res = $client->request('GET', Self::$base_url, [
                'headers' => [
                    'Authorization' => 'OAuth ' . $access_token,
                ],
            ]);
            $response = json_decode($res->getBody(),true);
            return array('status'=>true,'response'=>$response);   
        } catch (\Exception $e) {
            return array('status'=>false);   
        }

    }

    /**
     * Get the authenticated user based on an access token.
     *
     * @param string $access_token
     * @return array user data
     */
    public static function authenticated_user($access_token) {
        try {
            $client = new Client();
            $res = $client->request('GET', Self::$base_url.'/user', [
                'headers' => [
                    'Authorization' => 'OAuth ' . $access_token,
                ],
            ]);
            $response = json_decode($res->getBody(),true);
            return array('status'=>true,'response'=>$response);   
        } catch (\Exception $e) {
            return array('status'=>false);   
        }

    }
}
