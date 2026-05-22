import jsPDF from "jspdf";

export const generateInvoice =
  (order) => {
    const doc =
      new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "TechX Shop - Order Invoice",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Customer: ${order.customerName}`,
      20,
      40
    );

    doc.text(
      `Email: ${order.email}`,
      20,
      50
    );

    doc.text(
      `Phone: ${order.phone}`,
      20,
      60
    );

    doc.text(
      `Address: ${order.address}`,
      20,
      70
    );

    doc.text(
      `Payment: ${order.paymentMethod}`,
      20,
      80
    );

    doc.text(
      `Status: ${order.status}`,
      20,
      90
    );

    doc.text(
      "Products:",
      20,
      110
    );

    let y = 120;

    order.products.forEach(
      (item, index) => {
        doc.text(
          `${index + 1}. ${
            item.title
          } | Qty: ${
            item.quantity
          } | $${
            item.price
          }`,
          20,
          y
        );

        y += 10;
      }
    );

    doc.setFontSize(18);

    doc.text(
      `Total: $${order.totalPrice}`,
      20,
      y + 20
    );

    doc.save(
      `invoice-${order._id}.pdf`
    );
  };