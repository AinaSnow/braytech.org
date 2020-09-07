import React from 'react';
import { connect } from 'react-redux';
import { groupBy } from 'lodash';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import Items from '../../../components/Items';
import Spinner from '../../../components/UI/Spinner';
import { NoAuth, DiffProfile } from '../../../components/BungieAuth';

import './styles.css';

class Vendor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: false,
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.getVendor(this.props.vendorHash);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (s.loading !== this.state.loading) {
      this.props.rebindTooltips();
    }
  }

  getVendor = async (vendorHash = 672118013) => {
    const response = await bungie.GetVendor({
      params: {
        membershipType: this.props.member.membershipType,
        membershipId: this.props.member.membershipId,
        characterId: this.props.member.characterId,
        vendorHash,
        components: [400, 402, 300, 301, 304, 305, 306, 307, 308, 600].join(','),
      }
    });

    if (response && response.ErrorCode === 1 && response.Response) {
      if (this.mounted) {
        this.setState({
          loading: false,
          data: response.Response,
        });
      }
    } else {
      if (this.mounted) {
        this.setState((state) => ({
          ...state,
          loading: false,
        }));
      }
    }
  };

  render() {
    const { member, auth, vendorHash = 672118013 } = this.props;

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

    const groupedSales = groupBy(
      this.state.data
        ? Object.keys(this.state.data.sales.data)
            .filter((key) => {
              const sale = this.state.data.sales.data[key];

              // if it's one of those nonsense categories such as redeeming tokens, omit
              if (definitionVendor.displayCategories?.[definitionVendor.itemList?.[sale.vendorItemIndex]?.displayCategoryIndex]?.displayCategoryHash === 3960628832) return false;

              return true;
            })
            .map((key) => {
              const sale = this.state.data.sales.data[key];

              return {
                vendorHash: definitionVendor.hash,
                ...((sale.vendorItemIndex !== undefined && definitionVendor.itemList?.[sale.vendorItemIndex]) || {}),
                ...sale,
              };
            })
        : [],
      (sale) => sale.displayCategoryIndex
    );

    if (vendorHash === 2398407866) console.log(groupedSales);

    return (
      <div className='user-module vendor'>
        <div className='sub-header'>
          <div>{t('Vendor')}</div>
        </div>
        <h3>{definitionVendor.displayProperties.name}</h3>
        {definitionVendor.displayCategories.map((category, c) => {
          if (groupedSales[category.index]) {
            return (
              <React.Fragment key={c}>
                <h4>{category.displayProperties.name}</h4>
                <ul className='list inventory-items'>
                  <Items items={groupedSales[category.index]} />
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

function mapStateToProps(state) {
  return {
    member: state.member,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'TOOLTIPS_REBIND' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
