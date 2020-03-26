import React from 'react';
import SlideContent from '../SlideContent';

export interface ExerciseProps {
    controller: string;
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
    };
}
