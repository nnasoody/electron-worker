(function() {
	var discoveryInstance;


	document.getElementById("launch").addEventListener("click", () => { 
		discoveryInstance = new Discovery();
	    // document.getElementById("demo").innerHTML = "Hello World";
	});

	document.getElementById("terminate").addEventListener("click", () => {
		discoveryInstance && discoveryInstance.terminate();
	});	

	document.getElementById("run").addEventListener("click", () => {
		discoveryInstance.start({
	        fname: 'John',
	        lname: 'Smith'
    	});
	});

	
})()
