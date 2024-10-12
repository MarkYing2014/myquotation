import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface Opening {
  id: string;
  type: string;
  width: number;
  height: number;
  quantity: number;
  mountType: string;
  frameStyle: string;
  operatingSystem: string;
  baseCost: number;
}

interface Surcharges {
  doubleHung: number;
  extensions: number;
  casingFrame: boolean;
  clearview: boolean;
  hiddenTilt: boolean;
  stainlessHinges: number;
  deluxeValance: number;
  frenchDoorCutouts: number;
  extensionPoles: number;
  specialtyShapes: number;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export async function POST(request: Request) {
  try {
    const { customerInfo, openings, surcharges, totalCost } = await request.json() as {
      customerInfo: CustomerInfo;
      openings: Opening[];
      surcharges: Surcharges;
      totalCost: number;
      detailedQuotation: boolean;
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const generateEmailContent = (): string => {
      let content = `
        <h1>Shutter Quotation</h1>
        <h2>Customer Information</h2>
        <p>Name: ${customerInfo.firstName} ${customerInfo.lastName}</p>
        <p>Email: ${customerInfo.email}</p>
        <p>Phone: ${customerInfo.phone}</p>
        <p>Address: ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}</p>

        <h2>Shutter Details</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Opening</th>
            <th>Type</th>
            <th>Dimensions</th>
            <th>Quantity</th>
            <th>Mount Type</th>
            <th>Frame Style</th>
            <th>Operating System</th>
            <th>Base Cost</th>
            <th>Total Cost</th>
          </tr>
      `;

      for (let i = 0; i < openings.length; i++) {
        const opening: Opening = openings[i];
        content += `
          <tr>
            <td>Opening ${i + 1}</td>
            <td>${opening.type}</td>
            <td>${opening.width}" x ${opening.height}"</td>
            <td>${opening.quantity}</td>
            <td>${opening.mountType}</td>
            <td>${opening.frameStyle}</td>
            <td>${opening.operatingSystem}</td>
            <td>$${opening.baseCost.toFixed(2)} per sq ft</td>
            <td>$${(opening.baseCost * opening.quantity * Math.max(Math.ceil((opening.width * opening.height) / 144), 6)).toFixed(2)}</td>
          </tr>
        `;
      }

      content += `
        </table>

        <h2>Surcharges</h2>
        <ul>
      `;

      Object.entries(surcharges).forEach(([key, value]) => {
        content += `<li>${key}: ${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : `$${value.toFixed(2)}`}</li>`;
      });

      content += `
        </ul>

        <h2>Total Cost Breakdown</h2>
        <p>Base Cost: $${openings.reduce((sum, opening) => 
          sum + opening.baseCost * opening.quantity * Math.max(Math.ceil((opening.width * opening.height) / 144), 6), 0).toFixed(2)}</p>
        <p>Surcharges: $${(totalCost - openings.reduce((sum, opening) => 
          sum + opening.baseCost * opening.quantity * Math.max(Math.ceil((opening.width * opening.height) / 144), 6), 0)).toFixed(2)}</p>
        <p><strong>Total Cost: $${totalCost.toFixed(2)}</strong></p>

        <p>Thank you for choosing our services. If you have any questions about this quotation, please don't hesitate to contact us.</p>
      `;

      return content;
    };

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.GMAIL_USER,
      to: customerInfo.email,
      subject: "Your Detailed Shutter Quotation",
      html: generateEmailContent(),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Detailed quotation email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send detailed quotation email' }, { status: 500 });
  }
}