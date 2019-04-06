<?php

return [

    /*
     * Client Id
     */

    'client_id' => env('TWITCH_CLIENT_ID', NULL),

    /*
     * Client Secret
     */

    'client_secret' => env('TWITCH_CLIENT_SECRET', NULL),

    /*
     * Base Url V5
     */

    'base_url_kraken' => env('TWITCH_BASE_URL_KRAKEN', NULL),

    /*
     * Base Url New API
     */

    'base_url_helix' => env('TWITCH_BASE_URL_HELIX', NULL),

    /*
     * Redirect Url
     */

    'redirect_url' => env('TWITCH_REDIRECT_URL', NULL),
    
];
