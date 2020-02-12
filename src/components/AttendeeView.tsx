import React from "react";
import SocketIOClient from 'socket.io-client';
import {Button} from '@material-ui/core';
import PresentationView from "./PresentationView";

interface State {
    message : string;
}

interface Props {
    onBack : () => void;
}

export default class AttendeeView extends React.Component<Props, State>{

    private socket : SocketIOClient.Socket;

    constructor(props: Props) {
        super(props);

        this.state = {message: ""};
        this.socket = SocketIOClient('http://localhost:3001');
    }
    render() {
        return (
            <div>
                <PresentationView showSlideCount={true} />
                {this.renderMessage()}
                <Button variant={'contained'} color={'primary'} onClick={this.props.onBack}>Back</Button>
            </div>
        );
    };

    private renderMessage = () => {
      if(this.state === undefined || this.state.message === undefined) {
          console.log('no message...');
          return "";
      }
      return (<p>
          {this.state.message}
      </p>);
    };

    componentDidMount(): void {
        this.socket.on('MESSAGE', (data :any) => {
            this.setState({message: data});

            console.log("Received message");
        });
    }
}