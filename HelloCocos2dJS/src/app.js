
var HelloWorldLayer = cc.Layer.extend({

	self:null,
	
	ctor:function () {
		this._super();
	
		// Self
		self = this;
	}
});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});