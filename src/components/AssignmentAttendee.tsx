import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IAttendeeData } from '../events/PresenterEvents';
import { Box, Paper, Typography } from '@material-ui/core';

interface Props {
    attendee: IAttendeeData;
    index: number;
}

export default class AssignmentAttendee extends React.Component<Props> {
    render() {
        return (
            <Draggable
                draggableId={this.props.attendee.name}
                index={this.props.index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <Box
                            margin='3px'
                            width='100px'
                            display='flex'
                            alignContent='left'>
                            <Paper
                                style={{
                                    padding: '5px',
                                    width: '100%',
                                    height: '100%'
                                }}>
                                <Typography variant='subtitle1'>
                                    {this.props.attendee.name}
                                </Typography>
                            </Paper>
                        </Box>
                    </div>
                )}
            </Draggable>
        );
    }
}
