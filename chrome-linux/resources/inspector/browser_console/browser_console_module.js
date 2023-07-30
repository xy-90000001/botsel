BrowserConsole.BrowserConsole=class{appendApplicableItems(event,contextMenu,object){const consoleMessage=(object);const request=SDK.NetworkLog.requestForConsoleMessage(consoleMessage);if(request&&SDK.NetworkManager.canReplayRequest(request)){contextMenu.debugSection().appendItem(Common.UIString('Replay XHR'),SDK.NetworkManager.replayRequest.bind(null,request));}}
render(object,options){const consoleMessage=(object);const request=SDK.NetworkLog.requestForConsoleMessage(consoleMessage);let messageElement=null;if(request){messageElement=createElement('span');if(consoleMessage.level===SDK.ConsoleMessage.MessageLevel.Error){messageElement.createTextChild(request.requestMethod+' ');messageElement.appendChild(Components.Linkifier.linkifyRevealable(request,request.url(),request.url()));if(request.failed)
messageElement.createTextChildren(' ',request.localizedFailDescription);if(request.statusCode!==0)
messageElement.createTextChildren(' ',String(request.statusCode));if(request.statusText)
messageElement.createTextChildren(' (',request.statusText,')');}else{const fragment=Console.ConsoleViewMessage.linkifyWithCustomLinkifier(consoleMessage.messageText,title=>Components.Linkifier.linkifyRevealable((request),title,request.url()));messageElement.appendChild(fragment);}}
return Promise.resolve((messageElement));}};;