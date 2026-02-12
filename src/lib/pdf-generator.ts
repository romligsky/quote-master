import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Quote, QuoteCalculations } from "@/types/quote";
import { formatCurrency } from "@/lib/quote-utils";

const formatDateFR = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const truncateText = (doc: jsPDF, text: string, maxWidth: number): string => {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let t = text;
  while (doc.getTextWidth(t + "…") > maxWidth && t.length > 0) {
    t = t.slice(0, -1);
  }
  return t + "…";
};

export const generateQuotePDF = async (
  quote: Quote,
  calculations: QuoteCalculations
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  /* =========================
     HEADER
  ========================= */

  const logo = quote.companyInfo.logo;
  const logoWidth = 30;
  let logoHeight = 0;

  if (logo) {
    try {
      const img = await loadImage(logo);
      logoHeight = (img.height * logoWidth) / img.width;
      // Cap logo height
      if (logoHeight > 25) {
        const scale = 25 / logoHeight;
        logoHeight = 25;
      }
      doc.addImage(img, "PNG", margin, y, logoWidth, logoHeight);
    } catch {
      // Logo failed to load — continue without it
      logoHeight = 0;
    }
  }

  const companyTextX = logo && logoHeight > 0 ? margin + logoWidth + 5 : margin;
  const textStartY = y;

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(truncateText(doc, quote.companyInfo.name || "Mon Entreprise", 80), companyTextX, textStartY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  let infoY = textStartY + 10;
  if (quote.companyInfo.address) {
    doc.text(quote.companyInfo.address, companyTextX, infoY);
    infoY += 4;
  }
  if (quote.companyInfo.postalCode || quote.companyInfo.city) {
    doc.text(`${quote.companyInfo.postalCode} ${quote.companyInfo.city}`.trim(), companyTextX, infoY);
    infoY += 4;
  }
  if (quote.companyInfo.phone) {
    doc.text(`Tél : ${quote.companyInfo.phone}`, companyTextX, infoY);
    infoY += 4;
  }
  if (quote.companyInfo.email) {
    doc.text(quote.companyInfo.email, companyTextX, infoY);
    infoY += 4;
  }
  if (quote.companyInfo.siret) {
    doc.text(`SIRET : ${quote.companyInfo.siret}`, companyTextX, infoY);
    infoY += 4;
  }

  /* ===== DEVIS block (right) ===== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246);
  doc.text(quote.title || "DEVIS", pageWidth - margin, y + 5, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`N° ${quote.number}`, pageWidth - margin, y + 14, { align: "right" });
  doc.text(`Date : ${formatDateFR(quote.date)}`, pageWidth - margin, y + 19, { align: "right" });
  doc.text(`Valide jusqu'au : ${formatDateFR(quote.validUntil)}`, pageWidth - margin, y + 24, { align: "right" });

  y = Math.max(infoY, y + (logoHeight > 0 ? logoHeight : 0)) + 15;

  /* =========================
     CLIENT
  ========================= */

  doc.setFillColor(249, 250, 251);
  const clientLines: string[] = [];
  clientLines.push(quote.client.name || "Non renseigné");
  if (quote.client.address) clientLines.push(quote.client.address);
  if (quote.client.postalCode || quote.client.city) {
    clientLines.push(`${quote.client.postalCode} ${quote.client.city}`.trim());
  }
  if (quote.client.phone) clientLines.push(`Tél : ${quote.client.phone}`);
  if (quote.client.email) clientLines.push(quote.client.email);

  const clientBoxH = 8 + clientLines.length * 4 + 4;
  doc.roundedRect(margin, y - 4, contentWidth, clientBoxH, 3, 3, "F");

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT", margin + 4, y + 2);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  let clientY = y + 8;
  doc.setFont("helvetica", "bold");
  doc.text(clientLines[0], margin + 4, clientY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (let i = 1; i < clientLines.length; i++) {
    clientY += 4;
    doc.text(clientLines[i], margin + 4, clientY);
  }

  y += clientBoxH + 10;

  /* =========================
     SECTIONS / TABLE
  ========================= */

  const includedItems = quote.items.filter((i) => i.included);

  quote.sections.forEach((section) => {
    const items = includedItems.filter((i) => i.sectionId === section.id);
    if (!items.length) return;

    // Check page space
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(section.name, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Désignation", "Qté", "Unité", "P.U. HT", "Total HT"]],
      body: items.map((i) => [
        i.product.name + (i.description ? `\n${i.description}` : ""),
        String(i.quantity),
        i.unit || "-",
        formatCurrency(i.unitPrice),
        formatCurrency(i.total),
      ]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      headStyles: {
        fillColor: [249, 250, 251],
        textColor: [107, 114, 128],
        fontStyle: "bold",
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 28, halign: "right" },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  });

  /* =========================
     LABOR (if visible)
  ========================= */
  if (quote.laborVisible && calculations.laborCost > 0) {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y - 2, contentWidth, 12, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Main d'œuvre — ${quote.laborHours}h × ${formatCurrency(quote.laborRate)}/h`, margin + 4, y + 5);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(calculations.laborCost), pageWidth - margin - 4, y + 5, { align: "right" });
    y += 16;
  }

  /* =========================
     TOTAUX
  ========================= */
  if (y > 250) { doc.addPage(); y = 20; }

  const totalsX = pageWidth - 80;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Total HT :", totalsX, y);
  doc.text(formatCurrency(calculations.totalHT), pageWidth - margin, y, { align: "right" });

  if (calculations.discount > 0) {
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Remise (${quote.discountPercent}%) :`, totalsX, y);
    doc.setTextColor(220, 50, 50);
    doc.text(`-${formatCurrency(calculations.discount)}`, pageWidth - margin, y, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`TVA (${quote.tvaRate}%) :`, totalsX, y);
  doc.text(formatCurrency(calculations.tva), pageWidth - margin, y, { align: "right" });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(59, 130, 246);
  doc.text("Total TTC :", totalsX, y);
  doc.text(formatCurrency(calculations.totalTTC), pageWidth - margin, y, { align: "right" });
  doc.setTextColor(0, 0, 0);

  /* =========================
     NOTES
  ========================= */
  if (quote.notes) {
    y += 14;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont("helvetica", "bold");
    doc.text("CONDITIONS ET NOTES", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const noteLines = doc.splitTextToSize(quote.notes, contentWidth);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4;
  }

  /* =========================
     FOOTER
  ========================= */
  y += 10;
  if (y > 270) { doc.addPage(); y = 20; }
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text(`Devis valable jusqu'au ${formatDateFR(quote.validUntil)}`, pageWidth / 2, y, { align: "center" });

  doc.save(`Devis_${quote.number}.pdf`);
};
