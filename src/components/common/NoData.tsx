import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import noDataImg from "@/assets/images/no-data.png";

function NoData() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center gap-2">
            <img src={noDataImg} alt="no data found" className="w-72" />
            <p className="text-primary-200">No data found</p>
            <Button onClick={() => navigate("/")}>Go Back to home</Button>
        </div>
    );
}

export default NoData;
