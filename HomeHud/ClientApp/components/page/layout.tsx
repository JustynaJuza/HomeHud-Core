//react
import * as React from 'react';
import { connect } from 'react-redux';
import history from '../../history';

// redux
import { IConfigState } from '../../store/config/configState';
import { IAppState } from '../../store/state';
import { defaultRedirect } from '../../router';
import { RouteComponentProps } from 'react-router-dom';
import { IRoomNavProps } from './roomNav';

import { initialStateLoader } from '../../store/initialStateLoader';
import { requestActionCreators } from '../../store/request/requestActionCreators';

// components
import { Header } from './header';

// style
import * as style from '../../css/components/layout.css';

// component ---------------------------------------------------------------------------------

interface ILayoutProps {
    isAuthenticated: boolean,
    redirectUrl: string
};

type LayoutPropsType =
    ILayoutProps
    & RouteComponentProps<IRoomNavProps>
    & typeof initialStateLoader
    & typeof requestActionCreators;

class Layout extends React.Component<LayoutPropsType, {}> {

    public componentWillMount() {
        this.props.getInitialState();
    }

    public componentDidUpdate(prevProps: ILayoutProps) {
        const isLoggingOut = prevProps.isAuthenticated && !this.props.isAuthenticated
        const isLoggingIn = !prevProps.isAuthenticated && this.props.isAuthenticated

        if (isLoggingIn) {

            if (this.props.redirectUrl) {
                history.replace(this.props.redirectUrl);
                this.props.setLoginRedirectUrl(null);
            }
            else {
                history.push(defaultRedirect);
            }

        } else if (isLoggingOut) {
            // in future, use some external api to show some fun facts or quotes on logout :)
        }
    }

    public render() {

        return (
            <div className={style.layout}>
                <Header />
                <div className={style.content}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

// redux ---------------------------------------------------------------------------------
export default connect(
    (state: IAppState, publicProps: RouteComponentProps<IRoomNavProps>) => ({
        isAuthenticated: state.request.isAuthenticated,
        redirectUrl: state.request.loginRedirectUrl
    }),
    // merge multiple action creators
    Object.assign(initialStateLoader, requestActionCreators)
)(Layout);