const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
require('dotenv').config();
const fs = require('fs');
const mime = require("mime");


async function main() {

    // 接続文字列(キー)を代入
    const AZURE_STORAGE_CONNECTION_STRING = storageCheck();

    // コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
    const blobServiceClient = blobServiceClientCreate(AZURE_STORAGE_CONNECTION_STRING);

    // コンテナの名前を作成(uniqueにする。小文字でしか作れない)
    // const containerName = "quickstart" + uuidv1();
    const containerName = "test6789012";
    
    console.log("\nコンテナ作成中");
    console.log("\t", containerName);

    // コンテナクライアントを取得
    const containerClient = getContainerClient(blobServiceClient, containerName);
    

    // コンテナ作成
    // const publicAccessType = "blob";
    const containerOptions = {
        access: "blob",
    }
    // const containerResponse = createContainerResponse(containerOptions, containerClient);
    createContainerResponse(containerClient, containerOptions);


    // blobに名前作成(uniqueにする)
    // const blobName = "quickstart" + uuidv1() + ".txt";
    const blobName = "index.html";
    const contentType = mime.getType(blobName);
    const options = {
        blobHTTPHeaders: {
        blobContentType: contentType,
        },
    };

    // blob clientを取得
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log("\nUploading to Azure storage as blob:\n\t", blobName);

    // blobにデータをアップロード
    const data = fs.readFileSync('index.html', "utf-8");
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length, options);
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


// Azure storageにアクセスできるか確認(接続文字列を使う)
function storageCheck(){
    if (!process.env.ACCESS_KEY) {
        throw Error("Azure Storage Connection string not found");
    }
    return process.env.ACCESS_KEY;
}

// コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
function blobServiceClientCreate(accessKey){
    return BlobServiceClient.fromConnectionString(accessKey);
}

// コンテナクライアントを取得
function getContainerClient(blobServiceClient, containerName){
    return blobServiceClient.getContainerClient(containerName);
}

//コンテナ作成(同じコンテナ名があると処理が失敗する)
async function createContainerResponse(containerOptions, containerClient){
    return await containerClient.create(containerOptions);
}

main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));

