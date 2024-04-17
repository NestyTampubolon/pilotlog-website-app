import React from 'react';
import { jsPDF } from 'jspdf';

function ExportPDF() {
    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.text('Hello world!', 10, 10);

        doc.text('Hello world!', 12, 23);

        // Tambahkan konten PDF lainnya sesuai kebutuhan Anda

        doc.save('document.pdf');
    };

    return (
        <div>
            <button onClick={handleExportPDF}>Export to PDF</button>
        </div>
    );
}

export default ExportPDF;
