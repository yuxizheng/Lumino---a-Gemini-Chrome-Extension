// Debug message to verify content script is running
console.log('Content script is running');

/* ---------------------------------------- Shadow Host ---------------------------------------- */

// Create a shadow host element
const shadowHost = document.createElement("div");
shadowHost.style.position = "fixed";
shadowHost.style.right = "0";
shadowHost.style.top = "0";
shadowHost.style.width = "300px";
shadowHost.style.height = "100%";
shadowHost.style.zIndex = "1000";
document.body.appendChild(shadowHost);

const shadowRoot = shadowHost.attachShadow({ mode: "open" });

const style = document.createElement("style");
shadowRoot.appendChild(style);

/* ---------------------------------------- UI elements ---------------------------------------- */
// Create the floating icon
const floatingIcon = document.createElement("div");
floatingIcon.textContent = "L"; // Letter L
floatingIcon.style.cssText = `
  position: fixed;
  top: 50%; /* Center vertically */
  transform: translateY(-50%);
  right: 0; /* Cling to the right edge */
  width: 40px;
  height: 40px;
  background-color: #A999D2; 
  color: white;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 0 0 8px; /* Rounded left corners */
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: background-color 0.3s ease, transform 0.3s ease;
`;

// Add hover effect
floatingIcon.addEventListener("mouseenter", () => {
  floatingIcon.style.backgroundColor = "#8A7EB3";
  floatingIcon.style.transform = "translateY(-50%) scale(1.1)";
});

floatingIcon.addEventListener("mouseleave", () => {
  floatingIcon.style.backgroundColor = "#A999D2";
  floatingIcon.style.transform = "translateY(-50%)";
});

// Add click event
floatingIcon.addEventListener("click", () => {
  showConversationPanel();
});

// Append the floating icon to the body
document.body.appendChild(floatingIcon);

const shadowStyle = document.createElement('style');
shadowStyle.textContent = `
  /* Style the scrollbar */
  ::-webkit-scrollbar {
    width: 6px; /* Set scrollbar width */
    height: 6px; /* Set scrollbar height for horizontal scrollbars */
  }

  /* Style the scrollbar track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* Light grey background */
    border-radius: 10px; /* Rounded edges */
  }

  /* Style the scrollbar thumb */
  ::-webkit-scrollbar-thumb {
    background: #d3d3d3; /* Light grey thumb */
    border-radius: 10px; /* Rounded edges */
  }

  /* Hover effect for the scrollbar thumb */
  ::-webkit-scrollbar-thumb:hover {
    background: #a9a9a9; /* Slightly darker grey on hover */
  }
`;

// Append the styles to your ShadowRoot
shadowRoot.appendChild(shadowStyle);


// Create side panel element
const sidePanel = document.createElement("div");
sidePanel.style.fontFamily = "'Times New Roman', Times, serif";
sidePanel.style.position = "fixed";
sidePanel.style.right = "0";
sidePanel.style.top = "0";
sidePanel.style.width = "300px";
sidePanel.style.height = "100%";
sidePanel.style.backgroundColor = "#f9f9f9";
sidePanel.style.borderLeft = "1px solid #ccc";
sidePanel.style.padding = "15px";
sidePanel.style.overflowY = "auto";
sidePanel.style.fontSize = "16px";
sidePanel.style.display = "none";
sidePanel.style.zIndex = "1000";
shadowRoot.appendChild(sidePanel);

// Create three-dot settings button inside the container
const settingsButton = document.createElement("button");
settingsButton.innerText = "⋮"; // Three-dot icon
settingsButton.style.position = "absolute";
settingsButton.style.top = "10px";
settingsButton.style.left = "10px"; 
settingsButton.style.width = "30px";
settingsButton.style.height = "30px";
settingsButton.style.border = "none";
settingsButton.style.backgroundColor = "#f1f1f1";
settingsButton.style.borderRadius = "5px";
settingsButton.style.cursor = "pointer";
settingsButton.style.fontSize = "14px";
settingsButton.title = "Settings";
settingsButton.onmouseover = () => settingsButton.style.backgroundColor = "#e0e0e0";
settingsButton.onmouseout = () => settingsButton.style.backgroundColor = "#f1f1f1";
sidePanel.appendChild(settingsButton);

// summary notebook button
const smrybutton = document.createElement("button");
smrybutton.innerText = "S"; // summary icon
smrybutton.style.position = "absolute";
smrybutton.style.top = "10px";
smrybutton.style.left = "50px"; // Position it next to the settings button
smrybutton.style.width = "30px";
smrybutton.style.height = "30px";
smrybutton.style.border = "none";
smrybutton.style.backgroundColor = "#f1f1f1";
smrybutton.style.borderRadius = "5px";
smrybutton.style.cursor = "pointer";
smrybutton.style.fontSize = "14px";
smrybutton.title = "Add";
smrybutton.onmouseover = () => smrybutton.style.backgroundColor = "#e0e0e0";
smrybutton.onmouseout = () => smrybutton.style.backgroundColor = "#f1f1f1";
sidePanel.appendChild(smrybutton);

// Create pencil button next to the notebook button
const converButton = document.createElement("button");
converButton.innerText = "🤖"; // Pencil icon
converButton.style.position = "absolute";
converButton.style.top = "10px";
converButton.style.left = "90px"; // Position it next to the notebook button
converButton.style.width = "30px";
converButton.style.height = "30px";
converButton.style.border = "none";
converButton.style.backgroundColor = "#f1f1f1";
converButton.style.borderRadius = "5px";
converButton.style.cursor = "pointer";
converButton.style.fontSize = "14px";
converButton.title = "Conver";
converButton.onmouseover = () => converButton.style.backgroundColor = "#e0e0e0";
converButton.onmouseout = () => converButton.style.backgroundColor = "#f1f1f1";

sidePanel.appendChild(converButton);

// Create notebook button next to the plus button
const notebookButton = document.createElement("button");
notebookButton.innerText = "📓"; // Notebook icon
notebookButton.style.position = "absolute";
notebookButton.style.top = "10px";
notebookButton.style.left = "130px"; // Position it next to the plus button
notebookButton.style.width = "30px";
notebookButton.style.height = "30px";
notebookButton.style.border = "none";
notebookButton.style.backgroundColor = "#f1f1f1";
notebookButton.style.borderRadius = "5px";
notebookButton.style.cursor = "pointer";
notebookButton.style.fontSize = "14px";
notebookButton.title = "Notebook";
notebookButton.onmouseover = () => notebookButton.style.backgroundColor = "#e0e0e0";
notebookButton.onmouseout = () => notebookButton.style.backgroundColor = "#f1f1f1";

sidePanel.appendChild(notebookButton);

