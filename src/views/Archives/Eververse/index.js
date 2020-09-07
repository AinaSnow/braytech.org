import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import manifest from '../../../utils/manifest';
import Items from '../../../components/Items';

import { NavLinks } from '../';

import './styles.css';

function project(itemList, weekTotalCeiling) {
  const weeks = [];

  let week = [];
  let weekTotal = 0;
  let classSet = 0;

  itemList.forEach((i, k) => {
    // set for use later i.e. tooltips
    i.vendorHash = '3361454721';

    week.push(i);
    weekTotal++;

    const nextIsClassItem = (itemList[k] && manifest.DestinyInventoryItemDefinition[itemList[k].itemHash]?.classType > -1 && manifest.DestinyInventoryItemDefinition[itemList[k].itemHash]?.classType < 3) || (itemList[k] && ['titan', 'hunter', 'warlock'].filter(test => manifest.DestinyInventoryItemDefinition[itemList[k].itemHash].plug?.plugCategoryIdentifier?.indexOf(test) > -1).length);

    console.log(`classSet: ${classSet}`);
    if (nextIsClassItem) {
      console.log(`Next item is a class item: ${manifest.DestinyInventoryItemDefinition[itemList[k].itemHash].displayProperties.name}`);

      if (classSet === 0) {
        classSet = 3;
        weekTotal = weekTotal - 2;
      }
    }

    if (classSet > 0) {
      classSet--;
    }

    if (weekTotal === weekTotalCeiling) {
      weeks.push(week);

      console.log(`Week: ${weeks.length + 1}`);

      week = [];
      weekTotal = 0;
    }
  });

  console.log(weeks);

  return weeks;
}

class Eververse extends React.Component {
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

    const definitionVendor = manifest.DestinyVendorDefinition[3361454721];
    // console.log(definitionVendor);

    const repeatConumables = [
      353932628,  // Concentrated Mattergem
      3187955025, // Glimmershard
      2638689062, // Scavenger's Boon
    ];
    
    const weeks_featuredSilverItems = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 3), 6);
    const weeks_brightDustItems = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 9), 7);
    const weeks_featuredBrightDustItems = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 4).filter(i => repeatConumables.indexOf(i.itemHash) < 0), 4);
    const weeks_brightDustConsumables = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 10).slice(3), 4);

    console.log(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 3).map(i => manifest.DestinyInventoryItemDefinition[i.itemHash].displayProperties.name))
    console.log(definitionVendor.itemList.filter(i => i.itemHash === 10656656))

    return (
      <div className='view eververse' id='archives'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Archives')}</div>
            <div className='name'>{t('Eververse Season Overview')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='content'>
            <div className='module'>
              <div className='text'>
                <ReactMarkdown className='text' source={t("Details each of the current season's weekly Eververse store stock to allow the viewer assistance in maximising their Silver efficiency.\n\nThis data comes directly from the API manifest's definition of _Tess Everis_ and is displayed by merely iterating over it. If data appears incomplete, it is likely due to manifest content being incomplete i.e. new content that has not yet been added.")} />
              </div>
            </div>
            <div className='module'>
            <ul className='list weeks'>
              {weeks_brightDustItems.map((w, n) => (
                <li key={n}>
                  <ul>
                    <li>{t('Week {{weekNumber}}', { weekNumber: n + 1 })}</li>
                  </ul>
                  <ul>
                    <li className='category'>{t('Featured silver items')}</li>
                    <li>
                      <ul className='list inventory-items'>
                        <Items items={weeks_featuredSilverItems[n]} />
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li className='category'>{t('Featured bright dust items')}</li>
                    <li>
                      <ul className='list inventory-items'>
                        <Items items={weeks_featuredBrightDustItems[n]} />
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li className='category'>{t('Bright dust items')}</li>
                    <li>
                      <ul className='list inventory-items'>
                        {/* {weeks_brightDustConsumables[n] && <Items items={[...w, ...weeks_brightDustConsumables[n]]} />} */}
                        
                        <Items items={[...w]} />
                      </ul>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
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
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(null, mapDispatchToProps), withTranslation())(Eververse);
