import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./edit.module.scss";
export const EditCard = (props) => {
  const [editdata, setEditdata] = useState({
    title: "",
    author: "",
    file: props.data.file,
  });
  //   const [data, setData] = useState({ title: "", author: "", file: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [edit, setEdit] = useState(false);
  function changes(e) {
    setEditdata((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setEditdata((pre) => ({
      ...pre,
      file: file,
    }));

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      console.log(file);
    }
  }

  function editform(e) {
    e.preventDefault();
    setEdit(!edit);
  }

  const submit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", editdata.title);
    formData.append("author", editdata.author);
    formData.append("file", editdata.file);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    await axios
      .put(`http://localhost:8000/book/update/${props.data.id}`, formData, {
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
        setEdit(!edit);
        props.update();
      });
  };

  useEffect(() => {
    setEditdata((pre) => ({
      ...pre,
      title: props.data.title,
      author: props.data.author,
      file: props.data.file,
    }));
    setPreviewImage(`http://localhost:8000/${props.data.file}`);
    console.log(props.data.file);
  }, [props.data]);
  return (
    <div className={styles.form}>
      <form onSubmit={submit}>
        <div className={styles.img}>
          {edit && (
            <input
              type="file"
              name="file"
              onChange={(e) => handleFileChange(e)}
              disabled={!edit}
            />
          )}
          <div>
            <img src={previewImage} alt={props.data.title} />
          </div>
        </div>
        <div className={styles.content}>
          <div>
            <label>
              Title:
              <input
                type="text"
                placeholder="title"
                name="title"
                value={editdata.title}
                onChange={(e) => changes(e)}
                disabled={!edit}
              />
            </label>
            <label>
              Author:
              <input
                type="text"
                placeholder="author"
                name="author"
                value={editdata.author}
                onChange={(e) => changes(e)}
                disabled={!edit}
              />
            </label>
          </div>
          <div>
            {edit && <input type="submit" value="submit" />}
            {!edit && <button onClick={(e) => editform(e)}>Edit</button>}
            {edit && <button onClick={(e) => editform(e)}>cancel</button>}
          </div>
        </div>
      </form>
    </div>
  );
};
