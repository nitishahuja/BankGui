import React, { useState } from "react";

const DeleteForm = ({ tableData, onDelete, activeTable }) => {
  const [formData, setFormData] = useState({});

  const determinePrimaryKeys = (tableName) => {
    // Map table names to their respective primary key field(s)
    const primaryKeysMap = {
      Branch: ["Branch_Code"],
      Customers: ["Customer_ID"],
      Policy: ["Policy_ID"],
      Claims: ["Issue_ID"],
      Locker: ["LockerID"],
      Employee: ["Employee_ID"],
      Account: ["AccountNumber"],
      Transaction: ["TransactionID"],
      Loan: ["Loan_ID"],
      Loan_Application: ["Customer_ID", "Loan_ID"],
      Customer_Policy: ["Customer_ID", "Policy_ID"],
      Complaint: ["Complaint_ID"],
      Access_Log: ["Customer_ID", "LockerID"],
    };

    return primaryKeysMap[tableName] || [];
  };

  const handleInputChange = (columnName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [columnName]: value,
    }));
  };

  const handleDelete = () => {
    onDelete(formData);
    setFormData({});
  };

  const primaryKeys = determinePrimaryKeys(activeTable);

  return (
    <form>
      {tableData.map((column) => {
        // Render only the primary key fields
        if (primaryKeys.includes(column)) {
          return (
            <div key={column}>
              <label htmlFor={column}>
                {column.replace("_", " ").replace("_", " ").replace("_", " ")}:{" "}
              </label>
              <input
                type={column.toLowerCase().includes("date") ? "date" : "text"}
                id={column}
                name={column}
                value={formData[column] || ""}
                onChange={(e) => handleInputChange(column, e.target.value)}
              />
            </div>
          );
        }
        return null;
      })}
      <button type="button" onClick={handleDelete}>
        Delete Data
      </button>
    </form>
  );
};

export default DeleteForm;
