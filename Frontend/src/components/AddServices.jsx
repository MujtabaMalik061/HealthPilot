import { Plus } from "lucide-react";
import * as LucideIcons from "lucide-react/dist/esm/icons";
import React, { createElement, useState } from "react";
import { Input } from "./CustomComponents";

const AddServices = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [finalIcon, setFinalIcon] = useState(null);
  const [sugestIcons, setSugestIcons] = useState([]);

  const handleSugestIcon = (value) => {
    setIcon(value);

    if (!value) {
      setSugestIcons([]);
      return;
    }

    const matches = Object.keys(LucideIcons)
      .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 20);

    setSugestIcons(matches);
  };

  return (
    <div className="add-services-container">
      <button
        className="add-services-model-open-btn"
        onClick={() => setIsAdd(true)}
      >
        <span className="icon">
          <Plus />
        </span>
        Add Services
      </button>
      {isAdd && (
        <div onClick={() => setIsAdd(false)} className="model-overlay">
          <div onClick={(e) => e.stopPropagation()} className="model-content">
            <div className="model-header">
              <h3 className="model-header-title">Add Service</h3>
              <button
                onClick={() => setIsAdd(false)}
                className="model-header-close-btn"
              >
                ×
              </button>
            </div>
            <div className="model-content-container">
              <Input
                label="Title"
                value={title}
                setValue={setTitle}
                placeholder="Add title of Service"
              />
              <Input
                label="Icon"
                value={icon}
                setValue={handleSugestIcon}
                placeholder="Search icon (e.g. heart, pill)"
              />

              {sugestIcons.length > 0 && (
                <div className="icon-suggestion-container">
                  {sugestIcons.map((iconName) => {
                    const IconComponent = LucideIcons[iconName];
                    if (!IconComponent) return null;

                    return (
                      <button
                        key={iconName}
                        className="icon-suggestion-item"
                        onClick={() => {
                          setFinalIcon(iconName);
                          setIcon(iconName);
                          setSugestIcons([]);
                        }}
                      >
                        <IconComponent size={20} />
                        <span>{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {finalIcon && (
                <div className="selected-icon-preview">
                  {createElement(LucideIcons[finalIcon], {
                    size: 28,
                  })}
                  <span>{finalIcon}</span>
                </div>
              )}

              <Input
                label="Description"
                value={description}
                setValue={setDescription}
                placeholder="Add description of Service"
                type="textArea"
              />
              <div className="">
                <button>Cencel</button>
                <button>Save service</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddServices;
