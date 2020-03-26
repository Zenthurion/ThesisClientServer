import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Backdrop,
    Box
} from '@material-ui/core';

interface Props {
    open: boolean;
    answer: string;
    validation?: string[];
}

export default class ExerciseResult extends React.Component<Props> {
    render() {
        return (
            <Backdrop open={this.props.open}>
                <Dialog open={this.props.open}>
                    <DialogTitle>Result</DialogTitle>
                    <DialogContent>
                        {this.props.validation === undefined ||
                        this.props.validation.length === 0
                            ? 'Submitted'
                            : this.vaildateAnswer()
                            ? 'Correct!'
                            : 'Incorrect'}
                    </DialogContent>
                </Dialog>
            </Backdrop>
        );
    }

    vaildateAnswer = () => {
        if (!this.props.validation) return false;
        const validated = this.props.validation.filter(
            valid =>
                valid
                    .toString()
                    .toLowerCase()
                    .trim() ===
                this.props.answer
                    .toString()
                    .toLowerCase()
                    .trim()
        );
        return validated.length > 0;
    };
}
