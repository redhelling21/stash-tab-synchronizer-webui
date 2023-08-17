// src/components/LandingPage.js
import React, { useState, useEffect } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";
import './App.css'; // Make sure to import the CSS file for the component

interface LocalOption {
  value: string;
  label: string;
  group: string;
  type: string;
}

interface FetchedOption {
  fullName: string;
  group: string;
  type: string;
}

interface SelectedInputValues {
  [key: string]: string;
};

const LandingPage = () => {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<LocalOption>>([]);
  const [selectedInputValues, setSelectedInputValues] = useState<SelectedInputValues>({});
  const [options, setOptions] = useState<LocalOption[]>([]);
  const [groupedOptions, setGroupedOptions] = useState<{ label: string; options: LocalOption[] }[]>([]);

  useEffect(() => {
    // Fetch data from the external API
    fetch('https://localhost:7017/api/Fields/GetAllFields')
      .then(response => response.json())
      .then((data: FetchedOption[]) => {
        const transformed = data.map(item => ({
          value: item.fullName,
          label: item.fullName.includes('.') ? item.fullName.split('.').slice(1).join('.') : item.fullName,
          group: item.group.replace(/Comparable/, '').replace(/Searchable/, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
          type: item.type
        }));
        setOptions(transformed);
        const groups: { label: string; options: LocalOption[] }[] = [];
        transformed.forEach(option => {
          const groupIndex = groups.findIndex(group => group.label === option.group);
          if (groupIndex !== -1) {
            groups[groupIndex].options.push(option);
          } else {
            groups.push({
              label: option.group,
              options: [option]
            });
          }
        });
        setGroupedOptions(groups);
      })
      .catch(error => {
        console.error('Error fetching options:', error);
      });
  }, []);

  

  

  const handleInputChange = (optionValue: any, inputValue: any) => {
    setSelectedInputValues((prevInputValues) => ({
      ...prevInputValues,
      [optionValue]: inputValue
    }));
  };

  const formatOptionLabel = ({ value, label }: LocalOption) => {
    const isSelected = selectedOptions.some((option) => option.value === value);
    if (isSelected) {
      return (
        <div className="multi-select-item">
          <span className="multi-select-item-label">{label}</span>
          <input
            className="multi-select-item-input"
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

  const handleOptionChange = (newValue: MultiValue<LocalOption>, actionMeta: ActionMeta<LocalOption>) => {
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
            options={groupedOptions}
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
