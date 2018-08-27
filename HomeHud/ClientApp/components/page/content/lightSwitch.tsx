// react
import * as React from 'react'
import * as classNames from 'classnames';

// redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IAppState } from '../../../store/state';

import * as LightAction from '../../../store/lights/lightActions';
import * as LightActionTypes from '../../../store/lights/lightActionTypes';

// props
import { lightSwitchState } from '../../../store/lights/lightsState';

// style
import * as style from '../../../css/components/light-switch.css';

// component ---------------------------------------------------------------------------------

interface ILightSwitchPublicProps {
    id: string | number;
}

interface ILightSwitchProps extends ILightSwitchPublicProps {
    state: number;
    description: string;
    onSwitchOn: (id: string | number) => void;
    onSwitchOff: (id: string | number) => void;
}

class LightSwitch extends React.Component<ILightSwitchProps, {}> {

    private onSwitchChange() {
        return this.props.state === 1
            ? this.props.onSwitchOff(this.props.id)
            : this.props.onSwitchOn(this.props.id)
    }

    private getSwitchStyle() {
        switch (this.props.state) {
            case 0:
                return style.off;
            case 1:
                return style.on;
            case 2:
                return style.switching_on;
            case 3:
                return style.switching_off;
            default:
                return '';
        }
    }

    private isDisabled() {
        switch (this.props.state) {
            case 0:
            case 1:
                return false;
            case 2:
            case 3:
                return true;
            default:
                return false;
        }
    }

    public render() {

        var lightClasses = classNames(style.light, this.getSwitchStyle())

        return (
            <div className={lightClasses}>

                <div className={style.light_switcher}
                    onClick={() => this.onSwitchChange()}>

                    <button className={style.switcher}
                        disabled={this.isDisabled()}></button>

                </div>

                <span className={style.icon}></span>
            </div>
        );
    }
}

// redux ---------------------------------------------------------------------------------

const mapStateToProps = (appState: IAppState, publicProps: ILightSwitchPublicProps) => {

    var light = appState.lights.all
        .filter((light) => { return light.id === publicProps.id })[0];

    if (!light) {
        throw Error("Invalid lights config, lightId " + publicProps.id + " is expected to have an entry in the config.");
    }

    return {
        state: light.state
    }
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    onSwitchOn(id: string | number) {

        dispatch({
            type: LightActionTypes.TrySetLightState,
            lightId: id,
            state: lightSwitchState.on
        } as LightAction.TrySetLightStateAction)
    },
    onSwitchOff(id: string | number) {

        dispatch({
            type: LightActionTypes.TrySetLightState,
            lightId: id,
            state: lightSwitchState.off
        } as LightAction.TrySetLightStateAction)
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LightSwitch);
