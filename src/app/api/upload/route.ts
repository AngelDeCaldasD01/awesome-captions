import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';

export async function POST(req: any, res: any) {
  const formData = await req.formData();
  const file = formData.get('selectedFile');
  const { name, type } = file;

  const data = await file.arrayBuffer();

  const sharedKeyCredential = new StorageSharedKeyCredential(
    `${process.env.ACCOUNT_STORAGE_NAME}`,
    `${process.env.ACCOUNT_KEY}`,
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net`,
    sharedKeyCredential,
  );

  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.CONTAINER_NAME}`,
  );

  generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      blobName: name,
      permissions: BlobSASPermissions.parse('racwd'),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400),
    },
    sharedKeyCredential,
  );

  const blockBlobClient = containerClient.getBlockBlobClient(name);
  const { url } = blockBlobClient;

  try {
    // Upload the file to Azure Blob Storage
    await blockBlobClient.uploadData(data);
  } catch (error) {
    throw new Error(`Error uploading file: ${error}`);
  }

  return Response.json({ name, type, url });
}
