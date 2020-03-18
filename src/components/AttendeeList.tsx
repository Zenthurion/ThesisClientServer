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

interface Props {
    socket: SocketIOClient.Socket;
    attendees: string[];
}

interface State {
    attendees: string[];
}

export default class AttendeeList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { attendees: props.attendees };
    }

    render() {
        return (
            <ThemeProvider theme={presentationTheme}>
                <TableContainer
                    component={Paper}
                    style={{ width: '200px', height: '100%' }}>
                    <Table size='small'>
                        <TableHead>
                            <TableCell>Attendees</TableCell>
                        </TableHead>
                        <TableBody>
                            {this.state?.attendees?.map(attendee => (
                                <TableRow key={attendee}>
                                    <TableCell
                                        component='th'
                                        scope='row'
                                        variant='body'>
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

    componentDidMount() {
        this.props.socket.on('session-data', (data: any) => {
            this.setState({ attendees: data.attendees });
            console.log(data);
        });
    }
}
