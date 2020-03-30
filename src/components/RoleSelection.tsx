import React from 'react';
import { Role } from '../Role';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import 'typeface-roboto';

interface Props {
    onSelect: (role: Role) => void;
}

export default class RoleSelection extends React.Component<Props> {
    render() {
        return (
            <Paper
                elevation={5}
                style={{ paddingTop: '25px', paddingBottom: '25px' }}>
                <Typography
                    style={{ marginBottom: '20px' }}
                    color={'textPrimary'}
                    variant={'h3'}>
                    Who are you?
                </Typography>
                <Grid
                    container
                    justify={'center'}
                    alignItems={'center'}
                    spacing={5}>
                    <Grid item xs={5}>
                        <Button
                            style={{ height: '80px' }}
                            size={'large'}
                            variant={'contained'}
                            color={'primary'}
                            onClick={() => this.props.onSelect(Role.Presenter)}>
                            Presenter / Teacher
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        <Button
                            style={{ height: '80px' }}
                            size={'large'}
                            variant={'contained'}
                            color={'primary'}
                            onClick={() => this.props.onSelect(Role.Attendee)}>
                            Attendee / Student
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}
