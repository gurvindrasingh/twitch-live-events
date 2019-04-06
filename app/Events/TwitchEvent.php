<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TwitchEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    /**
     * Message to broadcast.
     *
     * @var string
     */
    public $message;

    /**
     * User id.
     *
     * @var int
     */
    private $id;

    /**
     * Create a new event instance.
     *
     * @var $message,$id
     * @return void
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->message = $data['message'];
        $this->id = $data['id'];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return ['user.'.$this->id];
    }
}
