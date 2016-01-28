
var HelloWorldLayer = cc.Layer.extend({

	self:null,
	dispSize:null,
	backGround:null,
	playerSprite:null,
	
	ctor:function () {
		this._super();
	
		// Self
		self = this;
		
		// ディスプレイサイズ
		dispSize = cc.director.getWinSize();
		cc.log("w:" + dispSize.width);
		cc.log("h:" + dispSize.height);
		
		// 背景画像
		backSprite = new cc.Sprite(res.Bkg_0_png);
		backSprite.setPosition(dispSize.width / 2, dispSize.height / 2);
		this.addChild(backSprite, 0);
		
		// プレイヤー
		playerSprite = new PlayerSprite(res.Player_png);
		playerSprite.setPosition(dispSize.width / 2, dispSize.height / 2);
		this.addChild(playerSprite, 1);
		
		// タッチイベント
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:function(touch, event){
				cc.log("onTouchBegan");
				playerSprite.jump();
				return true;
			}
		}, this);
	}
});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});

// プレイヤークラス
var PlayerSprite = cc.Sprite.extend({

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);
	},
	jump:function(){
		cc.log("jump!!");
		var jBy = cc.jumpBy(0.2, cc.p(0.0, 0.0), 60, 1);
		this.runAction(jBy);
	}
});









