
enyo.kind({
    name: "Bootplate.MainView",
    kind: "FittableRows",
    //classes: "onyx enyo-fit",

    classes: " viewSetting",
    style: "background-image: url(assets/bg.png);",
    controller: ".app.$.dataController",
    published: {
        optionDisplay: null,
        mixesObject: null,
        key: false,
        streamObject: null,
        selectedIndex: 0
    },


    mixesInfo: [],



    bindings: [{
            from: ".app.$.dataController.moodOptions",
            to: ".optionDisplay"
        }, {
            from: ".app.$.dataController.mixList",
            to: ".mixesObject",
            transform: function (value) {
                console.log('inside binding');
                console.log(value);
                return value;
            }
        }, {
            from: ".app.$.dataController.streamInfo",
            to: ".streamObject"
        }, {
            from: ".collection",
            to: ".$.repeater.collection"
        }

    ],
    components: [
         {
                kind: "RadioPlayback",
                name: "audioPlayback",
                onEnded: "changemusic",
                classes: "playerBar",
                style:"height: 200px;background-image: url(assets/music.jpg);"
             
         },
      
        {
            kind: "Panels",
            fit: true,
            style: "width:800px;height:500px;",
            classes: "panels-sample-sliding-panels",
            arrangerKind: "CollapsingArranger",
            wrap: false,
            components: [

                {
                    name: "userMoodsList",
                    //style: "height:500px;",
                    kind: "enyo.DataList",
                    classes: "list-sample-contacts-list enyo-unselectable",
                    scrollerOptions: {
                        kind: "Scroller",
                        touch: true
                    },
                    kind: "enyo.DataList",
                    onclick: "loadMixes",
                    components: [{
                        components: [
                        {
                        	style: "border-bottom: 1px solid #000;"
                        },
                        {
                            name: "userMood",
                            kind: "onyx.Item"
                        }


                        ],
                        bindings: [{
                            from: ".model.title",
                            to: ".$.userMood.content"
                        }
                       
                        ]
                    }]
                },

                	{name: "radioPodcast", fit: true, components: [
                	{
                	
                		content: "Related videos",
                		style: "border-bottom: 2px solid #000;"
                	},
                 		 {
                  name: "radioList",
                  selection: false,
                  touch: true,
                  kind: "enyo.DataList",
                   scrollerOptions: {
                        kind: "Scroller",
                        touch: true
                    },

                  ontap: "getRadioStream",
                  components: [{
                      kind: "TrackDetailItem",
                      //allowHtml : true,
                      //classes: "single-select-delete-image-item",
                      //mixins: ["moon.SelectionOverlaySupport"],
                      bindings: [
                       {
                    from: ".model.title",
                    to: ".tracktitle"
                }, {
                    from: ".model.description",
                    to: ".trackdescription"
                }, {
                    from: ".model.coverSource",
                    to: ".imagesource"
                },
                {
                	form: ".model.likes",
                	to: ".tracklikes"
                }
]
                  }]
              }
              ]}

            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        console.log("dddddddddddddddddddddddddddddddddddddddd");
        //  this.collection = new enyo.Collection(this.data);
        // this.loadData();
    },
    optionDisplayChanged: function () {
        console.log("optionDisplayChanged options display");
        if (this.key) {
            var moodsArray = [];
            console.log(this.optionDisplay);
            console.log(this.optionDisplay.tag_cloud.tags[0])

            var taglength = this.optionDisplay.tag_cloud.tags.length;

            for (var i = 0; i < taglength; i++) {
                moodsArray.push({
                    title: this.optionDisplay.tag_cloud.tags[i].name
                });
            };

            console.log(moodsArray);
            var inf = new enyo.Collection(moodsArray);
            // inf.add(moodsArray);

            this.$.userMoodsList.set("collection", inf);
            //console.log(this.$.userMoodsOption.$.list.get("collection"));
            //this.$.userMoodsOption.setListCollection(moodsArray);
            this.key = false;


        } else {
            console.log("nulllll");
        }

    },
    loadMixes: function (inSender, inEvent) {
        console.log("loadMixes");
        console.log(inSender);
        console.log(inEvent);
        console.log(inEvent.child.$.userMood.content);
        //this.doMixesClick({mixName:inEvent.child.content})
        this.loadTracksInfo(inEvent.child.$.userMood.content)
    },

    mixesObjectChanged: function () {
        console.log("playlistChanged options display");

        if (this.key) {

            console.log("got mixes object");
            console.log(this.mixesObject.mix_set.mixes);
            this.mixesInfo.length = 0;
            var mixLength = this.mixesObject.mix_set.mixes.length;
            for (var i = 0; i < mixLength; i++) {
                this.mixesInfo.push({
                    id: this.mixesObject.mix_set.mixes[i].id,
                    title: this.mixesObject.mix_set.mixes[i].name,
                    description: this.mixesObject.mix_set.mixes[i].description + "track_count:" + this.mixesObject.mix_set.mixes[i].tracks_count ,
                    likes: "likes:"+this.mixesObject.mix_set.mixes[i].likes_count,
                    coverSource: this.mixesObject.mix_set.mixes[i].cover_urls.original


                })
            };
            var c = new enyo.Collection();
            c.add(this.mixesInfo, {
                parse: true
            });
            this.$.radioList.set("collection", c);
            this.$.radioList.reset();
            this.key = false;
        }



    },
    /*
	Load track details for that mix name
    */
    loadTracksInfo: function (mixname) {
        this.controller.loadTrackInfo(mixname);
    },

    /*

    */
    getRadioStream: function (inSender, inEvent) {
        console.log("radio stream=" + inEvent.index);
        this.selectedIndex = inEvent.index;
        console.log(this.mixesInfo[inEvent.index]);
        this.controller.getPlayStream(this.mixesInfo[inEvent.index].id);

    },

    streamObjectChanged: function () {

        if (this.key) {
            var obj = this.streamObject.set;
            var src = obj.track.track_file_stream_url;
            var track = obj.track.name;
            var artist = obj.track.performer;
            var album = "not known";
            var duration = null;
            var thumb = this.mixesInfo[this.selectedIndex].coverSource;

            if (obj.at_end != true) {
                this.$.audioPlayback.addAudioTrack(src, track, artist, album, duration, thumb);
            } else {
                // set the icon to play
                this.$.audioPlayback.$.btnPlay.setSrc("assets/icon-play-btn.png");
            }
            this.key = false;
        }
    },

    changemusic: function () {
        console.log("change music");
        //	if() {
        this.controller.changeMusic();
        // }
    },

});


enyo.kind({
	name: "TrackDetailItem",
	events: {
		onRemove: ""
	},
	
	published: {
		tracktitle: "",
		imagesource: "",
		trackdescription: "",
		tracklikes: ""
	},
	components: [

	{kind:"FittableColumns",components:[
		{name: "coverSource", kind: "Image", classes: "list-sample-contacts-avatar"},
		{components: [
			{name: "title",classes: "list-title"},
			//{name: "subTitile", classes: "list-sample-contacts-description"},
			{name:"description",content: "description", classes: "list-description"},
			{name: "likes", content:"likes",classes: "list-sample-contacts-description"},
		]}

	]},
	{style: "border-bottom: 2px solid #fff;"},
		
		//{name: "remove", kind: "onyx.IconButton", classes: "list-sample-contacts-remove-button", src: "assets/remove-icon.png", ontap: "removeTap"}
	],
	bindings: [
	{from:".tracktitle",to:".$.title.content"},
	{from:".imagesource",to:".$.coverSource.src"},
	{from:".trackdescription",to:".$.description.content"},
	{from:".tracklikes",to:".$.likes.content"}
	],
	create: function() {
		this.inherited(arguments);
	}
	
});
