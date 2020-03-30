import React from 'react';
import { IAttendeeData } from '../events/PresenterEvents';
import { Box, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CachedIcon from '@material-ui/icons/Cached';
import ClearIcon from '@material-ui/icons/Clear';

interface Props {
    attendee: IAttendeeData;
    slideIndex: number;
}

export default class AttendeeListItem extends React.Component<Props> {
    render() {
        return (
            <Box width={'100%'} display='flex' flexDirection='row'>
                <Box width='70%' display='flex'>
                    <Typography>{this.props.attendee.name}</Typography>
                </Box>
                <Box width='30%' display='flex' justifyContent='flex-end'>
                    <Typography>{this.renderInteractionStatus()}</Typography>
                </Box>
            </Box>
        );
    }

    private renderInteractionStatus = () => {
        const interaction = this.props.attendee.interactions[
            this.props.slideIndex
        ];
        if (!interaction || interaction.data === '') return '';
        if (interaction.submitted) {
            if (interaction.valid) return <CheckIcon />;
            else return <ClearIcon />;
        } else return <CachedIcon />;
    };
}
