import React, { useState, useRef  } from 'react';
import { FaFileUpload } from 'react-icons/fa';
import { Text } from "@fluentui/react";
import { uploadFile } from "../../api";
import styles from "./UploadButton.module.css";

interface Props {
  className?: string;
  onClick: () => void;
}
export const UploadButton= ({ className, onClick }: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setSelectedFile(file);
        
      }
    };
  
    const handleUploadClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger click event on hidden input
      }
    };
  
    const handleUpload = () => {
      if (selectedFile) {
        // Here you can perform the upload logic using the selectedFile
        console.log('Uploading:', selectedFile);
        // Reset selected file after upload
        setSelectedFile(null);
      }
    };
  
    return (
      <div className={`${styles.container} ${className ?? ""}`} onClick={handleUploadClick}>
        <FaFileUpload
         />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Text className={styles.container}>{"Upload"}</Text>
      </div>
    );
  };
  
  export default UploadButton;
