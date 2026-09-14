// AgriSmart AI Frontend Controller
const API_BASE = ""; // Relative to origin

// DOM Elements
const locationInput = document.getElementById("locationInput");
const btnGps = document.getElementById("btnGps");
const modelSelect = document.getElementById("modelSelect");
const messagesStream = document.getElementById("messagesStream");
const chatForm = document.getElementById("chatForm");
const chatTextInput = document.getElementById("chatTextInput");
const imageUploadInput = document.getElementById("imageUploadInput");
const imagePreviewBar = document.getElementById("imagePreviewBar");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const btnRemoveImage = document.getElementById("btnRemoveImage");
const btnClearChat = document.getElementById("btnClearChat");
const apiStatusText = document.getElementById("apiStatusText");

// Weather DOM Elements
const metricTemp = document.getElementById("metricTemp");
const metricHum = document.getElementById("metricHum");
const metricRain = document.getElementById("metricRain");
const metricSoil = document.getElementById("metricSoil");
const weatherCondition = document.getElementById("weatherCondition");

let activeSelectedFile = null;

// 1. Initialize App & Fetch Telemetry
document.addEventListener("DOMContentLoaded", () => {
    checkHealth();
    fetchWeather(locationInput.value);
    
    // Bind quick chips
    document.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const query = chip.getAttribute("data-query");
            chatTextInput.value = query;
            chatForm.dispatchEvent(new Event("submit"));
        });
    });
});

// 2. Health Check
async function checkHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`);
        const data = await res.json();
        if (data.status === "healthy") {
            apiStatusText.textContent = "FastAPI Backend: Online & Ready";
            apiStatusText.style.color = "#15803d";
        }
    } catch (e) {
        apiStatusText.textContent = "FastAPI Backend: Offline (Check Port 8000)";
        apiStatusText.style.color = "#dc2626";
    }
}

// 3. Live Satellite Weather
async function fetchWeather(loc) {
    try {
        weatherCondition.textContent = "Fetching satellite weather...";
        const res = await fetch(`${API_BASE}/weather?location=${encodeURIComponent(loc)}`);
        const data = await res.json();
        
        metricTemp.textContent = `${data.temperature_c}°C`;
        metricHum.textContent = `${data.humidity_pct}%`;
        metricRain.textContent = `${data.rain_probability_pct}%`;
        metricSoil.textContent = `${data.soil_moisture_pct}%`;
        weatherCondition.textContent = `📍 ${data.location}: ${data.conditions} | FAO-56 ET₀: ${data.et0_fao_evapotranspiration_mm_day} mm/d`;
    } catch (e) {
        weatherCondition.textContent = "Satellite Weather: Baseline Offline Data";
    }
}

locationInput.addEventListener("change", () => fetchWeather(locationInput.value));

btnGps.addEventListener("click", async () => {
    btnGps.textContent = "⏳...";
    try {
        const res = await fetch("http://ip-api.com/json/?fields=status,city,regionName");
        const data = await res.json();
        if (data.status === "success") {
            locationInput.value = `${data.city}, ${data.regionName}`;
            fetchWeather(locationInput.value);
        }
    } catch (e) {
        alert("Could not detect GPS. Please enter district manually.");
    } finally {
        btnGps.textContent = "📍 GPS";
    }
});

// 4. File Upload Handling
imageUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    activeSelectedFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        previewName.textContent = file.name;
        imagePreviewBar.style.display = "flex";
    };
    reader.readAsDataURL(file);
});

btnRemoveImage.addEventListener("click", () => {
    activeSelectedFile = null;
    imageUploadInput.value = "";
    imagePreviewBar.style.display = "none";
});

// 5. Chat Form Submit
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatTextInput.value.trim();
    const file = activeSelectedFile;
    
    if (!text && !file) return;

    // Reset input states
    chatTextInput.value = "";
    const attachedFile = file;
    const attachedImgData = previewImg.src;
    
    activeSelectedFile = null;
    imageUploadInput.value = "";
    imagePreviewBar.style.display = "none";

    // Append User Message to UI
    appendUserMessage(text, attachedFile ? attachedImgData : null);

    // Append Assistant Loading Skeleton
    const loadingId = appendLoadingMessage();

    try {
        if (attachedFile) {
            // Multimodal Diagnosis endpoint
            const formData = new FormData();
            formData.append("file", attachedFile);
            formData.append("location", locationInput.value);
            formData.append("model_type", modelSelect.value);
            if (text) formData.append("user_prompt", text);

            const res = await fetch(`${API_BASE}/diagnose`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            removeLoadingMessage(loadingId);
            appendDiagnosisCard(data);
        } else {
            // Text Agronomy Chat endpoint
            const res = await fetch(`${API_BASE}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: text,
                    location: locationInput.value
                })
            });
            const data = await res.json();
            removeLoadingMessage(loadingId);
            appendAssistantMessage(data.response, data.source);
        }
    } catch (err) {
        removeLoadingMessage(loadingId);
        appendAssistantMessage("⚠️ **Error connecting to AgriSmart Backend:** Please ensure the FastAPI server is running on port 8000 (`python -m uvicorn src.api.main:app --port 8000`).", "System Error");
    }
});

