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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, differenceInDays, addDays } from "date-fns"
import { Calendar as CalendarIcon, Check, X, Filter, Eye, Clock } from "lucide-react"

// Mock data for demonstration
const mockLeaveRequests = [
  {
    id: "l1",
    userId: "u1",
    userName: "John Doe",
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    reason: "Family function",
    status: "pending",
    createdAt: "2024-06-01",
  },
  {
    id: "l2",
    userId: "u2",
    userName: "Sarah Smith",
    startDate: "2024-06-15",
    endDate: "2024-06-20",
    reason: "Vacation",
    status: "approved",
    createdAt: "2024-05-25",
  },
  {
    id: "l3",
    userId: "u3",
    userName: "Mike Johnson",
    startDate: "2024-06-05",
    endDate: "2024-06-05",
    reason: "Medical appointment",
    status: "rejected",
    createdAt: "2024-06-02",
  },
  {
    id: "l4",
    userId: "u4",
    userName: "Emily Brown",
    startDate: "2024-06-22",
    endDate: "2024-06-25",
    reason: "Personal work",
    status: "pending",
    createdAt: "2024-06-03",
  },
  {
    id: "l5",
    userId: "u5",
    userName: "Alex Wilson",
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    reason: "Hometown visit",
    status: "pending",
    createdAt: "2024-06-04",
  },
]

const mockUsers = [
  { id: "u1", name: "John Doe" },
  { id: "u2", name: "Sarah Smith" },
  { id: "u3", name: "Mike Johnson" },
  { id: "u4", name: "Emily Brown" },
  { id: "u5", name: "Alex Wilson" },
]

export function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [openNewLeave, setOpenNewLeave] = useState(false)
  const [openViewLeave, setOpenViewLeave] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<typeof mockLeaveRequests[0] | null>(null)

  // Filter leave requests based on active tab
  const filteredLeaves = mockLeaveRequests.filter((leave) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return leave.status === "pending"
    if (activeTab === "approved") return leave.status === "approved"
    if (activeTab === "rejected") return leave.status === "rejected"
    return true
  })

  // Calculate leave statistics
  const pendingCount = mockLeaveRequests.filter((leave) => leave.status === "pending").length
  const approvedCount = mockLeaveRequests.filter((leave) => leave.status === "approved").length
  const rejectedCount = mockLeaveRequests.filter((leave) => leave.status === "rejected").length

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  function getDaysCount(start: string, end: string) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return differenceInDays(endDate, startDate) + 1
  }

  function handleViewLeave(leave: typeof mockLeaveRequests[0]) {
    setSelectedLeave(leave)
    setOpenViewLeave(true)
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return <Badge variant="default">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
        <Dialog open={openNewLeave} onOpenChange={setOpenNewLeave}>
          <DialogTrigger asChild>
            <Button>Request Leave</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
              <DialogDescription>
                Submit a new leave request for a user
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user">User</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea id="reason" placeholder="Enter reason for leave" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewLeave(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenNewLeave(false)}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>
            Manage leave requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No leave requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt={leave.userName} />
                              <AvatarFallback>{getInitials(leave.userName)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{leave.userName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {leave.startDate === leave.endDate
                            ? leave.startDate
                            : `${leave.startDate} to ${leave.endDate}`}
                        </TableCell>
                        <TableCell>{getDaysCount(leave.startDate, leave.endDate)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewLeave(leave)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {leave.status === "pending" && (
                              <>
                                <Button variant="outline" size="sm" className="text-green-600">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* View Leave Request Dialog */}
      <Dialog open={openViewLeave} onOpenChange={setOpenViewLeave}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={selectedLeave.userName} />
                  <AvatarFallback>{getInitials(selectedLeave.userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{selectedLeave.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    Requested on {selectedLeave.createdAt}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{selectedLeave.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{selectedLeave.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {getDaysCount(selectedLeave.startDate, selectedLeave.endDate)} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>{getStatusBadge(selectedLeave.status)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{selectedLeave.reason}</p>
              </div>

              {selectedLeave.status === "pending" && (
                <div className="flex space-x-2 justify-end">
                  <Button variant="outline" className="text-red-600">
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button className="text-white">
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
