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
            type: this.props.slide.type,
            data: this.state.current
        };
        this.props.socket.emit(AttendeeEvents.Interaction, interaction);
    };
}
