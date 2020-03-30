import React from 'react';
import SlideContent from '../SlideContent';
import AttendeeEvents from '../events/AttendeeEvents';
import { IInteractionData } from '../events/ClientEvents';

export interface ExerciseProps {
    controller: string;
    slideIndex: number;
    slide: SlideContent;
    socket: SocketIOClient.Socket;
}

export interface ExerciseState {
    current: string;
    answer: string;
}

export default class ExerciseSlideContent extends React.Component<
    ExerciseProps,
    ExerciseState
> {
    constructor(props: ExerciseProps) {
        super(props);

        this.state = { answer: '', current: '' };
    }
    protected handleSubmit = () => {
        this.setState({ answer: this.state.current });

        const interaction: IInteractionData = {
            slideIndex: this.props.slideIndex,
            submitted: true,
            valid: this.vaildateAnswer(),
            type: this.props.slide.type,
            data: this.state.current
        };
        this.props.socket.emit(AttendeeEvents.Interaction, interaction);
    };

    vaildateAnswer = (): boolean => {
        if (!this.props.slide.content.validation) return false;
        const validated = this.props.slide.content.validation.filter(
            valid =>
                valid
                    .toString()
                    .toLowerCase()
                    .trim() ===
                this.state.current
                    .toString()
                    .toLowerCase()
                    .trim()
        );
        return validated.length > 0;
    };
}
