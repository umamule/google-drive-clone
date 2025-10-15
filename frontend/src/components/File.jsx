import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import "./file.scss";

import { useNavigate, useParams } from "react-router-dom";
import { url } from "../utils/url";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const File = () => {
  // const [files,setFiles] = useState(null)
  // const[gets,setGet] = useState(null)

  const { folderId } = useParams();

  const [file, setFile] = useState(null);

  const [selectImg, setSelectImage] = useState("");
  const [fileName, setFileName] = useState(null);

  const [dbFile, setDbFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [err, setError] = useState("");

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  // ... (Commented out old code remains here)

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(url + "/files/getfiles/" + folderId);

        setDbFile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFiles();
  }, [folderId, reducerValue]);

  const handleSub = async () => {
    setFileName(selectImg.name);
    
    if (selectImg.size < 10000000) {
      try {
        const load = toast.loading("Photo uploading", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        const formData = new FormData();
        setUploading(true);
        
        formData.append("file", selectImg);
        formData.append("upload_preset", "dsrtkzf0");
        const data = await axios.post(
          "https://api.cloudinary.com/v1_1/dgoksuam1/image/upload",
          formData
        );
        setFile(data.data.secure_url);

        console.log(data);

        setTimeout(async () => {
          if (folderId) {
            const response = await axios.post(url + "/files/createFiles", {
              file: data.data.secure_url,
              fileName: selectImg.name,
              folderId,
            });
            console.log(response);
            setUploading(false);
            toast.dismiss(load);
            toast.success("Photo uploaded", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });

            forceUpdate();
          } else {
            alert("Error occur while uploading file");
          }
        }, 1000);
      } catch (error) {
        console.log(error.message);

        setError("Please upload again");
      }
    } else {
      toast.error("Picture size is greater than 10MB", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      
    }
  };

  // NEW/MODIFIED: Download Handler (Simplified for Backend Redirect)
  const handleDownload = (fileId, fileName) => {
    // 1. Construct the URL to your backend endpoint.
    const downloadUrl = `${url}/files/downloadFile/${fileId}`;

    // 2. Open the URL in a new window. The browser will hit the backend,
    // which redirects to Cloudinary, forcing the file download.
    window.open(downloadUrl, '_blank');

    toast.info(`Download for ${fileName} initiated.`, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
};


  const handleDelete = async (e, id) => {
    e.preventDefault();

    try {
      const conformation = confirm("Do you want to delete this photo??");
      if (conformation) {
        const response = await axios.delete(
          `${url}/files/deleteFile/${id}` 
        );
        toast.success("Photo deleted", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(response);
        setTimeout(() => {
          forceUpdate();
        }, 3000);
      } else {
        toast.warning("Process cancelled", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="file">
        <ToastContainer />
      
      <div className="uploader">
        <span>Upload photo</span>
        
        <br />
        <input
          type="file"
          onChange={(e) => {
            setSelectImage(e.target.files[0]);
          }}
        />
        <button onClick={handleSub}>Upload</button>
      </div>
      {uploading ? "Photo uploading" : ""}
      {err && err}
      <p style={{marginBottom:"1rem",color:"grey"}}>Please upload picture which has size less than 10MB</p>
      <div className="images">
        {dbFile.map((db) => (
          <div className="image" key={db._id}>
            <div className="crud">
              {/* DOWNLOAD BUTTON: Calls the simplified handleDownload */}
             <span
    className="material-symbols-outlined"
    title="Download"
    // This onClick event triggers the process
    onClick={() => handleDownload(db._id, db.fileName)}
>
    download
</span>
              
              <span
                className="material-symbols-outlined"
                title="Delete"
                onClick={(e) => handleDelete(e, db._id)}
              >
                delete
              </span>
            
            </div>
            <img src={db.file} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default File;