# MVP Workflow App Backend

このプロジェクトは、MVP ワークフローアプリケーションのバックエンドです。FastAPI を使用して構築されています。

## セットアップ

1. Python がインストールされていることを確認してください（Python 3.7 以上推奨）。

2. プロジェクトのルートディレクトリに移動します：

   ```
   cd mvp-workflow-app/backend
   ```

3. 仮想環境を作成し、アクティベートします：

   ```
   python -m venv venv
   source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
   ```

4. 必要な依存関係をインストールします：

   ```
   pip install -r requirements.txt
   ```

## 実行方法

1. バックエンドサーバーを起動します：

   ```
   uvicorn main:app --reload
   ```

   サーバーは通常、http://localhost:8000 で実行されます。

2. API ドキュメントにアクセスするには、ブラウザで http://localhost:8000/docs を開きます。

## プロジェクト構造

- `main.py`: アプリケーションのエントリーポイントと API ルートの定義
- `models/`: データモデルの定義
- `services/`: ビジネスロジックの実装
- `utils/`: ユーティリティ関数とヘルパークラス

## 主要な機能

- ワークフローの作成と実行
- API 情報の設定
- 各種ノード（開始、LLM、終了）の処理

## 注意事項

- このバックエンドはフロントエンドアプリケーションと連携して動作します。
- CORS の設定は開発環境用に構成されています。本番環境では適切に調整してください。
