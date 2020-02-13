import React from "react";
import {Container, createMuiTheme, Grid, Paper, ThemeProvider, Typography} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {lime, orange} from "@material-ui/core/colors";
import PresentationContent from "../PresentationContent";
import {GridDirection} from "@material-ui/core/Grid/Grid";

export const presentationTheme : Theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: lime,
        secondary: orange
    }
});

interface Props {
    onClick? : () => void;
    showSlideCount: boolean;
    content: PresentationContent;
}

interface State {

}

export default class PresentationView extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
            <ThemeProvider theme={presentationTheme}>
                <Paper onClick={this.presentationClicked} style={{height: '100%'}}>
                    <Container style={{paddingTop: '10px', paddingBottom: '10px'}}>
                        <Grid container direction={'column'}>
                            {this.renderTitle()}
                            {this.renderBody()}
                        </Grid>
                    </Container>
                </Paper>
            </ThemeProvider>
        );
    }

    private presentationClicked = () => {
        if(this.props.onClick === undefined) return;
        this.props.onClick!();
    };

    private renderTitle = () => {
        return <Grid item xl={2}>
            <Typography color={'textPrimary'} variant={'h3'} align={'left'}>{this.props.content.title}</Typography>
        </Grid>;
    };
    private renderBody = () => {
        return <Grid item xl={8}>
            <Typography color={'textPrimary'} variant={'body1'} align={'left'}>{this.props.content.body}</Typography>
        </Grid>;
    };
}