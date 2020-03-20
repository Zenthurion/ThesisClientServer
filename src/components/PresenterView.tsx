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
    StructureItem
} from './PresentationStructureView';

interface State {
    controller: string;
    message: {
        slide: SlideContent;
    };
    sessionId: string;
    currentSlideIndex: number;
    presentationStructure: StructureItem[];
    presentationStructureVisibility: boolean;
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
            presentationStructure: [],
            presentationStructureVisibility: false
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
                                <AttendeeList
                                    attendees={[]}
                                    socket={this.socket}
                                />
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
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='50px'
                    width='90%'>
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
                </Box>
            </Box>
        );
    };
    private handlePresentationStructureSlideClicked = (index: number) => {
        this.socket.emit('request-slide-change', { slide: index });
    };

    private nextSlide = () => {
        this.socket.emit('request-slide-change', {
            slide: this.state.currentSlideIndex + 1
        });
    };

    private previousSlide = () => {
        this.socket.emit('request-slide-change', {
            slide: this.state.currentSlideIndex - 1
        });
    };

    private togglePresentationStructure = () => {
        this.setState({
            presentationStructureVisibility: !this.state
                .presentationStructureVisibility
        });
    };

    componentDidMount(): void {
        this.socket.emit(`presenter-connected`);
        this.socket.emit(`request-new-session`, { presentationRef: '0' });
        this.socket.once(`new-session-created`, (data: any) => {
            this.setState({
                sessionId: data.sessionId,
                presentationStructure: data.presentationStructure
            });
        });
        this.socket.on('emit-presentation-content', (json: any) => {
            this.setState({
                message: {
                    slide: json.currentSlide
                },
                currentSlideIndex: parseInt(json.index, 10)
            });
        });
    }

    componentWillUnmount(): void {
        this.socket.disconnect();
    }
}
