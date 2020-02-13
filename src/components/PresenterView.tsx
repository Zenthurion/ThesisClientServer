import React from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import PresentationView from "./PresentationView";
import PresentationContent from "../PresentationContent";
import SocketIOClient from "socket.io-client";

interface State {
    message : {
        previousContent?: string;
        content: string;
        nextContent?: string;
    },
    sessionId: string;
}

interface Props {
    onBack : () => void;
}

export default class PresenterView extends React.Component<Props, State>{
    private socket : SocketIOClient.Socket;

    constructor(props: Props) {
        super(props);

        this.state = { message: { content: "" }, sessionId: "Loading Session ID" };
        this.socket = SocketIOClient('http://localhost:3001');

    }

    render = () => {
        return (
            <Grid container>
                <Grid item xs={6} ><Typography color={"textPrimary"}>Session ID: {this.state.sessionId}</Typography></Grid>
                <Grid item xs={12} style={{width: '600px', height: '400px'}}><PresentationView onClick={this.nextSlide} showSlideCount={true} content={this.getContent()} /></Grid>
                <Grid direction={'row'} alignItems={'center'} container >
                    <Grid item xs={2}><Button variant={'contained'} color={'primary'} onClick={this.previousSlide} style={{width: '100%'}}>Previous</Button></Grid>
                    <Grid item xs={2}><Button variant={'contained'} color={'primary'} onClick={this.nextSlide} style={{width: '100%'}}>Next</Button></Grid>
                </Grid>
                <Grid item xs={2}><Button variant={'contained'} color={'primary'} onClick={this.props.onBack} style={{width: '100%'}}>Back</Button></Grid>
            </Grid>
        );
    };

    private nextSlide = () => {
        this.socket.emit('request-next-slide', '{ "action": "nextSlide" }')
    };

    private previousSlide = () => {
        this.socket.emit('request-previous-slide', '{ "action": "previousSlide" }')
    };

    private getContent = () => {
        return new PresentationContent(this.state.message.content);
    };

    componentDidMount(): void {
        this.socket.emit(`presenter-connected`);
        this.socket.once(`emit-new-session-id`, (json : any) => {
            let data = JSON.parse(json);
            this.setState({ sessionId: data.sessionId });
            console.log("Session ID received: " + data.sessionId);
        });
        this.socket.on('emit-presentation-content', (json: any) => {
            let data = JSON.parse(json);
            this.setState({message: { previousContent: data.previousSlide, content: data.currentSlide, nextContent: data.nextSlide}});
        });
    }

    componentWillUnmount(): void {
        this.socket.disconnect();
    }
}