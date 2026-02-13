<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_logs', function (Blueprint $table) {
            $table->id('access_id');
            $table->string('card_id');
            $table->dateTime('access_time');
            $table->enum('access_type', ['inside', 'outside']);
            $table->timestamps();

            $table->foreign('card_id')->references('card_id')->on('cards')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_logs');
    }
};
