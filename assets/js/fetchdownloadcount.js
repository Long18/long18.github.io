function fetchDownloadCounts() {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(projectItem => {
        fetchDownloadCount(projectItem);
    });
}

async function fetchDownloadCount(projectItem) {
    const downloadCountElementAndroid = projectItem.querySelector('.project-download-count-android');
    const downloadCountElementIos = projectItem.querySelector('.project-download-count-ios');
    const apiUrlAndroid = projectItem.getAttribute('data-api-url-android');
    const apiUrlIos = projectItem.getAttribute('data-api-url-ios');

    if (!apiUrlAndroid && !apiUrlIos) {
        console.log('No API URLs provided');
        return;
    }

    try {
        const proxyUrl = "https://portfolio.thanhlong-worker.workers.dev/?url=";
        const fetchPromises = [];
        if (apiUrlAndroid) {
            fetchPromises.push(fetch(proxyUrl + apiUrlAndroid));
        }
        if (apiUrlIos) {
            fetchPromises.push(fetch(proxyUrl + apiUrlIos));
        }

        const responses = await Promise.all(fetchPromises);

        responses.forEach(async (response, index) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (index === 0 && apiUrlAndroid) {
                downloadCountElementAndroid.textContent = `${data.installs || 'N/A'} downloads`;
            } else if (index === 1 && apiUrlIos) {
                downloadCountElementIos.textContent = `${data.installs || 'N/A'} downloads`;
            }
        });

    } catch (error) {
        console.error("Error while fetching download count:", error);
        if (apiUrlAndroid) {
            downloadCountElementAndroid.textContent = "...";
        }
        if (apiUrlIos) {
            downloadCountElementIos.textContent = "...";
        }
    }
}

document.addEventListener("DOMContentLoaded", fetchDownloadCounts);