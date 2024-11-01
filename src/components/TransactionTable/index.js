import React, { useState } from "react"; 
import { Table, Input, Select, Radio } from "antd";
import "./styles.css";
import searchImg from "../../assets/search.svg";
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import moment from "moment";

const { Option } = Select;

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const filteredTransactions = (transactions || []).filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    }
    return 0; // No sorting
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  const exportToCsv = () => {
    if (dataSource.length === 0) {
      toast.warn("No transactions to export.");
      return;
    }

    const csv = Papa.unparse(dataSource.map(({ key, ...rest }) => rest)); // Exclude the key from the export
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importFromCsv = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected.");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async function (results) {
        let addedTransactions = 0;
        for (const transaction of results.data) {
          try {
            if (!transaction.Name || !transaction.Amount || !transaction.Date || !transaction.Type) {
              throw new Error("Missing required fields");
            }

            const formattedDate = moment(transaction.Date, "DD-MM-YYYY").format("YYYY-MM-DD");
            const newTransaction = {
              name: transaction.Name,
              amount: parseFloat(transaction.Amount),
              date: formattedDate,
              tag: transaction.Tag,
              type: transaction.Type,
            };
            
            await addTransaction(newTransaction, true);
            addedTransactions++;
          } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error(`Error adding transaction: ${error.message}`);
          }
        }
        toast.success(`${addedTransactions} Transactions Added`);
        await fetchTransactions();
        event.target.value = ""; // Clear input
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error("Error parsing CSV");
      },
    });
  };

  return (
    <div className="table">
      <div className="searchBar">
        <img src={searchImg} alt="search icon" />
        <Input 
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name"
        />
        <Select
          onChange={(value) => setTypeFilter(value || "")}
          value={typeFilter}
          placeholder="Filter by Type"
          allowClear
          style={{ width: "200px", marginLeft: "10px" }}
        >
          <Option value="">All</Option>
          <Option value="Income">Income</Option>
          <Option value="Expense">Expense</Option>
        </Select>
      </div>

      <div className="mytransaction">
        <h2>My Transactions</h2>

        <Radio.Group onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>

        <div className="CSV">
          <button className="btn" onClick={exportToCsv}>
            Export to CSV
          </button>
          <label htmlFor="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            onChange={importFromCsv}
            id="file-csv"
            type="file"
            accept=".csv"
            required
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default TransactionTable;
