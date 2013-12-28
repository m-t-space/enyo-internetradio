// enyo.kind({
// 	name: "Bootplate.MessageController",
// 	kind: "enyo.Controller",
// 	data: "Hello World"
// });

// enyo.kind({
// 	name: "Bootplate.MessagesController",
// 	kind: "enyo.Collection"
// });

enyo.kind({
  	name: "ModelDataController",
    kind: "enyo.ModelController",


       create: function() {
        this.inherited(arguments);
        console.log("performance start ****=" + window.performance.now());
    	this.loadData();
    },

      loadData: function () {


      getGenres(this,function(context,result){
			console.log("Got Result :)"+ result);
			app.view.key = true;
			context.set("moodOptions",result);

		})




        //  r = [];
        // q = [];
        // for (var i = 0; i < 25; ++i) {
        //     r.push({
        //         coverSource: "assets/default-music.png",
        //         title: "MOVIE NAME " + i,
        //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
        //             "Integer sit amet  dolor aliquam, elementum eros eget, lobortis orci. Aliquam ac risus urna. Nullam imperdiet neque sed diam posuere, " +
        //             "accumsan malesuada erat pellentesque. Sed pretium lobortis magna, ut pellentesque tellus posuere in. Nunc tristique fermentum commodo. " +
        //             "Nullam rhoncus elit mi, at laoreet tortor euismod non. Proin at aliquet enim."
        //     });
        // }
        // this.set("mixList",r);

    },

    loadTrackInfo: function(moodNames) {
    	getMixes(this,moodNames, function(context,result){
    		app.view.key = true;
			context.set("mixList",result);
			console.log("loadtrack Result :)"+result);
		})
    },

    getPlayStream: function(mixID) {
    	playMix(this,mixID, function(context,result){
			app.view.key = true;
			context.set("streamInfo",result);
			console.log("loadtrack Result :)"+result);
		})
    },

    changeMusic: function() {
    	console.log("change music");
    
    	nextTrack(this,function(context,result){
				app.view.key = true;
			context.set("streamInfo",result);
			console.log("loadtrack Result :)"+result);
		})

    }
})