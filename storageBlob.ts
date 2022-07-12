import { BlobServiceClient } from '@azure/storage-blob';
// import { v1 as uuidv1 } from 'uuid';
require('dotenv').config();
import * as fs from 'fs';
import * as mime from "mime";


async function main() {

    // 接続文字列(キー)を代入
    const AZURE_STORAGE_CONNECTION_STRING = storageCheck();

    // コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
    const blobServiceClient = blobServiceClientCreate(AZURE_STORAGE_CONNECTION_STRING);

    // コンテナの名前を作成(uniqueにする。小文字でしか作れない)
    // const containerName = "quickstart" + uuidv1();
    const containerName = "nasubi";

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
function blobServiceClientCreate(accessKey: string) {
    return BlobServiceClient.fromConnectionString(accessKey);
}

// コンテナクライアントを取得
function getContainerClient(blobServiceClient: any, containerName: string) {
    console.log(blobServiceClient);
    return blobServiceClient.getContainerClient(containerName);
}

//コンテナ作成(同じコンテナ名があると処理が失敗する)
async function createContainerResponse(containerClient: any) {
    const containerOptions = {
        access: "blob",
    }
    return await containerClient.create(containerOptions);
}

// blob clientを取得
function getBlobClient(containerClient: any, blobName: string) {
    console.log("\nUploading to Azure storage as blob:\n\t", blobName);
    return containerClient.getBlockBlobClient(blobName);
}

async function blobFileUpload(blockBlobClient: any, blobName: string, options: object){
    // blobにデータをアップロード
    const data = fs.readFileSync('index.html', "utf-8");
    return await blockBlobClient.upload(data, data.length, options);
}

main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));

