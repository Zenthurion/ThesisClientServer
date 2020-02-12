import React from 'react';
import {Button, Card, Elevation, FormGroup, InputGroup} from "@blueprintjs/core";
import {PresentationProps} from "../App";

interface Props extends PresentationProps {
    id: string;
    onLogin: () => void;
}

export default class LoginBox extends React.Component<Props> {
    constructor(props : Props) {
        super(props);
    }

    render = () => {
        return (
            <div id={this.props.id}>
                <Card elevation={Elevation.TWO} style={{background: this.props.presentation.cardColor}}>
                    <FormGroup
                        label={"Email"}
                        labelFor={"username-input"}
                        inline={false}
                        style={{color: this.props.presentation.labelColorLight}}
                    >
                        <InputGroup id={this.props.id + "-username-input"} placeholder={"user@sdu.dk"} large={true} round={false} type={"email"}/>
                    </FormGroup>
                    <FormGroup
                        label={"Password"}
                        labelFor={"password-input"}
                        inline={false}
                        style={{color: this.props.presentation.labelColorLight}}
                    >
                        <InputGroup id={this.props.id + "-password-input"} placeholder={"password"} large={true} round={false} type={"password"}/>
                    </FormGroup>
                    <Button text="LOGIN" large={true} type={"submit"} onClick={this.props.onLogin} fill={true} style={{color: this.props.presentation.labelColorLight, background: this.props.presentation.confirmColor}}/>
                </Card>
            </div>
        )
    }
}