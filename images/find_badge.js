const fs = require('fs');

const content = fs.readFileSync('./index (2).html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().includes('selo') || line.toLowerCase().includes('seal') || line.toLowerCase().includes('rotat')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
}
