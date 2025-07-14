import React from 'react';
import { SelectFieldProps } from '../../types/Auth';
import styles from './SelectField.module.css';

const SelectField: React.FC<SelectFieldProps> = React.memo(({
    label,
    name,
    value,
    onChange,
    options,
    required = false
}) => {
    const fieldId = `field-${name}`;

    return (
        <div className={styles.fieldWrapper}>
            <label htmlFor={fieldId} className={styles.label}>
                {label}
            </label>
            <select
                id={fieldId}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={styles.select}
            >
                <option value="">{`Select ${label}`}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

SelectField.displayName = 'SelectField';

export default SelectField;
