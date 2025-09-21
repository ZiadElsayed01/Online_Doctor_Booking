import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

type AlertMsgProps = {
    message: string;
};

function AlertMsg({ message }: AlertMsgProps) {
    return (
        <Alert
            variant="destructive"
            className="w-fit border-0 p-0 text-error-500"
        >
            <AlertCircleIcon />
            <AlertTitle>{message}</AlertTitle>
        </Alert>
    );
}

export default AlertMsg;
