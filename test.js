import { storageCheck } from "./storageBlob";
const mime = require("mime");


export const main = () => {
    console.log("sample")
    // 接続文字列(キー)を代入
    const AZURE_STORAGE_CONNECTION_STRING = storageCheck();
    // コンテナクライアント作成に使用するBlobServiceClientオブジェクト作成
    // const blobServiceClient = blob.blobServiceClientCreate(AZURE_STORAGE_CONNECTION_STRING);

    // // コンテナの名前を作成(uniqueにする。小文字でしか作れない)
    // // const containerName = "quickstart" + uuidv1();
    // const containerName = "yuuma";


    // // コンテナクライアントを取得
    // const containerClient = blob.getContainerClient(blobServiceClient, containerName);

    // // コンテナ作成
    // // const containerResponse = createContainerResponse(containerClient, containerOptions);
    // blob.createContainerResponse(containerClient);


    // // blobに名前作成(uniqueにする)
    // // const blobName = "quickstart" + uuidv1() + ".txt";
    // const blobName = "index.html";
    // const contentType = mime.getType(blobName);
    // const options = {
    //     blobHTTPHeaders: {
    //         blobContentType: contentType,
    //     },
    // };

    // const blockBlobClient = blob.getBlobClient(containerClient, blobName);

    
    // // blobにデータをアップロード
    // const uploadBlobResponse = blob.blobFileUpload(blockBlobClient ,blobName, options);
}