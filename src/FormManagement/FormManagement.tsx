import "./FormManagement.css"

import React, { useState, useEffect } from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface DynamicOptions {
  promise?: (formData: Record<string, any>) => Promise<Option[]>;
}

export interface Dependency {
  field: string;
  condition: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'exists';
  value?: any;
}

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  greaterThan?: number;
  lessThan?: number;
  custom?: (value: any, formData: Record<string, any>) => boolean | string;
}

export interface FieldMetadata {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'file' | 'date' | 'custom';
  required?: boolean | ((formData: Record<string, any>) => boolean);
  options?: Option[];
  dynamicOptions?: DynamicOptions;
  dependencies?: Dependency[] | ((formData: Record<string, any>) => Dependency[]);
  validations?: ValidationRules;
  customComponent?: (props: any) => React.ReactNode;
}

export interface FormMetadata {
  fields: FieldMetadata[];
}

interface FormControlProps {
  field: FieldMetadata;
  value: any;
  onChange: (value: any) => void;
  options?: Option[];
  error?: string;
}

const FormControl: React.FC<FormControlProps> = ({ field, value, onChange, options, error }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let newValue: any;

    if (field.type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (field.type === 'file') {
      newValue = (e.target as HTMLInputElement).files?.[0] || null;
    } else {
      newValue = e.target.value;
    }

    onChange(newValue);
  };

  return (
    <div className="form-group">
      <label className="form-label">{field.label}</label>

      {field.type === 'text' || field.type === 'number' ? (
        <input className="form-input" type={field.type} value={value || ''} onChange={handleInputChange} />
      ) : field.type === 'checkbox' ? (
        <input className="form-checkbox" type="checkbox" checked={value || false} onChange={handleInputChange} />
      ) : field.type === 'select' ? (
        <select className="form-input" value={value || ''} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {(options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === 'file' ? (
        <input className="form-input" type="file" onChange={handleInputChange} />
      ) : field.type === 'date' ? (
        <input className="form-input" type="date" value={value || ''} onChange={handleInputChange} />
      ) : field.type === 'custom' && field.customComponent ? (
        field.customComponent({ value, onChange })
      ) : null}

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export interface FormManagementProps {
  metadata: FormMetadata;
  initialValues?: Record<string, any>;
  dynamicOptionsFromParent?: Record<string, Option[]>;
  onSubmit: (data: any) => void;
}

export const FormManagement: React.FC<FormManagementProps> = ({ metadata, initialValues = {}, dynamicOptionsFromParent, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Option[]>>(dynamicOptionsFromParent || {});

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData((prev) => ({ ...initialValues, ...prev }));
  }, [initialValues]);

  useEffect(() => {
    setDynamicOptions((prev) => ({ ...prev, ...dynamicOptionsFromParent }));
  }, [dynamicOptionsFromParent]);

  useEffect(() => {
    metadata.fields.forEach((field) => {
      if (field.dynamicOptions?.promise) {
        field.dynamicOptions.promise(formData).then((options) => {
          setDynamicOptions((prev) => ({ ...prev, [field.id]: options }));
        });
      }
    });
  }, [formData]);

  const validateField = (field: FieldMetadata, value: any): string => {
    const isRequired = typeof field.required === 'function' ? field.required(formData) : field.required;

    if (isRequired && (value === '' || value === undefined || value === null || value === false)) {
      return `${field.label} is required.`;
    }

    if (field.validations) {
      if (field.validations.minLength && value.length < field.validations.minLength) {
        return `${field.label} must be at least ${field.validations.minLength} characters.`;
      }
      if (field.validations.maxLength && value.length > field.validations.maxLength) {
        return `${field.label} must be at most ${field.validations.maxLength} characters.`;
      }
      if (field.validations.pattern && !field.validations.pattern.test(value)) {
        return `${field.label} is not valid.`;
      }
      if (field.validations.greaterThan !== undefined && value <= field.validations.greaterThan) {
        return `${field.label} must be greater than ${field.validations.greaterThan}.`;
      }
      if (field.validations.lessThan !== undefined && value >= field.validations.lessThan) {
        return `${field.label} must be less than ${field.validations.lessThan}.`;
      }
      if (field.validations.custom) {
        const customValidation = field.validations.custom(value, formData);
        if (customValidation !== true) return customValidation as string;
      }
    }
    return '';
  };


  const isVisible = (field: FieldMetadata) => {
    const dependencies =
      typeof field.dependencies === 'function' ? field.dependencies(formData) : field.dependencies;

    if (!dependencies) return true;
    return dependencies.every((dep) => {
      switch (dep.condition) {
        case 'equals':
          return formData[dep.field] === dep.value;
        case 'notEquals':
          return formData[dep.field] !== dep.value;
        case 'greaterThan':
          return formData[dep.field] > dep.value;
        case 'lessThan':
          return formData[dep.field] < dep.value;
        case 'exists':
          return !!formData[dep.field];
        default:
          return true;
      }
    });
  };

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [id]: value };

      // Revalidate all required fields dynamically
      const fieldMeta = metadata.fields.find((f) => f.id === id);
      if (fieldMeta) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: validateField(fieldMeta, value),
        }));
      }

      return updatedData;
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    metadata.fields.forEach((field) => {
      if (isVisible(field)) {
        const errorMsg = validateField(field, formData[field.id]);
        if (errorMsg) {
          newErrors[field.id] = errorMsg;
        }
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {metadata.fields.map((field) =>
        isVisible(field) ? (
          <FormControl
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleChange(field.id, value)}
            options={field.options || dynamicOptions[field.id]}
            error={errors[field.id]}
          />
        ) : null
      )}
      <button className="form-button" type="submit">Submit</button>
    </form>
  );
};
