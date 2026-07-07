import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import styles from "./DropZoneCustom.module.css"
import { PrimaryButton } from '@fluentui/react'

interface SelectedFile {
    type: string,
    name: string,
    preview: string | ArrayBuffer | null
}


const DropZoneCustom = () => {
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const imageFileTypes = ['image/jpeg', 'image/png'];

    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        acceptedFiles.map((file) => {
            const reader = new FileReader;
            reader.onload = () => {
                setSelectedFiles((prevState) => [
                    ...prevState,
                    {type: file.type, name: file.name, preview: reader.result}
                ]);
            }

            reader.readAsDataURL(file);
            return file;
        });
    }, [])

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'text/html': ['.html', '.htm'],
            'application/pdf': ['.pdf']
        },
        onDrop,
        noDragEventsBubbling: true
    });

    const handleFileUpload = () => {
        acceptedFiles.forEach((file) => {

        });
    }

    return (
        <>
            <div {...getRootProps({ className: isDragActive ? styles['active-dropzone'] : styles.dropzone })} >
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag & drop some files here, or click to select files</p>
                }
            </div>
            <aside>
                {
                    selectedFiles && selectedFiles.map((file, index) => (
                        imageFileTypes.includes(file.type) ?
                            <img
                                src={file.preview as string}
                                width={100}
                                key={`${file.name}-${index}`}
                            />
                            :
                            <div key={`${file.name}-${index}`} className={styles['preview-non-image']}>
                                <object data={file.preview?.toString()} width={100} />
                                <span>{file.name}</span>
                            </div>
                    ))
                }

            </aside>
            <PrimaryButton onClick={handleFileUpload} className={styles.uploadBtn} text="Upload" />
        </>
    )
}

export default DropZoneCustom;