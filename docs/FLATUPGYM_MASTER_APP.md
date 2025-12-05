## FLATUP GYM マスターアプリ（LINE版）

### プロジェクト概要
- LINE公式アカウント上で提供する、ジム会員向けの習慣化・成長支援・保護者サポートを統合したデジタルサービス
- 個人開発かつ無料ツール中心で1か月以内にローンチ可能なスコープを採用
- FLATUPGYMの継続率・満足度・差別化ポイントを最大化する

### コアバリュー
- **継続率向上**: 毎日LINEでのタッチポイントを作り、AIが伴走
- **技術向上の見える化**: 簡易動画診断で成長を可視化
- **保護者満足**: クラス状況とレポート共有で安心を提供

### 機能構成
1. **練習ログ & 褒めAI**
   - 来館後にスタンプ/テキストを送るだけでAIが励ましとログ化
   - 連続来館日数、ポイント管理、3日以上空いた際のプッシュ通知
   - グラフ化された成長ダッシュボード（スプレッドシート + Looker Studio想定）
2. **フォーム診断ライト**
   - 練習動画1本で、ガード位置・体幹安定・軸足の向きをビジョンAPIで解析
   - 今日の課題3つと月次ビフォーアフターレポートを自動生成
3. **キッズ・親サポート**
   - 当日の混雑状況、練習内容サマリー、褒めポイントを自動配信
   - 来週のクラス予約とイベント告知をワンストップ化

### 技術スタック（無料枠中心）
- チャネル: LINE公式アカウント + Messaging API
- AIワークフロー: Dify（もしくはFlowise）
- ビジョン解析: OpenAI Vision API 無料枠
- データベース: Supabase（またはAirtable無料枠）、Googleスプレッドシート
- 自動化: Google Apps Script、Cloud Functions (無料枠) or Netlify Functions
- 分析/可視化: Google スプレッドシート + Looker Studio 無料枠

### アーキテクチャ概要
- LINE Webhook → Cloud Functions (Node.js) → Dify/Flowiseにプロンプト送信
- 永続化: Supabaseテーブル（会員・ログ・課題・ポイント）、スプレッドシート（ダッシュボード用集計）
- バッチ処理: Cloud Scheduler + Apps Scriptで日次リマインダー・混雑状況生成
- メディア処理: 動画は一時保存せず、OpenAI Visionに直接アップロードURLを渡す

### データモデル（初期案）
- `members`: id, name, line_user_id, membership_type, join_date, parents_contact
- `practice_logs`: id, member_id, date, detected_activity, ai_message, streak_count, points
- `video_reviews`: id, member_id, video_url, diagnosis, tasks, created_at
- `class_reports`: id, class_date, summary, attendance_level, kids_highlight, parents_notice
- `events`: id, title, description, target_membership, start_date, link

### 開発ロードマップ
**Phase 0（Day 0-1）**
- LINE公式チャネル作成、Messaging API設定
- Supabaseプロジェクト作成・schema定義

**Phase 1（Day 1-3）: 練習ログ & 褒めAI**
- Webhook + Dify連携、スタンプ検知、褒めメッセージ生成
- 連続日数計算・ポイント加算・リマインド処理
- スプレッドシート連携で簡易グラフ出力

**Phase 2（Day 3-6）: キッズ・親サポート**
- クラス混雑状況生成用Apps Script
- 日次/週次レポートテンプレート作成
- LINEメニューに予約・イベント導線を設定

**Phase 3（Day 6-12）: フォーム診断ライト**
- 動画アップロードフロー（LINE → Vision API）
- 姿勢チェックロジックと課題提案プロンプト
- 月次レポート自動生成フロー

**Phase 4（Day 12-14）: チューニング & テスト**
- 会員モニター運用でフィードバック収集
- プロンプト見直し / KPI計測ダッシュボード仕上げ

### KPI / 成功指標
- 週次アクティブ会員率: 70%以上
- 連続来館7日以上達成者数（月次）
- キッズ保護者アンケート満足度 4.5/5以上
- 動画診断利用率（月1回以上提出）

### リスクと対策
- **無料枠超過リスク**: API使用量監視、閾値で通知
- **動画プライバシー**: 保存せず解析のみ、利用規約を明示
- **AI応答品質**: サンプルデータで継続的にプロンプト改善
- **保護者対応**: LINEでの有人切り替え導線を確保

### 即時TODO
- [ ] LINE公式アカウントのMessaging APIトークン取得
- [ ] Supabaseスキーマ migration を作成
- [ ] Difyワークフローテンプレート案を作成
- [ ] 練習ログAI用プロンプトドラフトを作成
