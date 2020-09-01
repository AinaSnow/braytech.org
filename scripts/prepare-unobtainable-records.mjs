import Manifest from './manifest.js';

async function run() {
  const manifest = await Manifest.getManifest();

  

  console.log('________________');

  console.log(`
      
${Object.values(manifest.DestinyRecordDefinition)
    .filter(record => /Season [0-9]+:/g.test(record.displayProperties.name) || /Season [0-9]+/g.test(record.displayProperties.description))
    .filter(record => record.displayProperties.name.indexOf('Season 10') < 0)
    .map((record, r) => {
      return (` ${record.hash},     // ${manifest.DestinyRecordDefinition[record.hash].displayProperties.name}\n`);
    }).join('')
  }

  `);

}

run();