// Create close button for the side panel
const closeButton = document.createElement("button");
closeButton.innerText = "✖";
closeButton.style.position = "absolute";
closeButton.style.top = "10px";
closeButton.style.right = "10px";
closeButton.style.width = "30px"; 
closeButton.style.height = "30px";
closeButton.style.padding = "8px";
closeButton.style.border = "none";
closeButton.style.backgroundColor = "#f1f1f1";
closeButton.style.borderRadius = "5px";
closeButton.style.cursor = "pointer";
closeButton.style.fontSize = "14px";
closeButton.onmouseover = () => closeButton.style.backgroundColor = "#e0e0e0";
closeButton.onmouseout = () => closeButton.style.backgroundColor = "#f1f1f1";
sidePanel.appendChild(closeButton);



// Close button hides the side panel when clicked and resets the margin
closeButton.onclick = () => {
  tooltip.style.display = "none";
  plusPopup.style.display = "none";
  settingsMenu.style.display = "none";
  sidePanel.style.display = "none";
  floatingIcon.style.display = "flex"; // Show the floating icon
  document.body.style.marginRight = ""; // Reset the margin
};

// Create tooltip element with only the Summarize button
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.display = "none"; // Initially hidden
tooltip.style.zIndex = "1000";

// Create the summarize button
const summarizeButton = document.createElement("button");
summarizeButton.innerHTML = "+"; // Plus sign
summarizeButton.style.cssText = `
  width: 30px; 
  height: 30px; 
  background-color: white; 
  border: 2px solid #ccc; 
  border-radius: 50%; 
  color: #ccc; 
  font-size: 18px; 
  font-weight: bold; 
  cursor: pointer;
  display: flex; 
  align-items: center; 
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease;
`;

// Add hover effect to the button
summarizeButton.addEventListener("mouseover", () => {
  summarizeButton.style.backgroundColor = "#f5f5f5";
  summarizeButton.style.transform = "scale(1.1)";
});
summarizeButton.addEventListener("mouseout", () => {
  summarizeButton.style.backgroundColor = "white";
  summarizeButton.style.transform = "scale(1)";
});

// Add click event for the summarize button
summarizeButton.onclick = async () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    displaySummarybook(true);
    addSelectedTextToSummaryPage(selectedText);
  }
  tooltip.style.display = "none"; // Hide the tooltip after click
};

// Add the button to the tooltip
tooltip.appendChild(summarizeButton);
document.body.appendChild(tooltip);

/* ---------------------------------------- Setting Menu ---------------------------------------- */

// Create container for settings button and settings menu
const settingsContainer = document.createElement("div");
settingsContainer.style.position = "absolute"; // Container for relative positioning
settingsContainer.style.top = "10px";
settingsContainer.style.left = "10px";
shadowRoot.appendChild(settingsContainer);

// Create the settings menu to appear directly below the settings button
const settingsMenu = document.createElement("div");
settingsMenu.style.fontFamily = "SimHei, Arial, sans-serif";
settingsMenu.style.position = "absolute";
settingsMenu.style.top = "40px"; // Position it directly below the settings button
settingsMenu.style.left = "0px";
settingsMenu.style.width = "200px";
settingsMenu.style.backgroundColor = "#ffffff";
settingsMenu.style.border = "1px solid #ccc";
settingsMenu.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
settingsMenu.style.borderRadius = "5px";
settingsMenu.style.padding = "5px";
settingsMenu.style.display = "none"; // Hidden by default
settingsMenu.style.fontSize = "14px";

// Add Zoom Control to the settings menu
const zoomControl = document.createElement("div");
zoomControl.style.display = "flex";
zoomControl.style.alignItems = "center";
zoomControl.style.padding = "8px";

// Zoom icon
const zoomIcon = document.createElement("span");
zoomIcon.innerText = "🔍"; // Magnifier icon
zoomIcon.style.marginRight = "10px";
zoomControl.appendChild(zoomIcon);

// Size down button (minus button)
const sizeDownButton = document.createElement("button");
sizeDownButton.innerText = "−";
sizeDownButton.style.width = "30px";
sizeDownButton.style.height = "30px";
sizeDownButton.style.border = "1px solid #ccc";
sizeDownButton.style.backgroundColor = "#f9f9f9";
sizeDownButton.style.cursor = "pointer";
sizeDownButton.style.borderRadius = "5px";
sizeDownButton.style.marginRight = "5px";
zoomControl.appendChild(sizeDownButton);

// Zoom level display
const zoomLevelDisplay = document.createElement("span");
let zoomLevel = 100; // Initial zoom level percentage for display only
let fontSize = 16; // Initial font size in pixels
zoomLevelDisplay.innerText = `${zoomLevel}%`;
zoomLevelDisplay.style.width = "40px";
zoomLevelDisplay.style.textAlign = "center";
zoomControl.appendChild(zoomLevelDisplay);

// Size up button (plus button)
const sizeUpButton = document.createElement("button");
sizeUpButton.innerText = "+";
sizeUpButton.style.width = "30px";
sizeUpButton.style.height = "30px";
sizeUpButton.style.border = "1px solid #ccc";
sizeUpButton.style.backgroundColor = "#f9f9f9";
sizeUpButton.style.cursor = "pointer";
sizeUpButton.style.borderRadius = "5px";
sizeUpButton.style.marginLeft = "5px";
zoomControl.appendChild(sizeUpButton);

// Event listeners for zoom control
sizeDownButton.onclick = () => {
  if (fontSize > 10) { // Set a minimum font size limit
    fontSize -= 2;
    zoomLevel -= 10;
    zoomLevelDisplay.innerText = `${zoomLevel}%`;
    sidePanel.style.fontSize = `${fontSize}px`;
  }
};

sizeUpButton.onclick = () => {
  if (fontSize < 30) { // Set a maximum font size limit
    fontSize += 2;
    zoomLevel += 10;
    zoomLevelDisplay.innerText = `${zoomLevel}%`;
    sidePanel.style.fontSize = `${fontSize}px`;
  }
};

settingsMenu.style.zIndex = "1001";
// Append the zoom control to the settings menu
settingsMenu.appendChild(zoomControl);

// Append the settings menu to the container
settingsContainer.appendChild(settingsMenu);

// Toggle the settings menu visibility when settings button is clicked
settingsButton.onclick = () => {
  tooltip.style.display = "none";
  settingsMenu.style.display = settingsMenu.style.display === "none" ? "block" : "none";
};


/* ---------------------------------------- Listen for Text ---------------------------------------- */

// Listen for text selection
document.addEventListener("mouseup", (event) => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    console.log("Text selected on website:", selectedText);

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect(); // Get the bounding rectangle of the selected text

    // Adjust for scrolling
    const topPosition = window.scrollY + rect.bottom; // Position below the selection
    const leftPosition = window.scrollX + rect.left; // Align with the left of the selection

    // Update tooltip position and display it
    tooltip.style.top = `${topPosition}px`;
    tooltip.style.left = `${leftPosition}px`;
    tooltip.style.display = "block";
  } else {
    // Hide the tooltip if no text is selected
    tooltip.style.display = "none";
  }
});

shadowRoot.addEventListener("mouseup", (event) => {
  event.stopPropagation();
});


/* ---------------------------------------- Fetch Definitions ---------------------------------------- */

