// AddForm.js
import React, { useState } from "react";

const AddForm = ({ tableData, onAdd }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (columnName, value) => {
    // Split columnName by '.' to handle nested objects
    const keys = columnName.split(".");
    if (keys.length === 1) {
      // If not nested, update formData directly
      setFormData((prevData) => ({
        ...prevData,
        [columnName]: keys[0].toLowerCase().includes("date")
          ? value
          : value.trim(),
      }));
    } else {
      // If nested, update nested object in formData
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...(prevData[keys[0]] || {}),
          [keys[1]]: keys[1].toLowerCase().includes("date")
            ? value
            : value.trim(),
        },
      }));
    }
  };

  const handleAdd = () => {
    // Add logic to handle adding data
    onAdd(formData);
    setFormData({});
  };

  return (
    <form>
      {tableData.map(
        (column) =>
          // Don't render input field for ComputedColumn
          column !== "ComputedColumn" && (
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
          )
      )}
      <button type="button" onClick={handleAdd}>
        Add Data
      </button>
    </form>
  );
};

export default AddForm;
