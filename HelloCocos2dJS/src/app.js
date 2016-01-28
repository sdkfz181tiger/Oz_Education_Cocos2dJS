
var HelloWorldLayer = cc.Layer.extend({

	self:null,
	dispSize:null,
	backSprite:null,
	
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
	}
});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});