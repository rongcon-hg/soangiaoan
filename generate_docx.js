const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, BorderStyle } = require('docx');

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: "CHƯƠNG TRÌNH MÔN HỌC",
                heading: HeadingLevel.HEADING_1,
                alignment: "center",
            }),
            new Paragraph({
                children: [new TextRun({ text: "Tên môn học: MÔN HỌC MẪU", bold: true })]
            }),
            new Paragraph({ text: "Mã môn học: MH01" }),
            new Paragraph({ text: "Thời gian thực hiện môn học: 60 giờ (Lý thuyết: 30 giờ; Thực hành, thí nghiệm, thảo luận, bài tập: 28 giờ; Kiểm tra: 2 giờ)" }),
            new Paragraph({ text: "" }),
            
            new Paragraph({
                children: [new TextRun({ text: "1. Nội dung tổng quát và phân bổ thời gian", bold: true })]
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Tên chương, mục", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Tổng số", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Lý thuyết", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Thực hành", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Kiểm tra", bold: true })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph("Bài 1: Khái niệm cơ bản")] }),
                            new TableCell({ children: [new Paragraph("5")] }),
                            new TableCell({ children: [new Paragraph("3")] }),
                            new TableCell({ children: [new Paragraph("2")] }),
                            new TableCell({ children: [new Paragraph("0")] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph("Bài 2: Kỹ năng nâng cao")] }),
                            new TableCell({ children: [new Paragraph("7")] }),
                            new TableCell({ children: [new Paragraph("3")] }),
                            new TableCell({ children: [new Paragraph("4")] }),
                            new TableCell({ children: [new Paragraph("0")] }),
                        ],
                    })
                ],
            }),
            new Paragraph({ text: "" }),

            new Paragraph({
                children: [new TextRun({ text: "2. Chương trình chi tiết:", bold: true })]
            }),
            new Paragraph({ text: "Bài 1: Khái niệm cơ bản", bold: true }),
            new Paragraph({ text: "Mục tiêu:" }),
            new Paragraph({ text: "- Trình bày được khái niệm tổng quan về môn học." }),
            new Paragraph({ text: "- Thực hiện được các thao tác cơ bản." }),
            new Paragraph({ text: "Thời gian: 5 giờ (Lý thuyết: 3 giờ; Thực hành: 2 giờ)" }),
            new Paragraph({ text: "Nội dung:" }),
            new Paragraph({ text: "1.1. Giới thiệu tổng quan" }),
            new Paragraph({ text: "1.2. Phân loại và đặc điểm" }),
            new Paragraph({ text: "1.3. Thực hành áp dụng" }),
            new Paragraph({ text: "" }),

            new Paragraph({ text: "Bài 2: Kỹ năng nâng cao", bold: true }),
            new Paragraph({ text: "Mục tiêu:" }),
            new Paragraph({ text: "- Phân tích được các kỹ năng nâng cao." }),
            new Paragraph({ text: "- Áp dụng thực hành vào bài tập thực tế." }),
            new Paragraph({ text: "Thời gian: 7 giờ (Lý thuyết: 3 giờ; Thực hành: 4 giờ)" }),
            new Paragraph({ text: "Nội dung:" }),
            new Paragraph({ text: "2.1. Kỹ năng 1" }),
            new Paragraph({ text: "2.2. Kỹ năng 2" }),
            new Paragraph({ text: "2.3. Bài tập thực hành" }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('public/templates/chuong_trinh_mon_hoc_mau.docx', buffer);
    console.log('Document created successfully');
}).catch((err) => {
    console.error(err);
});
