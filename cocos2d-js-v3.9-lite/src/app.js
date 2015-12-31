/*==========
 Ch02-012:
 Cocos2d-js(Lite)
 ==========*/

var levelIndex = 0;
var levelArray = [
	[2.0,  30],[2.0,  60],[2.0,  90],[2.0, 120],[2.0, 150],
	[2.0, 180],[2.0, 210],[2.0, 240],[2.0, 270],[2.0, 300],
	[1.0,  30],[1.0,  60],[1.0,  90],[1.0, 120],[1.0, 150],
	[1.0, 180],[1.0, 210],[1.0, 240],[1.0, 270],[1.0, 300]
]; 

// シーン
var HelloWorldScene = cc.Scene.extend({

	onEnter:function(){
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});

// レイヤー
var HelloWorldLayer = cc.Layer.extend({
	
	self:null,
	dispSize:null,
	backSprite:null,
	playerSprite:null,
	spikeArray:null,
	spikePaddingY:null,
	spikeOffsetY:null,
	spikePosY:null,
	scoreSprite:null,

	ctor:function(){
		this._super();

		// Self
		self = this;
		
		// ディスプレイサイズ
		dispSize = cc.director.getWinSize();

		// 背景
		backSprite = new BackgroundNode("res/background_640x960.png");
		backSprite.setAnchorPoint(cc.p(0.5, 0.0));
		backSprite.setPosition(cc.p(0.0, 0.0));
		this.addChild(backSprite);
		
		// プレイヤー
		playerSprite = new PlayerSprite("res/player.png");
		playerSprite.setAnchorPoint(cc.p(0.5, 0.5));
		playerSprite.setPosition(cc.p(
			dispSize.width * 0.5, dispSize.height * 0.2));
		backSprite.addChild(playerSprite);

		// 障害物
		spikeArray = new Array();
		spikePaddingY = 100;
		spikeOffsetY = playerSprite.y + spikePaddingY;// 障害物の発生箇所の調整
		spikePosY = 0.0;
		for(var i=0; i<15; i++){
			var spikeSprite = new SpikeSprite("res/spike.png");
			spikeSprite.setAnchorPoint(cc.p(0.5, 0.5));
			var x = dispSize.width * Math.random();
			var y = spikeOffsetY + spikePaddingY * i;
			if(spikePosY < y) spikePosY = y;
			spikeSprite.setPosition(cc.p(x, y));
			spikeSprite.slide(
				levelArray[levelIndex][0],
				levelArray[levelIndex][1]);
			if(levelIndex < levelArray.length-1){
				levelIndex++;
			}else{
				levelIndex = 0;
			}
			spikeArray.push(spikeSprite);
			backSprite.addChild(spikeSprite);
		}

		// スコア
		scoreSprite = new ScoreSprite("res/background_score.png");
		scoreSprite.setAnchorPoint(cc.p(1.0, 1.0));
		scoreSprite.setPosition(cc.p(
			dispSize.width-5.0, dispSize.height-5.0));
		scoreSprite.initScore(playerSprite.y);
		scoreSprite.setScore(playerSprite.y);
		this.addChild(scoreSprite);

		// タッチイベント
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:function(touch, event){
				//cc.log("onTouchBegan");
				var touchX = touch.getLocationX();
				if(touchX < dispSize.width / 2){
					playerSprite.jumpLeft();
				}else{
					playerSprite.jumpRight();
				}
				return true;
			},
			onTouchMoved:function(touch, event){
				//cc.log("onTouchMoved");
			},
			onTouchEnded:function(touch, event){
				//cc.log("onTouchEnded");
			}}, this);

		// スケジュール
		this.scheduleUpdate();

		return true;
	},
	update:function(dt){

		// 背景
		backSprite.update(playerSprite);

		// プレイヤーUpdate
		playerSprite.update(dt);

		// 障害物
		for(var i=0; i<spikeArray.length; i++){
			var spikeSprite = spikeArray[i];

			// 画面外判定
			if(spikeSprite.y < -backSprite.y){
				// 再配置
				var spikeSprite = spikeArray[i];
				var x = dispSize.width * Math.random();
				var y = spikePosY + spikePaddingY;
				spikePosY = y;
				spikeSprite.x = x;
				spikeSprite.y = y;
				spikeSprite.stop();
				spikeSprite.slide(
					levelArray[levelIndex][0],
					levelArray[levelIndex][1]);
				if(levelIndex < levelArray.length-1){
					levelIndex++;
				}else{
					levelIndex = 0;
				}
			}else{
				// 衝突判定
				if(playerSprite.collision(spikeSprite)){
					// ゲームオーバー
					self.gameOver();
				}
			}
		}

		// ゲームオーバー判定
		if(playerSprite.y < -backSprite.y){
			playerSprite.land(-backSprite.y);
			self.gameOver();
		}

		// スコアを更新
		scoreSprite.setScore(playerSprite.y);
	},
	gameOver:function(){
		cc.log("gameOver");
		cc.eventManager.removeListener(this);
		this.unscheduleUpdate();

		// ゲームオーバーアニメーション
		var titleGameover = new GameOverSprite("res/title_gameover.png");
		titleGameover.setAnchorPoint(cc.p(0.5, 0.5));
		titleGameover.setPosition(cc.p(dispSize.width*0.5, dispSize.height*0.5));
		titleGameover.start(1.0, 50.0);
		this.addChild(titleGameover);
	}
});