import { useEffect, useState } from "react";
import { serverUrl } from "../constants/constants";

function ReceiveData(resource: string) {

    const serverApi = serverUrl + resource;
    const [backendData, setBackendData] = useState([]);

    useEffect(() => {
        fetch(serverApi)
            .then(
                res => {
                    return res.json()
                }
            ).then(
                data => {
                    setBackendData(data.data);
                }
            ).catch((err) => {
                console.log(err.message);
            });
    }, [backendData]);

    return (backendData);
}

export default ReceiveData;