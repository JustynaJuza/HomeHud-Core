// react
import * as React from 'react'

// redux
import { connect } from 'react-redux';
import { IAppState } from '../../store/state';
import { RouteComponentProps } from 'react-router-dom';
import history from '../../history';
import { requestActionCreators } from '../../store/request/requestActionCreators';

// style
import * as style from '../../css/components/layout.css';


// component ---------------------------------------------------------------------------------

type LoginGuardPropsType =
    ILoginGuardProps
    & RouteComponentProps<void>
    & typeof requestActionCreators;

interface ILoginGuardProps {
    isAuthenticated: boolean;
    currentPath: string;
};

class LoginGuard extends React.Component<LoginGuardPropsType, {}> {

    public componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.currentPath);
            history.replace('/login');
        }
    }

    public render() {
        return this.props.isAuthenticated
            ? React.Children.only(this.props.children)
            : null;
    }

}

// redux ---------------------------------------------------------------------------------

export default connect(
    (state: IAppState, ownProps: LoginGuardPropsType) => ({
        isAuthenticated: state.request.isAuthenticated,
        currentPath: ownProps.location.pathname
    }),
    requestActionCreators
)(LoginGuard);