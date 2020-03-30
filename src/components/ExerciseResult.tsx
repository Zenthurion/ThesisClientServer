import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Backdrop
} from '@material-ui/core';

interface Props {
    open: boolean;
    answer: string;
    validation?: string[];
    valid?: boolean;
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
                            : this.props.valid ?? false
                            ? 'Correct!'
                            : 'Incorrect'}
                    </DialogContent>
                </Dialog>
            </Backdrop>
        );
    }
}
