const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const newExportPdf = `async function exportPdf(){
  if(!$("#paper table")){alert("Hãy tạo giáo án trước.");return;}

  const btn = document.getElementById("btnExportPdf");
  const origText = btn ? btn.innerHTML : "";
  if(btn) { btn.innerHTML = "⏳ Đang chuẩn bị trang in..."; btn.disabled = true; }

  try {
    // We will use native window.print() to exactly match the /export page layout

    // 1. Convert time-inputs to span for printing
    const inputs = document.querySelectorAll('.time-input');
    const replacements = [];
    inputs.forEach(inp => {
        const span = document.createElement('span');
        span.className = 'time-print-span';
        span.textContent = inp.value || inp.getAttribute('value') || '';
        span.style.fontWeight = 'bold';
        inp.parentNode.insertBefore(span, inp);
        inp.style.display = 'none';
        replacements.push({ inp, span });
    });

    // 2. Hide ai-tools and tfoot is already handled by CSS: .no-print, but let's make sure tfoot is hidden
    const tfoots = document.querySelectorAll('table.ga tfoot');
    tfoots.forEach(t => t.style.display = 'none');

    // 3. Remove contenteditable temporarily
    const editables = document.querySelectorAll('[contenteditable]');
    editables.forEach(e => e.removeAttribute('contenteditable'));

    // Wait a brief moment for styles to apply
    await new Promise(r => setTimeout(r, 100));
    
    // Call native print (this opens the dialog to save as PDF)
    window.print();

    // Restore everything
    replacements.forEach(r => {
        r.span.remove();
        r.inp.style.display = '';
    });
    tfoots.forEach(t => t.style.display = '');
    editables.forEach(e => e.setAttribute('contenteditable', 'true'));
    
    if(btn) { btn.innerHTML = origText; btn.disabled = false; }
  } catch(e) {
    console.error(e);
    alert("Lỗi khi xuất: " + (e?.message || e));
    if(btn) { btn.innerHTML = origText; btn.disabled = false; }
  }
}`;

let startIndex = content.indexOf('async function exportPdf(){');
let endIndex = content.indexOf('let receivedFullProgram=null;', startIndex);

let oldSnippet = content.substring(startIndex, endIndex);
content = content.substring(0, startIndex) + newExportPdf + "\n\n" + content.substring(endIndex);

fs.writeFileSync('views/app.ejs', content);
console.log("Rewrote exportPdf to use native window.print()");
