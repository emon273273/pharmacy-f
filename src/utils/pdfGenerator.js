import { formatDate } from '@/config/formatDate';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateQuotationPDF = (quotation, enquiry, action = 'view') => {
    const doc = new jsPDF();

    // --- Company Header (Placeholder) ---
    // You can replace this with an actual image logo if available:
    // var imgData = 'data:image/jpeg;base64,...';
    // doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);

    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102); // Dark Blue
    doc.text("CASA GENERATOR", 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100); // Grey
    doc.text("P.O. Box: 12345, Dubai, UAE", 14, 26);
    doc.text("Email: info@casagenerator.com | Phone: +971 50 123 4567", 14, 30);

    // --- Document Title ---
    doc.setFontSize(24);
    doc.setTextColor(200, 200, 200); // Light Grey
    doc.text("QUOTATION", 196, 25, { align: 'right' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // --- Client & Enquiry Info ---
    const startY = 48;

    // Left Column: Client Info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black

    doc.setFont(undefined, 'bold');
    doc.text("Bill To:", 14, startY);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text(enquiry?.client || "Client Name", 14, startY + 6);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(enquiry?.projectName || "Project Name", 14, startY + 11);
    if (enquiry?.address) {
        doc.text(enquiry.address, 14, startY + 16);
    }

    // Right Column: Quotation Details
    const rightColX = 120;
    const valueX = 150;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Date
    doc.setFont(undefined, 'bold');
    doc.text("Date:", rightColX, startY);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(quotation?.createdAt) || new Date().toLocaleDateString(), valueX, startY);

    // Reference No
    doc.setFont(undefined, 'bold');
    doc.text("Reference No:", rightColX, startY + 6);
    doc.setFont(undefined, 'normal');
    const refNo = `${enquiry?.casaId || 'REF'}-V${quotation?.versionNo || '1'}`;
    doc.text(refNo, valueX, startY + 6);

    // Valid Until
    doc.setFont(undefined, 'bold');
    doc.text("Valid Until:", rightColX, startY + 12);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(quotation?.validUntil) || "-", valueX, startY + 12);

    // Salesperson
    doc.setFont(undefined, 'bold');
    doc.text("Salesperson:", rightColX, startY + 18);
    doc.setFont(undefined, 'normal');
    doc.text(enquiry?.salesperson || "N/A", valueX, startY + 18);


    // --- Items Table ---
    const tableColumn = ["#", "Description", "Qty", "Unit", "Unit Price", "Total"];
    const tableRows = [];

    quotation.items?.forEach((item, index) => {
        const itemData = [
            index + 1,
            item.description || item.itemType,
            item.qty,
            item.unit || '',
            parseFloat(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }),
            parseFloat(item.lineTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: 'grid', // 'striped' or 'grid' or 'plain'
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.1,
            lineColor: [200, 200, 200]
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [220, 220, 220],
            lineWidth: 0.1
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 30, halign: 'right' },
            5: { cellWidth: 30, halign: 'right' },
        },
    });

    // --- Totals Section ---
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalsX = 130;
    const valuesRightX = 196; // Right align to margin

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Subtotal
    doc.text("Subtotal:", totalsX, finalY);
    doc.text(parseFloat(quotation.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), valuesRightX, finalY, { align: 'right' });

    // VAT
    doc.text("VAT (5%):", totalsX, finalY + 6);
    doc.text(parseFloat(quotation.vatAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), valuesRightX, finalY + 6, { align: 'right' });

    // Divider for Total
    doc.setLineWidth(0.1);
    doc.line(totalsX, finalY + 10, 196, finalY + 10);

    // Grand Total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 51, 102); // Dark Blue
    doc.text("Grand Total:", totalsX, finalY + 16);
    doc.text(`AED ${parseFloat(quotation.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, valuesRightX, finalY + 16, { align: 'right' });


    // --- Footer Notes & Terms ---
    let notesY = finalY + 30;

    // Check if we need a new page for notes
    if (notesY > 250) {
        doc.addPage();
        notesY = 20;
    }

    // Scope / Revision Note
    if (quotation.revisionNote) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text("Notes:", 14, notesY);

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);

        const splitNote = doc.splitTextToSize(quotation.revisionNote, 180);
        doc.text(splitNote, 14, notesY + 5);
        notesY += splitNote.length * 5 + 10;
    }

    // Optional Scope note from logic in component
    if (enquiry?.scope === 'supply + installation') {
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text("* Includes delivery and installation", 14, notesY);
        notesY += 10;
    }

    // Terms (Static for now)
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This quotation is computer generated and valid until the date specified.", 14, 280);
    doc.text("Thank you for your business!", 14, 285);

    // --- Output ---
    if (action === 'download') {
        doc.save(`Quotation_${refNo}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};

