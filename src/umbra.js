var $ = require('jquery');
var buttons = require('./buttons.js');
if (document) { buttons.activate(); }
var mb = require('./messagebox.js');

module.exports = {
	"KEYS": require('./keys.js'),
	"alert": mb.post,
	"button_system": buttons,
	"Form": require('./forms.js'),
	"MessageBox": mb,
};
