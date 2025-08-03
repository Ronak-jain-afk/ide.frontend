let editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  mode: "python",
  theme: "default",
});

const modeMap = {
  python: "python",
  cpp: "text/x-c++src",
  java: "text/x-java",
  javascript: "javascript",
};

document.getElementById("language").addEventListener("change", function () {
  const lang = this.value;
  editor.setOption("mode", modeMap[lang]);
});

async function runCode() {
  const code = editor.getValue();
  const language = document.getElementById("language").value;

  const response = await fetch("https://ide-backend-oaav.onrender.com/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language,
      code: code,
    }),
  });

  const result = await response.json();

  if (result.run && result.run.stdout !== undefined) {
    document.getElementById("output").textContent = result.run.stdout;
  } else if (result.run && result.run.stderr) {
    document.getElementById("output").textContent = "Error:\n" + result.run.stderr;
  } else {
    document.getElementById("output").textContent = JSON.stringify(result, null, 2);
  }
}

window.runCode = runCode;

