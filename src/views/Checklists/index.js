import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import { checklists } from '../../utils/checklists';
import ObservedImage from '../../components/ObservedImage';
import Button from '../../components/UI/Button';
import Checklist from '../../components/Checklist';

import './styles.css';

function getItemsPerPage(width) {
  if (width >= 1600) return 5;
  if (width >= 1200) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  if (width < 768) return 1;
  return 1;
}

const ListButton = (props) => (
  <li key={props.checklistId} className={cx('linked', { active: props.visible })} onClick={props.onClick}>
    {props.checklistImage ? <ObservedImage className='image icon' src={props.checklistImage} /> : <div className='icon'>{props.checklistIcon}</div>}
  </li>
);

export class Checklists extends React.Component {
  state = {
    page: 0,
    itemsPerPage: null,
  };

  static getDerivedStateFromProps(p, s) {
    if (s.itemsPerPage) {
      return null;
    }

    return {
      page: 0,
      itemsPerPage: getItemsPerPage(p.viewport.width),
    };
  }

  handler_toggleCompleted = (e) => {
    this.props.set({
      itemVisibility: {
        hideCompletedChecklistItems: !this.props.settings.itemVisibility.hideCompletedChecklistItems,
      },
    });
  };

  componentDidUpdate(p, s) {
    const newWidth = this.props.viewport.width;

    if (p.viewport.width !== newWidth) {
      this.setState({ itemsPerPage: getItemsPerPage(newWidth) });
    }

    if (s.itemsPerPage !== this.state.itemsPerPage || s.page !== this.state.page) {
      this.props.rebindTooltips();
    }
  }

  handler_changeSkip = (index) => (e) => {
    this.setState({
      page: Math.floor(index / this.state.itemsPerPage),
    });
  };

  render() {
    const { page, itemsPerPage } = this.state;

    const lists = [checklists[2137293116](), checklists[530600409](), checklists[1697465175](), checklists[3142056444](), checklists[4178338182](), checklists[2360931290](), checklists[365218222](), checklists[2955980198](), checklists[2609997025](), checklists[1297424116](), checklists[2726513366](), checklists[1912364094](), checklists[1420597821](), checklists[3305936921](), checklists[655926402](), checklists[4285512244](), checklists[2474271317]()];

    // console.log(lists)

    const sliceStart = parseInt(page, 10) * itemsPerPage;
    const sliceEnd = sliceStart + itemsPerPage;

    const visible = lists.slice(sliceStart, sliceEnd);

    const toggleCompletedLink = (
      <Button action={this.handler_toggleCompleted}>
        {this.props.settings.itemVisibility.hideCompletedChecklistItems ? (
          <>
            <i className='segoe-mdl-square-checked' />
            {t('Show all')}
          </>
        ) : (
          <>
            <i className='segoe-mdl-square' />
            {t('Hide completed')}
          </>
        )}
      </Button>
    );

    return (
      <>
        <div className='view' id='checklists'>
          <div className={cx('padder', 'cols-' + this.state.itemsPerPage)}>
            <div className='module views'>
              <ul className='list'>
                {lists.map((list, l) => (
                  <ListButton key={list.checklistId} checklistItemName_plural={list.checklistName} checklistIcon={list.checklistIcon} checklistImage={list.checklistImage} visible={visible.includes(list)} onClick={this.handler_changeSkip(l)} />
                ))}
              </ul>
            </div>
            {visible.map((list) => (
              <div key={list.checklistId} className='module list'>
                <Checklist {...list} />
              </div>
            ))}
          </div>
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>{toggleCompletedLink}</li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
    viewport: state.viewport,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    set: (payload) => {
      dispatch({ type: 'SETTINGS_SET', payload });
    },
    rebindTooltips: (value) => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checklists);
