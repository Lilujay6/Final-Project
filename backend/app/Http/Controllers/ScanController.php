<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use App\Models\AccessLog;

class ScanController extends Controller
{
    public function scan(Request $req)
    {
        $req->validate([
            'card_id' => 'required|string'
        ]);

        $card = Card::with('user')->where('card_id', $req->card_id)->first();

        if (!$card)
            return response()->json(['error' => 'Card not found'], 404);

        if ($card->status !== 'active')
            return response()->json(['error' => 'Card inactive'], 403);

        if ($card->expired < now())
            return response()->json(['error' => 'Card expired'], 403);

        // Toggle location
        $newLocation = $card->location === 'inside' ? 'outside' : 'inside';

        // Create access log
        $accessLog = AccessLog::create([
            'card_id' => $card->card_id,
            'access_time' => now(),
            'access_type' => $newLocation,
        ]);

        // Update card location
        $card->update([
            'location' => $newLocation
        ]);

        $roleMap = [
            'student' => 'Student',
            'teacher' => 'Teacher',
            'staff'   => 'Staff',
            'admin'   => 'Admin',
        ];

        $displayRole = $roleMap[strtolower($card->user->role)] ?? ucfirst($card->user->role);

        return response()->json([
            'access_id' => $accessLog->access_id,
            'nama' => $card->user->nama,
            'email' => $card->user->email,
            'role' => $displayRole,
            'location' => $newLocation,
            'expired' => $card->expired->format('d/M/y'),
            'time' => now()->format('d/M/y H:i')
        ]);
    }
}
