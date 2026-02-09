import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Quote, QuoteCalculations } from "@/types/quote";
import { formatCurrency } from "@/lib/quote-utils";

export const generateQuotePDF = (quote: Quote, calculations: QuoteCalculations) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header - Company info
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(quote.companyInfo.name, 14, yPos);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  yPos += 8;
  
  if (quote.companyInfo.address) {
    doc.text(quote.companyInfo.address, 14, yPos);
    yPos += 5;
  }
  if (quote.companyInfo.postalCode || quote.companyInfo.city) {
    doc.text(`${quote.companyInfo.postalCode} ${quote.companyInfo.city}`, 14, yPos);
    yPos += 5;
  }
  if (quote.companyInfo.phone) {
    doc.text(`Tél: ${quote.companyInfo.phone}`, 14, yPos);
    yPos += 5;
  }
  if (quote.companyInfo.email) {
    doc.text(quote.companyInfo.email, 14, yPos);
    yPos += 5;
  }
  if (quote.companyInfo.siret) {
    doc.text(`SIRET: ${quote.companyInfo.siret}`, 14, yPos);
  }

  // Quote info (right side)
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 130, 246); // Primary blue
  doc.text("DEVIS", pageWidth - 14, 20, { align: "right" });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N° ${quote.number}`, pageWidth - 14, 28, { align: "right" });
  doc.text(`Date: ${formatDateFR(quote.date)}`, pageWidth - 14, 34, { align: "right" });
  doc.text(`Valide jusqu'au: ${formatDateFR(quote.validUntil)}`, pageWidth - 14, 40, { align: "right" });

  // Client box
  yPos = 60;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(14, yPos - 4, pageWidth - 28, 35, 2, 2, "F");
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(107, 114, 128);
  doc.text("CLIENT", 18, yPos + 2);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text(quote.client.name || "Non renseigné", 18, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let clientY = yPos + 16;
  if (quote.client.address) {
    doc.text(quote.client.address, 18, clientY);
    clientY += 5;
  }
  if (quote.client.postalCode || quote.client.city) {
    doc.text(`${quote.client.postalCode} ${quote.client.city}`, 18, clientY);
    clientY += 5;
  }
  if (quote.client.phone) {
    doc.text(`Tél: ${quote.client.phone}`, 18, clientY);
  }

  yPos = 105;

  // Get included items only
  const includedItems = quote.items.filter((item) => item.included);

  // Sections and items
  const visibleSections = quote.sections.filter((section) =>
    includedItems.some((item) => item.sectionId === section.id)
  );

  visibleSections.forEach((section) => {
    const sectionItems = includedItems.filter(
      (item) => item.sectionId === section.id
    );

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Section header
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(section.name, 14, yPos);
    yPos += 2;

    // Section items table
    const tableData = sectionItems.flatMap((item) => {
      const rows: (string | number)[][] = [
        [
          item.product.name,
          item.quantity.toString(),
          item.unit || "-",
          formatCurrency(item.unitPrice),
          formatCurrency(item.total),
        ],
      ];
      if (item.description) {
        rows.push([{ content: item.description, colSpan: 5, styles: { fontStyle: "italic", textColor: [107, 114, 128], fontSize: 8 } } as any]);
      }
      return rows;
    });

    autoTable(doc, {
      startY: yPos,
      head: [["Désignation", "Qté", "Unité", "P.U. HT", "Total HT"]],
      body: tableData,
      theme: "plain",
      headStyles: {
        fillColor: [249, 250, 251],
        textColor: [107, 114, 128],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 30, halign: "right", fontStyle: "bold" },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  });

  // Labor (if visible)
  if (quote.laborVisible && calculations.laborCost > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, yPos - 4, pageWidth - 28, 12, 2, 2, "F");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Main d'œuvre (${quote.laborHours}h × ${formatCurrency(quote.laborRate)}/h)`, 18, yPos + 3);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(calculations.laborCost), pageWidth - 18, yPos + 3, { align: "right" });
    
    yPos += 20;
  }

  // Totals
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }

  const totalsX = pageWidth - 80;
  doc.setDrawColor(229, 231, 235);
  doc.line(totalsX, yPos, pageWidth - 14, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Material total
  doc.text("Total matériel HT:", totalsX, yPos);
  doc.text(formatCurrency(calculations.subtotalProducts), pageWidth - 14, yPos, { align: "right" });
  yPos += 6;

  // Labor
  if (quote.laborVisible && calculations.laborCost > 0) {
    doc.text("Main d'œuvre HT:", totalsX, yPos);
    doc.text(formatCurrency(calculations.laborCost), pageWidth - 14, yPos, { align: "right" });
    yPos += 6;
  }

  // Margin
  if (calculations.margin > 0) {
    doc.text(`Marge (${quote.marginPercent}%):`, totalsX, yPos);
    doc.text(formatCurrency(calculations.margin), pageWidth - 14, yPos, { align: "right" });
    yPos += 6;
  }

  // Discount
  if (calculations.discount > 0) {
    doc.text(`Remise (${quote.discountPercent}%):`, totalsX, yPos);
    doc.setTextColor(220, 38, 38);
    doc.text(`-${formatCurrency(calculations.discount)}`, pageWidth - 14, yPos, { align: "right" });
    doc.setTextColor(0, 0, 0);
    yPos += 6;
  }

  // Total HT
  doc.setDrawColor(229, 231, 235);
  doc.line(totalsX, yPos, pageWidth - 14, yPos);
  yPos += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Total HT:", totalsX, yPos);
  doc.text(formatCurrency(calculations.totalHT), pageWidth - 14, yPos, { align: "right" });
  yPos += 6;

  // TVA
  doc.setFont("helvetica", "normal");
  doc.text(`TVA (${quote.tvaRate}%):`, totalsX, yPos);
  doc.text(formatCurrency(calculations.tva), pageWidth - 14, yPos, { align: "right" });
  yPos += 8;

  // Total TTC
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.line(totalsX, yPos, pageWidth - 14, yPos);
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total TTC:", totalsX, yPos);
  doc.setTextColor(59, 130, 246);
  doc.text(formatCurrency(calculations.totalTTC), pageWidth - 14, yPos, { align: "right" });
  doc.setTextColor(0, 0, 0);

  // Notes
  if (quote.notes) {
    yPos += 20;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, yPos - 4, pageWidth - 28, 30, 2, 2, "F");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("CONDITIONS ET NOTES", 18, yPos + 2);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitNotes = doc.splitTextToSize(quote.notes, pageWidth - 40);
    doc.text(splitNotes, 18, yPos + 10);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Devis valable jusqu'au ${formatDateFR(quote.validUntil)}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Generate filename and save
  const clientName = quote.client.name
    ? quote.client.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)
    : "client";
  const filename = `Devis_${quote.number}_${clientName}.pdf`;
  
  doc.save(filename);
};

const formatDateFR = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
