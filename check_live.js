fetch('https://soangiaoan.nsg.edu.vn/app?project=1')
  .then(r => r.text())
  .then(t => {
      console.log('Includes DOUBLE QUOTE function?:', t.includes('saveStateToBackend === "function"'));
      console.log('Includes SINGLE QUOTE function?:', t.includes("saveStateToBackend === 'function'"));
      console.log('Includes driveLink regex?:', t.includes('course.driveLink = data.url;'));
  });
