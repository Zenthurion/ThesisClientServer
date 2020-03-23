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
import {
    IPresentationStructure,
    IPresentationStructureSlide,
    IPresentationStructureCollectionSlide,
    IPresentationStructureContentSlide
} from '../events/PresenterEvents';
import { presentationTheme } from './PresentationView';
import { typography } from '@material-ui/system';

interface Props {
    attendees: string[];
    presentation: IPresentationStructure;
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
                            {this.renderAttendeePanel()}
                            {this.renderAssignmentPanel()}
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

    private renderAttendeePanel = () => {
        return (
            <Box
                width='100%'
                height='35%'
                display='flex'
                flexDirection='row'
                overflow='auto'>
                {this.props.attendees.map(attendee => (
                    <Paper
                        key={attendee}
                        style={{
                            margin: '3px'
                        }}>
                        <Box
                            padding='5px'
                            width='100px'
                            display='flex'
                            alignContent='left'>
                            <Typography variant='subtitle1'>
                                {attendee}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        );
    };

    private renderAssignmentPanel = () => {
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
        return (
            <Box
                width='100%'
                height='65%'
                display='flex'
                flexDirection='row'
                alignItems='center'
                justifyContent='center'
                overflow='auto'>
                {(collection as IPresentationStructureCollectionSlide).slides.map(
                    (slide, index) => {
                        return this.renderSlideAssignment(slide, index);
                    }
                )}
            </Box>
        );
    };

    private renderSlideAssignment = (
        slide: IPresentationStructureContentSlide,
        index: number
    ) => {
        return (
            <Box
                key={index}
                minWidth='300px'
                height='calc(100% - 10px)'
                padding='5px'
                display='flex'
                flexDirection='column'>
                <Paper style={{ width: '100%', height: '70%' }}>
                    <Typography variant='subtitle1'>Assigned</Typography>
                    <Divider />
                </Paper>
                <Divider />
                <Paper style={{ width: '100%', height: '30%' }}>
                    <Box
                        width='100%'
                        height='100%'
                        justifyContent='center'
                        alignItems='center'>
                        <Box width='100%' height='30px'>
                            <Typography variant='subtitle1'>
                                {slide.title}
                            </Typography>
                            <Divider />
                        </Box>
                        <Box
                            width='100%'
                            height='calc(100% - 30px)'
                            alignItems='center'
                            justifyContent='center'>
                            <Typography variant='subtitle2'>
                                {slide.body}
                            </Typography>
                            {this.renderSlideType(slide)}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        );
    };

    private renderSlideType = (slide: IPresentationStructureSlide) => {
        switch (slide.type) {
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
                    'A slide of this type should not appear here! ' + slide.type
                );
        }
        return '';
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

    private getFirstSlideCollectionIndex = (): number => {
        return this.props.presentation.slides.findIndex(slide => {
            return slide.type === 'SlideCollection';
        });
    };
}
