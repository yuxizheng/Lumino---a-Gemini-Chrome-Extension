document.getElementById("searchButton").addEventListener("click", async () => {
    const searchTerm = document.getElementById("searchInput").value;
    const result = await fetchWikipediaSummary(searchTerm);
    document.getElementById("result").innerText = result;
  });
  
  async function fetchWikipediaSummary(searchTerm) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.extract; // Returns the summary of the article
      } else {
        throw new Error('Failed to fetch definition');
      }
    } catch (error) {
      console.error("Error:", error);
      return "Definition not available.";
    }
  }
  
    