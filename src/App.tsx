import React from 'react';
//import logo from './logo.svg';
import './App.css';

import LoginBox from "./components/LoginBox";
import RoleSelection from "./components/RoleSelection";
import {Colors} from "@blueprintjs/core";
import {Role} from "./Role";
import PresenterView from "./components/PresenterView";
import AttendeeView from "./components/AttendeeView";

enum Page {
    Login,
    RoleSelection,
    PresenterView,
    AttendeeView
}

interface State {
    page: Page;
    presentation: {
        cardColor: string;
        confirmColor: string;
        cancelColor: string;
        labelColorLight: string;
        backgroundColor: string;
        defaultButtonColor: string;
        altButtonColor: string;
    };
}

export interface PresentationProps {
    presentation: {
        cardColor: string;
        confirmColor: string;
        cancelColor: string;
        labelColorLight: string;
        backgroundColor: string;
        defaultButtonColor: string;
        altButtonColor: string;
    }
}

interface Props { }

export default class App extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            presentation: {
                cardColor: Colors.GRAY1,
                confirmColor: Colors.LIME3,
                cancelColor: Colors.VERMILION2,
                labelColorLight: Colors.LIGHT_GRAY5,
                backgroundColor: Colors.DARK_GRAY2,
                defaultButtonColor: Colors.TURQUOISE3,
                altButtonColor: Colors.GOLD3
            },
            page: Page.Login};
    }

    render() {
        return (
            <div className="App">
                <header className="App-header" style={{background: this.state.presentation.backgroundColor, height: "100%"}}>
                    {this.renderCurrentPage()}
                </header>
            </div>
        );
    }
    renderCurrentPage = () => {
        if(this.state.page === undefined) {
            this.setState({page: Page.Login});
            console.log("Trying to set state...");
        }
        switch (this.state.page) {
            case Page.Login:
                return <LoginBox presentation={this.state.presentation} id={"login"} onLogin={this.onLogin}/>;
            case Page.RoleSelection:
                return <RoleSelection presentation={this.state.presentation} id={"role-selection"} onSelect={this.onSelect}/>;
            case Page.PresenterView:
                return <PresenterView presentation={this.state.presentation} onBack={() => this.setState({page: Page.RoleSelection})}/>;
            case Page.AttendeeView:
                return <AttendeeView presentation={this.state.presentation} onBack={() => this.setState({page: Page.RoleSelection})}/>;
        }
    };
    onLogin = () => {
        this.setState({page: Page.RoleSelection})
    };
    onSelect = (role: Role) => {
        switch (role) {
            case Role.Attendee:
                this.setState({page: Page.AttendeeView});
                break;
            case Role.Presenter:
                this.setState({page: Page.PresenterView});
                break;
        }
    };

}
