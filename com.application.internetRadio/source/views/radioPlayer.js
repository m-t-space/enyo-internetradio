

enyo.kind({
	name: "RadioPlayback",
	
	classes:"radio-main",
	open: false,
	controlsOpen: false,
	handlers: {
		onAudioEnd: "audioEnd"
	},
	audioTracks: [],
	index: null,
	controlDrawerComponents:[],
	playheadJob: null,
	//* @public
	published: {
		/**
			When false, audio player doesn't response to remote controller
		*/
		handleRemoteControlKey: true
	},
	//* @protected
	audioComponents: [
		{name: "audio", kind: "enyo.Audio", onEnded: "audioEnd"},
		{kind: "enyo.Signals", onkeyup:"remoteKeyHandler"},
		{name: "trackIcon",classes:"radio-track",kind: "FittableColumns", noStretch:true,  components: [
			//{name: "trackIcon", classes: "radio-audio-playback-track-icon"},
			{classes: "radio-audio-track-info",  components: [
				{name: "trackName", content: "Choose your Genre"},
				{name: "artistName", content: "Slide from the right"}
			]},
			//]},
			{ kind: "FittableRows", classes:"audio-controls layout", components: [
			//	{name: "trackName", content: "Choose your Genre"},
			//	{name: "artistName", content: "Slide from the right"},
				{kind: "onyx.IconButton", name: "btnPlay", classes: "radio-audios-icon-button center", src: "assets/icon-play-btn.png", ontap: "togglePlay"},
				{name: "spinnerElement", showing: false, kind: "onyx.Spinner", floating: true, centered: true},
				{name: "timePlayed", content: "0:00"},
			]}
		]}

	],
	initComponents: function() {
		this.inherited(arguments);
		this.components = null;
	},
	create: function() {
		this.inherited(arguments);
		this.createComponents(this.audioComponents, {owner:this});
	},
	rendered: function() {
		this.inherited(arguments);
	},
	toggleTrackDrawer: function() {
		this.$.client.setOpen(!this.$.client.getOpen());
	},
	endPlayheadJob: function() {
		clearInterval(this.playheadJob);
		this.playheadJob = null;
	},
	audioEnd: function() {
		this.$.btnPlay.setShowing(false);
		this.$.spinnerElement.show();
	},
	updateTrackIndex: function(inIndex) {
		var a = this.audioTracks[inIndex];
		this.$.trackName.setContent(a.trackName);
		this.$.artistName.setContent(a.artistName);
		this.$.audio.setSrc(a.src);
		this.updatePlayTime("0:00", "0:00");
		this.applyStyle(	"background-repeat", "no-repeat");
		this.applyStyle("background-size", "100% 100%");
		//this.applyStyle("background-position", "");
		this.applyStyle("background-image", "url("+a.thumb+")");
		this.playNext();
	},
	updatePlayhead: function() {
		var duration = this.$.audio.getDuration();
		var totalTime = isNaN(duration) ? 0 : duration;
		var currentTime = this.$.audio.getCurrentTime();
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
	},
	updatePlayTime: function(inStart, inEnd) {
		this.$.timePlayed.setContent(inStart);
	},
	toReadableTime: function(inValue) {
		var minutes = Math.floor(inValue / 60).toString();
		var seconds = Math.floor(inValue - minutes * 60).toString();
		if (seconds < 10) {
			seconds = "0" + seconds;
		} else if (seconds.length === 1) {
			seconds += "0";
		}
		return minutes + ":" + seconds;
	},
	//* @public
	togglePlay: function() {
		if (this.$.audio.getPaused()) {
			this.play();
		} else {
			this.pause();
		}
	},
	playNext:function(){
		this.$.spinnerElement.hide();
		this.$.btnPlay.setShowing(true);
		this.$.audio.play();
		if (this.playheadJob === null) {
			this.playheadJob = setInterval(this.bindSafely("updatePlayhead"), 500);
		}
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
	},
	play: function() {
		this.$.audio.play();
		if (this.playheadJob === null) {
			this.playheadJob = setInterval(this.bindSafely("updatePlayhead"), 500);
		}
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
	},
	pause: function() {
		this.$.audio.pause();
		this.endPlayheadJob();
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
	},
	playAtIndex: function(inIndex) {
		this.index = (this.audioTracks.length > inIndex) ? inIndex : 0;
		this.updateTrackIndex(this.index);
		this.play();
	},
	addAudioTrack: function(inSrc, inTrack, inArtist, inAlbum, inDuration, inThumb) {
		var a = {
			src: inSrc,
			trackName: inTrack,
			artistName: inArtist,
			albumName: inAlbum,
			duration: inDuration,
			thumb: inThumb
		};
		this.audioTracks[0] = a;
		console.log(a);
		this.updateTrackIndex(0);
		this.waterfall("onAddAudio", {tracks: this.audioTracks});
	},
	remoteKeyHandler: function(inSender, inEvent) {
		if (this.handleRemoteControlKey) {
			switch (inEvent.keySymbol) {
			case 'play':
				this.play();
				break;
			case 'pause':
				this.pause();
				break;
			}
		}
		return true;
	}
});
