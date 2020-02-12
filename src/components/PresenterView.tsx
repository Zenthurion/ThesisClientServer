import React from "react";
import {PresentationProps} from "../App";
import {Button} from "@blueprintjs/core";

interface State {

}

interface Props extends PresentationProps {
    onBack : () => void;
}

export default class PresenterView extends React.Component<Props, State>{
    render = () => {
        return <Button text="BACK" large={true} type={"button"} onClick={this.props.onBack} fill={false} style={{color: this.props.presentation.labelColorLight, background: this.props.presentation.defaultButtonColor}}/>;
    }
}