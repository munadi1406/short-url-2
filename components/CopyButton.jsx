import React, { useState } from 'react';
import { Button } from './ui/button';
import { Check, Clipboard } from 'lucide-react';

const CopyButton = ({ textToCopy }) => {

    const [isCopied, setIsCopied] = useState(false); // Menyimpan status apakah link telah disalin

    // Fungsi untuk menyalin teks ke clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {

                setIsCopied(true);

                // Mengembalikan teks tombol ke "Copy" setelah 2 detik
                setTimeout(() => {

                    setIsCopied(false);
                }, 2000);
            })
            .catch((err) => {
             
            });
    };

    return (
        <Button
            onClick={handleCopy}
            className={`px-4 py-2 rounded ${isCopied ? 'bg-green-600' : 'bg-indigo-600'} `}
            type="button"
        >
            {isCopied ? (
                <Check />
            ) : (
              <Clipboard />
            )}
        </Button>
    );
};

export default CopyButton;
