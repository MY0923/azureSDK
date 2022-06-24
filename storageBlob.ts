const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
require('dotenv').config()

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');

    // Azure storageにアクセスできるか確認(接続文字列を使う)
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error("Azure Storage Connection string not found");
    }


    // コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );

    // コンテナの名前を作成(uniqueにする)
    // const containerName = "quickstart" + uuidv1();
    const containerName = "test1";
    console.log("\nCreating container...");
    console.log("\t", containerName);

    // コンテナの参照を取得
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // コンテナ作成
    const createContainerResponse = await containerClient.create();
    console.log(
        "Container was created successfully. requestId: ",
        createContainerResponse.requestId
    );


    // blobに名前作成(uniqueにする)
    // const blobName = "quickstart" + uuidv1() + ".txt";
    const blobName = "index.html";

    // blob clientを取得
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log("\nUploading to Azure storage as blob:\n\t", blobName);

    // blobにデータをアップロード
    const data = "index.html";
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
    );

    // コンテナ内のblobをリスト表示
    console.log("\nListing blobs...");
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log("\t", blob.name);
    }

    //最初から最後までのBlobを取得する
    // NodeはdownloadBlockBlobResponse.readableStreamBodyにアクセスしてダウンロードしたデータを取得
    //ブラウザは、 downloadBlockBlobResponse.readableStreamBodyにアクセスし、ダウンロードしたデータを取得
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log("\nDownloaded blob content...");
    console.log(
        "\t",
        await streamToText(downloadBlockBlobResponse.readableStreamBody)
    );
}

// streamをtextに変換
async function streamToText(readable) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
        data += chunk;
    }
    return data;
}

// コンテナ削除
// console.log("\nDeleting container...");

// const deleteContainerResponse = await containerClient.delete();
// console.log(
//     "Container was deleted successfully. requestId: ",
//     deleteContainerResponse.requestId
// );



main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));

