/*==========
 Ch01-001:
 Spriteを表示する
 ==========*/

// レイヤー
var HelloWorldLayer = cc.Layer.extend({
	
	playerSprite:null,

	ctor:function(){
		this._super();
		
		// ディスプレイサイズ
		var size = cc.Director.getInstance().getWinSize();
		
		// プレイヤー
		playerSprite = new PlayerSprite("res/oyadius.png");
		playerSprite.setAnchorPoint(cc.p(0.5, 0.5));
		playerSprite.setPosition(cc.p(
			size.width / 2,
			size.height / 2
		));
		this.addChild(playerSprite);

		// コイン
		coinSprite = new CoinSprite("res/oyadius.png");
		coinSprite.setAnchorPoint(cc.p(0.5, 0.5));
		coinSprite.setPosition(cc.p(
			size.width / 4,
			size.height / 2
		));
		this.addChild(coinSprite);

		// タッチイベント
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:function(touch, event){
				//cc.log("onTouchBegan");
				playerSprite.jump();
				coinSprite.jump();
				return true;
			},
			onTouchMoved:function(touch, event){
				//cc.log("onTouchMoved");
			},
			onTouchEnded:function(touch, event){
				//cc.log("onTouchEnded");
			}}, this);

		return true;
	}
});

// プレイヤークラス
var PlayerSprite = cc.Sprite.extend({

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);
	},
	jump:function(){
		var jBy = cc.jumpBy(0.2, cc.p(0, 0), 30, 1);
		this.stopAllActions();
		this.runAction(cc.sequence(jBy));
	}
});

// コインクラス
var CoinSprite = cc.Sprite.extend({

	_counter:10,
	_COUNT_MIN:0,
	_COUNT_MAX:10,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);
	},
	jump:function(){
		var jBy = cc.jumpBy(0.2, cc.p(0, 0), 30, 1);
		var cFunc = cc.callFunc(this.countDown, this);
		this.stopAllActions();
		this.runAction(cc.sequence([jBy, cFunc]));
	},
	countDown:function(){
		if(this._COUNT_MIN < this._counter){
			this._counter--;
		}else{
			this._counter = this._COUNT_MAX;
		}
		cc.log("counter:" + this._counter);
	}
});

// シーン
var HelloWorldScene = cc.Scene.extend({

	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});