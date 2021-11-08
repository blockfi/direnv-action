const core = require('@actions/core');
const cp = require("child_process");
const fs = require("fs");

// most @actions toolkit packages have async methods
async function run() {
  try {
    // If there's no .envrc, skip all this
    if(fs.existsSync(".envrc")) {
      const binary = './dist/direnv-2.28/direnv';
      const os = cp.execSync('uname', { encoding: "utf-8" }).toLowerCase().trim();
      const direnv = `${binary}.${os}-amd64`; // Some kind soul could eventually bring arm64 into the fold

      cp.execSync(`${direnv} allow`, { encoding: "utf-8" });
      const envs = JSON.parse(cp.execSync(`${direnv} export json`, { encoding: "utf-8" }));

      Object.keys(envs).forEach(function (name) {
        const value = envs[name];
        core.exportVariable(name, value);
      });
    } else {
      core.info(`.envrc not found, skipping direnv allow`);
    }
  }
  // We still want all other errors to fail the action.
  catch (error) {
    core.setFailed(error.message);
  }

}

run()
