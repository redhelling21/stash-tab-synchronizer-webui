// src/components/LandingPage.js
import React, { useState } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";
import './App.css'; // Make sure to import the CSS file for the component

interface Option {
  value: string;
  label: string;
}

interface SelectedInputValues {
  [key: string]: string;
};

const LandingPage = () => {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([]);
  const [selectedInputValues, setSelectedInputValues] = useState<SelectedInputValues>({});

  const options = [
    { value: "option1", label: "Strength" },
    { value: "option2", label: "iLvl" },
    { value: "option3", label: "Rarity" },
    { value: "option4", label: "Elder" }
  ];

  const handleInputChange = (optionValue: any, inputValue: any) => {
    setSelectedInputValues((prevInputValues) => ({
      ...prevInputValues,
      [optionValue]: inputValue
    }));
  };

  const formatOptionLabel = ({ value, label }: Option) => {
    const isSelected = selectedOptions.some((option) => option.value === value);
    if (isSelected) {
      return (
        <div>
          <span>{label}</span>
          <input
            type="text"
            value={selectedInputValues[value] || ""}
            onChange={(e) => handleInputChange(value, e.target.value)}
          />
        </div>
      );
    } else {
      return <div>{label}</div>;
    }
  };

  const handleOptionChange = (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
    setSelectedOptions(newValue);
    setSelectedInputValues((prevInputValues) => {
      const updatedInputValues = { ...prevInputValues };
      options.forEach((option) => {
        if (!selectedOptions.some((selectedOption) => selectedOption.value === option.value)) {
          updatedInputValues[option.value] = ""; // Reset input value
        }
      });
      return updatedInputValues;
    });
  };

  const handleButtonClick = () => {
    const selectedOptionValues = selectedOptions.map((option) => option.value);
    console.log("Selected Option Values:", selectedOptionValues);
    console.log("Input Values:", selectedInputValues);
  };

  return (
    <div className="landing-page">
      <header>
        <img src="https://www.goldkk.com/upload/20190513/6369336863346542192954949.png" alt="Logo" />
        <h1>Stash Tab synchronizer</h1>
      </header>
      <main>
        <div className="search-container">
          <Select
            isMulti
            options={options}
            formatOptionLabel={formatOptionLabel}
            value={selectedOptions}
            onChange={handleOptionChange}
            className="main-search-bar"
          />
          <button className="search-button">Search</button>
        </div>
        <div>
          <h2>Selected Values:</h2>
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.value}>
                <strong>{option.label}</strong>: {selectedInputValues[option.value] || ""}
              </li>
            ))}
          </ul>
        </div>
        <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
              <th>Column 3</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
              <td>Data 3</td>
              {/* Add more rows of data as needed */}
            </tr>
          </tbody>
        </table>
      </main>
      <footer>
        <p>v0.0.1</p>
      </footer>
    </div>
  );
};

export default LandingPage;
