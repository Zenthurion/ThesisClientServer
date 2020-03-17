import React from 'react';
import SlideContent from '../SlideContent';
import { Grid, Typography, Button } from '@material-ui/core';

interface Props {
    controller: string;
    slide: SlideContent;
}

export default class SlideChoiceSlideContent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Grid
                container
                direction='column'
                justify='center'
                alignItems='center'>
                <Grid item>
                    <Typography>{this.props.slide.content.title}</Typography>
                </Grid>
                <Grid item>
                    <Typography>{this.props.slide.content.body}</Typography>
                </Grid>
                <Grid item>
                    {this.props.slide.content.options?.map((text, i) => (
                        <Button
                            key={i}
                            disabled={
                                this.props.controller !==
                                this.props.slide.content.controller
                            }>
                            {text}
                        </Button>
                    ))}
                </Grid>
            </Grid>
        );
    }
}
