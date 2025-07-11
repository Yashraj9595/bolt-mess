"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Clock,
  MapPin,
  Filter,
  Bell,
  User,
  Settings,
  LogOut,
  ChefHat,
  Utensils,
  Award,
  Zap,
  Plus,
  ArrowRight,
  Eye,
  Gift,
  CreditCard,
  History,
  Phone,
  Truck,
  DollarSign,
  Percent,
  BarChart3,
  Target,
  Crown,
  Flame,
  Coffee,
  Pizza,
  Salad,
  IceCream,
  Sandwich,
  Soup,
  Cookie,
  Cake,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom";

export function UserDashboard() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "favorites" | "profile">("home")
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const featuredRestaurants = [
    {
      id: 1,
      name: "Spice Garden",
      cuisine: "Indian",
      rating: 4.8,
      deliveryTime: "25-35 min",
      image: "/placeholder.svg?height=200&width=300",
      discount: "20% OFF",
      popular: true,
      icon: Utensils,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 2,
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.6,
      deliveryTime: "30-40 min",
      image: "/placeholder.svg?height=200&width=300",
      discount: "Buy 1 Get 1",
      popular: false,
      icon: Pizza,
      color: "from-red-500 to-pink-500",
    },
    {
      id: 3,
      name: "Green Bowl",
      cuisine: "Healthy",
      rating: 4.9,
      deliveryTime: "20-30 min",
      image: "/placeholder.svg?height=200&width=300",
      discount: "15% OFF",
      popular: true,
      icon: Salad,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Sweet Dreams",
      cuisine: "Desserts",
      rating: 4.7,
      deliveryTime: "15-25 min",
      image: "/placeholder.svg?height=200&width=300",
      discount: "Free Delivery",
      popular: false,
      icon: IceCream,
      color: "from-pink-500 to-purple-500",
    },
  ]

  const categories = [
    { name: "Fast Food", icon: Sandwich, count: 45, color: "from-yellow-500 to-orange-500" },
    { name: "Pizza", icon: Pizza, count: 23, color: "from-red-500 to-pink-500" },
    { name: "Healthy", icon: Salad, count: 18, color: "from-green-500 to-emerald-500" },
    { name: "Desserts", icon: IceCream, count: 12, color: "from-pink-500 to-purple-500" },
    { name: "Coffee", icon: Coffee, count: 34, color: "from-amber-600 to-orange-600" },
    { name: "Soup", icon: Soup, count: 16, color: "from-blue-500 to-cyan-500" },
    { name: "Bakery", icon: Cookie, count: 28, color: "from-yellow-600 to-amber-600" },
    { name: "Cakes", icon: Cake, count: 15, color: "from-purple-500 to-pink-500" },
  ]

  const recentOrders = [
    {
      id: 1,
      restaurant: "Spice Garden",
      items: ["Butter Chicken", "Naan", "Rice"],
      total: 24.99,
      status: "delivered",
      date: "2024-01-15",
      rating: 5,
    },
    {
      id: 2,
      restaurant: "Pizza Palace",
      items: ["Margherita Pizza", "Garlic Bread"],
      total: 18.5,
      status: "delivered",
      date: "2024-01-12",
      rating: 4,
    },
  ]

  const userStats = {
    totalOrders: 47,
    favoriteRestaurants: 12,
    rewardPoints: 1250,
    savedAmount: 89.5,
    memberSince: "Jan 2024",
    level: "Gold Member",
  }

  const HomeTab = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Mobile Hero Section */}
      <div className="lg:hidden">
        <Card className="bg-gradient-to-r from-primary-blue to-secondary-blue text-white p-6 rounded-2xl border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Good Evening!</h2>
              <p className="text-white/90">What would you like to eat today?</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ChefHat size={32} className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span>{userStats.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <span>{userStats.rewardPoints} Points</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop Hero Section */}
      <div className="hidden lg:block">
        <Card className="bg-gradient-to-r from-primary-blue via-secondary-blue to-primary-blue text-white p-12 rounded-4xl border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-black">Good Evening, {user?.name?.split(" ")[0]}!</h2>
                <p className="text-2xl text-white/90 font-medium">What delicious meal are you craving today?</p>
              </div>
              <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <ChefHat size={64} className="text-white" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Award size={32} className="mx-auto mb-3" />
                <div className="text-2xl font-bold">{userStats.level}</div>
                <div className="text-white/80">Membership</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Zap size={32} className="mx-auto mb-3" />
                <div className="text-2xl font-bold">{userStats.rewardPoints}</div>
                <div className="text-white/80">Reward Points</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <DollarSign size={32} className="mx-auto mb-3" />
                <div className="text-2xl font-bold">${userStats.savedAmount}</div>
                <div className="text-white/80">Total Saved</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Target size={32} className="mx-auto mb-3" />
                <div className="text-2xl font-bold">{userStats.totalOrders}</div>
                <div className="text-white/80">Orders Placed</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          placeholder="Search restaurants, cuisines, or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 lg:pl-16 pr-4 lg:pr-6 py-3 lg:py-4 text-base lg:text-lg bg-background border-2 border-border rounded-xl lg:rounded-2xl focus:border-primary-blue transition-all duration-300"
        />
        <Button
          size="sm"
          className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 gradient-primary text-white rounded-lg lg:rounded-xl px-4 lg:px-6"
        >
          <Filter size={16} className="lg:w-5 lg:h-5" />
          <span className="hidden lg:inline ml-2">Filter</span>
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl lg:text-3xl font-bold text-foreground">Browse Categories</h3>
          <Button variant="ghost" className="text-primary-blue hover:text-dark-blue text-base lg:text-lg">
            View All <ArrowRight size={16} className="lg:w-5 lg:h-5 ml-1" />
          </Button>
        </div>

        {/* Mobile Categories */}
        <div className="lg:hidden grid grid-cols-4 gap-3">
          {categories.slice(0, 8).map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.name}
                className="p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer border-0 bg-card"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-xs font-semibold text-foreground truncate">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </Card>
            )
          })}
        </div>

        {/* Desktop Categories */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.name}
                className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-card group"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <Icon size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">{category.name}</h4>
                <p className="text-lg text-muted-foreground">{category.count} restaurants</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl lg:text-3xl font-bold text-foreground">Featured Restaurants</h3>
          <Button variant="ghost" className="text-primary-blue hover:text-dark-blue text-base lg:text-lg">
            View All <ArrowRight size={16} className="lg:w-5 lg:h-5 ml-1" />
          </Button>
        </div>

        {/* Mobile Restaurant Cards */}
        <div className="lg:hidden space-y-4">
          {featuredRestaurants.map((restaurant) => {
            const Icon = restaurant.icon
            return (
              <Card
                key={restaurant.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex">
                  <div className="w-24 h-24 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 flex items-center justify-center">
                    <Icon size={32} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                          {restaurant.name}
                          {restaurant.popular && <Crown size={16} className="text-yellow-500" />}
                        </h4>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="p-1">
                        <Heart size={16} className="text-muted-foreground" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="font-semibold">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock size={14} />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                      </div>
                      <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-semibold">
                        {restaurant.discount}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Desktop Restaurant Cards */}
        <div className="hidden lg:grid grid-cols-2 gap-8">
          {featuredRestaurants.map((restaurant) => {
            const Icon = restaurant.icon
            return (
              <Card
                key={restaurant.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 flex items-center justify-center">
                    <Icon size={64} className="text-muted-foreground group-hover:scale-110 transition-transform" />
                  </div>
                  {restaurant.popular && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Flame size={14} />
                      Popular
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 rounded-full p-2 shadow-lg"
                  >
                    <Heart size={18} />
                  </Button>
                  <div className="absolute bottom-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                    {restaurant.discount}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-1">{restaurant.name}</h4>
                      <p className="text-lg text-muted-foreground">{restaurant.cuisine} Cuisine</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star size={18} className="text-yellow-500 fill-current" />
                        <span className="font-bold text-lg">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={18} />
                        <span className="text-base">{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                    <Button className="gradient-primary text-white rounded-xl px-6 py-2 font-semibold hover:shadow-lg transition-all">
                      Order Now
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Actions - Desktop Only */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Truck size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">Track Order</h4>
            <p className="text-muted-foreground">Real-time delivery tracking</p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">Rewards</h4>
            <p className="text-muted-foreground">Redeem your points</p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Percent size={28} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">Offers</h4>
            <p className="text-muted-foreground">Exclusive deals for you</p>
          </Card>
        </div>
      </div>
    </div>
  )

  const OrdersTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Your Orders</h3>
        <Button className="gradient-primary text-white rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 font-semibold">
          <Plus size={16} className="lg:w-5 lg:h-5 mr-2" />
          New Order
        </Button>
      </div>

      {/* Mobile Orders */}
      <div className="lg:hidden space-y-4">
        {recentOrders.map((order) => (
          <Card key={order.id} className="p-4 border-0 shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-foreground">{order.restaurant}</h4>
                <p className="text-sm text-muted-foreground">{order.date}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">${order.total}</div>
                <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-semibold capitalize">
                  {order.status}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{order.items.join(", ")}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < order.rating ? "text-yellow-500 fill-current" : "text-neutral-gray"}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    <Eye size={12} className="mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="gradient-primary text-white text-xs">
                    Reorder
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Orders */}
      <div className="hidden lg:block space-y-6">
        {recentOrders.map((order) => (
          <Card key={order.id} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center">
                  <ChefHat size={28} className="text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-1">{order.restaurant}</h4>
                  <p className="text-lg text-muted-foreground mb-2">{order.items.join(", ")}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-base text-muted-foreground">{order.date}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < order.rating ? "text-yellow-500 fill-current" : "text-neutral-gray"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">${order.total}</div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl text-base font-semibold capitalize">
                    {order.status}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="px-6 py-3 text-base bg-transparent">
                    <Eye size={18} className="mr-2" />
                    View Details
                  </Button>
                  <Button className="gradient-primary text-white px-6 py-3 text-base">Reorder</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const FavoritesTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Your Favorites</h3>
        <div className="text-base lg:text-lg text-muted-foreground">{userStats.favoriteRestaurants} restaurants</div>
      </div>

      {/* Mobile Favorites */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {featuredRestaurants.slice(0, 3).map((restaurant) => {
          const Icon = restaurant.icon
          return (
            <Card key={restaurant.id} className="overflow-hidden border-0 shadow-lg">
              <div className="flex">
                <div className="w-20 h-20 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 flex items-center justify-center">
                  <Icon size={28} className="text-muted-foreground" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-foreground">{restaurant.name}</h4>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Heart size={16} className="text-red-500 fill-current" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="font-semibold text-sm">{restaurant.rating}</span>
                    </div>
                    <Button size="sm" className="gradient-primary text-white text-xs">
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Desktop Favorites */}
      <div className="hidden lg:grid grid-cols-2 gap-8">
        {featuredRestaurants.map((restaurant) => {
          const Icon = restaurant.icon
          return (
            <Card
              key={restaurant.id}
              className="overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-neutral-gray/20 to-neutral-gray/10 flex items-center justify-center">
                  <Icon size={64} className="text-muted-foreground group-hover:scale-110 transition-transform" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-500 rounded-full p-2 shadow-lg"
                >
                  <Heart size={18} className="fill-current" />
                </Button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-1">{restaurant.name}</h4>
                    <p className="text-lg text-muted-foreground">{restaurant.cuisine} Cuisine</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-500 fill-current" />
                      <span className="font-bold text-lg">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={18} />
                      <span className="text-base">{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                  <Button className="gradient-primary text-white rounded-xl px-6 py-2 font-semibold hover:shadow-lg transition-all">
                    Order Now
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const ProfileTab = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl lg:text-3xl font-bold text-foreground">Profile Settings</h3>
        <Button variant="outline" className="text-base lg:text-lg bg-transparent">
          <Settings size={16} className="lg:w-5 lg:h-5 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Mobile Profile */}
      <div className="lg:hidden space-y-6">
        <Card className="p-6 text-center border-0 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-1">{user?.name}</h4>
          <p className="text-muted-foreground mb-4">{user?.email}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary-blue/10 rounded-xl">
              <div className="text-lg font-bold text-foreground">{userStats.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Orders</div>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-xl">
              <div className="text-lg font-bold text-foreground">{userStats.rewardPoints}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {[
            { icon: CreditCard, label: "Payment Methods", color: "from-blue-500 to-blue-600" },
            { icon: MapPin, label: "Delivery Addresses", color: "from-green-500 to-green-600" },
            { icon: Bell, label: "Notifications", color: "from-yellow-500 to-yellow-600" },
            { icon: Gift, label: "Rewards & Offers", color: "from-purple-500 to-purple-600" },
            { icon: History, label: "Order History", color: "from-gray-500 to-gray-600" },
            { icon: Phone, label: "Help & Support", color: "from-red-500 to-red-600" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="p-4 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-foreground">{item.label}</span>
                  <ArrowRight size={16} className="text-muted-foreground ml-auto" />
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
              <div className="w-32 h-32 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={64} className="text-white" />
              </div>
              <h4 className="text-3xl font-bold text-foreground mb-2">{user?.name}</h4>
              <p className="text-xl text-muted-foreground mb-6">{user?.email}</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-blue/10 rounded-2xl">
                  <span className="text-lg font-semibold text-foreground">Member Since</span>
                  <span className="text-lg text-primary-blue font-bold">{userStats.memberSince}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-2xl">
                  <span className="text-lg font-semibold text-foreground">Status</span>
                  <span className="text-lg text-green-600 font-bold">{userStats.level}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 border-0 shadow-lg text-center">
                <BarChart3 size={32} className="text-primary-blue mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{userStats.totalOrders}</div>
                <div className="text-lg text-muted-foreground">Total Orders</div>
              </Card>
              <Card className="p-6 border-0 shadow-lg text-center">
                <Zap size={32} className="text-yellow-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{userStats.rewardPoints}</div>
                <div className="text-lg text-muted-foreground">Reward Points</div>
              </Card>
              <Card className="p-6 border-0 shadow-lg text-center">
                <Heart size={32} className="text-red-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{userStats.favoriteRestaurants}</div>
                <div className="text-lg text-muted-foreground">Favorite Places</div>
              </Card>
              <Card className="p-6 border-0 shadow-lg text-center">
                <DollarSign size={32} className="text-green-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">${userStats.savedAmount}</div>
                <div className="text-lg text-muted-foreground">Total Saved</div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: CreditCard,
                  label: "Payment Methods",
                  desc: "Manage your cards",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: MapPin,
                  label: "Delivery Addresses",
                  desc: "Your saved locations",
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: Bell,
                  label: "Notifications",
                  desc: "Customize alerts",
                  color: "from-yellow-500 to-yellow-600",
                },
                {
                  icon: Gift,
                  label: "Rewards & Offers",
                  desc: "Exclusive deals",
                  color: "from-purple-500 to-purple-600",
                },
                { icon: History, label: "Order History", desc: "View past orders", color: "from-gray-500 to-gray-600" },
                { icon: Phone, label: "Help & Support", desc: "Get assistance", color: "from-red-500 to-red-600" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Card
                    key={item.label}
                    className="p-6 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-muted-foreground ml-auto group-hover:text-primary-blue transition-colors"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{item.label}</h4>
                    <p className="text-base text-muted-foreground">{item.desc}</p>
                  </Card>
                )
              })}
            </div>
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
              <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-full flex items-center justify-center">
                <ChefHat size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">MessMaster</h1>
                <p className="text-sm text-muted-foreground">Welcome back!</p>
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
              { id: "home", icon: ChefHat, label: "Home" },
              { id: "orders", icon: ShoppingCart, label: "Orders" },
              { id: "favorites", icon: Heart, label: "Favorites" },
              { id: "profile", icon: User, label: "Profile" },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary-blue/10 text-primary-blue"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 pb-20">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="w-80 bg-card/50 backdrop-blur-lg border-r border-border flex flex-col">
          <div className="p-8 border-b border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">MessMaster</h1>
                <p className="text-base text-muted-foreground">Food Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-blue/10 to-primary-blue/5 rounded-2xl border border-primary-blue/20">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-xl flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{userStats.level}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {[
                { id: "home", icon: ChefHat, label: "Dashboard", desc: "Overview & recommendations" },
                { id: "orders", icon: ShoppingCart, label: "My Orders", desc: "Track your food orders" },
                { id: "favorites", icon: Heart, label: "Favorites", desc: "Your favorite restaurants" },
                { id: "profile", icon: User, label: "Profile", desc: "Account settings" },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full justify-start p-4 h-auto rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-primary-blue/10 text-primary-blue border border-primary-blue/20"
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
                <span className="text-base">Settings</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
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
                  {activeTab === "home" ? "Dashboard" : activeTab}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {activeTab === "home" && "Discover amazing food around you"}
                  {activeTab === "orders" && "Track and manage your orders"}
                  {activeTab === "favorites" && "Your favorite restaurants and dishes"}
                  {activeTab === "profile" && "Manage your account and preferences"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button size="lg" variant="ghost" className="relative">
                  <Bell size={24} className="text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </div>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === "home" && <HomeTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "favorites" && <FavoritesTab />}
            {activeTab === "profile" && <ProfileTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
