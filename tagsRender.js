async function loadTags() {
  try {
    // Fetch the tags.json file
    const response = await fetch("./tags.json", { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Failed to fetch tags.json: ${response.statusText}`);
    }

    // Parse the JSON data
    const tags = await response.json();

    // Get the container element
    const container = document.querySelector(".tags-container");

    // Generate and append tags dynamically
    tags.forEach((tag, index) => {
      const tagDiv = document.createElement("div");
      tagDiv.className = `tag ${tag.groups.join(" ")}`;
      tagDiv.title = [index + 1, tag.description].join(". ");
      tagDiv.dataset.title = tag.description;
      tagDiv.textContent = tag.tagName;

      // if tag has groupsOrder field then add data-groups-order attribute
      if (tag.groupsOrder) {
        tagDiv.setAttribute(
          "data-groups-order",
          JSON.stringify(tag.groupsOrder)
        );
      }

      // Add click handler
      tagDiv.addEventListener("click", () => {
        const documentationUrl = `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${tag.tagName}`;
        window.open(documentationUrl, "_blank", "noopener,noreferrer");
      });

      // Append the tag to the container
      container.appendChild(tagDiv);
    });
  } catch (error) {
    console.error("Error loading tags:", error);
  }
}

// Load the tags when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadTags);
