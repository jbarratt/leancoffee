(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/app_view.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"card coffee-title\"> ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"title"), env.opts.autoescape);
output += "</div>\n<div class=\"card coffee-state\">\n  ";
if(runtime.contextOrFrameLookup(context, frame, "state") == "setup") {
output += "\n    <p>Welcome to a new Lean Coffee. You can share this link with anyone who wants to join:</p>\n    <pre>\n      ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "applink"), env.opts.autoescape);
output += "\n    </pre>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_presenter")) {
output += "\n      <input type=\"button\" value=\"Start Collecting Topics &#x1f4e5;\" class=\"gobutton\" id=\"nextstate\">\n    ";
;
}
output += "\n  ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "topics") {
output += "\n    <p>Please submit your topics for discussion.</p>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_presenter")) {
output += "\n      <input type=\"button\" value=\"Begin Voting &#x23f1;\" class=\"gobutton\" id=\"nextstate\">\n    ";
;
}
output += "\n  ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting") {
output += "\n    <p>Time to vote on the topics you want to discuss. You may vote for ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"votes_per_user"), env.opts.autoescape);
output += " topics.</p>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_presenter")) {
output += "\n      <input type=\"button\" value=\"Begin Discussing &#x23f1;\" class=\"gobutton\" id=\"nextstate\">\n    ";
;
}
output += "\n  ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "discussing") {
output += "\n    <p>Time to discuss</p>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_presenter")) {
output += "\n      <input type=\"button\" value=\"Next Topic &#x23f1;\" class=\"gobutton\" id=\"nexttopic\">\n      <input type=\"button\" value=\"Finish Coffee &#x23f1;\" class=\"gobutton\" id=\"nextstate\">\n    ";
;
}
output += "\n  ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "over") {
output += "\n    <p>Thanks for a great coffee. Come again next time! KISSES.</p>\n  ";
;
}
;
}
;
}
;
}
;
}
output += "\n</div>\n";
if(runtime.contextOrFrameLookup(context, frame, "state") == "topics") {
output += "\n<div class=\"card coffee-topic-submit\">\n  <span class=\"card-title\">Submit a topic for discussion</span>\n  <p>Short title (a few words)</p>\n  <input id=\"topictitle\" type=\"text\" name=\"topictitle\" size=\"50\"></input>\n  <p>Longer Description (tweet-sized or less)</p>\n  <textarea id=\"topicdescription\" name=\"topicdescription\" maxlength=\"140\" cols=\"50\" rows=\"3\"></textarea><br/>\n  <input type=\"button\" value=\"Submit this topic &#9749;\" class=\"gobutton\" id=\"submittopic\"></input>\n</div>\n";
;
}
output += "\n\n";
if(runtime.contextOrFrameLookup(context, frame, "topics")) {
output += "\n  <ul class=\"coffee-topic-list\">\n  ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "topics");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("topic", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n  <li class=\"card\">\n    <span class=\"topic-title\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "</span>\n    <span class=\"topic-description\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"description"), env.opts.autoescape);
output += "</span>\n  </li>\n  ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

