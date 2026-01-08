// Gemini API Configuration (Proxied)
const PROXY_URL = "/.netlify/functions/gemini-proxy"; // Netlify Function Endpoint
// API Key and Model Name are now securely handled server-side.

// DOM Elements
const websiteContent = document.getElementById('website-content');
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const resetWebsiteBtn = document.getElementById('reset-website-btn');
const chatbotContainer = document.getElementById('chatbot-container'); // Get chatbot container
const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn'); // Get toggle button

// --- Website State Management ---
let websiteConfig = {
    sections: [
        { id: 'default-header', type: 'header', content: { title: 'ShapeShift AI', nav: ['Home', 'About', 'Services', 'Contact'] }, styles: {} },
        { id: 'default-hero', type: 'hero', content: { title: 'Your Vision, Our Canvas', subtitle: 'Tell me what you want, and I\'ll build your website instantly.', buttonText: 'Get Started' }, styles: {} },
        { id: 'default-about', type: 'text', content: { title: 'About This Project', text: 'This is an AI-powered website builder. Interact with the chatbot to add sections, change styles, and customize your site. All changes are saved locally!' }, styles: {} },
        { id: 'default-footer', type: 'footer', content: { text: '&copy; 2023 ShapeShift AI. All rights reserved.' }, styles: {} }
    ],
    globalStyles: {
        '--primary-color': '#007bff',
        '--secondary-color': '#6c757d',
        '--accent-color': '#28a745',
        '--background-color': '#f8f9fa',
        '--text-color': '#343a40',
        '--header-bg': '#343a40',
        '--header-text': '#ffffff',
        '--footer-bg': '#343a40',
        '--footer-text': '#ffffff',
        '--card-bg': '#ffffff',
        '--border-color': '#dee2e6',
        '--font-family': "'Poppins', sans-serif",
        '--chatbot-bg': '#ffffff',
        '--chatbot-border': '#e9ecef',
        '--bot-message-bg': '#e2f0ff',
        '--user-message-bg': '#d4edda',
    }
};

// --- Helper Functions for Website Rendering ---

function generateUniqueId(prefix = 'section') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function applyStyles(element, styles) {
    for (const prop in styles) {
        if (styles.hasOwnProperty(prop)) {
            element.style[prop] = styles[prop];
        }
    }
}

function createHeader(config) {
    const header = document.createElement('header');
    header.id = config.id;
    header.className = 'section header-section';
    applyStyles(header, config.styles);

    header.innerHTML = `
        <div class="container-inner">
            <h1 class="site-title">${config.content.title}</h1>
            <nav>
                <ul>
                    ${config.content.nav.map(item => `<li><a href="#">${item}</a></li>`).join('')}
                </ul>
            </nav>
        </div>
    `;
    return header;
}

function createHero(config) {
    const section = document.createElement('section');
    section.id = config.id;
    section.className = 'section hero-section';
    applyStyles(section, config.styles);

    section.innerHTML = `
        <div class="container-inner">
            <h2>${config.content.title}</h2>
            <p>${config.content.subtitle}</p>
            <button class="btn primary-btn">${config.content.buttonText}</button>
        </div>
    `;
    return section;
}

function createText(config) {
    const section = document.createElement('section');
    section.id = config.id;
    section.className = 'section text-section';
    applyStyles(section, config.styles);

    section.innerHTML = `
        <div class="container-inner">
            <h3>${config.content.title}</h3>
            <p>${config.content.text}</p>
        </div>
    `;
    return section;
}

