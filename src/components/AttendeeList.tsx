import React from 'react';
import {
    Box,
    ThemeProvider,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableBody,
    TableRow
} from '@material-ui/core';
import { presentationTheme } from './PresentationView';
import { mainTheme } from '../App';

interface Props {
    attendees: string[];
}

export default class AttendeeList extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <ThemeProvider theme={mainTheme}>
                <TableContainer
                    component={Paper}
                    square={true}
                    style={{ minWidth: '200px', height: '100%' }}>
                    <Table size='small'>
                        <TableHead>
                            <TableCell>Attendees</TableCell>
                        </TableHead>
                        <TableBody>
                            {this.state?.attendees?.map(attendee => (
                                <TableRow key={attendee}>
                                    <TableCell variant='body'>
                                        {attendee}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ThemeProvider>
        );
    }

    componentDidMount() {}
}
