(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/app_view.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"card coffee-title\">\n  <span class=\"card-title\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"title"), env.opts.autoescape);
output += "</span>\n  <span>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_presenter")) {
output += "\n      ";
if(runtime.contextOrFrameLookup(context, frame, "state") == "topics") {
output += "\n        <a href=\"/\" id=\"nextstate\" class=\"btn btn-large\">Start Voting</a>\n      ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting") {
output += "\n        <a href=\"/\" id=\"nextstate\" class=\"btn btn-large\">Start Discussion</a>\n      ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "discussing") {
output += "\n        ";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"to_discuss")) > 0) {
output += "\n        <a href=\"/\" id=\"nexttopic\" class=\"btn btn-large\">Next Topic</a>\n        ";
;
}
output += "\n        <a href=\"/\" id=\"nextstate\" class=\"btn btn-large\">End Coffee</a>\n      ";
;
}
;
}
;
}
output += "\n    ";
;
}
output += "\n  </span>\n</div>\n";
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting" || runtime.contextOrFrameLookup(context, frame, "state") == "over") {
output += "\n<div class=\"card coffee-state\">\n  ";
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting") {
output += "\n    <p>Time to vote on the topics you want to discuss. You may vote for ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"votes_per_user"), env.opts.autoescape);
output += " topics.</p>\n  ";
;
}
else {
if(runtime.contextOrFrameLookup(context, frame, "state") == "over") {
output += "\n    <p>Thanks for a great coffee. Please print this page to save your records, sessions are cleaned up shortly after they are closed.</p>\n  ";
;
}
;
}
output += "\n</div>\n";
;
}
output += "\n";
if(runtime.contextOrFrameLookup(context, frame, "state") == "topics") {
output += "\n<div class=\"card coffee-topic-submit\">\n  <h3>Suggest a topic for discussion</h3>\n  <p>Short title (a few words)</p>\n  <input id=\"topictitle\" type=\"text\" name=\"topictitle\" size=\"50\"></input>\n  <p>Longer Description (Optional, and tweet-sized or less)</p>\n  <textarea id=\"topicdescription\" name=\"topicdescription\" maxlength=\"140\" cols=\"50\" rows=\"3\"></textarea><br/>\n  <a href=\"/\" id=\"submittopic\" class=\"btn btn-medium\">Submit This Topic</a>\n</div>\n";
;
}
output += "\n";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"discussing")) > 0) {
output += "\n  <h3 class=\"topicgroup-label\">Discussing Now</h3>\n  ";
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
output += "\n  <h3 class=\"topicgroup-label\"> To Discuss </h3>\n  <ul class=\"coffee-topic-list\">\n  ";
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
output += "\n  <li class=\"card\">\n    <div class=\"gorow\">\n      <div class=\"cardcontent\">\n        <h4>";
output += runtime.suppressValue(runtime.memberLookup((t_8),"title"), env.opts.autoescape);
output += "</h4>\n        <p>";
output += runtime.suppressValue(runtime.memberLookup((t_8),"description"), env.opts.autoescape);
output += "</p>\n      </div>\n      <div>\n        <span>Votes: ";
output += runtime.suppressValue(runtime.memberLookup((t_8),"votes"), env.opts.autoescape);
output += "</span>\n        <div>\n        ";
if(runtime.contextOrFrameLookup(context, frame, "state") == "voting") {
output += "\n          ";
if(runtime.memberLookup((t_8),"user_voted")) {
output += "\n            <a href=\"/\" id=\"votetopic-";
output += runtime.suppressValue(runtime.memberLookup((t_8),"id"), env.opts.autoescape);
output += "\" data-topiclink=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"link"), env.opts.autoescape);
output += "\" data-action=\"remove\" class=\"btn btn-medium votebutton\">UnVote</a>\n          ";
;
}
else {
output += "\n            <a href=\"/\" id=\"votetopic-";
output += runtime.suppressValue(runtime.memberLookup((t_8),"id"), env.opts.autoescape);
output += "\" data-topiclink=\"";
output += runtime.suppressValue(runtime.memberLookup((t_8),"link"), env.opts.autoescape);
output += "\" data-action=\"add\" class=\"btn btn-medium votebutton\">Vote</a>\n          ";
;
}
output += "\n        ";
;
}
output += "\n      </div>\n    </div>\n  </li>\n  ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n";
;
}
output += "\n\n";
if(env.getFilter("length").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "topics")),"discussed")) > 0) {
output += "\n  <h3 class=\"topicgroup-label\"> Already Discussed </h3>\n  <ul class=\"coffee-topic-list\">\n  ";
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
output += "\n  <li class=\"card\">\n    <div class=\"gorow\">\n      <div class=\"cardcontent\">\n        <h4>";
output += runtime.suppressValue(runtime.memberLookup((t_12),"title"), env.opts.autoescape);
output += "</h4>\n        <p>";
output += runtime.suppressValue(runtime.memberLookup((t_12),"description"), env.opts.autoescape);
output += "</p>\n      </div>\n    <div>\n  </li>\n  ";
;
}
}
frame = frame.pop();
output += "\n  </ul>\n";
;
}
output += "\n\n<div class=\"card footer\">\n  <p>Share <a href=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "applink"), env.opts.autoescape);
output += "\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "applink"), env.opts.autoescape);
output += "</a> with other participants. Copy to clipboard:\n  <button class=\"copyme\" data-clipboard-text=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "applink"), env.opts.autoescape);
output += "\"> <img src=\"img/clippy.svg\" alt=\"Copy to clipboard\" class=\"clippy\" width=\"13\"> </button>\n</p>\n</div>\n";
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

