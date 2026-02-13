import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import PropTypes from 'prop-types';

const Checkbox = ({ id, checked, onChange, label, disabled = false }) => {
    return (
        <div className="flex items-center space-x-2">
            <ShadcnCheckbox
                id={id}
                checked={checked}
                onCheckedChange={onChange}
                disabled={disabled}
            />
            {label && <Label htmlFor={id} className="cursor-pointer">{label}</Label>}
        </div>
    );
};

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Checkbox;
