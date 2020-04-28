import React from 'react';
import { Typography, Button, Box, Divider } from '@material-ui/core';
import ExerciseResult from './ExerciseResult';
import ExerciseSlideContent from './ExerciseSlideContent';
import AttendeeEvents from '../events/AttendeeEvents';
import { IInteractionData } from '../events/ClientEvents';

export default class MultipleChoiceSlideContent extends ExerciseSlideContent {
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
                    height='calc(70% - 70px)'>
                    {this.props.slide.content.body.map((body, i) => (
                        <Typography key={'body' + i} variant='body1'>
                            {body}
                        </Typography>
                    ))}
                </Box>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    height='20%'>
                    {this.props.slide.content.options?.map((text, i) => (
                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            key={i}
                            onClick={() => this.handleChoice(i)}
                            disabled={
                                this.props.controller !==
                                this.props.slide.content.controller
                            }>
                            {text}
                        </Button>
                    ))}
                </Box>
                {this.renderSubmit()}
            </Box>
        );
    }

    private renderSubmit = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        }
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
    };

    private handleChoice = (index: number) => {
        this.setState({ current: index.toString() });
        const interaction: IInteractionData = {
            slideIndex: this.props.slideIndex,
            submitted: false,
            valid: false,
            type: this.props.slide.type,
            data: index.toString(),
        };
        this.props.socket.emit(AttendeeEvents.Interaction, interaction);
    };
}
