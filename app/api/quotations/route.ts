import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define an interface for the Opening type
interface Opening {
  type: string
  width: number
  height: number
  quantity: number
  mountType: string
  frameStyle: string
  operatingSystem: string
  baseCost: number
}

// Define an interface for the monthly revenue item
interface MonthlyRevenueItem {
  month: string
  year: number
  revenue: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerInfo, openings, surcharges, totalCost } = body

    // Check if customer already exists
    let customer = await prisma.customer.findUnique({
      where: { email: customerInfo.email }
    })

    let isExistingCustomer = false

    if (customer) {
      isExistingCustomer = true
    } else {
      // If customer doesn't exist, create a new one
      customer = await prisma.customer.create({
        data: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zip_code: customerInfo.zipCode,
        }
      })
    }

    const savedQuotation = await prisma.quotation.create({
      data: {
        customer: {
          connect: { customer_id: customer.customer_id }
        },
        total_cost: totalCost,
        surcharges: {
          create: {
            double_hung: surcharges.doubleHung,
            extensions: surcharges.extensions,
            casing_frame: surcharges.casingFrame,
            clearview: surcharges.clearview,
            hidden_tilt: surcharges.hiddenTilt,
            stainless_hinges: surcharges.stainlessHinges,
            deluxe_valance: surcharges.deluxeValance,
            french_door_cutouts: surcharges.frenchDoorCutouts,
            extension_poles: surcharges.extensionPoles,
            specialty_shapes: surcharges.specialtyShapes,
          }
        },
        opening: {
          create: openings.map((opening: Opening) => ({
            type: opening.type,
            width: opening.width,
            height: opening.height,
            quantity: opening.quantity,
            mount_type: opening.mountType,
            frame_style: opening.frameStyle,
            operating_system: opening.operatingSystem,
            base_cost: opening.baseCost,
          }))
        }
      },
      include: {
        customer: true,
        surcharges: true,
        opening: true,
      }
    })

    return NextResponse.json({ 
      savedQuotation, 
      isExistingCustomer 
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving quotation:', error)
    return NextResponse.json({ error: 'Error saving quotation' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        creation_date: 'desc',
      },
    });

    const formattedQuotations = quotations.map((q) => ({
      id: q.quotation_id.toString(),
      customer: `${q.customer.first_name} ${q.customer.last_name}`,
      total: parseFloat(q.total_cost.toString()),
      date: q.creation_date ? q.creation_date.toISOString().split('T')[0] : '',
    }));

    // Calculate monthly revenue
    const monthlyRevenue = await prisma.$queryRaw<MonthlyRevenueItem[]>`
      SELECT 
        TO_CHAR(creation_date, 'Mon') AS month,
        EXTRACT(YEAR FROM creation_date) AS year,
        SUM(total_cost)::text AS revenue
      FROM 
        quotation
      GROUP BY 
        EXTRACT(YEAR FROM creation_date),
        EXTRACT(MONTH FROM creation_date),
        TO_CHAR(creation_date, 'Mon')
      ORDER BY 
        year DESC,
        EXTRACT(MONTH FROM creation_date) DESC
      LIMIT 12
    `;

    return NextResponse.json({
      quotations: formattedQuotations,
      monthlyRevenue: monthlyRevenue.map(item => ({
        name: `${item.month} ${item.year}`,
        revenue: parseFloat(item.revenue)
      }))
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}