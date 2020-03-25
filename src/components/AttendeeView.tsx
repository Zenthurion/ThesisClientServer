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
import AttendeeEvents, {
    IValidateSessionIdData,
    ISessionIdValidatedData,
    IJoinSessionData
} from '../events/AttendeeEvents';
import ClientEvents, { IPresentationContentData } from '../events/ClientEvents';
import AttendeeJoinDialog from './AttendeeJoinDialog';

interface State {
    controller: string;
    message: {
        slide: SlideContent;
    };
    currentSlideIndex: number;
    sessionId: string;
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
                    content: { title: '', body: '' }
                }
            },
            currentSlideIndex: 0,
            sessionId: ''
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
                <AttendeeJoinDialog
                    open={this.state.sessionId === ''}
                    socket={this.socket}
                    onSessionIdValidated={this.handleSessionIdValidated}
                    onBack={this.props.onBack}
                />
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='100%'
                    width='100%'
                    margin='10px'>
                    <PresentationView
                        socket={this.socket}
                        slideIndex={this.state.currentSlideIndex}
                        controller={this.state.controller}
                        showSlideCount={true}
                        content={this.state.message.slide}
                    />
                </Box>
            </Box>
        );
    }

    private handleSessionIdValidated = (
        sessionId: string,
        username: string
    ) => {
        this.setState({
            sessionId
        });

        const joinSessionData: IJoinSessionData = {
            sessionId,
            username
        };
        this.socket.emit(AttendeeEvents.JoinSession, joinSessionData);

        this.socket.on(
            ClientEvents.EmitPresentationContent,
            (content: IPresentationContentData) =>
                this.handlePresentationContent(content)
        );
    };

    private handlePresentationContent = (data: IPresentationContentData) => {
        this.setState({
            message: {
                slide: data.currentSlide
            },
            currentSlideIndex: data.index
        });
    };

    componentDidMount(): void {
        this.socket.emit(AttendeeEvents.AttendeeConnected);
    }

    componentWillUnmount(): void {
        this.socket.disconnect();
    }
}
