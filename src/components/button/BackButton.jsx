import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

const BackButton = ({ variant }) => {
    const navigate = useNavigate();

    return (

        <Button
            onClick={() => navigate(-1)}
            variant={variant == 'outline' ? 'outline' : 'default'}
            className={variant == 'outline' ? 'gap-2 border-primary text-primary hover:bg-light-blue' : 'gap-2  '}
        >
            <ArrowLeft className="w-8 h-4" /> Back
        </Button>
    );
};

export default BackButton;