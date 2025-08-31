// Gemini API Configuration
const API_KEY = "AIzaSyCzx6ReMk8ohPJcCjGwHHzu7SvFccJqAbA"; // Your Gemini API Key
const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

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
            { id: 'default-hero', type: 'hero', content: { title: 'Your Vision, Our Canvas', subtitle: 'Tell me what you want, and I\'ll build your website instantly.', buttonText: 'Get Started' }, styles: {} },
            { id: 'default-about', type: 'text', content: { title: 'About This Project', text: 'This is an AI-powered website builder. Interact with the chatbot to add sections, change styles, and customize your site. All changes are saved locally!' }, styles: {} },
            { id: 'default-footer', type: { text: '&copy; 2023 ShapeShift AI. All rights reserved.' }, styles: {} } // Fixed: content was missing
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

// --- Gemini API Interaction ---

async function sendMessageToGemini(message) {
    showLoading();
    try {
        const websiteConfigJson = JSON.stringify(websiteConfig, null, 2);
        // Escape backticks within the stringified JSON to prevent premature template literal termination
        const escapedWebsiteConfigForPrompt = websiteConfigJson.replace(/`/g, '\\`');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an AI website design assistant. Your goal is to help the user build and modify their website.
                        The user will describe changes they want. You must respond with a JSON object containing instructions for the frontend JavaScript to execute.
                        
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
                                "id": "[sectionId]", // The ID of the section to update (e.g., "default-hero")
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
                            *   Common variables: '--primary-color', '--background-color', '--text-color', '--header-bg', '--header-text', '--font-family'.

                        5.  **Acknowledge/Inform (if no direct modification is needed or possible):**
                            \`\`\`json
                            {
                                "action": "inform",
                                "message": "Your request has been noted, but no direct modification was applied."
                            }
                            \`\`\`

                        **Important Rules:**
                        *   Always respond with a single, valid JSON object.
                        *   Do not include any text outside the JSON object.
                        *   If a section ID is not provided for update/remove, try to infer it from the request (e.g., "the hero section" implies "default-hero"). If unsure, ask for clarification or use "inform".
                        *   For image galleries, use placeholder image URLs like 'https://via.placeholder.com/300x200?text=Image1'
                        *   When adding a section, generate a unique ID for it.
                        *   If the user asks for a color, try to use a valid CSS color name or hex code.
                        *   If the user asks to change a font, provide a valid CSS font-family string.

                        **Current Website Configuration (for context, do not modify this directly):**
                        ${escapedWebsiteConfigForPrompt}

                        User request: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        hideLoading();

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            let botResponseText = data.candidates[0].content.parts[0].text; // Use 'let' to allow re-assignment
            console.log("Gemini Raw Response:", botResponseText); // Debugging

            // --- NEW FIX: Strip Markdown code block if present ---
            // This regex looks for a string starting with ```json (or just ```)
            // followed by any characters (non-greedy), and ending with ```
            const jsonCodeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
            const match = botResponseText.match(jsonCodeBlockRegex);

            if (match && match[1]) {
                botResponseText = match[1].trim(); // Extract the content inside the code block and trim whitespace
                console.log("Gemini Cleaned JSON:", botResponseText); // Debugging
            }
            // --- END NEW FIX ---

            try {
                const instruction = JSON.parse(botResponseText);
                applyGeminiInstruction(instruction);
            } catch (jsonError) {
                console.error("Failed to parse Gemini's JSON response:", jsonError);
                addBotMessage("I received a response, but it wasn't in the expected format. Could you please rephrase your request?");
                addBotMessage(`Raw response: <pre>${botResponseText}</pre>`); // Show raw for debugging
            }
        } else {
            addBotMessage("I couldn't get a clear response from the AI. Please try again.");
            console.error("Gemini API response structure unexpected:", data);
        }

    } catch (error) {
        hideLoading();
        console.error("Error communicating with Gemini API:", error);
        addBotMessage("Oops! Something went wrong while talking to the AI. Please check your API key or try again later.");
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
                } else if (instruction.position.startsWith('after:')) {
                    const targetId = instruction.position.split(':')[1];
                    const targetIndex = websiteConfig.sections.findIndex(s => s.id === targetId);
                    if (targetIndex !== -1) insertIndex = targetIndex + 1;
                }
            }
            websiteConfig.sections.splice(insertIndex, 0, newSection);
            botMessage = `Added a new ${instruction.type} section (ID: ${newId}).`;
            break;

        case 'updateSection':
            const sectionToUpdate = websiteConfig.sections.find(s => s.id === instruction.id);
            if (sectionToUpdate) {
                if (instruction.content) {
                    sectionToUpdate.content = { ...sectionToUpdate.content, ...instruction.content };
                }
                if (instruction.styles) {
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
        toggleIcon.classList.add('fa-comment-dots'); // Or fa-plus, fa-message, etc.
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
