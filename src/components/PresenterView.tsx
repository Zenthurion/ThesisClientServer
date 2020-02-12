import React from "react";
import {Button} from "@material-ui/core";

interface State {

}

interface Props {
    onBack : () => void;
}

export default class PresenterView extends React.Component<Props, State>{
    render = () => {
        return  <Button variant={'contained'} color={'primary'} onClick={this.props.onBack}>Back</Button>
    }
}