## Upload file in Azure Blob

There are different ways to upload a file, this way you have to generate a sas token manually:

```bash
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`,
  );
  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.CONTAINER_NAME}`,
  );
  const blockBlobClient = containerClient.getBlockBlobClient(name);
  const { url } = blockBlobClient;

  await blockBlobClient.uploadData(data);
```

## Read file in Azure Blob

```bash
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.ACCOUNT_STORAGE_NAME}.blob.core.windows.net?${process.env.SAS_TOKEN}`,
  );

  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.CONTAINER_NAME}`,
  );

  const blockBlobClient = containerClient.getBlockBlobClient(`${filename}`);

  const blockBlobDownload = await blockBlobClient.downloadToBuffer();
```

## Tips

- Environment **variables** do not communicate well when a component is in client mode, that is, when you have used.
