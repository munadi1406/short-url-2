export function convertTitleToSlug(title) {
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'on', 'in', 'with', 'for', 'to', 'from', 'by', 'of', 'is'];
    return title
        .toLowerCase() // Mengubah ke huruf kecil
        .replace(/[^a-z0-9\s]/g, '') // Menghapus karakter selain huruf, angka, dan spasi
        .trim() // Menghapus spasi di awal dan akhir
        .split(/\s+/) // Memecah berdasarkan satu atau lebih spasi
        .filter(word => !stopWords.includes(word)) // Menghapus kata-kata umum (stop words)
        .join('-') // Menggabungkan dengan tanda strip
        .replace(/--+/g, '-') // Menghilangkan tanda strip ganda
        .replace(/^-+|-+$/g, '') // Menghilangkan tanda strip di awal dan akhir
}


// Variabel untuk menyimpan daftar gambar sebelumnya
let previousImages = [];

// Fungsi untuk mendeteksi penghapusan gambar
export const detectImageDeletion = (json) => {
  // console.log("Running detection");

  // Periksa apakah `json` adalah array atau objek dan akses kontennya
  const content = Array.isArray(json) ? json : json.content || [];

  // Ekstrak node gambar dari JSON
  const currentImages = content.filter(node => node.type === 'image');
  // console.log({ currentImages });

  // Map gambar saat ini ke ID atau properti unik
  const currentImageSet = new Set(currentImages.map(image => image.attrs.src));

  // Map gambar sebelumnya ke ID atau properti unik
  const previousImageSet = new Set(previousImages.map(image => image.attrs.src));

  // Temukan gambar yang ada di previousImageSet tetapi tidak di currentImageSet
  const deletedImages = [...previousImageSet].filter(src => !currentImageSet.has(src));

  if (deletedImages.length > 0) {
    // console.log('Deleted images:', deletedImages);
    // Ambil tindakan yang sesuai untuk gambar yang dihapus
    handleDeletedImages(deletedImages);
  }

  // Perbarui previousImages dengan currentImages untuk perbandingan berikutnya
  previousImages = currentImages;
};

const handleDeletedImages = async (deletedImageSrcs) => {
  // Helper function to extract image name from URL
  const extractImageNameFromUrl = (url) => {
    try {
      const urlObject = new URL(url);
      return urlObject.pathname.split('/').pop(); // Extract filename from URL path
    } catch (error) {
      console.error(`Invalid URL: ${url}`);
      return null;
    }
  };

  // Function to notify server about the deleted image
  const notifyServerAboutDeletion = async (imageName) => {
    try {
      const response = await fetch(`/api/upload?path=${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error notifying server: ${response.statusText}`);
      }

      // console.log(`Server notified about deletion of ${imageName}`);
    } catch (error) {
      // console.error(`Failed to notify server: ${error.message}`);
    }
  };

  // Example action: log the deleted images and notify server
  for (const src of deletedImageSrcs) {
    const imageName = extractImageNameFromUrl(src);
    if (imageName) {
      // console.log(`Image with name ${imageName} has been deleted.`);
      await notifyServerAboutDeletion(imageName);
    } else {
      // console.log(`Failed to extract name from URL: ${src}`);
    }
  }
};


