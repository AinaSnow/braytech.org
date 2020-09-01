import fs from 'fs';
import Manifest from './manifest';

const outputPath = 'src/data/chaliceData/index.json';

const input = JSON.parse(fs.readFileSync('scripts/dump/chalice.csv.json'));

async function run() {
  const manifest = await Manifest.getManifest();

  const chalice = manifest.DestinyInventoryItemDefinition[1115550924];
  const chaliceSocketEntriesIndexes = chalice.sockets.socketCategories.find(c => c.socketCategoryHash === 3483578942).socketIndexes;
  const chaliceSlots = Object.entries(chalice.sockets.socketEntries)
    .map(([key, value]) => {
      if (chaliceSocketEntriesIndexes.includes(parseInt(key, 10))) {
        return value;
      } else {
        return false;
      }
    })
    .filter(f => f);

  let runes = {
    slot1: ['braytech_remove_rune', ...manifest.DestinyPlugSetDefinition[chaliceSlots[0].reusablePlugSetHash].reusablePlugItems.map(p => p.plugItemHash)],
    slot2: ['braytech_remove_rune', ...manifest.DestinyPlugSetDefinition[chaliceSlots[1].reusablePlugSetHash].reusablePlugItems.map(p => p.plugItemHash)],
    slot3: ['braytech_remove_rune', ...manifest.DestinyPlugSetDefinition[chaliceSlots[2].reusablePlugSetHash].reusablePlugItems.map(p => p.plugItemHash)]
  };

  runes.purple = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
    let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
    let identities = ['penumbra.runes.legendary.rune0', 'penumbra.runes.legendary.rune1', 'penumbra.runes.legendary.rune2'];

    if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
      return true;
    } else {
      return false;
    }
  });
  runes.red = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
    let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
    let identities = ['penumbra.runes.legendary.rune3', 'penumbra.runes.legendary.rune4', 'penumbra.runes.legendary.rune5'];

    if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
      return true;
    } else {
      return false;
    }
  });
  runes.green = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
    let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
    let identities = ['penumbra.runes.legendary.rune6', 'penumbra.runes.legendary.rune7', 'penumbra.runes.legendary.rune8'];

    if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
      return true;
    } else {
      return false;
    }
  });
  runes.blue = [...runes.slot1, ...runes.slot2, ...runes.slot3].filter(r => {
    let definitionPlug = manifest.DestinyInventoryItemDefinition[r];
    let identities = ['penumbra.runes.legendary.rune9', 'penumbra.runes.legendary.rune10', 'penumbra.runes.legendary.rune11'];

    if (definitionPlug && identities.includes(definitionPlug.plug.plugCategoryIdentifier)) {
      return true;
    } else {
      return false;
    }
  });

  console.log(JSON.stringify(runes))
}

run();
