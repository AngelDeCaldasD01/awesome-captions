import { BlobServiceClient } from '@azure/storage-blob';

export async function GET(req: any) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get('filename');

  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`,
  );

  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.CONTAINER_NAME}`,
  );

  const blockBlobClient = containerClient.getBlockBlobClient(`${filename}`);

  let blockBlobDownload;
  try {
    // Download the file to Azure Blob Storage
    blockBlobDownload = await blockBlobClient.downloadToBuffer();
  } catch (error) {
    throw new Error(`Error download file: ${error}`);
  }

  return Response.json({
    file: blockBlobDownload,
  });
}
