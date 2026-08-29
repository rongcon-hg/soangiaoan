const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const cssPulse = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.status.warn {
  animation: pulse 1.5s infinite;
  background-color: #fffbeb !important;
  color: #b45309 !important;
  border: 1px solid #fde68a !important;
}
`;

// Inject this CSS into both iframes!
txt = txt.replace('</style>', cssPulse + '\n</style>');
// Since plannerFrame also has </style>, I will replace all </style> globally.
txt = txt.replace(/<\/style>/g, cssPulse + '\n</style>');

fs.writeFileSync('views/app.ejs', txt);
console.log('Patched pulse animation');
