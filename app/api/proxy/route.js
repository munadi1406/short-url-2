

export async function GET(request) {
  // Mengambil parameter query 'ipAddress' dari URL
  const { searchParams } = new URL(request.url);
  const ipAddress = searchParams.get('ipAddress');

  if (!ipAddress) {
    return new Response('IP address is required', { status: 400 });
  }

  try {
   
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`, {
      cache: 'no-store', // Supaya tidak menggunakan cache (real-time IP data)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch IP data');
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Menangani error jika terjadi masalah saat melakukan request
    console.error('Error fetching data:', error);
    return new Response('Error fetching data from IP API', { status: 500 });
  }
}
