import React from 'react';
import { FormFieldProps } from '../../types/Auth';
import styles from './FormField.module.css';

const FormField: React.FC<FormFieldProps> = React.memo(({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    autoComplete,
    required = false
}) => {
    const fieldId = `field-${name}`;

    return (
        <div className={styles.fieldWrapper}>
            <label htmlFor={fieldId} className={styles.label}>
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
                className={styles.input}
            />
        </div>
    );
});

FormField.displayName = 'FormField';

export default FormField;
