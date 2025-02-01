function fetchDownloadCounts() {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(projectItem => {
        fetchDownloadCount(projectItem);
    });
}

async function fetchDownloadCount(projectItem) {
    let downloadCountElement;

    try {
        const apiUrl = projectItem.getAttribute('data-api-url');
        downloadCountElement = projectItem.querySelector('.project-download-count');

        if (!apiUrl || !downloadCountElement) {
            console.log('Missing API URL or download count element');
            return;
        }

        console.log("apiUrl: ", apiUrl);

        const proxyUrl = "https://portfolio.thanhlong-worker.workers.dev/?url=";
        const response = await fetch(proxyUrl + apiUrl);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);


        const data = await response.json();
        console.log('API Response:', data);

        const installs = data.installs ? data.installs : 'N/A';
        downloadCountElement.textContent = `${installs} downloads`;

    } catch (error) {
        console.error("Error while fetching download count:", error);
        if (downloadCountElement) {
            downloadCountElement.textContent = "...";
        }
    }
}

document.addEventListener("DOMContentLoaded", fetchDownloadCounts);