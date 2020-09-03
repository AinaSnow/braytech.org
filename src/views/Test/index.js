import React from 'react';
import { connect } from 'react-redux';

import manifest from '../../utils/manifest';

import { stringToIcons } from '../../utils/destinyUtils';
import { DestinyContentVault } from '../../utils/destinyEnums';
import { sockets } from '../../utils/destinyItems/sockets';
import { stats } from '../../utils/destinyItems/stats';

import Item from '../../components/Tooltip/Item';

import './styles.css';
import Collectibles from '../../components/Collectibles';
import Records from '../../components/Records';
import { groupBy } from 'lodash';

class Test extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);

    // const oof = [];

    // Object.values(manifest.DestinyObjectiveDefinition).forEach((definition) => {
    //   if (definition.progressDescription.indexOf('[') > -1) {
    //     const lol = stringToIcons(definition.progressDescription);

    //     if (lol[0].indexOf('[') > -1) console.log(definition.hash, lol);
    //     if (lol[0].indexOf('[') > -1) oof.push({ objectiveHash: definition.hash, unicode: 'lol', substring: definition.progressDescription });
    //   }
    // });

    // console.log(JSON.stringify(oof));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    // const hashes = Object.values(manifest.DestinyCollectibleDefinition)
    //   .filter((def) => def.sourceString?.includes('Titan'))
    //   .map((def) => def.hash);

    // const reducedCollectibles = [...this.props.lists.nodes.reduce((a, v) => [...a, manifest.DestinyPresentationNodeDefinition[v].children.collectibles.map((c) => c.collectibleHash)], []).flat(), ...this.props.list.collectibles];

    // const reducedRecords = [...this.props.lists.nodes.reduce((a, v) => [...a, manifest.DestinyPresentationNodeDefinition[v].children.records.map((c) => c.recordHash)], []).flat(), ...this.props.list.records];
    //console.log(DestinyContentVault[0])
    //selectedVault.bucketHash || selectedVault.placeHash || selectedVault.activityHash || selectedVault.activityModeHash
//     console.log(
//       `[${DestinyContentVault[0].vault
//         .map((place) => {
//           return `{
//           name: '${place.name}',
//           slug: '${place.slug}',
//         buckets: {
// nodes: [
//       ${place.buckets.nodes.map((hash) => `${hash}, // ${manifest.DestinyPresentationNodeDefinition[hash].displayProperties.name}`).join('\n')}
//     ],
//     collectibles: [
//       ${place.buckets.collectibles.map((hash) => `${hash}, // ${manifest.DestinyCollectibleDefinition[hash].displayProperties.name}`).join('\n')}
//     ],
//     records: [
//       ${place.buckets.records.map((hash) => `${hash}, // ${manifest.DestinyRecordDefinition[hash].displayProperties.name}`).join('\n')}
//     ],
//   }
// },`;
//         })

