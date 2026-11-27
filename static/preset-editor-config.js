(() => {
  "use strict";

  const formats = [
    { value: "code128", label: "Code 128（横長の一次元バーコード）" },
    { value: "ean13", label: "EAN-13（13桁の一次元バーコード）" },
    { value: "qr", label: "QRコード（二次元）" },
  ];
  const quantity = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 });
  const list = (value) => Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()) : [];

  function summarize(spec, preview) {
    const settings = spec?.identification;
    if (!settings) return [];
    const readers = list(settings.readers);
    const operators = list(settings.operators);
    const summary = [];
    if (readers.length) {
      const route = readers.slice(0, 8).map((reader, index) => (index + 1) + ". " + reader).join(" → ");
      summary.push({ label: "読取経路（設定順）", value: route + (readers.length > 8 ? " → ほか " + (readers.length - 8) + " 箇所" : "") });
      if (readers.length === 1) {
        summary.push({ label: "方向の生成", value: "読取機が1台のため、標準の direction は IN になります。" });
      }
    }
    if (readers.length !== new Set(readers).size || operators.length !== new Set(operators).size) {
      const duplicates = [];
      if (readers.length !== new Set(readers).size) duplicates.push("読取機");
      if (operators.length !== new Set(operators).size) duplicates.push("作業者");
      summary.push({ label: "ID の重複", value: duplicates.join("・") + "に重複があります。" });
    }
    if (Number.isInteger(settings.tags) && settings.tags > 0 && readers.length) {
      const attempts = settings.tags * readers.length;
      summary.push({ label: "全タグが経路を一巡するまで", value: quantity.format(attempts) + " 読取位置（標準のID生成時）" });
    }
    if (Number.isFinite(spec.batch_size) && spec.batch_size > 0 && Number.isFinite(spec.interval_ms) && spec.interval_ms > 0) {
      const rate = spec.batch_size * 1000 / spec.interval_ms;
      summary.push({ label: "予定読取レート", value: "約 " + quantity.format(rate) + " 件/秒（異常発生や配送待ちの影響を除いた概算）" });
    }
    const checkpoint = preview?.reader_route_preview?.checkpoints?.[0];
    const sample = checkpoint?.event || preview?.records?.[0];
    if (sample?.tag_id) {
      summary.push({ label: "イベント見本", value: [sample.tag_id, sample.reader_id, sample.direction, sample.operator_id].filter(Boolean).join(" / ") });
    }
    if (sample?.epc || sample?.barcode) {
      summary.push({
        label: "出力値の例",
        value: [sample.epc && "EPC " + sample.epc, sample.barcode && "バーコード " + sample.barcode].filter(Boolean).join(" / "),
      });
    }
    return summary;
  }


  const types = [
    { value: "string", label: "文字列" },
    { value: "integer", label: "整数" },
    { value: "number", label: "実数" },
    { value: "decimal", label: "固定小数点" },
    { value: "boolean", label: "真偽値" },
    { value: "datetime", label: "日時" },
    { value: "json", label: "JSON" },
  ];
  const generators = [
    { value: "record_id", label: "決定的なレコードID" },
    { value: "uuid", label: "UUID" },
    { value: "sequence", label: "連番" },
    { value: "integer", label: "ランダム整数" },
    { value: "uniform", label: "一様分布" },
    { value: "normal", label: "正規分布" },
    { value: "choice", label: "候補から選択" },
    { value: "boolean", label: "確率で真偽値" },
    { value: "constant", label: "固定値" },
    { value: "template", label: "文字列ひな型" },
    { value: "timestamp", label: "時刻の連番" },
    { value: "reference", label: "前の項目を参照" },
    { value: "sum", label: "参照値の和" },
    { value: "difference", label: "参照値の差" },
    { value: "product", label: "参照値の積" },
    { value: "ratio", label: "参照値の比" },
  ];
  const anomalyOperations = [
    { value: "set", label: "値を置き換え" },
    { value: "add", label: "加算" },
    { value: "multiply", label: "倍率" },
    { value: "ramp", label: "連続的に増減" },
    { value: "freeze", label: "開始位置の値に固定" },
    { value: "null", label: "NULLを設定" },
    { value: "copy_from", label: "別位置からコピー" },
    { value: "timestamp_shift", label: "時刻をずらす" },
    { value: "omit", label: "項目を省略" },
  ];
  const generatorIs = (...equals) => ({ path: "generator", equals });
  const generatedFields = (spec) => Array.isArray(spec?.generator?.fields) ? spec.generator.fields : [];
  const fieldNames = (spec) => generatedFields(spec).flatMap((field) => typeof field?.name === "string" ? [field.name] : []);

  function newField(rows) {
    const names = new Set(rows.flatMap((row) => typeof row?.name === "string" ? [row.name.toLowerCase()] : []));
    let name = "event_note";
    let suffix = 2;
    while (names.has(name)) {
      name = "event_note_" + suffix;
      suffix += 1;
    }
    return { name, data_type: "string", generator: "constant", value: "" };
  }

  function newAnomaly(_rows, spec) {
    const fields = generatedFields(spec);
    const numeric = fields.find((field) => !field?.primary_key && ["integer", "number", "decimal"].includes(field?.data_type));
    const first = numeric || fields.find((field) => field?.name && !field.primary_key) || fields.find((field) => field?.name);
    return {
      name: "異常注入",
      enabled: false,
      field: first?.name || "value",
      operation: numeric ? "add" : "null",
      value: numeric ? 1 : null,
      from_row: 0,
      every: 1,
      probability: 1,
    };
  }

  const generationSection = {
    title: "読取イベントに追加する項目",
    description: "EPC、タグID、ロットや direction も生成項目に定義できます。指定した項目は標準値に優先します。",
    fields: [
      { path: "generator.seed", label: "乱数シード", type: "integer", min: 0, max: 2147483647, default: 42, help: "同じ条件とシードで同じ値を再現できます。" },
      { path: "generator.start_sequence", label: "生成順の開始値", type: "integer", min: 0, max: 1000000000, default: 0 },
      { path: "generator.parameters", label: "共通パラメーター", type: "json", default: {}, help: "JSONのオブジェクト。項目設定から文字列の $キー を使って値を参照できます。" },
      {
        path: "generator.fields",
        label: "生成項目",
        type: "table",
        min: 1,
        max: 100,
        default: newField,
        columns: [
          { path: "name", label: "項目名", type: "text", help: "半角英数字と _ を使います。先頭は英字か _ です。", placeholder: "event_note" },
          { path: "data_type", label: "型", type: "select", options: types, default: "string" },
          { path: "generator", label: "生成方法", type: "select", options: generators, default: "constant" },
          { path: "value", label: "固定値", type: "json", default: null, when: generatorIs("constant"), help: "文字列はダブルクォートで囲み、数値や true / false はそのまま入力します。" },
          { path: "minimum", label: "下限値", type: "json", default: 0, when: generatorIs("integer", "uniform"), help: "数値、または \"$パラメーター名\"。" },
          { path: "maximum", label: "上限値", type: "json", default: 100, when: generatorIs("integer", "uniform") },
          { path: "mean", label: "平均値", type: "json", default: 50, when: generatorIs("normal"), help: "数値、または \"$パラメーター名\"。" },
          { path: "stddev", label: "標準偏差", type: "json", default: 5, when: generatorIs("normal"), help: "0以上。大きいほどばらつきが広がります。" },
          { path: "start", label: "開始値・開始日時", type: "json", default: 0, when: generatorIs("sequence", "timestamp"), help: "日時にはタイムゾーン付き文字列か、その値を持つ \"$パラメーター名\" を指定します。" },
          { path: "step", label: "増分（日時は秒）", type: "json", default: 1, when: generatorIs("sequence", "timestamp") },
          { path: "group_size", label: "同じ値を続ける件数", type: "json", default: 1, when: generatorIs("sequence", "timestamp") },
          { path: "modulo", label: "繰り返すまでの段階数", type: "json", default: 0, when: generatorIs("sequence", "timestamp"), help: "0を指定すると繰り返しません。" },
          { path: "choices", label: "候補リスト", type: "json", default: [], when: generatorIs("choice"), placeholder: '["ok", "warning"]', help: "JSON配列、または配列を持つ \"$パラメーター名\"。" },
          { path: "weights", label: "候補ごとの重み", type: "json", default: [], when: generatorIs("choice"), placeholder: "[9, 1]", help: "空の配列なら同じ確率です。指定する場合は候補と同じ件数にします。" },
          { path: "probability", label: "true となる確率", type: "json", default: 0.5, when: generatorIs("boolean"), help: "0〜1、または \"$パラメーター名\"。" },
          { path: "template", label: "文字列ひな型", type: "text", default: "{sequence}", when: generatorIs("template"), help: "{項目名}、{sequence}、{record_id} などを展開します。" },
          { path: "sources", label: "参照項目（1行1項目）", type: "string-list", default: [], when: generatorIs("reference", "sum", "difference", "product", "ratio"), help: "表で先に定義した項目を指定します。比率は分子、分母の順です。" },
          { path: "length", label: "文字列の最大長", type: "integer", min: 1, max: 4000, default: 255, when: { path: "data_type", equals: "string" } },
          { path: "precision", label: "全体の精度（桁）", type: "integer", min: 1, max: 38, default: 18, when: { path: "data_type", equals: "decimal" } },
          { path: "scale", label: "小数部の桁数", type: "integer", min: 0, max: 18, default: 3, when: { path: "data_type", equals: "decimal" } },
          { path: "primary_key", label: "一意キー", type: "boolean", default: false, help: "一意キーにNULL率は指定できません。" },
          { path: "null_probability", label: "NULL率 (0〜1)", type: "number", min: 0, max: 1, step: "any", default: 0 },
          { path: "condition", label: "条件分岐（JSON）", type: "json", default: null, help: "他の項目の値に応じて生成値を差し替える詳細条件です。通常は null のままにします。" },
        ],
      },
    ],
  };

  const anomalySection = {
    title: "生成項目の異常シナリオ",
    description: "生成イベント内の列を指定範囲で変化させます。読取自体の漏れ・二重読取・異常IDの周期はRFID専用の設定で指定します。",
    fields: [
      {
        path: "generator.anomalies",
        label: "値の異常ルール",
        type: "table",
        max: 64,
        default: newAnomaly,
        columns: [
          { path: "name", label: "異常名", type: "text", default: "異常注入" },
          { path: "enabled", label: "適用する", type: "boolean", default: true },
          { path: "field", label: "対象項目", type: "text", suggestions: fieldNames },
          { path: "operation", label: "変更方法", type: "select", options: anomalyOperations, default: "set" },
          { path: "value", label: "置換値・変化量・コピー元", type: "json", default: null, when: { path: "operation", equals: ["set", "add", "multiply", "ramp", "copy_from", "timestamp_shift"] }, help: "加算・倍率は数値、コピー元は0から始まる行位置、時刻のずれは秒で指定します。" },
          { path: "from_row", label: "開始行（0始まり）", type: "integer", min: 0, max: 100000000, default: 0 },
          { path: "to_row", label: "最終行（省略は最後まで）", type: "json", default: null, help: "0以上の整数、または null。指定した行を含みます。" },
          { path: "every", label: "適用間隔（行）", type: "integer", min: 1, max: 100000000, default: 1 },
          { path: "probability", label: "適用確率 (0〜1)", type: "number", min: 0, max: 1, step: "any", default: 1 },
          { path: "when", label: "発生条件（JSON）", type: "json", default: null, help: "対象行を他の項目の値で絞り込みます。条件を付けない場合は null にします。" },
          { path: "bypass_validation", label: "型制約外の値も再現", type: "boolean", default: false, help: "取込側のエラー処理を確認する場合にのみ有効にします。" },
        ],
      },
    ],
  };

  window.FactoryPresetConfig = {
    title: "読取経路・タグ・ラベルの編集",
    description: "同じタグを工程順に通過させ、読取漏れや重複、作業者の不一致を再現します。",
    summarize,
    sections: [
      {
        title: "出力プロファイルと読取ペース",
        description: "捕捉・配送先の設定を選び、1回の更新で試す読取件数と運転の上限を決めます。",
        fields: [
          { path: "profile_id", label: "識別イベントの出力プロファイル", type: "connection", default: "default", help: "ローカル捕捉やMQTT・HTTPなどの保存済み出力先を選びます。" },
          { path: "interval_ms", label: "読取イベント生成の周期 (ms)", type: "integer", min: 10, max: 60000, default: 1000, help: "1000 msなら約1秒に1回、次の読取イベントをまとめて生成します。" },
          { path: "batch_size", label: "更新1回あたりの予定読取件数", type: "integer", min: 1, max: 1000, default: 5, help: "読取漏れや二重読取を適用する前の件数です。上の周期と組み合わせて予定ペースを決めます。" },
          { path: "max_ticks", label: "停止までの更新回数", type: "integer", min: 0, max: 100000000, default: 0, help: "0は回数無制限です。正の値を指定すると、その回数で読取イベントの生成を終了します。" },
          { path: "storage_limit_mb", label: "捕捉・配送キューを含む保存領域上限 (MiB)", type: "integer", min: 16, max: 102400, default: 1024, help: "アプリのデータ領域全体の上限です。超過すると生成を停止し、記録は保持します。" },
        ],
      },
      {
        title: "タグと工程",
        description: "読取機の行順が工程順になります。標準の方向は最初が IN、中間が MOVE、最後が OUT です。",
        fields: [
          { path: "identification.tags", label: "模擬タグの種類数", type: "integer", min: 1, max: 100000, default: 100, help: "同じタグが各工程に現れ、設備間での追跡を試せます。" },
          { path: "identification.readers", label: "読取機・工程の順序（1行1箇所）", type: "string-list", min: 1, max: 100, default: ["GATE-IN", "ASSEMBLY", "INSPECTION", "GATE-OUT"], placeholder: "GATE-IN\nASSEMBLY\nINSPECTION\nGATE-OUT", help: "上から順に通過します。途中に検査やバッファ工程を挿入できます。" },
          { path: "identification.operators", label: "模擬作業者ID（1行1人）", type: "string-list", min: 1, max: 10000, default: ["WORKER-001", "WORKER-002", "WORKER-003"], placeholder: "WORKER-001", help: "テスト用の架空IDを入力します。" },
          { path: "identification.barcode", label: "ラベル画像の形式", type: "select", options: formats, default: "code128", help: "ラベル取得APIの既定形式です。EPCやバーコードの出力値は生成項目でも指定できます。" },
        ],
      },
      {
        title: "読取漏れ・重複・異常ID",
        description: "周期は予定している読取件数で数えます。同じ読取に複数の条件が重なった場合は、読取漏れが先に適用されます。",
        fields: [
          { path: "identification.duplicate_every", label: "二重読取を起こす間隔（件ごと）", type: "integer", min: 0, default: 0, help: "0で無効。同じ event_id のイベントを再送し、取込側の重複排除を試します。" },
          { path: "identification.drop_every", label: "読取を飛ばす間隔（件ごと）", type: "integer", min: 0, default: 0, help: "0で無効。工程の読取漏れを再現します。" },
          { path: "identification.wrong_reader_every", label: "未登録の読取機にする間隔（件ごと）", type: "integer", min: 0, default: 0, help: "0で無効。該当イベントの reader_id は UNKNOWN-READER になります。" },
          { path: "identification.unauthorized_every", label: "未登録の作業者にする間隔（件ごと）", type: "integer", min: 0, default: 0, help: "0で無効。該当イベントの operator_id は UNREGISTERED-WORKER になります。" },
        ],
      },
      generationSection,
      anomalySection,
    ],
  };
})();
