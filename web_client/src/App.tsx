import axios from "axios";
import { useEffect, useState } from "react";

interface Slide {
    slide_number: number;
    content: string[];
}

interface DataType {
    content?: Slide[];
}

function App() {
    const [data, setData] = useState<DataType>({});

    // const fetchAPI = async () => {
    //     try {
    //         const response = await axios.get<DataType>("/api/hello");
    //         console.log(response.data);
    //         setData(response.data);
    //     } catch (error) {
    //         console.error("Error: ", error);
    //     }
    // };

    const fetchAnotherAPI = async () => {
        try {
            const response = await axios.get<DataType>("/api/extract");
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        fetchAnotherAPI();
    }, []);

    return (
        <>
            <h1>Slide Content</h1>
            {data.content ? (
                <div>
                    {data.content?.map((slide: Slide, index: number) => (
                        <div key={index}>
                            <h2>Slide {slide.slide_number}</h2>
                            <ul>
                                {slide.content.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default App;