//         .join('\n')}]`
//     );

    // const data = [
    //   { id: 1, season: 1, week: 2, date: null, sales: 4190156464, location: null },
    //   { id: 2, season: 1, week: 2, date: null, sales: 419976110, location: null },
    //   { id: 3, season: 1, week: 2, date: null, sales: 1035680665, location: null },
    //   { id: 4, season: 1, week: 2, date: null, sales: 2782999716, location: null },
    //   { id: 5, season: 1, week: 3, date: null, sales: 1508896098, location: null },
    //   { id: 6, season: 1, week: 3, date: null, sales: 1667080809, location: null },
    //   { id: 7, season: 1, week: 3, date: null, sales: 1035680664, location: null },
    //   { id: 8, season: 1, week: 3, date: null, sales: 1862800747, location: null },
    //   { id: 9, season: 1, week: 4, date: null, sales: 3089417789, location: null },
    //   { id: 10, season: 1, week: 4, date: null, sales: 4284305243, location: null },
    //   { id: 11, season: 1, week: 4, date: null, sales: 458095282, location: null },
    //   { id: 12, season: 1, week: 4, date: null, sales: 2954558333, location: null },
    //   { id: 13, season: 1, week: 5, date: null, sales: 3628991659, location: null },
    //   { id: 14, season: 1, week: 5, date: null, sales: 1667080809, location: null },
    //   { id: 15, season: 1, week: 5, date: null, sales: 197761153, location: null },
    //   { id: 16, season: 1, week: 5, date: null, sales: 2523259393, location: null },
    //   { id: 17, season: 1, week: 6, date: null, sales: 3549153978, location: null },
    //   { id: 18, season: 1, week: 6, date: null, sales: 1667080811, location: null },
    //   { id: 19, season: 1, week: 6, date: null, sales: 3790373075, location: null },
    //   { id: 20, season: 1, week: 6, date: null, sales: 2782999716, location: null },
    //   { id: 21, season: 1, week: 7, date: null, sales: 1345867570, location: null },
    //   { id: 22, season: 1, week: 7, date: null, sales: 419976110, location: null },
    //   { id: 23, season: 1, week: 7, date: null, sales: 1035680665, location: null },
    //   { id: 24, season: 1, week: 7, date: null, sales: 1862800745, location: null },
    //   { id: 25, season: 1, week: 8, date: null, sales: 3141979346, location: null },
    //   { id: 26, season: 1, week: 8, date: null, sales: 1667080811, location: null },
    //   { id: 27, season: 1, week: 8, date: null, sales: 458095281, location: null },
    //   { id: 28, season: 1, week: 8, date: null, sales: 2523259392, location: null },
    //   { id: 29, season: 1, week: 9, date: null, sales: 3628991658, location: null },
    //   { id: 30, season: 1, week: 9, date: null, sales: 4284305242, location: null },
    //   { id: 31, season: 1, week: 9, date: null, sales: 197761152, location: null },
    //   { id: 32, season: 1, week: 9, date: null, sales: 2523259393, location: null },
    //   { id: 33, season: 1, week: 10, date: null, sales: 3549153979, location: null },
    //   { id: 34, season: 1, week: 10, date: null, sales: 1667080809, location: null },
    //   { id: 35, season: 1, week: 10, date: null, sales: 197761153, location: null },
    //   { id: 36, season: 1, week: 10, date: null, sales: 2523259392, location: null },
    //   { id: 37, season: 1, week: 11, date: null, sales: 4124984448, location: null },
    //   { id: 38, season: 1, week: 11, date: null, sales: 419976111, location: null },
    //   { id: 39, season: 1, week: 11, date: null, sales: 1035680666, location: null },
    //   { id: 40, season: 1, week: 11, date: null, sales: 1862800746, location: null },
    //   { id: 41, season: 1, week: 12, date: null, sales: 4190156464, location: null },
    //   { id: 42, season: 1, week: 12, date: null, sales: 1245809812, location: null },
    //   { id: 43, season: 1, week: 12, date: null, sales: 197761152, location: null },
    //   { id: 44, season: 1, week: 12, date: null, sales: 2782999717, location: null },
    //   { id: 45, season: 1, week: 13, date: null, sales: 1345867570, location: null },
    //   { id: 46, season: 1, week: 13, date: null, sales: 419976111, location: null },
    //   { id: 47, season: 1, week: 13, date: null, sales: 1035680666, location: null },
    //   { id: 48, season: 1, week: 13, date: null, sales: 2523259394, location: null },
    //   { id: 49, season: 2, week: 1, date: null, sales: 19024058, location: null },
    //   { id: 50, season: 2, week: 1, date: null, sales: 419976108, location: null },
    //   { id: 51, season: 2, week: 1, date: null, sales: 1902412292, location: null },
    //   { id: 52, season: 2, week: 1, date: null, sales: 2523259393, location: null },
    //   { id: 54, season: 2, week: 2, date: null, sales: 3141979346, location: null },
    //   { id: 55, season: 2, week: 2, date: null, sales: 1667080810, location: null },
    //   { id: 56, season: 2, week: 2, date: null, sales: 458095282, location: null },
    //   { id: 57, season: 2, week: 2, date: null, sales: 2523259392, location: null },
    //   { id: 58, season: 2, week: 2, date: null, sales: 759381183, location: null },
    //   { id: 60, season: 2, week: 3, date: null, sales: 3089417789, location: null },
    //   { id: 61, season: 2, week: 3, date: null, sales: 1245809812, location: null },
    //   { id: 62, season: 2, week: 3, date: null, sales: 1035680665, location: null },
    //   { id: 63, season: 2, week: 3, date: null, sales: 2782999716, location: null },
    //   { id: 64, season: 2, week: 3, date: null, sales: 759381183, location: null },
    //   { id: 66, season: 2, week: 4, date: null, sales: 759381183, location: null },
    //   { id: 67, season: 2, week: 4, date: null, sales: 3628991659, location: null },
    //   { id: 68, season: 2, week: 4, date: null, sales: 1667080809, location: null },
    //   { id: 69, season: 2, week: 4, date: null, sales: 3790373075, location: null },
    //   { id: 70, season: 2, week: 4, date: null, sales: 2523259392, location: null },
    //   { id: 72, season: 2, week: 5, date: null, sales: 759381183, location: null },
    //   { id: 73, season: 2, week: 5, date: null, sales: 4190156464, location: null },
    //   { id: 74, season: 2, week: 5, date: null, sales: 4284305242, location: null },
    //   { id: 75, season: 2, week: 5, date: null, sales: 197761152, location: null },
    //   { id: 76, season: 2, week: 5, date: null, sales: 2782999716, location: null },
    //   { id: 78, season: 2, week: 6, date: null, sales: 759381183, location: null },
    //   { id: 79, season: 2, week: 6, date: null, sales: 3899270607, location: null },
    //   { id: 80, season: 2, week: 6, date: null, sales: 1786557270, location: null },
    //   { id: 81, season: 2, week: 6, date: null, sales: 1902412292, location: null },
    //   { id: 82, season: 2, week: 6, date: null, sales: 3008550972, location: null },
    //   { id: 84, season: 2, week: 7, date: null, sales: 759381183, location: null },
    //   { id: 85, season: 2, week: 7, date: null, sales: 3580904581, location: null },
    //   { id: 86, season: 2, week: 7, date: null, sales: 1667080811, location: null },
    //   { id: 87, season: 2, week: 7, date: null, sales: 458095281, location: null },
    //   { id: 88, season: 2, week: 7, date: null, sales: 2954558333, location: null },
    //   { id: 90, season: 2, week: 8, date: null, sales: 759381183, location: null },
    //   { id: 91, season: 2, week: 8, date: null, sales: 1345867570, location: null },
    //   { id: 92, season: 2, week: 8, date: null, sales: 3926392527, location: null },
    //   { id: 93, season: 2, week: 8, date: null, sales: 3790373072, location: null },
    //   { id: 94, season: 2, week: 8, date: null, sales: 2523259394, location: null },
    //   { id: 96, season: 2, week: 9, date: null, sales: 759381183, location: null },
    //   { id: 97, season: 2, week: 9, date: null, sales: 3549153979, location: null },
    //   { id: 98, season: 2, week: 9, date: null, sales: 419976111, location: null },
    //   { id: 99, season: 2, week: 9, date: null, sales: 197761153, location: null },
    //   { id: 100, season: 2, week: 9, date: null, sales: 68357813, location: null },
    //   { id: 102, season: 2, week: 10, date: null, sales: 759381183, location: null },
    //   { id: 103, season: 2, week: 10, date: null, sales: 3844694310, location: null },
    //   { id: 104, season: 2, week: 10, date: null, sales: 419976110, location: null },
    //   { id: 105, season: 2, week: 10, date: null, sales: 1035680666, location: null },
    //   { id: 106, season: 2, week: 10, date: null, sales: 1862800746, location: null },
    //   { id: 108, season: 2, week: 11, date: null, sales: 759381183, location: null },
    //   { id: 109, season: 2, week: 11, date: null, sales: 4190156464, location: null },
    //   { id: 110, season: 2, week: 11, date: null, sales: 1245809812, location: null },
    //   { id: 111, season: 2, week: 11, date: null, sales: 1035680664, location: null },
    //   { id: 112, season: 2, week: 11, date: null, sales: 2782999717, location: null },
    //   { id: 113, season: 2, week: 12, date: null, sales: 759381183, location: null },
    //   { id: 114, season: 2, week: 12, date: null, sales: 3437746471, location: null },
    //   { id: 115, season: 2, week: 12, date: null, sales: 3926392527, location: null },
    //   { id: 116, season: 2, week: 12, date: null, sales: 1362342075, location: null },
    //   { id: 117, season: 2, week: 12, date: null, sales: 1799380614, location: null },
    //   { id: 118, season: 2, week: 13, date: null, sales: 759381183, location: null },
    //   { id: 119, season: 2, week: 13, date: null, sales: 1508896098, location: null },
    //   { id: 120, season: 2, week: 13, date: null, sales: 4284305243, location: null },
    //   { id: 121, season: 2, week: 13, date: null, sales: 458095280, location: null },
    //   { id: 122, season: 2, week: 13, date: null, sales: 2523259392, location: null },
    //   { id: 123, season: 2, week: 14, date: null, sales: 759381183, location: null },
    //   { id: 124, season: 2, week: 14, date: null, sales: 1345867571, location: null },
    //   { id: 125, season: 2, week: 14, date: null, sales: 419976108, location: null },
    //   { id: 126, season: 2, week: 14, date: null, sales: 458095282, location: null },
    //   { id: 127, season: 2, week: 14, date: null, sales: 2523259393, location: null },
    //   { id: 128, season: 2, week: 15, date: null, sales: 759381183, location: null },
    //   { id: 129, season: 2, week: 15, date: null, sales: 4255268456, location: null },
    //   { id: 130, season: 2, week: 15, date: null, sales: 1667080810, location: null },
    //   { id: 131, season: 2, week: 15, date: null, sales: 1035680665, location: null },
    //   { id: 132, season: 2, week: 15, date: null, sales: 2782999716, location: null },
    //   { id: 133, season: 2, week: 16, date: null, sales: 759381183, location: null },
    //   { id: 134, season: 2, week: 16, date: null, sales: 2907129557, location: null },
    //   { id: 135, season: 2, week: 16, date: null, sales: 1245809813, location: null },
    //   { id: 136, season: 2, week: 16, date: null, sales: 3790373074, location: null },
    //   { id: 137, season: 2, week: 16, date: null, sales: 1862800746, location: null },
    //   { id: 138, season: 2, week: 17, date: null, sales: 759381183, location: null },
    //   { id: 139, season: 2, week: 17, date: null, sales: 3141979346, location: null },
    //   { id: 140, season: 2, week: 17, date: null, sales: 419976108, location: null },
    //   { id: 141, season: 2, week: 17, date: null, sales: 1902412292, location: null },
    //   { id: 142, season: 2, week: 17, date: null, sales: 2523259393, location: null },
    //   { id: 143, season: 2, week: 18, date: null, sales: 759381183, location: null },
    //   { id: 144, season: 2, week: 18, date: null, sales: 19024058, location: null },
    //   { id: 145, season: 2, week: 18, date: null, sales: 1667080810, location: null },
    //   { id: 146, season: 2, week: 18, date: null, sales: 458095282, location: null },
    //   { id: 147, season: 2, week: 18, date: null, sales: 2523259392, location: null },
    //   { id: 148, season: 2, week: 19, date: null, sales: 759381183, location: null },
    //   { id: 149, season: 2, week: 19, date: null, sales: 3089417789, location: null },
    //   { id: 150, season: 2, week: 19, date: null, sales: 1488061763, location: null },
    //   { id: 151, season: 2, week: 19, date: null, sales: 1035680665, location: null },
    //   { id: 152, season: 2, week: 19, date: null, sales: 2782999716, location: null },
    //   { id: 153, season: 2, week: 20, date: null, sales: 759381183, location: null },
    //   { id: 154, season: 2, week: 20, date: null, sales: 3628991659, location: null },
    //   { id: 155, season: 2, week: 20, date: null, sales: 1667080809, location: null },
    //   { id: 156, season: 2, week: 20, date: null, sales: 3790373075, location: null },
    //   { id: 157, season: 2, week: 20, date: null, sales: 1799380614, location: null },
    //   { id: 158, season: 2, week: 21, date: null, sales: 759381183, location: null },
    //   { id: 159, season: 2, week: 21, date: null, sales: 2208405142, location: null },
    //   { id: 160, season: 2, week: 21, date: null, sales: 4284305242, location: null },
    //   { id: 161, season: 2, week: 21, date: null, sales: 197761152, location: null },
    //   { id: 162, season: 2, week: 21, date: null, sales: 2782999716, location: null },
    //   { id: 163, season: 2, week: 22, date: null, sales: 759381183, location: null },
    //   { id: 164, season: 2, week: 22, date: null, sales: 3899270607, location: null },
    //   { id: 165, season: 2, week: 22, date: null, sales: 1786557270, location: null },
    //   { id: 166, season: 2, week: 22, date: null, sales: 1902412292, location: null },
    //   { id: 167, season: 2, week: 22, date: null, sales: 3008550972, location: null },
    //   { id: 168, season: 3, week: 1, date: '2018-05-05 10:01:00', sales: 759381183, location: 3 },
    //   { id: 169, season: 3, week: 1, date: '2018-05-05 10:01:00', sales: 4285666432, location: 3 },
    //   { id: 170, season: 3, week: 1, date: '2018-05-05 10:01:00', sales: 19024058, location: 3 },
    //   { id: 171, season: 3, week: 1, date: '2018-05-05 10:01:00', sales: 1667080811, location: 3 },
    //   { id: 172, season: 3, week: 1, date: '2018-05-05 10:01:00', sales: 809007410, location: 3 },
    //   { id: 173, season: 3, week: 1, date: '2018-05-05 10:01:00', sales: 1799380614, location: 3 },
    //   { id: 186, season: 3, week: 2, date: '2018-05-19 00:12:48', sales: 759381183, location: 5 },
    //   { id: 187, season: 3, week: 2, date: '2018-05-19 00:12:48', sales: 4285666432, location: 5 },
    //   { id: 188, season: 3, week: 2, date: '2018-05-19 00:12:48', sales: 2856683562, location: 5 },
    //   { id: 189, season: 3, week: 2, date: '2018-05-19 00:12:48', sales: 1488061763, location: 5 },
    //   { id: 190, season: 3, week: 2, date: '2018-05-19 00:12:48', sales: 458095280, location: 5 },
    //   { id: 191, season: 3, week: 2, date: '2018-05-19 00:12:48', sales: 2970800254, location: 5 },
    //   { id: 192, season: 3, week: 3, date: '2018-05-25 17:02:35', sales: 759381183, location: 4 },
    //   { id: 193, season: 3, week: 3, date: '2018-05-25 17:02:35', sales: 4285666432, location: 4 },
    //   { id: 194, season: 3, week: 3, date: '2018-05-25 17:02:35', sales: 3628991659, location: 4 },
    //   { id: 195, season: 3, week: 3, date: '2018-05-25 17:02:35', sales: 1667080809, location: 4 },
    //   { id: 196, season: 3, week: 3, date: '2018-05-25 17:02:35', sales: 510504540, location: 4 },
    //   { id: 197, season: 3, week: 3, date: '2018-05-25 17:02:35', sales: 2422973183, location: 4 },
    //   { id: 198, season: 3, week: 4, date: '2018-06-01 20:29:46', sales: 759381183, location: 2 },
    //   { id: 199, season: 3, week: 4, date: '2018-06-01 20:29:46', sales: 4285666432, location: 2 },
    //   { id: 200, season: 3, week: 4, date: '2018-06-01 20:29:46', sales: 2208405142, location: 2 },
    //   { id: 201, season: 3, week: 4, date: '2018-06-01 20:29:46', sales: 574694189, location: 2 },
    //   { id: 202, season: 3, week: 4, date: '2018-06-01 20:29:46', sales: 1643575148, location: 2 },
    //   { id: 203, season: 3, week: 4, date: '2018-06-01 20:29:46', sales: 2782999716, location: 2 },
    //   { id: 204, season: 3, week: 5, date: '2018-06-08 17:08:45', sales: 759381183, location: 5 },
    //   { id: 205, season: 3, week: 5, date: '2018-06-08 17:08:45', sales: 4285666432, location: 5 },
    //   { id: 206, season: 3, week: 5, date: '2018-06-08 17:08:45', sales: 2286143274, location: 5 },
    //   { id: 207, season: 3, week: 5, date: '2018-06-08 17:08:45', sales: 419976108, location: 5 },
    //   { id: 208, season: 3, week: 5, date: '2018-06-08 17:08:45', sales: 3790373075, location: 5 },
    //   { id: 209, season: 3, week: 5, date: '2018-06-08 17:08:45', sales: 2954558333, location: 5 },
    //   { id: 210, season: 3, week: 6, date: '2018-06-15 17:01:10', sales: 759381183, location: 1 },
    //   { id: 211, season: 3, week: 6, date: '2018-06-15 17:01:10', sales: 4285666432, location: 1 },
    //   { id: 212, season: 3, week: 6, date: '2018-06-15 17:01:10', sales: 3580904581, location: 1 },
    //   { id: 213, season: 3, week: 6, date: '2018-06-15 17:01:10', sales: 2166230715, location: 1 },
    //   { id: 214, season: 3, week: 6, date: '2018-06-15 17:01:10', sales: 458095281, location: 1 },
    //   { id: 215, season: 3, week: 6, date: '2018-06-15 17:01:10', sales: 3008550972, location: 1 },
    //   { id: 216, season: 3, week: 7, date: '2018-06-22 22:09:42', sales: 759381183, location: 5 },
    //   { id: 217, season: 3, week: 7, date: '2018-06-22 22:09:42', sales: 4285666432, location: 5 },
    //   { id: 218, season: 3, week: 7, date: '2018-06-22 22:09:42', sales: 3899270607, location: 5 },
    //   { id: 219, season: 3, week: 7, date: '2018-06-22 22:09:42', sales: 3926392527, location: 5 },
    //   { id: 220, season: 3, week: 7, date: '2018-06-22 22:09:42', sales: 2829609851, location: 5 },
    //   { id: 221, season: 3, week: 7, date: '2018-06-22 22:09:42', sales: 2523259394, location: 5 },
    //   { id: 222, season: 3, week: 8, date: '2018-06-29 17:00:20', sales: 759381183, location: 3 },
    //   { id: 223, season: 3, week: 8, date: '2018-06-29 17:00:20', sales: 4285666432, location: 3 },
    //   { id: 224, season: 3, week: 8, date: '2018-06-29 17:00:20', sales: 1508896098, location: 3 },
    //   { id: 225, season: 3, week: 8, date: '2018-06-29 17:00:20', sales: 419976111, location: 3 },
    //   { id: 226, season: 3, week: 8, date: '2018-06-29 17:00:20', sales: 197761153, location: 3 },
    //   { id: 227, season: 3, week: 8, date: '2018-06-29 17:00:20', sales: 68357813, location: 3 },
    //   { id: 228, season: 3, week: 9, date: '2018-07-06 17:00:17', sales: 759381183, location: 2 },
    //   { id: 229, season: 3, week: 9, date: '2018-07-06 17:00:17', sales: 4285666432, location: 2 },
    //   { id: 230, season: 3, week: 9, date: '2018-07-06 17:00:17', sales: 3844694310, location: 2 },
    //   { id: 231, season: 3, week: 9, date: '2018-07-06 17:00:17', sales: 4284305243, location: 2 },
    //   { id: 232, season: 3, week: 9, date: '2018-07-06 17:00:17', sales: 1035680666, location: 2 },
    //   { id: 233, season: 3, week: 9, date: '2018-07-06 17:00:17', sales: 1862800746, location: 2 },
    //   { id: 234, season: 3, week: 10, date: '2018-07-13 19:39:57', sales: 759381183, location: 5 },
    //   { id: 235, season: 3, week: 10, date: '2018-07-13 19:39:57', sales: 4285666432, location: 5 },
    //   { id: 236, season: 3, week: 10, date: '2018-07-13 19:39:57', sales: 3437746471, location: 5 },
    //   { id: 237, season: 3, week: 10, date: '2018-07-13 19:39:57', sales: 574694189, location: 5 },
    //   { id: 238, season: 3, week: 10, date: '2018-07-13 19:39:57', sales: 1035680664, location: 5 },
    //   { id: 239, season: 3, week: 10, date: '2018-07-13 19:39:57', sales: 2782999717, location: 5 },
    //   { id: 240, season: 3, week: 11, date: '2018-07-20 17:00:18', sales: 759381183, location: 4 },
    //   { id: 241, season: 3, week: 11, date: '2018-07-20 17:00:18', sales: 4285666432, location: 4 },
    //   { id: 242, season: 3, week: 11, date: '2018-07-20 17:00:18', sales: 1345867571, location: 4 },
    //   { id: 243, season: 3, week: 11, date: '2018-07-20 17:00:18', sales: 3926392527, location: 4 },
    //   { id: 244, season: 3, week: 11, date: '2018-07-20 17:00:18', sales: 1362342075, location: 4 },
    //   { id: 245, season: 3, week: 11, date: '2018-07-20 17:00:18', sales: 1799380614, location: 4 },
    //   { id: 246, season: 3, week: 12, date: '2018-07-27 19:44:01', sales: 759381183, location: 1 },
    //   { id: 247, season: 3, week: 12, date: '2018-07-27 19:44:01', sales: 4285666432, location: 1 },
    //   { id: 248, season: 3, week: 12, date: '2018-07-27 19:44:01', sales: 2286143274, location: 1 },
    //   { id: 249, season: 3, week: 12, date: '2018-07-27 19:44:01', sales: 4284305243, location: 1 },
    //   { id: 250, season: 3, week: 12, date: '2018-07-27 19:44:01', sales: 458095280, location: 1 },
    //   { id: 251, season: 3, week: 12, date: '2018-07-27 19:44:01', sales: 2523259392, location: 1 },
    //   { id: 252, season: 3, week: 13, date: '2018-08-03 17:01:19', sales: 759381183, location: 3 },
    //   { id: 253, season: 3, week: 13, date: '2018-08-03 17:01:19', sales: 4285666432, location: 3 },
    //   { id: 254, season: 3, week: 13, date: '2018-08-03 17:01:19', sales: 4255268456, location: 3 },
    //   { id: 255, season: 3, week: 13, date: '2018-08-03 17:01:19', sales: 419976108, location: 3 },
    //   { id: 256, season: 3, week: 13, date: '2018-08-03 17:01:19', sales: 458095282, location: 3 },
    //   { id: 257, season: 3, week: 13, date: '2018-08-03 17:01:19', sales: 2422973183, location: 3 },
    //   { id: 258, season: 3, week: 14, date: '2018-08-10 20:07:36', sales: 759381183, location: 5 },
    //   { id: 259, season: 3, week: 14, date: '2018-08-10 20:07:36', sales: 4285666432, location: 5 },
    //   { id: 260, season: 3, week: 14, date: '2018-08-10 20:07:36', sales: 19024058, location: 5 },
    //   { id: 261, season: 3, week: 14, date: '2018-08-10 20:07:36', sales: 1667080810, location: 5 },
    //   { id: 262, season: 3, week: 14, date: '2018-08-10 20:07:36', sales: 1035680665, location: 5 },
    //   { id: 263, season: 3, week: 14, date: '2018-08-10 20:07:36', sales: 2782999716, location: 5 },
    //   { id: 264, season: 3, week: 15, date: '2018-08-18 01:10:28', sales: 759381183, location: 4 },
    //   { id: 265, season: 3, week: 15, date: '2018-08-18 01:10:28', sales: 4285666432, location: 4 },
    //   { id: 266, season: 3, week: 15, date: '2018-08-18 01:10:28', sales: 2907129557, location: 4 },
    //   { id: 267, season: 3, week: 15, date: '2018-08-18 01:10:28', sales: 1245809813, location: 4 },
    //   { id: 268, season: 3, week: 15, date: '2018-08-18 01:10:28', sales: 3790373074, location: 4 },
    //   { id: 269, season: 3, week: 15, date: '2018-08-18 01:10:28', sales: 1862800746, location: 4 },
    //   { id: 270, season: 3, week: 16, date: '2018-08-24 17:04:55', sales: 759381183, location: 2 },
    //   { id: 271, season: 3, week: 16, date: '2018-08-24 17:04:55', sales: 4285666432, location: 2 },
    //   { id: 272, season: 3, week: 16, date: '2018-08-24 17:04:55', sales: 3089417789, location: 2 },
    //   { id: 273, season: 3, week: 16, date: '2018-08-24 17:04:55', sales: 3392742912, location: 2 },
    //   { id: 274, season: 3, week: 16, date: '2018-08-24 17:04:55', sales: 1902412292, location: 2 },
    //   { id: 275, season: 3, week: 16, date: '2018-08-24 17:04:55', sales: 2523259392, location: 2 },
    //   { id: 276, season: 3, week: 17, date: '2018-08-31 17:25:36', sales: 759381183, location: 1 },
    //   { id: 277, season: 3, week: 17, date: '2018-08-31 17:25:36', sales: 4285666432, location: 1 },
    //   { id: 278, season: 3, week: 17, date: '2018-08-31 17:25:36', sales: 1667080811, location: 1 },
    //   { id: 279, season: 3, week: 17, date: '2018-08-31 17:25:36', sales: 19024058, location: 1 },
    //   { id: 280, season: 3, week: 17, date: '2018-08-31 17:25:36', sales: 1799380614, location: 1 },
    //   { id: 281, season: 3, week: 17, date: '2018-08-31 17:25:36', sales: 809007410, location: 1 },
    //   { id: 282, season: 4, week: 1, date: '2018-09-07 17:05:05', sales: 4285666432, location: 5 },
    //   { id: 283, season: 4, week: 1, date: '2018-09-07 17:05:05', sales: 19024058, location: 5 },
    //   { id: 284, season: 4, week: 1, date: '2018-09-07 17:05:05', sales: 4284305242, location: 5 },
    //   { id: 285, season: 4, week: 1, date: '2018-09-07 17:05:05', sales: 2523259393, location: 5 },
    //   { id: 286, season: 4, week: 1, date: '2018-09-07 17:05:05', sales: 809007410, location: 5 },
    //   { id: 287, season: 4, week: 2, date: '2018-09-14 17:06:12', sales: 4285666432, location: 1 },
    //   { id: 288, season: 4, week: 2, date: '2018-09-14 17:06:12', sales: 2907129557, location: 1 },
    //   { id: 289, season: 4, week: 2, date: '2018-09-14 17:06:12', sales: 2523259392, location: 1 },
    //   { id: 290, season: 4, week: 2, date: '2018-09-14 17:06:12', sales: 3926392527, location: 1 },
    //   { id: 291, season: 4, week: 2, date: '2018-09-14 17:06:12', sales: 809007411, location: 1 },
    //   { id: 292, season: 4, week: 3, date: '2018-09-21 23:48:34', sales: 4285666432, location: 3 },
    //   { id: 293, season: 4, week: 3, date: '2018-09-21 23:48:34', sales: 3437746471, location: 3 },
    //   { id: 294, season: 4, week: 3, date: '2018-09-21 23:48:34', sales: 1245809814, location: 3 },
    //   { id: 295, season: 4, week: 3, date: '2018-09-21 23:48:34', sales: 510504540, location: 3 },
    //   { id: 296, season: 4, week: 3, date: '2018-09-21 23:48:34', sales: 2897117448, location: 3 },
    //   { id: 297, season: 4, week: 4, date: '2018-09-28 17:01:13', sales: 4285666432, location: 5 },
    //   { id: 298, season: 4, week: 4, date: '2018-09-28 17:01:13', sales: 1345867570, location: 5 },
    //   { id: 299, season: 4, week: 4, date: '2018-09-28 17:01:13', sales: 458095282, location: 5 },
    //   { id: 300, season: 4, week: 4, date: '2018-09-28 17:01:13', sales: 1862800745, location: 5 },
    //   { id: 301, season: 4, week: 4, date: '2018-09-28 17:01:13', sales: 1656912113, location: 5 },
    //   { id: 302, season: 4, week: 5, date: '2018-10-05 17:03:15', sales: 4285666432, location: 4 },
    //   { id: 303, season: 4, week: 5, date: '2018-10-05 17:03:15', sales: 4255268456, location: 4 },
    //   { id: 304, season: 4, week: 5, date: '2018-10-05 17:03:15', sales: 4284305242, location: 4 },
    //   { id: 305, season: 4, week: 5, date: '2018-10-05 17:03:15', sales: 2523259394, location: 4 },
    //   { id: 306, season: 4, week: 5, date: '2018-10-05 17:03:15', sales: 1362342075, location: 4 },
    //   { id: 307, season: 4, week: 6, date: '2018-10-13 01:36:52', sales: 4285666432, location: 2 },
    //   { id: 308, season: 4, week: 6, date: '2018-10-13 01:36:52', sales: 3580904581, location: 2 },
    //   { id: 309, season: 4, week: 6, date: '2018-10-13 01:36:52', sales: 1035680666, location: 2 },
    //   { id: 310, season: 4, week: 6, date: '2018-10-13 01:36:52', sales: 1488061763, location: 2 },
    //   { id: 311, season: 4, week: 6, date: '2018-10-13 01:36:52', sales: 2422973183, location: 2 },
    //   { id: 312, season: 4, week: 7, date: '2018-10-19 17:28:01', sales: 4285666432, location: 4 },
    //   { id: 313, season: 4, week: 7, date: '2018-10-19 17:28:01', sales: 3437746471, location: 4 },
    //   { id: 314, season: 4, week: 7, date: '2018-10-19 17:28:01', sales: 419976108, location: 4 },
    //   { id: 315, season: 4, week: 7, date: '2018-10-19 17:28:01', sales: 2523259395, location: 4 },
    //   { id: 316, season: 4, week: 7, date: '2018-10-19 17:28:01', sales: 809007410, location: 4 },
    //   { id: 317, season: 4, week: 8, date: '2018-10-26 17:15:53', sales: 4285666432, location: 1 },
    //   { id: 318, season: 4, week: 8, date: '2018-10-26 17:15:53', sales: 2208405142, location: 1 },
    //   { id: 319, season: 4, week: 8, date: '2018-10-26 17:15:53', sales: 458095281, location: 1 },
    //   { id: 320, season: 4, week: 8, date: '2018-10-26 17:15:53', sales: 2166230715, location: 1 },
    //   { id: 321, season: 4, week: 8, date: '2018-10-26 17:15:53', sales: 2970800254, location: 1 },
    //   { id: 322, season: 4, week: 9, date: '2018-11-03 03:19:47', sales: 4285666432, location: 3 },
    //   { id: 323, season: 4, week: 9, date: '2018-11-03 03:19:47', sales: 3628991659, location: 3 },
    //   { id: 324, season: 4, week: 9, date: '2018-11-03 03:19:47', sales: 2782999717, location: 3 },
    //   { id: 325, season: 4, week: 9, date: '2018-11-03 03:19:47', sales: 574694189, location: 3 },
    //   { id: 326, season: 4, week: 9, date: '2018-11-03 03:19:47', sales: 2829609851, location: 3 },
    //   { id: 327, season: 4, week: 10, date: '2018-11-09 17:20:27', sales: 4285666432, location: 4 },
    //   { id: 328, season: 4, week: 10, date: '2018-11-09 17:20:27', sales: 3549153979, location: 4 },
    //   { id: 329, season: 4, week: 10, date: '2018-11-09 17:20:27', sales: 1862800745, location: 4 },
    //   { id: 330, season: 4, week: 10, date: '2018-11-09 17:20:27', sales: 1906855381, location: 4 },
    //   { id: 331, season: 4, week: 10, date: '2018-11-09 17:20:27', sales: 3392742912, location: 4 },
    //   { id: 332, season: 4, week: 11, date: '2018-11-17 00:07:03', sales: 4285666432, location: 2 },
    //   { id: 333, season: 4, week: 11, date: '2018-11-17 00:07:03', sales: 1345867571, location: 2 },
    //   { id: 334, season: 4, week: 11, date: '2018-11-17 00:07:03', sales: 1667080811, location: 2 },
    //   { id: 335, season: 4, week: 11, date: '2018-11-17 00:07:03', sales: 197761153, location: 2 },
    //   { id: 336, season: 4, week: 11, date: '2018-11-17 00:07:03', sales: 2076339106, location: 2 },
    //   { id: 337, season: 4, week: 12, date: '2018-11-23 17:41:54', sales: 4285666432, location: 1 },
    //   { id: 338, season: 4, week: 12, date: '2018-11-23 17:41:54', sales: 2856683562, location: 1 },
    //   { id: 339, season: 4, week: 12, date: '2018-11-23 17:41:54', sales: 1862800746, location: 1 },
    //   { id: 340, season: 4, week: 12, date: '2018-11-23 17:41:54', sales: 2600992433, location: 1 },
    //   { id: 341, season: 4, week: 12, date: '2018-11-23 17:41:54', sales: 2829609851, location: 1 },
    //   { id: 342, season: 5, week: 1, date: '2018-11-30 19:54:58', sales: 4285666432, location: 3 },
    //   { id: 343, season: 5, week: 1, date: '2018-11-30 19:54:58', sales: 3089417789, location: 3 },
    //   { id: 344, season: 5, week: 1, date: '2018-11-30 19:54:58', sales: 4284305242, location: 3 },
    //   { id: 345, season: 5, week: 1, date: '2018-11-30 19:54:58', sales: 1862800746, location: 3 },
    //   { id: 346, season: 5, week: 1, date: '2018-11-30 19:54:58', sales: 2829609851, location: 3 },
    //   { id: 347, season: 5, week: 2, date: '2018-12-17 07:01:48', sales: 4285666432, location: 5 },
    //   { id: 348, season: 5, week: 2, date: '2018-12-17 07:02:15', sales: 2856683562, location: 5 },
    //   { id: 349, season: 5, week: 2, date: '2018-12-17 07:02:26', sales: 1035680664, location: 5 },
    //   { id: 350, season: 5, week: 2, date: '2018-12-17 07:02:36', sales: 2523259395, location: 5 },
    //   { id: 351, season: 5, week: 2, date: '2018-12-17 07:02:48', sales: 3392742912, location: 5 },
    //   { id: 352, season: 5, week: 3, date: '2018-12-17 07:05:51', sales: 4285666432, location: 4 },
    //   { id: 353, season: 5, week: 3, date: '2018-12-17 07:05:51', sales: 1345867570, location: 4 },
    //   { id: 354, season: 5, week: 3, date: '2018-12-17 07:05:51', sales: 1245809813, location: 4 },
    //   { id: 355, season: 5, week: 3, date: '2018-12-17 07:05:51', sales: 458095282, location: 4 },
    //   { id: 356, season: 5, week: 3, date: '2018-12-17 07:05:51', sales: 2970800254, location: 4 },
    //   { id: 357, season: 5, week: 4, date: '2018-12-21 18:21:56', sales: 4285666432, location: 5 },
    //   { id: 358, season: 5, week: 4, date: '2018-12-21 18:21:56', sales: 4190156464, location: 5 },
    //   { id: 359, season: 5, week: 4, date: '2018-12-21 18:21:56', sales: 1667080811, location: 5 },
    //   { id: 360, season: 5, week: 4, date: '2018-12-21 18:21:56', sales: 1906855381, location: 5 },
    //   { id: 361, season: 5, week: 4, date: '2018-12-21 18:21:56', sales: 3897389303, location: 5 },
    //   { id: 362, season: 5, week: 5, date: '2019-01-01 16:02:32', sales: 4285666432, location: 2 },
    //   { id: 363, season: 5, week: 5, date: '2019-01-01 16:02:32', sales: 3141979346, location: 2 },
    //   { id: 364, season: 5, week: 5, date: '2019-01-01 16:02:32', sales: 3008550972, location: 2 },
    //   { id: 365, season: 5, week: 5, date: '2019-01-01 16:02:32', sales: 3392742912, location: 2 },
    //   { id: 366, season: 5, week: 5, date: '2019-01-01 16:02:32', sales: 809007410, location: 2 },
    //   { id: 367, season: 5, week: 6, date: '2019-01-11 23:24:32', sales: 4285666432, location: 1 },
    //   { id: 368, season: 5, week: 6, date: '2019-01-11 23:24:32', sales: 3628991658, location: 1 },
    //   { id: 369, season: 5, week: 6, date: '2019-01-11 23:24:32', sales: 1667080810, location: 1 },
    //   { id: 370, season: 5, week: 6, date: '2019-01-11 23:24:32', sales: 3790373072, location: 1 },
    //   { id: 371, season: 5, week: 6, date: '2019-01-11 23:24:32', sales: 2422973183, location: 1 },
    //   { id: 372, season: 5, week: 7, date: '2019-01-11 23:26:39', sales: 4285666432, location: 5 },
    //   { id: 373, season: 5, week: 7, date: '2019-01-11 23:26:39', sales: 4190156464, location: 5 },
    //   { id: 374, season: 5, week: 7, date: '2019-01-11 23:26:39', sales: 4284305242, location: 5 },
    //   { id: 375, season: 5, week: 7, date: '2019-01-11 23:26:39', sales: 1035680665, location: 5 },
    //   { id: 376, season: 5, week: 7, date: '2019-01-11 23:26:39', sales: 2523259395, location: 5 }
    // ];

    // const seasons = data.reduce((seasons, sale) => {
    //   const index = seasons.findIndex(s => s.season === +sale.season);

    //   if (index > -1) {
    //     return [
    //       ...seasons.filter((season, s) => s !== index),
    //       {
    //         season: seasons[index].season,
    //         weeks: [
    //           ...seasons[index].weeks,
    //           {
    //             week: sale.week,
    //             date: sale.date,
    //             location: sale.location,
    //             item: {
    //               id: sale.id,
    //               itemHash: sale.sales
    //             }
    //           }
    //         ]
    //       }
    //     ];
    //   }

    //   return [
    //     ...seasons,
    //     {
    //       season: sale.season,
    //       weeks: [
    //         {
    //           week: sale.week,
    //           date: sale.date,
    //           location: sale.location,
    //           item: {
    //             id: sale.id,
    //             itemHash: sale.sales
    //           }
    //         }
    //       ]
    //     }
    //   ];
    // }, []);

    // const sales = seasons.map(({ season, weeks }, s) => ({
    //   season,
    //   weeks: weeks.reduce((weeks, { item, ...week }) => {
    //     const index = weeks.findIndex((w) => w.week === week.week);

    //     if (index > -1) {
    //       return [
    //         ...weeks.filter((week, w) => w !== index),
    //         {
    //           ...week,
    //           items: [
    //             ...weeks[index].items,
    //             {
    //               id: item.id,
    //               itemHash: item.itemHash
    //             }
    //           ]
    //         }
    //       ]
    //     } else {
    //       return [
    //         ...weeks,
    //         {
    //           ...week,
    //           items: [
    //             {
    //               id: item.id,
    //               itemHash: item.itemHash
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   }, [])
    // }));

    // console.log(sales)

    // const lol = sales.reduce((sales, season) => {
    //   return [
    //     ...sales,
    //     ...season.weeks.map(({items, date, location, ...week}) => ({season: season.season,...week, date: date ? date : 'NULL', location: location || 0, items: `[${items.map(i => i.itemHash).join(',')}]`}))
    //   ]
    // }, [])
    // console.log(lol)
    // console.log(lol.map(week => Object.values(week).join('  ')).join('\n'))

    // const locations = [
    //   { id: 0, world: 'Unknown', region: 'Unknown', x: '0', y: '0', description: 'His will is not his own' },
    //   { id: 1, world: 'Edz', region: 'Winding Cove', x: '0.35', y: '0.67', description: 'Nestled in the uppermost corner, beneath the greater hull of a crashed Fallen dropship.' },
    //   { id: 2, world: 'Titan', region: 'The Rig', x: '0.6', y: '0.45', description: 'Out of sight, out of mind, in an abandoned and unused room overlooking the Methane ocean.' },
    //   { id: 3, world: 'Nessus', region: "Watcher's Grave", x: '0.63', y: '0.18', description: 'Aloft the thickest branch of a red-leafed tree, overlooking the greater area.' },
    //   { id: 4, world: 'Io', region: "Giant's Scar", x: '0.74', y: '0.32', description: 'Dwelling in a cave along the north-western wall.' },
    //   { id: 5, world: 'Tower', region: 'Tower Hangar', x: '0.61', y: '0.31', description: 'Beside an emergency stairwell, behind Arach Jalaal of Dead Orbit.' },
    // ];

    // const history = [
    //   // {
    //   //   "date": "20180505",
    //   //   "location": "nessus"
    //   // },
    //   // {
    //   //   "date": "20180519",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20180525",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20180601",
    //   //   "location": "titan"
    //   // },
    //   // {
    //   //   "date": "20180608",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20180615",
    //   //   "location": "edz"
    //   // },
    //   // {
    //   //   "date": "20180622",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20180629",
    //   //   "location": "nessus"
    //   // },
    //   // {
    //   //   "date": "20180706",
    //   //   "location": "titan"
    //   // },
    //   // {
    //   //   "date": "20180713",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20180720",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20180727",
    //   //   "location": "edz"
    //   // },
    //   // {
    //   //   "date": "20180803",
    //   //   "location": "nessus"
    //   // },
    //   // {
    //   //   "date": "20180810",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20180818",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20180824",
    //   //   "location": "titan"
    //   // },
    //   // {
    //   //   "date": "20180831",
    //   //   "location": "edz"
    //   // },
    //   // {
    //   //   "date": "20180907",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20180914",
    //   //   "location": "edz"
    //   // },
    //   // {
    //   //   "date": "20180921",
    //   //   "location": "nessus"
    //   // },
    //   // {
    //   //   "date": "20180928",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20181005",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20181013",
    //   //   "location": "titan"
    //   // },
    //   // {
    //   //   "date": "20181019",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20181026",
    //   //   "location": "edz"
    //   // },
    //   // {
    //   //   "date": "20181103",
    //   //   "location": "nessus"
    //   // },
    //   // {
    //   //   "date": "20181109",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20181117",
    //   //   "location": "titan"
    //   // },
    //   // {
    //   //   "date": "20181123",
    //   //   "location": "edz"
    //   // },
    //   // {
    //   //   "date": "20181130",
    //   //   "location": "nessus"
    //   // },
    //   // {
    //   //   "date": "20181217",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20181217",
    //   //   "location": "io"
    //   // },
    //   // {
    //   //   "date": "20181221",
    //   //   "location": "tower"
    //   // },
    //   // {
    //   //   "date": "20190101",
    //   //   "location": "titan"
    //   // },
    //   // {
    //   //   "date": "20190111",
    //   //   "location": "tower"
    //   // },
    //   {
    //     date: '20190118',
    //     location: 'io',
    //   },
    //   {
    //     date: '20190125',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190201',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190208',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190215',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190222',
    //     location: 'io',
    //   },
    //   {
    //     date: '20190301',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20190308',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190315',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190322',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190329',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190405',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190412',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190419',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190426',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190503',
    //     location: 'io',
    //   },
    //   {
    //     date: '20190510',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190517',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190524',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190531',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190607',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20190614',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20190621',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190628',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190705',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20190712',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190719',
    //     location: 'io',
    //   },
    //   {
    //     date: '20190726',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190802',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20190809',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20190816',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190823',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20190830',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190906',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190913',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20190920',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20190927',
    //     location: 'io',
    //   },
    //   {
    //     date: '20191004',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20191011',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20191018',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20191025',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20191101',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20191115',
    //     location: 'io',
    //   },
    //   {
    //     date: '20191129',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20191206',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20191213',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20191220',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20191227',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20200103',
    //     location: 'io',
    //   },
    //   {
    //     date: '20200110',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200117',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200124',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200131',
    //     location: 'io',
    //   },
    //   {
    //     date: '20200207',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200214',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200221',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20200228',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200306',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200313',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200320',
    //     location: 'io',
    //   },
    //   {
    //     date: '20200327',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20200403',
    //     location: 'io',
    //   },
    //   {
    //     date: '20200410',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200417',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200424',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200501',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200508',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200515',
    //     location: 'io',
    //   },
    //   {
    //     date: '20200522',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200529',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200605',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200612',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200619',
    //     location: 'io',
    //   },
    //   {
    //     date: '20200626',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20200703',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200710',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200717',
    //     location: 'tower',
    //   },
    //   {
    //     date: '20200724',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200731',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20200807',
    //     location: 'nessus',
    //   },
    //   {
    //     date: '20200814',
    //     location: 'titan',
    //   },
    //   {
    //     date: '20200821',
    //     location: 'edz',
    //   },
    //   {
    //     date: '20200828',
    //     location: 'titan',
    //   },
    // ];

    // const seasonsInfo = {
    //   5: {
    //     DLCName: 'Black Armory',
    //     seasonName: 'Season of the Forge',
    //     seasonTag: 'forge',
    //     season: 5,
    //     year: 2,
    //     maxLevel: 50,
    //     maxPower: 650,
    //     softCap: 500,
    //     releaseDate: '2018-11-27',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 12,
    //   },
    //   6: {
    //     DLCName: "Joker's Wild",
    //     seasonName: 'Season of the Drifter',
    //     seasonTag: 'drifter',
    //     season: 6,
    //     year: 2,
    //     maxLevel: 50,
    //     maxPower: 700,
    //     softCap: 500,
    //     releaseDate: '2019-03-05',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 14,
    //   },
    //   7: {
    //     DLCName: 'Penumbra',
    //     seasonName: 'Season of Opulence',
    //     seasonTag: 'opulence',
    //     season: 7,
    //     year: 2,
    //     maxLevel: 50,
    //     maxPower: 750,
    //     softCap: 500,
    //     releaseDate: '2019-06-04',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 13,
    //   },
    //   8: {
    //     DLCName: 'Shadowkeep',
    //     seasonName: 'Season of the Undying',
    //     seasonTag: 'undying',
    //     season: 8,
    //     year: 3,
    //     maxLevel: 50,
    //     maxPower: 960,
    //     softCap: 900,
    //     releaseDate: '2019-10-01',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 10,
    //   },
    //   9: {
    //     DLCName: '',
    //     seasonName: 'Season of Dawn',
    //     seasonTag: 'dawn',
    //     season: 9,
    //     year: 3,
    //     maxLevel: 50,
    //     maxPower: 970,
    //     softCap: 900,
    //     releaseDate: '2019-12-10',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 13,
    //   },
    //   10: {
    //     DLCName: '',
    //     seasonName: 'Season of the Worthy',
    //     seasonTag: 'worthy',
    //     season: 10,
    //     year: 3,
    //     maxLevel: 50,
    //     maxPower: 1010,
    //     softCap: 950,
    //     releaseDate: '2020-03-10',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 13,
    //   },
    //   11: {
    //     DLCName: '',
    //     seasonName: 'Season of the Arrivals',
    //     seasonTag: 'arrival',
    //     season: 11,
    //     year: 3,
    //     maxLevel: 50,
    //     maxPower: 1060,
    //     softCap: 1000,
    //     releaseDate: '2020-06-09',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 15,
    //   },
    //   12: {
    //     DLCName: 'Beyond Light',
    //     seasonName: 'Season of [the Redacted-12]', // TODO: Update on verification
    //     seasonTag: 'redacted-12', // TODO: Update on verification
    //     season: 12,
    //     year: 4,
    //     maxLevel: 50,
    //     maxPower: 1110, // TODO: Update on verification
    //     softCap: 1050, // TODO: Update on verification
    //     releaseDate: '2020-11-10',
    //     resetTime: '17:00:00Z',
    //     numWeeks: 13,
    //   },
    // };

    // const reddit = [
    //   { date: '2020-08-14', title: '[D2] Xûr Megathread [2020-08-14]', sales: ['978537162', '136355432', '1030017949', '4285666432'] },
    //   { date: '2020-08-28', title: '[D2] Xûr Megathread [2020-08-28]', sales: ['2907129557', '1474735276', '1591207518', '1906093346', '4285666432'] },
    //   { date: '2020-08-21', title: '[D2] Xûr Megathread [2020-08-21]', sales: ['3413860063', '475652357', '2808156426', '3948284065', '4285666432'] },
    //   { date: '2020-07-31', title: '[D2] Xûr Megathread [2020-07-31]', sales: ['2208405142', '3942036043', '3539357318', '3627185503', '4285666432'] },
    //   { date: '2020-07-24', title: '[D2] Xûr Megathread [2020-07-24]', sales: ['2907129557', '4165919945', '2808156426', '1030017949', '4285666432'] },
    //   { date: '2020-08-07', title: '[D2] Xûr Megathread [2020-08-07]', sales: ['4190156464', '1163283805', '2255796155', '3381022971', '4285666432'] },
    //   { date: '2020-07-17', title: '[D2] Xûr Megathread [2020-07-17]', sales: ['4255268456', '903984858', '3539357319', '1725917554', '4285666432'] },
    //   { date: '2020-06-12', title: '[D2] Xûr Megathread [2020-06-12]', sales: ['3766045777', '2766109872', '241462142', '235591051', '4285666432'] },
    //   { date: '2020-06-26', title: '[D2] Xûr Megathread [2020-06-26]', sales: ['3899270607', '475652357', '241462142', '4057299719', '4285666432'] },
    //   { date: '2020-07-10', title: '[D2] Xûr Megathread [2020-07-10]', sales: ['3766045777', '1734144409', '1160559849', '3288917178', '4285666432'] },
    //   { date: '2020-07-03', title: '[D2] Xûr Megathread [2020-07-03]', sales: ['2286143274', '193869522', '3883866764', '4136768282', '4285666432'] },
    //   { date: '2020-06-19', title: '[D2] Xûr Megathread [2020-06-19]', sales: ['3437746471', '2766109874', '136355432', '2082483156', '4285666432'] },
    //   { date: '2020-05-29', title: '[D2] Xûr Megathread [2020-05-29]', sales: ['3549153979', '1219761634', '241462141', '3381022969', '4285666432'] },
    //   { date: '2020-06-05', title: '[D2] Xûr Megathread [2020-06-05]', sales: ['2856683562', '193869520', '2240152949', '3288917178', '4285666432'] },
    //   { date: '2020-05-22', title: '[D2] Xûr Megathread [2020-05-22]', sales: ['1541131350', '1321354573', '3883866764', '3844826440', '4285666432'] },
    //   { date: '2020-05-15', title: '[D2] Xûr Megathread [2020-05-15]', sales: ['3141979346', '1474735277', '1160559849', '3288917178', '4285666432'] },
    //   { date: '2020-05-01', title: '[D2] Xûr Megathread [2020-05-01]', sales: ['4068264807', '2757274117', '2326396534', '1030017949', '4285666432'] },
    //   { date: '2020-05-08', title: '[D2] Xûr Megathread [2020-05-08]', sales: ['4124984448', '1474735276', '1192890598', '1096253259', '4285666432'] },
    //   { date: '2020-04-24', title: '[D2] Xûr Megathread [2020-04-24]', sales: ['3549153978', '1321354573', '1192890598', '3070555693', '4285666432'] },
    //   { date: '2020-02-21', title: '[D2] Xûr Megathread [2020-02-21]', sales: ['3899270607', '2766109872', '3883866764', '3381022969', '4285666432'] },
    //   { date: '2020-04-17', title: '[D2] Xûr Megathread [2020-04-17]', sales: ['1345867571', '1321354572', '3874247549', '3381022969', '4285666432'] },
    //   { date: '2020-03-13', title: '[D2] Xûr Megathread [2020-03-13]', sales: ['1345867571', '193869522', '1734844650', '4057299718', '4285666432'] },
    //   { date: '2020-04-03', title: '[D2] Xûr Megathread [2020-04-03]', sales: ['4124984448', '193869523', '2240152949', '1906093346', '4285666432'] },
    //   { date: '2020-03-27', title: '[D2] Xûr Megathread [2020-03-27]', sales: ['2286143274', '1474735277', '1591207519', '1030017949', '4285666432'] },
    //   { date: '2020-03-20', title: '[D2] Xûr Megathread [2020-03-20]', sales: ['2044500762', '691578978', '136355432', '3627185503', '4285666432'] },
    //   { date: '2020-04-10', title: '[D2] Xûr Megathread [2020-04-10]', sales: ['3844694310', '1474735277', '1192890598', '121305948', '4285666432'] },
    //   { date: '2020-02-07', title: '[D2] Xûr Megathread [2020-02-07]', sales: ['3766045777', '1321354572', '3539357318', '2950045886', '4285666432'] },
    //   { date: '2020-02-14', title: '[D2] Xûr Megathread [2020-02-14]', sales: ['3580904581', '2766109874', '2082483156', '1734844651', '4285666432'] },
    //   { date: '2020-02-28', title: '[D2] Xûr Megathread [2020-02-28]', sales: ['2907129557', '1160559849', '3381022970', '3942036043', '4285666432'] },
    //   { date: '2020-01-24', title: '[D2] Xûr Megathread [2020-01-24]', sales: ['4068264807', '193869523', '1591207518', '2428181146', '4285666432'] },
    //   { date: '2020-03-06', title: '[D2] Xûr Megathread [2020-03-06]', sales: ['19024058', '193869522', '106575079', '1096253259', '4285666432'] },
    //   { date: '2020-01-31', title: '[D2] Xûr Megathread [2020-01-31]', sales: ['3549153978', '193869522', '2082483156', '2255796155', '4285666432'] },
    //   { date: '2020-01-10', title: '[D2] Xûr Megathread [2020-01-10]', sales: ['3766045777', '193869522', '138282166', '2808156426', '4285666432', '312904089'] },
    //   { date: '2020-01-17', title: '[D2] Xûr Megathread [2020-01-17]', sales: ['3899270607', '3883866764', '4136768282', '1053737370', '4285666432'] },
    //   { date: '2020-01-03', title: '[D2] Xûr Megathread [2020-01-03]', sales: [] },
    //   { date: '2019-11-22', title: '[D2] Xûr Megathread [2019-11-22]', sales: [] },
    //   { date: '2019-12-27', title: '[D2] Xûr Megathread [2019-12-27]', sales: ['3549153978', '1734144409', '136355432', '2177524718', '4285666432', '2378215640'] },
    //   { date: '2019-12-13', title: '[D2] Xûr Megathread [2019-12-13]', sales: ['19024058', '475652357', '1192890598', '370930766', '4285666432', '2378215640'] },
    //   { date: '2019-11-08', title: '[D2] Xûr Megathread [2019-11-08]', sales: ['138282166', '609852545', '2808156426', '4285666432', '2378215640'] },
    //   { date: '2019-11-29', title: '[D2] Xûr Megathread [2019-11-29]', sales: ['3628991658', '193869520', '138282166', '1848640623', '4285666432', '2378215640'] },
    //   { date: '2019-10-18', title: '[D2] Xûr Megathread [2019-10-18]', sales: ['2208405142', '1160559849', '138282166', '691578979', '4285666432', '2378215640'] },
    //   { date: '2019-12-20', title: '[D2] Xûr Megathread [2019-12-20]', sales: ['2694576561', '1160559849', '1906093346', '2203146422', '4285666432', '2378215640'] },
    //   { date: '2019-10-04', title: '[D2] Xûr Megathread [2019-10-04]', sales: ['1508896098', '2563444729', '3381022971', '1474735277', '4285666432', '312904089'] },
    //   { date: '2019-11-15', title: '[D2] Xûr Megathread [2019-11-15]', sales: ['3883866764', '1030017949', '978537162', '4285666432', '2378215640'] },
    //   { date: '2019-11-01', title: '[D2] Xûr Megathread [2019-11-01]', sales: ['3628991659', '193869522', '3539357319', '3381022971', '4285666432', '2378215640'] },
    //   { date: '2019-10-11', title: '[D2] Xûr Megathread [2019-10-11]', sales: [] },
    //   { date: '2019-12-06', title: '[D2] Xûr Megathread [2019-12-06]', sales: ['3766045777', '4136768282', '3562696927', '2240152949', '4285666432', '2378215640'] },
    //   { date: '2019-08-23', title: '[D2] Xûr Megathread [2019-08-23]', sales: ['2130065553', '2523259395', '1786557270', '809007410', '4285666432', '312904089'] },
    //   { date: '2019-08-16', title: '[D2] Xûr Megathread [2019-08-16]', sales: ['2208405142', '1656912113', '2897117448', '576499615', '4285666432', '312904089'] },
    //   { date: '2019-10-25', title: '[D2] Xûr Megathread [2019-10-25]', sales: ['2856683562', '241462142', '4165919945', '121305948', '4285666432', '2378215640'] },
    //   { date: '2019-08-09', title: '[D2] Xûr Megathread [2019-08-09]', sales: ['3899270607', '1035680664', '1098931325', '3488362706', '4285666432', '312904089'] },
    //   { date: '2019-09-27', title: '[D2] Xûr Megathread [2019-09-27]', sales: ['3628991659', '1245809812', '2523259393', '1362342075', '4285666432', '312904089'] },
    //   { date: '2019-08-02', title: '[D2] Xûr Megathread [2019-08-02]', sales: ['4285666432'] },
    //   { date: '2019-08-30', title: '[D2] Xûr Megathread [2019-08-30]', sales: ['3628991659', '1906855381', '3392742912', '3488362706', '4285666432', '312904089'] },
    //   { date: '2019-09-06', title: '[D2] Xûr Megathread [2019-09-06]', sales: ['3413860063', '3790373074', '1862800747', '1488061763', '4285666432', '312904089'] },
    //   { date: '2019-09-20', title: '[D2] Xûr Megathread [2019-09-20]', sales: ['3899270607', '1245809813', '1862800746', '809007410', '4285666432', '312904089'] },
    //   { date: '2019-07-12', title: '[D2] Xûr Megathread [2019-07-12]', sales: ['4124984448', '2782999716', '1488061763', '1362342075', '4285666432', '312904089'] },
    //   { date: '2019-09-13', title: '[D2] Xûr Megathread [2019-09-13]', sales: ['1345867571', '419976108', '458095282', '3488362706', '4285666432', '312904089'] },
    //   { date: '2019-06-28', title: '[D2] Xûr Megathread [2019-06-28]', sales: ['3628991659', '1245809814', '3918600864', '3488362706', '4285666432', '312904089'] },
    //   { date: '2019-07-19', title: '[D2] Xûr Megathread [2019-07-19]', sales: ['1345867571', '2782999717', '1656912113', '1643575148', '4285666432', '312904089'] },
    //   { date: '2019-05-24', title: '[D2] Xûr Megathread [2019-05-24]', sales: ['1345867570', '419976110', '3918600864', '3488362706', '4285666432', '312904089'] },
    //   { date: '2019-07-26', title: '[D2] Xûr Megathread [2019-07-26]', sales: ['3141979346', '1799380614', '2600992433', '2829609851', '4285666432', '312904089'] },
    //   { date: '2019-06-14', title: '[D2] Xûr Megathread [2019-06-14]', sales: ['2044500762', '1667080811', '1035680664', '2808445048', '4285666432', '312904089'] },
    //   { date: '2019-07-05', title: '[D2] Xûr Megathread [2019-07-05]', sales: ['2286143274', '1862800747', '3926392527', '510504540', '4285666432', '312904089'] },
    //   { date: '2019-04-05', title: '[D2] Xûr Megathread [2019-04-05]', sales: ['3141979346', '1862800745', '4070560770', '1315823811', '4285666432', '3794435484'] },
    //   { date: '2019-06-07', title: '[D2] Xûr Megathread [2019-06-07]', sales: ['1345867570', '1862800746', '809007410', '4070560771', '4285666432', '312904089'] },
    //   { date: '2019-06-21', title: '[D2] Xûr Megathread [2019-06-21]', sales: ['3844694310', '1098931324', '1484674161', '3488362707', '4285666432', '312904089'] },
    //   { date: '2019-04-19', title: '[D2] Xûr Megathread [2019-04-19]', sales: ['1508896098', '419976110', '458095282', '2954558332', '4285666432', '1086501114'] },
    //   { date: '2019-05-03', title: '[D2] Xûr Megathread [2019-05-03]', sales: ['2286143274', '1488061763', '1315823811', '2389062558', '4285666432', '198570583'] },
    //   { date: '2019-03-22', title: '[D2] Xûr Megathread [2019-03-22]', sales: ['2286143274', '197761152', '1488061763', '2389062558', '4285666432', '2293314698'] },
    //   { date: '2019-04-12', title: '[D2] Xûr Megathread [2019-04-12]', sales: ['3844694310', '1245809812', '3790373072', '2782999717', '4285666432', '2913848309'] },
    //   { date: '2019-03-08', title: '[D2] Xûr Megathread [2019-03-08]', sales: ['814876685', '68357813', '1098931324', '1484674161', '4285666432'] },
    //   { date: '2019-05-10', title: '[D2] Xûr Megathread [2019-05-10]', sales: ['3899270607', '4284305242', '197761152', '2523259392', '4285666432', '3592498273'] },
    //   { date: '2019-03-29', title: '[D2] Xûr Megathread [2019-03-29]', sales: ['2907129557', '1667080809', '1862800747', '1362342075', '4285666432', '2378215640'] },
    //   { date: '2019-05-17', title: '[D2] Xûr Megathread [2019-05-17]', sales: ['3141979346', '1667080810', '1484674161', '2808445048', '4285666432', '2030344701'] },
    //   { date: '2019-03-15', title: '[D2] Xûr Megathread [2019-03-15]', sales: ['3437746471', '1245809813', '809007411', '3488362706', '4285666432', '312904089'] },
    //   { date: '2019-05-31', title: '[D2] Xûr Megathread [2019-05-31]', sales: ['2782999716', '1906855381', '574694189', '4285666432', '312904089'] },
    //   { date: '2019-04-26', title: '[D2] Xûr Megathread [2019-04-26]', sales: ['1345867570', '1245809812', '1035680665', '2076339106', '4285666432', '198570583'] },
    //   { date: '2019-02-01', title: '[D2] Xûr Megathread [2019-02-01]', sales: ['2286143274', '1245809814', '197761153', '2970800254', '4285666432'] },
    //   { date: '2019-02-22', title: '[D2] Xûr Megathread [2019-02-22]', sales: ['3628991658', '1245809813', '1035680666', '2076339106', '4285666432'] },
    //   { date: '2019-01-25', title: '[D2] Xûr Megathread [2019-01-25]', sales: ['3437746471', '2954558333', '574694189', '809007410', '4285666432'] },
    //   { date: '2019-03-01', title: '[D2] Xûr Megathread [2019-03-01]', sales: ['3899270607', '1667080811', '3790373075', '2970800254', '4285666432'] },
    //   { date: '2019-02-08', title: '[D2] Xûr Megathread [2019-02-08]', sales: ['4255268456', '419976108', '1862800747', '809007411', '4285666432'] },
    //   { date: '2019-01-04', title: '[D2] Xûr Megathread [2019-01-04]', sales: ['3628991658', '1667080810', '3790373072', '2422973183', '4285666432'] },
    //   { date: '2019-01-11', title: '[D2] Xûr Megathread [2019-01-11]', sales: ['4190156464', '4284305242', '1035680665', '2523259395', '4285666432'] },
    // ];

    // const hehe = [
    //   { date: '2019-01-18 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2019-01-25 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-02-01 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-02-08 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-02-15 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-02-22 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2019-03-01 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-03-08 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-03-15 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-03-22 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-03-29 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-04-05 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-04-12 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-04-19 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-04-26 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-05-03 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2019-05-10 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-05-17 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-05-24 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-05-31 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-06-07 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-06-14 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-06-21 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-06-28 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-07-05 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-07-12 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-07-19 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2019-07-26 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-08-02 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-08-09 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-08-16 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-08-23 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-08-30 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-09-06 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-09-13 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-09-20 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2019-09-27 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2019-10-04 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-10-11 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-10-18 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-10-25 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-11-01 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-11-15 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2019-11-29 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2019-12-06 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-12-13 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2019-12-20 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2019-12-27 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2020-01-03 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2020-01-10 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-01-17 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-01-24 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-01-31 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2020-02-07 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-02-14 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-02-21 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2020-02-28 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-03-06 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-03-13 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-03-20 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2020-03-27 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2020-04-03 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2020-04-10 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-04-17 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-04-24 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-05-01 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-05-08 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-05-15 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2020-05-22 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-05-29 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-06-05 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-06-12 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-06-19 17:00:00', season: 0, week: 0, sales: [], location: 4 },
    //   { date: '2020-06-26 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2020-07-03 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-07-10 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-07-17 17:00:00', season: 0, week: 0, sales: [], location: 5 },
    //   { date: '2020-07-24 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-07-31 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2020-08-07 17:00:00', season: 0, week: 0, sales: [], location: 3 },
    //   { date: '2020-08-14 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    //   { date: '2020-08-21 17:00:00', season: 0, week: 0, sales: [], location: 1 },
    //   { date: '2020-08-28 17:00:00', season: 0, week: 0, sales: [], location: 2 },
    // ];

    // let s = 5;
    // let w = 7;
    // console.log(
    //   hehe.map((visit, v) => {
    //     if (new Date(visit.date) > new Date(seasonsInfo[s + 1].releaseDate)) {
    //       s++;
    //       w = 0;
    //     }
    //     w++;

    //     return {
    //       ...visit,
    //       season: s,
    //       week: w,
    //       sales: reddit.find((r) => `${r.date} 17:00:00` === visit.date)?.sales.map((s) => +s),
    //     };
    //   }).sort((a, b) => a.date - b.date).map(v => `(NULL, '${v.date}', '${v.season}', '${v.week}', '[${v.sales ? v.sales : ''}]', '${v.location}')`).join(', ')
    // );

    // console.log(history.map(r => ({
    //   date: `${r.date.slice(0, 4)}-${r.date.slice(4, 6)}-${r.date.slice(6, 8)} 17:00:00`,
    //   season: 0,
    //   week: 0,
    //   sales: [],
    //   location: locations.find(l => l.world.toLowerCase() === r.location)?.id || 0
    // })))

    return (
      <div className='view' id='test'>
        {/* <ul className='list collection-items'>
          <Collectibles hashes={reducedCollectibles} />
        </ul>
        <ul className='list record-items'>
          <Records hashes={reducedRecords} />
        </ul>
        <ul className='list collection-items'>
          <Collectibles hashes={hashes} />
        </ul> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='2408405461' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1600633250' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='572122304' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1498852482' instanceid='6917529116167757369' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='3524313097' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='2591746970' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='4103414242' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1864563948' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3899270607' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1852863732' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3948284065' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3887892656' instanceid='6917529029394206558' />
        </div> */}
        <div id='tooltip' className='visible'>
          <Item hash='3887892656' instanceid='6917529029394206558' />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lists: state.lists,
  };
}

export default connect(mapStateToProps)(Test);
