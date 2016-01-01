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

		// SpriteSheet(Load)
		cc.spriteFrameCache.addSpriteFrames("res/tx_game_education_01.plist");

		// Layer
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	},
	onExit:function(){
		// SpriteSheet(Unload)
		cc.spriteFrameCache.removeSpriteFramesFromFile("res/tx_game_education_01.plist");
	}
});

// レイヤー
var HelloWorldLayer = cc.Layer.extend({
	
	self:null,
	gameManager:null,
	dispSize:null,
	backSprite:null,
	playerSprite:null,
	playerAnimationJump:null,
	spikeArray:null,
	spikePaddingY:null,
	spikeOffsetY:null,
	spikePosY:null,
	gameoverSprite:null,
	scoreSprite:null,

	ctor:function(){
		this._super();

		// Self
		self = this;

		// GameManager
		gameManager = new ozateck.GameManager();
		
		// ディスプレイサイズ
		dispSize = cc.director.getWinSize();

		// 背景
		backSprite = gameManager.createBackgroundNode("res/background_640x960.png",
			0.0, 0.0, 0.0, 0.0);
		this.addChild(backSprite);
		
		// プレイヤー
		playerSprite = gameManager.createPlayerSprite("res/cat_base_0.png", 
			0.5, 0.5, dispSize.width * 0.5, dispSize.height * 0.2);
		backSprite.addChild(playerSprite);
		
		// プレイヤーアニメーション
		playerAnimationJump = gameManager.createAnimation("cat_jump_s_", 0, 7);

		// 障害物
		spikeArray = new Array();
		spikePaddingY = 100;
		spikeOffsetY = playerSprite.y + spikePaddingY;// 障害物の発生箇所の調整
		spikePosY = 0.0;
		for(var i=0; i<15; i++){
			var posX = dispSize.width * Math.random();
			var posY = spikeOffsetY + spikePaddingY * i;
			if(spikePosY < posY) spikePosY = posY;
			var spikeSprite = gameManager.createSpikeSprite("res/spike.png",
				0.5, 0.5, posX, posY);
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

		// ゲームオーバーアニメーション
		gameoverSprite = gameManager.createGameoverSprite("res/title_gameover.png",
			0.5, 0.5, dispSize.width*0.5, dispSize.height*0.5);
		this.addChild(gameoverSprite);

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
					playerSprite.jumpLeft(playerAnimationJump);
				}else{
					playerSprite.jumpRight(playerAnimationJump);
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
				var posX = dispSize.width * Math.random();
				var posY = spikePosY + spikePaddingY;
				spikePosY = posY;
				var spikeSprite = spikeArray[i];
				spikeSprite.x = posX;
				spikeSprite.y = posY;
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
		gameoverSprite.show(1.0, 50.0);
	}
});