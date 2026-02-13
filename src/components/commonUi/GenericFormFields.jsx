/* eslint-disable no-unused-vars */
import Checkbox from '@/components/CustomUI/Checkbox';
import Input from '@/components/CustomUI/Input';
import Select from '@/components/CustomUI/Select';
import Textarea from '@/components/CustomUI/Textarea';
import { DateInput } from '@/components/ui/date-input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

/**
 * Autocomplete field component for customer selection
 */
const AutocompleteField = ({ field, placeholder, suggestions = [], onSelect, error }) => {
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(field.value || '');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        field.onChange(value);
    };

    const handleSelect = (value) => {
        setInputValue(value);
        field.onChange(value);
        setSuggestionsOpen(false);
        if (onSelect) onSelect(value);
    };

    const filteredSuggestions = suggestions?.filter((item) =>
        item?.toLowerCase()?.includes(inputValue?.toLowerCase())
    );

    return (
        <div className="relative">
            <Input
                {...field}
                value={inputValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onFocus={() => setSuggestionsOpen(true)}
                onBlur={() => setTimeout(() => setSuggestionsOpen(false), 200)}
                autoComplete="off"
                className="w-full"
            />
            {suggestionsOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-auto">
                    {filteredSuggestions.map((item, index) => (
                        <div
                            key={index}
                            className="p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                            onMouseDown={() => handleSelect(item)}
                        >
                            {item}
                        </div>
                    ))}
                    {filteredSuggestions.length === 0 && inputValue && (
                        <div
                            className="p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm text-primary font-medium"
                            onMouseDown={() => setSuggestionsOpen(false)}
                        >
                            Create &quot;{inputValue}&quot;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

AutocompleteField.propTypes = {
    field: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func,
    error: PropTypes.object,
};

/**
 * A generic component to render a form based on a configuration object.
 */
export const GenericFormFields = ({ control, errors, config }) => {
    const renderField = (fieldConfig) => {
        const {
            name,
            label,
            type,
            placeholder,
            rules,
            options,
            onSelect,
            disabled = false,
            suggestions = [],
            gridCols = '1',
        } = fieldConfig;
        const isRequired = rules?.required;

        // Helper to safely access nested error messages
        const getNestedError = (fieldName) => {
            const fieldNameParts = fieldName.replace(/\[(\d+)\]/g, '.$1').split('.');
            let error = errors;
            for (const part of fieldNameParts) {
                if (error && part in error) {
                    error = error[part];
                } else {
                    return null;
                }
            }
            return error;
        };
        const error = getNestedError(name);

        return (
            <div key={name} className="space-y-2">
                {type !== 'checkbox' && (
                    <Label htmlFor={name}>
                        {label} {isRequired && <span className="text-red-500">*</span>}
                    </Label>
                )}
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => {
                        switch (type) {
                            case 'select':
                                return (
                                    <Select
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            if (onSelect) onSelect(value);
                                        }}
                                        placeholder={placeholder}
                                        options={options?.map((option) => ({
                                            value: option.id,
                                            label: option.name,
                                        }))}
                                    />
                                );
                            case 'autocomplete':
                                return (
                                    <AutocompleteField
                                        field={field}
                                        placeholder={placeholder}
                                        suggestions={suggestions}
                                        onSelect={onSelect}
                                        error={error}
                                    />
                                );
                            case 'date':
                                return (
                                    <DateInput
                                        id={name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        disabled={disabled}
                                    />
                                );
                            case 'textarea':
                                return (
                                    <Textarea
                                        disabled={disabled}
                                        id={name}
                                        placeholder={placeholder}
                                        {...field}
                                    />
                                );
                            case 'checkbox':
                                return (
                                    <Checkbox
                                        disabled={disabled}
                                        id={name}
                                        checked={field.value || false}
                                        onChange={field.onChange}
                                        label={label}
                                    />
                                );
                            case 'radio':
                                return (
                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                                        {options?.map((option) => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={option.id} />
                                                <Label htmlFor={option.id}>{option.name}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                );
                            case 'switch':
                                return (
                                    <div className="flex items-center space-x-2 border p-3 rounded-lg border-gray-100 bg-gray-50/50">
                                        <Switch id={name} checked={field.value || false} onCheckedChange={field.onChange} />
                                        <Label htmlFor={name} className="cursor-pointer">{label}</Label>
                                    </div>
                                );
                            default:
                                return (
                                    <Input
                                        disabled={disabled}
                                        id={name}
                                        type={type}
                                        placeholder={placeholder}
                                        {...field}
                                    />
                                );
                        }
                    }}
                />
                {error && type !== 'checkbox' && (
                    <span className="text-red-500 text-sm">{error.message}</span>
                )}
                {error && type === 'checkbox' && (
                    <span className="text-red-500 text-sm block mt-1">{error.message}</span>
                )}
            </div>
        );
    };

    // Main layout logic for grouping fields
    const fieldGroups = [];
    for (let i = 0; i < config.length; ) {
        if (
            config[i].gridCols === '2' &&
            config[i + 1]?.gridCols === '2'
        ) {
            fieldGroups.push([config[i], config[i + 1]]);
            i += 2;
        } else {
            fieldGroups.push([config[i]]);
            i += 1;
        }
    }

    return (
        <>
            {fieldGroups.map((group, index) =>
                group.length > 1 ? (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField(group[0])}
                        {renderField(group[1])}
                    </div>
                ) : (
                    <div key={index}>{renderField(group[0])}</div>
                )
            )}
        </>
    );
};

// Define the shape of a single field config for PropTypes validation
const fieldConfigShape = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        'text',
        'email',
        'password',
        'select',
        'autocomplete',
        'date',
        'number',
        'textarea',
        'checkbox',
        'radio',
        'switch',
    ]).isRequired,
    placeholder: PropTypes.string,
    rules: PropTypes.object,
    onSelect: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.any.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    suggestions: PropTypes.arrayOf(PropTypes.string),
    gridCols: PropTypes.oneOf(['1', '2']),
    disabled: PropTypes.bool,
};

GenericFormFields.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    config: PropTypes.arrayOf(PropTypes.shape(fieldConfigShape)).isRequired,
};
