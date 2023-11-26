// Content.js
import React, { useState, useEffect } from "react";
import "./Content.css";
import AddForm from "../Forms/AddForm";
import DeleteForm from "../Forms/DeleteForm";
import UpdateForm from "../Forms/UpdateForm";

const Content = ({ activeTable }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/get${activeTable
            .replace("_", "")
            .replace("_", "")}Details`
        );

        if (response.ok) {
          const data = await response.json();
          setTableData(data);
          setError(null); // Clear any previous error on success
        } else {
          const errorMessage = await response.text();
          setError(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    setFormType(null);
    fetchTableData();
  }, [activeTable]);

  const handleAddData = async (formData) => {
    try {
      const response = await fetch(
        `http://localhost:4000/insertInto${activeTable
          .replace("_", "")
          .replace("_", "")}`, // Modify the endpoint accordingly
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedDataResponse = await fetch(
          `http://localhost:4000/get${activeTable
            .replace("_", "")
            .replace("_", "")}Details`
        );
        const updatedData = await updatedDataResponse.json();
        setTableData(updatedData);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Error inserting data. Please try again.";
        setError(errorMessage);
        setTimeout(() => setError(null), 10000);
      }
    } catch (error) {
      console.error("Error inserting data:", error.message);
      setError("Error inserting data. Please try again.");
      setTimeout(() => setError(null), 10000);
    }
  };

  const handleDeleteData = async (formData) => {
    console.log(formData);
    try {
      // Construct the API endpoint based on the active table and primary key(s)
      let endpoint = `http://localhost:4000/delete${activeTable
        .replace("_", "")
        .replace("_", "")}/`;

      // Assuming the primary keys are in an array named primaryKeyArray
      const primaryKeyArray = Object.keys(formData);

      // Append primary key values to the endpoint
      primaryKeyArray.forEach((key, index) => {
        endpoint += formData[key];
        if (index < primaryKeyArray.length - 1) {
          endpoint += "/";
        }
      });
      console.log("endpoint", endpoint);

      const response = await fetch(endpoint, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedDataResponse = await fetch(
          `http://localhost:4000/get${activeTable
            .replace("_", "")
            .replace("_", "")}Details`
        );
        const updatedData = await updatedDataResponse.json();
        setTableData(updatedData);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Error deleting data. Please try again.";
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error("Error deleting data:", error.message);
      setError("Error deleting data. Please try again.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateData = async (formData) => {
    try {
      const primaryKeys = determinePrimaryKeys(activeTable);
      const primaryKeyValues = primaryKeys.map((key) => formData[key]);
      const primaryKey = primaryKeyValues.join("/");

      const response = await fetch(
        `http://localhost:4000/update${activeTable
          .replace("_", "")
          .replace("_", "")}/${primaryKey}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedDataResponse = await fetch(
          `http://localhost:4000/get${activeTable
            .replace("_", "")
            .replace("_", "")}Details`
        );
        const updatedData = await updatedDataResponse.json();
        setTableData(updatedData);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Error updating data. Please try again.";
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
      setError("Error updating data. Please try again.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const determinePrimaryKeys = (tableName, formData) => {
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

  return (
    <div className="right-content">
      {error && <div className="error-message">{error}</div>}

      <h2>{activeTable.replace("_", " ")} Table Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table border="1">
            <thead>
              <tr>
                {Object.keys(tableData[0] || {}).map((columnName) => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, columnIndex) => (
                    <td key={columnIndex}>
                      {value &&
                      typeof value === "object" &&
                      value.type === "Buffer"
                        ? "XXXXX" // Display a placeholder for passwords
                        : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setFormType("add")}>Add</button>
            <button onClick={() => setFormType("delete")}>Delete</button>
            <button onClick={() => setFormType("update")}>Update</button>
          </div>

          {formType === "add" && (
            <AddForm
              tableData={Object.keys(tableData[0])}
              onAdd={handleAddData}
            />
          )}
          {formType === "delete" && (
            <DeleteForm
              tableData={Object.keys(tableData[0])}
              onDelete={handleDeleteData}
              activeTable={activeTable}
            />
          )}
          {formType === "update" && (
            <UpdateForm
              tableData={Object.keys(tableData[0])}
              onUpdate={handleUpdateData}
              primaryKeys={determinePrimaryKeys(activeTable)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Content;
