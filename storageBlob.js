const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
require('dotenv').config();
const fs = require('fs');


export const storageCheck = () => {
    if (!process.env.ACCESS_KEY) {
        throw Error("Azure Storage Connection string not found");
    }
    return process.env.ACCESS_KEY;
}

// Azure storageにアクセスできるか確認(接続文字列を使う)

// コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
// export const blobServiceClientCreate = (accessKey) => {
//     return BlobServiceClient.fromConnectionString(accessKey);
// }

// // コンテナクライアントを取得
// exports.getContainerClient = function(blobServiceClient, containerName) {
//     return blobServiceClient.getContainerClient(containerName);
// }

// //コンテナ作成(同じコンテナ名があると処理が失敗する)
// exports.createContainerResponse = async function(containerClient) {
//     const containerOptions = {
//         access: "blob",
//     }
//     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//     return await containerClient.create(containerOptions);
// }

// // blob clientを取得
// exports.getBlobClient = function(containerClient, blobName) {
//     console.log("\nUploading to Azure storage as blob:\n\t", blobName);
//     return containerClient.getBlockBlobClient(blobName);
// }

// exports.blobFileUpload = async function(blockBlobClient ,blobName, options){
//     // blobにデータをアップロード
//     const data = fs.readFileSync('index.html', "utf-8");
//     console.log(data);
//     return await blockBlobClient.upload(data, data.length, options);
// }

// main()
//     .then(() => console.log('Done'))
//     .catch((ex) => console.log(ex.message));

