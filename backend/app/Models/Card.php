<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $primaryKey = 'card_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'card_id',
        'id_user',
        'expired',
        'status',
        'location',
    ];

    protected $casts = [
        'expired' => 'datetime',
    ];

    public function accessLogs()
    {
        return $this->hasMany(AccessLog::class, 'card_id', 'card_id');
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
