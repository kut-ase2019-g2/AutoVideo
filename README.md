# AutoVideo

動画自動生成Webアプリケーションです

画像をUploadする際にAIが最適なエフェクトを探してくれます

その後、リクエストが来るたびにエフェクト情報を元に動画を生成します。



### アプリケーション [movie]

#### movie/models.py

Webアプリケーションのモデルを定義する

現状Imageしか稼働してないが...

- Class Image

画像データを保存するmodel

#### movie/Views.py

##### メインホームページ部

- Class IndexView (+ index.html)

メインホームページを構成するClass

##### 画像アップロード部

- Class ImageCreateView (+ imageCreate.html)

画像のアップロードフォームを構成するClass

- Class NewImageView (+ newimage.html)

画像のアップロード要求のPOSTを受け取った際にclarifaiを呼び出しエフェクトタグを設定するClass

##### 動画生成部

- Class WaitView (+ wait.html)

動画生成中に表示させる画面を描画するClass
またwait.htmlが関数movieMakeをリダイレクトで呼び出す

- def movieMake

動画生成処理を担当する関数

動画生成完了後Class PlayViewを呼び出す

- Class PlayView

生成された動画をHTML上に配置するClass

#### movie/mymodel.py

API clarifai学習させたモデルを稼働させるコード