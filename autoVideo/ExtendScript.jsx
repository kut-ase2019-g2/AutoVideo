var aep_file_index = new File("C:/Users/hayak/work/git/AutoVideo/autoVideo/After_effects_test.aep"); // aepファイルのパス

app.open(aep_file_index); // after effectsの起動

ALL_REMOVE_MODULE (); // 現在のプロジェクトのファイルをすべて消す

//var csv_file_index = File("C:/Users/ryo08/Desktop/AE/test_img/tag_data.csv"); // csvファイルのパス
var csv_file_index = File("C:/Users/hayak/work/git/AutoVideo/autoVideo/media/csv/tag_data.csv");

var csv_data = CSV_FILE_READ_MODULE (csv_file_index); // csvファイルの読み込み

var comp_name = "test"; // コンポジションの名前

var temp = 0; // 画像表示時間のための変数
var img_time = 3; // 一つの画像の表示時間

test_comp_index = COMP_ADD_MODULE(comp_name, img_time*csv_data.length); // コンポジションを作成  // var 消した

// すべての画像についてエフェクトを付ける
for (var i = 0; i < csv_data.length; i++) {
    //var img_file_index = new File("C:/Users/ryo08/Desktop/AE/test_img/" + csv_data[i][0]); // imgファイルのパス
    var img_file_index = new File(csv_data[i][0]);
    img = IMG_FILE_READ_MODULE (img_file_index); // imgファイル読み込み // var 消した
    test_layers_index = LAYERS_ADD_IMG_FILE_MODULE (test_comp_index, img); // レイヤーにimgファイルを追加 // var 消した
    test_layers_index.inPoint = temp; // 画像の開始時間
    test_layers_index.outPoint = temp + img_time; // 画像の終了時間

    IMG_SIZE_FIT (img, test_layers_index);

    // 画像に対応したエフェクトを付ける
    if (csv_data[i][1] == "KiraKira") { // キラキラ
        EFFECT_KIRAKIRA_MODULE(test_layers_index, temp, temp + img_time);
    } else if (csv_data[i][1] == "Change_contrast") { // コントラスト
        EFFECT_CONTRAST_MODULE (test_layers_index, temp, temp + img_time);
    } else if (csv_data[i][1] == "Zoom_in") { // 拡大
        EFFECT_ZOOM_IN_MODULE (test_layers_index, temp, temp+img_time); // 拡大エフェクトを付ける
    } else if (csv_data[i][1] == "Central_line") { // 集中線
        EFFECT_CENTRAL_LINE_MODULE(test_layers_index, temp, temp+img_time);
    } else if (csv_data[i][1] == "Lens_flare") { // レンズフレア
        EFFECT_LENS_FLARE_MODULE (test_layers_index, temp, temp+img_time);
    } else if (csv_data[i][1] == "Zoom_out") { // 縮小
        EFFECT_ZOOM_OUT_MODULE (test_layers_index, temp, temp+img_time) // 縮小エフェクトを付ける
    } else if (csv_data[i][1] == "Notes") { // 音符
        EFFECT_NOTES_MODULE (test_layers_index, temp, temp+img_time);
    } else if (csv_data[i][1] == "Rain") { // 波紋
        EFFECT_RAIN_MODULE(test_layers_index, temp, temp+img_time);
    } else if (csv_data[i][1] == "Fire") { // 炎

    } else if (csv_data[i][1] == "Heart") { // ハート
        EFFECT_HEART_MODULE (test_layers_index, temp, temp+img_time);
    }
    temp = temp + img_time;
}

var output_index = File("C:/Users/hayak/work/git/AutoVideo/autoVideo/media/movie/test_bgm_ai.mp4"); // 動画を出力する場所
MP4_OUTPUT_MODULE (test_comp_index, output_index); // 動画を出力

$.sleep(20000);
app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES); // セーブしない
app.quit(); // after effectsの終了

// 引数で指定したcsvファイルを読み込む data[行][列] 0が最初
function CSV_FILE_READ_MODULE(csv_file_index) {
    var dicObj = app.activeDocument;
    var data = [];
    i = 0;
    if (csv_file_index) {
        var fileObj = new File(csv_file_index);
        var flag = fileObj.open("r");
        if (flag == true) {
            while (!fileObj.eof) {
                var pointData = fileObj.readln();
                data[i] = pointData.split(",");
                i++;
            }
            fileObj.close();
        } else {
            alert("csv is not open");
        }
    }
    return data;
}

