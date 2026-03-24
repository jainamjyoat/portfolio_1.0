import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Ensure access key is present
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('WEB3FORMS_ACCESS_KEY is not set in environment');
      return NextResponse.json(
        { success: false, message: 'Server misconfiguration: missing access key' },
        { status: 500 }
      );
    }

    // Use form-encoded body (some upstreams return HTML for JSON requests)
    const params = new URLSearchParams();
    params.append('access_key', accessKey);
    params.append('name', String(name));
    params.append('email', String(email));
    params.append('message', String(message));

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/plain, */*',
      },
      body: params.toString(),
    });

    // If upstream returned a 2xx status, consider it a success.
    // Try to parse JSON to confirm, but if parsing fails, still return success because many form services return HTML or plain text for success pages.
    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data && data.success) {
            return NextResponse.json({ success: true }, { status: 200 });
          }
          // Upstream returned JSON but indicated failure
          const upstreamMessage = data?.message || 'Upstream service indicated failure';
          console.error('Web3Forms reported failure:', upstreamMessage, data);
          return NextResponse.json({ success: false, message: upstreamMessage }, { status: 502 });
        }

        // Non-JSON success response: treat as success but log body for diagnostics
        const text = await response.text();
        console.warn('Upstream returned non-JSON 2xx response (treated as success):', text.slice(0, 200));
        return NextResponse.json({ success: true }, { status: 200 });
      } catch (e) {
        console.warn('Error parsing upstream success response; treating as success', e);
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    // Non-2xx: try to extract structured error information
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        const upstreamMessage = data?.message || 'Upstream service error';
        console.error('Web3Forms error (JSON):', upstreamMessage, data);
        return NextResponse.json({ success: false, message: upstreamMessage }, { status: response.status });
      }

      // Fallback to text
      const text = await response.text();
      console.error('Web3Forms error (text):', text);
      return NextResponse.json({ success: false, message: text || 'Upstream service error' }, { status: response.status });
    } catch (e) {
      console.error('Error reading upstream error response:', e);
      return NextResponse.json({ success: false, message: 'Upstream service error' }, { status: 502 });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
