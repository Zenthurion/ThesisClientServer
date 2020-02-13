import React from "react";
import SocketIOClient from 'socket.io-client';
import {
    Backdrop,
    Button, CircularProgress, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField
} from '@material-ui/core';
import PresentationView from "./PresentationView";
import PresentationContent from "../PresentationContent";

interface State {
    message : {
        previousContent?: string;
        content: string;
        nextContent?: string;
    },
    sessionId: string;
    attemptedSessionId?: string;
    inputError: boolean;
    isValidating: boolean;
    helperMessage: string;
}

interface Props {
    onBack : () => void;
}

export default class AttendeeView extends React.Component<Props, State>{

    private socket : SocketIOClient.Socket;

    constructor(props: Props) {
        super(props);

        this.state = {message: { content: ""}, sessionId: "", inputError: false, isValidating: false, helperMessage: "Format needs to be '123456' or '123-456'"};
        this.socket = SocketIOClient('http://localhost:3001');
    }
    render() {
        return (
            <Container>
                <Backdrop open={this.state.isValidating}>
                    <CircularProgress />
                </Backdrop>
                <Dialog open={this.state.sessionId == ""}>
                    <DialogTitle>Enter Session ID</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the provided session ID to view your presentation.<br /> E.g. 123-456.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            fullWidth={true}
                            id={"sessionId"}
                            label={"Session ID"}
                            type={"text"}
                            helperText={this.state.helperMessage}
                            onChange={this.handleSessionIdTextFieldChange}
                            error={this.state.inputError}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color={"primary"} type={"submit"} onClick={this.handleSessionIdOnClick}>Join</Button>
                        <Button color={"secondary"} onClick={this.props.onBack}>Leave</Button>
                    </DialogActions>
                </Dialog>
                <Grid container>
                    <Grid item xs={12} style={{width: '600px', height: '400px'}}><PresentationView showSlideCount={true} content={this.getContent()} /></Grid>
                    <Grid item xs={2}><Button variant={'contained'} color={'primary'} onClick={this.props.onBack} style={{width: '100%'}}>Back</Button></Grid>
                </Grid>
            </Container>
        );
    };

    private handleSessionIdOnClick = () => {
        this.validateAttemptedSessionId();
    };

    private handleSessionIdTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let input = event.target.value;
        if(input.match('\\d{3}-\\d{3}')) {
            this.setState({inputError: false, attemptedSessionId: input})
        } else if(input.match('\\d{6}}')) {
            this.setState( { inputError: false, attemptedSessionId: input.substr(0,3) + '-' + input.substr(3,3)});
        } else {
            this.setState({ helperMessage: "Format needs to be '123456' or '123-456'" });
        }
    };

    private validateAttemptedSessionId = () => {
        this.setState({isValidating: true});
        this.socket.emit('validate-session-id', `{ "sessionId": "${this.state.attemptedSessionId}"}`)
            .on('session-id-validated', (json : any) => {
                let data = JSON.parse(json);
                if(this.state.attemptedSessionId == data.sessionId && data.isValid) {
                    this.setState({sessionId: this.state.attemptedSessionId!, isValidating: false});

                    this.socket.emit('register-attendee', `{ "sessionId": "${this.state.sessionId}" }`);
                    this.socket.on('emit-presentation-content', (json: any) => {
                        let data = JSON.parse(json);
                        this.setState({message: { previousContent: data.previousSlide, content: data.currentSlide, nextContent: data.nextSlide}});
                    });
                    this.socket.emit('request-current-slide', `{ "sessionId": "${this.state.sessionId}" }`);
                } else {
                    this.setState({
                        isValidating: false,
                        inputError: true,
                        helperMessage: "Invalid Session ID"
                    });
                }
            });
    };

    private getContent = () => {
        return new PresentationContent(this.state.message.content);
    };

    private renderMessage = () => {
      if(this.state === undefined || this.state.message === undefined) {
          console.log('no message...');
          return "";
      }
      return (<p>
          {this.state.message}
      </p>);
    };

    componentDidMount(): void {
        this.socket.emit('attendee-connected');
        console.log('mounted');
    }

    componentWillUnmount(): void {
        this.socket.disconnect();
    }
}