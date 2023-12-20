import { BlobSASPermissions, BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';

export async function GET(req: any) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get('filename');

  const sharedKeyCredential = new StorageSharedKeyCredential(`${process.env.ACCOUNT_STORAGE_NAME}`, `${process.env.ACCOUNT_KEY}`);

  const blobServiceClient = new BlobServiceClient(`https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net`, sharedKeyCredential);

  const containerClient = blobServiceClient.getContainerClient(`${process.env.CONTAINER_NAME}`);

  generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      blobName: `${filename}`,
      permissions: BlobSASPermissions.parse('racwd'),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400),
    },
    sharedKeyCredential,
  );

  const blockBlobClient = containerClient.getBlockBlobClient(`${filename}`);

  let blockBlobDownload;
  try {
    blockBlobDownload = await blockBlobClient.downloadToBuffer();
  } catch (error) {
    throw new Error(`Error download file: ${error}`);
  }

  return Response.json({
    file: blockBlobDownload,
    url: blockBlobClient.url,
  });
}