// Function to fetch Wikipedia summary
async function fetchWikipediaDefinition(searchTerm) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.extract || "No summary available.";
    }
    return "Definition not available.";
  } catch (error) {
    console.error("Error:", error);
    return "Definition not available.";
  }
}

// Function to fetch Free Dictionary API definition
async function fetchFreeDictionaryDefinition(searchTerm) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchTerm)}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const meanings = data[0]?.meanings || [];
      return meanings.map(meaning => {
        const definition = meaning.definitions[0]?.definition || "No definition available.";
        return `• ${meaning.partOfSpeech}: ${definition}`;
      }).join('<br>');
    }
    return "Definition not available.";
  } catch (error) {
    console.error("Error:", error);
    return "Definition not available.";
  }
}

/* ---------------------------------------- Initialize Summarizer ---------------------------------------- */

let teaser_summarizer;
let keypoint_summarizer;

// Initialize summarizers for teaser and key points
async function initializeSummarizers() {
  const canSummarize = await window.ai.summarizer.capabilities();
  if (canSummarize.available === 'no') {
    console.error('AI Summarization is not supported');
    return;
  }

  // Create the teaser summarizer
  teaser_summarizer = await window.ai.summarizer.create({
    type: 'teaser',
    format: 'plain-text',
    length: 'short'
  });

  // Create the key points summarizer
  keypoint_summarizer = await window.ai.summarizer.create({
    type: 'key-points',
    format: 'plain-text',
    length: 'medium'
  });
}

initializeSummarizers(); // Start summarizers initialization


/* ---------------------------------------- Summarize ---------------------------------------- */


// Function to generate a teaser summary
async function generateTeaserSummary(text) {
  try {
    if (!teaser_summarizer) {
      console.log("Teaser summarizer is not available.");
      return "Teaser summarizer is not available.";
    }
    const result = await teaser_summarizer.summarize(text);
    console.log("Teaser Summary:", result);
    return result || "No teaser summary available.";
  } catch (error) {
    console.error("Error in teaser summarization:", error);
    return "Unable to generate teaser summary.";
  }
}

// Function to generate key points summary
async function generateKeyPointsSummary(text) {
  try {
    if (!keypoint_summarizer) {
      console.log("Key points summarizer is not available.");
      return "Key points summarizer is not available.";
    }
    const result = await keypoint_summarizer.summarize(text);
    console.log("Key Points Summary:", result);
    return result || "No key points available.";
  } catch (error) {
    console.error("Error in key points summarization:", error);
    return "Unable to generate key points.";
  }
}

// Global variable to store summaries
let savedSummaries = JSON.parse(localStorage.getItem("savedSummaries")) || [];

// Save content to localStorage
function saveSummariesToLocalStorage() {
  localStorage.setItem("savedSummaries", JSON.stringify(savedSummaries));
}

// Function to summarize all content in the summary page
async function summarizeAllContent(selectedEntries) {
  const summaryPageContent = shadowRoot.getElementById("summaryPageContent");
  if (!summaryPageContent) {
    console.error("Summary page content container not found.");
    return;
  }

  // Get all selected_text blocks
  const textsToSummarize = Array.from(selectedEntries)
    .map((index) => savedSummaries[index]?.selected_text || "")
    .filter(Boolean) // Remove any empty or undefined text
    .join("\n\n");


  if (textsToSummarize) {
    try {
      const teaserSummary = await generateTeaserSummary(textsToSummarize);
      const keyPointsSummary = await generateKeyPointsSummary(textsToSummarize);
  
      // Add the generated summary to savedSummaries
      const newSummary = {
        summary_content: {
          teaserSummary,
          keyPointsSummary,
        },
        timestamp: Date.now(),
      };
      savedSummaries.push(newSummary);
      saveSummariesToLocalStorage();
  
      displaySummarybook(true);
  
    } catch (error) {
      console.error("Error summarizing content:", error);
    }
  }

}

// Enhance notebook button functionality to display saved entries
smrybutton.onclick = () => {
  tooltip.style.display = "none";
  sidePanel.style.display = "block";
  document.body.style.marginRight = "300px";
  displaySummarybook();
};

// Function to add selected text to the summary page
function addSelectedTextToSummaryPage(selectedText) {
  const summaryPageContent = shadowRoot.getElementById("summaryPageContent");
  if (!summaryPageContent) {
    console.error("Summary page content container not found.");
    return;
  }
  const newEntry = {
    selected_text: selectedText,
    timestamp: Date.now(),
  };
  savedSummaries.push(newEntry);
  saveSummariesToLocalStorage();
  displaySummarybook(true);
}

function deleteSummaryEntry(index) {
  // Remove the entry from savedSummaries
  savedSummaries.splice(index, 1);

  // Save the updated summaries back to localStorage
  localStorage.setItem("savedSummaries", JSON.stringify(savedSummaries));
}

