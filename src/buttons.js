var KEYS = require('./keys.js');
var $ = require('jquery');

var clickElement = function (elt) {
	// jQuery click() won't open hyperlinks, so we do it ourselves.
	elt = $(elt);
	var ev = $.Event("click");
	elt.trigger(ev);
	if (elt.is('a') && !ev.isDefaultPrevented()) {
		window.location = elt.attr('href');
	}
};

var ButtonSystem = {
	activate: function () {
		$(document).ready(this.activateRootButtons);
		$(document).ready(this.activateClickouts);
	},
	activateRootButtons: function () {
		$('.button_root').on('click', function (e) {
			e.stopPropagation();
			if (window.location.hash == $(this).attr('href')) {
				e.preventDefault();
				window.location = '#';
			}
		});
		var bindings = {};
		$('.button_root').each(function () {
			var k = $(this).data('key');
			if (!k) { return; }
			if (k in KEYS) { k = KEYS[k]; }
			bindings[k] = $(this);
		});
		this.activateKeys(bindings);
	},
	activateKeys: function (bindings) {
		bindings = bindings || {};
		$(window).on('keydown', function (e) {
			if ($('.overlay').is(':target')) {
				if (e.which == KEYS.ESC) {
					var target = $(e.target);
					var target2 = target.find(':target');
					if (target2.length) { target = target2; }
					window.setTimeout(function () {
						clickElement(target.find('.button_close'));
					}, 10);
				}
			} else {
				if (bindings[e.which]) {
					clickElement($(bindings[e.which]));
				}
			}
		});
	},
	activateClickouts: function () {
		$('body').on('click.clickout', '.overlay', function (e) {
			if (e.target == this) { // i.e. if not bubbled
				clickElement($(e.target).find('.button_close'));
			}
		});
	},
};

ButtonSystem.activateRootButtons = ButtonSystem.activateRootButtons.bind(ButtonSystem);

module.exports = ButtonSystem;


