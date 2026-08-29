const fs = require('fs');
const docx = require('docx');
const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType } = docx;

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: "CHƯƠNG TRÌNH MÔN HỌC",
                    heading: HeadingLevel.HEADING_1,
                    alignment: docx.AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: "Tên môn học: MÔN HỌC MẪU",
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    text: "Mã môn học: MH01",
                }),
                new Paragraph({
                    text: "Thời gian thực hiện môn học: 60 giờ (Lý thuyết: 30 giờ; Thực hành, thí nghiệm, thảo luận, bài tập: 28 giờ; Kiểm tra: 2 giờ)",
                }),
                new Paragraph({
                    text: " ",
                }),
                new Paragraph({
                    text: "CHƯƠNG TRÌNH CHI TIẾT:",
                    heading: HeadingLevel.HEADING_3,
                }),
                new Paragraph({
                    text: "Bài 1: Khái niệm cơ bản",
                    heading: HeadingLevel.HEADING_4,
                }),
                new Paragraph({
                    text: "Thời gian: 5 giờ (Lý thuyết: 3 giờ; Thực hành: 2 giờ)",
                }),
                new Paragraph({
                    text: "Nội dung:",
                }),
                new Paragraph({ text: "1.1. Giới thiệu tổng quan" }),
                new Paragraph({ text: "1.2. Phân loại và đặc điểm" }),
                new Paragraph({ text: "1.3. Thực hành áp dụng" }),
                new Paragraph({
                    text: " ",
                }),
                new Paragraph({
                    text: "Bài 2: Kỹ năng nâng cao",
                    heading: HeadingLevel.HEADING_4,
                }),
                new Paragraph({
                    text: "Thời gian: 7 giờ (Lý thuyết: 3 giờ; Thực hành: 4 giờ)",
                }),
                new Paragraph({
                    text: "Nội dung:",
                }),
                new Paragraph({ text: "2.1. Kỹ năng 1" }),
                new Paragraph({ text: "2.2. Kỹ năng 2" }),
                new Paragraph({ text: "2.3. Bài tập thực hành" }),
            ],
        },
    ],
});

docx.Packer.toBuffer(doc).then((buffer) => {
    if(!fs.existsSync('public/templates')) {
        fs.mkdirSync('public/templates', { recursive: true });
    }
    fs.writeFileSync('public/templates/chuong_trinh_mon_hoc_mau.docx', buffer);
    console.log('Template generated successfully!');
});
