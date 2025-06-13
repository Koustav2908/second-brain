import axios from "axios";
import { useEffect, useState } from "react";

interface DataType {
    msg?: string;
}

function App() {
    const [data, setData] = useState<DataType>({});

    const fetchAPI = async () => {
        try {
            const response = await axios.get<DataType>("/api/hello");
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <>
            <h1>Message from flask</h1>
            {data.msg && <p>{data.msg}</p>}
        </>
    );
}

export default App;
