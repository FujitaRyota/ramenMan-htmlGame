enchant();

window.onload = function() {

    var game_ = new Game(320, 530); // 表示領域の大きさを設定
    var Start = 0;                  //進行スピードフラグ
    var Turbo = 0;                  //
    var TurboTime = 0;
    var bird2_flg = 0;
    var upflg = 0;                  // 障害物が上がるフラグ
    game_.fps = 12;                 // ゲームの進行スピードを設定
    game_.preload(
            './img/start.png', './img/gameover.png', './img/retry_button.png', './img/chara1.png',
            './img/bg1.png', './img/bg2.png', './img/hurdle.png', './img/igaguri.png', './img/bird.png',
            './img/bord.png', './img/bord1.png', './img/Hard.png', './img/easy.png', './img/DANGER.png',
            './img/missile_down.png', './img/star.png', './img/speedup.png', './img/Manual.png', './img/Manual_game.png',
            './img/bird2.png'
        ); // ゲームに使う素材を予め読み込み

    // BGM、効果音準備
    var bgm = new Audio('./sound/bgm2.mp3');
    var bgm1 = new Audio('./sound/bgm4.mp3');
    var bgm2 = new Audio('./sound/bgm5.mp3');
    var audio = new Audio('./sound/jump01.mp3');
    var audio1 = new Audio('./sound/jump02.mp3');
    var audio2 = new Audio('./sound/DedeDonn.mp3');
    var Synopsis = new Audio('./sound/Synopsis.mp3');

    game_.onload = function() { // ゲームの準備が整ったらメインの処理を実行します

        /**
        * タイトルシーン
        *
        * タイトルシーンを作り、返す関数です。
        */
        var createStartScene = function() {

            var scene = new Scene();                   // 新しいシーンを作る
            scene.backgroundColor = '#123';         // シーンの背景色を設定
            Synopsis.play();
            audio2.pause();
            audio2.currentTime = 0;

            // スタート画像設定 ハード
            var startImage = new Sprite(236, 48);      // スプライトを作る
            startImage.image = game_.assets['./img/Hard.png']; // 画像を設定
            startImage.x = 42;                         // 横位置調整
            startImage.y = 110;                        // 縦位置調整
            scene.addChild(startImage);                // シーンに追加

            // スタート画像設定 イージー
            var startImage2 = new Sprite(236, 48);      // スプライトを作る
            startImage2.image = game_.assets['./img/easy.png']; // 画像を設定
            startImage2.x = 42;                         // 横位置調整
            startImage2.y = 168;                        // 縦位置調整
            scene.addChild(startImage2);                // シーンに追加

            // スタート画像設定 激ムズ
            var startImage3 = new Sprite(236, 48);      // スプライトを作る
            startImage3.image = game_.assets['./img/DANGER.png']; // 画像を設定
            startImage3.x = 42;                         // 横位置調整
            startImage3.y = 236;                        // 縦位置調整
            scene.addChild(startImage3);                // シーンに追加

            // タイトルラベル設定
            var title = new Label('駆け抜けろ！らぁめん男！');   // ラベルを作る
            title.width = 320;
            title.textAlign = 'center';                // 文字を中央寄せ
            title.color = '#ffffff';                   // 文字を白色に
            title.x = 0;                               // 横位置調整
            title.y = 68;                              // 縦位置調整
            title.font = '26px sans-serif';            // 28pxのゴシック体にする
            scene.addChild(title);                     // シーンに追加

            // 説明ラベル設定
            var info = new Label('難易度を選択して開始 / タッチでジャンプ'); // ラベルを作る
            info.width = 320;
            info.textAlign = 'center';                 // 文字を中央寄せ
            info.color = '#ffffff';                    // 文字を白色に
            info.x = 0;                                // 横位置調整
            info.y = 222;                              // 縦位置調整
            info.font = '14px sans-serif';             // 28pxのゴシック体にする
            scene.addChild(info);                      // シーンに追加

            // スタート画像設定 ハード
            var infoManual = new Sprite(320, 240);      // スプライトを作る
            infoManual.image = game_.assets['./img/Manual.png']; // 画像を設定
            infoManual.x = 0;                         // 横位置調整
            infoManual.y = 290;                        // 縦位置調整
            scene.addChild(infoManual);                // シーンに追加

            // スタート画像にタッチイベントを設定　ハード
            startImage.addEventListener(Event.TOUCH_START, function(e) {
                Start = 0; //進行スピードフラグ
                // 現在表示しているシーンをゲームシーンに置き換える
                game_.replaceScene(createGameScene());
            });

            // スタート画像にタッチイベントを設定　イージー
            startImage2.addEventListener(Event.TOUCH_START, function(e) {
                // 現在表示しているシーンをゲームシーンに置き換える
                Start = 1; //進行スピードフラグ
                game_.replaceScene(createGameScene());
            });

            // スタート画像にタッチイベントを設定　激ムズ
            startImage3.addEventListener(Event.TOUCH_START, function(e) {
                // 現在表示しているシーンをゲームシーンに置き換える
                Start = 2; //進行スピードフラグ
                game_.replaceScene(createGameScene());
            });
            // タイトルシーンを返します。
            return scene;
        };

        /**
        * ゲームシーン
        *
        * ゲームシーンを作り、返す関数
        */

        var createGameScene = function() {

        if(Start == 0){　//ハード

            bgm.play();
            Synopsis.pause();
            Synopsis.currentTime = 0;

            var scroll = 0; // スクロール量を記録する変数

            // 固定の値であることをわかりやすくするために大文字で書いています
            // 固定の値は「定数」と呼ばれ、言語によっては別の書き方をする場合があります
            // JavaScriptにもconstという書き方がありますが、対応していないブラウザがあるため使っていません
            var GROUND_LINE = 250;   // 地平線の高さ(固定)
            var SCROLL_SPEED = 10;   // スクロールの速さ(固定)
            var up_item = 130;      // スコアアップアイテム

            var scene = new Scene();                   // 新しいシーンをつくる
            scene.backgroundColor = '#8cc820';         // シーンの背景色を設定

            // スクロールする背景1の設定
            var bg1 = new Sprite(320, 320);            // スプライトをつくる
            bg1.image = game_.assets['./img/bg1.png']; // 画像を設定
            bg1.x = 0;                                 // 横位置調整
            bg1.y = 0;                                 // 縦位置調整
            scene.addChild(bg1);                       // シーンに追加

            // スクロールする背景2の設定
            var bg2 = new Sprite(320, 320);            // スプライトをつくる
            bg2.image = game_.assets['./img/bg2.png']; // 画像を設定
            bg2.x = 320;                               // 横位置調整 320px右に配置(bg1の右隣に隙間なく並べる)
            bg2.y = 0;                                 // 縦位置調整
            scene.addChild(bg2);                       // シーンに追加

            // スコア表示用ラベルの設定
            var scoreLabel = new Label("");            // ラベルをつくる
            scoreLabel.color = '#fff';                 // 白色に設定
            scoreLabel.y = 24;                         // 縦位置調整
            scoreLabel.font = '42px sans-serif';        // 96pxのゴシック体にする
            scene.addChild(scoreLabel);                // シーンに追加

            // 説明の設定
            var manual = new Sprite(320, 240);                  // スプライトをつくる
            manual.image = game_.assets['./img/Manual_game.png'];    // 画像を設定
            manual.x = 0;                                       // 横位置調整 画面左側に配置
            manual.y = 320;                                     // 縦位置調整
            scene.addChild(manual);                             // シーンに追加

            // キャラの設定
            var human = new Sprite(32, 32);             // スプライトをつくる
            human.image = game_.assets['./img/chara1.png']; // 画像を設定
            human.x = 80;                               // 横位置調整 画面左側に配置
            human.y = GROUND_LINE - human.height;        // 縦位置調整 キャラの下端を地面の高さに合わせる
            scene.addChild(human);                      // シーンに追加

            // キャラの当たり判定用スプライトの設定
            var human_hit = new Sprite(1, 1);           // スプライトをつくる(幅1, 高さ1)
            // human_hit.image =                        // 画像は設定しない（透明）
            human_hit.x = human.x + human.width / 2;      // 横位置調整 キャラの左右中央に配置
            human_hit.y = human.y + human.height / 2;     // 縦位置調整キャラの上下中央に配置
            scene.addChild(human_hit);                  // シーンに追加

            // ハードルの設定
            var hurdle = new Sprite(50, 100);          // スプライトをつくる
            hurdle.image = game_.assets['./img/hurdle.png']; // 画像を設定
            hurdle.x = -hurdle.width;                  // 横位置調整 画面外に隠しておく
            hurdle.y = GROUND_LINE - hurdle.height;    // 縦位置調整 ハードルの下端を地面の高さと合わせる
            scene.addChild(hurdle);                    // シーンに追加

            // 置物障害物の設定
            var igaguri = new Sprite(42, 31);          // スプライトをつくる
            igaguri.image = game_.assets['./img/igaguri.png']; // 画像を設定
            igaguri.x = -igaguri.width;                // 横位置調整 画面外に隠しておく
            igaguri.y = GROUND_LINE - igaguri.height;  // 縦位置調整 置物障害物下端を地面の高さと合わせる
            scene.addChild(igaguri);                   // シーンに追加

            // ボードの設定
            var bord = new Sprite(60, 40);              // スプライトをつくる
            bord.image = game_.assets['./img/bord.png']; // 画像を設定
            bord.x = -bord.width;                      // 左側の画面外に隠します
            bord.y = GROUND_LINE - bord.height;         // 縦位置調整 下端を地面の高さと合わせる
            scene.addChild(bord);                      // シーンに追加します

            // ミサイルの設定
            var missile_down = new Sprite(42, 31);          // スプライトをつくる
            missile_down.image = game_.assets['./img/missile_down.png']; // 画像を設定
            missile_down.x = -missile_down.width;                // 横位置調整 画面外に隠しておく
            missile_down.y = GROUND_LINE - missile_down.height;  // 縦位置調整 いがぐり下端を地面の高さと合わせる
            scene.addChild(missile_down);

            // 鳥の設定
            var bird = new Sprite(64, 44);             // スプライトをつくる
            bird.image = game_.assets['./img/bird.png']; // 画像を設定
            bird.x = -bird.width;                      // 鳥を左側の画面外に隠します
            bird.y = 120;                              // 鳥の飛ぶ高さを設定します
            scene.addChild(bird);                      // シーンに鳥を追加します

            // 左右する鳥の設定
            var bird2 = new Sprite(64, 44);             // スプライトをつくる
            bird2.image = game_.assets['./img/bird2.png']; // 画像を設定
            bird2.x = -bird2.width;                     // 上下移動の鳥を左側の画面外に隠します
            bird2.y = 120;                              // 上下移動の鳥の飛ぶ高さを設定します
            scene.addChild(bird2);                      // シーンに鳥を追加します

            // マントの設定
            var manto = new Sprite(42, 31);              // スプライトをつくる
            manto.image = game_.assets['./img/speedup.png']; // 画像を設定
            manto.x = -manto.width;                      // 左側の画面外に隠します
            manto.y = 120;                              // 縦位置調整 下端を地面の高さと合わせる
            scene.addChild(manto);                      // シーンに追加します

            // 飛行物の設定
            var bird = new Sprite(64, 44);             // スプライトをつくる
            bird.image = game_.assets['./img/bird.png']; // 画像を設定
            bird.x = -bird.width;                      // 飛行物を左側の画面外に隠します
            bird.y = 120;                              // 飛行物の飛ぶ高さを設定します
            scene.addChild(bird);                      // シーンに飛行物を追加します

            // スコアアップアイテムの設定
            var ScoreUp = new Sprite(42, 31);          // スプライトをつくる
            ScoreUp.image = game_.assets['./img/star.png']; // 画像を設定
            ScoreUp.x = -ScoreUp.width;                // 横位置調整 画面外に隠しておく
            ScoreUp.y = GROUND_LINE - ScoreUp.height;  // 縦位置調整 置物障害物下端を地面の高さと合わせる
            scene.addChild(ScoreUp);                   // シーンに追加

            // キャラがやられた関数
            var humanDead = function() {
                human.frame = 3;                       // キャラを涙目にする
                game_.pushScene(createGameoverScene(scroll)); // ゲームオーバーシーンをゲームシーンに重ねる(push)
            }

            // 加速アイテム取得した時の関数
            var humanTurbo = function() {
                Turbo = 1;
            }

            // ホバリングアイテム関数
            var humanTurbo2 = function() {
                Turbo = 2;
            }

            // 毎フレームイベントをシーンに追加
            scene.addEventListener(Event.ENTER_FRAME, function(){

                scroll += SCROLL_SPEED;                       // 走った距離を記録
                scoreLabel.text = scroll.toString()+'㍍走破'; // スコア表示を更新

                // 障害物の出現タイミングの設定
                // 数字1 % 数字2 と書くと、数字1を数字2で割った余り（余剰）を得ることができます。
                // すなわち、scrollを640で割った余りは、scrollが640, 1280, 1920, …に達した時に0になります。
                if (scroll % 640 === 0) {              // 640m走るごとに
                    hurdle.x = 320;                    // ハードルを右端に移動(出現)
                    hurdle.y = GROUND_LINE - hurdle.height;    // 縦位置調整 ハードルの下端を地面の高さと合わせる
                    upflg += 1;//upflgに1プラス
                    if(upflg === 5){
                        upflg = 0;
                    }
                }
                if (scroll % 560 === 0) {              // 560m走るごとに
                    igaguri.x = 320;                   // 置物障害物を右端に移動(出現)
                }
                if (scroll % 3000 === 0) {             // 3000m走るごとに
                    bird.x = 320;                      // 飛行物を右端に移動(出現)
                }
                if (scroll % 3500 === 0) {             // 3500m走るごとに
                    manto.x = 320;                      // まんとを右端に移動(出現)
                }
                if (scroll % 1800 === 0) {             // 1800m走るごとに
                    ScoreUp.x = 320;                      // スコアアップアイテムを右端に移動(出現)
                }
                if (scroll % 2000 === 0) {              // 2900m走るごとに
                   bird2.x = 320;                      // 左右する飛行物を右端に移動(出現)
                   bird2.y = 20;                       // 鳥の飛ぶ高さを設定します
                   bird2_flg = 0;
                }

                // 障害物のスクロールとキャラとの接触の設定
                if (hurdle.x > -hurdle.width) {       // ハードルが出現している(画面内にある)とき
                    hurdle.x -= SCROLL_SPEED;         // ハードルをスクロール
                    if(upflg === 4){                    //上に上がる
                        if(hurdle.x <230){              //230以下になった上昇
                            hurdle.y -= SCROLL_SPEED;   //上昇
                        }
                    }
                    if (hurdle.intersect(human_hit)) { // ハードルとキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }

                if (igaguri.x > -igaguri.width) {     // 置物障害物が出現している(画面内にある)とき
                    igaguri.x -= SCROLL_SPEED;        // 置物障害物をスクロール
                    if (igaguri.intersect(human_hit)) {// 置物障害物とキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }

                if (bird.x > -bird.width) {           // 飛行物が出現している(画面内にある)とき
                    bird.x -= SCROLL_SPEED * 1.2;     // 飛行物を1.2倍速でスクロール
                    if (bird.frame > 0) {             // 飛行物のフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        bird.frame = 0;
                    } else {
                        bird.frame = 1;
                    }
                    if (bird.intersect(human_hit)) {   // 飛行物とキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }

                if (bird2.x > -bird2.width) {           // 上下する飛行物が出現している(画面内にある)とき
                    if (bird2.frame > 0) {              // 上下する飛行物のフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        bird2.frame = 0;
                    } else {
                        bird2.frame = 1;
                    }
                        if(bird2_flg == 2){             // 左右移動する
                        }else if(bird2.x >300){
                            bird2_flg =0;
                        }else if(bird2.x <100){
                            bird2_flg =1;
                        }
                        if(scroll % 1900 === 0){
                            bird2_flg =2;
                        }
                        if(bird2_flg ==0){
                            bird2.x -= SCROLL_SPEED * 0.8;
                            if(bird2.x <200){
                            bird2.y -= SCROLL_SPEED * 0.8;
                            }else{
                            bird2.y += SCROLL_SPEED * 0.8;
                            }
                        }else if(bird2_flg ==1){
                            bird2.x += SCROLL_SPEED * 0.8;
                            if(bird2.x <200){
                            bird2.y += SCROLL_SPEED * 0.8;
                            }else{
                            bird2.y -= SCROLL_SPEED * 0.8;
                            }
                        }else if(bird2_flg ==2){
                            bird2.x -= SCROLL_SPEED * 5;
                            bird2.y += SCROLL_SPEED * 5;
                        }

                    if (bird2.intersect(human_hit)) {       // 飛行物とキャラがぶつかったとき
                        humanDead();                        // キャラがやられた関数を実行
                    }
                }

                if (bord.x > -bord.width) {             // 加速アイテムが出現している(画面内にある)とき
                    bord.x -= SCROLL_SPEED;             // 加速アイテムをスクロール
                    if (bord.intersect(human_hit)) {    // 加速アイテムと主人公がぶつかったとき
                        Turbo = 1;
                    }
                }

                if (manto.x > -manto.width) {           // マントが出現している(画面内にある)とき
                    manto.x -= SCROLL_SPEED * 1.2;      // マントを1.2倍速でスクロール
                    if (manto.frame > 0) {              // マントのフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        manto.frame = 0;
                    } else {
                        manto.frame = 1;
                    }
                    if (manto.intersect(human_hit)) {   // マントとキャラクターがぶつかったとき
                        humanTurbo2();                  // キャラクターがマントとった関数を実行
                    }
                }

                if (ScoreUp.x > -ScoreUp.width) {     // スコアアップアイテムが出現している(画面内にある)とき
                    ScoreUp.x -= SCROLL_SPEED;        // スコアアップアイテムをスクロール
                    if (ScoreUp.intersect(human_hit)) {// スコアアップアイテムとキャラがぶつかったとき
                        scroll += up_item;
                    }
                }

                // キャラクターのフレームを0, 1, 2, 0, 1, 2..と繰り返す
                // 正確には0, 1, 2, 1, 0, 1, 2, 1, 0, 1...ですが、
                // 0, 1, 2, 0, 1, 2...でも十分走っているように見えるためよいものとします
                human.frame ++;
                if (Turbo == 0){
                    game_.fps = 32;                     //　ゲームの進行スピードを設定
                    if (human.frame > 2) {
                        human.frame = 0;
                    }
                    TurboTime = 0;
                    if (scroll % 800 === 0) {           // 800m走るごとに
                        bord.x = 320;                   // ボードを右端に移動(出現)
                    }
                } else if (Turbo == 1){
                    human.frame = 1;
                    game_.fps = 64;                     // ゲームの進行スピードを設定
                    TurboTime = human.frame;
                    if (scroll % 1800 === 0) {          // 1800m走ると加速状態解除
                        Turbo = 0;
                    }
                }else if (Turbo == 2){
                    human.frame = 4;
                    if (scroll % 1800 === 0) {          // 1800m走ると加速状態解除
                        Turbo = 0;
                    }
                }

                // 当たり判定用スプライトをキャラの上下中心に置く
                human_hit.x = human.x + human.width/2;
                human_hit.y = human.y + human.height/2;

                // 背景をスクロールさせる
                bg1.x -= SCROLL_SPEED;                // 背景1をスクロール
                bg2.x -= SCROLL_SPEED;                // 背景2をスクロール
                if (bg1.x <= -320) {                  // 背景1が画面外に出たら
                    bg1.x = 320;                      // 画面右端に移動
                }
                if (bg2.x <= -320) {                  // 背景2が画面外に出たら
                    bg2.x = 320;                      // 画面右端に移動
                }
            });

            // シーン全体にタッチイベントを追加
            scene.addEventListener(Event.TOUCH_START, function(e){
                // キャラをジャンプさせる
                if(Turbo == 0){
                human.tl.moveBy(0, -140, 14, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 140, 12, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                    audio.play();
                }else if(Turbo == 1){                                       //加速アイテム取得時ジャンプ力約1.2倍
                human.tl.moveBy(0, -240, 21, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 240, 30, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                    audio1.play();
                }else if(Turbo == 2){                                       //ホバリングアイテム取得時ジャンプ力長距離
                human.tl.moveBy(0, -400, 18, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 400, 80, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                }
            });

            //ゲームシーンを返します
            return scene;


        // イージー
        } else if(Start == 1){

            bgm1.play();
            Synopsis.pause();
            Synopsis.currentTime = 0;

            var scroll = 0; // スクロール量を記録する変数

            // 固定の値であることをわかりやすくするために大文字で書いています
            // 固定の値は「定数」と呼ばれ、言語によっては別の書き方をする場合があります
            // JavaScriptにもconstという書き方がありますが、対応していないブラウザがあるため使っていません
            var GROUND_LINE = 250;   // 地平線の高さ(固定)
            var SCROLL_SPEED = 10;   // スクロールの速さ(固定)
            var up_item = 130;      // スコアアップアイテム

            var scene = new Scene();                   // 新しいシーンをつくる
            scene.backgroundColor = '#8cc820';         // シーンの背景色を設定

            // スクロールする背景1の設定
            var bg1 = new Sprite(320, 320);            // スプライトをつくる
            bg1.image = game_.assets['./img/bg1.png']; // 画像を設定
            bg1.x = 0;                                 // 横位置調整
            bg1.y = 0;                                 // 縦位置調整
            scene.addChild(bg1);                       // シーンに追加

            // スクロールする背景2の設定
            var bg2 = new Sprite(320, 320);            // スプライトをつくる
            bg2.image = game_.assets['./img/bg2.png']; // 画像を設定
            bg2.x = 320;                               // 横位置調整 320px右に配置(bg1の右隣に隙間なく並べる)
            bg2.y = 0;                                 // 縦位置調整
            scene.addChild(bg2);                       // シーンに追加

            // スコア表示用ラベルの設定
            var scoreLabel = new Label("");            // ラベルをつくる
            scoreLabel.color = '#fff';                 // 白色に設定
            scoreLabel.y = 24;                         // 縦位置調整
            scoreLabel.font = '42px sans-serif';        // 96pxのゴシック体にする
            scene.addChild(scoreLabel);                // シーンに追加

            // 説明の設定
            var manual = new Sprite(320, 240);                  // スプライトをつくる
            manual.image = game_.assets['./img/Manual_game.png'];    // 画像を設定
            manual.x = 0;                                       // 横位置調整 画面左側に配置
            manual.y = 320;                                     // 縦位置調整
            scene.addChild(manual);                             // シーンに追加

            // キャラの設定
            var human = new Sprite(32, 32);             // スプライトをつくる
            human.image = game_.assets['./img/chara1.png']; // 画像を設定
            human.x = 80;                               // 横位置調整 画面左側に配置
            human.y = GROUND_LINE - human.height;        // 縦位置調整 キャラの下端を地面の高さに合わせる
            scene.addChild(human);                      // シーンに追加

            // キャラの当たり判定用スプライトの設定
            var human_hit = new Sprite(1, 1);           // スプライトをつくる(幅1, 高さ1)
            // human_hit.image =                        // 画像は設定しない（透明）
            human_hit.x = human.x + human.width / 2;      // 横位置調整 キャラの左右中央に配置
            human_hit.y = human.y + human.height / 2;     // 縦位置調整キャラの上下中央に配置
            scene.addChild(human_hit);                  // シーンに追加

            // ハードルの設定
            var hurdle = new Sprite(50, 100);          // スプライトをつくる
            hurdle.image = game_.assets['./img/hurdle.png']; // 画像を設定
            hurdle.x = -hurdle.width;                  // 横位置調整 画面外に隠しておく
            hurdle.y = GROUND_LINE - hurdle.height;    // 縦位置調整 ハードルの下端を地面の高さと合わせる
            scene.addChild(hurdle);                    // シーンに追加

            // 置物障害物の設定
            var igaguri = new Sprite(42, 31);          // スプライトをつくる
            igaguri.image = game_.assets['./img/igaguri.png']; // 画像を設定
            igaguri.x = -igaguri.width;                // 横位置調整 画面外に隠しておく
            igaguri.y = GROUND_LINE - igaguri.height;  // 縦位置調整 置物障害物下端を地面の高さと合わせる
            scene.addChild(igaguri);                   // シーンに追加

            // ボードの設定
            var bord = new Sprite(60, 40);              // スプライトをつくる
            bord.image = game_.assets['./img/bord.png']; // 画像を設定
            bord.x = -bord.width;                      // 左側の画面外に隠します
            bord.y = GROUND_LINE - bord.height;         // 縦位置調整 下端を地面の高さと合わせる
            scene.addChild(bord);                      // シーンに追加します

            // ミサイルの設定
            var missile_down = new Sprite(42, 31);          // スプライトをつくる
            missile_down.image = game_.assets['./img/missile_down.png']; // 画像を設定
            missile_down.x = -missile_down.width;                // 横位置調整 画面外に隠しておく
            missile_down.y = GROUND_LINE - missile_down.height;  // 縦位置調整 いがぐり下端を地面の高さと合わせる
            scene.addChild(missile_down);

            // 鳥の設定
            var bird = new Sprite(64, 44);             // スプライトをつくる
            bird.image = game_.assets['./img/bird.png']; // 画像を設定
            bird.x = -bird.width;                      // 鳥を左側の画面外に隠します
            bird.y = 170;                              // 鳥の飛ぶ高さを設定します
            scene.addChild(bird);                      // シーンに鳥を追加します

            // 上下する鳥の設定
            var bird2 = new Sprite(64, 44);             // スプライトをつくる
            bird2.image = game_.assets['./img/bird2.png']; // 画像を設定
            bird2.x = -bird2.width;                     // 上下移動の鳥を左側の画面外に隠します
            bird2.y = 120;                              // 上下移動の鳥の飛ぶ高さを設定します
            scene.addChild(bird2);                      // シーンに鳥を追加します

            // マントの設定
            var manto = new Sprite(42, 31);              // スプライトをつくる
            manto.image = game_.assets['./img/speedup.png']; // 画像を設定
            manto.x = -manto.width;                      // 左側の画面外に隠します
            manto.y = 120;                              // 縦位置調整 下端を地面の高さと合わせる
            scene.addChild(manto);                      // シーンに追加します

            // スコアアップアイテムの設定
            var ScoreUp = new Sprite(42, 31);          // スプライトをつくる
            ScoreUp.image = game_.assets['./img/star.png']; // 画像を設定
            ScoreUp.x = -ScoreUp.width;                // 横位置調整 画面外に隠しておく
            ScoreUp.y = GROUND_LINE - ScoreUp.height;  // 縦位置調整 置物障害物下端を地面の高さと合わせる
            scene.addChild(ScoreUp);                   // シーンに追加

            // キャラがやられた関数
            var humanDead = function() {
                human.frame = 3;                       // キャラを涙目にする
                game_.pushScene(createGameoverScene(scroll)); // ゲームオーバーシーンをゲームシーンに重ねる(push)
            }

            // 加速アイテム取得した時の関数
            var humanTurbo = function() {
                Turbo = 1;
            }

            // ホバリングアイテム関数
            var humanTurbo2 = function() {
                Turbo = 2;
            }

            // 毎フレームイベントをシーンに追加
            scene.addEventListener(Event.ENTER_FRAME, function(){

                scroll += SCROLL_SPEED;                       // 走った距離を記録
                scoreLabel.text = scroll.toString()+'㍍走破'; // スコア表示を更新

                // 障害物の出現タイミングの設定
                // 数字1 % 数字2 と書くと、数字1を数字2で割った余り（余剰）を得ることができます。
                // すなわち、scrollを640で割った余りは、scrollが640, 1280, 1920, …に達した時に0になります。
                if (scroll % 640 === 0) {                       // 640m走るごとに
                    hurdle.x = 320;                             // ハードルを右端に移動(出現)
                    hurdle.y = GROUND_LINE - hurdle.height;     // 縦位置調整 ハードルの下端を地面の高さと合わせる
                    upflg += 1;                                 //upflgに1プラス
                    if(upflg === 5){
                        upflg = 0;
                    }
                }
                if (scroll % 3000 === 0) {                      // 3000m走るごとに
                    igaguri.x = 320;                            // 置物障害物を右端に移動(出現)
                }
                if (scroll % 1800 === 0) {                      // 2000m走るごとに
                    bird.x = 320;                               // 飛行物を右端に移動(出現)
                }
                if (scroll % 4500 === 0) {                    // 4500m走るごとに
                    manto.x = 320;                            // まんとを右端に移動(出現)
                }
                if (scroll % 1800 === 0) {                      // 1800m走るごとに
                    ScoreUp.x = 320;                            // スコアアップアイテムを右端に移動(出現)
                }

                // 障害物のスクロールとキャラとの接触の設定
                if (hurdle.x > -hurdle.width) {                 // ハードルが出現している(画面内にある)とき
                    hurdle.x -= SCROLL_SPEED;                   // ハードルをスクロール
                    if(upflg === 4){                            // 上に上がる
                        if(hurdle.x <260){                      // 260以下になった上昇
                            hurdle.y -= SCROLL_SPEED;           // 上昇
                        }
                    }
                    if (hurdle.intersect(human_hit)) {          // ハードルとキャラがぶつかったとき
                        humanDead();                            // キャラがやられた関数を実行
                    }
                }
                if (igaguri.x > -igaguri.width) {     // 置物障害物が出現している(画面内にある)とき
                    igaguri.x -= SCROLL_SPEED;        // 置物障害物をスクロール
                    if (igaguri.intersect(human_hit)) {// 置物障害物とキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }
                if (bird.x > -bird.width) {           // 飛行物が出現している(画面内にある)とき
                    bird.x -= SCROLL_SPEED * 1.2;     // 飛行物を1.2倍速でスクロール
                    if (bird.frame > 0) {             // 飛行物のフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        bird.frame = 0;
                    } else {
                        bird.frame = 1;
                    }
                    if (bird.intersect(human_hit)) {   // 飛行物とキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }

                if (bord.x > -bord.width) {             // 加速アイテムが出現している(画面内にある)とき
                    bord.x -= SCROLL_SPEED;             // 加速アイテムをスクロール
                    if (bord.intersect(human_hit)) {    // 加速アイテムと主人公がぶつかったとき
                        Turbo = 1;
                    }
                }

                if (manto.x > -manto.width) {           // マントが出現している(画面内にある)とき
                    manto.x -= SCROLL_SPEED * 1.2;      // マントを1.2倍速でスクロール
                    if (manto.frame > 0) {              // マントのフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        manto.frame = 0;
                    } else {
                        manto.frame = 1;
                    }
                    if (manto.intersect(human_hit)) {   // マントとキャラクターがぶつかったとき
                        humanTurbo2();                  // キャラクターがマントとった関数を実行
                    }
                }

                if (ScoreUp.x > -ScoreUp.width) {     // スコアアップアイテムが出現している(画面内にある)とき
                    ScoreUp.x -= SCROLL_SPEED;        // スコアアップアイテムをスクロール
                    if (ScoreUp.intersect(human_hit)) {// スコアアップアイテムとキャラがぶつかったとき
                        scroll += up_item;
                    }
                }

                // キャラクターのフレームを0, 1, 2, 0, 1, 2..と繰り返す
                // 正確には0, 1, 2, 1, 0, 1, 2, 1, 0, 1...ですが、
                // 0, 1, 2, 0, 1, 2...でも十分走っているように見えるためよいものとします
                human.frame ++;
                if (Turbo == 0){
                    game_.fps = 32;                     //　ゲームの進行スピードを設定
                    if (human.frame > 2) {
                        human.frame = 0;
                    }
                    TurboTime = 0;
                    if (scroll % 2000 === 0) {           // 800m走るごとに
                        bord.x = 320;                   // ボードを右端に移動(出現)
                    }
                } else if (Turbo == 1){
                    human.frame = 1;
                    game_.fps = 64;                     // ゲームの進行スピードを設定
                    TurboTime = human.frame;
                    if (scroll % 1800 === 0) {          // 1800m走ると加速状態解除
                        Turbo = 0;
                    }
                }else if (Turbo == 2){
                    human.frame = 4;
                    if (scroll % 1800 === 0) {          // 1800m走ると加速状態解除
                        Turbo = 0;
                    }
                }

                // 当たり判定用スプライトをキャラの上下中心に置く
                human_hit.x = human.x + human.width/2;
                human_hit.y = human.y + human.height/2;

                // 背景をスクロールさせる
                bg1.x -= SCROLL_SPEED;                // 背景1をスクロール
                bg2.x -= SCROLL_SPEED;                // 背景2をスクロール
                if (bg1.x <= -320) {                  // 背景1が画面外に出たら
                    bg1.x = 320;                      // 画面右端に移動
                }
                if (bg2.x <= -320) {                  // 背景2が画面外に出たら
                    bg2.x = 320;                      // 画面右端に移動
                }
            });

            // シーン全体にタッチイベントを追加
            scene.addEventListener(Event.TOUCH_START, function(e){
                // キャラをジャンプさせる
                if(Turbo == 0){
                human.tl.moveBy(0, -140, 14, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 140, 12, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                    audio.play();
                }else if(Turbo == 1){                                       //加速アイテム取得時ジャンプ力約1.2倍
                human.tl.moveBy(0, -240, 21, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 240, 30, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                    audio1.play();
                }else if(Turbo == 2){                                       //ホバリングアイテム取得時ジャンプ力長距離
                human.tl.moveBy(0, -400, 18, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 400, 80, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                }
            });

            //ゲームシーンを返します
            return scene;

        // 激ムズ
        } else if(Start == 2){

            bgm2.play();
            Synopsis.pause();
            Synopsis.currentTime = 0;

            var scroll = 0; // スクロール量を記録する変数

            // 固定の値であることをわかりやすくするために大文字で書いています
            // 固定の値は「定数」と呼ばれ、言語によっては別の書き方をする場合があります
            // JavaScriptにもconstという書き方がありますが、対応していないブラウザがあるため使っていません
            var GROUND_LINE = 250;   // 地平線の高さ(固定)
            var SCROLL_SPEED = 10;   // スクロールの速さ(固定)
            var up_item = 130;      // スコアアップアイテム

            var scene = new Scene();                   // 新しいシーンをつくる
            scene.backgroundColor = '#8cc820';         // シーンの背景色を設定

            // スクロールする背景1の設定
            var bg1 = new Sprite(320, 320);            // スプライトをつくる
            bg1.image = game_.assets['./img/bg1.png']; // 画像を設定
            bg1.x = 0;                                 // 横位置調整
            bg1.y = 0;                                 // 縦位置調整
            scene.addChild(bg1);                       // シーンに追加

            // スクロールする背景2の設定
            var bg2 = new Sprite(320, 320);            // スプライトをつくる
            bg2.image = game_.assets['./img/bg2.png']; // 画像を設定
            bg2.x = 320;                               // 横位置調整 320px右に配置(bg1の右隣に隙間なく並べる)
            bg2.y = 0;                                 // 縦位置調整
            scene.addChild(bg2);                       // シーンに追加

            // スコア表示用ラベルの設定
            var scoreLabel = new Label("");            // ラベルをつくる
            scoreLabel.color = '#fff';                 // 白色に設定
            scoreLabel.y = 24;                         // 縦位置調整
            scoreLabel.font = '42px sans-serif';        // 96pxのゴシック体にする
            scene.addChild(scoreLabel);                // シーンに追加

            // 説明の設定
            var manual = new Sprite(320, 240);                  // スプライトをつくる
            manual.image = game_.assets['./img/Manual_game.png'];    // 画像を設定
            manual.x = 0;                                       // 横位置調整 画面左側に配置
            manual.y = 320;                                     // 縦位置調整
            scene.addChild(manual);                             // シーンに追加

            // スコアアップアイテムの設定
            var ScoreUp = new Sprite(42, 31);          // スプライトをつくる
            ScoreUp.image = game_.assets['./img/star.png']; // 画像を設定
            ScoreUp.x = -ScoreUp.width;                // 横位置調整 画面外に隠しておく
            ScoreUp.y = GROUND_LINE - ScoreUp.height;  // 縦位置調整 置物障害物下端を地面の高さと合わせる
            scene.addChild(ScoreUp);                   // シーンに追加

            // キャラの設定
            var human = new Sprite(32, 32);             // スプライトをつくる
            human.image = game_.assets['./img/chara1.png']; // 画像を設定
            human.x = 80;                               // 横位置調整 画面左側に配置
            human.y = GROUND_LINE - human.height;        // 縦位置調整 キャラの下端を地面の高さに合わせる
            scene.addChild(human);                      // シーンに追加

            // キャラの当たり判定用スプライトの設定
            var human_hit = new Sprite(1, 1);           // スプライトをつくる(幅1, 高さ1)
            // human_hit.image =                        // 画像は設定しない（透明）
            human_hit.x = human.x + human.width / 2;      // 横位置調整 キャラの左右中央に配置
            human_hit.y = human.y + human.height / 2;     // 縦位置調整キャラの上下中央に配置
            scene.addChild(human_hit);                  // シーンに追加

            // ハードルの設定
            var hurdle = new Sprite(50, 100);          // スプライトをつくる
            hurdle.image = game_.assets['./img/hurdle.png']; // 画像を設定
            hurdle.x = -hurdle.width;                  // 横位置調整 画面外に隠しておく
            hurdle.y = GROUND_LINE - hurdle.height;    // 縦位置調整 ハードルの下端を地面の高さと合わせる
            scene.addChild(hurdle);                    // シーンに追加

            // 置物障害物の設定
            var igaguri = new Sprite(42, 31);          // スプライトをつくる
            igaguri.image = game_.assets['./img/igaguri.png']; // 画像を設定
            igaguri.x = -igaguri.width;                // 横位置調整 画面外に隠しておく
            igaguri.y = GROUND_LINE - igaguri.height;  // 縦位置調整 置物障害物下端を地面の高さと合わせる
            scene.addChild(igaguri);                   // シーンに追加

            // ボードの設定
            var bord = new Sprite(60, 40);              // スプライトをつくる
            bord.image = game_.assets['./img/bord.png']; // 画像を設定
            bord.x = -bord.width;                      // 左側の画面外に隠します
            bord.y = GROUND_LINE - bord.height;         // 縦位置調整 下端を地面の高さと合わせる
            scene.addChild(bord);                      // シーンに追加します

            // ミサイルの設定
            var missile_down = new Sprite(42, 31);          // スプライトをつくる
            missile_down.image = game_.assets['./img/missile_down.png']; // 画像を設定
            missile_down.x = -missile_down.width;                // 横位置調整 画面外に隠しておく
            missile_down.y = GROUND_LINE - missile_down.height;  // 縦位置調整 いがぐり下端を地面の高さと合わせる
            scene.addChild(missile_down);

            // 鳥の設定
            var bird = new Sprite(64, 44);             // スプライトをつくる
            bird.image = game_.assets['./img/bird.png']; // 画像を設定
            bird.x = -bird.width;                      // 鳥を左側の画面外に隠します
            bird.y = 120;                              // 鳥の飛ぶ高さを設定します
            scene.addChild(bird);                      // シーンに鳥を追加します

            // 上下する鳥の設定
            var bird2 = new Sprite(64, 44);             // スプライトをつくる
            bird2.image = game_.assets['./img/bird2.png']; // 画像を設定
            bird2.x = -bird2.width;                     // 上下移動の鳥を左側の画面外に隠します
            bird2.y = 120;                              // 上下移動の鳥の飛ぶ高さを設定します
            scene.addChild(bird2);                      // シーンに鳥を追加します

            // マントの設定
            var manto = new Sprite(42, 31);              // スプライトをつくる
            manto.image = game_.assets['./img/speedup.png']; // 画像を設定
            manto.x = -manto.width;                      // 左側の画面外に隠します
            manto.y = 120;                              // 縦位置調整 下端を地面の高さと合わせる
            scene.addChild(manto);                      // シーンに追加します

            // 飛行物の設定
            var bird = new Sprite(64, 44);             // スプライトをつくる
            bird.image = game_.assets['./img/bird.png']; // 画像を設定
            bird.x = -bird.width;                      // 飛行物を左側の画面外に隠します
            bird.y = 120;                              // 飛行物の飛ぶ高さを設定します
            scene.addChild(bird);                      // シーンに飛行物を追加します

            // キャラがやられた関数
            var humanDead = function() {
                human.frame = 3;                       // キャラを涙目にする
                game_.pushScene(createGameoverScene(scroll)); // ゲームオーバーシーンをゲームシーンに重ねる(push)
            }

            // 加速アイテム取得した時の関数
            var humanTurbo = function() {
                Turbo = 1;
            }

            // ホバリングアイテム関数
            var humanTurbo2 = function() {
                Turbo = 2;
            }

            // 毎フレームイベントをシーンに追加
            scene.addEventListener(Event.ENTER_FRAME, function(){

                scroll += SCROLL_SPEED;                       // 走った距離を記録
                scoreLabel.text = scroll.toString()+'㍍走破'; // スコア表示を更新

                // 障害物の出現タイミングの設定
                // 数字1 % 数字2 と書くと、数字1を数字2で割った余り（余剰）を得ることができます。
                // すなわち、scrollを640で割った余りは、scrollが640, 1280, 1920, …に達した時に0になります。
                if (scroll % 640 === 0) {                       // 640m走るごとに
                    hurdle.x = 320;                             // ハードルを右端に移動(出現)
                    hurdle.y = GROUND_LINE - hurdle.height;     // 縦位置調整 ハードルの下端を地面の高さと合わせる
                    upflg += 1;                                 //upflgに1プラス
                    if(upflg === 5){
                        upflg = 0;
                    }
                }
                if (scroll % 420 === 0) {              // 560m走るごとに
                    igaguri.x = 320;                   // 置物障害物を右端に移動(出現)
                }
                if (scroll % 1100 === 0) {             // 3000m走るごとに
                    bird.x = 320;                      // 飛行物を右端に移動(出現)
                }
                if (scroll % 3500 === 0) {             // 1800m走るごとに
                    manto.x = 320;                      // まんとを右端に移動(出現)
                }
                if (scroll % 2000 === 0) {              // 2000m走るごとに
                    ScoreUp.x = 320;                    // スコアアップアイテムを右端に移動(出現)
                }


                // 障害物のスクロールとキャラとの接触の設定
                if (hurdle.x > -hurdle.width) {       // ハードルが出現している(画面内にある)とき
                    hurdle.x -= SCROLL_SPEED;         // ハードルをスクロール
                    if(upflg === 4){                    //上に上がる
                        if(hurdle.x <230){              //230以下になった上昇
                            hurdle.y -= SCROLL_SPEED;   //上昇
                        }
                    }
                    if (hurdle.intersect(human_hit)) { // ハードルとキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }
                if (igaguri.x > -igaguri.width) {     // 置物障害物が出現している(画面内にある)とき
                    igaguri.x -= SCROLL_SPEED;        // 置物障害物をスクロール
                    if (igaguri.intersect(human_hit)) {// 置物障害物とキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }
                if (bird.x > -bird.width) {           // 飛行物が出現している(画面内にある)とき
                    bird.x -= SCROLL_SPEED * 1.2;     // 飛行物を1.2倍速でスクロール
                    if (bird.frame > 0) {             // 飛行物のフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        bird.frame = 0;
                    } else {
                        bird.frame = 1;
                    }
                    if (bird.intersect(human_hit)) {   // 飛行物とキャラがぶつかったとき
                        humanDead();                   // キャラがやられた関数を実行
                    }
                }

                if (bord.x > -bord.width) {             // 加速アイテムが出現している(画面内にある)とき
                    bord.x -= SCROLL_SPEED;             // 加速アイテムをスクロール
                    if (bord.intersect(human_hit)) {    // 加速アイテムと主人公がぶつかったとき
                        Turbo = 1;
                    }
                }

                if (manto.x > -manto.width) {           // マントが出現している(画面内にある)とき
                    manto.x -= SCROLL_SPEED * 1.2;      // マントを1.2倍速でスクロール
                    if (manto.frame > 0) {              // マントのフレーム番号を0, 1, 0, 1と切り替えて羽ばたかせる
                        manto.frame = 0;
                    } else {
                        manto.frame = 1;
                    }
                    if (manto.intersect(human_hit)) {   // マントとキャラクターがぶつかったとき
                        humanTurbo2();                  // キャラクターがマントとった関数を実行
                    }
                }

                if (ScoreUp.x > -ScoreUp.width) {     // スコアアップアイテムが出現している(画面内にある)とき
                    ScoreUp.x -= SCROLL_SPEED;        // スコアアップアイテムをスクロール
                    if (ScoreUp.intersect(human_hit)) {// スコアアップアイテムとキャラがぶつかったとき
                        scroll += up_item;
                    }
                }

                // キャラクターのフレームを0, 1, 2, 0, 1, 2..と繰り返す
                // 正確には0, 1, 2, 1, 0, 1, 2, 1, 0, 1...ですが、
                // 0, 1, 2, 0, 1, 2...でも十分走っているように見えるためよいものとします
                human.frame ++;
                if (Turbo == 0){
                    game_.fps = 32;                     //　ゲームの進行スピードを設定
                    if (human.frame > 2) {
                        human.frame = 0;
                    }
                    TurboTime = 0;
                    if (scroll % 1300 === 0) {           // 800m走るごとに
                        bord.x = 320;                   // ボードを右端に移動(出現)
                    }
                } else if (Turbo == 1){
                    human.frame = 1;
                    game_.fps = 64;                     // ゲームの進行スピードを設定
                    TurboTime = human.frame;
                    if (scroll % 1800 === 0) {          // 1800m走ると加速状態解除
                        Turbo = 0;
                    }
                }else if (Turbo == 2){
                    human.frame = 4;
                    if (scroll % 1800 === 0) {          // 1800m走ると加速状態解除
                        Turbo = 0;
                    }
                }

                // 当たり判定用スプライトをキャラの上下中心に置く
                human_hit.x = human.x + human.width/2;
                human_hit.y = human.y + human.height/2;

                // 背景をスクロールさせる
                bg1.x -= SCROLL_SPEED;                // 背景1をスクロール
                bg2.x -= SCROLL_SPEED;                // 背景2をスクロール
                if (bg1.x <= -320) {                  // 背景1が画面外に出たら
                    bg1.x = 320;                      // 画面右端に移動
                }
                if (bg2.x <= -320) {                  // 背景2が画面外に出たら
                    bg2.x = 320;                      // 画面右端に移動
                }
            });

            // シーン全体にタッチイベントを追加
            scene.addEventListener(Event.TOUCH_START, function(e){
                // キャラをジャンプさせる
                if(Turbo == 0){
                human.tl.moveBy(0, -140, 14, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 140, 12, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                    audio.play();
                }else if(Turbo == 1){                                       //加速アイテム取得時ジャンプ力約1.2倍
                human.tl.moveBy(0, -240, 21, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 240, 30, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                    audio1.play();
                }else if(Turbo == 2){                                       //ホバリングアイテム取得時ジャンプ力長距離
                human.tl.moveBy(0, -400, 18, enchant.Easing.CUBIC_EASEOUT)  // 12フレームかけて現在の位置から上に120px移動
                       .moveBy(0, 400, 80, enchant.Easing.CUBIC_EASEIN);    // 12フレームかけて現在の位置から下に120px移動
                }
            });

            //ゲームシーンを返します
            return scene;
        }
}


        /**
        * ゲームオーバーシーン
        *
        * ゲームオーバーシーンを作り、返す関数です。
        */
        var createGameoverScene = function(scroll) {

            var scene = new Scene();                                   // 新しいシーンを作る
            scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';              // シーンの背景色を設定

            audio2.play();
            bgm.pause();
            bgm.currentTime = 0;
            bgm1.pause();
            bgm1.currentTime = 0;
            bgm2.pause();
            bgm2.currentTime = 0;

            // ゲームオーバー画像を設定
            var gameoverImage = new Sprite(189, 97);                   // スプライトを作る
            gameoverImage.image = game_.assets['./img/gameover.png'];  // 画像を設定
            gameoverImage.x = 66;                                      // 横位置調整
            gameoverImage.y = 170;                                     // 縦位置調整
            scene.addChild(gameoverImage);                             // シーンに追加

            // リトライボタンを設定
            var buttonRetry = new Sprite(320, 32);                     // スプライトを作る
            buttonRetry.image = game_.assets['./img/retry_button.png'];// 画像を設定
            buttonRetry.x = 0;                                         // 横位置調整
            buttonRetry.y = 284;                                       // 縦位置調整
            scene.addChild(buttonRetry);                               // シーンに追加

            // リトライボタンにタッチイベントを追加する
            buttonRetry.addEventListener(Event.TOUCH_END, function(){
                game_.popScene();                                      // このシーンを剥がす（pop）
                game_.replaceScene(createStartScene());                // ゲームシーンをタイトルシーンと入れ替える(replace)
                upflg = 0;                                             // アップフラグを0に戻す
                Turbo = 0;
            });

            // スコア表示用ラベルの設定
            var scoreLabel = new Label(scroll.toString());             // ラベルを作る
            scoreLabel.width = 320;                                    // 幅を設定
            scoreLabel.textAlign = 'center';                           // 文字を中央寄せ
            scoreLabel.color = '#ffffff';                              // 文字を白色に
            scoreLabel.x = 0;                                          // 横位置調整
            scoreLabel.y = 12;                                         // 縦位置調整
            scoreLabel.font = '96px sans-serif';                       // 96pxのゴシック体にする
            scene.addChild(scoreLabel);                                // シーンに追加

            // スコア説明ラベル設定
            var scoreInfoLabel = new Label('㍍走り抜いた');            // ラベルを作る
            scoreInfoLabel.width = 320;                                // 幅を設定
            scoreInfoLabel.textAlign = 'center';                       // 文字を中央寄せ
            scoreInfoLabel.color = '#ffffff';                          // 文字を白色に
            scoreInfoLabel.x = 0;                                      // 横位置調整
            scoreInfoLabel.y = 130;                                    // 縦位置調整
            scoreInfoLabel.font = '32px sans-serif';                   // 32pxのゴシック体にする
            scene.addChild(scoreInfoLabel);                            // シーンに追加

            // ゲームオーバーシーンを返します。
            return scene;

        };

        // ゲームの_rootSceneをスタートシーンに置き換える
        game_.replaceScene(createStartScene());
    }

    game_.start(); // ゲームをスタートさせます

}
