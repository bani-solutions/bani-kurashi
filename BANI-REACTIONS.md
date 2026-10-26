# バニ平のタップ反応と追加イラスト

2026-10-26更新。タップのセリフは従来10種類＋くすぐったい2種類＋照れ2種類の計14種類。テキストごとに表情画像を決定し、履歴から直前のタップ反応を探して次の反応を表示する。Android向けタッチ処理・クリックの二重反応防止・保存失敗時も反応する処理を維持。

## プロジェクト内の保存先

- `/workspace/scratch/06c42acdd4cb/banihei-ticklish.png`：くすぐったがって笑う
- `/workspace/scratch/06c42acdd4cb/banihei-shy.png`：ほっぺを赤くして照れる
- `/workspace/scratch/06c42acdd4cb/banihei-delighted.png`：両手を上げて大喜び
- `/workspace/scratch/06c42acdd4cb/banihei-playful.png`：楽しそうに踊る

既存の画像は上書きせず、追加画像を使用。各画像は1024×1536のRGBA PNG、背景は透過。

## 生成方法と最終プロンプト

内蔵の画像生成を使用。参照画像：`banihei-illustration.png`。`transparent_background: true`。以下の共通プロンプトに、各表情の指定を続けて、1画像ずつ生成した。

### 共通プロンプト

Use case: identity-preserve. Asset type: full-body mascot reaction illustration for a Japanese household app, shown very small (85 by 112 CSS pixels). Reference image: existing Banihei; preserve exact character identity, aqua turquoise fuzzy plush rabbit, lime yellow belly and inner ears, large purple eyes with black outlines, navy nose, little pink tongue, small white ring tag centered between ears, one bent ear and one tall ear. Match the soft illustrated felt texture and proportions, same character only, no costume. Full body from ear tips to feet fully visible, centered, generous transparent margin, portrait composition. TRUE transparent background, no colored halo, no scenery, no words or lettering, no watermark. Make the expression and pose very readable at thumbnail size. Change expression and body pose as follows:

### くすぐったい

Ticklish giggling: eyes gently squeezed into joyful laughing crescents, open laughing mouth, blushed cheeks, shoulders hunched, two little paws curled close over belly, body squirming slightly to one side as if tickled. Cute and comfortable, not distressed.

### 照れ

Bashful embarrassed happiness: clearly pink blushing cheeks, big purple eyes shyly glancing sideways/down, small smile, both paws softly covering the cheeks, toes turned inward, shoulders tucked. Warmly happy and bashful, not sad.

### 大喜び

Ecstatic overjoyed: springing happily upward with both arms raised high and feet slightly apart, big sparkling purple eyes and huge open smile, ears bouncing. Joyful excitement with a clear energetic silhouette.

### 楽しそう

Having lots of fun: playful dancing pose with one foot lifted, body swaying, arms out in a happy bounce, big purple eyes with a cheerful smile and tiny tongue, ears lively. Clearly playful and delighted, different silhouette from both-arms-up celebration.

## 検証

`node chat-replies.test.cjs`：14種類の重複しない反応、全セリフと表情画像の対応、再読み込み時の反復回避。`node pet-touch.test.cjs`：タッチ、連続タップ、保存失敗、クリックとの二重反応防止。バニP、バックアップ、家族共有の既存テストも実行。
