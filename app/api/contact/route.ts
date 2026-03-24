import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Load the secure server-side environment variables
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    // Safety check
    if (!serviceId || !templateId || !publicKey) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error: Missing keys.' }, 
        { status: 500 }
      );
    }

    // Format the payload exactly as the EmailJS REST API expects
    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey, // Secures the backend request
      template_params: {
        name: name,
        email: email,
        message: message,
      },
    };

    // Ping the official EmailJS API
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ success: false, message: errorText }, { status: response.status });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}