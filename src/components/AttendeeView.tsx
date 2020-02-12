import React from "react";
import {PresentationProps} from "../App";
import SocketIOClient from 'socket.io-client';
import {Button} from "@blueprintjs/core";

interface State {
    message : string;
}

interface Props extends PresentationProps {
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
                {this.renderMessage()}
                <Button text="BACK" large={true} type={"button"} onClick={this.props.onBack} fill={false} style={{color: this.props.presentation.labelColorLight, background: this.props.presentation.defaultButtonColor}}/>
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