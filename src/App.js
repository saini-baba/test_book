import "./App.scss";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { EditCard } from "./component/EditCard";
function App() {
  const [data, setData] = useState({ title: "", author: "", file: "" });
  const [carddata, setCarddata] = useState([]);
  const fileInputRef = useRef(null);
  function changes(e) {
    setData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  }

  function handleFileChange(e) {
    setData((pre) => ({
      ...pre,
      file: e.target.files[0],
    }));
  }

  const submit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("file", data.file);
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    await axios
      .post("http://localhost:8000/book/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setData((pre) => ({
          ...pre,
          title: "",
          author: "",
          file: null,
        }));
        fileInputRef.current.value = "";
        fetchData();
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/book/data");
      setCarddata(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setData({ title: "", author: "", file: "" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="book">
      <div className="heading">
        <div className="container text">
          <h1>Books</h1>
        </div>
      </div>
      <div className="addform">
        <form onSubmit={(e) => submit(e)}>
          <h2>Add Book</h2>
          <div>
            <label>
              Title:
              <input
                type="text"
                placeholder="title"
                name="title"
                value={data.title}
                onChange={(e) => changes(e)}
              />
            </label>
            <label>
              Author:
              <input
                type="text"
                placeholder="author"
                name="author"
                value={data.author}
                onChange={(e) => changes(e)}
              />
            </label>
            <label>
              Book Image:
              <input
                type="file"
                name="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
              />
            </label>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </div>
        </form>
      </div>
      <div className="container card">
        {carddata.map((item) => (
          <div key={item.id}>
            <EditCard data={item} update={fetchData} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
