const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const printTarget = `    // Call native print (this opens the dialog to save as PDF)
    window.print();`;

const printInject = `    // Add page breaks for AI sections if they exist
    const rubricNode = document.querySelector('.rubric-section');
    const errorNode = document.querySelector('.error-section');
    const quizNode = document.querySelector('.quiz-section');
    const slideNode = document.querySelector('.slide-section');
    if (rubricNode) rubricNode.style.pageBreakBefore = 'always';
    if (errorNode) errorNode.style.pageBreakBefore = 'always';
    if (quizNode) quizNode.style.pageBreakBefore = 'always';
    if (slideNode) slideNode.style.pageBreakBefore = 'always';

    // Call native print (this opens the dialog to save as PDF)
    window.print();

    // Restore page breaks
    if (rubricNode) rubricNode.style.pageBreakBefore = '';
    if (errorNode) errorNode.style.pageBreakBefore = '';
    if (quizNode) quizNode.style.pageBreakBefore = '';
    if (slideNode) slideNode.style.pageBreakBefore = '';`;

content = content.replace(printTarget, printInject);

fs.writeFileSync('views/app.ejs', content);
console.log('Export patched successfully!');
