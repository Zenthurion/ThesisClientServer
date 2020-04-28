import React, { ChangeEvent } from 'react';
import { Typography, Button, TextField, Box, Divider } from '@material-ui/core';
import ExerciseSlideContent from './ExerciseSlideContent';
import ExerciseResult from './ExerciseResult';
import { IInteractionData } from '../events/ClientEvents';
import AttendeeEvents from '../events/AttendeeEvents';

export default class TextAnswerSlideContent extends ExerciseSlideContent {
    render() {
        return (
            <Box paddingLeft='20px' paddingRight='20px' height='100%'>
                <ExerciseResult
                    open={this.state.answer !== ''}
                    answer={this.state.answer}
                    validation={this.props.slide.content.validation}
                    valid={this.vaildateAnswer()}
                />
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
                    height='calc(60% - 70px)'>
                    {this.props.slide.content.body.map((body, i) => (
                        <Typography key={'body' + i} variant='body1'>
                            {body}
                        </Typography>
                    ))}
                </Box>
                {this.renderInput()}
                {this.renderSubmit()}
            </Box>
        );
    }

    private renderInput = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        } else {
            return (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    height='30%'>
                    <TextField
                        multiline
                        variant='outlined'
                        rows='4'
                        rowsMax='8'
                        onChange={this.handleTextInputChange}
                        disabled={
                            this.props.controller !==
                            this.props.slide.content.controller
                        }></TextField>
                </Box>
            );
        }
    };
    private handleTextInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        this.setState({ current: event.target.value });
        const interaction: IInteractionData = {
            slideIndex: this.props.slideIndex,
            submitted: false,
            valid: false,
            type: this.props.slide.type,
            data: event.target.value,
        };
        this.props.socket.emit(AttendeeEvents.Interaction, interaction);
    };

    private renderSubmit = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        } else {
            return (
                <Box display='flex' justifyContent='flex-end' height='10%'>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        onClick={this.handleSubmit}
                        disabled={
                            this.props.controller !==
                            this.props.slide.content.controller
                        }>
                        Submit
                    </Button>
                </Box>
            );
        }
    };
}
