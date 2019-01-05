# boardless.deploys.mail

SendGrid にテンプレートをアプロードする

## Required

- node.js

## Usage

#### はじめに

```bash
npm install
```

#### web 起動

```bash
npm start
```

#### build

```bash
npm run build
```

#### upload

```bash
npm run build
# 環境変数にSendGridのApiキーを設定(.envでも良い)
export SENDGRID_API_KEY=xxxxx
npm run upload
```
