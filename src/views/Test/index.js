import React from 'react';
import { connect } from 'react-redux';

import manifest from '../../utils/manifest';

import { stringToIcons } from '../../utils/destinyUtils';
import { sockets } from '../../utils/destinyItems/sockets';
import { stats } from '../../utils/destinyItems/stats';

import Item from '../../components/Tooltip/Item';

import './styles.css';

class Test extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);

    const oof = [];

    Object.values(manifest.DestinyObjectiveDefinition).forEach(definition => {
      if (definition.progressDescription.indexOf('[') > -1) {
        const lol = stringToIcons(definition.progressDescription);
        
        if (lol[0].indexOf('[') > -1) console.log(definition.hash, lol)
        if (lol[0].indexOf('[') > -1) oof.push({ objectiveHash: definition.hash, unicode: 'lol', substring: definition.progressDescription })
      }
    });

    console.log(JSON.stringify(oof))
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <div className='view' id='test'>
        <div id='tooltip' className='visible'>
          <Item hash='2408405461' />
        </div>
        {/* <div id='tooltip' className='visible'>
          <Item hash='1600633250' />
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
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='3899270607' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1852863732' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='572122304' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='1498852482' instanceid='6917529116167757369' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3948284065' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3887892656' instanceid='6917529029394206558' />
        </div> */}
        <div id='tooltip' className='visible'>
          <Item hash='820036195' />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps)(Test);
