import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { groupBy } from 'lodash';

import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import Items from '../../Items';
import Spinner from '../../UI/Spinner';
import { NoAuth, DiffProfile } from '../../BungieAuth';

import './styles.css';

class VendorSpiderMaterials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: false,
    };
  }

  componentDidMount() {
    const { vendorHash = 863940356 } = this.props;

    this.getVendor(vendorHash);
  }

  componentDidUpdate(p, s) {
    if (s.loading !== this.state.loading) {
      this.props.rebindTooltips();
    }
  }

  getVendor = async (vendorHash) => {
    const response = await bungie.GetVendor({
      params: {
        membershipType: this.props.member.membershipType,
        membershipId: this.props.member.membershipId,
        characterId: this.props.member.characterId,
        vendorHash,
        components: [400, 402, 300, 301, 304, 305, 306, 307, 308, 600].join(','),
      },
    });

    if (response && response.ErrorCode === 1 && response.Response) {
      this.setState({
        loading: false,
        data: response.Response,
      });
    } else {
      this.setState((p) => ({
        ...p,
        loading: false,
      }));
    }
  };

  render() {
    const { t, member, auth, vendorHash = 863940356 } = this.props;

    if (!auth) {
      return <NoAuth inline />;
    }

    if (auth && !auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
      return <DiffProfile inline />;
    }

    const definitionVendor = manifest.DestinyVendorDefinition[vendorHash];

    if (auth && auth.destinyMemberships.find((m) => m.membershipId === member.membershipId) && this.state.loading) {
      return (
        <div className='user-module vendor'>
          <div className='sub-header'>
            <div>{t('Vendor')}</div>
          </div>
          <h3>{definitionVendor.displayProperties.name}</h3>
          <Spinner />
        </div>
      );
    }

    const items = [];

    if (this.state.data) {
      Object.values(this.state.data.sales.data).forEach((sale) => {
        items.push({
          vendorHash: definitionVendor.hash,
          ...((sale.vendorItemIndex !== undefined && definitionVendor && definitionVendor.itemList && definitionVendor.itemList[sale.vendorItemIndex]) || {}),
          ...sale,
        });
      });
    }

    const itemsGrouped = groupBy(items, (i) => i.displayCategoryIndex);

    return (
      <div className='user-module vendor'>
        <div className='sub-header'>
          <div>{t('Vendor')}</div>
        </div>
        <h3>{definitionVendor.displayProperties.name}</h3>
        {definitionVendor.displayCategories.map((category, c) => {
          if (itemsGrouped[category.index] && category.identifier === 'category_materials_exchange') {
            return (
              <React.Fragment key={c}>
                <h4>{category.displayProperties.name}</h4>
                <ul className='list special'>
                  {itemsGrouped[category.index].map((item, i) => (
                    <li key={i}>
                      <ul>
                        <li>
                          <ul className='list inventory-items'>
                            <Items items={[item]} />
                          </ul>
                        </li>
                        <li>{manifest.DestinyInventoryItemDefinition[item.itemHash]?.displayProperties?.name}</li>
                        <li>
                          <ul>
                            {item.costs.map((cost, t) => (
                              <li key={t}>
                                <ul>
                                  <li>{cost.quantity.toLocaleString()}</li>
                                  <li>
                                    <ul className='list inventory-items'>
                                      <Items items={[cost]} hideQuantity />
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: (value) => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    },
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(VendorSpiderMaterials);
