'use client';
import { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

interface AzureBlobStorageUploaderProps {
  ACCOUNT_STORAGE_NAME: string | undefined;
  SAS_TOKEN: string | undefined;
  CONTAINER_NAME: string | undefined;
}

const AzureBlobStorageUploader: React.FC<AzureBlobStorageUploaderProps> = ({
  ACCOUNT_STORAGE_NAME,
  SAS_TOKEN,
  CONTAINER_NAME,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const blobServiceClient = new BlobServiceClient(
      `https://${ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${SAS_TOKEN}`,
    );
    const containerClient = blobServiceClient.getContainerClient(
      `${CONTAINER_NAME}`,
    );
    const blobName = selectedFile.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      // Upload the file to Azure Blob Storage
      await blockBlobClient.uploadBrowserData(selectedFile);
      console.log('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default AzureBlobStorageUploader;
