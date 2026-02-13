import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Textarea = forwardRef(({ className, ...props }, ref) => {
    return <ShadcnTextarea ref={ref} className={className} {...props} />;
});

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
    className: PropTypes.string,
};

export default Textarea;
