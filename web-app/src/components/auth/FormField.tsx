import React from 'react';
import { FormFieldProps } from '../../types/Auth';

const FormField: React.FC<FormFieldProps> = React.memo(({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    autoComplete
}) => {
    const fieldId = `field-${name}`;

    return (
        <div style={{ marginBottom: "20px" }}>
            <label
                htmlFor={fieldId}
                style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "rgba(81, 81, 81, 0.75)",
                }}
            >
                {label}
            </label>
            <input
                id={fieldId}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
                style={{
                    width: "100%",
                    color: "rgba(0, 0, 0, 0.75)",
                    backgroundColor: "rgba(235, 235, 235, 0.75)",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = "#2a41e8";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = "#dde2e5";
                }}
            />
        </div>
    );
});

FormField.displayName = 'FormField';

export default FormField;