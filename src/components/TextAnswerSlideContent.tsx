import React from 'react';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import SlideContent from '../SlideContent';

interface Props {
    controller: string;
    slide: SlideContent;
}

export default class TextAnswerSlideContent extends React.Component<Props> {
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
                {this.renderInput()}
                {this.renderSubmit()}
            </Grid>
        );
    }

    private renderInput = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        } else {
            return (
                <Grid item>
                    <TextField
                        disabled={
                            this.props.controller !==
                            this.props.slide.content.controller
                        }></TextField>
                </Grid>
            );
        }
    };

    private renderSubmit = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        } else {
            return (
                <Grid item>
                    <Button
                        disabled={
                            this.props.controller !==
                            this.props.slide.content.controller
                        }>
                        Submit
                    </Button>
                </Grid>
            );
        }
    };
}
