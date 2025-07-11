"use client"

import React, { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Store, UtensilsCrossed, Clock, IndianRupee, Shield, Camera, Plus, ChevronLeft, Settings as SettingsIcon, X, UserIcon, Edit3, Trash2, Eye, EyeOff } from "lucide-react" 
import { MobileNavigation } from "./mobile-navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SECTIONS = [
  { id: "mess-profile", label: "Mess Profile", icon: Store },
  { id: "meal-plans", label: "Meal Plans", icon: UtensilsCrossed },
  { id: "operating-hours", label: "Operating Hours", icon: Clock },
  { id: "payment", label: "Payment", icon: IndianRupee },
  { id: "security", label: "Security", icon: Shield },
]

export function SettingsScreen() {
  const { user } = useAuth()
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const navigate = useNavigate();
  const [messProfile, setMessProfile] = useState({
    name: "",
    location: {
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      country: "India"
    },
    colleges: [] as string[],
    collegeInput: "",
    ownerPhone: "",
    ownerEmail: "",
    types: [] as string[],
    logo: null as string | null
  })
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Meal Plans state and handlers
  const [mealPlans, setMealPlans] = useState([
    {
      id: 1,
      name: "Basic Plan",
      price: 1500,
      meals: "2 meals/day",
      type: "Regular",
      description: "Breakfast and Dinner",
      active: true,
    },
    {
      id: 2,
      name: "Premium Plan",
      price: 3000,
      meals: "3 meals/day",
      type: "Regular",
      description: "Breakfast, Lunch and Dinner",
      active: true,
    },
    {
      id: 3,
      name: "Student Plan",
      price: 1200,
      meals: "2 meals/day",
      type: "Student discount",
      description: "Special rates for students",
      active: true,
    },
  ])
  const [showMealPlanDialog, setShowMealPlanDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [mealPlanForm, setMealPlanForm] = useState({
    name: "",
    price: "",
    meals: "",
    type: "",
    description: "",
    active: true,
  })

  // Payment Section State
  const [upiId, setUpiId] = useState("mess@upi")
  const [bankAccount, setBankAccount] = useState("****1234")
  const [autoPayment, setAutoPayment] = useState(true)
  const [lateFee, setLateFee] = useState(true)
  const [lateFeeAmount, setLateFeeAmount] = useState(50)

  // Operating Hours Section State
  const [operatingHours, setOperatingHours] = useState([
    {
      meal: "breakfast",
      enabled: true,
      start: "07:00",
      end: "10:00",
    },
    {
      meal: "lunch",
      enabled: true,
      start: "12:00",
      end: "15:00",
    },
    {
      meal: "dinner",
      enabled: true,
      start: "19:00",
      end: "22:00",
    },
  ])

  // Security Section State
  const [profileVisible, setProfileVisible] = useState(true)
  const [contactVisible, setContactVisible] = useState(true)
  const [ratingsVisible, setRatingsVisible] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Photo upload handler
  const handlePhotoClick = () => fileInputRef.current?.click()
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Mess Type options
  const messTypeOptions = ["Veg", "Non-Veg", "Mixed"]

  // Handlers
  const handleMessProfileChange = (field: string, value: any) => {
    setMessProfile((prev) => ({ ...prev, [field]: value }))
  }
  const handleLocationChange = (field: string, value: string) => {
    setMessProfile((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }))
  }
  const handleAddCollege = () => {
    if (messProfile.collegeInput.trim()) {
      setMessProfile((prev) => ({
        ...prev,
        colleges: [...prev.colleges, prev.collegeInput.trim()],
        collegeInput: ""
      }))
    }
  }
  const handleRemoveCollege = (idx: number) => {
    setMessProfile((prev) => ({
      ...prev,
      colleges: prev.colleges.filter((_, i) => i !== idx)
    }))
  }
  const handleMessTypeToggle = (type: string) => {
    setMessProfile((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type]
    }))
  }
  const handleLogoClick = () => logoInputRef.current?.click()
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => handleMessProfileChange("logo", reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMealPlanFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMealPlanForm((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleAddMealPlan = () => {
    setMealPlanForm({
      name: "",
      price: "",
      meals: "",
      type: "",
      description: "",
      active: true,
    })
    setEditingPlan(null)
    setShowMealPlanDialog(true)
  }
  
  const handleEditMealPlan = (plan: any) => {
    setMealPlanForm({
      name: plan.name,
      price: String(plan.price),
      meals: plan.meals,
      type: plan.type,
      description: plan.description || "",
      active: plan.active,
    })
    setEditingPlan(plan)
    setShowMealPlanDialog(true)
  }
  
  const handleDeleteMealPlan = (id: number) => {
    setMealPlans((prev) => prev.filter((plan) => plan.id !== id))
  }
  
  const handleMealPlanFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPlan) {
      setMealPlans((prev) => 
        prev.map((plan) => 
          plan.id === editingPlan.id 
            ? { 
                ...plan, 
                name: mealPlanForm.name,
                price: Number(mealPlanForm.price),
                meals: mealPlanForm.meals,
                type: mealPlanForm.type,
                description: mealPlanForm.description,
                active: mealPlanForm.active
              } 
            : plan
        )
      )
    } else {
      const newId = Math.max(0, ...mealPlans.map(p => p.id)) + 1
      setMealPlans((prev) => [
        ...prev, 
        { 
          id: newId,
          name: mealPlanForm.name,
          price: Number(mealPlanForm.price),
          meals: mealPlanForm.meals,
          type: mealPlanForm.type,
          description: mealPlanForm.description,
          active: mealPlanForm.active
        }
      ])
    }
    
    setShowMealPlanDialog(false)
    setMealPlanForm({
      name: "",
      price: "",
      meals: "",
      type: "",
      description: "",
      active: true,
    })
    setEditingPlan(null)
  }

  const handleOperatingHourChange = (idx: number, field: string, value: string | boolean) => {
    setOperatingHours((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    )
  }

  const handleUpdatePassword = () => {
    // TODO: Implement password update logic (API call, validation, etc.)
    // For now, just clear the fields
    setCurrentPassword("")
    setNewPassword("")
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    // Optionally show a toast/notification
  }

  // Save All Handler
  const handleSaveAll = async () => {
    try {
      // Placeholder: Replace with real API calls
      // await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ ... }) })
      // Simulate API call
      await new Promise(res => setTimeout(res, 800));
      toast({ title: "Settings saved", description: "All your changes have been saved successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  }

  // Mess Profile Section
  const messProfileSection = (
    <form className="space-y-5" encType="application/x-www-form-urlencoded">
      {/* Mess Name */}
      <div>
        <Label htmlFor="mess-name">Mess Name</Label>
        <Input
          id="mess-name"
          value={messProfile.name}
          onChange={e => handleMessProfileChange("name", e.target.value)}
          placeholder="e.g. The Green Mess, Student Mess"
        />
      </div>
      {/* Mess Location */}
      <div className="space-y-2">
        <Label>Mess Location</Label>
        <div className="grid grid-cols-1 gap-2">
          <Input
            placeholder="Street/Area"
            value={messProfile.location.street}
            onChange={e => handleLocationChange("street", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="City/Town" value={messProfile.location.city} onChange={e => handleLocationChange("city", e.target.value)} />
            <Input placeholder="District" value={messProfile.location.district} onChange={e => handleLocationChange("district", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="State" value={messProfile.location.state} onChange={e => handleLocationChange("state", e.target.value)} />
            <Input placeholder="Pincode" value={messProfile.location.pincode} onChange={e => handleLocationChange("pincode", e.target.value)} />
          </div>
          <Input placeholder="Country" value={messProfile.location.country} onChange={e => handleLocationChange("country", e.target.value)} />
          <Button type="button" variant="outline" className="w-full mt-1" disabled>
            {/* Placeholder for Google location integration */}
            Use Google Location (Coming Soon)
          </Button>
        </div>
      </div>
      {/* Nearby Colleges */}
      <div>
        <Label>Nearby Colleges</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add college/institution"
            value={messProfile.collegeInput}
            onChange={e => handleMessProfileChange("collegeInput", e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCollege(); } }}
          />
          <Button type="button" size="icon" variant="secondary" onClick={handleAddCollege} aria-label="Add college">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {messProfile.colleges.map((college, idx) => (
            <Badge key={idx} className="flex items-center gap-1 bg-primary-blue text-white">
              {college}
              <button type="button" onClick={() => handleRemoveCollege(idx)} aria-label="Remove">
                <X className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      {/* Mess Owner Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="owner-phone">Owner Phone</Label>
          <Input
            id="owner-phone"
            type="tel"
            value={messProfile.ownerPhone}
            onChange={e => handleMessProfileChange("ownerPhone", e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div>
          <Label htmlFor="owner-email">Owner Email</Label>
          <Input
            id="owner-email"
            type="email"
            value={messProfile.ownerEmail}
            onChange={e => handleMessProfileChange("ownerEmail", e.target.value)}
            placeholder="Email address"
          />
        </div>
      </div>
      {/* Mess Type */}
      <div>
        <Label>Mess Type</Label>
        <div className="flex gap-2 flex-wrap mt-1">
          {messTypeOptions.map(type => (
            <Button
              key={type}
              type="button"
              variant={messProfile.types.includes(type) ? "default" : "outline"}
              className={messProfile.types.includes(type) ? "bg-brand-primary text-white" : ""}
              onClick={() => handleMessTypeToggle(type)}
              aria-pressed={messProfile.types.includes(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      {/* Mess Logo/Image */}
      <div>
        <Label>Mess Logo/Image</Label>
        <div className="flex items-center gap-4 mt-2">
          <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {messProfile.logo ? (
              <img src={messProfile.logo} alt="Mess Logo" className="object-cover w-full h-full" />
            ) : (
              <Camera className="h-6 w-6 text-muted-foreground" />
            )}
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full bg-brand-primary text-white border-2 border-background shadow hover:bg-brand-dark"
              onClick={handleLogoClick}
              aria-label="Upload logo"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>
      </div>
    </form>
  )

  // Meal Plans Section
  const MealPlansSection = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Meal Plans</h3>
            <p className="text-sm text-muted-foreground">Manage your meal plans and pricing</p>
          </div>
          <Button onClick={handleAddMealPlan} className="bg-brand-primary hover:bg-brand-dark text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="grid gap-4">
          {mealPlans.map((plan) => (
            <Card key={plan.id} className="border-l-4 border-l-brand-primary shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{plan.name}</h4>
                      <Badge variant={plan.active ? "default" : "secondary"} className={`text-xs ${plan.active ? "bg-brand-secondary text-white" : ""}`}>
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        <span>₹{plan.price}/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>{plan.meals}</span>
                      </div>
                      <div>
                        <span className="font-medium">{plan.type}</span>
                      </div>
                    </div>
                    {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-brand-primary"
                      onClick={() => handleEditMealPlan(plan)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteMealPlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meal Plan Dialog */}
        <Dialog open={showMealPlanDialog} onOpenChange={setShowMealPlanDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Meal Plan" : "Add New Meal Plan"}</DialogTitle>
              <DialogDescription>
                {editingPlan ? "Update the meal plan details" : "Create a new meal plan for your mess"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMealPlanFormSubmit} className="space-y-4" encType="application/x-www-form-urlencoded">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    name="name"
                    placeholder="e.g. Basic Plan"
                    value={mealPlanForm.name}
                    onChange={handleMealPlanFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan-price">Price (₹/month)</Label>
                  <Input
                    id="plan-price"
                    name="price"
                    placeholder="1500"
                    type="number"
                    value={mealPlanForm.price}
                    onChange={handleMealPlanFormChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-meals">Meals</Label>
                  <Input
                    id="plan-meals"
                    name="meals"
                    placeholder="e.g. 2 meals/day"
                    value={mealPlanForm.meals}
                    onChange={handleMealPlanFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan-type">Type</Label>
                  <Select
                    value={mealPlanForm.type}
                    onValueChange={(value) => setMealPlanForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Student discount">Student Discount</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description (Optional)</Label>
                <Textarea
                  id="plan-description"
                  name="description"
                  placeholder="Brief description of what's included in this plan"
                  value={mealPlanForm.description}
                  onChange={handleMealPlanFormChange}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-active"
                  checked={mealPlanForm.active}
                  onCheckedChange={(checked: boolean) => setMealPlanForm((prev) => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="plan-active">Active Plan</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowMealPlanDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white">
                  {editingPlan ? "Update Plan" : "Add Plan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Payment Section Component
  const PaymentSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="upiId" className="text-gray-700 dark:text-gray-300">UPI ID</Label>
          <Input
            id="upiId"
            placeholder="your-upi@bank"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-brand-primary dark:focus:border-brand-secondary"
          />
        </div>
        <div>
          <Label htmlFor="bankAccount" className="text-gray-700 dark:text-gray-300">Bank Account</Label>
          <Input
            id="bankAccount"
            placeholder="Account number"
            value={bankAccount}
            onChange={e => setBankAccount(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-brand-primary dark:focus:border-brand-secondary"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-medium">Auto Payment</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">Automatic payment processing</p>
          </div>
          <Switch checked={autoPayment} onCheckedChange={setAutoPayment} />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-medium">Late Fee</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">Charge late payment fees</p>
          </div>
          <Switch checked={lateFee} onCheckedChange={setLateFee} />
        </div>
        <div>
          <Label htmlFor="lateFeeAmount" className="text-gray-700 dark:text-gray-300">Late Fee Amount (₹)</Label>
          <Input
            id="lateFeeAmount"
            type="number"
            value={lateFeeAmount}
            onChange={e => setLateFeeAmount(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-brand-primary dark:focus:border-brand-secondary"
          />
        </div>
      </div>
    </div>
  )

  // Operating Hours Section Component
  const OperatingHoursSection = () => (
    <div className="px-0 md:px-6 pb-6 pt-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Operating Hours</h3>
          <p className="text-sm text-muted-foreground">Set your mess operating hours for different meals</p>
        </div>
        <div className="space-y-4">
          {operatingHours.map((meal, idx) => (
            <Card key={meal.meal} className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={meal.enabled}
                    onCheckedChange={checked => handleOperatingHourChange(idx, "enabled", checked)}
                  />
                  <Label className="text-base font-medium capitalize">{meal.meal}</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium leading-none">Start Time</Label>
                  <Input
                    type="time"
                    value={meal.start}
                    onChange={e => handleOperatingHourChange(idx, "start", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium leading-none">End Time</Label>
                  <Input
                    type="time"
                    value={meal.end}
                    onChange={e => handleOperatingHourChange(idx, "end", e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  // Security Section Component
  const SecuritySection = () => (
    <div className="rounded-lg border text-card-foreground border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      <div className="pt-0 px-6 pb-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Profile Visible</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow users to view your profile</p>
              </div>
              <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Contact Visible</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Show contact information to users</p>
              </div>
              <Switch checked={contactVisible} onCheckedChange={setContactVisible} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Ratings Visible</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Display ratings and reviews publicly</p>
              </div>
              <Switch checked={ratingsVisible} onCheckedChange={setRatingsVisible} />
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent rounded-md absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowCurrentPassword(v => !v)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">New Password</Label>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <Button
              className="h-10 px-4 py-2 bg-red-600 hover:bg-red-700 text-white mt-2"
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Accordion Sections
  const accordion = (
    <Accordion type="multiple" className="space-y-3">
      <AccordionItem
        value="mess-profile"
        className="rounded-xl border border-border bg-card/80 backdrop-blur-md"
      >
        <AccordionTrigger className="px-4 py-3 text-base font-medium flex items-center gap-3">
          <Store className="h-5 w-5 text-brand-primary" />
          <span>Mess Profile</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          {messProfileSection}
        </AccordionContent>
      </AccordionItem>
      {SECTIONS.filter(s => s.id !== "mess-profile").map(({ id, label, icon: Icon }) => (
        <AccordionItem
          key={id}
          value={id}
          className="rounded-xl border border-border bg-card/80 backdrop-blur-md"
        >
          <AccordionTrigger className="px-4 py-3 text-base font-medium flex items-center gap-3">
            <Icon className="h-5 w-5 text-brand-primary" />
            <span>{label}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {id === "meal-plans" ? (
              <MealPlansSection />
            ) : id === "payment" ? (
              <PaymentSection />
            ) : id === "operating-hours" ? (
              <OperatingHoursSection />
            ) : id === "security" ? (
              <SecuritySection />
            ) : (
              <div className="text-muted-foreground text-sm">{label} settings go here.</div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

  // Header
  const header = (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-background sticky top-0 z-10 border-b border-border">
      <h1 className="text-lg font-semibold text-foreground">Settings</h1>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-foreground hover:text-brand-primary" 
        onClick={() => navigate("/mess-owner/profile")}
        aria-label="Go to profile"
      > 
        <UserIcon className="h-6 w-6" />
      </Button>
    </div>
  )

  // Photo Upload
  const photoUpload = (
    <div className="flex flex-col items-center mt-6 mb-6">
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center">
          {avatar ? (
            <Avatar className="w-28 h-28">
              <AvatarImage src={avatar} alt="Mess photo" />
              <AvatarFallback><Camera className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
            </Avatar>
          ) : (
            <Camera className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute bottom-2 right-2 rounded-full bg-brand-primary text-white border-2 border-background shadow-lg hover:bg-brand-dark"
          onClick={handlePhotoClick}
          aria-label="Upload mess photo"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>
      <span className="mt-3 text-sm text-muted-foreground">Upload mess photo</span>
      <div className="mt-4 w-full flex flex-col items-center">
        <span className="text-base font-semibold text-foreground flex items-center gap-2">
          <Store className="h-5 w-5 text-brand-primary" />
          Mess name
        </span>
        <span className="text-lg font-bold text-brand-primary mt-1">Your Mess</span>
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">0 Users</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <polygon points="10,1.5 12.59,7.36 18.9,7.97 14,12.14 15.45,18.36 10,15.1 4.55,18.36 6,12.14 1.1,7.97 7.41,7.36" />
            </svg>
            <span className="text-sm text-muted-foreground">4.5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Main Layout
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${isMobile ? "pb-24" : ""}`}>
      {header}
      <div className={`flex-1 flex flex-col ${isMobile ? "px-2 max-w-md mx-auto w-full" : "px-8 max-w-2xl mx-auto w-full"}`}>
        {photoUpload}
        {accordion}
        <div className="flex justify-end mt-8">
          <Button
            className="bg-brand-primary hover:bg-brand-dark text-white px-8 py-2 font-semibold text-base rounded-lg shadow-md"
            onClick={handleSaveAll}
          >
            Save All
          </Button>
        </div>
      </div>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
          <MobileNavigation 
            activeSection="settings" 
            onSectionChange={(section) => {
              if (section === "settings") {
                // Already on settings page
                return;
              } else if (section === "profile") {
                navigate("/mess-owner/profile");
              } else {
                navigate("/mess-owner/dashboard");
              }
            }} 
          />
        </div>
      )}
    </div>
  )
}
