/*==========
 Ch01-001:
 Spriteを表示する
 ==========*/

// レイヤー
var HelloWorldLayer = cc.Layer.extend({
	
	mySprite:null,

	ctor:function(){
		this._super();
		
		// ディスプレイサイズ
		var size = cc.Director.getInstance().getWinSize();
		
		// スプライトを表示
		mySprite = cc.Sprite.create("res/oyadius.png");
		mySprite.setAnchorPoint(cc.p(0.5, 0.5));
		mySprite.setPosition(cc.p(
			size.width / 2,
			size.height / 2
		));
		this.addChild(mySprite);

		/*
		// タッチイベント
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan:function(touch, event){
				cc.log("onTouchBegan");
				jump();
				return true;
			},
			onTouchMoved:function(touch, event){
				cc.log("onTouchMoved");
			},
			onTouchEnded:function(touch, event){
				cc.log("onTouchEnded");
			}}, this);
		*/
		return true;
	}
});

/*
function jump(){

	var jBy = cc.jumpBy(1.0, cc.p(0, 0), 20, 2);
	//var cFunc = cc.callFunc(this.removeSelf, this);
	HelloWorldLayer.mySprite.stopAllActions();
	HelloWorldLayer.mySprite.runAction(cc.sequence(jBy));
}
*/

// シーン
var HelloWorldScene = cc.Scene.extend({

	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});