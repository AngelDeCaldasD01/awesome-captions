import { BlobServiceClient } from '@azure/storage-blob';

export async function POST(req: any, res: any) {
  const formData = await req.formData();
  const file = formData.get('selectedFile');
  const { name, type } = file;
  const data = await file.arrayBuffer();

  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`,
  );
  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.CONTAINER_NAME}`,
  );
  const blockBlobClient = containerClient.getBlockBlobClient(name);

  try {
    // Upload the file to Azure Blob Storage
    await blockBlobClient.uploadData(data);
  } catch (error) {
    throw new Error(`Error uploading file: ${error}`);
  }

  return Response.json(res);
}
