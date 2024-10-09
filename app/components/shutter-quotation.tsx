'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Printer, Trash2, Edit, Save, Search } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

type Opening = {
  id: string
  type: string
  width: number
  height: number
  quantity: number
  mountType: string
  frameStyle: string
  operatingSystem: string
  baseCost: number
}

type Surcharges = {
  doubleHung: number
  extensions: number
  casingFrame: boolean
  clearview: boolean
  hiddenTilt: boolean
  stainlessHinges: number
  deluxeValance: number
  frenchDoorCutouts: number
  extensionPoles: number
  specialtyShapes: number
}

type CustomerInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export default function ShutterQuotation() {
  const [openings, setOpenings] = useState<Opening[]>([
    { id: '1', type: '', width: 0, height: 0, quantity: 0, mountType: '', frameStyle: '', operatingSystem: '', baseCost: 22 }
  ])
  const [surcharges, setSurcharges] = useState<Surcharges>({
    doubleHung: 0,
    extensions: 0,
    casingFrame: false,
    clearview: false,
    hiddenTilt: false,
    stainlessHinges: 0,
    deluxeValance: 0,
    frenchDoorCutouts: 0,
    extensionPoles: 0,
    specialtyShapes: 0
  })
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  const [totalCost, setTotalCost] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [detailedQuotation, setDetailedQuotation] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    calculateTotalCost()
  }, [openings, surcharges])

  const calculateTotalCost = () => {
    let baseCost = 0
    let totalSurcharges = 0

    // Calculate base cost
    openings.forEach(opening => {
      const adjustedWidth = opening.mountType === 'Inside Mount' 
        ? Math.max(opening.width, 24) + (opening.frameStyle === 'Trim Frame' ? 2.375 : 0)
        : Math.max(opening.width, 24)
      const adjustedHeight = opening.mountType === 'Inside Mount'
        ? Math.max(opening.height, 36) + (opening.frameStyle === 'Trim Frame' ? 2.375 : 0)
        : Math.max(opening.height, 36)
      const roundedWidth = Math.ceil(adjustedWidth)
      const roundedHeight = Math.ceil(adjustedHeight)
      const squareFeet = Math.ceil((roundedWidth * roundedHeight) / 144)
      const minSquareFeet = Math.max(squareFeet, 6)
      baseCost += minSquareFeet * opening.baseCost * opening.quantity
    })

    // Calculate surcharges
    totalSurcharges += surcharges.doubleHung * 60
    totalSurcharges += surcharges.extensions * 40
    totalSurcharges += surcharges.stainlessHinges * 5
    totalSurcharges += surcharges.deluxeValance * 10
    totalSurcharges += surcharges.frenchDoorCutouts * 150
    totalSurcharges += surcharges.extensionPoles * 55
    totalSurcharges += surcharges.specialtyShapes * 15

    if (surcharges.casingFrame) totalSurcharges += baseCost * 0.10
    if (surcharges.clearview) totalSurcharges += baseCost * 0.10
    if (surcharges.hiddenTilt) totalSurcharges += baseCost * 0.15

    // Calculate freight cost
    const totalShutters = openings.reduce((sum, opening) => sum + opening.quantity, 0)
    const freightCost = totalShutters >= 1 ? 75 + 25 * (totalShutters - 1) : 0

    setTotalCost(baseCost + totalSurcharges + freightCost)
  }

  const handleOpeningChange = (id: string, field: keyof Opening, value: string | number) => {
    const newOpenings = openings.map(opening => 
      opening.id === id ? { ...opening, [field]: value } : opening
    )
    setOpenings(newOpenings)
  }

  const handleSurchargeChange = (field: keyof Surcharges, value: number | boolean) => {
    setSurcharges(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const addOpening = () => {
    const newId = (parseInt(openings[openings.length - 1].id) + 1).toString()
    setOpenings([...openings, { id: newId, type: '', width: 0, height: 0, quantity: 0, mountType: '', frameStyle: '', operatingSystem: '', baseCost: 22 }])
  }

  const deleteOpening = (id: string) => {
    setOpenings(openings.filter(opening => opening.id !== id))
  }

  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write('<html><head><title>Shutter Quotation</title>')
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>')
        printWindow.document.write('</head><body>')
        printWindow.document.write(content.innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving quotation...')
  }

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchTerm)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shutter Quotation Calculator</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={customerInfo.firstName}
                  onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={customerInfo.state}
                  onChange={(e) => handleCustomerInfoChange('state', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={customerInfo.lastName}
                  onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={customerInfo.city}
                  onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={customerInfo.zipCode}
                  onChange={(e) => handleCustomerInfoChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Openings</CardTitle>
        </CardHeader>
        <CardContent>
          {openings.map((opening) => (
            <div key={opening.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 border rounded">
              <div>
                <Label htmlFor={`opening-type-${opening.id}`}>Opening Type</Label>
                <Select onValueChange={(value) => handleOpeningChange(opening.id, 'type', value)}>
                  <SelectTrigger id={`opening-type-${opening.id}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Window">Window</SelectItem>
                    <SelectItem value="Bypass Door">Bypass Door</SelectItem>
                    <SelectItem value="BiFold Door">BiFold Door</SelectItem>
                    <SelectItem value="French Door">French Door</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`width-${opening.id}`}>Width (inches)</Label>
                <Input
                  id={`width-${opening.id}`}
                  type="number"
                  value={opening.width}
                  onChange={(e) => handleOpeningChange(opening.id, 'width', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`height-${opening.id}`}>Height (inches)</Label>
                <Input
                  id={`height-${opening.id}`}
                  type="number"
                  value={opening.height}
                  onChange={(e) => handleOpeningChange(opening.id, 'height', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`quantity-${opening.id}`}>Quantity</Label>
                <Input
                  id={`quantity-${opening.id}`}
                  type="number"
                  value={opening.quantity}
                  onChange={(e) => handleOpeningChange(opening.id, 'quantity', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`mount-type-${opening.id}`}>Mount Type</Label>
                <Select onValueChange={(value) => handleOpeningChange(opening.id, 'mountType', value)}>
                  <SelectTrigger id={`mount-type-${opening.id}`}>
                    <SelectValue placeholder="Select mount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inside Mount">Inside Mount</SelectItem>
                    <SelectItem value="Outside Mount">Outside Mount</SelectItem>
                    <SelectItem value="Not Sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`frame-style-${opening.id}`}>Frame Style</Label>
                <Select onValueChange={(value) => handleOpeningChange(opening.id, 'frameStyle', value)}>
                  <SelectTrigger id={`frame-style-${opening.id}`}>
                    <SelectValue placeholder="Select frame style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L Frame">L Frame</SelectItem>
                    <SelectItem value="Z Frame">Z Frame</SelectItem>
                    <SelectItem value="Bullnose Z Frame">Bullnose Z Frame</SelectItem>
                    <SelectItem value="Trim Frame">Trim Frame</SelectItem>
                    <SelectItem value="Deluxe Trim Frame">Deluxe Trim Frame</SelectItem>
                    <SelectItem value="Casing Frame">Casing Frame</SelectItem>
                    <SelectItem value="S Frame">S Frame</SelectItem>
                    <SelectItem value="ByPass/BiFold Door">ByPass/BiFold Door</SelectItem>
                    <SelectItem value="No Frame">No Frame</SelectItem>
                    <SelectItem value="Not Sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`operating-system-${opening.id}`}>Operating System</Label>
                <Select onValueChange={(value) => handleOpeningChange(opening.id, 'operatingSystem', value)}>
                  <SelectTrigger id={`operating-system-${opening.id}`}>
                    <SelectValue placeholder="Select operating system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tilt Bar">Tilt Bar</SelectItem>
                    <SelectItem value="Clear View">Clear View</SelectItem>
                    <SelectItem  value="Gear">Gear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`base-cost-${opening.id}`}>Base Cost ($ per sq ft)</Label>
                <Input
                  id={`base-cost-${opening.id}`}
                  type="number"
                  value={opening.baseCost}
                  onChange={(e) => handleOpeningChange(opening.id, 'baseCost', parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-full">
                <Button variant="destructive" onClick={() => deleteOpening(opening.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Opening
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addOpening}>Add Opening</Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Surcharges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="double-hung">Double Hung Shutters</Label>
              <Input
                id="double-hung"
                type="number"
                value={surcharges.doubleHung}
                onChange={(e) => handleSurchargeChange('doubleHung', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="extensions">Extensions for Outside Mount</Label>
              <Input
                id="extensions"
                type="number"
                value={surcharges.extensions}
                onChange={(e) => handleSurchargeChange('extensions', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="casing-frame">Casing Frame</Label>
              <Select onValueChange={(value) => handleSurchargeChange('casingFrame', value === 'true')}>
                <SelectTrigger id="casing-frame">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="clearview">Clearview</Label>
              <Select onValueChange={(value) => handleSurchargeChange('clearview', value === 'true')}>
                <SelectTrigger id="clearview">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hidden-tilt">Hidden Tilt or Gear</Label>
              <Select onValueChange={(value) => handleSurchargeChange('hiddenTilt', value === 'true')}>
                <SelectTrigger id="hidden-tilt">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stainless-hinges">Stainless Steel Hinges (per panel)</Label>
              <Input
                id="stainless-hinges"
                type="number"
                value={surcharges.stainlessHinges}
                onChange={(e) => handleSurchargeChange('stainlessHinges', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="deluxe-valance">Deluxe Valance (linear ft)</Label>
              <Input
                id="deluxe-valance"
                type="number"
                value={surcharges.deluxeValance}
                onChange={(e) => handleSurchargeChange('deluxeValance', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="french-door-cutouts">French Door Cutouts</Label>
              <Input
                id="french-door-cutouts"
                type="number"
                value={surcharges.frenchDoorCutouts}
                onChange={(e) => handleSurchargeChange('frenchDoorCutouts', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="extension-poles">Extension Poles</Label>
              <Input
                id="extension-poles"
                type="number"
                value={surcharges.extensionPoles}
                onChange={(e) => handleSurchargeChange('extensionPoles', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="specialty-shapes">Specialty Shapes (linear inches)</Label>
              <Input
                id="specialty-shapes"
                type="number"
                value={surcharges.specialtyShapes}
                onChange={(e) => handleSurchargeChange('specialtyShapes', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Formal Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="detailed-quotation"
              checked={detailedQuotation}
              onCheckedChange={(checked) => setDetailedQuotation(checked as boolean)}
            />
            <Label htmlFor="detailed-quotation">Print detailed quotation</Label>
          </div>
          <div ref={printRef}>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Customer Information</h2>
              <p><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
              <p><strong>Email:</strong> {customerInfo.email}</p>
              <p><strong>Phone:</strong> {customerInfo.phone}</p>
              <p><strong>Address:</strong> {customerInfo.address}, {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openings.map((opening) => (
                  <TableRow key={opening.id}>
                    <TableCell>Opening {opening.id}</TableCell>
                    <TableCell>
                      {detailedQuotation ? (
                        <>
                          {`${opening.type} (${opening.width}"x${opening.height}")`}
                          <br />
                          {`Mount: ${opening.mountType}, Frame: ${opening.frameStyle}`}
                          <br />
                          {`Operating System: ${opening.operatingSystem}`}
                        </>
                      ) : (
                        `${opening.type} (${opening.width}"x${opening.height}")`
                      )}
                    </TableCell>
                    <TableCell>{opening.quantity}</TableCell>
                    <TableCell>${opening.baseCost.toFixed(2)}/sq ft</TableCell>
                    <TableCell>${(opening.baseCost * opening.quantity * Math.max(Math.ceil((opening.width * opening.height) / 144), 6)).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {detailedQuotation && (
                  <>
                    <TableRow>
                      <TableCell colSpan={4}>Double Hung Shutters</TableCell>
                      <TableCell>${(surcharges.doubleHung * 60).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Extensions for Outside Mount</TableCell>
                      <TableCell>${(surcharges.extensions * 40).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Casing Frame</TableCell>
                      <TableCell>{surcharges.casingFrame ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Clearview</TableCell>
                      <TableCell>{surcharges.clearview ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Hidden Tilt or Gear</TableCell>
                      <TableCell>{surcharges.hiddenTilt ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Stainless Steel Hinges</TableCell>
                      <TableCell>${(surcharges.stainlessHinges * 5).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Deluxe Valance</TableCell>
                      <TableCell>${(surcharges.deluxeValance * 10).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>French Door Cutouts</TableCell>
                      <TableCell>${(surcharges.frenchDoorCutouts * 150).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Extension Poles</TableCell>
                      <TableCell>${(surcharges.extensionPoles * 55).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4}>Specialty Shapes</TableCell>
                      <TableCell>${(surcharges.specialtyShapes * 15).toFixed(2)}</TableCell>
                    </TableRow>
                  </>
                )}
                <TableRow>
                  <TableCell colSpan={4}>Surcharges</TableCell>
                  <TableCell>${(totalCost - openings.reduce((sum, opening) => sum + opening.baseCost * opening.quantity * Math.max(Math.ceil((opening.width * opening.height) / 144), 6), 0)).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="font-bold">Total</TableCell>
                  <TableCell className="font-bold">${totalCost.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Estimated Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalCost.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  )
}