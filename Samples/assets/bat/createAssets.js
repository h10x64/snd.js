const fs = require("fs");
const mime = require("mime");

const OUTPUT_PATH = "../assets.js";
const CONFIG_PATH = "./files.json";
const ENCODING = "utf8";

var out = fs.createWriteStream(OUTPUT_PATH, {flags: "w", defaultEncoding: ENCODING, autoClose: true});
var filesStr = fs.readFileSync(CONFIG_PATH, ENCODING);
var files = JSON.parse(filesStr).files;

var UMD_START =
 "(function(root, factory) {"
+    "if (typeof define === 'function' && define.amd) {"  // AMD
+        "define([], factory);"
+    "} else if (typeof exports === 'object') {"          // node
+    "} else {"                                           // else
+        "root.snd = factory();"
+    "}"
+"}(this, function() {";

var UMD_END = "}));";

out.write(UMD_START);

out.write("ASSET = {};\n");
out.write("\n");

console.log("Start convart files.");

var progress = 1;
for (var i in files) {
    console.log("convert (" + progress + "/" + files.length + ") " + files[i].path);

    var name = files[i].name;
    var type = (files[i].type != null) ? files[i].type : mime.lookup(files[i].path);
    var content = fs.readFileSync(files[i].path);
    var base64Str = content.toString("base64");

    var outStr = "\"data:" + type + ";base64," + base64Str + "\"";
    console.log("  > " + outStr.substring(0, Math.min(64, outStr.length)) + ((outStr.length > 64) ? "..." : ""));

    out.write("ASSET[\"" + name + "\"] = ");
    out.write(outStr + ";\n");

    progress++;
}

out.write("return ASSET;" + "\n");

out.write(UMD_END);

console.log("End.");

out.end();
