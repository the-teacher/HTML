// Array of groups to populate the select options
const tagGroups = [
  { value: "all", label: "All" },
  { value: "structural", label: "Structural" },
  { value: "most-used", label: "Most Used" },
  { value: "metadata", label: "Metadata" },
  { value: "block", label: "Block" },
  { value: "inline", label: "Inline" },
  { value: "headers", label: "Headers" },
  { value: "text-semantics", label: "Text Semantics" },
  { value: "lists", label: "Lists" },
  { value: "tables", label: "Tables" },
  { value: "forms", label: "Forms and Inputs" },
  { value: "media", label: "Media" },
  { value: "interactive", label: "Interactive" },
  { value: "embedded", label: "Embedded Content" },
  { value: "programming", label: "Programming/Script" },
  { value: "svg-mathml", label: "SVG and MathML" },
  { value: "deprecated", label: "Deprecated" },
];

// Function to populate the select element
function populateSelect() {
  const selectElement = document.getElementById("tag-group");

  tagGroups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.value;
    option.textContent = group.label;
    selectElement.appendChild(option);
  });
}
function onSelectChange() {
  const select = document.getElementById("tag-group");
  const tags = document.querySelectorAll(".tag");
  const groupList = document.getElementById("group-list");

  function sortElementsByGroup(tagsArray, group) {
    // Parse the group order and calculate priority weight
    return tagsArray
      .map((item) => {
        // Parse the group order safely
        let groupOrder;

        try {
          groupOrder = JSON.parse(item["data-groups-order"]) || {};
        } catch (error) {
          console.warn(`Invalid data-groups-order for item:`, item);
          groupOrder = {}; // Fallback to an empty object
        }

        // Add a weight for sorting; lower number = higher priority
        item.priority =
          groupOrder[group] !== undefined ? groupOrder[group] : Infinity;

        return item;
      })
      .sort((a, b) => {
        // Sort by priority weight first
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        // If priorities are the same, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
  }

  select.addEventListener("change", () => {
    const group = select.value;

    // Reset highlights
    tags.forEach((tag) => tag.classList.remove("highlight"));

    // Highlight and display details
    let filteredTags = [];
    tags.forEach((tag) => {
      if (tag.classList.contains(group)) {
        tag.classList.add("highlight");
        filteredTags.push({
          name: tag.textContent,
          description: tag.dataset.title,
          "data-groups-order": tag.getAttribute("data-groups-order"),
        });
      }
    });

    // Sort the tags by group order
    filteredTags = sortElementsByGroup(filteredTags, group);

    // Update the details block
    groupList.innerHTML = "";
    filteredTags.forEach((tag) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${tag.name}: ${tag.description}`;
      groupList.appendChild(listItem);
    });
  });
}

// Populate the select element after DOM is loaded
document.addEventListener("DOMContentLoaded", populateSelect);

// It needs time to render Tags List
// No need to overcomplicate this. Just wait a second before calling onSelectChange
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(onSelectChange, 1000);
});
