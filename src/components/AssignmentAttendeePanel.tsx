import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Paper, Box } from '@material-ui/core';
import { IAttendeeData } from '../events/PresenterEvents';
import AssignmentAttendee from './AssignmentAttendee';

interface Props {
    attendees: IAttendeeData[];
    selectedSlide: number;
}

export default class AssignmentAttendeePanel extends React.Component<Props> {
    render = () => {
        return (
            <Droppable droppableId={'attendeeDrop'}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={{ width: '100%', height: '35%' }}
                        {...provided.droppableProps}>
                        <Paper style={{ width: '100%', height: '100%' }}>
                            <Box
                                width='100%'
                                height='100%'
                                display='flex'
                                flexDirection='row'
                                overflow='auto'>
                                {this.props.attendees
                                    .filter(
                                        attendee =>
                                            attendee.assignments[
                                                this.props.selectedSlide
                                            ] === undefined ||
                                            attendee.assignments[
                                                this.props.selectedSlide
                                            ] < 0
                                    )
                                    .map((attendee, index) => (
                                        <AssignmentAttendee
                                            attendee={attendee}
                                            index={index}
                                            key={index}
                                        />
                                    ))}
                            </Box>
                        </Paper>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };
}
