import React from 'react';
import {
    Box,
    Paper,
    Card,
    ThemeProvider,
    Typography,
    Divider
} from '@material-ui/core';
import PresentationStructureView, {
    ISelectionResult
} from './PresentationStructureView';
import PresenterEvents, {
    IPresentationStructure,
    IPresentationStructureSlide,
    IPresentationStructureCollectionSlide,
    IPresentationStructureContentSlide,
    IAttendeeData
} from '../events/PresenterEvents';
import { presentationTheme } from './PresentationView';
import { typography } from '@material-ui/system';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    ResponderProvided
} from 'react-beautiful-dnd';
import AssignmentAttendeePanel from './AssignmentAttendeePanel';
import AssignmentSlidesPanel from './AssignmentSlidesPanel';
import { Socket } from 'net';
import { IAssignContentData } from '../events/ClientEvents';

interface Props {
    attendees: IAttendeeData[];
    presentation: IPresentationStructure;
    socket: SocketIOClient.Socket;
    updateAttendee: (attendee: IAttendeeData) => void;
}

interface State {
    selectedSlide: number;
}

export default class SlideAssignment extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedSlide: this.getFirstSlideCollectionIndex()
        };
    }

    render() {
        return (
            <Box width='100%' height='100%' display='flex' flexDirection='row'>
                <Box
                    width='calc(100% - 230px)'
                    height='100%'
                    display='flex'
                    flexDirection='column'>
                    <Paper style={{ width: '100%', height: '100%' }} square>
                        <ThemeProvider theme={presentationTheme}>
                            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                <AssignmentAttendeePanel
                                    selectedSlide={this.state.selectedSlide}
                                    attendees={this.props.attendees}
                                />
                                <AssignmentSlidesPanel
                                    slideIndex={this.state.selectedSlide}
                                    collection={this.getSelectedCollection()}
                                    attendees={this.props.attendees}
                                />
                            </DragDropContext>
                        </ThemeProvider>
                    </Paper>
                </Box>
                <Box
                    width='230px'
                    height='100%'
                    display='flex'
                    flexDirection='column'>
                    <PresentationStructureView
                        direction='column'
                        structure={this.props.presentation}
                        onSlideClicked={this.handleSlideStructureSelection}
                        currentSlideIndex={this.state.selectedSlide}
                    />
                </Box>
            </Box>
        );
    }

    private getSelectedCollection = (): IPresentationStructureCollectionSlide => {
        const collection = this.props.presentation.slides[
            this.state.selectedSlide
        ] as IPresentationStructureCollectionSlide;
        if (
            collection === undefined ||
            collection.type !== 'SlideCollection' ||
            !(collection as IPresentationStructureCollectionSlide) // Possibly invalid condition
        ) {
            this.setState({
                selectedSlide: this.getFirstSlideCollectionIndex()
            });
        }

        return collection;
    };

    private handleSlideStructureSelection = (
        index: number,
        slide: IPresentationStructureSlide
    ): ISelectionResult => {
        const result: ISelectionResult = {
            valid: false,
            text: ''
        };

        if (slide.type === 'SlideCollection') {
            result.valid = true;
            result.text = 'Selected';
            this.setState({ selectedSlide: index });
        }

        return result;
    };

    private handleOnDragEnd = (
        result: DropResult,
        provided: ResponderProvided
    ) => {
        if (
            !result.destination ||
            result.source.droppableId === result.destination.droppableId
        )
            return;

        const attendee = this.props.attendees.find(
            a => result.draggableId === a.name
        );

        if (!attendee) return;

        this.assignAttendee(attendee, result.destination.droppableId);
    };

    private getFirstSlideCollectionIndex = (): number => {
        return this.props.presentation.slides.findIndex(slide => {
            return slide.type === 'SlideCollection';
        });
    };

    private assignAttendee = (attendee: IAttendeeData, target: string) => {
        let assignData: IAssignContentData;
        if (target === 'attendeeDrop') {
            assignData = {
                slideIndex: this.state.selectedSlide,
                subIndex: -1,
                target: [attendee.name]
            };
        } else {
            assignData = {
                slideIndex: this.state.selectedSlide,
                subIndex: parseInt(target, 10),
                target: [attendee.name]
            };
        }
        attendee.assignments[assignData.slideIndex] = assignData.subIndex;

        this.props.updateAttendee(attendee);
        this.props.socket.emit(PresenterEvents.AssignContent, assignData);
    };
}
