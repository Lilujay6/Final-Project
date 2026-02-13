<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->string('card_id')->primary();
            $table->unsignedBigInteger('id_user');
            $table->dateTime('expired');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->enum('location', ['inside', 'outside'])->default('outside');
            $table->timestamps();

            $table->foreign('id_user')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
