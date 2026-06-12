import jsPDF from "jspdf";

export const generateInvoice = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ─── BACKGROUND ───────────────────────────────────────────
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // ─── HEADER BANNER ────────────────────────────────────────
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.roundedRect(0, 0, pageWidth, 55, 0, 0, "F");

  // Brand name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("TechX Shop", 20, 25);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254); // indigo-200
  doc.text("Your trusted tech store", 20, 34);

  // INVOICE label (top right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", pageWidth - 20, 28, { align: "right" });

  // Invoice ID
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text(`#${order._id?.slice(-8).toUpperCase()}`, pageWidth - 20, 38, {
    align: "right",
  });

  // Date
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`Date: ${date}`, pageWidth - 20, 47, { align: "right" });

  // ─── STATUS BADGE ─────────────────────────────────────────
  const statusColors = {
    Delivered: [16, 185, 129],   // emerald
    Confirmed: [79, 70, 229],    // indigo
    Pending:   [245, 158, 11],   // amber
    Cancelled: [239, 68, 68],    // red
  };
  const [r, g, b] = statusColors[order.status] || [100, 116, 139];

  doc.setFillColor(r, g, b);
  doc.roundedRect(pageWidth - 52, 58, 42, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(order.status.toUpperCase(), pageWidth - 31, 65, { align: "center" });

  // ─── BILL TO CARD ─────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 72, 85, 58, 4, 4, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 72, 85, 58, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("BILL TO", 22, 82);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(order.customerName, 22, 92);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(order.email, 22, 101);
  doc.text(order.phone, 22, 110);

  // wrap address if long
  const addressLines = doc.splitTextToSize(order.address, 72);
  doc.text(addressLines, 22, 119);

  // ─── PAYMENT CARD ─────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(110, 72, 85, 58, 4, 4, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(110, 72, 85, 58, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("PAYMENT INFO", 117, 82);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Method", 117, 94);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(order.paymentMethod, 117, 103);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Order Status", 117, 115);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(r, g, b);
  doc.text(order.status, 117, 124);

  // ─── PRODUCTS TABLE ───────────────────────────────────────
  const tableTop = 145;

  // Table header background
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(15, tableTop, pageWidth - 30, 12, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("#", 22, tableTop + 8);
  doc.text("Product", 32, tableTop + 8);
  doc.text("Qty", 140, tableTop + 8, { align: "center" });
  doc.text("Unit Price", 162, tableTop + 8, { align: "center" });
  doc.text("Subtotal", pageWidth - 18, tableTop + 8, { align: "right" });

  // Table rows
  let y = tableTop + 18;
  order.products.forEach((item, index) => {
    const rowBg = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...rowBg);
    doc.rect(15, y - 7, pageWidth - 30, 14, "F");

    // Light divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(15, y + 7, pageWidth - 15, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(`${index + 1}`, 22, y + 1);

    // wrap long title
    const titleLines = doc.splitTextToSize(item.title, 95);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(titleLines[0], 32, y + 1); // only first line to keep row height

    doc.setTextColor(71, 85, 105);
    doc.text(`${item.quantity}`, 140, y + 1, { align: "center" });
    doc.text(`$${item.price}`, 162, y + 1, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`$${item.price * item.quantity}`, pageWidth - 18, y + 1, {
      align: "right",
    });

    y += 14;
  });

  // ─── TOTAL SECTION ────────────────────────────────────────
  y += 6;

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  y += 10;

  // Total box
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(pageWidth - 80, y - 8, 65, 18, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254);
  doc.text("TOTAL", pageWidth - 73, y + 1);

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`$${order.totalPrice}`, pageWidth - 18, y + 1, { align: "right" });

  // ─── FOOTER ───────────────────────────────────────────────
  const footerY = pageHeight - 22;

  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 8, pageWidth, 30, "F");

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(15, footerY - 8, pageWidth - 15, footerY - 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for shopping with TechX Shop!", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text(
    "For support: support@techxshop.com  |  www.techxshop.com",
    pageWidth / 2,
    footerY + 7,
    { align: "center" }
  );

  // ─── SAVE ─────────────────────────────────────────────────
  doc.save(`TechX-Invoice-${order._id?.slice(-8).toUpperCase()}.pdf`);
};