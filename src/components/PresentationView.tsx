import React from "react";
import {createMuiTheme, Grid, Paper, ThemeProvider} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {lime, orange} from "@material-ui/core/colors";

export const presentationTheme : Theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: lime,
        secondary: orange
    }
});

interface Props {
    showSlideCount: boolean;
}

interface State {
    content: {};
}

export default class PresentationView extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
            <ThemeProvider theme={presentationTheme}>
                <Paper style={{width: '100%', height: '100%'}}>
                    <Grid>
                        {this.state?.content ?? "CONTENT"}
                    </Grid>
                </Paper>
            </ThemeProvider>
        );
    }
}