
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
				
				// 左右の判定
				var touchX = touch.getLocationX();
				if(touchX < dispSize.width * 0.5){
					playerSprite.jumpLeft();
				}else{
					playerSprite.jumpRight();
				}
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

	jumpingFlg:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);
		
		jumpingFlg = false;
	},
	jumpLeft:function(){// 左へジャンプ
		if(jumpingFlg == true) return;// ジャンプ中かどうか
		jumpingFlg = true;            // ジャンプ中フラグ(true)
		cc.log("jumpLeft!!");
		var jBy = cc.jumpBy(0.5, cc.p(-60.0, 0.0), 60, 1);
		var cFunc = cc.callFunc(this.jumpDone, this);
		this.stopAllActions();
		this.runAction(cc.sequence([jBy, cFunc]));
	},
	jumpRight:function(){// 右へジャンプ
		if(jumpingFlg == true) return;// ジャンプ中かどうか
		jumpingFlg = true;            // ジャンプ中フラグ(true)
		cc.log("jumpRight!!");
		var jBy = cc.jumpBy(0.5, cc.p(+60.0, 0.0), 60, 1);
		var cFunc = cc.callFunc(this.jumpDone, this);
		this.stopAllActions();
		this.runAction(cc.sequence([jBy, cFunc]));
	},
	jumpDone:function(){
		cc.log("jumpDone!!");
		jumpingFlg = false;// ジャンプ中フラグ(false)
	}
});









