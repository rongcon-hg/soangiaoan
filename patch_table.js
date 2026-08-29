const fs = require('fs');
let style = fs.readFileSync('public/css/style.css', 'utf8');

const tableResponsive = `
/* Responsive Table */
.table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
table {
    width: 100%;
    border-collapse: collapse;
}
@media (max-width: 768px) {
    table {
        min-width: 600px; /* Ensures table is horizontally scrollable rather than squished */
    }
}
`;
if(!style.includes('.table-responsive')) {
    style += tableResponsive;
    fs.writeFileSync('public/css/style.css', style);
}
console.log('Added table responsive to style.css');
