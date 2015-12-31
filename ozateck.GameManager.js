//==========
// GameManager
var ozateck = ozateck || {};

//==========
// 方向の定数
var DIR_NONE  = 0;
var DIR_DOWN  = 1;
var DIR_UP    = 2;
var DIR_LEFT  = 3;
var DIR_RIGHT = 4;

//==========
// タイルの定数
var TILE_MAX_X    = 12;
var TILE_MAX_Y    = 8;
var TILE_NONE     = 0;
var TILE_ROAD     = 1;
var TILE_OBSTACLE = 2;

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

	// Mapを生成
	this.createMap = function(fileName){
		var map = cc.TMXTiledMap.create(fileName);
		var layerName = "Layer1";

		map.getTile = function(gX, gY){
			var layer = this.getLayer(layerName);
			return layer.getTileAt(cc.p(gX, gY));
		}

		map.getTileGID = function(gX, gY){
			var layer = this.getLayer(layerName);
			return layer.getTileGIDAt(cc.p(gX, gY));
		}

		map.getTilePosX = function(gX, gY){
			var tile = this.getTile(gX, gY);
			return tile.x + tile.width*0.5;
		}

		map.getTilePosY = function(gX, gY){
			var tile = this.getTile(gX, gY);
			return tile.y + tile.height*0.5;
		}

		map.getWidth = function(){
			var layer = this.getLayer(layerName);
			return layer.getWidth();
		}

		map.getHeight = function(){
			var layer = this.getLayer(layerName);
			return layer.getHeight();
		}

		return map;
	}

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

	//==========
	// クラス関連(拡張)
	//==========

	//==========
	// プレイヤー
	this.createPlayer = function(gX, gY, map, blockArray, fileName){
		var sprite = this.createSprite(fileName);
		var posX = map.getTilePosX(gX, gY);
		var posY = map.getTilePosY(gX, gY);
		//sprite.setAnchorPoint(cc.p(0.5, 0.0));
		sprite.setPosition(posX, posY);

		// Ouch
		var ouch = this.createOuch(sprite.width*0.5, sprite.height*1.4);
		sprite.addChild(ouch);

		// Grid
		sprite.gX = gX;
		sprite.gY = gY;

		// Program
		sprite.programArray = new Array();
		sprite.runFlg = false;

		sprite.runProgram = function(){
			if(sprite.runFlg == true) return;
			sprite.runFlg = true;

			var tX = sprite.gX;
			var tY = sprite.gY;
			var seqArray = new Array();

			for(var i=0; i<sprite.programArray.length; i++){
				var dir = sprite.programArray[i];

				var dX = 0;
				var dY = 0;
				if(dir == DIR_NONE){
					// Do nothing
				}else if(dir == DIR_DOWN){
					dX = +0;
					dY = +1;
				}else if(dir == DIR_UP){
					dX = +0;
					dY = -1;
				}else if(dir == DIR_LEFT){
					dX = -1;
					dY = +0;
				}else if(dir == DIR_RIGHT){
					dX = +1;
					dY = +0;
				}

				// vs Map / Block
				var colFlgMap = sprite.checkGrid(tX+dX, tY+dY, map);
				var colFlgBlock = false;
				for(var b=0; b<blockArray.length; b++){
					if(blockArray[b].checkBlock(tX+dX, tY+dY, map)){
						colFlgBlock = true;
					}
				}

				var colFlg = false;
				if(colFlgMap == true || colFlgBlock == true){
					colFlg = true;
				}

				if(colFlg == false){
					// 衝突していない場合
					tX += dX;
					tY += dY;
					var posX = map.getTilePosX(tX, tY);
					var posY = map.getTilePosY(tX, tY);
					var jTo  = cc.jumpTo(0.2, cc.p(posX, posY), 10, 1);
					seqArray.push(jTo);
					seqArray.push(cc.delayTime(1.0));
				}else{
					// 衝突していた場合
					var cFunc = cc.callFunc(this.cFuncOuch, this);
					var jBy = cc.jumpBy(1.0, cc.p(0, 0), 20, 2);
					seqArray.push(cFunc);
					seqArray.push(jBy);
					seqArray.push(cc.delayTime(1.0));
				}
			}

			// Run
			sprite.stopAllActions();
			sprite.runAction(cc.sequence(seqArray));
		}

		sprite.checkGrid = function(tX, tY, map){

			if(tX < 0 || TILE_MAX_X <= tX || tY < 0 || TILE_MAX_Y <= tY){
				return true;
			}

			var tileGID = map.getTileGID(tX, tY);
			if(tileGID == TILE_ROAD){
				return false;
			}else{
				return true;
			}
		}

		sprite.goDown = function(){
			sprite.programArray.push(DIR_DOWN);
		}

		sprite.goUp = function(){
			sprite.programArray.push(DIR_UP);
		}

		sprite.goLeft = function(){
			sprite.programArray.push(DIR_LEFT);
		}

		sprite.goRight = function(){
			sprite.programArray.push(DIR_RIGHT);
		}

		sprite.goWait = function(){
			sprite.programArray.push(DIR_WAIT);
		}

		sprite.cFuncOuch = function(){
			ouch.die();
		}

		return sprite;
	}
	
	//==========
	// ゴール
	this.createGoaler = function(gX, gY, map, blockArray, fileName){
		var sprite = this.createSprite(fileName);
		var posX = map.getTilePosX(gX, gY);
		var posY = map.getTilePosY(gX, gY);
		sprite.setPosition(posX, posY);

		// Grid
		sprite.gX = gX;
		sprite.gY = gY;

		sprite.checkGoaler = function(tX, tY, map){
			if(sprite.gX == tX && sprite.gY == tY){
				return true;
			}else{
				return false;
			}
		}

		return sprite;
	}

	//==========
	// コイン
	this.createCoin = function(gX, gY, map){
		var sprite = this.createSprite("images/bomber_coin.png");
		var posX = map.getTilePosX(gX, gY);
		var posY = map.getTilePosY(gX, gY);
		sprite.setPosition(posX, posY);

		sprite.dieFlg = false;
		sprite.die = function(){
			if(sprite.dieFlg == true) return;
			sprite.dieFlg = true;
			var jBy = cc.jumpBy(1.0, cc.p(0, 0), 20, 2);
			var cFunc = cc.callFunc(this.removeSelf, this);
			sprite.stopAllActions();
			sprite.runAction(cc.sequence(jBy, cFunc));
		}

		sprite.removeSelf = function(){
			sprite.removeFromParentAndCleanup(true);
		}

		return sprite;
	}

	//==========
	// アウチ
	this.createOuch = function(x, y){
		var sprite = this.createSprite("images/bomber_ouch.png");
		sprite.setPosition(x, y);

		sprite.setVisible(false);
		sprite.dieFlg = false;
		sprite.die = function(){
			if(sprite.dieFlg == true) return;
			sprite.setVisible(true);
			sprite.dieFlg = true;
			var jTo = cc.jumpTo(0.5, cc.p(x, y), 20, 1);
			var cFunc = cc.callFunc(this.removeSelf, this);
			sprite.stopAllActions();
			sprite.runAction(cc.sequence(jTo, cFunc));
		}

		sprite.removeSelf = function(){
			sprite.setVisible(false);
			sprite.dieFlg = false;
		}

		return sprite;
	}

	//==========
	// エネミー
	this.createEnemy = function(gX, gY, map, blockArray, fileName){
		var sprite = this.createSprite(fileName);
		var posX = map.getTilePosX(gX, gY);
		var posY = map.getTilePosY(gX, gY);
		//sprite.setAnchorPoint(cc.p(0.5, 0.0));
		sprite.setPosition(posX, posY);

		// Grid
		sprite.gX = gX;
		sprite.gY = gY;

		sprite.dieFlg = false;
		sprite.die = function(){
			if(sprite.dieFlg == true) return;
			sprite.dieFlg = true;
			var jBy = cc.jumpBy(0.5, cc.p(0, 0), 20, 1);
			var cFunc = cc.callFunc(this.removeSelf, this);
			sprite.stopAllActions();
			sprite.runAction(cc.sequence(jBy, cFunc));
		}

		sprite.removeSelf = function(){
			sprite.removeFromParentAndCleanup(true);
		}

		sprite.wanderFlg = false;
		sprite.wander = function(){
			if(sprite.wanderFlg == true) return;
			sprite.wanderFlg = true;

			// 乱数(ただし、偏る)
			var seed = Math.floor((Math.random() * 10) % 4 + 1);

			// 画面外へ出ようとした場合は戻す
			if(seed == DIR_DOWN && sprite.gY >= TILE_MAX_Y-1){
				seed = DIR_UP;
			}
			if(seed == DIR_UP && sprite.gY == 0){
				seed = DIR_DOWN;
			}
			if(seed == DIR_LEFT && sprite.gX == 0){
				seed = DIR_RIGHT;
			}
			if(seed == DIR_RIGHT && sprite.gX >= TILE_MAX_X-1){
				seed = DIR_LEFT;
			}

			var dX = 0;
			var dY = 0;
			if(seed == DIR_NONE){
				// Do nothing
			}else if(seed == DIR_DOWN){
				dX = +0;
				dY = +1;
			}else if(seed == DIR_UP){
				dX = +0;
				dY = -1;
			}else if(seed == DIR_LEFT){
				dX = -1;
				dY = +0;
			}else if(seed == DIR_RIGHT){
				dX = +1;
				dY = +0;
			}

			// vs Map / Block
			var colFlgMap = sprite.checkGrid(sprite.gX+dX, sprite.gY+dY, map);
			var colFlgBlock = false;
			for(var b=0; b<blockArray.length; b++){
				if(blockArray[b].checkBlock(sprite.gX+dX, sprite.gY+dY, map)){
					colFlgBlock = true;
				}
			}

			// Collision Flg
			var colFlg = false;
			if(colFlgMap == true || colFlgBlock == true){
				colFlg = true;
			}

			if(colFlg == false){
				sprite.gX += dX;
				sprite.gY += dY;
			}

			if(colFlg == false){
				// 衝突していない場合
				var posX  = map.getTilePosX(sprite.gX, sprite.gY);
				var posY  = map.getTilePosY(sprite.gX, sprite.gY);
				var time  = 1.0;
				var jTo   = cc.jumpTo(0.2, cc.p(posX, posY), 10, 1);
				var cFunc = cc.callFunc(this.wanderDone, this);
				sprite.stopAllActions();
				sprite.runAction(cc.sequence(cc.delayTime(time), jTo, cFunc));
			}else{
				// 衝突していた場合
				var posX  = map.getTilePosX(sprite.gX, sprite.gY);
				var posY  = map.getTilePosY(sprite.gX, sprite.gY);
				var time  = (Math.floor(Math.random()*10) + 1) * 0.5;
				var jTo   = cc.jumpTo(0.2, cc.p(posX, posY), 5, 1);
				var cFunc = cc.callFunc(this.wanderDone, this);
				sprite.stopAllActions();
				sprite.runAction(cc.sequence(cc.delayTime(time), jTo, cFunc));
			}
		}

		sprite.checkGrid = function(tX, tY, map){

			if(tX < 0 || TILE_MAX_X <= tX || tY < 0 || TILE_MAX_Y <= tY){
				return true;
			}

			var tileGID = map.getTileGID(tX, tY);
			if(tileGID == TILE_ROAD){
				return false;
			}else{
				return true;
			}
		}

		sprite.wanderDone = function(){
			sprite.wanderFlg = false;
			sprite.wander();
		}

		return sprite;
	}

	//==========
	// ブロック
	this.createBlock = function(gX, gY, map, fileName){
		var sprite = this.createSprite(fileName);
		var posX = map.getTilePosX(gX, gY);
		var posY = map.getTilePosY(gX, gY);
		sprite.setPosition(posX, posY);

		// Grid
		sprite.gX = gX;
		sprite.gY = gY;

		sprite.checkBlock = function(tX, tY, map){
			if(sprite.gX == tX && sprite.gY == tY){
				return true;
			}else{
				return false;
			}
		}

		return sprite;
	}
};