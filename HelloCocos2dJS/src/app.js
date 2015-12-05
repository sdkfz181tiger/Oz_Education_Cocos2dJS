/*==========
 Ch02-002:
 プレイヤークラス(Update)
 ==========*/

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

	ctor:function(){
		this._super();

		// Self
		self = this;
		
		// ディスプレイサイズ
		dispSize = cc.Director.getInstance().getWinSize();

		// 背景
		backSprite = new BackgroundSprite("res/background_640x960.png");
		backSprite.setAnchorPoint(cc.p(0.5, 0.0));
		backSprite.setPosition(cc.p(
			dispSize.width * 0.5,
			dispSize.height * 0.0
		));
		this.addChild(backSprite);
		
		// プレイヤー
		playerSprite = new PlayerSprite("res/oyadius.png");
		playerSprite.setAnchorPoint(cc.p(0.5, 0.5));
		playerSprite.setPosition(cc.p(
			backSprite.getBoundingBox().width * 0.5,
			backSprite.getBoundingBox().height * 0.2
		));
		backSprite.addChild(playerSprite);

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

		// プレイヤー落下判定
		if(playerSprite.y < 0.0){
			playerSprite.land(0.0);
		}

		// ゲームオーバー判定
		//self.gameOver();
	},
	gameOver:function(){
		cc.log("gameOver");
		cc.eventManager.removeListener(this);
		this.unscheduleUpdate();
	}
});

// 背景クラス
var BackgroundSprite = cc.Sprite.extend({

	borderY:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);

		borderY = this.getBoundingBox().height * 0.8;
	},
	update:function(playerSprite){

		if(borderY < playerSprite.y){
			var disY = playerSprite.y - borderY;
			this.y -= disY; // ボジションを移動
			borderY += disY;// ボーダー基準を更新
		}
	}
});

// プレイヤークラス
var PlayerSprite = cc.Sprite.extend({

	jumpFlg:null,
	vX:null,
	vY:null,
	jumpX:null,
	jumpY:null,
	gravityY:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);

		jumpFlg = false;
		vX = 0.0;
		vY = 0.0;
		jumpX = 120.0;
		jumpY = 240.0;
		gravityY = -9.8;
	},
	update:function(dt){

		this.x += vX * dt;
		this.y += vY * dt;
		if(jumpFlg == true){
			vY += gravityY;
		}
	},
	jumpLeft:function(){

		jumpFlg = true;
		vX = -jumpX;
		vY = +jumpY;
	},
	jumpRight:function(){

		jumpFlg = true;
		vX = +jumpX;
		vY = +jumpY;
	},
	land:function(groundY){

		jumpFlg = false;
		vX = 0.0;
		vY = 0.0;
		this.y = groundY;
	}
});

// 障害物クラス
var SpikeSprite = cc.Sprite.extend({

	jumpingFlg:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);

		jumpingFlg = false;
	},
	jump:function(){
		if(jumpingFlg == true) return;
		jumpingFlg = true;
		var jBy = cc.jumpBy(0.2, cc.p(0, 0), 60, 1);
		var cFunc = cc.callFunc(this.jumpDone, this);
		this.stopAllActions();
		this.runAction(cc.sequence([jBy, cFunc]));
	},
	jumpDone:function(){
		cc.log("jumpDone");
		jumpingFlg = false;
	}
});