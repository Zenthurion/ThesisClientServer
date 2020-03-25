import React from 'react';
import SlideContent from '../SlideContent';
import { Grid, Typography, Button, Box, Divider } from '@material-ui/core';
import { Socket } from 'dgram';
import ClientEvents, { IAssignContentData } from '../events/ClientEvents';

interface Props {
    socket: SocketIOClient.Socket;
    controller: string;
    slide: SlideContent;
    slideIndex: number;
}

export default class SlideChoiceSlideContent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Box paddingLeft='20px' paddingRight='20px' height='100%'>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='70px'>
                    <Typography variant='h3'>
                        {this.props.slide.content.title}
                    </Typography>
                </Box>
                <Divider />
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    height='calc(85% - 70px)'>
                    <Typography variant='body1'>
                        {this.props.slide.content.body}
                    </Typography>
                </Box>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    height='15%'>
                    {this.props.slide.content.options?.map((text, i) => (
                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            key={i}
                            disabled={
                                this.props.controller !==
                                this.props.slide.content.controller
                            }
                            onClick={() => this.assignToSlide(i)}>
                            {text}
                        </Button>
                    ))}
                </Box>
            </Box>
        );
    }

    private assignToSlide = (index: number) => {
        const assignmentData: IAssignContentData = {
            slideIndex: this.props.slideIndex + 1,
            subIndex: index
        };
        this.props.socket.emit(ClientEvents.AssignContent, assignmentData);
    };
}
