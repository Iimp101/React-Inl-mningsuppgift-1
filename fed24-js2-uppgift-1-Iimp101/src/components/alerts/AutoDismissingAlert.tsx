import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";

interface AutoDismissingAlertProps {
    children: React.ReactNode;
    hideAfter: number;
    variant: string;
}

const AutoHideAlert: React.FC<AutoDismissingAlertProps> = ({ children, hideAfter, variant }) => {
    const [hide, setHide] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHide(true);
        }, hideAfter);
    }, [hideAfter]);

    return (
        <Alert show={!hide} variant={variant}>
            {children}
        </Alert>
    )
}

export default AutoHideAlert;