import { useState } from "react";
import axios from "../../services/axios";

const ImageUpload = ({ galleryId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) return;

    const MAX_SIZE_MB = 20;

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadMessage(`File too large (max ${MAX_SIZE_MB}MB)`);
      setFile(null);
      return;
    }

    if (selectedFile) {
      setUploadMessage(
        `File: ${selectedFile.name} | Type: ${selectedFile.type} | Size: ${(
          selectedFile.size /
          1024 /
          1024
        ).toFixed(2)} MB`,
      );
    }
  };

  const uploadImage = async () => {
    if (!file) {
      setUploadMessage("Please select a file.");
      return;
    }

    if (!galleryId && galleryId != 0) {
      setUploadMessage("Please select a gallery.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("gallery_id", galleryId);

    let timeoutId;

    try {
      setUploading(true);
      setUploadMessage("Uploading... 0%");

      // ✅ fallback timeout (prevents permanent stuck state)
      timeoutId = setTimeout(() => {
        setUploadMessage("Upload taking too long ❌");
        setUploading(false);
      }, 45000);

      await axios.post("/api/images/upload.php", formData, {
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadMessage(`Uploading... ${percent}%`);
          }
        },
      });

      clearTimeout(timeoutId);

      setUploadMessage("Upload complete");
      setFile(null);

      if (onUploadSuccess) {
        console.log("Calling refresh...");
        await onUploadSuccess();
      }

      document.querySelector('input[type="file"]').value = "";

      // ✅ optional: auto-clear success message
      setTimeout(() => {
        setUploadMessage("");
      }, 3000);
    } catch (error) {
      clearTimeout(timeoutId);

      console.error("Upload error:", error);

      if (error.response?.status === 413) {
        setUploadMessage("File too large. ❌");
      } else if (error.code === "ECONNABORTED") {
        setUploadMessage("Upload timed out ❌");
      } else {
        setUploadMessage(error.response?.data?.message || "Upload failed ❌");
      }
    } finally {
      setUploading(false); // ✅ ALWAYS runs if request resolves
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileSelect} />
      <button
        className="btn btn-primary"
        onClick={uploadImage}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadMessage && <div className="upload-status">{uploadMessage}</div>}
    </>
  );
};

export default ImageUpload;
