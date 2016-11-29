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
output += "\n      ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"to_discuss")) > 0) {
output += "\n        <input type=\"button\" value=\"Next Topic &#x23f1;\" class=\"gobutton\" id=\"nexttopic\">\n      ";
;
}
output += "\n      <input type=\"button\" value=\"Finish Coffee &#x23f1;\" class=\"gobutton\" id=\"nextstate\">\n    ";
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
output += "\n";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"discussing")) > 0) {
output += "\n  <h3>Discussing Now</h3>\n  ";
frame = frame.push();
var t_3 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"discussing");
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
output += "\n  <div class=\"card\">\n    <span class=\"card-title\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += " </span>\n    <p> ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"description"), env.opts.autoescape);
output += " <p>\n  </div>\n  ";
;
}
}
frame = frame.pop();
output += "\n";
;
}
output += "\n\n";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"to_discuss")) > 0) {
output += "\n  <h3> To Discuss </h3>\n  <ul class=\"coffee-topic-list\">\n  ";
frame = frame.push();
var t_7 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"to_discuss");
if(t_7) {var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("topic", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n  <li class=\"card\">\n    <h4>";
output += runtime.suppressValue(runtime.memberLookup((t_8),"title"), env.opts.autoescape);
output += "</h4>\n    <p>";
output += runtime.suppressValue(runtime.memberLookup((t_8),"description"), env.opts.autoescape);
output += "</p>\n    <p>Votes: ";
output += runtime.suppressValue(runtime.memberLookup((t_8),"votes"), env.opts.autoescape);
output += "</p>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting") {
output += "\n      ";
if(runtime.memberLookup((t_8),"user_voted")) {
output += "\n        <input type=\"button\" data-topiclink=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"link"), env.opts.autoescape);
output += "\" data-action=\"remove\" value=\"Remove Vote\" class=\"gobutton votebutton\" id=\"votetopic-";
output += runtime.suppressValue(runtime.memberLookup((t_8),"id"), env.opts.autoescape);
output += "\"></input>\n      ";
;
}
else {
output += "\n        <input type=\"button\" data-topiclink=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"link"), env.opts.autoescape);
output += "\" data-action=\"add\" value=\"Vote\" class=\"gobutton votebutton\" id=\"votetopic-";
output += runtime.suppressValue(runtime.memberLookup((t_8),"id"), env.opts.autoescape);
output += "\"></input>\n      ";
;
}
output += "\n    ";
;
}
output += "\n\n  </li>\n  ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n";
;
}
output += "\n\n";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"discussed")) > 0) {
output += "\n  <h3> Already Discussed </h3>\n  <ul class=\"coffee-topic-list\">\n  ";
frame = frame.push();
var t_11 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"discussed");
if(t_11) {var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("topic", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n  <li class=\"card\">\n    <h4>";
output += runtime.suppressValue(runtime.memberLookup((t_12),"title"), env.opts.autoescape);
output += "</h4>\n    <p>";
output += runtime.suppressValue(runtime.memberLookup((t_12),"description"), env.opts.autoescape);
output += "</p>\n    <p>Votes: ";
output += runtime.suppressValue(runtime.memberLookup((t_12),"votes"), env.opts.autoescape);
output += "</p>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting") {
output += "\n      ";
if(runtime.memberLookup((t_12),"user_voted")) {
output += "\n        <input type=\"button\" data-topiclink=\"";
output += runtime.suppressValue(runtime.memberLookup((t_12),"link"), env.opts.autoescape);
output += "\" data-action=\"remove\" value=\"Remove Vote\" class=\"gobutton votebutton\" id=\"votetopic-";
output += runtime.suppressValue(runtime.memberLookup((t_12),"id"), env.opts.autoescape);
output += "\"></input>\n      ";
;
}
else {
output += "\n        <input type=\"button\" data-topiclink=\"";
output += runtime.suppressValue(runtime.memberLookup((t_12),"link"), env.opts.autoescape);
output += "\" data-action=\"add\" value=\"Vote\" class=\"gobutton votebutton\" id=\"votetopic-";
output += runtime.suppressValue(runtime.memberLookup((t_12),"id"), env.opts.autoescape);
output += "\"></input>\n      ";
;
}
output += "\n    ";
;
}
output += "\n  </li>\n  ";
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

