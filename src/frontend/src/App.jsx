import axios from "axios";

function App() {
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
        <form onSubmit={onSubmit}>
            <input name="file" type="file" accept="image/png, image/jpeg" />
            <button type="submit">Отправить</button>
        </form>
    );
}

export default App;
