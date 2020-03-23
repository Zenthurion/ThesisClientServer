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
import { IAttendeeData } from '../events/PresenterEvents';

interface Props {
    attendees: IAttendeeData[];
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
                            <TableRow>
                                <TableCell>Attendees</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props?.attendees?.map(attendee => (
                                <TableRow key={attendee.name}>
                                    <TableCell variant='body'>
                                        {attendee.name}
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
