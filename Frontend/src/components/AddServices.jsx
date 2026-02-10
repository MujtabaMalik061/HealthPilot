import { Plus } from "lucide-react";
import * as LucideIcons from "lucide-react/dist/esm/icons";
import React, { createElement, useEffect, useState } from "react";
import { Input } from "./CustomComponents";
import "../assets/style/Services.css";
import { toast } from "sonner";
import {
  createServiceHelper,
  updateServiceHelper,
} from "../services/AdminServices";

const AddServices = ({
  disabled = false,
  data = null,
  setData,
  afterAction = null,
}) => {
  const [isAdd, setIsAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [finalIcon, setFinalIcon] = useState(null);
  const [sugestIcons, setSugestIcons] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data !== null) {
      setIsAdd(true);
      setTitle(data?.title || "");
      setDescription(data?.description || "");
      setFinalIcon(data?.icon || null);
      setIcon(data?.icon || "");
      setEdit(true);
    } else {
      setEdit(false);
      setData(null);
    }
  }, [data]);

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

  const validations = () => {
    if (!title) {
      toast.error("title is required.");
      return false;
    }
    if (!description) {
      toast.error("description is required.");
      return false;
    }
    if (!finalIcon) {
      toast.error("icon is required.");
      return false;
    }
    return true;
  };

  const handleCreateService = async () => {
    if (!validations) return;
    try {
      setLoading(true);
      await createServiceHelper({
        title,
        description,
        icon: finalIcon,
      });
      if (afterAction !== null) {
        afterAction();
      }
      handleClose();
      toast.success("service created successfully");
    } catch (err) {
      console.error("Failed to create service:", err);
      toast.error(err.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async () => {
    if (!validations) return;
    try {
      setLoading(true);
      await updateServiceHelper(data._id, {
        title,
        description,
        icon: finalIcon,
      });
      if (afterAction !== null) {
        afterAction();
      }
      handleClose();
      toast.success("service updated successfully");
    } catch (err) {
      console.error("Failed to update service:", err);
      toast.error(err.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setIsAdd(false);
    setTitle("");
    setDescription("");
    setIcon("");
    setFinalIcon(null);
    setSugestIcons([]);
    setEdit(false);
    setData(null);
  };

  return (
    <div className="add-services-container">
      <button
        className="add-services-model-open-btn"
        onClick={() => setIsAdd(true)}
        disabled={disabled}
      >
        <span className="icon">
          <Plus size={18} />
        </span>
        Add Services
      </button>
      {isAdd && (
        <div disabled={loading} onClick={handleClose} className="model-overlay">
          <div onClick={(e) => e.stopPropagation()} className="model-content">
            <div className="model-header">
              <h3 className="model-header-title">
                {edit ? "Edit" : "Add"} Service
              </h3>
              <button onClick={handleClose} className="model-header-close-btn">
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
                        <span className="icon">
                          <IconComponent size={20} />
                        </span>
                        <span>{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {finalIcon && (
                <div className="selected-icon-preview">
                  <span className="icon">
                    {createElement(LucideIcons[finalIcon], {
                      size: 18,
                    })}
                  </span>
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
              <div className="add-services-action-container">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="add-services-action-btn cencel"
                >
                  Cencel
                </button>
                <button
                  onClick={edit ? handleUpdateService : handleCreateService}
                  className="add-services-action-btn confirm"
                  disabled={loading}
                >
                  {edit && loading
                    ? "Updating..."
                    : !edit && loading
                      ? "Saving..."
                      : edit && !loading
                        ? "Update service"
                        : "Save service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddServices;
