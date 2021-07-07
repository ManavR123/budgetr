import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  container: {
    maxHeight: 440,
    marginLeft: "32px",
    marginTop: "16px",
  },
  table: {
    minWidth: 0,
  },
});

const COLUMNS = ["Date", "Amount", "Location", "Category", "Notes", "Delete"];

const deleteData = (id) => {
  console.log(id);
};

function SpendingTable({ user, startDate, endDate, update }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/get_purchases", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        date1: startDate.format("MM/DD/YYYY"),
        date2: endDate.format("MM/DD/YYYY"),
      }),
    })
      .then((response) => {
        response.json().then((purchase_data) => {
          const { ids, notes, amounts, categories, dates, locations } =
            purchase_data;
          setRows(
            [...Array(amounts.length).keys()].map((i) => ({
              id: ids[i],
              notes: notes[i],
              amount: amounts[i],
              category: categories[i],
              date: dates[i],
              location: locations[i],
            })),
          );
        });
      })
      .catch((error) => console.log(error));
  }, [startDate, endDate, update]);

  // const rows = [
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "1",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "2",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "3",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "4",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "5",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "4",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "5",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "4",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "5",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "4",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "5",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "4",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "5",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "4",
  //   },
  //   {
  //     date: "1-Jul",
  //     amount: "$2.65",
  //     location: "Taco Bell",
  //     category: "Food",
  //     notes: "Lunch with friend",
  //     id: "5",
  //   },
  // ];

  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table
        className={classes.table}
        size="small"
        stickyHeader
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            {COLUMNS.map((col, index) => (
              <TableCell align={index != 0 ? "right" : "left"} key={index}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">${row.amount}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.notes}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => {
                    deleteData(row.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SpendingTable;
