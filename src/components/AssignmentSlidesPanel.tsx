import React from 'react';
import {
    IPresentationStructureCollectionSlide,
    IAttendeeData
} from '../events/PresenterEvents';
import { Box } from '@material-ui/core';
import SubSlideAssignment from './SubSlideAssignment';

interface Props {
    slideIndex: number;
    collection: IPresentationStructureCollectionSlide;
    attendees: IAttendeeData[];
}

export default class AssignmentSlidesPanel extends React.Component<Props> {
    render() {
        return (
            <Box
                width='100%'
                height='65%'
                display='flex'
                flexDirection='row'
                alignItems='center'
                justifyContent='center'
                overflow='auto'>
                {this.props.collection.slides.map((slide, index) => (
                    <SubSlideAssignment
                        key={index}
                        subSlide={slide}
                        index={index}
                        attendees={this.getAttendeesForSubSlide(index)}
                    />
                ))}
            </Box>
        );
    }

    private getAttendeesForSubSlide = (index: number): IAttendeeData[] => {
        return this.props.attendees.filter(attendee => {
            return attendee.assignments[this.props.slideIndex] === index;
        });
    };
}
