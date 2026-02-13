<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Card;
use App\Models\AccessLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['cards' => function ($q) {
            $q->with(['accessLogs' => function ($log) {
                $log->latest();
            }]);
        }])->get();

        $users->transform(function ($user) {
            $card = $user->cards->first();

            if ($card) {
                $lastLog = AccessLog::where('card_id', $card->card_id)
                    ->latest()
                    ->first();

                $card->last_access = $lastLog?->access_time;
            }

            return $user;
        });

        return response()->json($users);
    }

    public function store(Request $req)
    {
        $req->validate([
            'nama' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:student,teacher,staff,admin'
        ]);

        $user = User::create([
            'nama' => $req->nama,
            'email' => $req->email,
            'role' => $req->role,
            'password' => bcrypt('123456'),
        ]);

        Card::create([
            'card_id' => strtoupper(Str::random(12)),
            'id_user' => $user->user_id,
            'expired' => now()->addYear(),
            'status' => 'active',
            'location' => 'outside',
        ]);

        return response()->json(['message' => 'User created']);
    }

    public function update(Request $req, $id)
    {
        $user = User::findOrFail($id);

        $req->validate([
            'nama' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id'
        ]);

        $user->update([
            'nama' => $req->nama,
            'email' => $req->email
        ]);

        return response()->json(['message' => 'User updated']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function toggleStatus($id)
    {
        $user = User::with('cards')->findOrFail($id);
        $card = $user->cards->first();

        if (!$card) return response()->json(['error' => 'No card'], 404);

        $card->update([
            'status' => $card->status === 'active' ? 'inactive' : 'active'
        ]);

        return response()->json(['message' => 'Status updated']);
    }

    public function toggleLocation($id)
    {
        $user = User::with('cards')->findOrFail($id);
        $card = $user->cards->first();

        if (!$card) return response()->json(['error' => 'No card'], 404);

        $newLocation = $card->location === 'inside' ? 'outside' : 'inside';

        $card->update([
            'location' => $newLocation
        ]);

        AccessLog::create([
            'card_id' => $card->card_id,
            'access_time' => now(),
            'access_type' => $newLocation
        ]);

        return response()->json(['message' => 'Location updated']);
    }
}
