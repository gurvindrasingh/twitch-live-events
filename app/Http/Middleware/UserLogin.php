<?php

namespace App\Http\Middleware;

use Closure, Request;
use Illuminate\Support\Facades\App;
use Auth;

class UserLogin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @var object $user
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //check if user is logged in
        if (Auth::check())
        {
            $user=Auth::user();
            //share to all view
            view()->share('user', $user);
        }
        return $next($request);
    }
}
