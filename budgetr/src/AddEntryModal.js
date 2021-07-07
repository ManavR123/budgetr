import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles({
  root: {
    flexDirection: "column",
  },
  formControl: {
    minWidth: 120,
  },
});

function AddEntryModal({ user, show, onClose, onSubmit }) {
  const [date, setDate] = useState(moment());
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch("/get_categories", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
      }),
    })
      .then((response) => {
        response.json().then((purchase_data) => {
          setCategories(purchase_data.categories);
        });
      })
      .catch((error) => console.log(error));
  }, [show]);

  const handleSubmit = () => {
    fetch("/add_purchase", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        location,
        category,
        amount: parseFloat(amount),
        notes,
        date: moment(date).format("MM/DD/YYYY"),
      }),
    })
      .then(() => {
        onSubmit();
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container className={classes.root} spacing={3}>
            <Grid item>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date"
                value={date}
                onChange={setDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                label="Amount"
                type="number"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                label="Location"
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
                value={location}
              />
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-helper-label">
                  Category
                </InputLabel>
                <Select
                  required
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <MenuItem value={cat} key={idx}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                required
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                }}
                label="Notes"
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          disabled={
            date == null || amount == "" || location == "" || category == ""
          }
          variant="primary"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEntryModal;