// 6. UI Render Helpers
function appendUserMessage(text, imgSrc) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message user-msg";
    
    let content = "";
    if (imgSrc) {
        content += `<img src="${imgSrc}" alt="Uploaded Leaf">`;
    }
    if (text) {
        content += `<div>${escapeHtml(text)}</div>`;
    }
    
    msgDiv.innerHTML = `
        <div class="msg-avatar">🧑‍🌾</div>
        <div class="msg-bubble">${content}</div>
    `;
    messagesStream.appendChild(msgDiv);
    scrollToBottom();
}

function appendAssistantMessage(text, source) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message assistant-msg";
    
    // Parse markdown bold and newlines
    let formatted = formatMarkdown(text);
    if (source) {
        formatted += `<div style="font-size:0.75rem; color:#64748b; margin-top:8px;"><i>Grounded by: ${source}</i></div>`;
    }
    
    msgDiv.innerHTML = `
        <div class="msg-avatar">🌱</div>
        <div class="msg-bubble">${formatted}</div>
    `;
    messagesStream.appendChild(msgDiv);
    scrollToBottom();
}

function appendDiagnosisCard(data) {
    const pred = data.prediction;
    const adv = data.advisory;
    const dec = adv.actionable_decisions || {};
    const rag = adv.rag_knowledge || {};
    const details = rag.details || {};
    const isHealthy = pred.disease.toLowerCase().includes("healthy");

    const msgDiv = document.createElement("div");
    msgDiv.className = "message assistant-msg";
    
    const sprayBadge = (dec.chemical_spray_window || "").includes("HOLD") 
        ? "🚨 <b>HOLD SPRAY</b>" 
        : ((dec.chemical_spray_window || "").includes("DRIFT") ? "⚠️ <b>HIGH DRIFT RISK</b>" : "✅ <b>OPTIMAL SPRAY WINDOW</b>");
        
    const irrBadge = (dec.smart_irrigation || "").includes("DELAY") 
        ? "🚨 <b>DELAY IRRIGATION</b>" 
        : ((dec.smart_irrigation || "").includes("NOW") ? "💧 <b>IRRIGATE NOW</b>" : "✅ <b>OPTIMAL MOISTURE</b>");

    msgDiv.innerHTML = `
        <div class="msg-avatar">🌱</div>
        <div class="msg-bubble" style="width:100%; max-width:840px; padding:0; background:transparent; border:none; box-shadow:none;">
            <div class="diagnosis-card">
                <div class="diagnosis-header">
                    <span class="diagnosis-name">${isHealthy ? "✅" : "⚠️"} ${pred.disease}</span>
                    <span class="confidence-badge">Confidence: ${(pred.confidence * 100).toFixed(1)}%</span>
                </div>
                <div class="diagnosis-meta">
                    📍 <b>Farm:</b> ${locationInput.value} &nbsp;|&nbsp; 🌾 <b>Crop:</b> ${pred.crop} &nbsp;|&nbsp; 🧠 <b>Engine:</b> ${modelSelect.value}
                </div>

                <div class="assessment-box">
                    <div class="assessment-title">👨‍🌾 Senior Agronomist Field Assessment:</div>
                    <div>${formatMarkdown(adv.llm_expert_advisory || "Foliar symptoms diagnosed. Follow ICAR treatment plan below.")}</div>
                </div>

                <div class="action-grid">
                    <div class="action-card chem">
                        <b>🧪 Targeted Chemical Remedy</b>
                        <span>${details.chemical_treatment || "Apply recommended registered fungicide according to local dosage."}</span>
                    </div>
                    <div class="action-card org">
                        <b>🌿 Bio-Control & Organic Alternative</b>
                        <span>${details.organic_treatment || "Spray Copper Hydroxide (2g/L) or Neem Seed Kernel Extract (5%)."}</span>
                    </div>
                    <div class="action-card spray">
                        <b>🌦️ Spray Decision (${locationInput.value.split(',')[0]})</b>
                        <span>${sprayBadge}: ${(dec.chemical_spray_window || "").replace(/.*?: /, '')}</span>
                    </div>
                    <div class="action-card irr">
                        <b>💧 Smart Irrigation & Moisture</b>
                        <span>${irrBadge}: ${(dec.smart_irrigation || "").replace(/.*?: /, '')}</span>
                    </div>
                </div>

                <div class="prevention-banner">
                    🛡️ <b>Field Prevention & Sanitation:</b> ${details.prevention || "Maintain plant spacing and practice 3-year crop rotation."}
                </div>

                <details class="pathogen-details">
                    <summary>🔬 Pathogen Biology, Sustainability & Verification</summary>
                    <div style="margin-top:8px; line-height:1.6;">
                        • <b>Causal Organism:</b> <i>${details.pathogen || "N/A"}</i><br>
                        • <b>Visual Symptomatology:</b> ${details.symptoms || "Foliar lesions on leaves"}<br>
                        • <b>Sustainability Index:</b> <b>${dec.sustainability_index || "90/100"}</b> (Est. water conserved: ${dec.water_conservation_estimate_liters || "3500"} L/acre)<br>
                        • <b>Grounded Standards:</b> <i>ICAR/TNAU Plant Pathology Standards & ChromaDB Vector Store</i>
                    </div>
                </details>
            </div>
        </div>
    `;
    messagesStream.appendChild(msgDiv);
    scrollToBottom();
}

function appendLoadingMessage() {
    const id = "loading_" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.className = "message assistant-msg";
    msgDiv.id = id;
    msgDiv.innerHTML = `
        <div class="msg-avatar">🌱</div>
        <div class="msg-bubble" style="color:#64748b;">
            <i>Analyzing symptoms & querying ICAR knowledge base...</i>
        </div>
    `;
    messagesStream.appendChild(msgDiv);
    scrollToBottom();
    return id;
}

function removeLoadingMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    messagesStream.scrollTop = messagesStream.scrollHeight;
}

btnClearChat.addEventListener("click", () => {
    messagesStream.innerHTML = `
        <div class="message assistant-msg welcome-msg">
            <div class="msg-avatar">🌱</div>
            <div class="msg-bubble">
                <b>Chat cleared.</b> Upload an image or ask any crop question to begin.
            </div>
        </div>
    `;
});

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatMarkdown(text) {
    if (!text) return "";
    let html = text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
        
    if (html.includes("<li>")) {
        html = html.replace(/(<li>.*?<\/li>)/gim, "<ul>$1</ul>");
    }
    return html;
}
