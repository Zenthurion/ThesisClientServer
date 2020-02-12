import React from 'react';
import {Button, Card, FormGroup} from "@material-ui/core";
import {Role} from "../Role";

interface Props {
    onLogin: () => void;
}

export default class LoginBox extends React.Component<Props> {
    constructor(props : Props) {
        super(props);
    }

    render = () => {
        return (
            <Card>
                <Button size={'large'} variant={'contained'} color={'primary'} onClick={this.props.onLogin}>Login</Button>
            </Card>
        )
    }
}