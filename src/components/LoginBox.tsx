import React from 'react';
import { Button, Card } from '@material-ui/core';

interface Props {
    onLogin: () => void;
}

export default class LoginBox extends React.Component<Props> {
    render = () => {
        return (
            <Card>
                <Button
                    size={'large'}
                    variant={'contained'}
                    color={'primary'}
                    onClick={this.props.onLogin}>
                    Login
                </Button>
            </Card>
        );
    };
}