function createImageGallery(config) {
    const section = document.createElement('section');
    section.id = config.id;
    section.className = 'section gallery-section';
    applyStyles(section, config.styles);

    section.innerHTML = `
        <div class="container-inner">
            <h3>${config.content.title}</h3>
            <div class="gallery-grid">
                ${config.content.images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.src}" alt="${img.alt}">
                        <p>${img.caption}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    return section;
}

function createFooter(config) {
    const footer = document.createElement('footer');
    footer.id = config.id;
    footer.className = 'section footer-section';
    applyStyles(footer, config.styles);

    footer.innerHTML = `
        <div class="container-inner">
            <p>${config.content.text}</p>
        </div>
    `;
    return footer;
}

// Map section types to their creation functions
const sectionCreators = {
    'header': createHeader,
    'hero': createHero,
    'text': createText,
    'image-gallery': createImageGallery,
    'footer': createFooter
};

function renderWebsite() {
    websiteContent.innerHTML = ''; // Clear existing content
    websiteConfig.sections.forEach(sectionConfig => {
        const creator = sectionCreators[sectionConfig.type];
        if (creator) {
            websiteContent.appendChild(creator(sectionConfig));
        }
    });

    // Apply global styles
    for (const prop in websiteConfig.globalStyles) {
        if (websiteConfig.globalStyles.hasOwnProperty(prop)) {
            document.documentElement.style.setProperty(prop, websiteConfig.globalStyles[prop]);
        }
    }
    saveWebsiteState();
}

function saveWebsiteState() {
    localStorage.setItem('websiteConfig', JSON.stringify(websiteConfig));
}

function loadWebsiteState() {
    const savedConfig = localStorage.getItem('websiteConfig');
    if (savedConfig) {
        websiteConfig = JSON.parse(savedConfig);
    }
    renderWebsite();
}

function resetWebsite() {
    localStorage.removeItem('websiteConfig');
    // Re-initialize with default config
    websiteConfig = {
        sections: [
            { id: 'default-header', type: 'header', content: { title: 'ShapeShift AI', nav: ['Home', 'About', 'Services', 'Contact'] }, styles: {} },
            { id: 'default-hero', type: 'hero', content: { title: 'Your Vision', subtitle: 'Our Canvas', buttonText: 'Get Started' }, styles: {} },
            { id: 'default-about', type: 'text', content: { title: 'About This Project', text: 'This is an AI-powered website builder. Interact with the chatbot to add sections, change styles, and customize your site. All changes are saved locally!' }, styles: {} },
            { id: 'default-footer', type: 'footer', content: { text: '&copy; 2023 ShapeShift AI. All rights reserved.' }, styles: {} } // Corrected footer type
        ],
        globalStyles: {
            '--primary-color': '#007bff',
            '--secondary-color': '#6c757d',
            '--accent-color': '#28a745',
            '--background-color': '#f8f9fa',
            '--text-color': '#343a40',
            '--header-bg': '#343a40',
            '--header-text': '#ffffff',
            '--footer-bg': '#343a40',
            '--footer-text': '#ffffff',
            '--card-bg': '#ffffff',
            '--border-color': '#dee2e6',
            '--font-family': "'Poppins', sans-serif",
            '--chatbot-bg': '#ffffff',
            '--chatbot-border': '#e9ecef',
            '--bot-message-bg': '#e2f0ff',
            '--user-message-bg': '#d4edda',
        }
    };
    renderWebsite();
    addBotMessage("Website has been reset to its default state.");
}

// --- Chatbot UI Functions ---

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to bottom
}

function addUserMessage(text) {
    addMessage('user', text);
}

function addBotMessage(text) {
    addMessage('bot', text);
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading-dots';
    loadingDiv.innerHTML = '<span></span><span></span><span></span>';
    loadingDiv.id = 'loading-indicator';
    chatHistory.appendChild(loadingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// --- Gemini API Interaction (via Serverless Proxy) ---

async function sendMessageToGemini(message) {
    showLoading();
    try {
        const websiteConfigJson = JSON.stringify(websiteConfig, null, 2);
        const escapedWebsiteConfigForPrompt = websiteConfigJson.replace(/`/g, '\\`');

        // Enhanced System Prompt for creativity and intelligence
        const systemPrompt = `You are an expert AI website design assistant, not just a command interpreter. Your goal is to understand the user's *intent* to build and modify their website, offering creative suggestions, anticipating needs, and making the website aesthetically pleasing and user-friendly.

You will always respond with a valid JSON object or an array of JSON objects representing actions for the frontend JavaScript. If a user's request implies multiple distinct actions, you *must* return an array of instruction objects.

Here are the available actions and their JSON formats:

1.  **Add a new section:**
    \`\`\`json
    {
        "action": "addSection",
        "type": "header" | "hero" | "text" | "image-gallery" | "footer",
        "position": "top" | "bottom" | "before:[sectionId]" | "after:[sectionId]", // Optional, default "bottom"
        "content": { ... }, // Content specific to the section type
        "styles": { ... } // CSS properties for the section
    }
    \`\`\`
    *   **header content:** '{ "title": "Site Name", "nav": ["Link1", "Link2"] }'
    *   **hero content:** '{ "title": "Main Title", "subtitle": "Sub text", "buttonText": "Action" }'
    *   **text content:** '{ "title": "Section Title", "text": "Paragraph content" }'
    *   **image-gallery content:** '{ "title": "Gallery Title", "images": [{ "src": "url", "alt": "desc", "caption": "text" }] }'
    *   **footer content:** '{ "text": "Copyright info" }'

2.  **Update an existing section:**
    \`\`\`json
    {
        "action": "updateSection",
        "id": "[sectionId]", // The ID of the section to update (e.g., "default-hero", "section-170123...")
        "content": { ... }, // Partial content to update
        "styles": { ... } // Partial CSS properties to update
    }
    \`\`\`

3.  **Remove a section:**
    \`\`\`json
    {
        "action": "removeSection",
        "id": "[sectionId]" // The ID of the section to remove
    }
    \`\`\`

4.  **Update global CSS variables:**
    \`\`\`json
    {
        "action": "updateGlobalStyles",
        "styles": {
            "--variable-name": "value",
            "--another-variable": "another-value"
        }
    }
    \`\`\`
    *   Common variables: '--primary-color', '--background-color', '--text-color', '--header-bg', '--header-text', '--footer-bg', '--footer-text', '--font-family'.

5.  **Reorder sections:**
    \`\`\`json
    {
        "action": "orderSections",
        "order": ["[sectionId1]", "[sectionId2]", "...", "[sectionIdN]"] // An array of ALL section IDs in their desired new order.
    }
    \`\`\`
    *   The 'order' array should ideally contain all current section IDs. Sections not included in the 'order' array will be appended at the end.

6.  **Acknowledge/Inform (if no direct modification is needed or possible, or for creative suggestions):**
    \`\`\`json
    {
        "action": "inform",
        "message": "A friendly, helpful, or creative message."
    }
    \`\`\`

**Important Rules for Creative & Intelligent Responses:**
*   **Always respond with valid JSON.** If a request implies multiple distinct actions, you *must* return an array of instruction objects. Example: \`[ { "action": "updateGlobalStyles", ... }, { "action": "addSection", ... } ]\`
*   Do not include any text outside the JSON object(s).
*   **Infer IDs:** If a section ID is not explicitly provided for update/remove/order, try to infer it from the request (e.g., "the hero section" implies "default-hero", "the first text section" implies the earliest text section). If unsure, ask for clarification or provide a creative "inform" message.
*   **Placeholder Content:** For image galleries, use placeholder image URLs like 'https://via.placeholder.com/300x200?text=Image1'.
*   **Unique IDs:** When adding a section, you only need to specify the 'type' for a new section, and the frontend will generate a unique ID. Do not try to generate IDs yourself in the JSON response.
*   **Color/Font Choices:** If the user asks for a color or font, suggest modern, aesthetically pleasing options (e.g., hex codes, common font families).
*   **Creative Suggestions:** If a user's request is vague or general (e.g., "make it better," "add more content," "make it look professional"), provide a creative "inform" message suggesting specific actions they could take, or propose an 'addSection' or 'updateGlobalStyles' action to improve the design.
*   **Error Handling (AI's side):** If you cannot fulfill a request directly, provide a helpful and encouraging 'inform' message explaining why and offering alternatives or asking for clarification.
*   **Focus on the Goal:** Help the user build and refine their website efficiently and creatively.

**Current Website Configuration (for context, DO NOT modify this directly in your response, only use it for understanding the current state):**
\`\`\`json
${escapedWebsiteConfigForPrompt}
\`\`\`

User request: ${message}
`;

        const requestBody = {
            contents: [{ parts: [{ text: systemPrompt }] }]
        };

        // --- Fetch call updated to use the local proxy URL ---
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        hideLoading();

        if (response.status !== 200) {
            console.error("Serverless Function Error:", data);
            addBotMessage(`An error occurred while contacting the AI proxy: ${data.error || 'Unknown server error'}`);
            return;
        }

        // The serverless function returns the AI's response text within a 'text' property
        let botResponseText = data.text; 
        
        if (!botResponseText) {
            addBotMessage("I couldn't get a clear response from the AI. Please try again.");
            return;
        }

        console.log("Gemini Raw Response:", botResponseText);

        // Strip Markdown code block if present
        const jsonCodeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
        const match = botResponseText.match(jsonCodeBlockRegex);

        if (match && match[1]) {
            botResponseText = match[1].trim();
            console.log("Gemini Cleaned JSON:", botResponseText);
        }

        try {
            const instructions = JSON.parse(botResponseText);
            // Handle both single object and array of objects
            if (Array.isArray(instructions)) {
                for (const instruction of instructions) {
                    applyGeminiInstruction(instruction);
                }
            } else {
                applyGeminiInstruction(instructions);
            }
        } catch (jsonError) {
            console.error("Failed to parse Gemini's JSON response:", jsonError);
            addBotMessage("I received a response, but it wasn't in the expected format. Could you please rephrase your request?");
            addBotMessage(`Raw response: <pre>${botResponseText}</pre>`); // Show raw for debugging
        }

    } catch (error) {
        hideLoading();
        console.error("Error communicating with AI Proxy:", error);
        addBotMessage("Oops! Something went wrong while communicating with the serverless function. Please check your deployment logs.");
    }
}

