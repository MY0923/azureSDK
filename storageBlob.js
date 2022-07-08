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
    const containerName = "aiueo";

    console.log("\nコンテナ作成中");
    console.log("\t", containerName);


    // コンテナクライアントを取得
    const containerClient = getContainerClient(blobServiceClient, containerName);

    // コンテナ作成
    // const containerResponse = createContainerResponse(containerClient, containerOptions);
    createContainerResponse(containerClient);


    // blobに名前作成(uniqueにする)
    // const blobName = "quickstart" + uuidv1() + ".txt";
    const blobName = "index.html";
    const contentType = mime.getType(blobName);
    const options = {
        blobHTTPHeaders: {
            blobContentType: contentType,
        },
    };

    const blockBlobClient = getBlobClient(containerClient, blobName);

    
    // blobにデータをアップロード
    const uploadBlobResponse = blobFileUpload(blockBlobClient ,blobName, options);

}




// Azure storageにアクセスできるか確認(接続文字列を使う)
function storageCheck() {
    if (!process.env.ACCESS_KEY) {
        throw Error("Azure Storage Connection string not found");
    }
    return process.env.ACCESS_KEY;
}

// コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
function blobServiceClientCreate(accessKey) {
    return BlobServiceClient.fromConnectionString(accessKey);
}

// コンテナクライアントを取得
function getContainerClient(blobServiceClient, containerName) {
    return blobServiceClient.getContainerClient(containerName);
}

//コンテナ作成(同じコンテナ名があると処理が失敗する)
async function createContainerResponse(containerClient) {
    const containerOptions = {
        access: "blob",
    }
    return await containerClient.create(containerOptions);
}

// blob clientを取得
function getBlobClient(containerClient, blobName) {
    console.log("\nUploading to Azure storage as blob:\n\t", blobName);
    return containerClient.getBlockBlobClient(blobName);
}

async function blobFileUpload(blockBlobClient ,blobName, options){
    // blobにデータをアップロード
    const data = fs.readFileSync('index.html', "utf-8");
    return await blockBlobClient.upload(data, data.length, options);
}

main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));

