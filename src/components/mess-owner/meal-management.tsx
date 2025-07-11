"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { UtensilsCrossed, Plus, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// Mock data for demonstration
const mockMeals = [
  {
    id: 1,
    name: "Standard Meal Plan",
    description: "Regular 3 meals per day",
    price: 3000,
    active: true,
  },
  {
    id: 2,
    name: "Vegetarian Plan",
    description: "Vegetarian meals only",
    price: 2800,
    active: true,
  },
  {
    id: 3,
    name: "Premium Plan",
    description: "Premium meals with special items",
    price: 4500,
    active: true,
  },
  {
    id: 4,
    name: "Weekend Plan",
    description: "Meals for weekends only",
    price: 1200,
    active: false,
  },
]

const mockMenuItems = [
  {
    id: 1,
    name: "Vegetable Pulao",
    category: "Main Course",
    type: "Vegetarian",
    mealTime: "Lunch",
    day: "Monday",
  },
  {
    id: 2,
    name: "Chicken Curry",
    category: "Main Course",
    type: "Non-Vegetarian",
    mealTime: "Dinner",
    day: "Monday",
  },
  {
    id: 3,
    name: "Masala Dosa",
    category: "Breakfast",
    type: "Vegetarian",
    mealTime: "Breakfast",
    day: "Tuesday",
  },
  {
    id: 4,
    name: "Paneer Butter Masala",
    category: "Main Course",
    type: "Vegetarian",
    mealTime: "Lunch",
    day: "Wednesday",
  },
  {
    id: 5,
    name: "Fish Curry",
    category: "Main Course",
    type: "Non-Vegetarian",
    mealTime: "Dinner",
    day: "Thursday",
  },
]

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const mealTimes = ["Breakfast", "Lunch", "Dinner"]

export function MealManagement() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("meal-plans")
  const [openNewMealPlan, setOpenNewMealPlan] = useState(false)
  const [openNewMenuItem, setOpenNewMenuItem] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Meal Management</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="menu">Weekly Menu</TabsTrigger>
          <TabsTrigger value="special">Special Meals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meal-plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Available Meal Plans</h3>
            <Dialog open={openNewMealPlan} onOpenChange={setOpenNewMealPlan}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Meal Plan</DialogTitle>
                  <DialogDescription>
                    Create a new meal plan for your mess
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input id="name" placeholder="Enter plan name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the meal plan" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₹ per month)</Label>
                    <Input id="price" type="number" placeholder="0" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="active" />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNewMealPlan(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setOpenNewMealPlan(false)}>Save Plan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {mockMeals.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <Badge variant={plan.active ? "default" : "outline"}>
                    {plan.active ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold">₹{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Weekly Menu</h3>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Dialog open={openNewMenuItem} onOpenChange={setOpenNewMenuItem}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Menu Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to your weekly menu
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input id="item-name" placeholder="Enter item name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="main-course">Main Course</SelectItem>
                          <SelectItem value="side-dish">Side Dish</SelectItem>
                          <SelectItem value="dessert">Dessert</SelectItem>
                          <SelectItem value="beverage">Beverage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="day">Day</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {weekDays.map((day) => (
                            <SelectItem key={day} value={day.toLowerCase()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meal-time">Meal Time</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal time" />
                        </SelectTrigger>
                        <SelectContent>
                          {mealTimes.map((time) => (
                            <SelectItem key={time} value={time.toLowerCase()}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenNewMenuItem(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setOpenNewMenuItem(false)}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Meal Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMenuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === "Vegetarian" ? "secondary" : "default"}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.day}</TableCell>
                      <TableCell>{item.mealTime}</TableCell>
                      <TableCell className="text-right">
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="special" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Meals & Events</CardTitle>
              <CardDescription>
                Configure special meals and festive menus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Upcoming Special Meals</h4>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Special Meal
                  </Button>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Special Meals</h3>
                  <p className="text-sm text-muted-foreground">
                    Add special meals for festivals or events
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
