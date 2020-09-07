import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import { DestinyKey } from '../../../components/UI/Button';
import { Grimoire as Icons } from '../../../svg';

import './styles.css';

import GrimoireCard from './GrimoireCard';
import GrimoireTheme from './GrimoireTheme';

class Grimoire extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  render() {
    const { definitions } = this.props;
    const { themeId, pageId, cardId } = this.props.match.params;

    const definitionCard = definitions.DestinyGrimoireCardDefinition[cardId];
    const definitionTheme = definitions.DestinyGrimoireDefinition.themeCollection.find(t => t.themeId === themeId);
    const definitionPage = definitionTheme && definitionTheme.pageCollection.find(p => p.pageId === pageId);

    console.log(definitions);

    return (
      <div className='view grimoire' id='archives'>
        <div className='container'>
          {definitionCard ? (
            <GrimoireCard definitions={definitions} {...this.props.match.params} />
          ) : definitionTheme ? (
            <GrimoireTheme definitions={definitions} {...this.props.match.params} />
          ) : (
            <div className='themes'>
              <div className='header'>
                <div className='wrapper'>
                  <div className='text'>
                    <div className='name'>{t('Grimoire')}</div>
                  </div>
                </div>
              </div>
              <div className='content'>
                <div className='wrapper'>
                  <div className='collections'>
                    {definitions.DestinyGrimoireDefinition.themeCollection.map((theme, t) => {
                      const Icon = Icons[theme.themeId];

                      return (
                        <div key={t} className='collection'>
                          <div className='art'>
                            <div className='icon'>
                              <Icon />
                            </div>
                            <Link className='button' to={`/archives/grimoire/${theme.themeId}`} />
                          </div>
                          <div className='text'>
                            <div className='name'>{theme.themeName}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {definitionCard || definitionTheme ? (
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                {definitionCard || definitionTheme ? (
                  <li>
                    <Link className='button' to={definitionCard ? `/archives/grimoire/${definitionTheme.themeId}/${definitionPage.pageId}/` : `/archives/grimoire/`}>
                      <DestinyKey type='dismiss' />
                      {t('Back')}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        ) : null}
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

export default compose(connect(null, mapDispatchToProps), withRouter)(Grimoire);