// Function to display the summary page
function displaySummarybook(scroll_down = false) {
  floatingIcon.style.display = "none";
  tooltip.style.display = "none";
  sidePanel.innerHTML = "";
  sidePanel.style.display = "block";
  document.body.style.marginRight = "300px";

  // Add the summary page structure
  sidePanel.innerHTML = `
  <div style="margin-top: 40px; margin-bottom: 0px;">
    <h2 style="margin-top: 30px; margin-bottom: 0px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
      <div style="
        position: relative; 
        display: flex; 
        align-items: center; 
        justify-content: center;"
      >
        <button 
          id="summarizeSelectedButton" 
          style="
            background-color: #A999D2; 
            color: white; 
            border: none; 
            width: 120px; /* Fixed width */
            height: 40px; /* Fixed height */
            border-radius: 50px; 
            padding: 8px 20px; 
            font-size: 14px; 
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            "
            onmouseover="this.style.backgroundColor='#8A7EB3'; this.style.transform='scale(1.05)';"
            onmouseout="this.style.backgroundColor='#A999D2'; this.style.transform='scale(1)';"
        >
          Summarize
        </button>
      </div>
    </h2>

    <!-- Select All Checkbox -->
    <div style="
      display: flex; 
      align-items: center; 
      justify-content: flex-start;
      padding-left: 20px;
      margin-top: 4px;
      margin-bottom: 4px;"
    >
      <input 
        type="checkbox" 
        id="selectAllCheckbox" 
        style="cursor: pointer; width: 14px; height: 14px;"
      />
    </div>
  </div>

    
    <div id="summaryPageContent" style="
      padding: 10px; 
      background-color: #f9f9f9; 
      border-radius: 5px; 
      overflow-y: auto; 
      max-height: calc(100vh - 100px);"
    >
    </div>
  `;

  // Re-add navigation and utility buttons
  sidePanel.appendChild(settingsButton);
  sidePanel.appendChild(smrybutton);
  sidePanel.appendChild(notebookButton);
  sidePanel.appendChild(converButton);
  sidePanel.appendChild(closeButton);

  // Attach click event to the Summarize All button
  const summarizeSelectedButton = shadowRoot.getElementById("summarizeSelectedButton");
  const selectedEntries = new Set();

  summarizeSelectedButton.addEventListener("click", async () => {
    // Store the original text for later restoration
    const originalText = summarizeSelectedButton.textContent;
  
    // Start the looping dot animation
    let dotCount = 0;
    const animationInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3
      summarizeSelectedButton.textContent = " . ".repeat(dotCount);
    }, 600);
  
    try {
      // Call the summarizeAllContent function and wait for it to complete
      await summarizeAllContent(selectedEntries);
    } catch (error) {
      console.error("Error during summarization:", error);
    } finally {
      // Stop the animation
      clearInterval(animationInterval);
  
      // Restore the original button text
      summarizeSelectedButton.textContent = originalText;
    }
  });


  const selectAllCheckbox = shadowRoot.getElementById("selectAllCheckbox");

  // Load and display the existing content from localStorage
  const summaryPageContent = shadowRoot.getElementById("summaryPageContent");

  // Sort entries by timestamp to ensure correct sequence
  savedSummaries.sort((a, b) => a.timestamp - b.timestamp);

  // Display each entry
  savedSummaries.forEach((entry, index) => {
    if (entry.selected_text) {
      const entryContainer = document.createElement("div");
      entryContainer.style.cssText = `
        position: relative; 
        padding: 10px; 
        border: 1px solid #ccc; 
        border-radius: 5px; 
        margin-bottom: 10px; 
        background-color: #ffffff;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      // Add a checkbox to select the entry
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.cssText = "cursor: pointer; width: 14px; height: 14px;";

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedEntries.add(index);
        } else {
          selectedEntries.delete(index);
        }
        summarizeSelectedButton.disabled = selectedEntries.size === 0;
  
        // Update the "Select All" checkbox
        selectAllCheckbox.checked = selectedEntries.size === savedSummaries.length;
      });
      entryContainer.appendChild(checkbox);


      const editableParagraph = document.createElement("div");
      editableParagraph.contentEditable = "true";
      editableParagraph.textContent = entry.selected_text; // Use the correct key
      editableParagraph.style.cssText = `
        position: relative; 
        padding: 3px; 
        border: none; 
        margin-top: 15px; 
        margin-bottom: 15px; 
        background-color: #ffffff;
      `;

      // Add a delete button (top-right cross)
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "×";
      deleteButton.style.cssText = `
        position: absolute; 
        top: 5px; 
        right: 7px; 
        font-size: 20px; 
        font-weight: bold; 
        background-color: transparent; 
        color: #ccc; /* Match the border color */
        border: none; 
        border-radius: 50%; 
        width: 20px; 
        height: 20px; 
        cursor: pointer; 
        display: none; /* Hidden by default */
        transition: color 0.2s ease;
      `;

      // Show button on hover
      entryContainer.addEventListener("mouseenter", () => {
        deleteButton.style.display = "flex";
      });
      entryContainer.addEventListener("mouseleave", () => {
        deleteButton.style.display = "none";
      });

      deleteButton.addEventListener("mouseenter", () => {
        deleteButton.style.color = "#999"; // Slightly darker gray on hover
      });
      deleteButton.addEventListener("mouseleave", () => {
        deleteButton.style.color = "#ccc"; // Revert to original gray
      });

      deleteButton.addEventListener("click", () => {
        savedSummaries.splice(index, 1);
        saveSummariesToLocalStorage();
        displaySummarybook();
      });
  
      // Save changes to localStorage on input event
      editableParagraph.addEventListener("input", () => {
        savedSummaries[index].selected_text = editableParagraph.textContent.trim();
        saveSummariesToLocalStorage();
      });

      // Append the delete button to the editable paragraph
      entryContainer.appendChild(deleteButton);
      entryContainer.appendChild(editableParagraph);
      summaryPageContent.appendChild(entryContainer);
    }

    if (entry.summary_content) {
      const summaryBlock = document.createElement("div");
      summaryBlock.innerHTML = `
        <h3 style="margin-bottom: 10px; color: #007BFF;">Teaser Summary</h3>
        <p style="margin-bottom: 20px;">${entry.summary_content.teaserSummary}</p>
        <h3 style="margin-bottom: 10px; color: #007BFF;">Key Points Summary</h3>
        <p>${entry.summary_content.keyPointsSummary}</p>
      `;
      summaryBlock.style.cssText = `
        position: relative; 
        padding: 10px; 
        border: 1px solid #007BFF; 
        border-radius: 5px; 
        background-color: #e9f7ff; 
        margin-bottom: 20px; 
        color: #007BFF;
      `;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "×";
      deleteButton.style.cssText = `
        position: absolute; 
        top: 5px; 
        right: 7px; 
        font-size: 20px; 
        font-weight: bold; 
        background-color: transparent; 
        color: #ccc; /* Match the border color */
        border: none; 
        border-radius: 50%; 
        width: 20px; 
        height: 20px; 
        cursor: pointer; 
        display: none; /* Hidden by default */
        transition: color 0.2s ease;
      `;

      // Show button on hover
      summaryBlock.addEventListener("mouseenter", () => {
        deleteButton.style.display = "flex";
      });
      summaryBlock.addEventListener("mouseleave", () => {
        deleteButton.style.display = "none";
      });

      deleteButton.addEventListener("mouseenter", () => {
        deleteButton.style.color = "#999"; // Slightly darker gray on hover
      });
      deleteButton.addEventListener("mouseleave", () => {
        deleteButton.style.color = "#ccc"; // Revert to original gray
      });

      deleteButton.addEventListener("click", () => {
        savedSummaries.splice(index, 1);
        saveSummariesToLocalStorage();
        displaySummarybook();
      });

      summaryBlock.appendChild(deleteButton);
      summaryPageContent.appendChild(summaryBlock);
    }
    // Select All functionality
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = summaryPageContent.querySelectorAll("input[type='checkbox']");
      if (selectAllCheckbox.checked) {
        checkboxes.forEach((checkbox, index) => {
          checkbox.checked = true;
          selectedEntries.add(index);
        });
      } else {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
          selectedEntries.clear();
        });
      }
      summarizeSelectedButton.disabled = selectedEntries.size === 0;
    });
  });
  if (scroll_down){
    summaryPageContent.scrollTop = summaryPageContent.scrollHeight;
  }
}
/* ---------------------------------------- Display Content ---------------------------------------- */

// Navigation History to track visited states
const navigationHistory = [];

// Function to display content in the side panel with Wikipedia and Dictionary sections
function displaySearchInSidePanel(title, wikipediaContent, dictionaryContent = "No definition available.", addToHistory = true) {
  tooltip.style.display = "none";
  sidePanel.innerHTML = "";
  sidePanel.style.display = "block";
  document.body.style.marginRight = "300px";

  // Log current state in history
  if (addToHistory){
    navigationHistory.push({ type: "search", title, wikipediaContent, dictionaryContent });
  }

  // Display separate sections for Wikipedia and Dictionary content with top margin added to the title
  sidePanel.innerHTML = `
    <h2 style="margin-top: 30px;">${title}</h2> <!-- Adjusted margin-top here -->
    <h3>Wikipedia</h3>
    <p>${wikipediaContent}</p>
    <h3>Dictionary</h3>
    <p>${dictionaryContent}</p>
  `;
  sidePanel.appendChild(settingsButton);
  sidePanel.appendChild(smrybutton);
  sidePanel.appendChild(notebookButton);
  sidePanel.appendChild(converButton);
  sidePanel.appendChild(closeButton);
}

/* ---------------------------------------- Notebook Functions ---------------------------------------- */
// Load tags on initialization
chrome.storage.local.get({ tags: [] }, (result) => {
  const savedTags = result.tags || [];
  tags.push(...savedTags); // Add saved tags
  console.log("Loaded tags:", savedTags);
  updateTagDisplay(); // Display tags
});

// Enhance notebook button functionality to display saved entries
notebookButton.onclick = () => {
  tooltip.style.display = "none";
  sidePanel.style.display = "block";
  document.body.style.marginRight = "300px";
  displayNotebook();
};

// Function to load notebook entries
function loadNotebook(callback) {
  chrome.storage.local.get({ notebook: [] }, (result) => {
    callback(result.notebook || []);
  });
}

// Function to display notebook entries
function displayNotebook() {
  const lastState = navigationHistory[navigationHistory.length - 1];
  if (!lastState || lastState.type !== "notebook") {
    navigationHistory.push({ type: "notebook" }); // Push only if not already in notebook view
  }

  loadNotebook((notebook) => {
    renderNotebook(notebook); // Render the notebook entries
  });
}

let filterTag = null;

function renderAllTags(notebook) {
  // Get the container for displaying tags
  const notebookTagsContainer = shadowRoot.getElementById("notebookTags");

  // Clear existing tags in the container
  notebookTagsContainer.innerHTML = "";

  // Iterate over stored tags and display them
  tags.forEach((tag) => {
    // Get or assign a unique color for the tag
    const tagColor = getOrAssignTagColor(tag);

    // Create the tag element
    const tagElement = document.createElement("div");
    tagElement.textContent = tag;
    tagElement.style.cssText = `
      display: inline-block; 
      padding: 5px 10px; 
      border-radius: 20px; 
      background-color: ${tagColor};
      color: #333; 
      font-size: 12px; 
      font-weight: bold; 
      margin-right: 5px; 
      margin-bottom: 5px; 
      cursor: pointer; 
      border: 2px solid ${filterTag === tag ? "#A999D2" : "transparent"}; 
      box-sizing: border-box; 
      transition: border 0.2s ease;
    `;

    // Add click event to toggle border selection
    tagElement.addEventListener("click", () => {
      const isSelected = filterTag === tag;
      if (isSelected) {
        filterTag = null; // Clear the filter
      } else {
        filterTag = tag; // Set the selected tag
      }
      renderNotebook(notebook); // Refresh notebook
    });

    // Append the tag element to the container
    notebookTagsContainer.appendChild(tagElement);
  });
}

function renderNotebook(notebook, searchTerm = "", isEditing = false) {
  floatingIcon.style.display = "none";
  // Filter entries based on the search term
  const filteredNotebook = notebook.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag ? entry.tags?.includes(filterTag) : true;
    return matchesSearch && matchesTag;
  });

  // Generate notebook content
  const notebookContent = filteredNotebook
  .map(
    (entry, index) => `
      <div 
      id="entry-${index}" 
      style="
        margin-bottom: 10px; 
        padding: 10px; 
        border: 1px solid #ccc; 
        border-radius: 5px; 
        cursor: pointer; 
        position: relative; /* Ensure delete button positions correctly */
      " 
    >
        <button 
        id="deleteEntryButton-${index}" 
        style="
          position: absolute; 
          top: 10px; 
          right: 10px; 
          background-color: #ff4d4d; 
          color: white; 
          border: none; 
          border-radius: 50%; 
          padding: 5px; 
          width: 20px; 
          height: 20px; 
          font-size: 12px; 
          line-height: 12px; 
          text-align: center; 
          cursor: pointer; 
          display: none; /* Hidden by default */
        "
        >
          ×
        </button>
        <h3 style="margin: 0;">${entry.title}</h3>
        <p style="margin: 5px 0; color: #555; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${entry.content}
        </p>
        <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;">
          ${entry.tags
            ?.map(
              (tag) => `
                <div 
                  style="
                    display: inline-block; 
                    padding: 5px 10px; 
                    border-radius: 20px; 
                    background-color: ${getOrAssignTagColor(tag)};
                    color: #333; 
                    font-size: 12px; 
                    font-weight: bold; 
                    border: 2px solid transparent; 
                    box-sizing: border-box; 
                    transition: border 0.2s ease;
                  "
                >
                  ${tag}
                </div>
              `
            )
            .join("") || ""}
        </div>
      </div>
    `
    )
    .join("");

  sidePanel.innerHTML = `
  <h2 style="margin-top: 30px;">Notebook
      <button 
        id="plusButton" 
        style="
          position: absolute; 
          right: 76px; /* Position 10px before the edit button (50px width + 10px gap) */
          width: 30px; 
          height: 30px; 
          font-size: 14px; 
          border: none; 
          border-radius: 5px; 
          background-color: #f1f1f1; 
          color: black; 
          cursor: pointer;"
          onmouseover="this.style.backgroundColor='#e0e0e0';" 
          onmouseout="this.style.backgroundColor='#f1f1f1';"
      >
        +
      </button>
    <button 
        id="editNotebookButton" 
        style="
          position: absolute;
          right: 16px;
          width: 50px;
          background-color: #A999D2; 
          height: 30px; 
          color: white; 
          border: none; 
          border-radius: 5px; 
          padding: 8px 12px; 
          cursor: pointer;"
          onmouseover="this.style.backgroundColor='#8A7EB3';" 
          onmouseout="this.style.backgroundColor='#A999D2';"
      >
        Edit
      </button>
  </h2>
  <div style="margin-bottom: 20px;">
    <div id="notebookTags" style="display: flex; flex-wrap: wrap; gap: 5px;">
        <!-- Tags will be inserted here -->
    </div>
  </div>
  <div style="display: flex; align-items: center; margin-bottom: 20px;">
    <input 
      id="notebookSearchInput"
      type="text" 
      placeholder="Search by title or content..." 
      style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;"
    />
    <button 
      id="searchButton" 
      style="margin-left: 10px; padding: 8px 12px; border: none; border-radius: 5px; background-color: #A999D2; color: white; cursor: pointer;"
      onmouseover="this.style.backgroundColor='#8A7EB3';" 
      onmouseout="this.style.backgroundColor='#A999D2';"
    >
      🔍
    </button>
    <button 
      id="allButton" 
      style="margin-left: 10px; padding: 8px 12px; border: none; border-radius: 5px; background-color: #d3d3d3; color: black; cursor: pointer;"
      onmouseover="this.style.backgroundColor='#a9a9a9';" 
      onmouseout="this.style.backgroundColor='#d3d3d3';"
    >
      All
    </button>
  </div>
  <div id="notebookEntries">
    ${notebookContent || "<p>No entries yet. Add something using the + button!</p>"}
  </div>
  `;
  renderAllTags(notebook);

  sidePanel.appendChild(settingsButton);
  sidePanel.appendChild(smrybutton);
  sidePanel.appendChild(notebookButton);
  sidePanel.appendChild(converButton);
  sidePanel.appendChild(closeButton);

  // Attach edit button logic for showing delete buttons
  const editButton = shadowRoot.getElementById("editNotebookButton");

  editButton.addEventListener("click", () => {
    isEditing = !isEditing;
    editButton.textContent = isEditing ? "✔" : "Edit";
    // Toggle visibility of delete buttons
    filteredNotebook.forEach((_, index) => {
      const deleteButton = shadowRoot.getElementById(`deleteEntryButton-${index}`);
      if (deleteButton) {
        console.log("show delete buttons");
        deleteButton.style.display = isEditing ? "block" : "none";
      }
    });
    
  });

  filteredNotebook.forEach((_, index) => {
    const deleteButton = shadowRoot.getElementById(`deleteEntryButton-${index}`);
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        notebook.splice(index, 1); // Remove the entry from the notebook
        chrome.storage.local.set({ notebook }, () => {
          console.log(`Entry ${index} deleted.`);
          renderNotebook(notebook);
        });
      });
    }
  });

  // Attach search and reset button logic
  const plusButton = shadowRoot.getElementById("plusButton");
  const searchButton = shadowRoot.getElementById("searchButton");
  const searchInput = shadowRoot.getElementById("notebookSearchInput");
  const allButton = shadowRoot.getElementById("allButton");
  const notebookTags = shadowRoot.querySelectorAll("#notebookTags .tag");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      renderNotebook(notebook, searchTerm);
    });
  } else {
    console.error("Search button or input not found");
  }

  if (plusButton) {
    plusButton.addEventListener("click", () => {
      tooltip.style.display = "none";
      if (plusPopup.style.display === "none") {
        updateTagDisplay();
        plusPopup.style.display = "block";
      } else {
        plusPopup.style.display = "none";
      }
    });
  } else {
    console.error("plusButton not found");
  }

  if (allButton) {
    allButton.addEventListener("click", () => {
      renderNotebook(notebook, ""); // Reset to show all entries
    });
  } else {
    console.error("All button not found");
  }

  notebookTags.forEach((tagElement) => {
    tagElement.addEventListener("click", () => {
      const selectedTag = tagElement.dataset.tag;
      renderNotebook(notebook, "", selectedTag); // Filter by clicked tag
    });
  });

  // Dynamically bind the click event to each entry
  const notebookEntries = shadowRoot.querySelectorAll("#notebookEntries > div");
  notebookEntries.forEach((entryDiv, index) => {
    entryDiv.addEventListener("click", () => {
      const contentParagraph = entryDiv.querySelector("p");
  
      // Check if content is already expanded
      const isExpanded = contentParagraph.style.whiteSpace === "normal";
  
      if (isExpanded) {
        // Collapse the content
        contentParagraph.style.whiteSpace = "nowrap";
        contentParagraph.style.overflow = "hidden";
        contentParagraph.style.textOverflow = "ellipsis";
      } else {
        // Expand the content
        contentParagraph.style.whiteSpace = "normal";
        contentParagraph.style.overflow = "visible";
        contentParagraph.style.textOverflow = "unset"; // Remove text truncation
      }
    });
  });  
}

/* ---------------------------------------- Add Content Popup ---------------------------------------- */

// Create a container for the plus button's pop-up menu
const plusPopup = document.createElement("div");
plusPopup.style.fontFamily = "SimHei, Arial, sans-serif";
plusPopup.style.position = "absolute";
plusPopup.style.top = "40px";
plusPopup.style.right = "350px"; // Position it to the left of the side panel
plusPopup.style.width = "300px";
plusPopup.style.height = "auto";
plusPopup.style.backgroundColor = "#ffffff";
plusPopup.style.border = "1px solid #ccc";
plusPopup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
plusPopup.style.borderRadius = "5px";
plusPopup.style.padding = "10px";
plusPopup.style.display = "none"; // Hidden by default
plusPopup.style.zIndex = "1001"; // Ensure it appears above other elements
plusPopup.style.fontSize = "14px";
shadowRoot.appendChild(plusPopup);


/* ---------------------------------------- Content for Plus Popup ---------------------------------------- */
plusPopup.innerHTML = `
  <div style="font-family: SimHei, Arial, sans-serif;">
    <div style="margin-bottom: 10px;">
      <label for="plusPopupTitle" style="font-weight: bold; display: block; margin-bottom: 5px;">Title</label>
      <textarea id="plusPopupTitle" placeholder="Enter title" 
        style="width: 95%; padding: 5px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
    </div>
    <div style="margin-bottom: 10px;">
      <label for="plusPopupContent" style="font-weight: bold; display: block; margin-bottom: 5px;">Content</label>
      <textarea id="plusPopupContent" placeholder="Enter content" 
        style="width: 95%; height: 240px; padding: 5px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
    </div>
    <div style="margin-bottom: 10px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
        <label for="tagInput" style="font-weight: bold;">Tags</label>
        <button id="editTagsButton" style="
          padding: 8px 12px; 
          font-size: 12px; 
          background-color: #f1f1f1; 
          border: 1px solid #ccc; 
          border-radius: 5px; 
          cursor: pointer;
          width: 50px;
        ">Edit</button>
      </div>
      <input id="tagInput" placeholder="Enter a tag and press Enter" 
        style="width: 95%; padding: 5px; border: 1px solid #ccc; border-radius: 5px;" />
      <div id="tagDisplay" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;"></div>
    </div>
    <button id="plusPopupSaveButton" style="
      width: 100%; 
      background-color: #A999D2; 
      color: white; 
      padding: 10px; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer;
      font-size: 14px;
    ">Save</button>
  </div>
`;


/* ---------------------------------------- Persistent Tag Colors ---------------------------------------- */

// Object to store tag-color pairs
let tagColors = {};

// Function to generate a unique color for a tag
function getOrAssignTagColor(tag) {
  if (!tagColors[tag]) {
    // Assign a new random color if not already assigned
    tagColors[tag] = `hsl(${Math.random() * 360}, 70%, 80%)`;

    // Save the updated tagColors to Chrome storage
    chrome.storage.local.set({ tagColors }, () => {
      console.log("Tag colors updated:", tagColors);
    });
  }
  return tagColors[tag];
}

// Load tagColors from Chrome storage on initialization
chrome.storage.local.get({ tagColors: {} }, (result) => {
  tagColors = result.tagColors || {};
  console.log("Loaded tag colors:", tagColors);
});


/* ---------------------------------------- Tag Functionality ---------------------------------------- */
const tagInput = shadowRoot.getElementById("tagInput");
const tagDisplay = shadowRoot.getElementById("tagDisplay");
const tags = [];
const selectedTags = new Set();

// Handle adding tags when pressing Enter
tagInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && tagInput.value.trim()) {
    event.preventDefault();

    // Get the tag value and clear the input
    const tagValue = tagInput.value.trim();
    tagInput.value = "";

    // Get or assign a unique color for the tag
    const tagColor = getOrAssignTagColor(tagValue);

    // Create a tag element
    const tagElement = document.createElement("div");
    tagElement.textContent = tagValue;
    tagElement.style.cssText = `
      padding: 5px 10px;
      border-radius: 20px;
      background-color: ${tagColor};
      color: #333;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-right: 5px;
      position: relative;
      cursor: pointer;
      transition: border 0.2s ease;
      box-sizing: border-box; /* Ensures border doesn't affect size */
      border: 2px solid transparent; /* Default transparent border */
    `;

    // Add click event to toggle border
    tagElement.addEventListener("click", () => {
      if (selectedTags.has(tagValue)) {
        // If tag is already selected, remove it
        selectedTags.delete(tagValue); // Remove from selectedTags
        tagElement.style.borderColor = "transparent"; // Remove the border
      } else {
        // If tag is not selected, add it
        selectedTags.add(tagValue); // Add to selectedTags
        tagElement.style.borderColor = "#A999D2"; // Add a blue border
      }
    });

    // Add tag to the display and the tags array
    tagDisplay.appendChild(tagElement);
    tags.push(tagValue);

    // Save updated tags to Chrome's storage
    chrome.storage.local.set({ tags }, () => {
      console.log("Tags saved:", tags);
    });
  }
});

// Add a title container for "Tags" and the "Edit Tags" button
const tagsTitleContainer = document.createElement("div");
tagsTitleContainer.style.cssText = `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

// Add the "Tags" title
const tagsTitle = document.createElement("span");
tagsTitle.textContent = "Tags";
tagsTitle.style.cssText = `
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
`;
tagsTitleContainer.appendChild(tagsTitle);

// Add "Edit Tags" button
const editTagsButton = shadowRoot.getElementById("editTagsButton");
let isEditingTags = false;

editTagsButton.addEventListener("click", () => {
  isEditingTags = !isEditingTags;
  editTagsButton.textContent = isEditingTags ? "Done" : "Edit";
  updateTagDisplay(); // Refresh tags to show/hide delete buttons
});


function updateTagDisplay() {
  tagDisplay.innerHTML = ""; // Clear current tags
  tags.forEach((tag, index) => {
    const tagColor = getOrAssignTagColor(tag);

    // Create tag element
    const tagElement = document.createElement("div");
    tagElement.textContent = tag;
    tagElement.style.cssText = `
      padding: 5px 10px;
      border-radius: 20px;
      background-color: ${tagColor};
      color: #333;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-right: 5px;
      position: relative;
      cursor: pointer;
      transition: border 0.2s ease;
      box-sizing: border-box; /* Ensures border doesn't affect size */
      border: 2px solid transparent; /* Default transparent border */
    `;

    // Add click event to toggle border
    tagElement.addEventListener("click", () => {
      if (selectedTags.has(tag)) {
        // If tag is already selected, remove it
        selectedTags.delete(tag); // Remove from selectedTags
        tagElement.style.borderColor = "transparent"; // Remove the border
      } else {
        // If tag is not selected, add it
        selectedTags.add(tag); // Add to selectedTags
        tagElement.style.borderColor = "#A999D2"; // Add a blue border
      }
    });

    // Add delete button if in edit mode
    if (isEditingTags) {
      const deleteButton = document.createElement("span");
      deleteButton.textContent = "×";
      deleteButton.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        width: 15px;
        height: 15px;
        background-color: #ff4d4d;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        line-height: 15px;
        text-align: center;
        cursor: pointer;
      `;
      deleteButton.addEventListener("click", () => {
        deleteTag(index); // Delete tag on click
      });
      tagElement.appendChild(deleteButton);
    }

    tagDisplay.appendChild(tagElement);
  });
}


// Function to delete a tag
function deleteTag(index) {
  const tagToDelete = tags[index]; // Get the tag name to delete
  tags.splice(index, 1); // Remove tag from the tags array

  // Save updated tags to storage
  chrome.storage.local.set({ tags }, () => {
    console.log("Tag deleted. Updated tags:", tags);
    updateTagDisplay(); // Refresh the tag display

    // Remove the tag from all notebook entries
    chrome.storage.local.get({ notebook: [] }, (result) => {
      const notebook = result.notebook.map(entry => {
        if (entry.tags.includes(tagToDelete)) {
          // Remove the tag from the entry's tags array
          entry.tags = entry.tags.filter(tag => tag !== tagToDelete);
        }
        return entry;
      });

      // Save the updated notebook back to storage
      chrome.storage.local.set({ notebook }, () => {
        console.log(`Tag "${tagToDelete}" removed from all entries.`);
        renderNotebook(notebook); // Refresh the notebook view
      });
    });
  });
}

// Save Functionality
const saveButton = shadowRoot.getElementById("plusPopupSaveButton");
saveButton.onclick = () => {
  const titleInput = shadowRoot.getElementById("plusPopupTitle").value.trim();
  const contentInput = shadowRoot.getElementById("plusPopupContent").value.trim();

  if (titleInput && contentInput) {
    const entry = { title: titleInput, content: contentInput, tags: Array.from(selectedTags) }; // Save tags with entry

    console.log("Saving entry:", entry);

    // Save the entry to Chrome's storage
    chrome.storage.local.get({ notebook: [] }, (result) => {
      const notebook = result.notebook;
      notebook.push(entry);

      chrome.storage.local.set({ notebook }, () => {
        console.log("Notebook updated!:", notebook);

        // Clear the inputs after saving
        shadowRoot.getElementById("plusPopupTitle").value = "";
        shadowRoot.getElementById("plusPopupContent").value = "";
        selectedTags.clear();
        plusPopup.style.display = "none"; // Close the popup after saving
        
        const lastState = navigationHistory[navigationHistory.length - 1];
        if (!lastState || lastState.type === "notebook") {
          renderNotebook(notebook); // Refresh the notebook view
        }
        
      });
    });
  } else {
    alert("Both Title and Content are required!");
  }
};

/* ---------------------------------------- Conversation Panel ---------------------------------------- */
// Add button functionality to display the Conver window
converButton.onclick = () => {
  tooltip.style.display = "none";
  showConversationPanel();
};

function showConversationPanel() {
  floatingIcon.style.display = "none";

  sidePanel.innerHTML = `
    <h2 style="
      margin-top: 40px; 
      margin-bottom: 6px; 
      text-align: center;
      font-size: 16px;"
    >
      Gemini Nano
    </h2>
    <div id="conversationContainer" style="
      overflow-y: auto; 
      height: calc(100vh - 160px); /* Adjust to leave space for the input box */
      padding: 4px; 
      background-color: #f9f9f9; 
      border-radius: 5px;
      margin-bottom: 10px;"
    >
    </div>
    <div id="inputContainer" style="
      position: absolute; 
      bottom: 40px; /* Stick to the bottom */
      left: 10px; 
      right: 10px; 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      background-color: #fff; 
      border: 1px solid #ccc; 
      border-radius: 5px; 
      padding: 10px;"
  >
      <input 
          id="conversationInput" 
          type="text" 
          placeholder="Type your message..." 
          style="flex: 1; padding: 10px; border: none; border-radius: 5px; outline: none;"
      />
      <button 
          id="sendMessageButton" 
          style="
            background-color: #333; 
            color: white; 
            border: none; 
            border-radius: 50%; /* Circular shape */
            width: 40px; 
            height: 40px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            cursor: pointer;"
      >
          ➤
      </button>
  </div>
  `;

  // Adjust parent container for proper layout
  sidePanel.style.display = "flex";
  sidePanel.style.flexDirection = "column";

  // Add navigation and utility buttons back
  sidePanel.appendChild(settingsButton);
  sidePanel.appendChild(smrybutton);
  sidePanel.appendChild(notebookButton);
  sidePanel.appendChild(converButton); // Keep the conversation button
  sidePanel.appendChild(closeButton);


  async function animateMessage(message, targetContainer) {
    // Clear the target container before animating (optional, based on use case)
    targetContainer.textContent = "";
  
    for (let i = 0; i < message.length; i++) {
      targetContainer.textContent += message[i];
      await new Promise((resolve) => setTimeout(resolve, 50)); // Delay between characters
    }
  }

  // Attach event handlers
  const sendMessageButton = shadowRoot.getElementById("sendMessageButton");
  const conversationInput = shadowRoot.getElementById("conversationInput");
  const conversationContainer = shadowRoot.getElementById("conversationContainer");

  let session = null;

  async function getSession(){
    if (!session) {
      // Create a persistent session if it doesn't exist
      session = await ai.languageModel.create({
        systemPrompt: "You are a highly intelligent and patient study assistant. Your goal is to provide clear, concise, and accurate explanations to help users understand and retain information.",
        temperature: 0.8,
        topK: 100,
        maxTokens: 200,
      });
    }
  }

  getSession();

  const initialBotMessage = "Hi there! How can I help you?";
  const botMessageContainer = document.createElement("div");
  botMessageContainer.style.cssText = `
    background-color: #f9f9f9; /* Same as the background color */
    padding: 2px; 
    border-radius: 5px; 
    align-self: flex-start; 
    max-width: 85%; 
    color: #333; /* Text color for better readability */
    word-wrap: break-word; 
    margin: 10px 20px 10px 10px;
  `;
  conversationContainer.appendChild(botMessageContainer);

  animateMessage(initialBotMessage, botMessageContainer);

  sendMessageButton.addEventListener("click", async () => {
    const message = conversationInput.value.trim();

    // Check if a response is already generating
    if (conversationInput.disabled) {
      // Restore to arrow icon
      sendMessageButton.style.cssText = `
        background-color: #333; 
        color: white; 
        border: none; 
        border-radius: 50%; 
        width: 40px; 
        height: 40px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
      `;
      sendMessageButton.innerHTML = "&#10148;"; 
      conversationInput.disabled = false;
      return; // Prevent multiple messages during response generation
    }

    if (message) {
      // Integrate Gemini API to generate the response
      // Disable the input and button during response generation
      conversationInput.disabled = true;
      sendMessageButton.style.cssText = `
        background-color: #333; 
        color: white; 
        border: none; 
        border-radius: 50%; /* Circular shape */
        width: 40px; 
        height: 40px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        font-size: 24px;
        padding-bottom: 7px;
      `;
      sendMessageButton.innerHTML = "&#9632;"; // Black square icon


      // Append the user's message to the conversation container
      const userMessage = document.createElement("div");
      userMessage.textContent = message;
      userMessage.style.cssText = `
        background-color: #f1f1f1; /* Light grey background for user messages */
        padding: 10px; 
        border-radius: 5px; 
        align-self: flex-end; 
        max-width: 70%; 
        word-wrap: break-word; 
        margin: 0 10px 10px 60px; 
      `;
      conversationContainer.appendChild(userMessage);
      conversationInput.value = ""; // Clear input field after sending the message
      conversationContainer.scrollTop = conversationContainer.scrollHeight; // Auto-scroll to the bottom
  
      // Show a loading message for the AI's response
      const loadingBotMessage = "Thinking . . . . . . . .";
      const loadingBotMessageContainer = document.createElement("div");
      loadingBotMessageContainer.style.cssText = `
        background-color: #f9f9f9; /* Same as the background color */
        padding: 2px; 
        border-radius: 5px; 
        align-self: flex-start; 
        max-width: 85%; 
        color: #333; /* Text color for better readability */
        word-wrap: break-word; 
        margin: 10px 20px 10px 10px;
      `;
      conversationContainer.appendChild(loadingBotMessageContainer);

      animateMessage(loadingBotMessage, loadingBotMessageContainer);


      conversationContainer.scrollTop = conversationContainer.scrollHeight;
  
      try {
  
        const stream = session.promptStreaming(message);

        // Remove the loading message
        loadingBotMessageContainer.remove();
        
        // Create a container for the animated response
        const botMessageContainer = document.createElement("div");
        botMessageContainer.style.cssText = `
          background-color: #f9f9f9; /* Same as the background color */
          padding: 2px; 
          border-radius: 5px; 
          align-self: flex-start; 
          max-width: 85%; 
          color: #333; /* Text color for better readability */
          word-wrap: break-word; 
          margin: 10px 20px 10px 10px;
        `;
        conversationContainer.appendChild(botMessageContainer);
        
        // Variable to store the last processed chunk
        let lastProcessedChunk = "";
        
        // Animate the bot's response in chunks
        for await (const chunk of stream) {
          if (!conversationInput.disabled) break;
          // Remove duplicate text by only appending new content
          const newContent = chunk.replace(lastProcessedChunk, ""); // Remove overlap
          lastProcessedChunk = chunk; // Update the last processed chunk
        
            // Process the content to format bold text
          const formattedContent = newContent.replace(
            /\*\*(.+?)\*\*/g, // Regex to match text inside double stars
            (_, match) => `\n\n${match}\n\n` // Replace with plain text on a new line
          );

          // animation letter by letter
          for (const char of newContent) {
            botMessageContainer.textContent += char; // Add one character at a time
            conversationContainer.scrollTop = conversationContainer.scrollHeight; // Auto-scroll to the bottom

            // Simulate delay for natural conversation flow
            await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for each character
          }
        }
        
      } catch (error) {
        console.error("Error with Gemini API:", error);
  
        // Replace the loading message with an error message
        loadingBotMessage = "Sorry, something went wrong. Please try again.";
        animateMessage(loadingBotMessage, loadingBotMessageContainer);
      } finally {
        conversationInput.disabled = false;
        sendMessageButton.style.cssText = `
          background-color: #333; 
          color: white; 
          border: none; 
          border-radius: 50%; /* Circular shape */
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer;
        `;
        sendMessageButton.innerHTML = "&#10148;"; // Arrow icon
        
        conversationContainer.scrollTop = conversationContainer.scrollHeight; // Ensure auto-scroll to the bottom
      }
    }
  });

  conversationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessageButton.click();
    }
  });
}