<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'nama',
        'role',
        'email',
        'password'
    ];

    protected $hidden = [
        'password'
    ];

    public function cards(){
        return $this->hasMany(Card::class,'id_user');
    }
}
