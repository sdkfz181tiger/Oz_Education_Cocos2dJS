/*==========
 Ch02-011:
 スコアリング(スコア表示),障害物の発生箇所の調整
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
	},
	collision:function(spike){
		if(cc.rectIntersectsRect(this, spike.getBoundingBox())){
			return true;
		}
		return false;
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
	},
	stop:function(){
		slideFlg = false;
		this.stopAllActions();
	}
});

// GameOverクラス
var GameOverSprite = cc.Sprite.extend({

	showFlg:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);

		showFlg = false;
	},
	start:function(time, distance){
		if(showFlg == true) return;
		showFlg = true;
		var jBy = cc.jumpBy(time, cc.p(0, 0), distance, 1);
		var dTime = cc.DelayTime(1.0);
		var cFunc = cc.callFunc(this.stop, this);
		this.stopAllActions();
		this.runAction(cc.sequence(jBy, dTime, cFunc));
	},
	stop:function(){
		showFlg = false;
		this.stopAllActions();
	}
});

// スコアクラス
var ScoreSprite = cc.Sprite.extend({

	score:null,
	offset:null,
	unit:null,
	label:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);

		score  = 0;
		offset = 0;
		unit   = "m";
		label  = cc.LabelTTF.create(score + unit, "Arial", 40);
		label.setAnchorPoint(cc.p(1.0, 0.5));
		label.setPosition(cc.p(
			this.getBoundingBox().width - 5.0,
			this.getBoundingBox().height*0.5));
		this.addChild(label);
	},
	initScore:function(num){
		offset = num;
	},
	setScore:function(num){
		if(num - offset < score) return;
		score = Math.floor(num) - offset;
		label.setString(score + unit);
	},
	getScore:function(){
		return score;
	}
});