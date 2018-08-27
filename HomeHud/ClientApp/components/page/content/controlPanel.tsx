import { map } from 'lodash';
import { filter } from 'lodash';
import { sortBy } from 'lodash';

// react
import * as React from 'react'

// redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IAppState } from '../../../store/state';

import * as LightAction from '../../../store/lights/lightActions';
import * as LightActionTypes from '../../../store/lights/lightActionTypes';

// props
import { IRoom } from '../../../store/config/configState';
import { lightSwitchState } from '../../../store/lights/lightsState';

// components
import LightSwitch from './lightSwitch';
import RoomPanel from './roomPanel';

// style
import * as style from '../../../css/components/control-panel.css';

// component ---------------------------------------------------------------------------------

interface IControlPanelProps {
    dispatch: Dispatch<any>;
    rooms: IRoom[];
    onSwitchAllOn: () => void;
    onSwitchAllOff: () => void;
}

class ControlPanel extends React.Component<IControlPanelProps, {}> {

    private renderRoom = (room: IRoom, index: number) => {
        return (
            <RoomPanel key={index} hash={room.hash} showName={true} showBulkSwitches={false} />
        )
    }

    private renderRooms = () => {
        return map(sortBy(this.props.rooms, (room: IRoom) => room.sortWeight), this.renderRoom);
    }

    public render() {
        return (
            <div>
                <div className={style.container}>
                    <button className={style.button} onClick={() => this.props.onSwitchAllOn()}>Switch all ON</button>
                    <button className={style.button} onClick={() => this.props.onSwitchAllOff()}>Switch all OFF</button>
                </div>

                {this.renderRooms()}

            </div>
        );
    }
}

// redux ---------------------------------------------------------------------------------

const mapStateToProps = (state: IAppState) => {
    return {
        rooms: filter(state.config.rooms, (room: IRoom) => room.lights.length > 0)
    }
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    onSwitchAllOn() {
        dispatch({
            type: LightActionTypes.TrySetAllLightsState,
            lightIds: [],
            state: lightSwitchState.on
        } as LightAction.TrySetAllLightsStateAction)
    },
    onSwitchAllOff() {
        dispatch({
            type: LightActionTypes.TrySetAllLightsState,
            lightIds: [],
            state: lightSwitchState.off
        } as LightAction.TrySetAllLightsStateAction)
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
