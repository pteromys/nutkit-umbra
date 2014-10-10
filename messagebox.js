(function () {

var global_object = this['Nuts'] || this;
global_object['MessageBox'] = (function () {

var MessageBox = function (selector, debug) {
	this.selector = selector;
	this.panel = $(this.selector).find('.panel')[0];
	this.debug = debug;
	if (!this.panel) { this.panel = $('<div class="box">').appendTo(selector)[0]; }
	var this_box = this;
	$(this.panel).on('click', function (e) {
		var t = $(e.target);
		if (t.is('.message')) {
			if (t.hasClass('pinned')) {
				t.removeClass('pinned active');
				this_box.hide(t);
			} else if (t.hasClass('active')) {
				t.addClass('pinned');
			}
		}
	});
};

var ProgressBar = function (parent_box, text) {
	this.parent_box = parent_box;
	this.msgdiv = parent_box.post(text, 'progress', 86400000);
	this.msgdiv.append($('<div class="progressbar"><div></div></div>'));
};

ProgressBar.prototype = {
	set: function (amount) {
		var percent = (amount * 100) + '%';
		this.msgdiv.find('.progressbar > div').css({width: percent});
		if (amount >= 1) {
			window.setTimeout(this.parent_box.hide.bind(this.parent_box, this.msgdiv), 100);
		}
	},
};

MessageBox.prototype = {
	del: function (msg) {
		if (msg && msg.is && msg.is('.message') && !msg.is('.pinned')) {
			msg.remove();
		}
	},
	hide: function (msg) {
		if (msg && msg.is && msg.is('.message') && !msg.is('.pinned')) {
			msg.removeClass('active');
			window.setTimeout(this.del.bind(this, msg), 150);
		}
	},
	post: function (text, cls, expiry) {
		var msg = $('<div class="message active">').text(text).addClass(cls);
		if (msg.hasClass('debug') && !this.debug) { return $(); }
		$(this.panel).append(msg);
		window.setTimeout(this.hide.bind(this, msg), expiry || 5000);
		return msg;
	},
	makeProgress: function (text) {
		return new ProgressBar(this, text);
	},
};

return MessageBox;

})();

})();
