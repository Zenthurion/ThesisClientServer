import React from 'react';
import { Typography, Box, Divider } from '@material-ui/core';
import SlideContent from '../SlideContent';

interface Props {
    controller: string;
    slide: SlideContent;
}

export default class PlainSlideContent extends React.Component<Props> {
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
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    height='calc(100% - 70px)'>
                    {this.props.slide.content.body.map((body, i) => (
                        <Typography key={'body' + i} variant='body1'>
                            {body}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    }
}
