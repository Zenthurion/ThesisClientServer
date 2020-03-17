import React from 'react';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import SlideContent from '../SlideContent';

interface Props {
    controller: string;
    slide: SlideContent;
}
export default class MultipleChoiceSlideContent extends React.Component<Props> {
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
                {this.renderSubmit()}
            </Grid>
        );
    }

    private renderSubmit = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        }
        return (
            <Grid item>
                <Button>Submit</Button>
            </Grid>
        );
    };
}
