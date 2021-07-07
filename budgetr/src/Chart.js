import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import randomColor from "randomcolor";

const styles = {
  pie: {
    fontSize: "3px",
  },
};

function Chart({ user, startDate, endDate, update }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/get_total_purchases", {
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
          const { amounts, categories } = purchase_data;
          setData(
            [...Array(amounts.length).keys()].map((i) => ({
              title: categories[i],
              value: amounts[i],
              color: randomColor(),
            })),
          );
        });
      })
      .catch((error) => console.log(error));
  }, [startDate, endDate, update]);

  return (
    <PieChart
      style={styles.pie}
      radius={30}
      lineWidth={50}
      center={[50, 30]}
      animate
      data={data}
      label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
      labelPosition={70}
    >
      <text fontSize="6px" textAnchor="middle" x="50" y="32">
        $
        {data
          .reduce((total, el) => {
            return total + el.value;
          }, 0)
          .toFixed(2)}
      </text>
    </PieChart>
  );
}

export default Chart;
