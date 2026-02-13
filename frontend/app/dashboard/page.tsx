/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  Cell,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DashboardStats {
  total_users: number
  students: number
  active_inside: number
  monthly_visits: number
  teachers?: number
  staff?: number
  weekly_visits: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [chartData, setChartData] = useState<any[]>([])
  const [userTypeData, setUserTypeData] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    api.get("/stats").then((res) => {
      setStats(res.data)

      const today = new Date()
      const last7Days: any[] = []

      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(today.getDate() - i)

        last7Days.push({
          date: d.toISOString().split("T")[0],
          name: d.toLocaleDateString("en-US", { weekday: "short" }),
          visits: 0,
        })
      }

      const visitMap: Record<string, number> = {}
      res.data.weekly_visits?.forEach((item: any) => {
        visitMap[item.date] = item.total
      })

      setChartData(
        last7Days.map((d) => ({
          name: d.name,
          visits: visitMap[d.date] || 0,
        }))
      )

      setUserTypeData([
        { name: "Teacher", value: res.data.teachers ?? 0 },
        { name: "Staff", value: res.data.staff ?? 0 },
        { name: "Student", value: res.data.students ?? 0 },
      ])
    })
  }, [router])

  if (!stats) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-70 mt-1">
          Overview of library access statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total_users },
          { label: "Students", value: stats.students },
          { label: "Inside Library", value: stats.active_inside },
          { label: "Monthly Visits", value: stats.monthly_visits },
        ].map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-3xl font-bold mt-2">
              {stat.value.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Types Comparison</CardTitle>
            <CardDescription>Role distribution</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer config={{}}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="text-sm text-center"
                      formatter={(value) => `${value} Users`}
                    />
                  }
                />

                <Pie
                  data={userTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={({ percent, name }) =>
                    percent
                      ? `${(percent * 100).toFixed(0)}% ${name}`
                      : ""
                  }
                  labelLine={false}
                >
                  {userTypeData.map((_, index) => (
                    <Cell
                      key={index}
                      fill="hsl(var(--foreground))"
                      stroke="hsl(var(--background))"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Visits</CardTitle>
            <CardDescription>Last 7 days activity</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer config={{}}>
              <LineChart
                data={chartData}
                margin={{ left: 20, right: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="text-sm text-center"
                      formatter={(value) => `${value} Visits`}
                    />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--foreground))" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
