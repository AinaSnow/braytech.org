import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import duds from '../../data/records/duds';
import Records from '../Records';
import Collectibles from '../Collectibles';

import './styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      search: this.props.initialValue || '',
    };

    this.index = [];
  }

  componentDidUpdate(p, s) {
    if (s.results !== this.state.results) {
      this.props.rebindTooltips();
    }
  }

  componentDidMount() {
    const { settings, table, database } = this.props;

    const tables = table ? [table] : enums.manifestTableNames;

    tables.forEach((table) => {
      const entries = Object.keys(manifest[table]).reduce((index, key) => {
        if (!database && manifest[table][key].redacted) {
          return index;
        }

        if (!database && table === 'DestinyRecordDefinition' && settings.itemVisibility.hideDudRecords && duds.indexOf(manifest.DestinyRecordDefinition[key]?.hash) > -1) {
          return index;
        }

        return [
          ...index,
          {
            table: table,
            hash: manifest[table][key].hash,
          },
        ];
      }, []);

      this.index.push(...entries);
    });

    if (this.props.initialValue) {
      this.performSearch();
    }
  }

  onSearchChange = (e) => {
    this.setState({ search: e.target.value });

    this.performSearch();
  };

  onSearchKeyPress = (e) => {
    // If they pressed enter, ignore the debounce and search
    if (e.key === 'Enter') this.performSearch.flush();
  };

  performSearch = debounce((search = this.state.search) => {
    if (!search || search.replace(/(source|type|name|description):/,'').length < 3) {
      this.setState({ results: [] });

      return;
    }

    // console.log(search);

    const term = search.toString().trim().toLowerCase();

    // test for filter prefixes i.e. "name:MIDA Mini Tool"
    const filters = term.match(/(source|type|name|description):/)?.[1];

    const tableMatch = enums.manifestTableNames.find((table) => table.toLowerCase() === term);

    if (tableMatch) {
      const results = Object.keys(manifest[tableMatch]).map((key) => ({
        table: tableMatch,
        hash: manifest[tableMatch][key].hash,
      }));

      // console.log(results);

      this.setState({ results });

      return;
    }

    // console.log(filters)

    let regex = RegExp(term, 'i');

    const results = this.index.filter((entry) => {
      const definition = manifest[entry.table][entry.hash];

      if (!definition) {
        return false;
      }

      if (!this.props.database) {
        const definitionItem = manifest.DestinyInventoryItemDefinition[definition?.itemHash] || false;

        let name = definition?.displayProperties?.name;
        let description = definition?.displayProperties?.description;
        let type = definitionItem?.itemTypeAndTierDisplayName;
        let source = definition?.sourceString;

        // normalise name, description, and type, remove funny versions of 'e'
        name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        description = description.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        type = type ? definitionItem.itemTypeAndTierDisplayName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : false;
        source = source ? definition.sourceString.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : false;

        if (filters && filters === 'name') {
          regex = RegExp(term.replace('name:', '').trim(), 'i');

          if (regex.test(name)) {
            return true;
          }
        } else if (filters && filters === 'description') {
          regex = RegExp(term.replace('description:', '').trim(), 'i');

          if (regex.test(description)) {
            return true;
          }
        } else if (type && filters && filters === 'type') {
          regex = RegExp(term.replace('type:', '').trim(), 'i');

          if (regex.test(type)) {
            return true;
          }
        } else if (source && filters && filters === 'source') {
          regex = RegExp(term.replace('source:', '').trim(), 'i');

          if (regex.test(source)) {
            return true;
          }
        } else {
          if (regex.test(`${name} ${description}`)) {
            return true;
          }
          if (regex.test(definition?.hash)) {
            return true;
          }
        }

        return false;
      } else {
        const root = Object.keys(definition).filter((key) => {
          if (regex.test(definition[key])) {
            return key;
          }

          return false;
        });

        const displayProperties =
          definition.displayProperties &&
          Object.keys(definition.displayProperties).filter((key) => {
            if (regex.test(definition.displayProperties[key])) {
              return key;
            }

            return false;
          });

        if (root.length || displayProperties?.length) {
          return true;
        }

        return false;
      }
    });

    // console.log(results);

    this.setState({ results });
  }, 500);

  render() {
    const { table, database, resultsRenderFunction } = this.props;
    const { results, search } = this.state;

    let display;
    if (!database && table === 'DestinyRecordDefinition') {
      display = (
        <ul className='list record-items'>
          <Records selfLinkFrom='/triumphs' hashes={results.map((e) => e.hash)} ordered />
        </ul>
      );
    } else if (!database && table === 'DestinyCollectibleDefinition') {
      display = (
        <ul className='list collection-items'>
          <Collectibles selfLinkFrom='/collections' hashes={results.map((e) => e.hash)} ordered mouseTooltips />
        </ul>
      );
    } else if (resultsRenderFunction) {
      display = resultsRenderFunction(results);
    } else {
      display = results.join(', ');
    }

    return (
      <div className={cx('index-search', { 'has-results': results.length })}>
        <div className='form'>
          <div className='field'>
            <input onChange={this.onSearchChange} type='text' placeholder={t('enter name or description')} spellCheck='false' value={search} onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        {display}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
    tooltips: state.tooltips,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'TOOLTIPS_REBIND', });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
