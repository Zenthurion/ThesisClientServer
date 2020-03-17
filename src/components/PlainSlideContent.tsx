import React from 'react';
import { Grid, Typography, Box } from '@material-ui/core';
import SlideContent from '../SlideContent';

interface Props {
    controller: string;
    slide: SlideContent;
}

export default class PlainSlideContent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Grid
                direction='column'
                justify='space-between'
                alignItems='stretch'
                container>
                <Grid item>
                    <Typography>{this.props.slide.content.title}</Typography>
                </Grid>
                <Grid item>
                    <Box height='100%'>
                        <Typography>{this.props.slide.content.body}</Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }
}
