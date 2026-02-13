import { Input as ShadcnInput } from '@/components/ui/input';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Input = forwardRef(({ className, ...props }, ref) => {
    return <ShadcnInput ref={ref} className={className} {...props} />;
});

Input.displayName = 'Input';

Input.propTypes = {
    className: PropTypes.string,
};

export default Input;
