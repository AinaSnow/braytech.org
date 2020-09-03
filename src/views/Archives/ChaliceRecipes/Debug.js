import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../utils/manifest';
import Items from '../../../components/Items';

import ChaliceCombos from '../../../data/chalice-data';

import './styles.css';

class ChaliceRecipesDebug extends React.Component {
  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t } = this.props;
    
    // const sets = [
    //   {
    //     name: 'Reverie Dawn',
    //     nodes: [
    //       3952745160, // titan
    //       3476818388, // hunter
    //       4139791841, // warlock
    //     ]
    //   },
    //   {
    //     name: 'Opulent',
    //     nodes: [
    //       3760158863, // titan
    //   327169819, // hunter
    //   2551808106, // warlock
    //     ]
    //   },
    //   {
    //     name: 'Exodus Down',
    //     nodes: [
    //       3952745158, // titan
    //   3476818394, // hunter
    //   4139791855, // warlock
    //     ]
    //   },
    //   {
    //     name: 'Tangled Web',
    //     nodes: [
    //       3110922166, // titan
    //   3986530602, // hunter
    //   2983784769 // warlock
    //     ]
    //   }
    // ]

    // const armors = sets.map(set => {
    //   set.nodes = set.nodes.map(node => {
    //     const def = manifest.DestinyPresentationNodeDefinition[node];

    //     return {
    //       nodeHash: node,
    //       classType: manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[def.children.collectibles[0].collectibleHash].itemHash].classType,
    //       collectibles: def.children.collectibles.map(c => c.collectibleHash)
    //     }
    //   });
    //   return set;
    // })

    // console.log(armors)

    // const obj = {}
    
    // armors.forEach(set => {
    //   // manifest.DestinyCollectibleDefinition[c.collectibleHash].itemHash

    //   set.nodes.forEach(node => {

    //     node.collectibles.forEach(hash => {

    //       const defItem = manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[hash].itemHash];
  
    //       const armor2matches = Object.values(manifest.DestinyInventoryItemDefinition).filter(d => d.displayProperties?.name === defItem.displayProperties?.name && d.sockets?.socketCategories?.find(c => c.socketCategoryHash === 760375309));
  
    //       const item = armor2matches[0];

    //       obj[set.name] = obj[set.name] || {};

    //       let type = item.itemSubType === 30 ? 'Class Item' : item.itemTypeDisplayName;
  
    //       obj[set.name][type] = [...obj[set.name][type] || [], item.hash];
  
    //     })

    //   })

    // })

    
    // console.log(obj)

    return (
        <div className='view chalice-of-opulence debug' id='archives'>
          <div className='module head'>
            <div className='page-header'>
              <div className='sub-name'>{t('Archives')}</div>
              <div className='name'>{manifest.DestinyInventoryItemDefinition[1115550924].displayProperties.name}</div>
            </div>
          </div>
          <div className='buff'>
          {this.props.nav}
          <div className='content'>
            <div className='debug module'>
              {ChaliceCombos.map((c, i) => (
                <div key={i} className='combo'>
                  <div>
                    <ul className='list inventory-items'>
                      <Items items={c.combo.flat().map(i => ({ itemHash: i }))} />
                    </ul>
                  </div>
                  <div>
                    <ul className='list inventory-items'>
                      <Items items={c.items.map(i => ({ itemHash: i }))} />
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(null, mapDispatchToProps), withTranslation())(ChaliceRecipesDebug);
