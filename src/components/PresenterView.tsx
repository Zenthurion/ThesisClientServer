import React from 'react';
import {
    Button,
    Grid,
    Typography,
    Box,
    Container,
    Drawer
} from '@material-ui/core';
import PresentationView from './PresentationView';
import SocketIOClient from 'socket.io-client';
import SlideContent from '../SlideContent';
import AttendeeList from './AttendeeList';
import PresentationStructureView, {
    StructureItem,
    ISelectionResult
} from './PresentationStructureView';
import ClientEvents, { IPresentationContentData } from '../events/ClientEvents';
import PresenterEvents, {
    ISessionDataData,
    INewSessionData,
    IRequestNewSessionData,
    IRequestSlideChangeData,
    IPresentationStructure,
    IPresentationStructureSlide,
    IAttendeeData
} from '../events/PresenterEvents';
import SlideAssignment from './SlideAssignment';
import { config as configureDotenv } from 'dotenv';

interface State {
    controller: string;
    message: {
        slide: SlideContent;
    };
    sessionId: string;
    currentSlideIndex: number;
    presentationStructure: IPresentationStructure;
    presentationStructureVisibility: boolean;
    attendees: IAttendeeData[];
    view: View;
}

enum View {
    Presentation,
    Management
}

interface Props {
    onBack: () => void;
}

export default class PresenterView extends React.Component<Props, State> {
    private socket: SocketIOClient.Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            controller: 'presenter',
            message: {
                slide: {
                    type: 'PlainSlide',
                    content: { title: 'Uninitialised', body: 'Uninitialised' }
                }
            },
            sessionId: 'Loading Session ID',
            currentSlideIndex: 0,
            presentationStructure: { slides: [] },
            presentationStructureVisibility: false,
            attendees: [],
            view: View.Presentation
        };
        this.socket = SocketIOClient('http://localhost:3001');
    }

    render = () => {
        return (
            <Box
                height='100vh'
                width='100vw'
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'>
                <Box
                    display='flex'
                    alignItems='flex-end'
                    height='30px'
                    width='calc(100% - 25px)'
                    style={{ marginLeft: '25px' }}>
                    <Box>
                        <Typography color={'textPrimary'}>
                            Session ID:{' '}
                            {this.state.sessionId.substring(0, 3) +
                                '-' +
                                this.state.sessionId.substring(3, 6)}
                        </Typography>
                    </Box>
                </Box>
                {this.state.view === View.Presentation
                    ? this.renderPresentationMode()
                    : this.renderAssignmentMode()}

                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='50px'
                    width='100%'>
                    <Grid container justify='center' spacing={1}>
                        <Grid item>
                            <Box>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    onClick={this.previousSlide}
                                    style={{ width: '120px' }}>
                                    Previous
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    onClick={this.nextSlide}
                                    style={{ width: '120px' }}>
                                    Next
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box
                        display='flex'
                        alignItems='flex-end'
                        alignContent='flex-end'>
                        <Button
                            variant='contained'
                            style={{ width: '200px' }}
                            onClick={this.toggleView}>
                            {this.state.view === View.Presentation
                                ? 'Manage'
                                : 'Present'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    };

    private toggleView = () => {
        if (this.state.view === View.Presentation) {
            this.setState({ view: View.Management });
        } else if (this.state.view === View.Management) {
            this.setState({ view: View.Presentation });
        }
    };

    private renderPresentationMode = () => {
        return (
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                height='calc(100% - 80px)'
                width='100%'>
                <Box
                    display='flex'
                    flexDirection='row'
                    width='100%'
                    height='100%'>
                    <PresentationView
                        socket={this.socket}
                        slideIndex={this.state.currentSlideIndex}
                        controller={this.state.controller}
                        showSlideCount={true}
                        content={this.state.message.slide}
                    />
                    <Box
                        display='flex'
                        flexDirection='column'
                        width='200px'
                        height='100%'>
                        <Box
                            display='flex'
                            width='100%'
                            height='calc(100% - 40px)'>
                            <AttendeeList attendees={this.state.attendees} />
                        </Box>
                        <Box display='flex' width='100%' height='40px'>
                            <Button
                                variant='text'
                                style={{ width: '100%' }}
                                onClick={this.togglePresentationStructure}>
                                Structure
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box
                    display={
                        this.state.presentationStructureVisibility
                            ? 'flex'
                            : 'none'
                    }
                    flexDirection='row'
                    width='100%'>
                    {this.state.presentationStructure !== undefined ? (
                        <PresentationStructureView
                            onSlideClicked={
                                this.handlePresentationStructureSlideClicked
                            }
                            structure={this.state.presentationStructure}
                            currentSlideIndex={this.state.currentSlideIndex}
                        />
                    ) : (
                        ''
                    )}
                </Box>
            </Box>
        );
    };

    private renderAssignmentMode = () => {
        return (
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                height='calc(100% - 80px)'
                width='100%'>
                <SlideAssignment
                    socket={this.socket}
                    attendees={this.state.attendees}
                    presentation={this.state.presentationStructure}
                    updateAttendee={this.handleAttendeeUpdate}
                />
            </Box>
        );
    };

    private handleAttendeeUpdate = (attendee: IAttendeeData) => {
        const attendees = this.state.attendees;
        const index = attendees.indexOf(attendee);
        attendees[index] = attendee;
        this.setState({ attendees });
    };

    private handlePresentationStructureSlideClicked = (
        index: number,
        slide: IPresentationStructureSlide
    ): ISelectionResult => {
        const slideRequest: IRequestSlideChangeData = {
            slide: index
        };

        this.socket.emit(PresenterEvents.RequestSlideChange, slideRequest);

        const result: ISelectionResult = {
            valid: true,
            text: 'Live'
        };

        return result;
    };

    private nextSlide = () => {
        const slideRequest: IRequestSlideChangeData = {
            slide: this.state.currentSlideIndex + 1
        };

        this.socket.emit(PresenterEvents.RequestSlideChange, slideRequest);
    };

    private previousSlide = () => {
        const slideRequest: IRequestSlideChangeData = {
            slide: this.state.currentSlideIndex - 1
        };

        this.socket.emit(PresenterEvents.RequestSlideChange, slideRequest);
    };

    private togglePresentationStructure = () => {
        this.setState({
            presentationStructureVisibility: !this.state
                .presentationStructureVisibility
        });
    };

    componentDidMount(): void {
        this.socket.emit(PresenterEvents.PresenterConnected);

        const presentationRequest: IRequestNewSessionData = {
            presentationRef: '0'
        };
        this.socket.emit(
            PresenterEvents.RequestNewSession,
            presentationRequest
        );
        this.socket.once(
            PresenterEvents.EmitNewSessionCreated,
            (data: INewSessionData) => {
                this.setState({
                    sessionId: data.sessionId,
                    presentationStructure: data.presentationStructure
                });
            }
        );
        this.socket.on(
            ClientEvents.EmitPresentationContent,
            (data: IPresentationContentData) => {
                this.setState({
                    message: {
                        slide: data.currentSlide
                    },
                    currentSlideIndex: data.index
                });
            }
        );
        this.socket.on(
            PresenterEvents.EmitSessionData,
            (data: ISessionDataData) => {
                this.setState({ attendees: data.attendees });
            }
        );
    }

    componentWillUnmount(): void {
        this.socket.disconnect();
    }
}
