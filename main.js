// UI बदलने का लॉजिक
const toolInfo = {
    script: ["🎬 Viral Script", "Create a short video script draft."],
    caption: ["✍️ Caption Maker", "Draft a caption for your social post."],
    hashtags: ["#️⃣ Hashtag Generator", "Get hashtag ideas based on your topic."],
    title: ["🚀 Title Generator", "Create attention-grabbing title drafts."],
    hooks: ["🪝 Viral Hooks", "Draft opening lines to grab attention."],
    ideas: ["💡 Content Ideas", "Brainstorm content ideas for your niche."]
};

let selected = "script";

document.querySelectorAll(".tool").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tool").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        selected = button.dataset.tool;
        document.getElementById("toolTitle").textContent = toolInfo[selected][0];
        document.getElementById("toolDesc").textContent = toolInfo[selected][1];
        document.getElementById("output").classList.add("hidden");
    });
});

// असली AI से बात करने का लॉजिक (Render Backend)
document.getElementById("generate").addEventListener("click", async () => {
    const topic = document.getElementById("topic").value.trim();
    if (!topic) {
        document.getElementById("topic").focus();
        document.getElementById("topic").placeholder = "Pehle apna topic likho!";
        return;
    }

    const platform = document.getElementById("platform").value;
    const lang = document.getElementById("language").value;
    const style = document.getElementById("style").value;
    
    // बटन को डिसेबल करें और लोडिंग दिखाएं
    const generateBtn = document.getElementById("generate");
    generateBtn.textContent = "Generating... ⏳";
    generateBtn.disabled = true;
    
    document.getElementById("result").textContent = "AI aapke liye content likh raha hai, thoda wait karein...";
    document.getElementById("output").classList.remove("hidden");

    // ⚠️ यहाँ अपना Render वाला असली URL डालें
    const BACKEND_URL = 'https://ai-video-backend-2mlc.onrender.com/api/generate-story'; 

    try {
        // हम बैकएंड को बता रहे हैं कि क्या बनाना है
        const prompt = `Write a ${style} ${selected} for ${platform} in ${lang} language about the topic: ${topic}`;
        
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: prompt })
        });

        const data = await response.json();
        
        if (data.success) {
            document.getElementById("result").textContent = data.result;
        } else {
            document.getElementById("result").textContent = "Error aagya bhai! Server se jawab nahi aaya.";
        }
    } catch (error) {
        document.getElementById("result").textContent = "Connection Error! Render server check karein.";
    } finally {
        // बटन को वापस चालू करें
        generateBtn.textContent = "✨ Generate Content";
        generateBtn.disabled = false;
    }
});

// कॉपी करने का लॉजिक
document.getElementById("copy").addEventListener("click", async () => {
    const text = document.getElementById("result").textContent;
    try {
        await navigator.clipboard.writeText(text);
        document.getElementById("copy").textContent = "Copied ✔";
    } catch {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
        document.getElementById("copy").textContent = "Copied ✔";
    }
    setTimeout(() => document.getElementById("copy").textContent = "Copy text", 1800);
});
