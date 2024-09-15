import React from "react";

const ImageUploader = ({ onSuccess }) => {
//   const [responseData, setResponseData] = useState(null);
//   const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3005/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const result = await response.json();
      onSuccess(`http://localhost:3005${result.filePath}`);
    } catch (err) {
    //   setError(err.message);
      onSuccess(null);
    }
  };

  return (
    <div style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
        }}>
        <input
            type="file"
            name="image"
            onChange={handleFileChange}
            id="fileInput"
            style={{ display: "none" }} // Hides the actual file input
        />
        <label htmlFor="fileInput" className="file-label"
             style={{
                position: 'absolute',
                left: 0, right: 0, top: 0, bottom: 0,
            }}>
        </label>
    </div>
  );
};

export default ImageUploader;