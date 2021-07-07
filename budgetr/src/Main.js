import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import SpendingTable from "./SpendingTable.js";
import Chart from "./Chart.js";
import AddEntryModal from "./AddEntryModal.js";
import "bootstrap/dist/css/bootstrap.min.css";

const styles = {
  addEntry: {
    fontSize: "32px",
    marginLeft: "32px",
    marginTop: "8px",
  },
  container: {
    display: "flex",
  },
  child: {
    flex: 1,
  },
  pie: {
    fontSize: "3px",
  },
};

function Main({ user }) {
  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment().endOf("month"));
  const [showModel, setShowModal] = useState(false);
  const [update, setUpdate] = useState(0);

  return (
    <div style={styles.container}>
      <AddEntryModal
        user={user}
        show={showModel}
        setShow={setShowModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          setUpdate(update + 1);
          setShowModal(false);
        }}
      />
      <div style={styles.child}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Start Date"
              value={startDate}
              onChange={(value) => setStartDate(moment(value))}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="End Date"
              value={endDate}
              onChange={(value) => setEndDate(moment(value))}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <SpendingTable
          user={user}
          startDate={startDate}
          endDate={endDate}
          update={update}
        />
        <div style={styles.addEntry}>
          Add an Entry{" "}
          <IconButton
            onClick={() => {
              setShowModal(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <div style={styles.child}>
        <Chart
          user={user}
          startDate={startDate}
          endDate={endDate}
          update={update}
        />
      </div>
    </div>
  );
}

export default Main;
