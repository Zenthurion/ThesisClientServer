import React from 'react';
import { Box, Paper, Typography, Divider } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import {
    IAttendeeData,
    IPresentationStructureContentSlide
} from '../events/PresenterEvents';
import AssignmentAttendee from './AssignmentAttendee';

interface Props {
    index: number;
    subSlide: IPresentationStructureContentSlide;
    attendees: IAttendeeData[];
}

export default class SubSlideAssignment extends React.Component<Props> {
    render() {
        return (
            <Box
                minWidth='300px'
                height='calc(100% - 10px)'
                padding='5px'
                display='flex'
                flexDirection='column'>
                <Paper style={{ width: '100%', height: '70%' }}>
                    <Typography variant='subtitle1'>Assigned</Typography>
                    <Divider />
                    <Droppable droppableId={this.props.index.toString()}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={{ width: '100%', height: '100%' }}
                                {...provided.droppableProps}>
                                {this.props.attendees.map(
                                    (attendee, attendeeIndex) => {
                                        return (
                                            <AssignmentAttendee
                                                key={attendee.name}
                                                attendee={attendee}
                                                index={attendeeIndex}
                                            />
                                        );
                                    }
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Paper>
                <Divider />
                {this.renderSlidePreview()}
            </Box>
        );
    }
    private renderSlidePreview = () => {
        return (
            <Paper style={{ width: '100%', height: '30%' }}>
                <Box
                    width='100%'
                    height='100%'
                    justifyContent='center'
                    alignItems='center'>
                    <Box width='100%' height='30px'>
                        <Typography variant='subtitle1'>
                            {this.props.subSlide.title}
                        </Typography>
                        <Divider />
                    </Box>
                    <Box
                        width='100%'
                        height='calc(100% - 30px)'
                        alignItems='center'
                        justifyContent='center'>
                        <Typography variant='subtitle2'>
                            {this.props.subSlide.body}
                        </Typography>
                        {this.renderSlideType()}
                    </Box>
                </Box>
            </Paper>
        );
    };

    private renderSlideType = () => {
        switch (this.props.subSlide.type) {
            case 'PlainContent':
                return <Typography variant='subtitle1'></Typography>;
            case 'MultipleChoiceSlide':
                return (
                    <Typography variant='subtitle1'>
                        [Multiple Choice]
                    </Typography>
                );
            case 'TextAnswerSlide':
                return (
                    <Typography variant='subtitle1'>[Text Answer]</Typography>
                );
            default:
                console.log(
                    'A slide of this type should not appear here! ' +
                        this.props.subSlide.type
                );
        }
        return '';
    };
}
