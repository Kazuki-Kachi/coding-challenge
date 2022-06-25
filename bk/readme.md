# AnnoWork API 開発用Document

## *全体的に整理中

## 事前準備

### IAMユーザーの作成
serverlessの管理を行う為のIAMユーザーの作成が必要。

```
npx sls config credentials --provider aws --key <your-key-here> --secret <your-secret-key-here>
```

### Serverless DynamoDBインストール
ローカル環境で作業を行うために`serverless-dynamodb-local`をインストールする

```
npx sls dynamodb install
```

## ローカル作業用コマンド

### 単体テスト(jest)
```
npm test
```

## Serverless DynamoDB起動
DynamoDBへのアクセスが必要なテストがある場合は起動する
```
npm run db:local
```

### DynamoDB localのURL
http://localhost:8000/shell

### DynamoDB問い合わせ用スクリプト
```
var params = {
    TableName: '<テーブル名>',
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err);
    else ppJson(data);
});
```

## Serverless Offline起動
ローカルサーバーで確認ができる
```
npm run server:local
```

## AWS環境へのデプロイ関連

### AWSへのデプロイ
```
npm run deploy
```
