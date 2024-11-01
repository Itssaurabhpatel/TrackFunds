import React from "react";
import "./styles.css";
import { Line, Pie } from "@ant-design/charts";

function ChartComponent({ sortedTransactions }) {
  const incomeData = sortedTransactions
    .filter((transaction) => transaction.type === "income")
    .map((item) => ({
      date: item.date,
      amount: item.amount,
    }));

  const spendingData = sortedTransactions.filter((transaction) => transaction.type === "expense");

  const finalSpendings = spendingData.reduce((acc, obj) => {
    const key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: key, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  const newSpendings = Object.values(finalSpendings);

  const config = {
    data: incomeData,
    width: 500,
    autoFit: true,
    xField: "date",
    yField: "amount",
    point: {
      size: 3,
      shape: "circle",
    },
  };

  const spendingConfig = {
    data: newSpendings,
    width: 500,
    autoFit: true,
    angleField: "amount",
    colorField: "tag",
    color: ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC300"],
  };

  return (
    <div className="charts-wrapper">
      <div className="linechart">
        <h2 style={{ marginTop: '1rem', marginLeft: "1rem" }}>Your Analytics</h2>
        <Line {...config} />
      </div>

      <div className="piechart">
        <h2 style={{ marginTop: '1rem' }}>Your Spendings</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}

export default ChartComponent;
