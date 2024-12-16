"use client";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function TableGenerator() {
    const [tables, setTables] = useState([]); // State untuk menyimpan data tabel
    const [inputData, setInputData] = useState(""); // Input untuk data tabel

    const {toast} = useToast()
    const handleGenerateTables = () => {
        // Split input data menjadi tabel individu berdasarkan baris kosong
        const tableData = inputData
            .trim()
            .split(/\n\s*\n/) // Pisahkan tabel berdasarkan baris kosong
            .map(table => {
                return table
                    .trim()
                    .split("\n") // Pisahkan baris dalam satu tabel
                    .map(row => row.split(",")); // Pisahkan sel berdasarkan koma
            });

        setTables(tableData); // Update state dengan data tabel baru
    };

    const handleCopyTable = (tableHtml) => {
        navigator.clipboard.writeText(tableHtml).then(() => {
            toast({ title: "Success", description: "Table copied to clipboard", variant: "primary" })
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Table Generator</h1>

            {/* Input Textarea */}
            <textarea
                className="w-full border rounded p-2 mb-4"
                rows="10"
                placeholder="Enter table data here (separate tables with empty lines). Format: quality,link"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
            ></textarea>

            {/* Generate Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleGenerateTables}
            >
                Generate Tables
            </button>

            {/* Render Tables */}
            <div className="mt-6">
                {tables.map((table, tableIndex) => {
                    const tableHtml = `
                    <figure class=\"wp-block-table\ is-style-stripes\"><table class=\"has-fixed-layout\"><tbody>${table
                        .map(row => `<tr>${row.map((cell, cellIndex) => {
                            if (cellIndex === 1) {
                                return `<td><a href=\"${cell.trim()}\">Link</a></td>`;
                            }
                            return `<td>${cell.trim()}</td>`;
                        }).join("")}</tr>`)
                        .join("")}</tbody></table></figure>`;

                    return (
                        <div key={tableIndex} className="mb-6 border rounded p-4 bg-gray-50">
                            <div
                                className="overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: tableHtml }}
                            ></div>
                            <button
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() => handleCopyTable(tableHtml)}
                            >
                                Copy Table HTML
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
