import axios from "axios";
import { useState } from "react";
import "./index.css"

function App() {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            const localUrl = URL.createObjectURL(file);
            setPreviewUrl(localUrl);
        } else {
            setPreviewUrl(null);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
            const response = await axios.post(
                "http://localhost:8000/upload",
                formData,
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    name="file"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                />
                <button type="submit">Отправить</button>
            </form>

            {previewUrl && (
                <div>
                    <p>Лолкальный предпросмотр:</p>
                    <img src={previewUrl} alt="Предпросмотр" />
                </div>
            )}
        </>
    );
}

export default App;
