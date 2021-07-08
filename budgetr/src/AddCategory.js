import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
  },
};

function AddCategory({ user }) {
  const [category, setCategory] = useState("");

  const onSubmit = () => {
    fetch("/add_category", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        category_name: category,
      }),
    })
      .then(() => {
        setCategory("");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={styles.container}>
      <TextField
        required
        label="Add New Category"
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
        }}
      />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}

export default AddCategory;
