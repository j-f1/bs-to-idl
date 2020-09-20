const fs = require("fs");
const { Transform } = require("stream");

const state = { inside: false, buf: "" };

const startRe = /^<pre class=(\"?)idl\1>$/;

const readStream = fs.createReadStream(process.argv[2], { encoding: "utf8" });

readStream
  .pipe(
    new Transform({
      transform(/** @type {Buffer} */ chunk, _, callback) {
        const combined = state.buf + chunk.toString("utf8");
        const lastNewline = combined.lastIndexOf("\n");
        const lines = combined.slice(0, lastNewline).split("\n");
        let line;
        do {
          line = lines.shift();
          if (state.inside) {
            if (line === "</pre>") {
              state.inside = false;
            } else {
              this.push(line + "\n");
            }
          } else {
            if (startRe.test(line)) {
              state.inside = true;
            }
          }
        } while (line != null);
        state.buf = lines.join("\n") + combined.slice(lastNewline);
        callback();
      },
    })
  )
  .pipe(process.stdout);

readStream.resume();
