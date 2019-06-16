import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import * as Constants from "../Constants";

const useStyles = makeStyles(theme => ({
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
}));

export default function NodeControlPanelCard(props) {
  const classes = useStyles();

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
            value={props.nodeData.children.length}
            onChange={props.updateNodeChildren}
            className={classes.inputField}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              inputProps: {
                min: 0,
                max: Constants.CONTROL_PANEL_MAX_CHILD_NODES,
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
