import axios from "axios";
import { useState } from "react";
import "./index.css";

function App() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [serverThumbnail, setServerThumbnail] = useState(null);

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
                {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total,
                            );
                            console.log(
                                `Прогресс загрузки: ${percentCompleted}%`,
                            );
                        }
                    },
                },
            );

            setServerThumbnail(response.data.thumbnail_url);
            setPreviewUrl(null);
            e.target.reset();
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

            {serverThumbnail && (
                <div>
                    <p>Успешно загружено</p>
                    <p>Миниатюра от сервера:</p>
                    <img src={serverThumbnail} alt="Миниатюра от сервера" />
                </div>
            )}
        </>
    );
}

export default App;
