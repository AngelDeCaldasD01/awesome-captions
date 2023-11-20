import { BlobServiceClient } from '@azure/storage-blob';

export async function connectionBlobFromFilename(filename: string) {
  console.log(filename);
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`,
  );

  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.CONTAINER_NAME}`,
  );
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  try {
    // Download the file to Azure Blob Storage
    const blockBlobDownload = await blockBlobClient.downloadToBuffer();
    console.log(blockBlobDownload);
    return blockBlobDownload;
  } catch (error) {
    throw new Error(`Error download file: ${error}`);
  }
}
