import React, { useRef, useState } from 'react';
import axios from 'axios';
import './FileUploader.css'; // Import the CSS file for the spinner

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [showEditButton, setShowEditButton] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading animation

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        setMessage('הקובץ בתהליך סריקה');
        setLoading(true); // Start loading animation

        const response = await fetch('http://localhost:7558/uploadFile', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.text();
          setMessage('הקובץ נסרק בהצלחה');
          setResponse(result);
          setShowEditButton(true); // Show the edit button if the file was successfully processed
        } else {
          const errorMessage = 'Failed to upload file';
          console.error(errorMessage);
          setMessage('בעיה בסריקת הקובץ');
          setResponse(errorMessage);
          setShowEditButton(true); // Show the edit button if there was an error
        }
      } catch (error) {
        const errorMessage = 'Error occurred while uploading file';
        console.error('Error:', error);
        setMessage('בעיה בהעלאת הקובץ');
        setResponse(errorMessage);
        setShowEditButton(true); // Show the edit button if there was an error
      } finally {
        setLoading(false); // Stop loading animation
      }
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    // Send the updated content to the server
    axios.post('http://localhost:7558/save', response, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then(response => {
        console.log('File updated successfully:', response.data);
        setResponse('');
        setMessage("הפעולה הסתיימה בהצלחה - הקובץ הסופי ממוקם בתקיית הפרויקט");
      })
      .catch(error => {
        console.error('There was an error updating the file!', error);
      });
  };

  return (
    <>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button onClick={handleFileUpload}>בחר קובץ לסריקה</button>
      <div className="response">
        <pre>{message}</pre>
      </div>

      {loading && (
        <div className="loading-spinner"></div>
      )}

      {
        response && (
          <div className="edit">
            <textarea
              className="text-editor"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows="50"
              cols="300"
            />
            <button onClick={handleSave}>לשמירת השינויים</button>
          </div>
        )
      }
    </>
  );
};

export default FileUploader;
