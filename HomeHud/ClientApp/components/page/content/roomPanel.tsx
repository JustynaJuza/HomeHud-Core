import { map } from 'lodash';
import { filter } from 'lodash';
import { sortBy } from 'lodash';
import { indexOf } from 'lodash';

// react
import * as React from 'react'
import * as classNames from 'classnames';

import * as LightAction from '../../../store/lights/lightActions';
import * as LightActionTypes from '../../../store/lights/lightActionTypes';

// redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IAppState } from '../../../store/state';

// props
import { lightSwitchState, ILightSwitchState } from '../../../store/lights/lightsState';
import { IRoom } from '../../../store/config/configState';

// components
import LightSwitch from './lightSwitch';

// style
import * as style from '../../../css/components/room-panel.css';

// component ---------------------------------------------------------------------------------

export interface IRoomPanelPublicProps {
    hash: string;
    showName: boolean;
    showBulkSwitches: boolean;
}

interface IRoomPanelProps extends IRoomPanelPublicProps {
    name: string;
    onSwitchAllOn: (lights: Array<ILightSwitchState>) => void;
    onSwitchAllOff: (lights: Array<ILightSwitchState>) => void;
    lights: Array<ILightSwitchState>;
}

class RoomPanel extends React.Component<IRoomPanelProps, {}> {

    private renderLightSwitch = (entry: ILightSwitchState, index: number) => {
        return (
            <LightSwitch key={index} id={entry.id} />
        )
    }

    private renderLightSwitches = () => {
        return map(this.props.lights, this.renderLightSwitch);
    }

    public render() {

        var nameClasses = classNames(
            style.name,
            {
                [style.hidden]: !this.props.showName
            });

        var switchesClasses = classNames(
            style.container,
            {
                [style.hidden]: !this.props.showBulkSwitches
            });

        return (
            <div>

                <div className={switchesClasses}>
                    <button className={style.button} onClick={() => this.props.onSwitchAllOn(this.props.lights)}>Switch all ON</button>
                    <button className={style.button} onClick={() => this.props.onSwitchAllOff(this.props.lights)}>Switch all OFF</button>
                </div>
                <div className={style.container}>
                    <h2 className={nameClasses}>{this.props.name}</h2>

                    {this.renderLightSwitches()}
                </div>

            </div>
        );
    }
}

// redux ---------------------------------------------------------------------------------

const mapStateToProps = (state: IAppState, publicProps: IRoomPanelPublicProps) => {


    var configEntry = filter(state.config.rooms, (room:IRoom) => { return room.hash === publicProps.hash })[0];
    if (!configEntry) {
        return {
            name: '',
            lights:[]
        }
        //throw Error("Invalid room config, room with hash " + publicProps.hash + " is expected to have an entry in the config.");
    }

    return {
        name: configEntry.name,
        lights: filter(state.lights.all, (light) => {
            return indexOf(configEntry.lights, light.id) > -1;
        })
    };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    onSwitchAllOn(lights: Array<ILightSwitchState>) {
        dispatch({
            type: LightActionTypes.TrySetAllLightsState,
            lightIds: map(lights, (light:ILightSwitchState) => light.id),
            state: lightSwitchState.on
        } as LightAction.TrySetAllLightsStateAction)
    },
    onSwitchAllOff(lights: Array<ILightSwitchState>) {
        dispatch({
            type: LightActionTypes.TrySetAllLightsState,
            lightIds: map(lights, (light:ILightSwitchState) => light.id),
            state: lightSwitchState.off
        } as LightAction.TrySetAllLightsStateAction)
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPanel);
