const fs = require('fs');
const path = require('path');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f === 'route.ts') {
      let content = fs.readFileSync(full, 'utf8');
      if (!content.includes('export const dynamic')) {
        content = "export const dynamic = 'force-dynamic';\n" + content;
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated to force-dynamic:', full);
      }
    }
  }
}

walk(path.join(process.cwd(), 'apps', 'web', 'app', 'api'));