// --- Apply Gemini Instructions to Website State ---

function applyGeminiInstruction(instruction) {
    let botMessage = "Okay, I've made some changes to your website!";

    switch (instruction.action) {
        case 'addSection':
            const newId = generateUniqueId(instruction.type);
            const newSection = {
                id: newId,
                type: instruction.type,
                content: instruction.content || {},
                styles: instruction.styles || {}
            };

            let insertIndex = websiteConfig.sections.length; // Default to bottom

            if (instruction.position) {
                if (instruction.position === 'top') {
                    insertIndex = 0;
                } else if (instruction.position === 'bottom') {
                    insertIndex = websiteConfig.sections.length;
                } else if (instruction.position.startsWith('before:')) {
                    const targetId = instruction.position.split(':')[1];
                    const targetIndex = websiteConfig.sections.findIndex(s => s.id === targetId);
                    if (targetIndex !== -1) insertIndex = targetIndex;
                    else botMessage += ` (Note: Could not find target section '${targetId}' for 'before' position, adding to bottom.)`;
                } else if (instruction.position.startsWith('after:')) {
                    const targetId = instruction.position.split(':')[1];
                    const targetIndex = websiteConfig.sections.findIndex(s => s.id === targetId);
                    if (targetIndex !== -1) insertIndex = targetIndex + 1;
                    else botMessage += ` (Note: Could not find target section '${targetId}' for 'after' position, adding to bottom.)`;
                }
            }
            websiteConfig.sections.splice(insertIndex, 0, newSection);
            botMessage = `Added a new ${instruction.type} section (ID: ${newId}).`;
            break;

        case 'updateSection':
            const sectionToUpdate = websiteConfig.sections.find(s => s.id === instruction.id);
            if (sectionToUpdate) {
                if (instruction.content) {
                    // Deep merge for content properties, allowing partial updates
                    sectionToUpdate.content = { ...sectionToUpdate.content, ...instruction.content };
                }
                if (instruction.styles) {
                    // Deep merge for styles properties
                    sectionToUpdate.styles = { ...sectionToUpdate.styles, ...instruction.styles };
                }
                botMessage = `Updated section with ID: ${instruction.id}.`;
            } else {
                botMessage = `Could not find a section with ID: ${instruction.id} to update.`;
            }
            break;

        case 'removeSection':
            const initialLength = websiteConfig.sections.length;
            websiteConfig.sections = websiteConfig.sections.filter(s => s.id !== instruction.id);
            if (websiteConfig.sections.length < initialLength) {
                botMessage = `Removed section with ID: ${instruction.id}.`;
            } else {
                botMessage = `Could not find a section with ID: ${instruction.id} to remove.`;
            }
            break;

        case 'updateGlobalStyles':
            if (instruction.styles) {
                websiteConfig.globalStyles = { ...websiteConfig.globalStyles, ...instruction.styles };
                botMessage = "Applied global style changes.";
            } else {
                botMessage = "No global styles provided to update.";
            }
            break;
            
        case 'orderSections':
            if (instruction.order && Array.isArray(instruction.order)) {
                const newOrder = [];
                const existingSectionsMap = new Map(websiteConfig.sections.map(s => [s.id, s]));
                
                // Add sections in the specified order
                for (const id of instruction.order) {
                    if (existingSectionsMap.has(id)) {
                        newOrder.push(existingSectionsMap.get(id));
                        existingSectionsMap.delete(id); // Remove from map once added
                    } else {
                        console.warn(`Section ID '${id}' in orderSections instruction not found in current website config.`);
                    }
                }

                // Add any remaining sections that were not in the 'order' array
                // This ensures no sections are accidentally lost if not explicitly ordered.
                existingSectionsMap.forEach(section => newOrder.push(section));

                if (newOrder.length > 0) {
                    websiteConfig.sections = newOrder;
                    botMessage = `Sections reordered successfully.`;
                } else {
                    botMessage = `Could not reorder sections. No valid section IDs were provided in the order.`;
                }
            } else {
                botMessage = "Invalid 'orderSections' instruction. 'order' array is missing or malformed.";
            }
            break;

        case 'inform':
            botMessage = instruction.message;
            break;

        default:
            botMessage = "I'm not sure how to interpret that instruction. Please try a different request.";
            break;
    }

    renderWebsite(); // Re-render the entire website after changes
    addBotMessage(botMessage);
}

// --- Event Listeners ---

sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addUserMessage(message);
        sendMessageToGemini(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

resetWebsiteBtn.addEventListener('click', resetWebsite);

// --- Chatbot Toggle Logic ---
chatbotToggleBtn.addEventListener('click', () => {
    chatbotContainer.classList.toggle('chatbot-minimized');
    const isMinimized = chatbotContainer.classList.contains('chatbot-minimized');
    const toggleIcon = chatbotToggleBtn.querySelector('i');

    if (isMinimized) {
        toggleIcon.classList.remove('fa-minus');
        toggleIcon.classList.add('fa-comment-dots'); // Changed icon for minimized state
        chatbotToggleBtn.title = "Maximize Chatbot";
    } else {
        toggleIcon.classList.remove('fa-comment-dots');
        toggleIcon.classList.add('fa-minus');
        chatbotToggleBtn.title = "Minimize Chatbot";
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom when opened
    }
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadWebsiteState);