// 現在のプロジェクトのファイルをすべて消す
function ALL_REMOVE_MODULE() {
    var project_file_num = app.project.items.length;
    for (i = 1; i <= project_file_num; i++) {
        app.project.item(1).remove();
    }
}


// 引数で指定したafter effectsのaepプロジェクトを開く
function AE_PROJECT_OPEN_MODULE(aep_project_index) {
    // あらかじめプロジェクト内のファイルを削除する必要あり
    app.open(aep_project_index);
}

// 引数で指定した名前のコンポジションを作成し開く
function COMP_ADD_MODULE(comp_name, mp4_time) {
    var test_comp_index = app.project.items.addComp(comp_name, 720, 480, 1.0, mp4_time, 30);
    app.project.item(1).openInViewer(); // コンポジションを開く わからんからとりあえず1
    return test_comp_index;
}

// 引数で指定したimgファイルを読み込む
function IMG_FILE_READ_MODULE(img_file_index) {
    var img = app.project.importFile(new ImportOptions(img_file_index));
    return img;
}

// 引数で指定したコンポジションに，引数で指定したimgファイルを追加する
function LAYERS_ADD_IMG_FILE_MODULE(test_comp_index, img_file_index) {
    var test_layers_index = test_comp_index.layers.add(img_file_index);
    return test_layers_index;
}

// 画像の大きさをフィットするように変える
function IMG_SIZE_FIT(img, test_layers_index) {
    var img_width = img.width;
    var img_height = img.height;
    fit_x = (720/img_width)*100;
    fit_y = (480/img_height)*100;
    test_layers_index.scale.setValue([fit_x, fit_y]);
}

// 引数で指定したレイヤーに拡大するエフェクトを付ける
function EFFECT_ZOOM_IN_MODULE(test_layers_index, start_time, end_time) {
    // 拡大
    var scale_effect = test_layers_index.scale;
    scale_effect.setValueAtTime(start_time, [100, 100]); // 0秒の時サイズ10%
    scale_effect.setValueAtTime(end_time, [150, 150]); // 3秒の時サイズ100%
}

// 引数で指定したレイヤーに縮小するエフェクトを付ける
function EFFECT_ZOOM_OUT_MODULE(test_layers_index, start_time, end_time) {
    var scale_effect = test_layers_index.scale;
    scale_effect.setValueAtTime(start_time, [150, 150]); // 0秒の時サイズ10%
    scale_effect.setValueAtTime(end_time, [100, 100]); // 3秒の時サイズ100%
}

// 引数で指定したレイヤーにレンズフレアエフェクトを付ける
function EFFECT_LENS_FLARE_MODULE(test_layers_index, start_time, end_time) {
    test_layers_index.property("Effects").addProperty("ADBE Lens Flare"); // レンズフレアを表示
    test_layers_index.property("Effects").property("ADBE Lens Flare").property(1).setValueAtTime(start_time, [50, 50]); // 入れ子構造 画像の下のレンズフレアの下の光源の位置を変更
    test_layers_index.property("Effects").property("ADBE Lens Flare").property(1).setValueAtTime(end_time, [200, 200]);
}

// 引数で指定したレイヤーにコントラストを付ける
function EFFECT_CONTRAST_MODULE(test_layers_index, start_time, end_time) {
    test_layers_index.property("Effects").addProperty("ADBE Brightness & Contrast 2");
    test_layers_index.property("Effects").property("ADBE Brightness & Contrast 2").property(1).setValueAtTime(start_time, -100);
    test_layers_index.property("Effects").property("ADBE Brightness & Contrast 2").property(1).setValueAtTime(end_time, 50);
    test_layers_index.property("Effects").property("ADBE Brightness & Contrast 2").property(2).setValueAtTime(start_time, -100);
    test_layers_index.property("Effects").property("ADBE Brightness & Contrast 2").property(2).setValueAtTime(end_time, 100);
}

// 引数で指定したレイヤーに波紋エフェクトを付ける
function EFFECT_RAIN_MODULE(test_layers_index, start_time, end_time) {
    test_layers_index.property("Effects").addProperty("ADBE Ripple");
    test_layers_index.property("Effects").property("ADBE Ripple").property(1).setValueAtTime(start_time, 0);
    test_layers_index.property("Effects").property("ADBE Ripple").property(1).setValueAtTime(end_time, 100);
    test_layers_index.property("Effects").property("ADBE Ripple").property(5).setValue(50);
}

