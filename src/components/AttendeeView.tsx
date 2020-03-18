import React from 'react';
import SocketIOClient from 'socket.io-client';
import {
    Backdrop,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField,
    Box
} from '@material-ui/core';
import PresentationView from './PresentationView';
import SlideContent from '../SlideContent';

interface State {
    controller: string;
    message: {
        slide: SlideContent;
    };
    currentSlideIndex: number;
    sessionId: string;
    attemptedSessionId?: string;
    inputError: boolean;
    isValidating: boolean;
    helperMessage: string;
}

interface Props {
    onBack: () => void;
}

export default class AttendeeView extends React.Component<Props, State> {
    private socket: SocketIOClient.Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            controller: 'attendee',
            message: {
                slide: {
                    type: 'PlainSlide',
                    content: { title: 'Uninitialised', body: 'Uninitialised' }
                }
            },
            currentSlideIndex: 0,
            sessionId: '',
            inputError: false,
            isValidating: false,
            helperMessage: "Format needs to be '123456' or '123-456'"
        };
        this.socket = SocketIOClient('http://localhost:3001');
    }
    render() {
        return (
            <Box
                height='100vh'
                width='100vw'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'>
                <Backdrop open={this.state.isValidating}>
                    <CircularProgress />
                </Backdrop>
                <Dialog open={this.state.sessionId === ''}>
                    <DialogTitle>Enter Session ID</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the provided session ID to view your
                            presentation.
                            <br /> E.g. 123-456.
                        </DialogContentText>
                        <TextField
                            autoFocus
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
                        <Button color={'secondary'} onClick={this.props.onBack}>
                            Leave
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='100%'
                    width='100%'
                    margin='10px'>
                    <PresentationView
                        controller={this.state.controller}
                        showSlideCount={true}
                        content={this.state.message.slide}
                    />
                </Box>
            </Box>
        );
    }

    private handleSessionIdOnClick = () => {
        this.validateAttemptedSessionId();
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

    private validateAttemptedSessionId = () => {
        this.setState({ isValidating: true });
        console.log(this.state.attemptedSessionId);
        this.socket
            .emit(
                'validate-session-id',
                `{ "sessionId": "${this.state.attemptedSessionId}"}`
            )
            .on('session-id-validated', (json: any) => {
                const data = JSON.parse(json);
                if (
                    this.state.attemptedSessionId === data.sessionId &&
                    data.isValid
                ) {
                    this.setState({
                        sessionId: this.state.attemptedSessionId!,
                        isValidating: false
                    });

                    this.socket.emit(
                        'join-session',
                        `{ "sessionId": "${this.state.sessionId}", "username": "No Name" }`
                    );
                    this.socket.on(
                        'emit-presentation-content',
                        (contentJSON: any) =>
                            this.handlePresentationContent(contentJSON)
                    );
                    this.socket.emit(
                        'request-current-slide',
                        `{ "sessionId": "${this.state.sessionId}" }`
                    );
                } else {
                    this.setState({
                        isValidating: false,
                        inputError: true,
                        helperMessage: 'Invalid Session ID'
                    });
                }
            });
    };

    private handlePresentationContent = (json: any) => {
        this.setState({
            message: {
                slide: json.currentSlide
            },
            currentSlideIndex: parseInt(json.index, 10)
        });
    };

    componentDidMount(): void {
        this.socket.emit('attendee-connected');
        console.log('mounted');
    }

    componentWillUnmount(): void {
        this.socket.disconnect();
    }
}
