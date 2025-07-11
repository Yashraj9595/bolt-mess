"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Star, AlertCircle, Filter, Eye, Check, MessageCircle } from "lucide-react"

// Mock data for demonstration
const mockFeedback = [
  {
    id: "f1",
    userId: "u1",
    userName: "John Doe",
    type: "feedback",
    subject: "Food Quality",
    message: "The food quality has improved significantly in the last month. Keep up the good work!",
    rating: 4,
    date: "2024-06-01",
    status: "read",
  },
  {
    id: "f2",
    userId: "u2",
    userName: "Sarah Smith",
    type: "complaint",
    subject: "Cleanliness",
    message: "The dining area was not clean today. Please ensure better hygiene standards.",
    rating: 2,
    date: "2024-06-02",
    status: "unread",
  },
  {
    id: "f3",
    userId: "u3",
    userName: "Mike Johnson",
    type: "feedback",
    subject: "Menu Variety",
    message: "I would appreciate more variety in the breakfast menu. Otherwise, everything is good.",
    rating: 3,
    date: "2024-06-03",
    status: "read",
  },
  {
    id: "f4",
    userId: "u4",
    userName: "Emily Brown",
    type: "complaint",
    subject: "Food Temperature",
    message: "The food served today was cold. Please ensure hot food is served properly.",
    rating: 1,
    date: "2024-06-04",
    status: "unread",
  },
  {
    id: "f5",
    userId: "u5",
    userName: "Alex Wilson",
    type: "feedback",
    subject: "Staff Behavior",
    message: "The staff is very courteous and helpful. They make dining a pleasant experience.",
    rating: 5,
    date: "2024-06-05",
    status: "read",
  },
]

export function FeedbackComplaints() {
  const [activeTab, setActiveTab] = useState("all")
  const [openViewFeedback, setOpenViewFeedback] = useState(false)
  const [openReplyDialog, setOpenReplyDialog] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<typeof mockFeedback[0] | null>(null)

  // Filter feedback based on active tab
  const filteredFeedback = mockFeedback.filter((feedback) => {
    if (activeTab === "all") return true
    if (activeTab === "feedback") return feedback.type === "feedback"
    if (activeTab === "complaints") return feedback.type === "complaint"
    if (activeTab === "unread") return feedback.status === "unread"
    return true
  })

  // Calculate statistics
  const feedbackCount = mockFeedback.filter((f) => f.type === "feedback").length
  const complaintCount = mockFeedback.filter((f) => f.type === "complaint").length
  const unreadCount = mockFeedback.filter((f) => f.status === "unread").length
  
  const averageRating = 
    mockFeedback.reduce((sum, f) => sum + f.rating, 0) / mockFeedback.length

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  function handleViewFeedback(feedback: typeof mockFeedback[0]) {
    setSelectedFeedback(feedback)
    setOpenViewFeedback(true)
  }

  function handleReplyClick() {
    setOpenViewFeedback(false)
    setOpenReplyDialog(true)
  }

  function renderStars(rating: number) {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Feedback & Complaints</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
            <div className="mt-1">{renderStars(Math.round(averageRating))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackCount}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaintCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>
            Manage feedback and complaints from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="complaints">Complaints</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No feedback found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFeedback.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt={feedback.userName} />
                              <AvatarFallback>{getInitials(feedback.userName)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{feedback.userName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={feedback.type === "feedback" ? "default" : "destructive"}
                          >
                            {feedback.type === "feedback" ? "Feedback" : "Complaint"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {feedback.subject}
                        </TableCell>
                        <TableCell>{renderStars(feedback.rating)}</TableCell>
                        <TableCell>{feedback.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={feedback.status === "read" ? "outline" : "secondary"}
                          >
                            {feedback.status === "read" ? "Read" : "Unread"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFeedback(feedback)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Feedback Dialog */}
      <Dialog open={openViewFeedback} onOpenChange={setOpenViewFeedback}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFeedback?.type === "feedback" ? "Feedback" : "Complaint"} Details
            </DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={selectedFeedback.userName} />
                  <AvatarFallback>{getInitials(selectedFeedback.userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{selectedFeedback.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {selectedFeedback.date}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{selectedFeedback.subject}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center">
                  {renderStars(selectedFeedback.rating)}
                  <span className="ml-2 font-medium">{selectedFeedback.rating}/5</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="font-medium">{selectedFeedback.message}</p>
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setOpenViewFeedback(false)}>
                  Close
                </Button>
                <Button onClick={handleReplyClick}>
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={openReplyDialog} onOpenChange={setOpenReplyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to {selectedFeedback?.userName}</DialogTitle>
            <DialogDescription>
              Send a response to the user's {selectedFeedback?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                defaultValue={`Re: ${selectedFeedback?.subject}`}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your response here..."
                className="mt-1 min-h-[150px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenReplyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenReplyDialog(false)}>
                <Check className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
