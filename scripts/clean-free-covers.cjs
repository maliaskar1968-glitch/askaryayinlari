const fs = require('fs');

['kelime-analizi.svg', 'apa-kaynakca.svg'].forEach(f => {
  const p = 'C:/askar-yayinlari/public/assets/free-covers/' + f;
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/filter="blur\([^"]+\)"/g, '');
    fs.writeFileSync(p, c, 'utf8');
    console.log('Cleaned:', f);
  }
});
