"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Settings,
  LogOut,
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Bell,
  User,
  BarChart3,
  Package,
  Calendar,
  ArrowUp,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Mail,
  Globe,
  PieChart,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  Lock,
  Key,
  UserCheck,
  Ban,
  Store,
  ChefHat,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "restaurants" | "orders" | "analytics" | "system" | "profile"
  >("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock admin data
  const adminStats = {
    totalUsers: 25847,
    totalRestaurants: 1247,
    totalOrders: 89342,
    totalRevenue: 2847592.5,
    activeUsers: 18934,
    pendingApprovals: 23,
    systemUptime: 99.9,
    monthlyGrowth: 18.7,
  }

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      orders: 12,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah's Kitchen",
      email: "sarah@kitchen.com",
      role: "mess_owner",
      status: "pending",
      joinDate: "2024-01-14",
      orders: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-13",
      orders: 8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const systemMetrics = [
    { name: "CPU Usage", value: 45, unit: "%", status: "good", icon: Cpu },
    { name: "Memory", value: 68, unit: "%", status: "warning", icon: HardDrive },
    { name: "Storage", value: 32, unit: "%", status: "good", icon: Database },
    { name: "Network", value: 89, unit: "Mbps", status: "good", icon: Wifi },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "suspended":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={14} />
      case "pending":
        return <Clock size={14} />
      case "suspended":
        return <Ban size={14} />
      case "inactive":
        return <XCircle size={14} />
      default:
        return <AlertCircle size={14} />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "user":
        return <User size={16} className="text-blue-500" />
      case "mess_owner":
        return <ChefHat size={16} className="text-orange-500" />
      case "admin":
        return <Shield size={16} className="text-purple-500" />
      default:
        return <User size={16} className="text-gray-500" />
    }
  }

  const DashboardTab = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Mobile Stats Cards */}
      <div className="lg:hidden grid grid-cols-2 gap-4">
        <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-blue-500" />
            <ArrowUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{adminStats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </Card>
        <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <Store size={24} className="text-orange-500" />
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
              {adminStats.pendingApprovals}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">{adminStats.totalRestaurants}</div>
          <div className="text-sm text-muted-foreground">Restaurants</div>
        </Card>
        <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <Package size={24} className="text-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
              +{adminStats.monthlyGrowth}%
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">{adminStats.totalOrders.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </Card>
        <Card className="p-4 border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} className="text-purple-500" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              {adminStats.systemUptime}%
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">${(adminStats.totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted-foreground">Revenue</div>
        </Card>
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden lg:grid grid-cols-4 gap-8">
        <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <ArrowUp size={20} />
              <span className="font-bold text-lg">+{adminStats.monthlyGrowth}%</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-foreground mb-2">{adminStats.totalUsers.toLocaleString()}</div>
          <div className="text-lg text-muted-foreground">Total Users</div>
          <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            {adminStats.activeUsers.toLocaleString()} active
          </div>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Store size={32} className="text-white" />
            </div>
            <div className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              {adminStats.pendingApprovals} pending
            </div>
          </div>
          <div className="text-4xl font-bold text-foreground mb-2">{adminStats.totalRestaurants.toLocaleString()}</div>
          <div className="text-lg text-muted-foreground">Restaurants</div>
          <div className="text-sm text-orange-600 dark:text-orange-400 mt-2">Partner kitchens</div>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package size={32} className="text-white" />
            </div>
            <div className="text-green-600 dark:text-green-400 font-bold text-lg">Growing</div>
          </div>
          <div className="text-4xl font-bold text-foreground mb-2">{adminStats.totalOrders.toLocaleString()}</div>
          <div className="text-lg text-muted-foreground">Total Orders</div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2">Platform-wide</div>
        </Card>

        <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign size={32} className="text-white" />
            </div>
            <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">{adminStats.systemUptime}%</div>
          </div>
          <div className="text-4xl font-bold text-foreground mb-2">
            ${(adminStats.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-lg text-muted-foreground">Platform Revenue</div>
          <div className="text-sm text-purple-600 dark:text-purple-400 mt-2">System uptime</div>
        </Card>
      </div>

      {/* System Health - Desktop Only */}
      <div className="hidden lg:block">
        <h3 className="text-3xl font-bold text-foreground mb-6">System Health</h3>
        <div className="grid grid-cols-4 gap-6">
          {systemMetrics.map((metric) => {
            const Icon = metric.icon
            const getMetricColor = (status: string) => {
              switch (status) {
                case "good":
                  return "from-green-500 to-green-600"
                case "warning":
                  return "from-yellow-500 to-yellow-600"
                case "critical":
                  return "from-red-500 to-red-600"
                default:
                  return "from-gray-500 to-gray-600"
              }
            }

            return (
              <Card key={metric.name} className="p-6 border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getMetricColor(metric.status)} rounded-xl flex items-center justify-center`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.unit}</div>
                  </div>
                </div>
                <div className="text-base font-semibold text-foreground">{metric.name}</div>
                <div className="w-full bg-neutral-gray/20 rounded-full h-2 mt-2">
                  <div
                    className={`bg-gradient-to-r ${getMetricColor(metric.status)} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl lg:text-3xl font-bold text-foreground">Recent Activity</h3>
          <Button className="gradient-primary text-white rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 font-semibold">
            <Eye size={16} className="lg:w-5 lg:h-5 mr-2" />
            View All
          </Button>
        </div>

        {/* Mobile Activity */}
        <div className="lg:hidden space-y-4">
          {recentUsers.map((user) => (
            <Card key={user.id} className="p-4 border-0 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.joinDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(user.status)}`}
                  >
                    {getStatusIcon(user.status)}
                    <span className="capitalize">{user.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs flex-1 bg-transparent">
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button size="sm" className="gradient-primary text-white text-xs flex-1">
                  Manage
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Activity */}
        <div className="hidden lg:block">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-foreground">User</th>
                    <th className="text-left p-6 font-semibold text-foreground">Role</th>
                    <th className="text-left p-6 font-semibold text-foreground">Status</th>
                    <th className="text-left p-6 font-semibold text-foreground">Join Date</th>
                    <th className="text-left p-6 font-semibold text-foreground">Orders</th>
                    <th className="text-left p-6 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-lg">{user.name}</div>
                            <div className="text-base text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="capitalize font-semibold text-foreground">
                            {user.role.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(user.status)}`}
                        >
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-6 text-muted-foreground text-base">{user.joinDate}</td>
                      <td className="p-6 font-bold text-foreground text-lg">{user.orders}</td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="px-4 py-2 bg-transparent">
                            <Eye size={16} className="mr-2" />
                            View
                          </Button>
                          <Button size="sm" className="gradient-primary text-white px-4 py-2">
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions - Desktop Only */}
      <div className="hidden lg:block">
        <h3 className="text-3xl font-bold text-foreground mb-6">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-8">
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserCheck size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">Approve Users</h4>
            <p className="text-muted-foreground">Review pending registrations</p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Store size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">Manage Restaurants</h4>
            <p className="text-muted-foreground">Oversee partner kitchens</p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">View Analytics</h4>
            <p className="text-muted-foreground">Platform performance metrics</p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Settings size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">System Settings</h4>
            <p className="text-muted-foreground">Configure platform settings</p>
          </Card>
        </div>
      </div>
    </div>
  )

  const UsersTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">User Management</h3>
        <div className="flex gap-3">
          <Button variant="outline" className="text-base lg:text-lg bg-transparent">
            <Filter size={16} className="lg:w-5 lg:h-5 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="text-base lg:text-lg bg-transparent">
            <Download size={16} className="lg:w-5 lg:h-5 mr-2" />
            Export
          </Button>
          <Button className="gradient-primary text-white rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 font-semibold">
            <Plus size={16} className="lg:w-5 lg:h-5 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 lg:pl-16 pr-4 lg:pr-6 py-3 lg:py-4 text-base lg:text-lg bg-background border-2 border-border rounded-xl lg:rounded-2xl focus:border-primary-blue transition-all duration-300"
        />
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">18,934</div>
              <div className="text-sm lg:text-base text-muted-foreground">Active Users</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <ChefHat size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm lg:text-base text-muted-foreground">Restaurant Owners</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">23</div>
              <div className="text-sm lg:text-base text-muted-foreground">Pending Approval</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Ban size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">12</div>
              <div className="text-sm lg:text-base text-muted-foreground">Suspended</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Users List - Similar to dashboard but with more management options */}
      <div className="space-y-4 lg:space-y-6">
        {/* Mobile Users */}
        <div className="lg:hidden space-y-4">
          {recentUsers.map((user) => (
            <Card key={user.id} className="p-4 border-0 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.joinDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(user.status)}`}
                  >
                    {getStatusIcon(user.status)}
                    <span className="capitalize">{user.status}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <Edit size={12} className="mr-1" />
                  Edit
                </Button>
                <Button size="sm" className="gradient-primary text-white text-xs">
                  Manage
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Users Table */}
        <div className="hidden lg:block">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-foreground">User</th>
                    <th className="text-left p-6 font-semibold text-foreground">Role</th>
                    <th className="text-left p-6 font-semibold text-foreground">Status</th>
                    <th className="text-left p-6 font-semibold text-foreground">Join Date</th>
                    <th className="text-left p-6 font-semibold text-foreground">Orders</th>
                    <th className="text-left p-6 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-lg">{user.name}</div>
                            <div className="text-base text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="capitalize font-semibold text-foreground">
                            {user.role.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(user.status)}`}
                        >
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-6 text-muted-foreground text-base">{user.joinDate}</td>
                      <td className="p-6 font-bold text-foreground text-lg">{user.orders}</td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="px-4 py-2 bg-transparent">
                            <Eye size={16} className="mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="px-4 py-2 bg-transparent">
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" className="gradient-primary text-white px-4 py-2">
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )

  const RestaurantsTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Restaurant Management</h3>
        <div className="flex gap-3">
          <Button variant="outline" className="text-base lg:text-lg bg-transparent">
            <Filter size={16} className="lg:w-5 lg:h-5 mr-2" />
            Filter
          </Button>
          <Button className="gradient-primary text-white rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 font-semibold">
            <UserCheck size={16} className="lg:w-5 lg:h-5 mr-2" />
            Approve Pending
          </Button>
        </div>
      </div>

      {/* Restaurant Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">1,224</div>
              <div className="text-sm lg:text-base text-muted-foreground">Active</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">23</div>
              <div className="text-sm lg:text-base text-muted-foreground">Pending</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Ban size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">8</div>
              <div className="text-sm lg:text-base text-muted-foreground">Suspended</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Star size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">4.7</div>
              <div className="text-sm lg:text-base text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Similar structure to Users tab but for restaurants */}
      <div className="text-center p-12 text-muted-foreground">
        <Store size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">Restaurant management interface would be implemented here</p>
      </div>
    </div>
  )

  const OrdersTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Platform Orders</h3>
        <Button variant="outline" className="text-base lg:text-lg bg-transparent">
          <Download size={16} className="lg:w-5 lg:h-5 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">89,342</div>
              <div className="text-sm lg:text-base text-muted-foreground">Total Orders</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">87,234</div>
              <div className="text-sm lg:text-base text-muted-foreground">Completed</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Timer size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">1,456</div>
              <div className="text-sm lg:text-base text-muted-foreground">In Progress</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <XCircle size={20} className="lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold text-foreground">652</div>
              <div className="text-sm lg:text-base text-muted-foreground">Cancelled</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center p-12 text-muted-foreground">
        <Package size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">Platform-wide order management interface would be implemented here</p>
      </div>
    </div>
  )

  const AnalyticsTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Platform Analytics</h3>
        <div className="flex gap-3">
          <Button variant="outline" className="text-base lg:text-lg bg-transparent">
            <Calendar size={16} className="lg:w-5 lg:h-5 mr-2" />
            This Month
          </Button>
          <Button variant="outline" className="text-base lg:text-lg bg-transparent">
            <Download size={16} className="lg:w-5 lg:h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6 border-0 shadow-lg text-center">
          <DollarSign size={32} className="lg:w-10 lg:h-10 text-green-500 mx-auto mb-3" />
          <div className="text-xl lg:text-2xl font-bold text-foreground">$2.85M</div>
          <div className="text-sm lg:text-base text-muted-foreground">Total Revenue</div>
          <div className="text-xs lg:text-sm text-green-600 dark:text-green-400 mt-1">+18.7%</div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg text-center">
          <Users size={32} className="lg:w-10 lg:h-10 text-blue-500 mx-auto mb-3" />
          <div className="text-xl lg:text-2xl font-bold text-foreground">25,847</div>
          <div className="text-sm lg:text-base text-muted-foreground">Total Users</div>
          <div className="text-xs lg:text-sm text-green-600 dark:text-green-400 mt-1">+12.3%</div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg text-center">
          <Store size={32} className="lg:w-10 lg:h-10 text-orange-500 mx-auto mb-3" />
          <div className="text-xl lg:text-2xl font-bold text-foreground">1,247</div>
          <div className="text-sm lg:text-base text-muted-foreground">Restaurants</div>
          <div className="text-xs lg:text-sm text-green-600 dark:text-green-400 mt-1">+8.9%</div>
        </Card>
        <Card className="p-4 lg:p-6 border-0 shadow-lg text-center">
          <TrendingUp size={32} className="lg:w-10 lg:h-10 text-purple-500 mx-auto mb-3" />
          <div className="text-xl lg:text-2xl font-bold text-foreground">18.7%</div>
          <div className="text-sm lg:text-base text-muted-foreground">Growth Rate</div>
          <div className="text-xs lg:text-sm text-green-600 dark:text-green-400 mt-1">Monthly</div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card className="p-6 lg:p-8 border-0 shadow-lg">
          <h4 className="text-lg lg:text-xl font-bold text-foreground mb-4 lg:mb-6">Platform Growth</h4>
          <div className="h-48 lg:h-64 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="lg:w-16 lg:h-16 text-primary-blue mx-auto mb-4" />
              <p className="text-muted-foreground">Growth analytics chart would go here</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 lg:p-8 border-0 shadow-lg">
          <h4 className="text-lg lg:text-xl font-bold text-foreground mb-4 lg:mb-6">Revenue Distribution</h4>
          <div className="h-48 lg:h-64 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <PieChart size={48} className="lg:w-16 lg:h-16 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">Revenue distribution chart would go here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const SystemTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">System Management</h3>
        <Button className="gradient-primary text-white rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 font-semibold">
          <RefreshCw size={16} className="lg:w-5 lg:h-5 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon
          const getMetricColor = (status: string) => {
            switch (status) {
              case "good":
                return "from-green-500 to-green-600"
              case "warning":
                return "from-yellow-500 to-yellow-600"
              case "critical":
                return "from-red-500 to-red-600"
              default:
                return "from-gray-500 to-gray-600"
            }
          }

          return (
            <Card key={metric.name} className="p-4 lg:p-6 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${getMetricColor(metric.status)} rounded-xl flex items-center justify-center`}
                >
                  <Icon size={20} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xl lg:text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.unit}</div>
                </div>
              </div>
              <div className="text-base font-semibold text-foreground mb-2">{metric.name}</div>
              <div className="w-full bg-neutral-gray/20 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getMetricColor(metric.status)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* System Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <Card className="p-6 lg:p-8 border-0 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Database</h4>
              <p className="text-sm text-muted-foreground">Manage database operations</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <RefreshCw size={16} className="mr-2" />
              Backup Database
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Monitor size={16} className="mr-2" />
              View Logs
            </Button>
          </div>
        </Card>

        <Card className="p-6 lg:p-8 border-0 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Security</h4>
              <p className="text-sm text-muted-foreground">Security settings and monitoring</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Lock size={16} className="mr-2" />
              Security Audit
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Key size={16} className="mr-2" />
              API Keys
            </Button>
          </div>
        </Card>

        <Card className="p-6 lg:p-8 border-0 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Configuration</h4>
              <p className="text-sm text-muted-foreground">System configuration settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Server size={16} className="mr-2" />
              Server Config
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Globe size={16} className="mr-2" />
              API Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )

  const ProfileTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Admin Profile</h3>
        <Button variant="outline" className="text-base lg:text-lg bg-transparent">
          <Settings size={16} className="lg:w-5 lg:h-5 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Mobile Profile */}
      <div className="lg:hidden space-y-6">
        <Card className="p-6 text-center border-0 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-1">{user?.name}</h4>
          <p className="text-muted-foreground mb-4">Platform Administrator</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-500/10 rounded-xl">
              <div className="text-lg font-bold text-foreground">Admin</div>
              <div className="text-sm text-muted-foreground">Role</div>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-xl">
              <div className="text-lg font-bold text-foreground">Active</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {[
            { icon: Mail, label: "Email Address", value: user?.email, color: "from-blue-500 to-blue-600" },
            { icon: Shield, label: "Security Level", value: "Maximum", color: "from-green-500 to-green-600" },
            { icon: Key, label: "API Access", value: "Full Access", color: "from-purple-500 to-purple-600" },
            { icon: Clock, label: "Last Login", value: "2 hours ago", color: "from-orange-500 to-orange-600" },
            { icon: Globe, label: "IP Address", value: "192.168.1.1", color: "from-yellow-500 to-yellow-600" },
            { icon: Monitor, label: "Session", value: "Active", color: "from-red-500 to-red-600" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="p-4 border-0 shadow-md">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">{item.label}</div>
                    <div className="text-muted-foreground text-sm">{item.value}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Desktop Profile */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <Card className="p-8 text-center border-0 shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={64} className="text-white" />
              </div>
              <h4 className="text-3xl font-bold text-foreground mb-2">{user?.name}</h4>
              <p className="text-xl text-muted-foreground mb-6">Platform Administrator</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-2xl">
                  <span className="text-lg font-semibold text-foreground">Role</span>
                  <span className="text-lg text-purple-600 font-bold">Super Admin</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-2xl">
                  <span className="text-lg font-semibold text-foreground">Status</span>
                  <span className="text-lg text-green-600 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-2xl">
                  <span className="text-lg font-semibold text-foreground">Access Level</span>
                  <span className="text-lg text-blue-600 font-bold">Full</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Mail, label: "Email Address", value: user?.email, color: "from-blue-500 to-blue-600" },
                {
                  icon: Shield,
                  label: "Security Level",
                  value: "Maximum Security",
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: Key,
                  label: "API Access",
                  value: "Full Administrative Access",
                  color: "from-purple-500 to-purple-600",
                },
                { icon: Clock, label: "Last Login", value: "2 hours ago", color: "from-orange-500 to-orange-600" },
                { icon: Globe, label: "IP Address", value: "192.168.1.1", color: "from-yellow-500 to-yellow-600" },
                { icon: Monitor, label: "Active Session", value: "Web Dashboard", color: "from-red-500 to-red-600" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Card
                    key={item.label}
                    className="p-6 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{item.label}</h4>
                    <p className="text-base text-muted-foreground">{item.value}</p>
                  </Card>
                )
              })}
            </div>

            <Card className="p-8 border-0 shadow-lg">
              <h4 className="text-2xl font-bold text-foreground mb-6">Administrative Privileges</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "User Management",
                  "Restaurant Approval",
                  "System Configuration",
                  "Security Settings",
                  "Database Access",
                  "API Management",
                  "Analytics Access",
                  "Audit Logs",
                ].map((privilege) => (
                  <div
                    key={privilege}
                    className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20"
                  >
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="font-semibold text-foreground">{privilege}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-neutral-gray/5 to-background">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="relative">
                <Bell size={20} className="text-muted-foreground" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border">
          <div className="grid grid-cols-4 gap-1 p-2">
            {[
              { id: "dashboard", icon: BarChart3, label: "Dashboard" },
              { id: "users", icon: Users, label: "Users" },
              { id: "restaurants", icon: Store, label: "Restaurants" },
              { id: "system", icon: Settings, label: "System" },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-purple-500/10 text-purple-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 pb-20">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "restaurants" && <RestaurantsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "system" && <SystemTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="w-80 bg-card/50 backdrop-blur-lg border-r border-border flex flex-col">
          <div className="p-8 border-b border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-base text-muted-foreground">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">Super Administrator</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {[
                { id: "dashboard", icon: BarChart3, label: "Dashboard", desc: "Platform overview & metrics" },
                { id: "users", icon: Users, label: "User Management", desc: "Manage platform users" },
                { id: "restaurants", icon: Store, label: "Restaurants", desc: "Partner restaurant management" },
                { id: "orders", icon: Package, label: "Orders", desc: "Platform-wide order monitoring" },
                { id: "analytics", icon: TrendingUp, label: "Analytics", desc: "Business intelligence" },
                { id: "system", icon: Settings, label: "System", desc: "System administration" },
                { id: "profile", icon: User, label: "Profile", desc: "Admin account settings" },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full justify-start p-4 h-auto rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon size={24} className="mr-4" />
                    <div className="text-left">
                      <div className="font-semibold text-base">{tab.label}</div>
                      <div className="text-sm opacity-70">{tab.desc}</div>
                    </div>
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-border">
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start p-4 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Settings size={24} className="mr-4" />
                <span className="text-base">System Settings</span>
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start p-4 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <LogOut size={24} className="mr-4" />
                <span className="text-base">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between p-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground capitalize">
                  {activeTab === "dashboard" ? "Dashboard" : activeTab}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {activeTab === "dashboard" && "Platform overview and key metrics"}
                  {activeTab === "users" && "Manage platform users and permissions"}
                  {activeTab === "restaurants" && "Oversee partner restaurants and approvals"}
                  {activeTab === "orders" && "Monitor platform-wide order activity"}
                  {activeTab === "analytics" && "Business intelligence and insights"}
                  {activeTab === "system" && "System administration and configuration"}
                  {activeTab === "profile" && "Administrator account management"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button size="lg" variant="ghost" className="relative">
                  <Bell size={24} className="text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {adminStats.pendingApprovals}
                  </div>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "restaurants" && <RestaurantsTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "system" && <SystemTab />}
            {activeTab === "profile" && <ProfileTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
