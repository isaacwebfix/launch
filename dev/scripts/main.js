"use strict";

(function(window, document, $, _){


	var Flint = function(instance){

		this._utils = {

			getTime: function(){
				return "Go to work"
			}

		}

		this.extend = function(instance){
			if(typeof instance === "object"){

				// Copy defaults onto object, can be accessed later if needed
				if(typeof instance.defaults === "object"){
					for(var key in instance.defaults){
						this[key] = instance.defaults[key];
					}
				}

				// Copy over other properties
				for(var key in instance){
					this[key] = instance[key];
				}
			}

			return this;
		}


		return this.extend();
	}


	var Overlay = new Flint({
		testa: "horeses"
	});


	console.log(Overlay._utils.getTime());
	console.log(Overlay.testa);





})(window, document, jQuery, _);