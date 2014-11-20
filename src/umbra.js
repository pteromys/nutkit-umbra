var $ = require('jquery');
var buttons = require('./buttons.js');
if (document) { buttons.activate(); }

module.exports = {
	"KEYS": require('./keys.js'),
	"button_system": buttons,
	"Form": require('./forms.js'),
	"MessageBox": require('./messagebox.js'),
};
