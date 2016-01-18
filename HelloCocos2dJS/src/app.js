
var HelloWorldLayer = cc.Layer.extend({

	self:null,
	dispSize:null,
	backSprite:null,
	playerSprite:null,
	
	ctor:function () {
		this._super();
	
		// Self
		self = this;
		
		// ディスプレイサイズ
		dispSize = cc.director.getWinSize();
		
		// 背景画像
		backSprite = new cc.Sprite(res.Bkg_0_png);
		backSprite.setPosition(cc.p(dispSize.width / 2, dispSize.height / 2));
		this.addChild(backSprite, 0);
		
		// プレイヤー
		playerSprite = new PlayerSprite(res.Player_png);
		playerSprite.setPosition(cc.p(dispSize.width / 2, dispSize.height / 2));
		this.addChild(playerSprite, 0);
		
		// タッチイベント
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:function(touch, event){
				cc.log("onTouchBegan");
				return true;
		}}, this);
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
	}
});