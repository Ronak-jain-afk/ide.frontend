// Initialize CodeMirror editor
        let editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            mode: "python",
            theme: "material-darker",
            indentUnit: 4,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        // Language mode mapping
        const modeMap = {
            python: "python",
            cpp: "text/x-c++src",
            java: "text/x-java",
            javascript: "javascript",
        };

        // Language display names
        const langNames = {
            python: "Python",
            cpp: "C++",
            java: "Java",
            javascript: "JavaScript"
        };

        // Update editor mode when language changes
        document.getElementById("language").addEventListener("change", function () {
            const lang = this.value;
            editor.setOption("mode", modeMap[lang]);
            document.getElementById("currentLang").textContent = langNames[lang];
            
            // Update default code based on language
            const defaultCode = {
                python: '# Welcome to NeoCode IDE\n# Write your Python code here\n\nprint("Hello, Future!")',
                cpp: '// Welcome to NeoCode IDE\n// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Future!" << endl;\n    return 0;\n}',
                java: '// Welcome to NeoCode IDE\n// Write your Java code here\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Future!");\n    }\n}',
                javascript: '// Welcome to NeoCode IDE\n// Write your JavaScript code here\n\nconsole.log("Hello, Future!");'
            };
            
            if (editor.getValue().includes("Welcome to NeoCode IDE")) {
                editor.setValue(defaultCode[lang]);
            }
        });

        // Update stats when editor content changes
        editor.on("change", function() {
            const content = editor.getValue();
            const lines = content.split('\n').length;
            const chars = content.length;
            
            document.getElementById("lineCount").textContent = lines;
            document.getElementById("charCount").textContent = chars;
        });

        // Run code function with the original backend call
        async function runCode() {
            const code = editor.getValue();
            const language = document.getElementById("language").value;
            const outputElement = document.getElementById("output");
            const runButton = document.getElementById("runButton");
            const loadingSpinner = document.getElementById("loadingSpinner");

            // Show loading state
            runButton.classList.add("loading");
            runButton.textContent = "Executing...";
            loadingSpinner.style.display = "inline-block";
            outputElement.textContent = "Executing code...";
            outputElement.className = "output-content";

            try {
                // Use the same backend call from the original file
                const response = await fetch("https://your-backend.onrender.com/run", {
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

                // Handle the response the same way as the original
                if (result.run && result.run.stdout !== undefined) {
                    outputElement.textContent = result.run.stdout;
                    outputElement.className = "output-content";
                } else if (result.run && result.run.stderr) {
                    outputElement.textContent = "Error:\n" + result.run.stderr;
                    outputElement.className = "output-content error";
                } else {
                    outputElement.textContent = JSON.stringify(result, null, 2);
                    outputElement.className = "output-content";
                }
            } catch (error) {
                outputElement.textContent = "Network Error: " + error.message;
                outputElement.className = "output-content error";
            } finally {
                // Hide loading state
                runButton.classList.remove("loading");
                runButton.textContent = "Execute Code";
                loadingSpinner.style.display = "none";
            }
        }

        // Create animated background particles
        function createParticles() {
            const bgAnimation = document.getElementById("bgAnimation");
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");
                particle.className = "particle";
                particle.style.left = Math.random() * 100 + "%";
                particle.style.top = Math.random() * 100 + "%";
                particle.style.animationDelay = Math.random() * 6 + "s";
                particle.style.animationDuration = (Math.random() * 3 + 3) + "s";
                bgAnimation.appendChild(particle);
            }
        }

        // Initialize particles on load
        window.addEventListener("load", createParticles);

        // Keyboard shortcuts
        document.addEventListener("keydown", function(e) {
            // Ctrl/Cmd + Enter to run code
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runCode();
            }
        });

        // Initialize stats
        editor.on("change", function() {
            const content = editor.getValue();
            const lines = content.split('\n').length;
            const chars = content.length;
            
            document.getElementById("lineCount").textContent = lines;
            document.getElementById("charCount").textContent = chars;
        });

        // Initial stats update
        setTimeout(() => {
            const content = editor.getValue();
            const lines = content.split('\n').length;
            const chars = content.length;
            
            document.getElementById("lineCount").textContent = lines;
            document.getElementById("charCount").textContent = chars;
        }, 100);
