import React, { useState } from "react";

import styles from "./Upload.module.css";

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isAdvancedUpload, setIsAdvancedUpload] = useState<boolean>(
        "draggable" in document.createElement("div") && "FormData" in window && "FileReader" in window
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setProgress(0);
            setErrorMessage("");
        }
    };

    const handleUpload = () => {
        if (file) {
            let width = 0;
            const intervalId = setInterval(() => {
                if (width >= 390) {
                    clearInterval(intervalId);
                } else {
                    width += 5;
                    setProgress(width);
                }
            }, 50);
        } else {
            setErrorMessage("Please select a file first");
        }
    };

    const handleCancelAlert = () => {
        setErrorMessage("");
    };

    const handleRemoveFile = () => {
        setFile(null);
        setProgress(0);
        setErrorMessage("");
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Update UI for dragover event
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            setProgress(0);
            setErrorMessage("");
        }
    };

    return (
        <form className="form-container" encType="multipart/form-data">
            <div className="upload-files-container">
                <div className="drag-file-area" onDragOver={handleDragOver} onDrop={handleDrop}>
                    {/* Other JSX for the drag file area */}
                </div>
                <span className="cannot-upload-message">
                    {errorMessage}{" "}
                    <span className="material-icons-outlined cancel-alert-button" onClick={handleCancelAlert}>
                        cancel
                    </span>
                </span>
                <div className="file-block">
                    {/* Other JSX for the file block */}
                    <div className="progress-bar" style={{ width: `${progress}px` }} />
                </div>
                <button type="button" className="upload-button" onClick={handleUpload}>
                    Upload
                </button>
            </div>
        </form>
    );
};

export default FileUploader;
