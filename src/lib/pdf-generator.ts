import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Quote, QuoteCalculations } from "@/types/quote";
import { formatCurrency } from "@/lib/quote-utils";

const formatDateFR = (dateString: string) =>
  new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const generateQuotePDF = async (
  quote: Quote,
  calculations: QuoteCalculations
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 20;

  /* =========================
     HEADER
  ========================= */

  const logo = quote.companyInfo.logo;
  const logoWidth = 35;
  let logoHeight = 0;

  if (logo) {
    try {
      const img = await loadImage(logo);
      logoHeight = (img.height * logoWidth) / img.width;
      doc.addImage(img, "PNG", 14, y, logoWidth, logoHeight);
    } catch {
      logoHeight = 0;
    }
  }

  const textStartY = y + (logoHeight > 0 ? logoHeight + 4 : 0);

  // Nom entreprise
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(quote.companyInfo.name || "Mon Entreprise", 14, textStartY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  let infoY = textStartY + 6;
  if (quote.companyInfo.address) {
    doc.text(quote.companyInfo.address, 14, infoY);
    infoY += 4;
  }
  if (quote.companyInfo.postalCode || quote.companyInfo.city) {
    doc.text(
      `${quote.companyInfo.postalCode} ${quote.companyInfo.city}`.trim(),
      14,
      infoY
    );
    infoY += 4;
  }
  if (quote.companyInfo.phone) {
    doc.text(`Tél : ${quote.companyInfo.phone}`, 14, infoY);
    infoY += 4;
  }
  if (quote.companyInfo.email) {
    doc.text(quote.companyInfo.email, 14, infoY);
    infoY += 4;
  }

  /* ===== Bloc DEVIS (droite) ===== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(59, 130, 246);
  doc.text("DEVIS", pageWidth - 14, y + 5, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`N° ${quote.number}`, pageWidth - 14, y + 14, { align: "right" });
  doc.text(`Date : ${formatDateFR(quote.date)}`, pageWidth - 14, y + 19, {
    align: "right",
  });
  doc.text(
    `Valide jusqu’au : ${formatDateFR(quote.validUntil)}`,
    pageWidth - 14,
    y + 24,
    { align: "right" }
  );

  y = Math.max(infoY, y + logoHeight) + 20;

  /* =========================
     CLIENT
  ========================= */

  doc.setFillColor(249, 250, 251);
  doc.roundedRect(14, y - 4, pageWidth - 28, 28, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT", 18, y + 2);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(quote.client.name || "Non renseigné", 18, y + 10);

  y += 40;

  /* =========================
     SECTIONS / TABLE
  ========================= */

  const includedItems = quote.items.filter((i) => i.included);

  quote.sections.forEach((section) => {
    const items = includedItems.filter(
      (i) => i.sectionId === section.id
    );
    if (!items.length) return;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(section.name, 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Désignation", "Qté", "Unité", "P.U. HT", "Total HT"]],
      body: items.map((i) => [
        i.product.name,
        i.quantity,
        i.unit,
        formatCurrency(i.unitPrice),
        formatCurrency(i.total),
      ]),
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [249, 250, 251],
        textColor: [107, 114, 128],
        fontStyle: "bold",
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  });

  /* =========================
     TOTAUX
  ========================= */

  const x = pageWidth - 80;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Total HT :", x, y);
  doc.text(formatCurrency(calculations.totalHT), pageWidth - 14, y, {
    align: "right",
  });

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`TVA (${quote.tvaRate}%) :`, x, y);
  doc.text(formatCurrency(calculations.tva), pageWidth - 14, y, {
    align: "right",
  });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(59, 130, 246);
  doc.text("Total TTC :", x, y);
  doc.text(formatCurrency(calculations.totalTTC), pageWidth - 14, y, {
    align: "right",
  });

  doc.save(`Devis_${quote.number}.pdf`);
};
