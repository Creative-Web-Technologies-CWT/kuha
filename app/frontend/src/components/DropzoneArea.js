import React, { useState } from "react";
//import { DropzoneArea } from "material-ui-dropzone";

const DropzoneComponent = () => {
    const [files, setFiles] = useState([]);

    const handleChange = (newFiles) => {
        console.log(newFiles);
        setFiles(newFiles);
    };

    return "no drop zone installed!"
    //<DropzoneArea onChange={handleChange} />;
};

export default DropzoneComponent;
