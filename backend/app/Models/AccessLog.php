<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessLog extends Model
{
    protected $primaryKey = 'access_id';

    protected $fillable = [
        'card_id',
        'access_time',
        'access_type',
    ];

    protected $casts = [
        'access_time' => 'datetime'
    ];

}
