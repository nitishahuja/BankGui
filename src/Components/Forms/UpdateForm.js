import React, { useState } from "react";

const UpdateForm = ({ tableData, onUpdate, primaryKeys }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (columnName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [columnName]: value,
    }));
  };

  const handleUpdate = () => {
    console.log(formData);
    onUpdate(formData);
    // setFormData({});
  };

  return (
    <form>
      {tableData.map((column) =>
        // Skip rendering the input field for ComputedColumn
        column.toLowerCase() === "computedcolumn" ? null : (
          <div key={column}>
            <label htmlFor={column}>
              {column.replace("_", " ").replace("_", " ").replace("_", " ")}:{" "}
            </label>
            <input
              type={column.toLowerCase().includes("date") ? "date" : "text"} // Set input type dynamically
              id={column}
              name={column}
              value={formData[column] || ""}
              onChange={(e) => handleInputChange(column, e.target.value)}
            />
          </div>
        )
      )}
      <button type="button" onClick={handleUpdate}>
        Update Data
      </button>
    </form>
  );
};

export default UpdateForm;
