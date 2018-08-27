import { map } from 'lodash';
import { filter } from 'lodash';
import { sortBy } from 'lodash';

// react
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IAppState } from '../../store/state';

// props
import { IRoom } from '../../store/config/configState';
import { ISelectedContent } from '../../store/nav/navState';

// components
import RoomNavTab from './roomNav.tab';

// style
import * as style from '../../css/components/roomNav.css';

// component ---------------------------------------------------------------------------------

export interface IRoomNavProps {
    rooms: IRoom[];
    hash: string;
}

type RoomNavPropsType =
    IRoomNavProps
    & RouteComponentProps<IRoomNavProps>;


class RoomNav extends React.Component<RoomNavPropsType, {}> {

    private renderControlPanelTab = () => {
        return (
            <RoomNavTab key={0} hash={''} isActive={!this.props.match.params.hash}>
                Control Panel
            </RoomNavTab>
        )
    }

    private renderRoomNavTab = (room: IRoom, index: number) => {
        return (
            <RoomNavTab key={index + 1} hash={room.hash} isActive={room.hash === this.props.match.params.hash}>
                {room.name}
            </RoomNavTab>
        )
    }

    private renderRoomTabs = () => {
        return map(sortBy(this.props.rooms, (room: IRoom) => room.sortWeight), this.renderRoomNavTab);
    }

    public render() {

        return (
            <div className={style.container}>
                <ul className={style.list}>
                    { this.renderControlPanelTab() }
                    { this.renderRoomTabs() }
                </ul>
            </div>
        );
    }
}

// redux ---------------------------------------------------------------------------------

export default connect(
    (state: IAppState, publicProps: RouteComponentProps<IRoomNavProps>) => ({
        rooms: filter(state.config.rooms, room => room.lights.length > 0) as IRoom[]
    }),
    {}
)(RoomNav);
