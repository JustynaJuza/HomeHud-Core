// react
import * as React from 'react'

// redux
import { RouteComponentProps } from 'react-router-dom';
import { IRoomNavProps } from './roomNav';

// components
import RoomNav from './roomNav';
import RoomPanel from './content/roomPanel';
import ControlPanel from './content/controlPanel';

// component ---------------------------------------------------------------------------------

class RoomContent extends React.Component<RouteComponentProps<IRoomNavProps>, {}> {

    private renderSelectedRoom() {
        var hash = this.props.match.params.hash;
        return hash
            ? <RoomPanel hash={hash} showName={false} showBulkSwitches={true}/>
            : <ControlPanel />
    }

    public render() {
        return (
            <div>
                <RoomNav {...this.props}/>
                { this.renderSelectedRoom() }
            </div>
        );
    }
}

export default RoomContent;