/**
* VoiceControlComponent uses Web Speech API to recognize speech
* Usage:
*   {{voice-control onResult="onResult"}}
*/
App.VoiceControlComponent = Ember.Component.extend({
  enabled: false, // whether recognition is enabled
  speechRecognition: null, // the instance of webkitSpeechRecognition
  language: 'en', // language to recognise
  startRecognition: function() {
    // prefixed SpeechRecognition object because it only works in Chrome
    var speechRecognition = new webkitSpeechRecognition();
    // not continuous to avoid delays
    speechRecognition.continuous = false;
    // only the final result
    speechRecognition.interimResults = false;
    // the recognition language
    speechRecognition.lang = this.get('language');
    // binding various handlers
    speechRecognition.onresult = Ember.run.bind(this, this.onRecoginitionResult);
    speechRecognition.onerror = Ember.run.bind(this, this.onRecognitionError);
    speechRecognition.onend = Ember.run.bind(this, this.onRecognitionEnd);
    // starting the recognition
    speechRecognition.start();
  },
  onRecognitionEnd: function() {
    this.set('enabled', false);
  },
  onRecognitionError: function() {
    alert('Recognition error');
  },
  /**
  * e is a SpeechRecognitionEvent
  * https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi.html#speechreco-event
  */
  onRecoginitionResult: function(e) {
    var result = '';
    var resultNo = 0;
    var alternativeNo = 0;
    // we get the first alternative of the first result
    result = e.results[resultNo][alternativeNo].transcript;
    // report the result to the outside
    this.sendAction('onResult', result);
  },
  onEnabledChange: function() {
    if (this.get('enabled')) {
      this.startRecognition();
    }
  }.observes('enabled'),
  actions: {
    toggle: function() {
      this.toggleProperty('enabled');
    }
  }
});