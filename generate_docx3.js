const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, BorderStyle, AlignmentType, VerticalAlign } = require('docx');

const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Times New Roman",
                    size: 26, // 13pt
                },
                paragraph: {
                    spacing: {
                        line: 276, // 1.15 line spacing
                    },
                },
            },
        },
    },
    sections: [{
        properties: {
            page: {
                margin: {
                    top: 1440,
                    right: 1134, // 2cm
                    bottom: 1440,
                    left: 1701, // 3cm
                },
            },
        },
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: "CHƯƠNG TRÌNH MÔN HỌC", bold: true, size: 28 }) // 14pt
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            }),
            new Paragraph({
                children: [new TextRun({ text: "Tên môn học: MÔN HỌC MẪU", bold: true })]
            }),
            new Paragraph({ text: "Mã môn học: MH01" }),
            new Paragraph({ text: "Thời gian thực hiện môn học: 60 giờ (Lý thuyết: 30 giờ; Thực hành, thí nghiệm, thảo luận, bài tập: 28 giờ; Kiểm tra: 2 giờ)" }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
            
            new Paragraph({
                children: [new TextRun({ text: "1. Nội dung tổng quát và phân bổ thời gian", bold: true })],
                spacing: { after: 120 }
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: tableBorders,
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Số TT", bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tên chương, mục", bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tổng số", bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Lý thuyết", bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Thực hành", bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Kiểm tra", bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "1", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph("Bài 1: Khái niệm cơ bản")] }),
                            new TableCell({ children: [new Paragraph({ text: "5", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ text: "3", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ text: "2", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ text: "0", alignment: AlignmentType.CENTER })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "2", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph("Bài 2: Kỹ năng nâng cao")] }),
                            new TableCell({ children: [new Paragraph({ text: "7", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ text: "3", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ text: "4", alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ text: "0", alignment: AlignmentType.CENTER })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph("")] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Cộng:", bold: true })], alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "12", bold: true })], alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "6", bold: true })], alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "6", bold: true })], alignment: AlignmentType.CENTER })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "0", bold: true })], alignment: AlignmentType.CENTER })] }),
                        ],
                    })
                ],
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            new Paragraph({
                children: [new TextRun({ text: "2. Chương trình chi tiết:", bold: true })],
                spacing: { after: 120 }
            }),
            new Paragraph({ children: [new TextRun({ text: "Bài 1: Khái niệm cơ bản", bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: "Mục tiêu:", italics: true })] }),
            new Paragraph({ text: "- Phân tích được tầm quan trọng của hệ thống." }),
            new Paragraph({ text: "- Trình bày được khái niệm tổng quan về môn học." }),
            new Paragraph({ text: "- Thực hiện được các thao tác cơ bản." }),
            new Paragraph({ children: [new TextRun({ text: "Thời gian: 5 giờ (Lý thuyết: 3 giờ; Thực hành: 2 giờ)", italics: true })] }),
            new Paragraph({ children: [new TextRun({ text: "Nội dung:", bold: true })] }),
            new Paragraph({ text: "1.1. Giới thiệu tổng quan" }),
            new Paragraph({ text: "1.2. Phân loại và đặc điểm" }),
            new Paragraph({ text: "1.3. Thực hành áp dụng" }),
            new Paragraph({ text: "", spacing: { after: 120 } }),

            new Paragraph({ children: [new TextRun({ text: "Bài 2: Kỹ năng nâng cao", bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: "Mục tiêu:", italics: true })] }),
            new Paragraph({ text: "- Trình bày được sơ đồ khối hệ thống." }),
            new Paragraph({ text: "- Phân tích được các kỹ năng nâng cao." }),
            new Paragraph({ text: "- Áp dụng thực hành vào bài tập thực tế." }),
            new Paragraph({ children: [new TextRun({ text: "Thời gian: 7 giờ (Lý thuyết: 3 giờ; Thực hành: 4 giờ)", italics: true })] }),
            new Paragraph({ children: [new TextRun({ text: "Nội dung:", bold: true })] }),
            new Paragraph({ text: "2.1. Kỹ năng 1" }),
            new Paragraph({ text: "2.2. Kỹ năng 2" }),
            new Paragraph({ text: "2.3. Bài tập thực hành" }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('public/templates/chuong_trinh_mon_hoc_mau.docx', buffer);
    console.log('Document upgraded with Times New Roman and 13pt successfully');
}).catch((err) => {
    console.error(err);
});
