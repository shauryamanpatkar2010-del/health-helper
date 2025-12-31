// Health Info Helper — educational only, rule-based + safety guards

const TOPICS = {
  headache: {
    title: "Headache (educational overview)",
    info:
`Common non-urgent possibilities can include stress, dehydration, lack of sleep, eyestrain, or tension-type headaches.
What can help (general): rest, hydration, taking breaks from screens, and sleep hygiene.

Red flags (seek urgent care): sudden “worst headache,” headache with fainting, confusion, weakness, severe neck stiffness + fever, head injury, or vision loss.`,
    sources: [
      { name: "NIH: Headache basics", url: "https://www.ninds.nih.gov/health-information/disorders/headache" }
    ]
  },
  fever: {
    title: "Fever (educational overview)",
    info:
`Fever can happen with many infections (often viral). Hydration and rest are important.
Monitor for duration, temperature, and how the person is acting overall.

Red flags (seek urgent care): trouble breathing, severe dehydration, confusion, stiff neck, seizure, or fever in an infant.`,
    sources: [
      { name: "CDC: Fever information", url: "https://www.cdc.gov/" }
    ]
  },
  sore_throat: {
    title: "Sore throat (educational overview)",
    info:
`Sore throat can come from viral illness, irritation, allergies, or (sometimes) bacterial infection.
General care: fluids, rest, warm liquids.

Red flags (seek urgent care): trouble breathing, drooling/inability to swallow, severe one-sided throat pain with swelling, or high fever with worsening symptoms.`,
    sources: [
      { name: "Mayo Clinic: Sore throat", url: "https://www.mayoclinic.org/symptoms/sore-throat/basics/causes/sym-20050938" }
    ]
  },
  cough: {
    title: "Cough (educational overview)",
    info:
`Cough can come from colds, allergies, asthma, irritation, or other causes.
Watch how long it lasts and whether there are breathing problems.

Red flags (seek urgent care): chest pain, trouble breathing, blue lips, coughing blood, or worsening symptoms with high fever.`,
    sources: [
      { name: "NHS: Cough", url: "https://www.nhs.uk/conditions/cough/" }
    ]
  },
  anxiety_stress: {
    title: "Anxiety/Stress (educational overview)",
    info:
`Stress can affect sleep, focus, appetite, and mood. Helpful basics can include routine, movement, talking to someone trusted, and limiting doom-scrolling.

Urgent: If you or someone else is in danger or thinking about self-harm, seek immediate help (call emergency services or local crisis resources).`,
    sources: [
      { name: "NIMH: Anxiety disorders", url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders" }
    ]
  }
};

// Safety keyword lists (you can expand)
const EMERGENCY_KEYWORDS = [
  "chest pain", "can't breathe", "cannot breathe", "trouble breathing", "shortness of breath",
  "overdose", "unconscious", "passed out", "fainting", "seizure", "stroke",
  "suicidal", "kill myself", "self harm", "self-harm"
];

const DISALLOWED_REQUESTS = [
  "do i have", "diagnose", "am i dying", "what is wrong with me",
  "how much ibuprofen", "dosage", "dose", "mg", "prescribe", "antibiotic",
  "should i take", "what medication"
];

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const msg = document.getElementById("msg");

function addMessage(text, who = "bot") {
  const row = document.createElement("div");
  row.className = `msg ${who}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = text;
  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function containsAny(text, list) {
  return list.some(k => text.includes(k));
}

function topicByKeyword(text) {
  // Simple keyword routing
  if (text.includes("headache") || text.includes("migraine")) return "headache";
  if (text.includes("fever") || text.includes("temperature")) return "fever";
  if (text.includes("sore throat") || text.includes("throat")) return "sore_throat";
  if (text.includes("cough")) return "cough";
  if (text.includes("anxiety") || text.includes("panic") || text.includes("stress")) return "anxiety_stress";
  return null;
}

function renderTopic(key) {
  const t = TOPICS[key];
  const sources = t.sources
    .map(s => `• <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`)
    .join("<br>");
  return `<b>${t.title}</b><br><br>${t.info}<br><br><b>Learn more (trusted sources)</b><br>${sources}<br><br><i>Reminder: educational info only — not medical advice.</i>`;
}

function emergencyReply() {
  return `<b>Possible emergency</b><br><br>
If you think this might be urgent, call local emergency services (911 in the U.S.) or go to the nearest emergency department.<br><br>
If you’re in the U.S. and thinking about self-harm: call or text <b>988</b> (Suicide & Crisis Lifeline).<br><br>
<i>This tool can’t help with emergencies.</i>`;
}

function refusalReply() {
  return `I can’t diagnose conditions or provide medication dosing. I can share general educational info and “red flag” signs that mean you should seek professional care.<br><br>
Try asking: “What are common causes of a headache?” or “What are red flags with a fever?”`;
}

function defaultReply() {
  return `I can help with general health education topics like headache, fever, sore throat, cough, or anxiety/stress.<br><br>
Type a topic or click a button below.`;
}

// Initial greeting
addMessage(`Hi! I’m a <b>health education assistant</b>.<br><br>
I provide general educational information only (not medical advice). In emergencies, call local emergency services.`);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userText = msg.value;
  if (!userText) return;
  addMessage(userText, "user");
  msg.value = "";

  const text = normalize(userText);

  // Safety guards first
  if (containsAny(text, EMERGENCY_KEYWORDS)) {
    addMessage(emergencyReply(), "bot");
    return;
  }
  if (containsAny(text, DISALLOWED_REQUESTS)) {
    addMessage(refusalReply(), "bot");
    return;
  }

  // Topic routing
  const topic = topicByKeyword(text);
  if (topic) {
    addMessage(renderTopic(topic), "bot");
    return;
  }

  addMessage(defaultReply(), "bot");
});

// Quick topic buttons
document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-topic");
    addMessage(btn.textContent, "user");
    addMessage(renderTopic(key), "bot");
  });
});


