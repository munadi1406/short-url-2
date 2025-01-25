import axios from 'axios';

export async function GET(request) {
  // Mengambil parameter query 'ipAddress' dari URL
  const { searchParams } = new URL(request.url);
  const ipAddress = searchParams.get('ipAddress');

  if (!ipAddress) {
    return new Response('IP address is required', { status: 400 });
  }

  try {
    // Panggil API eksternal via HTTP menggunakan Axios
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);

    // Mengirim data ke klien
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Menangani error jika terjadi masalah saat melakukan request
    console.error('Error fetching data:', error);
    return new Response('Error fetching data from IP API', { status: 500 });
  }
}
