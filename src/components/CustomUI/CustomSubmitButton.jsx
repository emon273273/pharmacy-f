import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';

export const CustomSubmitButton = ({
    isLoading = false,
    disabled = false,
    label = 'Submit',
    loadingLabel = 'Submitting...',
    type = 'submit',
    variant = 'default',
    className = '',
}) => {
    return (
        <Button
            type={type}
            disabled={disabled || isLoading}
            variant={variant}
            className={className}
        >
            {isLoading ? loadingLabel : label}
        </Button>
    );
};

CustomSubmitButton.propTypes = {
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    loadingLabel: PropTypes.string,
    type: PropTypes.oneOf(['submit', 'button', 'reset']),
    variant: PropTypes.string,
    className: PropTypes.string,
};
