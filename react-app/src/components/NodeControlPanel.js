import React from "react";
import PropTypes from "prop-types";
import { withStyles, ThemeProvider } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as Constants from "../Constants";

// TODO: Extract constants
// TODO: Adopt a more consistent approach to styling (inline or JSS)
const styles = theme => ({
  card: {
    width: Constants.CONTROL_PANEL_WIDTH,
    display: "flex"
  },
  text: {
    display: "table-cell",
    width: "75%"
  },
  inputField: {
    display: "table-cell",
    verticalAlign: "bottom"
  },
  inputFieldRow: {
    width: "100%",
    marginTop: 10
  }
});

class NodeControlPanelCard extends React.Component {
  state = {
    childNodeCount: this.props.nodeData.children.length
  };

  handleChildCountChange = event => {
    var newValue = event.target.value;

    if (newValue >= 0 && newValue <= Constants.CONTROL_PANEL_MAX_CHILD_NODES) {
      this.props.updateNodeChildren(event);
    }
    this.setState({ childNodeCount: newValue });
  };

  // reset
  resetChildCount = () => {
    this.setState({ childNodeCount: this.props.nodeData.children.length });
  };

  // when a new node is selected by parent, state updates on new props
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
          <Typography variant="subtitle2">
            {Constants.CONTROL_PANEL_CARD_HEADER}
          </Typography>
          <div className={classes.inputFieldRow}>
            <Typography variant="h6" className={classes.text}>
              {Constants.CONTROL_PANEL_CHILD_FIELD}
            </Typography>

            <ClickAwayListener onClickAway={this.resetChildCount}>
              <TextField
                className={classes.inputField}
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
                    ? Constants.CONTROL_PANEL_CHILD_FIELD_NEGATIVE_ERROR
                    : this.state.childNodeCount >
                      Constants.CONTROL_PANEL_MAX_CHILD_NODES
                    ? Constants.CONTROL_PANEL_CHILD_FIELD_OVERFLOW_ERROR
                    : " "
                }
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 10,
                    step: 1,
                    style: {
                      // TODO: Refine logic for centralising text
                      textAlign: "center",
                      paddingLeft: 10
                    }
                  }
                }}
                style={{ width: "600px" }}
                margin="normal"
                fullWidth
              />
            </ClickAwayListener>
          </div>
          <div className={classes.inputFieldRow}>
            <ThemeProvider theme={Constants.textTheme}>
              <Typography
                variant="h6"
                className={classes.text}
                color={
                  // TODO: Ensure color updates immediately upon becoming 0
                  this.state.childNodeCount === 0
                    ? "textPrimary"
                    : "textSecondary"
                }
              >
                {Constants.CONTROL_PANEL_VALUE_FIELD}
              </Typography>
            </ThemeProvider>
            <TextField
              disabled={this.props.nodeData.value === null}
              className={classes.inputField}
              type="number"
              value={
                this.props.nodeData.value === null
                  ? ""
                  : this.props.nodeData.value
              }
              onChange={this.props.updateNodeValue}
              helperText=" "
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                inputProps: {
                  step: 1,
                  style: {
                    // TODO: Refine logic for centralising text
                    textAlign: "center",
                    paddingLeft: 10
                  }
                }
              }}
              style={{ width: "600px" }}
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
