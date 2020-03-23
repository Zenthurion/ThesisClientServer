import React from 'react';
import {
    Grid,
    Typography,
    Button,
    TextField,
    Box,
    Divider
} from '@material-ui/core';
import SlideContent from '../SlideContent';

interface Props {
    controller: string;
    slide: SlideContent;
}

export default class TextAnswerSlideContent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Box paddingLeft='20px' paddingRight='20px' height='100%'>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='70px'>
                    <Typography variant='h3'>
                        {this.props.slide.content.title}
                    </Typography>
                </Box>
                <Divider />
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    height='calc(60% - 70px)'>
                    <Typography variant='body1'>
                        {this.props.slide.content.body}
                    </Typography>
                </Box>
                {this.renderInput()}
                {this.renderSubmit()}
            </Box>
        );
    }

    private renderInput = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        } else {
            return (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    height='30%'>
                    <TextField
                        multiline
                        variant='outlined'
                        rows='4'
                        rowsMax='8'
                        disabled={
                            this.props.controller !==
                            this.props.slide.content.controller
                        }></TextField>
                </Box>
            );
        }
    };

    private renderSubmit = () => {
        if (this.props.controller !== this.props.slide.content.controller) {
            return '';
        } else {
            return (
                <Box display='flex' justifyContent='flex-end' height='10%'>
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        disabled={
                            this.props.controller !==
                            this.props.slide.content.controller
                        }>
                        Submit
                    </Button>
                </Box>
            );
        }
    };
}
