/*==========
 Ch02-012:
 Cocos2d-js(Lite)
 ==========*/

// レイヤー
var HelloWorldLayer = cc.Layer.extend({
	
	self:null,
	gameManager:null,
	backSprite:null,
	playerSprite:null,
	playerAnimationJump:null,
	spikeArray:null,
	gameoverSprite:null,
	scoreSprite:null,

	ctor:function(){
		this._super();

		self = this;// Self
		gameManager = new ozateck.GameManager();// GameManager
		var dispSize = cc.director.getWinSize();// Display

		// 背景
		backSprite = gameManager.createBackgroundNode(
			"res/background_640x960.png",
			0.0, 0.0, 0.0, 0.0);
		this.addChild(backSprite);
		
		// プレイヤー
		playerSprite = gameManager.createPlayerSprite(
			"res/cat_base_0.png",
			0.5, 0.5, dispSize.width * 0.5, dispSize.height * 0.2);
		backSprite.addChild(playerSprite);
		
		// プレイヤーアニメーション
		playerAnimationJump = gameManager.createAnimation("cat_jump_s_", 0, 7);

		// 障害物
		spikeArray = new Array();
		var spikePaddingY = 100;
		var spikeOffsetY = playerSprite.y + spikePaddingY;
		for(var i=0; i<15; i++){
			var posX = dispSize.width * Math.random();
			var posY = spikeOffsetY + spikePaddingY * i;
			var spikeSprite = gameManager.createSpikeSprite("res/spike.png",
				0.5, 0.5, posX, posY);
			spikeSprite.slide(1.0, 100.0);
			spikeArray.push(spikeSprite);
			backSprite.addChild(spikeSprite);
		}

		// ゲームオーバーアニメーション
		gameoverSprite = gameManager.createGameoverSprite(
			"res/title_gameover.png",
			0.5, 0.5, dispSize.width*0.5, dispSize.height*0.5);
		this.addChild(gameoverSprite);

		// スコア
		scoreSprite = gameManager.createScoreSprite("res/background_score.png",
			1.0, 1.0, dispSize.width-5.0, dispSize.height-5.0);
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
		backSprite.update(playerSprite);
		playerSprite.update(dt);
		for(var i=0; i<spikeArray.length; i++){
			var spikeSprite = spikeArray[i];
			if(spikeSprite.y < -backSprite.y){
				spikeSprite.removeFromParent();
			}else{
				if(playerSprite.collision(spikeSprite)){
					self.gameOver();// ゲームオーバー
				}
			}
		}
		if(playerSprite.y < -backSprite.y){
			playerSprite.land(-backSprite.y);
			self.gameOver();// ゲームオーバー
		}
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

// シーン
var HelloWorldScene = cc.Scene.extend({

	onEnter:function(){
		this._super();
		cc.spriteFrameCache.addSpriteFrames(
			"res/tx_game_education_01.plist");// Load
		var layer = new HelloWorldLayer();// Layer
		this.addChild(layer);
	},
	onExit:function(){
		cc.spriteFrameCache.removeSpriteFramesFromFile(
			"res/tx_game_education_01.plist");// Unload
	}
});