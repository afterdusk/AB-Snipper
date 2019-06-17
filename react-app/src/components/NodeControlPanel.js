import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as Constants from "../Constants";

const styles = theme => ({
  card: {
    width: Constants.CONTROL_PANEL_WIDTH,
    display: "flex"
  },
  text: {
    display: "table-cell",
    width: 175,
    bottom: 0
  },
  inputField: {
    width: Constants.CONTROL_PANEL_TEXT_FIELD_WIDTH,
    display: "table-cell"
  },
  inputFieldRow: {
    height: 50,
    width: "100%"
  }
});

class NodeControlPanelCard extends React.Component {
  state = {
    childNodeCount: this.props.nodeData.children.length
  };

  handleChildCountChange = event => {
    var newValue = event.target.value;

    if (newValue >= 0 && newValue <= Constants.CONTROL_PANEL_MAX_CHILD_NODES) {
      console.log("called");
      this.props.updateNodeChildren(event);
    }
    this.setState({ childNodeCount: newValue });
  };

  // reset
  resetChildCount = () => {
    this.setState({ childNodeCount: this.props.nodeData.children.length });
  };

  // when a new node is selected by parent, state should updated on new props
  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (
      oldProps.nodeData.children.length !== newProps.nodeData.children.length
    ) {
      this.setState({
        childNodeCount: newProps.nodeData.children.length
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">
            {Constants.CONTROL_PANEL_CARD_HEADER}
          </Typography>
          <div className={classes.inputFieldRow}>
            <Typography variant="subtitle2" className={classes.text}>
              {Constants.CONTROL_PANEL_CHILD_FIELD}
            </Typography>

            <ClickAwayListener onClickAway={this.resetChildCount}>
              <TextField
                id="standard-number"
                type="number"
                value={this.state.childNodeCount}
                onChange={this.handleChildCountChange}
                error={
                  this.state.childNodeCount < 0 ||
                  this.state.childNodeCount >
                    Constants.CONTROL_PANEL_MAX_CHILD_NODES
                }
                helperText={
                  this.state.childNodeCount < 0
                    ? Constants.CONTRON_PANEL_CHILD_FIELD_NEGATIVE_ERROR
                    : this.state.childNodeCount >
                      Constants.CONTROL_PANEL_MAX_CHILD_NODES
                    ? Constants.CONTROL_PANEL_CHILD_FIELD_OVERFLOW_ERROR
                    : ""
                }
                className={classes.inputField}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 10,
                    step: 1
                  }
                }}
                margin="normal"
              />
            </ClickAwayListener>
          </div>
        </CardContent>
      </Card>
    );
  }
}

NodeControlPanelCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NodeControlPanelCard);
