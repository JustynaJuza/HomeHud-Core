import { map } from 'lodash';
import { filter } from 'lodash';
import { sortBy } from 'lodash';
import { indexOf } from 'lodash';

// react
import * as React from 'react'

// redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IAppState } from '../../store/state';
import { RouteComponentProps } from 'react-router-dom';

// components
import NavTab from './nav.tab';
import { routerEntryMap } from '../../store/config/configState';

// style
import * as style from '../../css/components/roomNav.css';

// component ---------------------------------------------------------------------------------

interface INavTab {
    name: string;
    hash: string | string[];
}

interface INavProps {
    tabs: INavTab[];
}

type INavPropsType =
    INavProps
    & RouteComponentProps<any>;


class Nav extends React.Component<INavPropsType, {}> {

    private activateNavTab(hash: string|string[]) {
        if (!hash) return false;

        if(hash instanceof Array) {
            return indexOf(hash, this.props.location.hash) > -1
        }

        return hash == this.props.location.hash
    }

    private renderTab = (tab: INavTab, index: number) => {
        return (
            <NavTab key={index} hash={tab.hash} isActive={this.activateNavTab(tab.hash)}>
                {tab.name}
            </NavTab>
        )
    }

    private renderTabs = () => {
        return map(sortBy(this.props.tabs, t => t.name), this.renderTab);
    }

    public render() {
        return (
            <div className={style.container}>
                <ul className={style.list}>
                    {this.renderTabs()}
                </ul>
            </div>
        );
    }
}

export default connect(
    (state: IAppState, publicProps: RouteComponentProps<any>) => ({
        tabs: map(
            Object.getOwnPropertyNames(state.config),
            configEntry => ({
                name: configEntry,
                hash: filter(Object.getOwnPropertyNames(routerEntryMap), x => routerEntryMap[x] == configEntry)
            })) as INavTab[]
    }),
    {}
)(Nav);