export const generateFATPDF = (fatRecord, projectData, action = 'view') => {
    const doc = new jsPDF();

    // --- Company Header ---
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102); // Dark Blue
    doc.text("CASA GENERATOR", 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100); // Grey
    doc.text("P.O. Box: 12345, Dubai, UAE", 14, 26);
    doc.text("Email: info@casagenerator.com | Phone: +971 50 123 4567", 14, 30);

    // --- Document Title ---
    doc.setFontSize(24);
    doc.setTextColor(200, 200, 200); // Light Grey
    doc.text("FAT REPORT", 196, 25, { align: 'right' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // --- FAT Report Info ---
    const startY = 48;

    // Left Column: Project Info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black

    doc.setFont(undefined, 'bold');
    doc.text("Project Information:", 14, startY);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text(projectData?.projectName || "Project Name", 14, startY + 6);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    if (projectData?.clientName) {
        doc.text(`Client: ${projectData.clientName}`, 14, startY + 11);
    }
    if (projectData?.projectId) {
        doc.text(`Project ID: ${projectData.projectId}`, 14, startY + 16);
    }

    // Right Column: FAT Details
    const rightColX = 120;
    const valueX = 160;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Report ID
    doc.setFont(undefined, 'bold');
    doc.text("Report ID:", rightColX, startY);
    doc.setFont(undefined, 'normal');
    doc.text(`FAT-${fatRecord?.id || 'N/A'}`, valueX, startY);

    // Test Date
    doc.setFont(undefined, 'bold');
    doc.text("Test Date:", rightColX, startY + 6);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(fatRecord?.testDate) || "-", valueX, startY + 6);

    // Test Location
    doc.setFont(undefined, 'bold');
    doc.text("Test Location:", rightColX, startY + 12);
    doc.setFont(undefined, 'normal');
    const location = fatRecord?.testLocation || "N/A";
    const splitLocation = doc.splitTextToSize(location, 35);
    doc.text(splitLocation, valueX, startY + 12);

    // Result
    const resultY = startY + 12 + (splitLocation.length * 5);
    doc.setFont(undefined, 'bold');
    doc.text("Result:", rightColX, resultY);
    doc.setFont(undefined, 'bold');
    
    if (fatRecord?.result?.toLowerCase() === 'pass') {
        doc.setTextColor(0, 128, 0); // Green
        doc.text("PASS ✓", valueX, resultY);
    } else {
        doc.setTextColor(255, 0, 0); // Red
        doc.text("FAIL ✗", valueX, resultY);
    }

    // Reset color
    doc.setTextColor(0, 0, 0);

    // Created At
    doc.setFont(undefined, 'bold');
    doc.text("Created At:", rightColX, resultY + 6);
    doc.setFont(undefined, 'normal');
    doc.text(formatDate(fatRecord?.createdAt) || "-", valueX, resultY + 6);

    // --- Test Result Section ---
    let contentY = resultY + 20;

    // Result Box
    doc.setDrawColor(fatRecord?.result?.toLowerCase() === 'pass' ? 0 : 255, 
                     fatRecord?.result?.toLowerCase() === 'pass' ? 128 : 0, 
                     0);
    doc.setLineWidth(1);
    doc.roundedRect(14, contentY, 182, 30, 3, 3, 'S');

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(fatRecord?.result?.toLowerCase() === 'pass' ? 0 : 255, 
                     fatRecord?.result?.toLowerCase() === 'pass' ? 128 : 0, 
                     0);
    doc.text(`Test Result: ${(fatRecord?.result || 'N/A').toUpperCase()}`, 105, contentY + 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text("Factory Acceptance Test Completed", 105, contentY + 20, { align: 'center' });

    // Reset color
    doc.setTextColor(0, 0, 0);
    contentY += 40;

    // --- Remarks Section ---
    if (fatRecord?.remarks) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Remarks:", 14, contentY);

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);

        const splitRemarks = doc.splitTextToSize(fatRecord.remarks, 180);
        
        // Draw a box around remarks
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        const remarksHeight = splitRemarks.length * 5 + 10;
        doc.roundedRect(14, contentY + 5, 182, remarksHeight, 2, 2, 'S');
        
        doc.text(splitRemarks, 18, contentY + 10);
        contentY += remarksHeight + 15;
    }

    // --- Test Details Table (Optional) ---
    if (fatRecord?.testDetails && Array.isArray(fatRecord.testDetails)) {
        const tableColumn = ["Test Parameter", "Expected", "Actual", "Status"];
        const tableRows = fatRecord.testDetails.map(detail => [
            detail.parameter || "-",
            detail.expected || "-",
            detail.actual || "-",
            detail.status || "-"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: contentY,
            theme: 'grid',
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: [220, 220, 220],
                lineWidth: 0.1
            },
        });
        contentY = doc.lastAutoTable.finalY + 10;
    }

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("This report is computer generated and certified by CASA GENERATOR.", 14, 280);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }

    // --- Output ---
    const fileName = `FAT_Report_${fatRecord?.id || 'Unknown'}_${formatDate(fatRecord?.testDate) || 'NoDate'}`;
    if (action === 'download') {
        doc.save(`${fileName}.pdf`);
    } else {
        window.open(doc.output('bloburl'), '_blank');
    }
};
