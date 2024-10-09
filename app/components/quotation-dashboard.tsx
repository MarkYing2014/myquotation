'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, DollarSign, Users, PlusCircle, Search, FileText } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for recent quotations
const recentQuotations = [
  { id: '001', customer: 'John Doe', total: 2500, date: '2023-10-01' },
  { id: '002', customer: 'Jane Smith', total: 3200, date: '2023-10-03' },
  { id: '003', customer: 'Bob Johnson', total: 1800, date: '2023-10-05' },
  { id: '004', customer: 'Alice Brown', total: 4100, date: '2023-10-07' },
]

// Mock data for monthly revenue
const monthlyRevenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
  { name: 'Aug', revenue: 8000 },
  { name: 'Sep', revenue: 7500 },
  { name: 'Oct', revenue: 9000 },
  { name: 'Nov', revenue: 8500 },
  { name: 'Dec', revenue: 10000 },
]

export default function QuotationDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    console.log('Searching for:', searchTerm)
    // Implement search functionality here
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shutter Quotation Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-blue-600">+14% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-yellow-600">+201 since last month</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-purple-600">+8 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => console.log('Create new quotation')}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Quotation
        </Button>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="mb-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Quotations</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quotations</CardTitle>
              <CardDescription>A list of recent quotations from the past 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuotations.map((quotation) => (
                  <div key={quotation.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{quotation.customer}</p>
                      <p className="text-sm text-muted-foreground">ID: {quotation.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${quotation.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{quotation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>Quotations waiting for approval.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No quotations pending approval.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Installations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Johnson Residence</p>
                  <p className="text-sm text-muted-foreground">October 15, 2023</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Smith Office Building</p>
                  <p className="text-sm text-muted-foreground">October 18, 2023</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Brown Family Home</p>
                  <p className="text-sm text-muted-foreground">October 22, 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}