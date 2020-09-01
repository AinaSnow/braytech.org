import Manifest from './manifest';
import _ from 'lodash';

async function run() {
  const manifest = await Manifest.getManifest();

  const knownStoryActivities = [129918239, 271962655, 589157009, 1023966646, 1070049743, 1132291813, 1259766043, 1313648352, 1513386090, 1534123682, 1602328239, 1872813880, 1882259272, 1906514856, 2000185095, 2146977720, 2568845238, 2660895412, 2772894447, 2776154899, 3008658049, 3205547455, 3271773240, 4009655461, 4234327344, 4237009519, 4244464899, 2962137994];

  const thing = [
    'base:Hope',
    'base:Utopia',
    'base:1AU',
    'base:Payback',
    'forsaken:High Plains Blues',
    'forsaken:Scorned',
    'osiris:Beyond Infinity',
    'base:Looped',
    'forsaken:Last Call',
    'base:Unbroken',
    'base:Six',
    'osiris:Deep Storage',
    'osiris:The Gateway',
    'base:Chosen',
    'base:Fury',
    'forsaken:Nothing Left to Say',
    'warmind:Off-World Recovery',
    'warmind:Ice and Shadow',
    'base:Larceny',
    'base:Sacrilege',
    'warmind:Pilgrimage',
    'base:Riptide',
    'base:Combustion',
    'forsaken:The Machinist',
    'osiris:A Deadly Trial',
    'osiris:Omega',
    'osiris:Hijacked',
    'forsaken:Ace in the Hole'
  ];

  // knownStoryActivities.forEach(hash => {
  //   console.log(manifest.DestinyActivityDefinition[hash].selectionScreenDisplayProperties.name)
  // })

  const obj = {
    "129918239": { "timeToComplete": 6 },
    "271962655": { "timeToComplete": 6 },
    "589157009": { "timeToComplete": 12 },
    "1023966646": { "timeToComplete": 7 },
    "1070049743": { "timeToComplete": 9 },
    "1132291813": { "timeToComplete": 9 },
    "1259766043": { "timeToComplete": 11 },
    "1313648352": { "timeToComplete": 6 },
    "1513386090": { "timeToComplete": 13 },
    "1534123682": { "timeToComplete": 5 },
    "1602328239": { "timeToComplete": 8 },
    "1872813880": { "timeToComplete": 6 },
    "1882259272": { "timeToComplete": 5 },
    "1906514856": { "timeToComplete": 9 },
    "2000185095": { "timeToComplete": 9 },
    "2146977720": { "timeToComplete": 13 },
    "2568845238": { "timeToComplete": 12 },
    "2660895412": { "timeToComplete": 5 },
    "2772894447": { "timeToComplete": 7 },
    "2776154899": { "timeToComplete": 7 },
    "3008658049": { "timeToComplete": 7 },
    "3205547455": { "timeToComplete": 5 },
    "3271773240": { "timeToComplete": 7 },
    "4009655461": { "timeToComplete": 12 },
    "4234327344": { "timeToComplete": 5 },
    "4237009519": { "timeToComplete": 11 },
    "4244464899": { "timeToComplete": 6 },
    "2962137994": { "timeToComplete": 10 }
  };

  Object.keys(obj).forEach(hash => {
    const name = manifest.DestinyActivityDefinition[hash].selectionScreenDisplayProperties.name;

    const dlc = thing.find(string => {
      const pizza = string.split(':');

      if (pizza[1] === name) {
        return pizza[0];
      } else {
        return false
      }
    }).split(':')[0];
    obj[hash].eligibilityRequirements = {
      gameVersion: dlc
    }
    console.log(dlc)
  });

  console.log(JSON.stringify(obj))

  // const nightfalls = ;

  // const ordeals = Object.values(manifest.DestinyActivityDefinition)
  //   .filter(d => d.displayProperties && d.displayProperties.name && d.displayProperties.name.includes('Nightfall: The Ordeal'));
  
  // ordeals
  //   .forEach((d, i) => {
  //     console.log(i + ' ' + d.displayProperties.description);
  //   });
  
  // console.log(' ');
  // console.log(' ');

  // const obj = {};

  // Object.keys(nightfalls)
  //   .forEach((n, i) => {
  //     console.log(i + ' ' + manifest.DestinyActivityDefinition[n].displayProperties.name);
      
  //     let hash = Object.values(manifest.DestinyActivityDefinition).filter(d => d.activityModeTypes && d.activityModeTypes.includes(46) && !d.guidedGame && d.modifiers && d.modifiers.length > 2 && d.displayProperties && d.displayProperties.name && d.displayProperties.name.includes(manifest.DestinyActivityDefinition[n].displayProperties.name.replace('Nightfall: ', ''))).map(d => d.hash).join('');
      
  //     console.log(hash);

  //     obj[hash] = nightfalls[n];
  //     obj[hash].ordealHashes = ordeals.filter(o => o.displayProperties.description === manifest.DestinyActivityDefinition[hash].displayProperties.name.replace('Nightfall: ', '')).map(h => h.hash);

  //     console.log(' ');
  //   });
  
  // console.log(' ');
  // console.log(' ');

  // console.log(JSON.stringify(obj));

  // console.log(' ');

}

run();
