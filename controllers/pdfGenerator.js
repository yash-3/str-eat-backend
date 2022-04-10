const pdfKit = require('pdfkit');
const fs = require('fs');

let fileName = './files/sample-invoice.pdf';
let fontNormal = 'Helvetica';
let fontBold = 'Helvetica-Bold';

let sellerInfo = {
    "companyName": "StrEat",
    "address": "Ahmedabad",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380009",
    "country": "India",
    "contactNo": "+919100050600"
}

let customerInfo = {
    "customerName": "Customer ABC",
    "address": "R783, Rose Apartments, Santacruz (E)",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400054",
    "country": "India",
    "contactNo": "+910000000787"
}

let orderInfo = {
    "orderNo": "15484659",
    "invoiceNo": "MH-MU-1077",
    "invoiceDate": "11/05/2021",
    "invoiceTime": "10:57:00 PM",
    "products": [
        {
            "id": "15785",
            "name": "Acer Aspire E573",
            "company": "Acer",
            "unitPrice": 39999,
            "totalPrice": 39999,
            "qty": 1
        },
        {
            "id": "15786",
            "name": "Dell Magic Mouse WQ1545",
            "company": "Dell",
            "unitPrice": 2999,
            "totalPrice": 5998,
            "qty": 2
        }
    ],
    "totalValue": 45997
}

function createPdf(fileName,customerInfo,orderInfo) {
    try {

        let pdfDoc = new pdfKit();

        let stream = fs.createWriteStream(fileName);
        pdfDoc.pipe(stream);

        pdfDoc.text("Node.js - PDF Invoice creation using PDFKit library.", 5, 5, { align: "center", width: 600 });

        pdfDoc.font(fontBold).text('PARALLELCODES', 7, 75);
        pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice/Bill Receipt', 400, 30, { width: 200 });
        pdfDoc.fontSize(10).text('11-MAY-2021 10:24 PM', 400, 46, { width: 200 });

        pdfDoc.font(fontBold).text("Sold by:", 7, 100);
        pdfDoc.font(fontNormal).text(sellerInfo.companyName, 7, 115, { width: 250 });
        pdfDoc.text(sellerInfo.address, 7, 130, { width: 250 });
        pdfDoc.text(sellerInfo.city + " " + sellerInfo.pincode, 7, 145, { width: 250 });
        pdfDoc.text(sellerInfo.state + " " + sellerInfo.country, 7, 160, { width: 250 });

        pdfDoc.font(fontBold).text("Customer details:", 400, 100);
        pdfDoc.font(fontNormal).text(customerInfo.customerName, 400, 115, { width: 250 });
        pdfDoc.text(customerInfo.address, 400, 130, { width: 250 });
        pdfDoc.text(customerInfo.city + " " + customerInfo.pincode, 400, 145, { width: 250 });
        pdfDoc.text(customerInfo.state + " " + customerInfo.country, 400, 160, { width: 250 });

        pdfDoc.text("Order No:" + orderInfo.orderNo, 7, 195, { width: 250 });
        pdfDoc.text("Invoice No:" + orderInfo.invoiceNo, 7, 210, { width: 250 });
        pdfDoc.text("Date:" + orderInfo.invoiceDate + " " + orderInfo.invoiceTime, 7, 225, { width: 250 });

        pdfDoc.rect(7, 250, 560, 20).fill("#FC427B").stroke("#FC427B");
        pdfDoc.fillColor("#fff").text("ID", 20, 256, { width: 90 });
        pdfDoc.text("Product", 110, 256, { width: 190 });
        pdfDoc.text("Qty", 300, 256, { width: 100 });
        pdfDoc.text("Price", 400, 256, { width: 100 });
        pdfDoc.text("Total Price", 500, 256, { width: 100 });

        let productNo = 1;
        orderInfo.products.forEach(element => {
            console.log("adding", element.name);
            let y = 256 + (productNo * 20);
            pdfDoc.fillColor("#000").text(element.id, 20, y, { width: 90 });
            pdfDoc.text(element.name, 110, y, { width: 190 });
            pdfDoc.text(element.qty, 300, y, { width: 100 });
            pdfDoc.text(element.unitPrice, 400, y, { width: 100 });
            pdfDoc.text(element.totalPrice, 500, y, { width: 100 });
            productNo++;
        });

        pdfDoc.rect(7, 256 + (productNo * 20), 560, 0.2).fillColor("#000").stroke("#000");
        productNo++;

        pdfDoc.font(fontBold).text("Total:", 400, 256 + (productNo * 17));
        pdfDoc.font(fontBold).text(orderInfo.totalValue, 500, 256 + (productNo * 17));

        pdfDoc.end();
        console.log("pdf generate successfully");
    } catch (error) {
        console.log("Error occurred", error);
    }
}

createPdf();


