<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTwitchSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_twitch_subscriptions', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('user_id')->unsigned();
            $table->string('twitch_id');
            $table->string('callback');
            $table->string('topic_url');
            $table->datetime('expire_time');
            $table->enum('topic', ['follows', 'streams'])->default('follows');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_twitch_subscriptions');
    }
}