// 引数で指定したレイヤーに集中線エフェクトを付ける
function EFFECT_CENTRAL_LINE_MODULE(test_layers_index, start_time, end_time) {
    test_layers_index.property("Effects").addProperty("CC Light Burst 2.5");
    test_layers_index.property("Effects").property("CC Light Burst 2.5").property(3).setValueAtTime(start_time, 30);
    test_layers_index.property("Effects").property("CC Light Burst 2.5").property(3).setValueAtTime(end_time, 0);
}

// 引数で指定したレイヤーにキラキラエフェクトを付ける
function EFFECT_KIRAKIRA_MODULE(test_layers_index, start_time, end_time) {
    test_layers_index = LAYERS_ADD_IMG_FILE_MODULE (test_comp_index, img); // レイヤーにimgファイルを追加
    test_layers_index.inPoint = start_time; // 画像の開始時間
    test_layers_index.outPoint = end_time; // 画像の終了時間
    IMG_SIZE_FIT (img, test_layers_index);

    test_layers_index.property("Effects").addProperty("CC Particle World");
    test_layers_index.property("Effects").property("CC Particle World").property(15).setValue(15);
    test_layers_index.property("Effects").property("CC Particle World").property(53).setValue(2);
    test_layers_index.property("Effects").property("CC Particle World").property(18).setValue(-0.3);
    test_layers_index.property("Effects").property("CC Particle World").property(21).setValue(0.6);
    test_layers_index.property("Effects").property("CC Particle World").property(71).setValue([255, 255, 255]);
    test_layers_index.property("Effects").property("CC Particle World").property(63).setValue(0.5);
}

// 引数で指定したレイヤーに音符エフェクトを付ける
function EFFECT_NOTES_MODULE(test_layers_index, start_time, end_time) {
    var this_layers_index = LAYERS_ADD_IMG_FILE_MODULE (test_comp_index, img); // レイヤーにimgファイルを追加
    this_layers_index.inPoint = temp; // 画像の開始時間
    this_layers_index.outPoint = temp + img_time; // 画像の終了時間
    IMG_SIZE_FIT (img, this_layers_index);
//C:/Users/hayak/work/git/AutoVideo/autoVideo/
    var notes_img_index = new File("C:/Users/hayak/work/git/AutoVideo/autoVideo/effects_img/onp_v2.png"); // imgファイルのパス
    var notes_img = IMG_FILE_READ_MODULE (notes_img_index); // imgファイル読み込み
    test_layers_index = LAYERS_ADD_IMG_FILE_MODULE (test_comp_index, notes_img); // レイヤーにimgファイルを追加
    test_layers_index.inPoint = start_time; // 画像の開始時間
    test_layers_index.outPoint = end_time; // 画像の終了時間

    test_layers_index.property("Effects").addProperty("CC Particle World");
    test_layers_index.property("Effects").property("CC Particle World").property(28).setValue(0.1);
    test_layers_index.property("Effects").property("CC Particle World").property(14).setValue(0.5);
    test_layers_index.property("Effects").property("CC Particle World").property(17).setValue(0.2);
    test_layers_index.property("Effects").property("CC Particle World").property(18).setValue(-0.6);
    test_layers_index.property("Effects").property("CC Particle World").property(20).setValue(0.8);
    test_layers_index.property("Effects").property("CC Particle World").property(53).setValue(14);
    test_layers_index.property("Effects").property("CC Particle World").property(55).setValue(1);
    test_layers_index.property("Effects").property("CC Particle World").property(62).setValue(1);
    test_layers_index.property("Effects").property("CC Particle World").property(64).setValue(1.5);
}

