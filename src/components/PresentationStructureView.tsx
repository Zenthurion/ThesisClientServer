import React from 'react';
import { ThemeProvider, Paper, Box, Card, Typography } from '@material-ui/core';
import { presentationTheme } from './PresentationView';
import LayersIcon from '@material-ui/icons/Layers';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import BallotIcon from '@material-ui/icons/Ballot';
import CallToActionIcon from '@material-ui/icons/CallToAction';
import { mainTheme } from '../App';
import {
    IPresentationStructure,
    IPresentationStructureContentSlide,
    IPresentationStructureSlide
} from '../events/PresenterEvents';

export interface StructureItem {
    type: string;
    title: string;
}

export interface ISelectionResult {
    valid: boolean;
    text: string;
}

interface Props {
    structure: IPresentationStructure;
    direction?: string;
    currentSlideIndex: number;
    onSlideClicked: (
        index: number,
        slide: IPresentationStructureSlide
    ) => ISelectionResult;
}

interface State {
    selectedText: string;
}

export default class PresentationStructureView extends React.Component<
    Props,
    State
> {
    constructor(props: Props) {
        super(props);

        this.state = { selectedText: 'Selected' };
    }

    render() {
        return (
            <ThemeProvider theme={mainTheme}>
                <Paper
                    square={true}
                    style={{
                        height: '100%',
                        width: '100%',
                        overflow: 'auto'
                    }}>
                    <Box
                        display='flex'
                        flexDirection={this.props.direction ?? 'row'}>
                        {this.props.structure.slides.map((item, index) =>
                            this.renderCard(item, index)
                        )}
                    </Box>
                </Paper>
            </ThemeProvider>
        );
    }

    private renderCard = (item: IPresentationStructureSlide, index: number) => {
        return (
            <ThemeProvider key={index} theme={presentationTheme}>
                <Card
                    onClick={() => {
                        this.handleSelection(index, item);
                    }}
                    style={{
                        margin: '5px',
                        minWidth: '200px',
                        minHeight: '80px'
                    }}>
                    <Box overflow='ellipsis'>
                        {this.renderContent(item, index)}
                        {this.renderIcon(item)}
                    </Box>
                    {index === this.props.currentSlideIndex ? (
                        <Box>
                            <Typography
                                variant='subtitle2'
                                style={{ color: 'red' }}>
                                {this.state.selectedText}
                            </Typography>
                        </Box>
                    ) : (
                        ''
                    )}
                </Card>
            </ThemeProvider>
        );
    };

    private renderContent = (
        item: IPresentationStructureSlide,
        index: number
    ) => {
        if (item.type === 'SlideCollection')
            return (
                <Typography variant='subtitle1'>
                    {index + 1}. Collection
                </Typography>
            );
        else
            return (
                <Typography variant='subtitle1'>
                    {index + 1}.{' '}
                    {(item as IPresentationStructureContentSlide).title}
                </Typography>
            );
    };

    private renderIcon = (item: IPresentationStructureSlide) => {
        switch (item.type) {
            case 'SlideCollection':
                return <LayersIcon />;
            case 'PlainSlide':
                return <FontDownloadIcon />;
            case 'SlideChoiceSlide':
                return <OpenWithIcon />;
            case 'TextAnswerSlide':
                return <CallToActionIcon />;
            case 'MultipleChoiceSlide':
                return <BallotIcon />;
        }
    };

    private handleSelection = (
        index: number,
        item: IPresentationStructureSlide
    ) => {
        const result: ISelectionResult = this.props.onSlideClicked(index, item);
        if (!result.valid) return;

        this.setState({
            selectedText: result.text
        });
    };
}
