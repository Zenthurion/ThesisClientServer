import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import PresentationView from './PresentationView';
import SocketIOClient from 'socket.io-client';
import SlideContent from '../SlideContent';

interface State {
    controller: string;
    message: {
        slide: SlideContent;
    };
    sessionId: string;
    currentSlideIndex: number;
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
            currentSlideIndex: 0
        };
        this.socket = SocketIOClient('http://localhost:3001');
    }

    render = () => {
        return (
            <Grid container>
                <Grid item xs={6}>
                    <Typography color={'textPrimary'}>
                        Session ID:{' '}
                        {this.state.sessionId.substring(0, 3) +
                            '-' +
                            this.state.sessionId.substring(3, 6)}
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{ width: '600px', height: '400px' }}>
                    <PresentationView
                        controller={this.state.controller}
                        showSlideCount={true}
                        content={this.state.message.slide}
                    />
                </Grid>
                <Grid direction={'row'} alignItems={'center'} container>
                    <Grid item xs={2}>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={this.previousSlide}
                            style={{ width: '100%' }}>
                            Previous
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={this.nextSlide}
                            style={{ width: '100%' }}>
                            Next
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        onClick={this.props.onBack}
                        style={{ width: '100%' }}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    };

    private nextSlide = () => {
        this.socket.emit(
            'request-slide-change',
            `{ "slide": "${this.state.currentSlideIndex + 1}" }`
        );
    };

    private previousSlide = () => {
        this.socket.emit(
            'request-slide-change',
            `{ "slide": "${this.state.currentSlideIndex - 1}" }`
        );
    };

    componentDidMount(): void {
        this.socket.emit(`presenter-connected`);
        this.socket.emit(`request-new-session`, { presentationRef: '0' });
        this.socket.once(`new-session-created`, (json: any) => {
            const data = JSON.parse(json);
            this.setState({ sessionId: data.sessionId });
            console.log('Session ID received: ' + data.sessionId);
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
