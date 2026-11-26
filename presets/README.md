# 付属のひな型一覧

迷ったときは[ひな型を選ぶ・作る](../docs/preset-guide.md)を参照してください。
アプリで保存したひな型はアプリの一覧から開きます。

| ID | 表示名 | 最大tick数 | 生成する内容 |
| --- | --- | --- | --- |
| [01-normal](#01-normal) | 正常 / RFID通過 / 100タグ | 手動停止まで | RFID通過 / 100タグを想定 |
| [02-normal](#02-normal) | 正常 / 10タグ / 少量確認 | 手動停止まで | 10タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128 |
| [03-normal](#03-normal) | 正常 / 1000タグ | 手動停止まで | 1000タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128 |
| [04-normal](#04-normal) | 正常 / 2つのゲート | 手動停止まで | 100タグをIN, OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128 |
| [05-normal](#05-normal) | 正常 / 6工程の通過 | 手動停止まで | 100タグをIN, CUT, ASSEMBLY, CLEAN, TEST, OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128 |
| [06-normal](#06-normal) | 正常 / 作業者を10名に変更 | 手動停止まで | 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、10名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128 |
| [07-normal](#07-normal) | 正常 / Code128ラベル | 手動停止まで | Code128ラベルを想定 |
| [08-normal](#08-normal) | 正常 / EAN13ラベル | 手動停止まで | 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式ean13 |
| [09-normal](#09-normal) | 正常 / QRラベル | 手動停止まで | 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式qr |
| [10-normal](#10-normal) | 正常 / 毎秒100イベント | 手動停止まで | 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに100イベント、ラベル方式code128 |
| [11-normal](#11-normal) | 正常 / 低頻度の読取 | 手動停止まで | 低頻度の読取を想定 |
| [12-normal](#12-normal) | 正常 / 独自のイベント項目 | 手動停止まで | 独自のイベント項目を想定 |
| [13-anomaly](#13-anomaly) | 異常 / 二重読取 | 手動停止まで | 二重読取を想定 |
| [14-anomaly](#14-anomaly) | 異常 / 読取漏れ | 手動停止まで | 読取漏れを想定 |
| [15-anomaly](#15-anomaly) | 異常 / 予定外の読取機 | 手動停止まで | 予定外の読取機を想定 |
| [16-anomaly](#16-anomaly) | 異常 / 未登録作業者 | 手動停止まで | 未登録作業者を想定 |
| [17-anomaly](#17-anomaly) | 異常 / 二重読取と読取漏れ | 手動停止まで | 5件ごとに読取漏れを発生 |
| [18-anomaly](#18-anomaly) | 異常 / 通過順の欠落 | 手動停止まで | 100タグをIN, PREPARE, PROCESS, INSPECT, PACK, OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128 |
| [19-anomaly](#19-anomaly) | 異常 / 短時間の大量読取 | 手動停止まで | 更新周期100ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに1000イベント、ラベル方式code128 |
| [20-anomaly](#20-anomaly) | 異常 / タグ値の固着 | 手動停止まで | タグ値の固着を想定 |
| [21-anomaly](#21-anomaly) | 異常 / 未知の状態 | 手動停止まで | 項目statusへset、値='UNKNOWN'を生成位置0〜以降で適用。異常後の型検証を迂回=False |
| [22-anomaly](#22-anomaly) | 異常 / 欠測値 | 手動停止まで | 項目valueへnull、値=Noneを生成位置0〜以降で適用。異常後の型検証を迂回=False |
| [23-anomaly](#23-anomaly) | 異常 / 作業者と読取機の不整合 | 手動停止まで | 作業者と読取機の不整合を想定 |
| [24-anomaly](#24-anomaly) | 異常 / 遅い読取 | 手動停止まで | 遅い読取を想定 |

## ひな型ごとの内容

### 01-normal

**正常 / RFID通過 / 100タグ** · [JSONをダウンロード](01-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。RFID通過 / 100タグを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 02-normal

**正常 / 10タグ / 少量確認** · [JSONをダウンロード](02-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。10タグ / 少量確認を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 10タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 03-normal

**正常 / 1000タグ** · [JSONをダウンロード](03-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。1000タグを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 1000タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 04-normal

**正常 / 2つのゲート** · [JSONをダウンロード](04-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。2つのゲートを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをIN, OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 05-normal

**正常 / 6工程の通過** · [JSONをダウンロード](05-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。6工程の通過を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをIN, CUT, ASSEMBLY, CLEAN, TEST, OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 06-normal

**正常 / 作業者を10名に変更** · [JSONをダウンロード](06-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。作業者を10名に変更を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、10名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 07-normal

**正常 / Code128ラベル** · [JSONをダウンロード](07-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。Code128ラベルを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 08-normal

**正常 / EAN13ラベル** · [JSONをダウンロード](08-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。EAN13ラベルを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式ean13。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 09-normal

**正常 / QRラベル** · [JSONをダウンロード](09-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。QRラベルを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式qr。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 10-normal

**正常 / 毎秒100イベント** · [JSONをダウンロード](10-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。毎秒100イベントを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに100イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 11-normal

**正常 / 低頻度の読取** · [JSONをダウンロード](11-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。低頻度の読取を想定。
- **生成内容・条件**　更新周期5000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに1イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 12-normal

**正常 / 独自のイベント項目** · [JSONをダウンロード](12-normal.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。独自のイベント項目を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 13-anomaly

**異常 / 二重読取** · [JSONをダウンロード](13-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。二重読取を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに同一event_idの二重読取を発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 14-anomaly

**異常 / 読取漏れ** · [JSONをダウンロード](14-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。読取漏れを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに読取漏れを発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 15-anomaly

**異常 / 予定外の読取機** · [JSONをダウンロード](15-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。予定外の読取機を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに予定外の読取機を発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 16-anomaly

**異常 / 未登録作業者** · [JSONをダウンロード](16-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。未登録作業者を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに未登録作業者を発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 17-anomaly

**異常 / 二重読取と読取漏れ** · [JSONをダウンロード](17-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。二重読取と読取漏れを想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに同一event_idの二重読取を発生。 5件ごとに読取漏れを発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 18-anomaly

**異常 / 通過順の欠落** · [JSONをダウンロード](18-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。通過順の欠落を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをIN, PREPARE, PROCESS, INSPECT, PACK, OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに読取漏れを発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 19-anomaly

**異常 / 短時間の大量読取** · [JSONをダウンロード](19-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。短時間の大量読取を想定。
- **生成内容・条件**　更新周期100ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに1000イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 20-anomaly

**異常 / タグ値の固着** · [JSONをダウンロード](20-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。タグ値の固着を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 21-anomaly

**異常 / 未知の状態** · [JSONをダウンロード](21-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。未知の状態を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 項目statusへset、値='UNKNOWN'を生成位置0〜以降で適用。異常後の型検証を迂回=False。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 22-anomaly

**異常 / 欠測値** · [JSONをダウンロード](22-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。欠測値を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 項目valueへnull、値=Noneを生成位置0〜以降で適用。異常後の型検証を迂回=False。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 23-anomaly

**異常 / 作業者と読取機の不整合** · [JSONをダウンロード](23-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。作業者と読取機の不整合を想定。
- **生成内容・条件**　更新周期1000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに5イベント、ラベル方式code128。 3件ごとに予定外の読取機を発生。 3件ごとに未登録作業者を発生。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。

### 24-anomaly

**異常 / 遅い読取** · [JSONをダウンロード](24-anomaly.json)

- **想定**　所在・通過・作業者・重複排除と読取漏れの検証。遅い読取を想定。
- **生成内容・条件**　更新周期5000ms、最大tick数無制限。 100タグをGATE-IN, ASSEMBLY, INSPECTION, GATE-OUTの順に通過させ、3名の疑似作業者を割り当てる。1tickに1イベント、ラベル方式code128。
- **確認事項**　tag_id・EPC・reader_id・operator_id・lot_idで通過を追跡し、event_idで重複を判定。 ラベルAPIでCode128/EAN13/QRのPNGを取得。実機リーダーのLLRP・RF無線通信は模擬せず、取り込み対象の読取イベントを再現。
- **実行前**　公開・認証・送信先は別のプロファイルで指定し、保存後に停止・開始して適用。各条件はフォームとJSONで編集可能。
