var $ = require('jquery');

var global_registry = {};

var MessageBox = function (id, debug) {
	if (!(this instanceof MessageBox)) { return MessageBox.get(id, debug); }
	this.id = id;
	this.debug = debug;
	this.getPanel().on('click', this.clickHandler.bind(this));
};

var ProgressBar = function (parent_box, text) {
	this.parent_box = parent_box;
	this.msgdiv = parent_box.post(text, 'progress', 86400000);
	this.msgdiv.append($('<div class="progressbar"><div class="progressbar_fill"></div></div>'));
};

ProgressBar.prototype = {
	set: function (amount) {
		var percent = (amount * 100) + '%';
		this.msgdiv.find('.progressbar_fill').css({width: percent});
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
		this.getPanel().append(msg);
		window.setTimeout(this.hide.bind(this, msg), expiry || 5000);
		return msg;
	},
	makeProgress: function (text) {
		return new ProgressBar(this, text);
	},
	getPanel: function () {
		var panel = $('#' + this.id + ' .box');
		if (!panel.length) {
			panel = $('<div class="box">').appendTo('#' + this.id);
		}
		return panel;
	},
	clickHandler: function (e) {
		var t = $(e.target);
		if (t.is('.message')) {
			if (t.hasClass('pinned')) {
				t.removeClass('pinned active');
				this.hide(t);
			} else if (t.hasClass('active')) {
				t.addClass('pinned');
			}
		}
	},
};

MessageBox.get = function (id, debug) {
	id = String(id) || 'messages';
	if (!$('#' + id).length) {
		$('<div id="#' + id + '" class="messages">').appendTo('body');
	}
	if (!global_registry[id]) {
		global_registry[id] = new MessageBox(id, debug);
	}
	return global_registry[id];
};

MessageBox.post = function (message, cls, expiry, id) {
	return MessageBox.get(id).post(message, cls, expiry);
};

module.exports = MessageBox;
