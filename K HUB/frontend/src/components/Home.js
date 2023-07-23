import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import './home.css';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', selectedFile);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData);
      console.log(response.data);

      if (response.data.success) {
        // Show success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Saved Successfully',
          text: response.data.message,
        }).then(() => {
          // Navigate to PieChart page after successful upload
          navigate('/result');
        });
      } else {
        // Show error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error uploading file', error);

      // Show error SweetAlert if there's an issue with the request
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to upload file. Please try again later.',
      });
    }
  };

  return (
    <form className="form-container" encType="multipart/form-data">
      <div className="upload-files-container">
        <div className="drag-file-area">
          <span className="material-icons-outlined upload-icon">file_upload</span>
          <h3 className="dynamic-message">Drag &amp; drop any file here</h3>
          <label className="label">
            or
            <span className="browse-files">
              <input
                type="file"
                className="default-file-input"
                onChange={handleFileChange}
              />
              <span className="browse-files-text">browse file</span>
              <span>from device</span>
            </span>
          </label>
        </div>
        <span className="cannot-upload-message">
          <span className="material-icons-outlined">error</span>
          Please select a file first
          <span className="material-icons-outlined cancel-alert-button">
            cancel
          </span>
        </span>
        <div className="file-block">
          <div className="file-info">
            <span className="material-icons-outlined file-icon">description</span>
            <span className="file-name"></span> |
            <span className="file-size"></span>
          </div>
          <span className="material-icons remove-file-icon">delete</span>
          <div className="progress-bar"></div>
        </div>
        <button
          type="button"
          className="upload-button"
          onClick={handleFileUpload}
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default Home;