// 引数で指定したレイヤーにハートエフェクトを付ける
function EFFECT_HEART_MODULE(test_layers_index, start_time, end_time) {
    var this_layers_index = LAYERS_ADD_IMG_FILE_MODULE (test_comp_index, img); // レイヤーにimgファイルを追加
    this_layers_index.inPoint = temp; // 画像の開始時間
    this_layers_index.outPoint = temp + img_time; // 画像の終了時間
    IMG_SIZE_FIT (img, this_layers_index);
//C:/Users/hayak/work/git/AutoVideo/autoVideo/
    var heart_img_index = new File("C:/Users/hayak/work/git/AutoVideo/autoVideo/effects_img/heart.png"); // imgファイルのパス
    var heart_img = IMG_FILE_READ_MODULE (heart_img_index); // imgファイル読み込み
    test_layers_index = LAYERS_ADD_IMG_FILE_MODULE (test_comp_index, heart_img); // レイヤーにimgファイルを追加
    test_layers_index.inPoint = start_time; // 画像の開始時間
    test_layers_index.outPoint = end_time; // 画像の終了時間

    test_layers_index.property("Effects").addProperty("CC Particle World");

    test_layers_index.property("Effects").property("CC Particle World").property(28).setValue(0.1);
    test_layers_index.property("Effects").property("CC Particle World").property(14).setValue(0.5);
    test_layers_index.property("Effects").property("CC Particle World").property(17).setValue(0.2);
    test_layers_index.property("Effects").property("CC Particle World").property(18).setValue(-0.6);
    test_layers_index.property("Effects").property("CC Particle World").property(20).setValue(0.8);
    test_layers_index.property("Effects").property("CC Particle World").property(53).setValue(14);
    test_layers_index.property("Effects").property("CC Particle World").property(55).setValue(1);
    test_layers_index.property("Effects").property("CC Particle World").property(62).setValue(1);
    test_layers_index.property("Effects").property("CC Particle World").property(64).setValue(1.5);
}

// 引数で指定したコンポジションのmp4ファイルの出力
function MP4_OUTPUT_MODULE(test_comp_index, output_index) {
    var renq = app.project.renderQueue.items.add(test_comp_index); // レンダーキューに追加
    var OM = renq.outputModules[1];
    OM.applyTemplate("ロスレス圧縮");
    //OM.file = new File("C:/Users/ryo08/Desktop/AE/auto_render.mp4");
    OM.file = output_index;
    app.project.renderQueue.queueInAME(true);
}

// CC Particle Worldの引数
    // 14 Birth Rate
    // 15 Longevity
    // 17 PositionX 22 RadiusZ
    // 26 Velocity  31 Extra Angle
    // 33 Floor Position 39 Bounce ...d
    // 42 Axis X 44 Axis Z
    // 47 Gravity X 49 Gravity Z
    // 53 Particle Type
    // 63 Birth Size

// 各種プログラムの説名
// app.project.items.length 現在のプロジェクトのファイルの総数
// app.project.items[n].name n番目のファイルの名前
// app.project.renderQueue.items.add(test_comp) コンポジションをレンダーキューに追加
//alert(""); // アラート

//app.project.items.addFolder("test"); // フォルダの作成
//app.project.items.addComp("test", 720, 480, 1.0, 3, 30); // コンポジションの作成 名前, 横, 縦, 比, 秒数, フレームレート

// 渡す形式
// ファイル
// json ｃｓｖ ｔｘｔ

/*
file.encoding = 'UTF8';
//file.lineFeed = 'Macintosh';
file.open('r', undefined, undefined);
var content = file.read();
file.close();
var lines = content.split('\n');
var data = [];
var keys = lines[0].split(',');
for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var cells = lines[i].split(',');
    obj[keys[0]] = cells[0];
    obj[keys[1]] = cells[1];
    obj[keys[2]] = cells[2];
    obj[keys[3]] = cells[3];
    obj[keys[4]] = cells[4];
    data.push(obj);
    }
alert(data.toSource());

var flag = false;
// コンポジションがすでにあったらコンポジションを作らない
for (i = 1; i < app.project.items.length; i++) {
    if (app.project.item(i) instanceof CompItem) {
        flag = true;
    }
}
if (flag == false) {
    //var test_comp = app.project.items.addComp("test", 720, 480, 1.0, 3, 30);
    //var test_img = app.project.importFile(new ImportOptions(File("C:/Users/ryo08/Desktop/AE/0c66c9b4f6affa16913661a3b350e035_s.jpg"))); // 画像ファイルの読み込み
    //var test_layers = test_comp.layers.add(test_img);
    // 拡大
    //scale_effect = test_layers.scale;
    //scale_effect.setValueAtTime(0, [10, 10]); // 0秒の時サイズ10%
    //scale_effect.setValueAtTime(3, [100, 100]); // 3秒の時サイズ100%
}
//test_layers("rotation").expression = 'time*30'; // 回転
//var newScale = [20, 20];
//test_layers("scale").setValue(newScale); // newScaleの大きさに変更
//test_layers.threeDLayer = true; // 3D回転のための準備
//test_layers("rotationX").setValue(0); // 3D回転
*/
