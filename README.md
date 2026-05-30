# Expense_Trucker

Expense_Truckerは、日々の支出を管理するためのデスクトップアプリケーションです。

バックエンドにはPythonのFastAPI、フロントエンドにはJavaScriptとPyWebViewを採用し、ローカル環境で動作する家計簿アプリとして開発しました。

データベースにはSQLiteを使用しており、支出データをローカルに保存します。

## 主な機能

* 支出の登録
* 支出の編集
* 支出の削除（論理削除）
* 支出一覧の表示
* 支出データの集計

## 使用技術

* Python
* FastAPI
* JavaScript
* PyWebView
* SQLite
* SQLAlchemy
* HTML/CSS

## 概要

本アプリケーションは、家計簿の入力や支出管理を簡単に行うことを目的として開発しました。

支出情報をカテゴリごとに管理し、期間別の集計や一覧表示を行うことで、日々の支出状況を把握できます。

### ログイン画面
<img src="https://github.com/user-attachments/assets/c4d0ca0a-0ab4-4def-8d89-6b6de91fb81f" width="800">

### 支出入力画面
<img src="https://github.com/user-attachments/assets/933a4d1a-2b4f-4645-8237-d31d9ca725df" width="500">

### 支出集計画面
<img src="https://github.com/user-attachments/assets/b86c06c9-7bfd-44d8-994f-c94caf7d8082" width="800">


## 学習内容

- FastAPIによるREST API開発
- SQLAlchemyを利用したデータベース操作
- JavaScriptによるSPA風画面遷移
- PyWebViewを利用したデスクトップアプリ化
- PyInstallerによるexe化
