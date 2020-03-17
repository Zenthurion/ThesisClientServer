import React from 'react';
//import logo from './logo.svg';
import './App.css';

import LoginBox from './components/LoginBox';
import RoleSelection from './components/RoleSelection';
import { Role } from './Role';
import PresenterView from './components/PresenterView';
import AttendeeView from './components/AttendeeView';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { blueGrey, grey, lime, orange } from '@material-ui/core/colors';

enum Page {
    Login,
    RoleSelection,
    PresenterView,
    AttendeeView
}

interface State {
    page: Page;
}

export const mainTheme: Theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: lime,
        secondary: orange
    }
});

export default class App extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            page: Page.RoleSelection
        };

        document.body.style.background = grey[900];
    }

    render() {
        return (
            <ThemeProvider theme={mainTheme}>
                <div className='App'>
                    <header className='App-header'>
                        {this.renderCurrentPage()}
                    </header>
                </div>
            </ThemeProvider>
        );
    }
    renderCurrentPage = () => {
        if (this.state.page === undefined) {
            this.setState({ page: Page.Login });
            console.log('Trying to set state...');
        }
        switch (this.state.page) {
            case Page.Login:
                return <LoginBox onLogin={this.onLogin} />;
            case Page.RoleSelection:
                return <RoleSelection onSelect={this.onSelect} />;
            case Page.PresenterView:
                return (
                    <PresenterView
                        onBack={() =>
                            this.setState({ page: Page.RoleSelection })
                        }
                    />
                );
            case Page.AttendeeView:
                return (
                    <AttendeeView
                        onBack={() =>
                            this.setState({ page: Page.RoleSelection })
                        }
                    />
                );
        }
    };
    onLogin = () => {
        this.setState({ page: Page.RoleSelection });
    };
    onSelect = (role: Role) => {
        switch (role) {
            case Role.Attendee:
                this.setState({ page: Page.AttendeeView });
                break;
            case Role.Presenter:
                this.setState({ page: Page.PresenterView });
                break;
        }
    };
}
