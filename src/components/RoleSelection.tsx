import React from 'react';
import {Button, Card, Colors, Elevation, Label} from "@blueprintjs/core";
import {Role} from "../Role";
import {PresentationProps} from "../App";

interface Props extends PresentationProps {
    id: string
    onSelect: (role: Role) => void
}

export default class RoleSelection extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id}>
                <Card elevation={Elevation.TWO} style={{background: this.props.presentation.cardColor}}>
                    <Label style={{color:Colors.LIGHT_GRAY5}}>Who are you?</Label>
                    <Button text="PRESENTER / TEACHER" large={true} type={"button"} onClick={() => this.props.onSelect(Role.Presenter)} fill={true} style={{color: this.props.presentation.labelColorLight, background: this.props.presentation.defaultButtonColor}}/>
                    <br />
                    <Button text="ATTENDEE / STUDENT" large={true} type={"button"} onClick={() => this.props.onSelect(Role.Attendee)} fill={true} style={{color: this.props.presentation.labelColorLight, background: this.props.presentation.defaultButtonColor}}/>
                </Card>
            </div>
        );
    }
}