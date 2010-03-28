Function.prototype.scope = function(scop) {
	var _function = this;

	return function() {
		return _function.apply(scop, arguments);
	}
}