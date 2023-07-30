SourcesTestRunner.dumpNavigatorView=function(navigatorView,dumpIcons){dumpNavigatorTreeOutline(navigatorView._scriptsTree);function dumpNavigatorTreeElement(prefix,treeElement){let titleText='';if(treeElement._leadingIconsElement&&dumpIcons){let icons=treeElement._leadingIconsElement.querySelectorAll('[is=ui-icon]');icons=Array.prototype.slice.call(icons);const iconTypes=icons.map(icon=>icon._iconType);if(iconTypes.length)
titleText=titleText+'['+iconTypes.join(', ')+'] ';}
titleText+=treeElement.title;if(treeElement._nodeType===Sources.NavigatorView.Types.FileSystem||treeElement._nodeType===Sources.NavigatorView.Types.FileSystemFolder){const hasMappedFiles=treeElement.listItemElement.classList.contains('has-mapped-files');if(!hasMappedFiles)
titleText+=' [dimmed]';}
TestRunner.addResult(prefix+titleText);treeElement.expand();const children=treeElement.children();for(let i=0;i<children.length;++i)
dumpNavigatorTreeElement(prefix+'  ',children[i]);}
function dumpNavigatorTreeOutline(treeOutline){const children=treeOutline.rootElement().children();for(let i=0;i<children.length;++i)
dumpNavigatorTreeElement('',children[i]);}};SourcesTestRunner.dumpNavigatorViewInAllModes=function(view){['frame','frame/domain','frame/domain/folder','domain','domain/folder'].forEach(SourcesTestRunner.dumpNavigatorViewInMode.bind(TestRunner,view));};SourcesTestRunner.dumpNavigatorViewInMode=function(view,mode){TestRunner.addResult(view instanceof Sources.NetworkNavigatorView?'Sources:':'Content Scripts:');view._groupByFrame=mode.includes('frame');view._groupByDomain=mode.includes('domain');view._groupByFolder=mode.includes('folder');view._resetForTest();TestRunner.addResult('-------- Setting mode: ['+mode+']');SourcesTestRunner.dumpNavigatorView(view);};SourcesTestRunner.addScriptUISourceCode=function(url,content,isContentScript,worldId){content+='\n//# sourceURL='+url;if(isContentScript)
content=`testRunner.evaluateScriptInIsolatedWorld(${worldId}, \`${content}\`)`;TestRunner.evaluateInPageAnonymously(content);return TestRunner.waitForUISourceCode(url);};function testSourceMapping(text1,text2,mapping,testToken){const originalPosition=text1.indexOf(testToken);TestRunner.assertTrue(originalPosition!==-1);const originalLocation=Formatter.Formatter.positionToLocation(text1.computeLineEndings(),originalPosition);const formattedLocation=mapping.originalToFormatted(originalLocation[0],originalLocation[1]);const formattedPosition=Formatter.Formatter.locationToPosition(text2.computeLineEndings(),formattedLocation[0],formattedLocation[1]);const expectedFormattedPosition=text2.indexOf(testToken);if(expectedFormattedPosition===formattedPosition)
TestRunner.addResult(String.sprintf('Correct mapping for <%s>',testToken));else
TestRunner.addResult(String.sprintf('ERROR: Wrong mapping for <%s>',testToken));}
SourcesTestRunner.testPrettyPrint=function(mimeType,text,mappingQueries,next){new Formatter.ScriptFormatter(mimeType,text,didFormatContent);function didFormatContent(formattedSource,mapping){TestRunner.addResult('====== 8< ------');TestRunner.addResult(formattedSource);TestRunner.addResult('------ >8 ======');while(mappingQueries&&mappingQueries.length)
testSourceMapping(text,formattedSource,mapping,mappingQueries.shift());next();}};SourcesTestRunner.testJavascriptOutline=function(text){let fulfill;const promise=new Promise(x=>fulfill=x);Formatter.formatterWorkerPool().javaScriptOutline(text,onChunk);const items=[];return promise;function onChunk(isLastChunk,outlineItems){items.pushAll(outlineItems);if(!isLastChunk)
return;TestRunner.addResult('Text:');TestRunner.addResult(text.split('\n').map(line=>'    '+line).join('\n'));TestRunner.addResult('Outline:');for(const item of items)
TestRunner.addResult('    '+item.name+(item.arguments||'')+':'+item.line+':'+item.column);fulfill();}};SourcesTestRunner.dumpSwatchPositions=function(sourceFrame,bookmarkType){const textEditor=sourceFrame.textEditor;const markers=textEditor.bookmarks(textEditor.fullRange(),bookmarkType);for(let i=0;i<markers.length;i++){const position=markers[i].position();const text=markers[i]._marker.widgetNode.firstChild.textContent;TestRunner.addResult('Line '+position.startLine+', Column '+position.startColumn+': '+text);}};;SourcesTestRunner.startDebuggerTest=function(callback,quiet){console.assert(TestRunner.debuggerModel.debuggerEnabled(),'Debugger has to be enabled');if(quiet!==undefined)
SourcesTestRunner._quiet=quiet;UI.viewManager.showView('sources');TestRunner.addSniffer(SDK.DebuggerModel.prototype,'_pausedScript',SourcesTestRunner._pausedScript,true);TestRunner.addSniffer(SDK.DebuggerModel.prototype,'_resumedScript',SourcesTestRunner._resumedScript,true);TestRunner.safeWrap(callback)();};SourcesTestRunner.startDebuggerTestPromise=function(quiet){let cb;const p=new Promise(fullfill=>cb=fullfill);SourcesTestRunner.startDebuggerTest(cb,quiet);return p;};SourcesTestRunner.completeDebuggerTest=function(){Common.moduleSetting('breakpointsActive').set(true);SourcesTestRunner.resumeExecution(TestRunner.completeTest.bind(TestRunner));};(function(){const origThen=Promise.prototype.then;const origCatch=Promise.prototype.catch;Promise.prototype.then=function(){const result=origThen.apply(this,arguments);origThen.call(result,undefined,onUncaughtPromiseReject.bind(null,new Error().stack));return result;};Promise.prototype.catch=function(){const result=origCatch.apply(this,arguments);origThen.call(result,undefined,onUncaughtPromiseReject.bind(null,new Error().stack));return result;};function onUncaughtPromiseReject(stack,e){const message=typeof e==='object'&&e.stack||e;TestRunner.addResult('FAIL: Uncaught exception in promise: '+message+' '+stack);SourcesTestRunner.completeDebuggerTest();}})();SourcesTestRunner.runDebuggerTestSuite=function(testSuite){const testSuiteTests=testSuite.slice();function runner(){if(!testSuiteTests.length){SourcesTestRunner.completeDebuggerTest();return;}
const nextTest=testSuiteTests.shift();TestRunner.addResult('');TestRunner.addResult('Running: '+/function\s([^(]*)/.exec(nextTest)[1]);TestRunner.safeWrap(nextTest)(runner,runner);}
SourcesTestRunner.startDebuggerTest(runner);};SourcesTestRunner.runTestFunction=function(){TestRunner.evaluateInPageAnonymously('scheduleTestFunction()');TestRunner.addResult('Set timer for test function.');};SourcesTestRunner.runTestFunctionAndWaitUntilPaused=function(callback){SourcesTestRunner.runTestFunction();SourcesTestRunner.waitUntilPaused(callback);};SourcesTestRunner.runTestFunctionAndWaitUntilPausedPromise=function(){return new Promise(SourcesTestRunner.runTestFunctionAndWaitUntilPaused);};SourcesTestRunner.runAsyncCallStacksTest=function(totalDebuggerStatements,maxAsyncCallStackDepth){const defaultMaxAsyncCallStackDepth=32;SourcesTestRunner.setQuiet(true);SourcesTestRunner.startDebuggerTest(step1);async function step1(){await TestRunner.DebuggerAgent.setAsyncCallStackDepth(maxAsyncCallStackDepth||defaultMaxAsyncCallStackDepth);SourcesTestRunner.runTestFunctionAndWaitUntilPaused(didPause);}
let step=0;const callStacksOutput=[];function didPause(callFrames,reason,breakpointIds,asyncStackTrace){++step;callStacksOutput.push(SourcesTestRunner.captureStackTraceIntoString(callFrames,asyncStackTrace)+'\n');if(step<totalDebuggerStatements){SourcesTestRunner.resumeExecution(SourcesTestRunner.waitUntilPaused.bind(SourcesTestRunner,didPause));}else{TestRunner.addResult('Captured call stacks in no particular order:');callStacksOutput.sort();TestRunner.addResults(callStacksOutput);SourcesTestRunner.completeDebuggerTest();}}};SourcesTestRunner.dumpSourceFrameMessages=function(sourceFrame,dumpFullURL){const messages=[];for(const bucket of sourceFrame._rowMessageBuckets.values()){for(const rowMessage of bucket._messages){const message=rowMessage.message();messages.push(String.sprintf('  %d:%d [%s] %s',message.lineNumber(),message.columnNumber(),message.level(),message.text()));}}
const name=(dumpFullURL?sourceFrame.uiSourceCode().url():sourceFrame.uiSourceCode().displayName());TestRunner.addResult('SourceFrame '+name+': '+messages.length+' message(s)');TestRunner.addResult(messages.join('\n'));};SourcesTestRunner.waitUntilPausedNextTime=function(callback){SourcesTestRunner._waitUntilPausedCallback=TestRunner.safeWrap(callback);};SourcesTestRunner.waitUntilPaused=function(callback){callback=TestRunner.safeWrap(callback);if(SourcesTestRunner._pausedScriptArguments)
callback.apply(callback,SourcesTestRunner._pausedScriptArguments);else
SourcesTestRunner._waitUntilPausedCallback=callback;};SourcesTestRunner.waitUntilPausedPromise=function(){return new Promise(resolve=>SourcesTestRunner.waitUntilPaused(resolve));};SourcesTestRunner.waitUntilResumedNextTime=function(callback){SourcesTestRunner._waitUntilResumedCallback=TestRunner.safeWrap(callback);};SourcesTestRunner.waitUntilResumed=function(callback){callback=TestRunner.safeWrap(callback);if(!SourcesTestRunner._pausedScriptArguments)
callback();else
SourcesTestRunner._waitUntilResumedCallback=callback;};SourcesTestRunner.waitUntilResumedPromise=function(){return new Promise(resolve=>SourcesTestRunner.waitUntilResumed(resolve));};SourcesTestRunner.resumeExecution=function(callback){if(UI.panels.sources.paused())
UI.panels.sources._togglePause();SourcesTestRunner.waitUntilResumed(callback);};SourcesTestRunner.waitUntilPausedAndDumpStackAndResume=function(callback,options){SourcesTestRunner.waitUntilPaused(paused);TestRunner.addSniffer(Sources.SourcesPanel.prototype,'_updateDebuggerButtonsAndStatusForTest',setStatus);let caption;let callFrames;let asyncStackTrace;function setStatus(){const statusElement=this.element.querySelector('.paused-message');caption=statusElement.deepTextContent();if(callFrames)
step1();}
function paused(frames,reason,breakpointIds,async){callFrames=frames;asyncStackTrace=async;if(typeof caption==='string')
step1();}
function step1(){SourcesTestRunner.captureStackTrace(callFrames,asyncStackTrace,options);TestRunner.addResult(TestRunner.clearSpecificInfoFromStackFrames(caption));TestRunner.deprecatedRunAfterPendingDispatches(step2);}
function step2(){SourcesTestRunner.resumeExecution(TestRunner.safeWrap(callback));}};SourcesTestRunner.stepOver=function(){Promise.resolve().then(function(){UI.panels.sources._stepOver();});};SourcesTestRunner.stepInto=function(){Promise.resolve().then(function(){UI.panels.sources._stepInto();});};SourcesTestRunner.stepIntoAsync=function(){Promise.resolve().then(function(){UI.panels.sources._stepIntoAsync();});};SourcesTestRunner.stepOut=function(){Promise.resolve().then(function(){UI.panels.sources._stepOut();});};SourcesTestRunner.togglePause=function(){Promise.resolve().then(function(){UI.panels.sources._togglePause();});};SourcesTestRunner.waitUntilPausedAndPerformSteppingActions=function(actions,callback){callback=TestRunner.safeWrap(callback);SourcesTestRunner.waitUntilPaused(didPause);function didPause(callFrames,reason,breakpointIds,asyncStackTrace){let action=actions.shift();if(action==='Print'){SourcesTestRunner.captureStackTrace(callFrames,asyncStackTrace);TestRunner.addResult('');while(action==='Print')
action=actions.shift();}
if(!action){callback();return;}
TestRunner.addResult('Executing '+action+'...');switch(action){case'StepInto':SourcesTestRunner.stepInto();break;case'StepOver':SourcesTestRunner.stepOver();break;case'StepOut':SourcesTestRunner.stepOut();break;case'Resume':SourcesTestRunner.togglePause();break;default:TestRunner.addResult('FAIL: Unknown action: '+action);callback();return;}
SourcesTestRunner.waitUntilResumed((actions.length?SourcesTestRunner.waitUntilPaused.bind(SourcesTestRunner,didPause):callback));}};SourcesTestRunner.captureStackTrace=function(callFrames,asyncStackTrace,options){TestRunner.addResult(SourcesTestRunner.captureStackTraceIntoString(callFrames,asyncStackTrace,options));};SourcesTestRunner.captureStackTraceIntoString=function(callFrames,asyncStackTrace,options){const results=[];options=options||{};function printCallFrames(callFrames,locationFunction,returnValueFunction){let printed=0;for(let i=0;i<callFrames.length;i++){const frame=callFrames[i];const location=locationFunction.call(frame);const script=location.script();const uiLocation=Bindings.debuggerWorkspaceBinding.rawLocationToUILocation(location);const isFramework=uiLocation?Bindings.blackboxManager.isBlackboxedUISourceCode(uiLocation.uiSourceCode):false;if(options.dropFrameworkCallFrames&&isFramework)
continue;let url;let lineNumber;if(uiLocation&&uiLocation.uiSourceCode.project().type()!==Workspace.projectTypes.Debugger){url=uiLocation.uiSourceCode.name();lineNumber=uiLocation.lineNumber+1;}else{url=Bindings.displayNameForURL(script.sourceURL);lineNumber=location.lineNumber+1;}
let s=((isFramework?'  * ':'    '))+printed++ +') '+frame.functionName+' ('+url+
((options.dropLineNumbers?'':':'+lineNumber))+')';s=s.replace(/scheduleTestFunction.+$/,'scheduleTestFunction <omitted>');results.push(s);if(options.printReturnValue&&returnValueFunction&&returnValueFunction.call(frame))
results.push('       <return>: '+returnValueFunction.call(frame).description);if(frame.functionName==='scheduleTestFunction'){const remainingFrames=callFrames.length-1-i;if(remainingFrames)
results.push('    <... skipped remaining frames ...>');break;}}
return printed;}
function runtimeCallFramePosition(){return new SDK.DebuggerModel.Location(TestRunner.debuggerModel,this.scriptId,this.lineNumber,this.columnNumber);}
results.push('Call stack:');printCallFrames(callFrames,SDK.DebuggerModel.CallFrame.prototype.location,SDK.DebuggerModel.CallFrame.prototype.returnValue);while(asyncStackTrace){results.push('    ['+(asyncStackTrace.description||'Async Call')+']');const printed=printCallFrames(asyncStackTrace.callFrames,runtimeCallFramePosition);if(!printed)
results.pop();asyncStackTrace=asyncStackTrace.parent;}
return results.join('\n');};SourcesTestRunner.dumpSourceFrameContents=function(sourceFrame){TestRunner.addResult('==Source frame contents start==');const textEditor=sourceFrame._textEditor;for(let i=0;i<textEditor.linesCount;++i)
TestRunner.addResult(textEditor.line(i));TestRunner.addResult('==Source frame contents end==');};SourcesTestRunner._pausedScript=function(callFrames,reason,auxData,breakpointIds,asyncStackTrace){if(!SourcesTestRunner._quiet)
TestRunner.addResult('Script execution paused.');const debuggerModel=this.target().model(SDK.DebuggerModel);SourcesTestRunner._pausedScriptArguments=[SDK.DebuggerModel.CallFrame.fromPayloadArray(debuggerModel,callFrames),reason,breakpointIds,asyncStackTrace,auxData];if(SourcesTestRunner._waitUntilPausedCallback){const callback=SourcesTestRunner._waitUntilPausedCallback;delete SourcesTestRunner._waitUntilPausedCallback;setTimeout(()=>callback.apply(callback,SourcesTestRunner._pausedScriptArguments));}};SourcesTestRunner._resumedScript=function(){if(!SourcesTestRunner._quiet)
TestRunner.addResult('Script execution resumed.');delete SourcesTestRunner._pausedScriptArguments;if(SourcesTestRunner._waitUntilResumedCallback){const callback=SourcesTestRunner._waitUntilResumedCallback;delete SourcesTestRunner._waitUntilResumedCallback;callback();}};SourcesTestRunner.showUISourceCode=function(uiSourceCode,callback){const panel=UI.panels.sources;panel.showUISourceCode(uiSourceCode);const sourceFrame=panel.visibleView;if(sourceFrame.loaded)
callback(sourceFrame);else
TestRunner.addSniffer(sourceFrame,'setContent',callback&&callback.bind(null,sourceFrame));};SourcesTestRunner.showUISourceCodePromise=function(uiSourceCode){let fulfill;const promise=new Promise(x=>fulfill=x);SourcesTestRunner.showUISourceCode(uiSourceCode,fulfill);return promise;};SourcesTestRunner.showScriptSource=function(scriptName,callback){SourcesTestRunner.waitForScriptSource(scriptName,onScriptSource);function onScriptSource(uiSourceCode){SourcesTestRunner.showUISourceCode(uiSourceCode,callback);}};SourcesTestRunner.showScriptSourcePromise=function(scriptName){return new Promise(resolve=>SourcesTestRunner.showScriptSource(scriptName,resolve));};SourcesTestRunner.waitForScriptSource=function(scriptName,callback){const panel=UI.panels.sources;const uiSourceCodes=panel._workspace.uiSourceCodes();for(let i=0;i<uiSourceCodes.length;++i){if(uiSourceCodes[i].project().type()===Workspace.projectTypes.Service)
continue;if(uiSourceCodes[i].name()===scriptName){callback(uiSourceCodes[i]);return;}}
TestRunner.addSniffer(Sources.SourcesView.prototype,'_addUISourceCode',SourcesTestRunner.waitForScriptSource.bind(SourcesTestRunner,scriptName,callback));};SourcesTestRunner.objectForPopover=function(sourceFrame,lineNumber,columnNumber){const debuggerPlugin=SourcesTestRunner.debuggerPlugin(sourceFrame);const{x,y}=debuggerPlugin._textEditor.cursorPositionToCoordinates(lineNumber,columnNumber);const promise=TestRunner.addSnifferPromise(ObjectUI.ObjectPopoverHelper,'buildObjectPopover');debuggerPlugin._getPopoverRequest({x,y}).show(new UI.GlassPane());return promise;};SourcesTestRunner.setBreakpoint=function(sourceFrame,lineNumber,condition,enabled){const debuggerPlugin=SourcesTestRunner.debuggerPlugin(sourceFrame);if(!debuggerPlugin._muted)
debuggerPlugin._setBreakpoint(lineNumber,0,condition,enabled);};SourcesTestRunner.removeBreakpoint=function(sourceFrame,lineNumber){const debuggerPlugin=SourcesTestRunner.debuggerPlugin(sourceFrame);const breakpointLocations=debuggerPlugin._breakpointManager.allBreakpointLocations();const breakpointLocation=breakpointLocations.find(breakpointLocation=>breakpointLocation.uiLocation.uiSourceCode===sourceFrame._uiSourceCode&&breakpointLocation.uiLocation.lineNumber===lineNumber);breakpointLocation.breakpoint.remove();};SourcesTestRunner.createNewBreakpoint=function(sourceFrame,lineNumber,condition,enabled){const debuggerPlugin=SourcesTestRunner.debuggerPlugin(sourceFrame);const promise=new Promise(resolve=>TestRunner.addSniffer(debuggerPlugin.__proto__,'_breakpointWasSetForTest',resolve));debuggerPlugin._createNewBreakpoint(lineNumber,condition,enabled);return promise;};SourcesTestRunner.toggleBreakpoint=function(sourceFrame,lineNumber,disableOnly){const debuggerPlugin=SourcesTestRunner.debuggerPlugin(sourceFrame);if(!debuggerPlugin._muted)
debuggerPlugin._toggleBreakpoint(lineNumber,disableOnly);};SourcesTestRunner.waitBreakpointSidebarPane=function(waitUntilResolved){return new Promise(resolve=>TestRunner.addSniffer(Sources.JavaScriptBreakpointsSidebarPane.prototype,'_didUpdateForTest',resolve)).then(checkIfReady);function checkIfReady(){if(!waitUntilResolved)
return;for(const{breakpoint}of Bindings.breakpointManager.allBreakpointLocations()){if(breakpoint._uiLocations.size===0&&breakpoint.enabled())
return SourcesTestRunner.waitBreakpointSidebarPane();}}};SourcesTestRunner.breakpointsSidebarPaneContent=function(){const paneElement=self.runtime.sharedInstance(Sources.JavaScriptBreakpointsSidebarPane).contentElement;const empty=paneElement.querySelector('.gray-info-message');if(empty)
return TestRunner.textContentWithLineBreaks(empty);const entries=Array.from(paneElement.querySelectorAll('.breakpoint-entry'));return entries.map(TestRunner.textContentWithLineBreaks).join('\n');};SourcesTestRunner.dumpBreakpointSidebarPane=function(title){TestRunner.addResult('Breakpoint sidebar pane '+(title||''));TestRunner.addResult(SourcesTestRunner.breakpointsSidebarPaneContent());};SourcesTestRunner.dumpScopeVariablesSidebarPane=function(){TestRunner.addResult('Scope variables sidebar pane:');const sections=SourcesTestRunner.scopeChainSections();for(let i=0;i<sections.length;++i){const textContent=TestRunner.textContentWithLineBreaks(sections[i].element);const text=TestRunner.clearSpecificInfoFromStackFrames(textContent);if(text.length>0)
TestRunner.addResult(text);if(!sections[i].objectTreeElement().expanded)
TestRunner.addResult('    <section collapsed>');}};SourcesTestRunner.scopeChainSections=function(){const children=self.runtime.sharedInstance(Sources.ScopeChainSidebarPane).contentElement.children;const sections=[];for(let i=0;i<children.length;++i)
sections.push(children[i]._section);return sections;};SourcesTestRunner.expandScopeVariablesSidebarPane=function(callback){const sections=SourcesTestRunner.scopeChainSections();for(let i=0;i<sections.length-1;++i)
sections[i].expand();TestRunner.deprecatedRunAfterPendingDispatches(callback);};SourcesTestRunner.expandProperties=function(properties,callback){let index=0;function expandNextPath(){if(index===properties.length){TestRunner.safeWrap(callback)();return;}
const parentTreeElement=properties[index++];const path=properties[index++];SourcesTestRunner._expandProperty(parentTreeElement,path,0,expandNextPath);}
TestRunner.deprecatedRunAfterPendingDispatches(expandNextPath);};SourcesTestRunner._expandProperty=function(parentTreeElement,path,pathIndex,callback){if(pathIndex===path.length){TestRunner.addResult('Expanded property: '+path.join('.'));callback();return;}
const name=path[pathIndex++];const propertyTreeElement=SourcesTestRunner._findChildPropertyTreeElement(parentTreeElement,name);if(!propertyTreeElement){TestRunner.addResult('Failed to expand property: '+path.slice(0,pathIndex).join('.'));SourcesTestRunner.completeDebuggerTest();return;}
propertyTreeElement.expand();TestRunner.deprecatedRunAfterPendingDispatches(SourcesTestRunner._expandProperty.bind(SourcesTestRunner,propertyTreeElement,path,pathIndex,callback));};SourcesTestRunner._findChildPropertyTreeElement=function(parent,childName){const children=parent.children();for(let i=0;i<children.length;i++){const treeElement=children[i];const property=treeElement.property;if(property.name===childName)
return treeElement;}};SourcesTestRunner.setQuiet=function(quiet){SourcesTestRunner._quiet=quiet;};SourcesTestRunner.queryScripts=function(filter){const scripts=TestRunner.debuggerModel.scripts();return(filter?scripts.filter(filter):scripts);};SourcesTestRunner.createScriptMock=function(url,startLine,startColumn,isContentScript,source,target,preRegisterCallback){target=target||SDK.targetManager.mainTarget();const debuggerModel=target.model(SDK.DebuggerModel);const scriptId=++SourcesTestRunner._lastScriptId+'';const lineCount=source.computeLineEndings().length;const endLine=startLine+lineCount-1;const endColumn=(lineCount===1?startColumn+source.length:source.length-source.computeLineEndings()[lineCount-2]);const hasSourceURL=!!source.match(/\/\/#\ssourceURL=\s*(\S*?)\s*$/m)||!!source.match(/\/\/@\ssourceURL=\s*(\S*?)\s*$/m);const script=new SDK.Script(debuggerModel,scriptId,url,startLine,startColumn,endLine,endColumn,0,'',isContentScript,false,undefined,hasSourceURL,source.length);script.requestContent=function(){const trimmedSource=SDK.Script._trimSourceURLComment(source);return Promise.resolve(trimmedSource);};if(preRegisterCallback)
preRegisterCallback(script);debuggerModel._registerScript(script);return script;};SourcesTestRunner._lastScriptId=0;SourcesTestRunner.checkRawLocation=function(script,lineNumber,columnNumber,location){TestRunner.assertEquals(script.scriptId,location.scriptId,'Incorrect scriptId');TestRunner.assertEquals(lineNumber,location.lineNumber,'Incorrect lineNumber');TestRunner.assertEquals(columnNumber,location.columnNumber,'Incorrect columnNumber');};SourcesTestRunner.checkUILocation=function(uiSourceCode,lineNumber,columnNumber,location){TestRunner.assertEquals(uiSourceCode,location.uiSourceCode,'Incorrect uiSourceCode, expected \''+((uiSourceCode?uiSourceCode.url():null))+'\','+' but got \''+((location.uiSourceCode?location.uiSourceCode.url():null))+'\'');TestRunner.assertEquals(lineNumber,location.lineNumber,'Incorrect lineNumber, expected \''+lineNumber+'\', but got \''+location.lineNumber+'\'');TestRunner.assertEquals(columnNumber,location.columnNumber,'Incorrect columnNumber, expected \''+columnNumber+'\', but got \''+location.columnNumber+'\'');};SourcesTestRunner.scriptFormatter=function(){return self.runtime.allInstances(Sources.SourcesView.EditorAction).then(function(editorActions){for(let i=0;i<editorActions.length;++i){if(editorActions[i]instanceof Sources.ScriptFormatterEditorAction)
return editorActions[i];}
return null;});};SourcesTestRunner.waitForExecutionContextInTarget=function(target,callback){const runtimeModel=target.model(SDK.RuntimeModel);if(runtimeModel.executionContexts().length){callback(runtimeModel.executionContexts()[0]);return;}
runtimeModel.addEventListener(SDK.RuntimeModel.Events.ExecutionContextCreated,contextCreated);function contextCreated(){runtimeModel.removeEventListener(SDK.RuntimeModel.Events.ExecutionContextCreated,contextCreated);callback(runtimeModel.executionContexts()[0]);}};SourcesTestRunner.selectThread=function(target){const threadsPane=self.runtime.sharedInstance(Sources.ThreadsSidebarPane);threadsPane._list.selectItem(target.model(SDK.DebuggerModel));};SourcesTestRunner.evaluateOnCurrentCallFrame=function(code){return TestRunner.debuggerModel.evaluateOnSelectedCallFrame({expression:code,objectGroup:'console'});};SourcesTestRunner.waitDebuggerPluginBreakpoints=function(sourceFrame){return waitUpdate().then(checkIfReady);async function waitUpdate(){await TestRunner.addSnifferPromise(Sources.DebuggerPlugin.prototype,'_breakpointDecorationsUpdatedForTest');}
function checkIfReady(){for(const{breakpoint}of Bindings.breakpointManager.allBreakpointLocations()){if(breakpoint._uiLocations.size===0&&breakpoint.enabled())
return waitUpdate().then(checkIfReady);}
return Promise.resolve();}};SourcesTestRunner.dumpDebuggerPluginBreakpoints=function(sourceFrame){const textEditor=sourceFrame._textEditor;for(let lineNumber=0;lineNumber<textEditor.linesCount;++lineNumber){if(!textEditor.hasLineClass(lineNumber,'cm-breakpoint'))
continue;const disabled=textEditor.hasLineClass(lineNumber,'cm-breakpoint-disabled');const conditional=textEditor.hasLineClass(lineNumber,'cm-breakpoint-conditional');TestRunner.addResult('breakpoint at '+lineNumber+((disabled?' disabled':''))+((conditional?' conditional':'')));const range=new TextUtils.TextRange(lineNumber,0,lineNumber,textEditor.line(lineNumber).length);let bookmarks=textEditor.bookmarks(range,Sources.DebuggerPlugin.BreakpointDecoration._bookmarkSymbol);bookmarks=bookmarks.filter(bookmark=>!!bookmark.position());bookmarks.sort((bookmark1,bookmark2)=>bookmark1.position().startColumn-bookmark2.position().startColumn);for(const bookmark of bookmarks){const position=bookmark.position();const element=bookmark[Sources.DebuggerPlugin.BreakpointDecoration._elementSymbolForTest];const disabled=element.classList.contains('cm-inline-disabled');const conditional=element.classList.contains('cm-inline-conditional');TestRunner.addResult('  inline breakpoint at ('+position.startLine+', '+position.startColumn+')'+
((disabled?' disabled':''))+((conditional?' conditional':'')));}}};SourcesTestRunner.clickDebuggerPluginBreakpoint=function(sourceFrame,lineNumber,index,next){const textEditor=sourceFrame._textEditor;const lineLength=textEditor.line(lineNumber).length;const lineRange=new TextUtils.TextRange(lineNumber,0,lineNumber,lineLength);const bookmarks=textEditor.bookmarks(lineRange,Sources.DebuggerPlugin.BreakpointDecoration._bookmarkSymbol);bookmarks.sort((bookmark1,bookmark2)=>bookmark1.position().startColumn-bookmark2.position().startColumn);const bookmark=bookmarks[index];if(bookmark){bookmark[Sources.DebuggerPlugin.BreakpointDecoration._elementSymbolForTest].click();}else{TestRunner.addResult(`Could not click on Javascript breakpoint - lineNumber: ${lineNumber}, index: ${index}`);next();}};SourcesTestRunner.debuggerPlugin=function(sourceFrame){return sourceFrame._plugins.find(plugin=>plugin instanceof Sources.DebuggerPlugin);};SourcesTestRunner.waitUntilDebuggerPluginLoaded=async function(sourceFrame){while(!SourcesTestRunner.debuggerPlugin(sourceFrame))
await TestRunner.addSnifferPromise(sourceFrame,'_ensurePluginsLoaded');return SourcesTestRunner.debuggerPlugin(sourceFrame);};SourcesTestRunner.setEventListenerBreakpoint=function(id,enabled,targetName){const pane=self.runtime.sharedInstance(BrowserDebugger.EventListenerBreakpointsSidebarPane);const auxData={'eventName':id};if(targetName)
auxData.targetName=targetName;const breakpoint=SDK.domDebuggerManager.resolveEventListenerBreakpoint(auxData);if(breakpoint.enabled()!==enabled){pane._breakpoints.get(breakpoint).checkbox.checked=enabled;pane._breakpointCheckboxClicked(breakpoint);}};TestRunner.deprecatedInitAsync(`
  function scheduleTestFunction() {
    setTimeout(testFunction, 0);
  }
`);;SourcesTestRunner.replaceInSource=function(sourceFrame,string,replacement){sourceFrame._textEditor.setReadOnly(false);for(let i=0;i<sourceFrame._textEditor.linesCount;++i){const line=sourceFrame._textEditor.line(i);const column=line.indexOf(string);if(column===-1)
continue;const range=new TextUtils.TextRange(i,column,i,column+string.length);sourceFrame._textEditor.editRange(range,replacement);break;}};SourcesTestRunner.commitSource=function(sourceFrame){sourceFrame.commitEditing();};SourcesTestRunner.undoSourceEditing=function(sourceFrame){sourceFrame._textEditor.undo();};;SourcesTestRunner.dumpSearchResults=function(searchResults){function comparator(a,b){a.url.localeCompare(b.url);}
searchResults.sort(comparator);TestRunner.addResult('Search results: ');for(let i=0;i<searchResults.length;i++){TestRunner.addResult('url: '+searchResults[i].url.replace(/VM\d+/,'VMXX')+', matchesCount: '+searchResults[i].matchesCount);}
TestRunner.addResult('');};SourcesTestRunner.dumpSearchMatches=function(searchMatches){TestRunner.addResult('Search matches: ');for(let i=0;i<searchMatches.length;i++){TestRunner.addResult('lineNumber: '+searchMatches[i].lineNumber+', line: \''+searchMatches[i].lineContent+'\'');}
TestRunner.addResult('');};SourcesTestRunner.runSearchAndDumpResults=function(scope,searchConfig,callback){const searchResults=[];const progress=new Common.Progress();scope.performSearch(searchConfig,progress,searchResultCallback,searchFinishedCallback);function searchResultCallback(searchResult){searchResults.push(searchResult);}
function searchFinishedCallback(){function comparator(searchResultA,searchResultB){return searchResultA._uiSourceCode.url().compareTo(searchResultB._uiSourceCode.url());}
searchResults.sort(comparator);for(let i=0;i<searchResults.length;++i){const searchResult=searchResults[i];const uiSourceCode=searchResult._uiSourceCode;const searchMatches=searchResult._searchMatches;if(!searchMatches.length)
continue;TestRunner.addResult('Search result #'+(i+1)+': uiSourceCode.url = '+uiSourceCode.url().replace(/VM\d+/,'VMXX'));for(let j=0;j<searchMatches.length;++j){const lineNumber=searchMatches[j].lineNumber;const lineContent=searchMatches[j].lineContent;TestRunner.addResult('  search match #'+(j+1)+': lineNumber = '+lineNumber+', lineContent = \''+lineContent+'\'');}}
callback();}};SourcesTestRunner.replaceAndDumpChange=function(sourceFrame,searchConfig,replacement,replaceAll){const modifiers=[];if(searchConfig.isRegex)
modifiers.push('regex');if(searchConfig.caseSensitive)
modifiers.push('caseSensitive');if(replaceAll)
modifiers.push('replaceAll');const modifiersString=(modifiers.length?' ('+modifiers.join(', ')+')':'');TestRunner.addResult('Running replace test for /'+searchConfig.query+'/'+replacement+'/ '+modifiersString+':');editor=sourceFrame._textEditor;const oldLines=[];for(let i=0;i<editor.linesCount;++i)
oldLines.push(editor.line(i));const searchableView=UI.panels.sources.sourcesView().searchableView();searchableView.showSearchField();searchableView._caseSensitiveButton.setToggled(searchConfig.caseSensitive);searchableView._regexButton.setToggled(searchConfig.isRegex);searchableView._searchInputElement.value=searchConfig.query;searchableView._replaceToggleButton.setToggled(true);searchableView._updateSecondRowVisibility();searchableView._replaceInputElement.value=replacement;searchableView._performSearch(true,true);if(replaceAll)
searchableView._replaceAll();else
searchableView._replace();const newLines=[];for(let i=0;i<editor.linesCount;++i)
newLines.push(editor.line(i));for(let i=0;i<newLines.length;++i){if(oldLines[i]===newLines[i])
continue;const oldLine=oldLines[i];const newLine=newLines[i];let prefixLength=0;for(let j=0;j<oldLine.length&&j<newLine.length&&newLine[j]===oldLine[j];++j)
++prefixLength;let postfixLength=0;for(let j=0;j<oldLine.length&&j<newLine.length&&newLine[newLine.length-j-1]===oldLine[oldLine.length-j-1];++j)
++postfixLength;const prefix=oldLine.substring(0,prefixLength);const removed=oldLine.substring(prefixLength,oldLine.length-postfixLength);const added=newLine.substring(prefixLength,newLine.length-postfixLength);const postfix=oldLine.substring(oldLine.length-postfixLength);TestRunner.addResult('  - '+prefix+'#'+removed+'#'+added+'#'+postfix);}};TestRunner.deprecatedInitAsync(`
  if (window.GCController)
    GCController.collect();
`);;SourcesTestRunner.createTestEditor=function(clientHeight,textEditorDelegate){const textEditor=new SourceFrame.SourcesTextEditor(textEditorDelegate||new SourceFrame.SourcesTextEditorDelegate());clientHeight=clientHeight||100;textEditor.element.style.height=clientHeight+'px';textEditor.element.style.flex='none';textEditor.show(UI.inspectorView.element);return textEditor;};function textWithSelection(text,selections){if(!selections.length)
return text;function lineWithCursor(line,column,cursorChar){return line.substring(0,column)+cursorChar+line.substring(column);}
const lines=text.split('\n');selections.sort(TextUtils.TextRange.comparator);for(let i=selections.length-1;i>=0;--i){let selection=selections[i];selection=selection.normalize();const endCursorChar=(selection.isEmpty()?'|':'<');lines[selection.endLine]=lineWithCursor(lines[selection.endLine],selection.endColumn,endCursorChar);if(!selection.isEmpty())
lines[selection.startLine]=lineWithCursor(lines[selection.startLine],selection.startColumn,'>');}
return lines.join('\n');}
SourcesTestRunner.dumpTextWithSelection=function(textEditor,dumpWhiteSpaces){let text=textWithSelection(textEditor.text(),textEditor.selections());if(dumpWhiteSpaces)
text=text.replace(/ /g,'.');TestRunner.addResult(text);};SourcesTestRunner.setLineSelections=function(editor,selections){const coords=[];for(let i=0;i<selections.length;++i){const selection=selections[i];if(typeof selection.column==='number'){selection.from=selection.column;selection.to=selection.column;}
coords.push(new TextUtils.TextRange(selection.line,selection.from,selection.line,selection.to));}
editor.setSelections(coords);};SourcesTestRunner.typeIn=function(editor,typeText,callback){callback=callback||new Function();const noop=new Function();for(let charIndex=0;charIndex<typeText.length;++charIndex){const iterationCallback=(charIndex+1===typeText.length?callback:noop);switch(typeText[charIndex]){case'\n':SourcesTestRunner.fakeKeyEvent(editor,'Enter',null,iterationCallback);break;case'L':SourcesTestRunner.fakeKeyEvent(editor,'ArrowLeft',null,iterationCallback);break;case'R':SourcesTestRunner.fakeKeyEvent(editor,'ArrowRight',null,iterationCallback);break;case'U':SourcesTestRunner.fakeKeyEvent(editor,'ArrowUp',null,iterationCallback);break;case'D':SourcesTestRunner.fakeKeyEvent(editor,'ArrowDown',null,iterationCallback);break;default:SourcesTestRunner.fakeKeyEvent(editor,typeText[charIndex],null,iterationCallback);}}};const eventCodes={Enter:13,Home:36,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40};function createCodeMirrorFakeEvent(editor,eventType,code,charCode,modifiers){function eventPreventDefault(){this._handled=true;}
const event={_handled:false,type:eventType,keyCode:code,charCode:charCode,preventDefault:eventPreventDefault,stopPropagation:function(){},target:editor._codeMirror.display.input.textarea};if(modifiers){for(let i=0;i<modifiers.length;++i)
event[modifiers[i]]=true;}
return event;}
function fakeCodeMirrorKeyEvent(editor,eventType,code,charCode,modifiers){const event=createCodeMirrorFakeEvent(editor,eventType,code,charCode,modifiers);switch(eventType){case'keydown':editor._codeMirror.triggerOnKeyDown(event);break;case'keypress':editor._codeMirror.triggerOnKeyPress(event);break;case'keyup':editor._codeMirror.triggerOnKeyUp(event);break;default:throw new Error('Unknown KeyEvent type');}
return event._handled;}
function fakeCodeMirrorInputEvent(editor,character){if(typeof character!=='string')
return;const input=editor._codeMirror.display.input;const value=input.textarea.value;const newValue=value.substring(0,input.textarea.selectionStart)+character+value.substring(input.textarea.selectionEnd);const caretPosition=input.textarea.selectionStart+character.length;input.textarea.value=newValue;input.textarea.setSelectionRange(caretPosition,caretPosition);input.poll();}
SourcesTestRunner.fakeKeyEvent=function(editor,originalCode,modifiers,callback){modifiers=modifiers||[];let code;let charCode;if(originalCode==='\''){code=222;charCode=0;}else if(originalCode==='"'){code=222;modifiers.push('shiftKey');charCode=34;}else if(originalCode==='('){code='9'.charCodeAt(0);modifiers.push('shiftKey');charCode=originalCode.charCodeAt(0);}
code=code||eventCodes[originalCode]||originalCode;if(typeof code==='string')
code=code.charCodeAt(0);if(fakeCodeMirrorKeyEvent(editor,'keydown',code,charCode,modifiers)){callback();return;}
if(fakeCodeMirrorKeyEvent(editor,'keypress',code,charCode,modifiers)){callback();return;}
const inputReadPromise=new Promise(x=>editor._codeMirror.on('inputRead',x));fakeCodeMirrorInputEvent(editor,originalCode);fakeCodeMirrorKeyEvent(editor,'keyup',code,charCode,modifiers);inputReadPromise.then(callback);};SourcesTestRunner.dumpSelectionStats=function(textEditor){const listHashMap={};const sortedKeys=[];const selections=textEditor.selections();for(let i=0;i<selections.length;++i){const selection=selections[i];const text=textEditor.text(selection);if(!listHashMap[text]){listHashMap[text]=1;sortedKeys.push(text);}else{++listHashMap[text];}}
for(let i=0;i<sortedKeys.length;++i){let keyName=sortedKeys[i];if(!keyName.length)
keyName='<Empty string>';else
keyName='\''+keyName+'\'';TestRunner.addResult(keyName+': '+listHashMap[sortedKeys[i]]);}};;SourcesTestRunner.dumpSuggestions=function(textEditor,lines){let resolve;const promise=new Promise(fulfill=>resolve=fulfill);let lineNumber=-1;let columnNumber;for(let i=0;i<lines.length;++i){columnNumber=lines[i].indexOf('|');if(columnNumber!==-1){lineNumber=i;break;}}
if(lineNumber===-1)
throw new Error('Test case is invalid: cursor position is not marked with \'|\' symbol.');textEditor.setText(lines.join('\n').replace('|',''));textEditor.setSelection(TextUtils.TextRange.createFromLocation(lineNumber,columnNumber));TestRunner.addSniffer(TextEditor.TextEditorAutocompleteController.prototype,'_onSuggestionsShownForTest',suggestionsShown);textEditor._autocompleteController.autocomplete();function suggestionsShown(words){TestRunner.addResult('========= Selection In Editor =========');SourcesTestRunner.dumpTextWithSelection(textEditor);TestRunner.addResult('======= Autocomplete Suggestions =======');TestRunner.addResult('['+words.map(item=>item.text).join(', ')+']');resolve();}
return promise;};;