const fs = require('fs');

const json = JSON.parse(fs.readFileSync('build/manifest.json'));

json.short_name = 'Braytech Beta';
json.name = 'Braytech Beta';

fs.writeFileSync('build/manifest.json', JSON.stringify(json));