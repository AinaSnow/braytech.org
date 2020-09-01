import fs from 'fs';
import path from 'path';

import Manifest from './manifest.js';
import _ from 'lodash';

const dump = JSON.parse(fs.readFileSync('src/data/checklists/index.json'));
const input = JSON.parse(fs.readFileSync('src/data/maps/nodes/index.json'));

let output = input;

async function run() {
  const manifest = await Manifest.getManifest();

  Object.entries(dump).forEach(([key, value]) => {
    const checklistId = parseInt(key, 10);

    value.forEach(entry => {
      // check if exists
      const index = output.findIndex(e => (entry.checklistHash && e.checklistId === checklistId && e.checklistHash === entry.checklistHash) || (entry.recordHash && e.recordHash === entry.recordHash));

      const definitionLore = entry.recordHash && manifest.DestinyRecordDefinition[entry.recordHash] && manifest.DestinyRecordDefinition[entry.recordHash].loreHash && manifest.DestinyLoreDefinition[manifest.DestinyRecordDefinition[entry.recordHash].loreHash];

      if (index > -1) {
        let screenshot = output[index].screenshot && output[index].screenshot !== '' ? output[index].screenshot : false;

        if (checklistId === 2360931290 && output[index].debug && output[index].debug.number) {
          screenshot = getScreenshot('ghost-scans', `ghost-scans_${output[index].debug.number}.jpg`);
        }

        if (checklistId === 1697465175 && output[index].debug && output[index].debug.number) {
          screenshot = getScreenshot('region-chests', `region-chests_${output[index].debug.number}.jpg`);
        }

        if (checklistId === 3142056444 && output[index].debug && output[index].debug.name) {
          screenshot = getScreenshot(
            'lost-sectors',
            `lost-sectors_${output[index].debug.name
              .toLowerCase()
              .replace(/'/g, '')
              .replace(/ /g, '-')}.jpg`
          );
        }

        if (checklistId === 1420597821 && output[index].recordHash) {
          screenshot = getScreenshot('lore', `ghost-stories_${output[index].recordHash}.jpg`);
        }

        if (checklistId === 655926402 && output[index].recordHash) {
          screenshot = getScreenshot('lore', `the-forsaken-prince_${output[index].recordHash}.jpg`);
        }

        if (checklistId === 3305936921 && output[index].recordHash) {
          screenshot = getScreenshot('lore', `the-awoken-of-the-reef_${output[index].recordHash}.jpg`);
        }

        if (checklistId === 4285512244 && output[index].recordHash) {
          screenshot = getScreenshot('lore', `lunas-lost_${output[index].recordHash}.jpg`);
        }

        if (checklistId === 2474271317 && output[index].recordHash) {
          screenshot = getScreenshot('lore', `necrotic-cyphers_${output[index].recordHash}.jpg`);
        }

        if (checklistId === 1912364094 && output[index].checklistHash) {
          screenshot = getScreenshot('jade-rabbits', `jade-rabbits_${output[index].checklistHash}.jpg`);
        }

        output[index] = {
          ...output[index],
          debug: {
            name: (definitionLore && definitionLore.displayProperties && definitionLore.displayProperties.name) || entry.sorts.name,
            number: entry.sorts.number
          },
          activityHash: entry.activityHash,
          screenshot
          // description: output[index].description && output[index].description !== "" ? output[index].description : false
        };
      } else {
        output.push({
          checklistId,
          checklistHash: entry.checklistHash,
          recordHash: entry.recordHash,
          activityHash: entry.activityHash,
          screenshot: false,
          description: false,
          debug: {
            name: (definitionLore && definitionLore.displayProperties && definitionLore.displayProperties.name) || entry.sorts.name,
            number: entry.sorts.number
          }
        });
      }
    });
  });

  output = _.orderBy(output, [e => e.checklistId, e => e.debug && e.debug.number, e => e.debug && e.debug.name]);

  fs.writeFileSync('src/data/maps/nodes/index.json', JSON.stringify(output, null, '  '));
}

function getScreenshot(listName, pattern) {
  const look = fromDir(`public/static/images/screenshots/${listName}/`, pattern);

  if (look && look.length === 1) {
    return `/static/images/screenshots/${listName}/${look[0]}`;
  }

  return false;
}

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);

    return;
  }

  const pattern = new RegExp(filter);

  const files = fs.readdirSync(startPath);

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      fromDir(filename, filter);
    } else if (pattern.test(filename)) {
      results.push(files[i]);
    }
  }

  return results;
}

run();
