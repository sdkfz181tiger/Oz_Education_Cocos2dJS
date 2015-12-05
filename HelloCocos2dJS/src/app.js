/*==========
 Ch01-001:
 Spriteを表示する
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
	playerSprite:null,

	ctor:function(){
		this._super();

		// Self
		self = this;
		
		// ディスプレイサイズ
		dispSize = cc.Director.getInstance().getWinSize();
		
		// プレイヤー
		playerSprite = new PlayerSprite("res/oyadius.png");
		playerSprite.setAnchorPoint(cc.p(0.5, 0.5));
		playerSprite.setPosition(cc.p(
			dispSize.width / 2,
			dispSize.height / 2
		));
		this.addChild(playerSprite);

		// タッチイベント
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:function(touch, event){
				//cc.log("onTouchBegan");
				playerSprite.jump();
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
		cc.log("update" + dt);
		this.gameOver();
	},
	gameOver:function(){
		cc.log("gameOver");
		cc.eventManager.removeListener(this);
		this.unscheduleUpdate();
	}
});

// プレイヤークラス
var PlayerSprite = cc.Sprite.extend({

	jumpingFlg:false,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);
	},
	jump:function(){
		if(this.jumpingFlg == true) return;
		this.jumpingFlg = true;
		var jBy = cc.jumpBy(0.2, cc.p(0, 0), 60, 1);
		var cFunc = cc.callFunc(this.jumpDone, this);
		this.stopAllActions();
		this.runAction(cc.sequence([jBy, cFunc]));
	},
	jumpDone:function(){
		cc.log("jumpDone");
		this.jumpingFlg = false;
	}
});