'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, Calendar, DollarSign, Users, PlusCircle, Search, FileText } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

interface Quotation {
  id: string;
  customer: string;
  total: number;
  date: string;
}

interface MonthlyRevenue {
  name: string;
  revenue: number;
}

export default function QuotationDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('name')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([])
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...');
      try {
        setIsLoading(true)
        const response = await fetch('/api/quotations')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to fetch data: ${errorData.error || response.statusText}`)
        }
        const data = await response.json()
        console.log('Fetched data:', data)
        setQuotations(data.quotations)
        setFilteredQuotations(data.quotations)
        setMonthlyRevenueData(data.monthlyRevenue)
        setError(null)
      } catch (error: unknown) {
        console.error('Error fetching data:', error)
        if (error instanceof Error) {
          setError(`Failed to load data. ${error.message}`)
        } else {
          setError('Failed to load data. An unknown error occurred.')
        }
      } finally {
        setIsLoading(false)
        console.log('Data fetching complete');
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    console.log('Date filter effect triggered. Start:', startDate, 'End:', endDate);
    if (startDate && endDate) {
      const filteredResults = quotations.filter(quotation => {
        const quotationDate = parseISO(quotation.date);
        return isAfter(quotationDate, startOfDay(startDate)) && isBefore(quotationDate, endOfDay(endDate));
      });
      console.log('Filtered results:', filteredResults);
      setFilteredQuotations(filteredResults);
    } else {
      setFilteredQuotations(quotations);
    }
  }, [startDate, endDate, quotations]);

  const handleStartDateChange = (date: Date | undefined) => {
    console.log('Start date changed:', date);
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    console.log('End date changed:', date);
    setEndDate(date);
  };

  const handleSearch = () => {
    console.log('handleSearch called');
    console.log(`Search type: ${searchType}, Start date: ${startDate}, End date: ${endDate}`);
    
    let filtered = quotations

    if (searchType === 'name' && searchTerm) {
      console.log(`Filtering by name: ${searchTerm}`);
      filtered = filtered.filter(q => 
        q.customer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } else if (searchType === 'price') {
      console.log(`Filtering by price range: ${minPrice} - ${maxPrice}`);
      const min = minPrice ? parseFloat(minPrice) : 0
      const max = maxPrice ? parseFloat(maxPrice) : Infinity
      filtered = filtered.filter(q => q.total >= min && q.total <= max)
    } else if (searchType === 'date' && startDate && endDate) {
      console.log(`Filtering by date range: ${startDate.toISOString()} - ${endDate.toISOString()}`);
      filtered = filtered.filter(quotation => {
        const quotationDate = parseISO(quotation.date);
        return isAfter(quotationDate, startOfDay(startDate)) && isBefore(quotationDate, endOfDay(endDate));
      });
    }

    console.log(`Filtered quotations: ${JSON.stringify(filtered)}`);
    setFilteredQuotations(filtered)
  }

  const handleNewQuotation = () => {
    router.push('/quotation')  // Update this line to navigate to the correct path
  }

  // Prepare data for the scatter chart
  const scatterData = quotations.map(q => ({
    x: new Date(q.date).getTime(),
    y: q.total,
    z: q.total,
    name: q.customer,
    id: q.id
  }))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shutter Quotation Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Total Quotations</span>
              </div>
            </CardTitle>
            <div className="text-2xl font-bold">{quotations.length}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">+14% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Total Revenue</span>
              </div>
            </CardTitle>
            <div className="text-2xl font-bold">
              ${quotations.reduce((sum, q) => sum + q.total, 0).toFixed(2)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-yellow-500" />
                <span>New Customers</span>
              </div>
            </CardTitle>
            <div className="text-2xl font-bold">+573</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600">+201 since last month</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center space-x-2">
                <BarChart className="h-4 w-4 text-purple-500" />
                <span>Active Projects</span>
              </div>
            </CardTitle>
            <div className="text-2xl font-bold">43</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-600">+8 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <Button onClick={handleNewQuotation}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Quotation
        </Button>
        <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="search-type">Search by:</Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger id="search-type" className="w-[120px]">
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price Range</SelectItem>
                <SelectItem value="date">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {searchType === 'name' && (
            <Input
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          )}
          {searchType === 'price' && (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Min price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24"
              />
              <span>-</span>
              <Input
                placeholder="Max price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24"
              />
            </div>
          )}
          {searchType === 'date' && (
            <div className="flex items-center space-x-2">
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                placeholderText="Start Date"
              />
              <span>-</span>
              <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                placeholderText="End Date"
              />
            </div>
          )}
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
          <CardDescription>List of quotations based on your search criteria.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading quotations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredQuotations.length === 0 ? (
            <p>No quotations found.</p>
          ) : (
            <div className="space-y-4">
              {filteredQuotations.map((quotation) => (
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
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
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
            <CardTitle>Price Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Date" domain={['auto', 'auto']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
                  <YAxis type="number" dataKey="y" name="Price" unit="$" />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} name="Total" unit="$" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, name]} />
                  <Scatter name="Quotations" data={scatterData} fill="#8884d8">
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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
  )
}