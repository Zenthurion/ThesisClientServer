import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    Box,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import AttendeeEvents, {
    IValidateSessionIdData,
    ISessionIdValidatedData,
    IJoinSessionData
} from '../events/AttendeeEvents';
import ClientEvents, { IPresentationContentData } from '../events/ClientEvents';

interface State {
    inputError: boolean;
    isValidating: boolean;
    helperMessage: string;
    attemptedSessionId?: string;
    name: string;
    inputMode: string;
}

interface Props {
    open: boolean;
    socket: SocketIOClient.Socket;
    onSessionIdValidated: (sessionId: string, username: string) => void;
    onBack: () => void;
}

const inputUsername = 'input-username';
const inputSessionId = 'input-session-id';

export default class AttendeeJoinDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            inputError: false,
            isValidating: false,
            helperMessage: "Format needs to be '123456' or '123-456'",
            inputMode: inputUsername,
            name: ''
        };
    }
    render() {
        if (!this.props.open) return '';
        return (
            <Box>
                <Backdrop open={this.state.isValidating}>
                    <CircularProgress />
                </Backdrop>
                {this.state.inputMode === inputUsername
                    ? this.renderNameDialog()
                    : this.renderSessionIdDialog()}
            </Box>
        );
    }

    private renderNameDialog = () => {
        return (
            <Dialog open id='name-dialog'>
                <DialogTitle>Enter your name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your name.
                    </DialogContentText>
                    <br />
                    <TextField
                        fullWidth={true}
                        id={'name-field'}
                        label={'Name'}
                        type={'text'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color={'primary'}
                        type={'submit'}
                        onClick={this.handleNextDialog}>
                        Next
                    </Button>
                    <Button color={'secondary'} onClick={this.props.onBack}>
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    private renderSessionIdDialog = () => {
        return (
            <Dialog open id='session-id-dialog'>
                <DialogTitle>Enter Session ID</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the provided session ID to view your presentation.
                        <br /> E.g. 123-456.
                    </DialogContentText>
                    <br />
                    <TextField
                        fullWidth={true}
                        id={'sessionId'}
                        label={'Session ID'}
                        type={'text'}
                        helperText={this.state.helperMessage}
                        onChange={this.handleSessionIdTextFieldChange}
                        error={this.state.inputError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color={'primary'}
                        type={'submit'}
                        onClick={this.handleSessionIdOnClick}>
                        Join
                    </Button>
                    <Button
                        color={'secondary'}
                        onClick={() => {
                            this.setState({ inputMode: inputUsername });
                        }}>
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    private handleNextDialog = () => {
        const name = (document.getElementById('name-field') as HTMLInputElement)
            .value;

        (document.getElementById('name-field') as HTMLInputElement).value = '';
        if (name === undefined || name === '') return;

        this.setState({
            inputMode: inputSessionId,
            name
        });
    };

    private handleSessionIdTextFieldChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.target.value;
        if (input.match('\\d{3}-\\d{3}')) {
            this.setState({
                inputError: false,
                attemptedSessionId: input.replace('-', '')
            });
        } else if (input.match('\\d{6}')) {
            this.setState({
                inputError: false,
                attemptedSessionId: input
            });
        } else {
            this.setState({
                helperMessage: "Format needs to be '123456' or '123-456'"
            });
        }
    };

    private handleSessionIdOnClick = () => {
        this.validateAttemptedSessionId();
    };

    private validateAttemptedSessionId = () => {
        this.setState({ isValidating: true });
        console.log(this.state.attemptedSessionId);

        const validateSessionData: IValidateSessionIdData = {
            sessionId: this.state.attemptedSessionId ?? ''
        };

        this.props.socket.emit(
            AttendeeEvents.ValidateSessionId,
            validateSessionData
        );
        this.props.socket.on(
            AttendeeEvents.EmitSessionIdValidated,
            (data: ISessionIdValidatedData) => {
                if (
                    this.state.attemptedSessionId === data.sessionId &&
                    data.isValid
                ) {
                    this.props.onSessionIdValidated(
                        this.state.attemptedSessionId!,
                        this.state.name
                    );
                    this.setState({
                        isValidating: false
                    });
                } else {
                    this.setState({
                        isValidating: false,
                        inputError: true,
                        helperMessage: 'Invalid Session ID'
                    });
                }
            }
        );
    };
}
