import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
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

  onChange = event => {
    // TODO: Reset to correct value in TextField when user clicks away
    var newValue = event.target.value;
    // value defaults to 0 if field is blank
    // var newValue = event.target.value === "" ? 0 : event.target.value;
    // event.target.value = newValue;

    if (newValue >= 0 && newValue <= Constants.CONTROL_PANEL_MAX_CHILD_NODES) {
      console.log("called");
      this.props.updateNodeChildren(event);
    }
    this.setState({ childNodeCount: newValue });
  };

  render() {
    const { classes } = this.props;

    // var childNodeCount = this.props.nodeData.children.length;
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

            <TextField
              id="standard-number"
              type="number"
              value={this.state.childNodeCount}
              onChange={this.onChange}
              error={
                this.state.childNodeCount < 0 ||
                this.state.childNodeCount >
                  Constants.CONTROL_PANEL_MAX_CHILD_NODES
              }
              // helperText="A node can only have up to 10 children"
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
