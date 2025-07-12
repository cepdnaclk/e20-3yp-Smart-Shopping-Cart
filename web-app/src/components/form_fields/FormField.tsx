import React from 'react';
import { FormFieldProps } from '../../types/Auth'; // Assuming this path is correct

const FormField: React.FC<FormFieldProps> = React.memo(({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    autoComplete,
    required = false // Added required prop
}) => {
    const fieldId = `field-${name}`;

    const inputStyles: React.CSSProperties = {
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
    };

    const labelStyles: React.CSSProperties = {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "500",
        color: "rgba(81, 81, 81, 0.75)",
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <label
                htmlFor={fieldId}
                style={labelStyles}
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
                required={required}
                style={inputStyles}
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
