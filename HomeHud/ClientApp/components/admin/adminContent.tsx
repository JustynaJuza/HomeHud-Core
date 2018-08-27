// react
import * as React from 'react'

// redux
import { RouteComponentProps } from 'react-router-dom';
import { IPublicListPanelProps } from './listPanel';

// components
import Nav from './nav';
import ListPanel from './listPanel';

// component ---------------------------------------------------------------------------------

class AdminContent extends React.Component<RouteComponentProps<IPublicListPanelProps>, {}> {

    private renderSelectedList() {
        var entryName = this.props.match.params.entryName;
        if (entryName) {
            return <ListPanel entryName={entryName} />
        }

        return null;
    }


    public render() {
        return (
            <div>
                { this.renderSelectedList() }
            </div>
        );
    }
}

export default AdminContent;