<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//event handler following
Route::match(['get', 'post'],'handler/following/{id}', array('as' => 'handler.following',  'uses' => 'EventHandlerController@following'));
//event handler follower
Route::match(['get', 'post'],'handler/follower/{id}', array('as' => 'handler.follower',  'uses' => 'EventHandlerController@follower'));
//event handler streams
Route::match(['get', 'post'],'handler/streams/{id}', array('as' => 'handler.streams',  'uses' => 'EventHandlerController@streams'));

// login
Route::get('/login', array('as' => 'login',  'uses' => 'UserController@login'));
//logged
	Route::get('/logged', array('as' => 'logged',  'uses' => 'UserController@logged'));
//logged in routes
Route::group(array('middleware' => ['auth','is_logged']), function(){	
	// logout
	Route::get('/logout', array('as' => 'logout',  'uses' => 'UserController@logout'));
	//home
	Route::get('/', array('as' => 'home',  'uses' => 'UserController@home'));
	//home
	Route::post('/mark-favourite', array('as' => 'markfav',  'uses' => 'UserController@markFavourite'));
	//home
	Route::get('/streamer/{id}', array('as' => 'streamer',  'uses' => 'UserController@streamer'));		
	//subscribe
	Route::post('/subscribe', array('as' => 'subscribe',  'uses' => 'UserController@subscribe'));		
});