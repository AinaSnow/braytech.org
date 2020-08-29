import * as enums from './destinyEnums';
import manifest from './manifest';

export function activatedNodes(talentGridHash, talentGrids) {
  const definitionTalentGrid = manifest.DestinyTalentGridDefinition[talentGridHash];

  return talentGrids.nodes.map((node) => (node.isActivated ? definitionTalentGrid.nodes[node.nodeIndex]?.steps?.[0].nodeStepHash : ''));
}

export function talentGrid(itemHash, selectedNodes) {
  const definitionInventoryItem = manifest.DestinyInventoryItemDefinition[itemHash];
  const definitionTalentGrid = manifest.DestinyTalentGridDefinition[definitionInventoryItem?.talentGrid?.talentGridHash];

  if (!definitionTalentGrid) return {};

  const nodes = definitionTalentGrid.nodes.map((node) => {
    const step = node.steps[0];

    return {
      hash: step.nodeStepHash,
      groupHash: node.groupHash,
      layoutIdentifier: node.layoutIdentifier,
      displayProperties: step.displayProperties,
      hidden: Boolean(node.hidden),
      isActivated: selectedNodes.includes(step.nodeStepHash),
      column: node.column + 9,
      row: node.row + 14,
    };
  });

  return {
    talentGridHash: definitionTalentGrid.hash,
    nodeCategories: definitionTalentGrid.nodeCategories.map(({ nodeHashes, ...category }) => ({
      ...category,
      nodeIndexes: nodeHashes,
      isSubclassPath: Boolean(SUBCLASS_PATHS.find((path) => nodeHashes.find((nodeHash) => nodes[nodeHash].hash === path.nodeStepHash))),
    })),
    nodes,
  };
}

export function activatedPath(nodeCategories, nodes) {
  const path = SUBCLASS_PATHS.find((path) => nodes.find((node) => node.isActivated && node.hash === path.nodeStepHash)) || {};
  const nodeIndex = nodes.findIndex((node) => node.hash === path.nodeStepHash);
  const { displayProperties, nodeIndexes } = nodeCategories.filter(({ isSubclassPath }) => isSubclassPath).find(({ nodeIndexes }) => nodeIndexes.includes(nodeIndex)) || {};

  return {
    ...path,
    attunement: {
      name: displayProperties?.name,
      icon: displayProperties?.icon
    },
    ability: {
      ...path.ability,
      name: manifest.DestinySandboxPerkDefinition[path.ability?.sandboxPerk]?.displayProperties.name,
      description: manifest.DestinySandboxPerkDefinition[path.ability?.sandboxPerk]?.displayProperties.description
    },
    nodeIndexes,
  };
}

export function talentGridNodeStepDefinition(talentGridHash, nodeStepHash) {
  const definitionTalentGrid = manifest.DestinyTalentGridDefinition[talentGridHash];

  const node = definitionTalentGrid.nodes.find((node) => node.steps.find((step) => step.nodeStepHash === +nodeStepHash));

  return node?.steps?.[0] || false;
}

const SUBCLASS_PATH_IDENTIFIERS = { First: 'FirstPath', Second: 'SecondPath', Third: 'ThirdPath' };

export const SUBCLASS_PATHS = [
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 4099943028,
    icon: '',
    art: '01A3-0000112B.png',
    ability: {
      sandboxPerk: 113667234,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 4293830764,
    art: '01A3-0000112B.png',
    ability: {
      sandboxPerk: 113667234,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 2795355746,
    art: '01E3-00001598.png',
    ability: {
      sandboxPerk: 3326771373,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 3928207649,
    art: '01A3-0000116E.png',
    ability: {
      sandboxPerk: 3881209933,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 1236431642,
    art: '01A3-0000116E.png',
    ability: {
      sandboxPerk: 3881209933,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 1323416107,
    art: '01E3-0000159D.png',
    ability: {
      sandboxPerk: 2401205106,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 3806272138,
    art: '01A3-00001179.png',
    ability: {
      sandboxPerk: 3170765412,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 1347995538,
    art: '01A3-00001179.png',
    ability: {
      sandboxPerk: 3078264658,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 3504292102,
    art: '01E3-0000159F.png',
    ability: {
      sandboxPerk: 3112248479,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 1690891826,
    art: '01A3-000010B4.png',
    ability: {
      sandboxPerk: 674606208,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 313617030,
    art: '01A3-000010B4.png',
    ability: {
      sandboxPerk: 674606208,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 3006627468,
    art: '01E3-00001593.png',
    ability: {
      sandboxPerk: 2236497009,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 2242504056,
    art: '01A3-000010F8.png',
    ability: {
      sandboxPerk: 3205500087,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 2805396803,
    art: '01A3-000010F8.png',
    ability: {
      sandboxPerk: 3205500087,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 1590824323,
    art: '01E3-00001595.png',
    ability: {
      sandboxPerk: 2041340886,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 277476372,
    art: '01A3-00001107.png',
    ability: {
      sandboxPerk: 2999301420,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 4025960910,
    art: '01A3-00001107.png',
    ability: {
      sandboxPerk: 2999301420,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 499823166,
    art: '01E3-00001596.png',
    ability: {
      sandboxPerk: 4099200371,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 487158888,
    art: '01A3-000011A1.png',
    ability: {
      sandboxPerk: 803974717,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 3297679786,
    art: '01A3-000011A1.png',
    ability: {
      sandboxPerk: 803974717,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 3882393894,
    art: '01E3-000015A1.png',
    ability: {
      sandboxPerk: 3368836162,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 1893159641,
    art: '01A3-000011F1.png',
    ability: {
      sandboxPerk: 1136882502,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 966868917,
    art: '01A3-000011F1.png',
    ability: {
      sandboxPerk: 1136882502,

      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 935376049,
    art: '01E3-000015A2.png',
    ability: {
      sandboxPerk: 1267155257,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 2718724912,
    art: '01A3-0000120D.png',
    ability: {
      sandboxPerk: 195170165,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 1389184794,
    art: '01A3-0000120D.png',
    ability: {
      sandboxPerk: 195170165,
      icon: '',
    },
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 194702279,
    art: '01E3-000015A5.png',
    ability: {
      sandboxPerk: 3247948194,
      icon: '',
    },
  },
];
