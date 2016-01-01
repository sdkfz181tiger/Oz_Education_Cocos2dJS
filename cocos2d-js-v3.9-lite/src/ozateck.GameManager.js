//==========
// GameManager
var ozateck = ozateck || {};

ozateck.GameManager = function(){

	var scoreNow  = 0;// スコア
	var scoreBest = 0;// ハイスコア

	//==========
	// メソッド関連(基本)
	//==========

	// 得点をリセットします
	this.resetScore = function(){
		scoreNow = 0;
	}

	// 得点を加算します
	this.addScore = function(num){
		scoreNow += num;
		if(scoreNow > scoreBest){
			scoreBest = scoreNow;
		}
	};

	// 得点を取得します
	this.getScoreNow = function(){
		return scoreNow;
	}

	// ベストスコアを取得します
	this.getScoreBest = function(){
		return scoreBest;
	}

	// ベストスコアをWebStorageへ記録します
	this.saveScore = function(){
		// TODO
	}

	// ベストスコアをWebStorageから読み込みます
	this.loadScore = function(){
		// TODO
	}

	// 画面の幅を返します
	this.getDisplayWidth = function(){
		return cc.director.getWinSize().width;
	}

	this.getDisplayHeight = function(){
		return cc.director.getWinSize().height;
	}

	//==========
	// クラス関連(基本)
	//==========

	// 画像を生成
	this.createSprite = function(imageUrl){
		var sprite = cc.Sprite.create(imageUrl);
		return sprite;
	};

	// ラベルを生成
	this.createLabel = function(textStr){
		var label = cc.LabelTTF.create(textStr, "Arial", 20);
		return label;
	};

	// サウンドを再生
	this.playMusic = function(fileName, roopFlg){
		// Browserによって再生出来ない形式がある為、複数のファイルを用意しておく
		cc.audioEngine.playMusic(fileName, roopFlg);
		cc.audioEngine.setMusicVolume(0.7);
	}

	this.playEffect = function(fileName, roopFlg){
		// Browserによって再生出来ない形式がある為、複数のファイルを用意しておく
		cc.audioEngine.playEffect(fileName, roopFlg);
		cc.audioEngine.setEffectsVolume(0.5);
	}

	//==========
	// クラス関連(キャラクター)
	//==========

	this.createBackgroundNode = function(fileName, ax, ay, posX, posY){
		var backSprite = new BackgroundNode(fileName);
		backSprite.setAnchorPoint(cc.p(ax, ay));
		backSprite.setPosition(cc.p(posX, posY));
		return backSprite;
	}

	this.createPlayerSprite = function(fileName, ax, ay, posX, posY){
		var playerSprite = new PlayerSprite(fileName);
		playerSprite.setAnchorPoint(cc.p(ax, ay));
		playerSprite.setPosition(cc.p(posX, posY));
		return playerSprite;
	}

	this.createSpikeSprite = function(fileName, ax, ay, posX, posY){
		var spikeSprite = new SpikeSprite(fileName);
		spikeSprite.setAnchorPoint(cc.p(ax, ay));
		spikeSprite.setPosition(cc.p(posX, posY));
		return spikeSprite;
	}

	this.createGameoverSprite = function(fileName, ax, ay, posX, posY){
		var gameoverSprite = new GameOverSprite(fileName);
		gameoverSprite.setAnchorPoint(cc.p(ax, ay));
		gameoverSprite.setPosition(cc.p(posX, posY));
		return gameoverSprite;
	}

	//==========
	// アニメーションを作成する
	//==========

	this.createAnimation = function(fileName, begin, end){
		var animFrames = new Array();
		for(var i=begin; i<=end; i++){
			var str = fileName + i + ".png";
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}
		var animation = cc.Animation.create(animFrames, 0.1);
		return animation;
	}

	//==========
	// 角度を計算する
	var PI       = 3.141592653;
	var RadToDeg = 57.29577951;
	var DegToRad = 0.017453293;
	this.calcAngle2D = function(cX, cY, tX, tY){

		var disX = tX - cX;
		var disY = tY - cY;
		var disR = Math.sqrt(disX*disX + disY*disY);

		var radian = Math.atan(disY / disX);
		var angle = radian * RadToDeg;

		if(tY > cY && tX > cX){
			// 1div
			angle += 0;
		}else if(tY > cY && tX < cX){
			// 2div
			angle += 180;
		}else if(tY < cY && tX < cX){
			// 3div
			angle += 180;
		}else{
			// 4div
			angle += 360;
		}
		return angle;
	}
};

//==========
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

//==========
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
	jumpLeft:function(animation){

		jumpFlg = true;
		vX = -jumpX;
		vY = +jumpY;
		this.setFlippedX(false);
		this.runAction(cc.Animate.create(animation));
	},
	jumpRight:function(animation){

		jumpFlg = true;
		vX = +jumpX;
		vY = +jumpY;
		this.setFlippedX(true);
		this.runAction(cc.Animate.create(animation));
	},
	land:function(groundY){

		jumpFlg = false;
		vX = 0.0;
		vY = 0.0;
		this.y = groundY;
	},
	collision:function(spike){
		if(cc.rectContainsPoint(
			spike.getBoundingBox(), this.getPosition())){
				return true;
			}
		return false;
	}
});

//==========
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

//==========
// GameOverクラス
var GameOverSprite = cc.Sprite.extend({

	showFlg:null,

	ctor:function(fileName, rect, rotated){
		this._super(fileName, rect, rotated);

		showFlg = false;
		this.setVisible(showFlg);
	},
	show:function(time, distance){
		if(showFlg == true) return;
		showFlg = true;
		this.setVisible(showFlg);
		
		var jBy = cc.jumpBy(time, cc.p(0, 0), distance, 1);
		var dTime = cc.delayTime(1.0);
		var cFunc = cc.callFunc(this.hide, this);
		this.stopAllActions();
		this.runAction(cc.sequence(jBy, dTime, cFunc));
	},
	hide:function(){
		showFlg = false;
		this.setVisible(showFlg);
		this.stopAllActions();
	}
});

//==========
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