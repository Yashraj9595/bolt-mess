"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Plus, ChevronLeft, Settings as SettingsIcon, UserIcon, Edit3, LogOut } from "lucide-react" 
import { MobileNavigation } from "./mobile-navigation"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/components/theme/theme-provider";
import { format } from "date-fns"

export function Profile() {
  const { user, updateUser, logout, updateProfile, uploadAvatar } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      district: user?.address?.district || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      country: user?.address?.country || "India"
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          district: user.address?.district || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
          country: user.address?.country || "India"
        }
      })
      setAvatar(user.avatar || null)
    }
  }, [user])

  const handlePhotoClick = () => fileInputRef.current?.click()
  
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ 
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ 
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        })
        return
      }

      try {
        // Convert to base64 for preview
        const reader = new FileReader()
        reader.onload = () => setAvatar(reader.result as string)
        reader.readAsDataURL(file)
  
        // Upload to server using auth context
        const avatarUrl = await uploadAvatar(file)
        if (avatarUrl) {
          setAvatar(avatarUrl)
        }
        toast({ title: "Avatar updated successfully" })
      } catch (error) {
        console.error('Avatar upload failed:', error)
        toast({ 
          title: "Failed to update avatar",
          variant: "destructive"
        })
      }
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    isAddress: boolean = false
  ) => {
    if (isAddress) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: e.target.value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }))
    }
  }

  const handleSave = async () => {
    try {
      const success = await updateProfile(formData)
      if (!success) {
        throw new Error('Failed to update profile')
      }
      
      setIsEditing(false)
      toast({ title: "Profile updated successfully" })
    } catch (error) {
      console.error('Profile update failed:', error)
      toast({ 
        title: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      toast({ 
        title: "Failed to logout",
        variant: "destructive"
      })
    }
  }

  // Header
  const header = (
    <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-background sticky top-0 z-10 border-b border-border">
          <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="md:hidden"
        >
          <ChevronLeft className="h-6 w-6" />
            </Button>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
            </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className="text-foreground hover:text-brand-primary"
        >
          <Edit3 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/mess-owner/settings")}
          className="text-foreground hover:text-brand-primary"
        >
          <SettingsIcon className="h-5 w-5" />
          </Button>
        </div>
    </div>
  )

  // Profile Header
  const profileHeader = (
    <div className="flex flex-col items-center mt-6 mb-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-xl">
          {avatar ? (
            <Avatar className="w-full h-full">
              <AvatarImage src={avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserIcon className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        {isEditing && (
            <Button 
            type="button"
              size="icon" 
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full bg-brand-primary text-white border-2 border-background shadow hover:bg-brand-dark"
            onClick={handlePhotoClick}
            >
            <Camera className="h-4 w-4" />
            </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-foreground">{user?.name}</h2>
      <Badge variant="secondary" className="mt-2">
        {user?.role === 'mess_owner' ? 'Mess Owner' : user?.role}
      </Badge>
    </div>
  )

  // Personal Section
  const personalSection = (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange(e, 'name')}
            disabled={!isEditing}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            disabled={!isEditing}
            type="email"
            placeholder="Enter your email address"
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => handleInputChange(e, 'phone')}
            disabled={!isEditing}
            type="tel"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="space-y-2">
          <Label>Join Date</Label>
          <Input
            value={user?.createdAt ? format(new Date(user.createdAt), 'PPP') : ''}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  )

  // Address Section
  const addressSection = (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Street/Area</Label>
          <Input
            value={formData.address.street}
            onChange={(e) => handleInputChange(e, 'street', true)}
            disabled={!isEditing}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City/Town</Label>
            <Input
              value={formData.address.city}
              onChange={(e) => handleInputChange(e, 'city', true)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>District</Label>
            <Input
              value={formData.address.district}
              onChange={(e) => handleInputChange(e, 'district', true)}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              value={formData.address.state}
              onChange={(e) => handleInputChange(e, 'state', true)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input
              value={formData.address.pincode}
              onChange={(e) => handleInputChange(e, 'pincode', true)}
              disabled={!isEditing}
              type="text"
              pattern="[0-9]*"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            value={formData.address.country}
            onChange={(e) => handleInputChange(e, 'country', true)}
            disabled={!isEditing}
          />
                </div>
      </CardContent>
    </Card>
  )

  // Subscription Section
  const subscriptionSection = user?.subscription && (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Current Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
                    <div>
            <Label className="text-sm text-muted-foreground">Plan</Label>
            <p className="font-medium">{user.subscription.plan}</p>
                  </div>
                    <div>
            <Label className="text-sm text-muted-foreground">Status</Label>
            <Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'}>
              {user.subscription.status}
            </Badge>
                    </div>
                  </div>
        <div className="grid grid-cols-2 gap-4">
                    <div>
            <Label className="text-sm text-muted-foreground">Start Date</Label>
            <p className="font-medium">
              {user.subscription.startDate ? format(new Date(user.subscription.startDate), 'PPP') : 'N/A'}
            </p>
            </div>
                  <div>
            <Label className="text-sm text-muted-foreground">Renewal Date</Label>
            <p className="font-medium">
              {user.subscription.renewalDate ? format(new Date(user.subscription.renewalDate), 'PPP') : 'N/A'}
            </p>
                </div>
              </div>
              <div>
          <Label className="text-sm text-muted-foreground">Amount</Label>
          <p className="font-medium">₹{user.subscription.amount || 0}</p>
                  </div>
        <Button className="w-full" variant="outline" onClick={() => navigate('/subscription')}>
          Manage Subscription
                  </Button>
      </CardContent>
    </Card>
  )

  // Payment History Section
  const paymentHistorySection = user?.paymentHistory && user.paymentHistory.length > 0 && (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.paymentHistory.map((payment, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
              <p className="font-medium">₹{payment.amount}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(payment.paymentDate), 'PPP')}
              </p>
                      </div>
                        <div className="text-right">
              <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                            {payment.status}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">{payment.method}</p>
                      </div>
                    </div>
                  ))}
      </CardContent>
    </Card>
  )

  // Settings Section
  const settingsSection = (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
              </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  )

  // Action Buttons
  const actionButtons = isEditing && (
    <div className="flex gap-4 mt-6 mb-8">
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => {
          setIsEditing(false)
          setFormData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: {
              street: user?.address?.street || "",
              city: user?.address?.city || "",
              district: user?.address?.district || "",
              state: user?.address?.state || "",
              pincode: user?.address?.pincode || "",
              country: user?.address?.country || "India"
            }
          })
        }}
      >
        Cancel
      </Button>
                <Button 
        className="flex-1 bg-brand-primary hover:bg-brand-dark text-white"
        onClick={handleSave}
                >
        Save Changes
                </Button>
              </div>
  )

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${isMobile ? "pb-24" : ""}`}>
      {header}
      <div className={`flex-1 flex flex-col ${isMobile ? "px-4" : "px-8"} max-w-2xl mx-auto w-full`}>
        {profileHeader}
        {personalSection}
        {addressSection}
        {subscriptionSection}
        {paymentHistorySection}
        {settingsSection}
        {actionButtons}
      </div>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
          <MobileNavigation 
            activeSection="profile" 
            onSectionChange={(section) => {
              if (section === "profile") {
                // Already on profile page
                return;
              } else if (section === "settings") {
                navigate("/mess-owner/settings");
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