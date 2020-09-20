const fs = require("fs");
const { Transform } = require("stream");

const state = { inside: false, buf: "" };

const startRe = /^<pre class=(\"?)idl\1>$/;

const readStream = process.argv[2]
  ? fs.createReadStream(process.argv[2], { encoding: "utf8" })
  : process.stdin;

function handle(chunk, push) {
  const combined = state.buf + chunk;
  const lastNewline = combined.lastIndexOf("\n");
  const lines = combined.slice(0, lastNewline).split("\n");
  let line = lines.shift();
  while (line != null) {
    if (state.inside) {
      if (line === "</pre>") {
        state.inside = false;
      } else if (line.includes("</pre>")) {
        state.inside = false;
        push(line.slice(0, line.indexOf("</pre>")) + "\n");
      } else {
        push(line + "\n");
      }
    } else {
      if (startRe.test(line)) {
        state.inside = true;
      }
    }
    line = lines.shift();
  }
  state.buf = combined.slice(lastNewline + 1);
}

readStream
  .pipe(
    new Transform({
      transform(/** @type {Buffer} */ chunk, _, callback) {
        const push = (content) => this.push(content.replace(/&lt;/g, "<"));
        handle(chunk.toString("utf8"), push);
        callback();
      },
      final(callback) {
        handle("\n");
        if (!["", "\n"].includes(state.buf) || state.inside) {
          callback(new Error("Invalid file: " + JSON.stringify(state)));
        } else {
          callback();
        }
      },
    })
  )
  .pipe(process.stdout);

readStream.resume();
