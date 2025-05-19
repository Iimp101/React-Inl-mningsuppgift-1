import Alert from "react-bootstrap/Alert";

interface ErrorAlertProps {
    children: React.ReactNode;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ children }) => {
    return (
        <Alert variant="danger">
            {children}
        </Alert>
    )
}

export default ErrorAlert;