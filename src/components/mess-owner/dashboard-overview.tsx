"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UtensilsCrossed,
  Receipt,
  TrendingUp,
  CalendarDays,
  MessageSquare,
  ChefHat,
  Clock,
  Calendar,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock data for demonstration
const mockStats = {
  activeUsers: 128,
  mealsServed: 1842,
  revenue: 45680,
  pendingPayments: 12,
  leaveRequests: 8,
  feedbackCount: 24,
  recentActivity: [
    { id: 1, type: "payment", user: "John Doe", amount: 1200, date: "2024-06-01" },
    { id: 2, type: "meal", user: "Sarah Smith", meal: "Lunch", date: "2024-06-01" },
    { id: 3, type: "leave", user: "Mike Johnson", days: 2, date: "2024-06-02" },
    { id: 4, type: "feedback", user: "Emily Brown", rating: 4, date: "2024-06-02" },
    { id: 5, type: "payment", user: "Alex Wilson", amount: 1500, date: "2024-06-03" },
  ],
  upcomingEvents: [
    { id: 1, title: "Menu Planning Meeting", date: "2024-06-05", time: "10:00 AM" },
    { id: 2, title: "Staff Training", date: "2024-06-08", time: "2:00 PM" },
    { id: 3, title: "Monthly Billing Cycle", date: "2024-06-15", time: "All Day" },
  ],
}

export function DashboardOverview() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  
  const statCards = [
    {
      title: "Active Users",
      value: mockStats.activeUsers,
      change: "+4% from last month",
      icon: <Users className="h-5 w-5" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-500/5",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Meals Served",
      value: mockStats.mealsServed,
      change: "This month",
      icon: <UtensilsCrossed className="h-5 w-5" />,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-500/5",
      borderColor: "border-green-500/20"
    },
    {
      title: "Revenue",
      value: `₹${mockStats.revenue.toLocaleString()}`,
      change: "+12% from last month",
      icon: <Receipt className="h-5 w-5" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-500/5",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Pending Payments",
      value: mockStats.pendingPayments,
      change: "Requires attention",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-amber-500/10 to-amber-500/5",
      borderColor: "border-amber-500/20"
    },
    {
      title: "Leave Requests",
      value: mockStats.leaveRequests,
      change: "Pending approval",
      icon: <CalendarDays className="h-5 w-5" />,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-500/10 to-red-500/5",
      borderColor: "border-red-500/20"
    },
    {
      title: "Feedback",
      value: mockStats.feedbackCount,
      change: "New this month",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-500/10 to-teal-500/5",
      borderColor: "border-teal-500/20"
    },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Card */}
      <Card className="bg-gradient-to-r from-primary-blue via-secondary-blue to-primary-blue text-white p-6 lg:p-12 rounded-xl lg:rounded-3xl border-0 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-4xl font-bold">Welcome, {user?.name || "Mess Owner"}</h2>
              <p className="text-base lg:text-xl text-white/90">Here's what's happening with your mess today</p>
            </div>
            <div className="mt-4 lg:mt-0 w-16 h-16 lg:w-24 lg:h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ChefHat size={isMobile ? 32 : 48} className="text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="text-center p-3 lg:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Users size={isMobile ? 20 : 24} className="mx-auto mb-2" />
              <div className="text-lg lg:text-2xl font-bold">{mockStats.activeUsers}</div>
              <div className="text-xs lg:text-sm text-white/80">Active Users</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <UtensilsCrossed size={isMobile ? 20 : 24} className="mx-auto mb-2" />
              <div className="text-lg lg:text-2xl font-bold">{mockStats.mealsServed}</div>
              <div className="text-xs lg:text-sm text-white/80">Meals Served</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Receipt size={isMobile ? 20 : 24} className="mx-auto mb-2" />
              <div className="text-lg lg:text-2xl font-bold">₹{mockStats.revenue.toLocaleString()}</div>
              <div className="text-xs lg:text-sm text-white/80">Revenue</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <CalendarDays size={isMobile ? 20 : 24} className="mx-auto mb-2" />
              <div className="text-lg lg:text-2xl font-bold">{mockStats.leaveRequests}</div>
              <div className="text-xs lg:text-sm text-white/80">Leave Requests</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <Card 
            key={index}
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${card.bgColor} ${card.borderColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                {React.cloneElement(card.icon, { className: "h-4 w-4 text-white" })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Overview of recent user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                {mockStats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br 
                        ${activity.type === "payment" ? "from-green-500 to-green-600" : 
                          activity.type === "meal" ? "from-amber-500 to-amber-600" :
                          activity.type === "leave" ? "from-blue-500 to-blue-600" :
                          "from-purple-500 to-purple-600"}`}>
                        {activity.type === "payment" ? <Receipt size={18} className="text-white" /> :
                         activity.type === "meal" ? <UtensilsCrossed size={18} className="text-white" /> :
                         activity.type === "leave" ? <Calendar size={18} className="text-white" /> :
                         <MessageSquare size={18} className="text-white" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type === "payment"
                            ? `Paid ₹${activity.amount}`
                            : activity.type === "meal"
                            ? `Had ${activity.meal}`
                            : activity.type === "leave"
                            ? `Requested ${activity.days} days leave`
                            : `Gave ${activity.rating}/5 rating`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Schedule for the coming days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                {mockStats.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                        <Calendar size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
