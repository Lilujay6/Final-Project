<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Card;
use App\Models\AccessLog;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        // User counts by role
        $totalUsers = User::count();
        $students   = User::where('role', 'student')->count();
        $teachers   = User::where('role', 'teacher')->count();
        $staff      = User::where('role', 'staff')->count();

        // Inside library count (only active cards)
        $activeInside = Card::where('location', 'inside')
            ->where('status', 'active')
            ->count();

        // Monthly visits (count only entering)
        $monthlyVisits = AccessLog::where('access_type', 'inside')
            ->whereMonth('access_time', now()->month)
            ->whereYear('access_time', now()->year)
            ->count();

        // Weekly visits (last 7 days, inside only)
        $weeklyVisits = AccessLog::select(
                DB::raw('DATE(access_time) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->where('access_type', 'inside')
            ->whereBetween('access_time', [
                now()->subDays(6)->startOfDay(),
                now()->endOfDay()
            ])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'total_users'   => $totalUsers,
            'students'      => $students,
            'teachers'      => $teachers,
            'staff'         => $staff,
            'active_inside' => $activeInside,
            'monthly_visits'=> $monthlyVisits,
            'weekly_visits' => $weeklyVisits,
        ]);
    }
}
