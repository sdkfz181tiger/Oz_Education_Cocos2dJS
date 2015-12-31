/*==========
 Ch02-006:
 障害物クラス(乱数を使った表現)
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
	spikeArray:null,
	spikePaddingY:null,
	spikeOffsetY:null,

	ctor:function(){
		this._super();

		// Self
		self = this;
		
		// ディスプレイサイズ
		dispSize = cc.Director.getInstance().getWinSize();

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
		for(var i=0; i<10; i++){
			var spikeSprite = new SpikeSprite("res/spike.png");
			spikeSprite.setAnchorPoint(cc.p(0.5, 0.5));
			var x = dispSize.width * Math.random();
			var y = spikeOffsetY + spikePaddingY * i;
			spikeSprite.setPosition(cc.p(x, y));
			spikeSprite.slide(2.0, 100);
			spikeArray.push(spikeSprite);
			backSprite.addChild(spikeSprite);
		}

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

		// ゲームオーバー判定
		if(playerSprite.y < -backSprite.y){
			playerSprite.land(-backSprite.y);
			self.gameOver();
		}
	},
	gameOver:function(){
		cc.log("gameOver");
		cc.eventManager.removeListener(this);
		this.unscheduleUpdate();
	}
});

// 背景クラス
var BackgroundNode = cc.Node.extend({

	backSprite0:null,
	backSprite1:null,
	backSprite2:null,
	borderY:null,

	ctor:function(fileName){
		var self = this;
		cc.Node.prototype.ctor.call(self);

		backSprite0 = new cc.Sprite(fileName);
		backSprite0.setAnchorPoint(cc.p(0.0, 0.0));
		backSprite0.setPosition(cc.p(0.0, 0.0));
		this.addChild(backSprite0);

		backSprite1 = new cc.Sprite(fileName);
		backSprite1.setAnchorPoint(cc.p(0.0, 0.0));
		backSprite1.setPosition(cc.p(0.0, 
			backSprite0.y + backSprite0.getBoundingBox().height));
		this.addChild(backSprite1);

		backSprite2 = new cc.Sprite(fileName);
		backSprite2.setAnchorPoint(cc.p(0.0, 0.0));
		backSprite2.setPosition(cc.p(0.0,
			backSprite1.y + backSprite1.getBoundingBox().height));
		this.addChild(backSprite2);

		borderY = backSprite0.getBoundingBox().height * 0.8;
	},
	update:function(playerSprite){

		if(borderY < playerSprite.y){
			var disY = playerSprite.y - borderY;
			this.y -= disY; // ボジションを移動

			if(this.y + backSprite0.y + backSprite0.getBoundingBox().height < 0){
				backSprite0.setPosition(cc.p(0.0,
					backSprite2.y + backSprite2.getBoundingBox().height));
			}
			if(this.y + backSprite1.y + backSprite1.getBoundingBox().height < 0){
				backSprite1.setPosition(cc.p(0.0,
					backSprite0.y + backSprite0.getBoundingBox().height));
			}
			if(this.y + backSprite2.y + backSprite2.getBoundingBox().height < 0){
				backSprite2.setPosition(cc.p(0.0,
					backSprite1.y + backSprite1.getBoundingBox().height));
			}

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

	slideFlg:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);
		
		slideFlg = false;
	},
	slide:function(time, width){
		if(slideFlg == true) return;
		slideFlg = true;
		var random = Math.random();
		if(random < 0.5) width *= -1.0;
		var mBy0 = cc.moveBy(time, cc.p(+width, 0.0));
		var mBy1 = cc.moveBy(time, cc.p(-width, 0.0));
		var mBy2 = cc.moveBy(time, cc.p(-width, 0.0));
		var mBy3 = cc.moveBy(time, cc.p(+width, 0.0));
		var seq = cc.sequence([mBy0, mBy1, mBy2, mBy3]);
		this.stopAllActions();
		this.runAction(cc.repeatForever(seq));
	}
});