//var {Cc, Ci} = require("chrome");
var httpRequestObserver =
{
   observe: function(subject, topic, data)
   {
      if (topic == "http-on-modify-request") {
         var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
         httpChannel.setRequestHeader("Client-ip", "0.0.0.0", false);
         httpChannel.setRequestHeader("X-forwarded-for", "0.0.0.0", false);
      }
   },

   get observerService() {
      return Cc["@mozilla.org/observer-service;1"]
         .getService(Ci.nsIObserverService);
   },

   register: function()
   {
      this.observerService.addObserver(this, "http-on-modify-request", false);
   },

   unregister: function()
   {
      this.observerService.removeObserver(this, "http-on-modify-request");
   }
};

function MyExtension() {
	var self = this;

   browserName = kango.browser.getName();
   if(browserName == 'chrome') {
      chrome.webRequest.onBeforeSendHeaders.addListener(
         function(details) {
            details.requestHeaders.push({name: 'Client-ip', value: '0.0.0.0'});
            details.requestHeaders.push({name: 'X-forwarded-for', value: '0.0.0.0'});
            return {requestHeaders: details.requestHeaders};
         },
         {urls: []},
         ['requestHeaders', 'blocking']
      );
   } else if(browserName == 'firefox') {
      httpRequestObserver.register();
      console.log("registered httpRequestObserver");
   }
}

var extension = new MyExtension();