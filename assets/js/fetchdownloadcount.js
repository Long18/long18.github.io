/**
 * Download Count Fetcher
 * Fetches and displays app download counts from SensorTower API
 */

function fetchDownloadCounts() {
    const projectItems = document.querySelectorAll('.project-item[data-api-url-android], .project-item[data-api-url-ios]');
    
    if (projectItems.length === 0) {
        console.log("No project items with API URLs found");
        return;
    }
    
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
        console.log('No API URLs provided for project item');
        return;
    }

    // Set loading state
    if (downloadCountElementAndroid) {
        downloadCountElementAndroid.textContent = "Loading...";
        downloadCountElementAndroid.classList.add("loading");
    }
    if (downloadCountElementIos) {
        downloadCountElementIos.textContent = "Loading...";
        downloadCountElementIos.classList.add("loading");
    }

    try {
        const proxyUrl = "https://portfolio.thanhlong-worker.workers.dev/?url=";
        const fetchPromises = [];
        const urlTypes = [];
        
        if (apiUrlAndroid) {
            fetchPromises.push(
                fetch(proxyUrl + encodeURIComponent(apiUrlAndroid))
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
            );
            urlTypes.push('android');
        }
        
        if (apiUrlIos) {
            fetchPromises.push(
                fetch(proxyUrl + encodeURIComponent(apiUrlIos))
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
            );
            urlTypes.push('ios');
        }

        const results = await Promise.allSettled(fetchPromises);
        
        results.forEach((result, index) => {
            const platform = urlTypes[index];
            const element = platform === 'android' ? downloadCountElementAndroid : downloadCountElementIos;
            
            if (!element) return;
            
            element.classList.remove("loading");
            
            if (result.status === 'fulfilled') {
                const data = result.value;
                if (data && typeof data.installs !== 'undefined') {
                    const downloadCount = formatDownloadCount(data.installs || 0);
                    element.textContent = `${downloadCount} downloads`;
                    element.title = `Last updated: ${new Date().toLocaleString()}`;
                } else {
                    element.textContent = "N/A";
                    element.title = "No data available";
                }
            } else {
                console.error(`Error fetching ${platform} data:`, result.reason);
                element.textContent = "N/A";
                element.title = "Could not fetch download count";
            }
        });

    } catch (error) {
        console.error("Error while fetching download count:", error);
        
        if (downloadCountElementAndroid) {
            downloadCountElementAndroid.classList.remove("loading");
            downloadCountElementAndroid.textContent = "N/A";
        }
        if (downloadCountElementIos) {
            downloadCountElementIos.classList.remove("loading");
            downloadCountElementIos.textContent = "N/A";
        }
    }
}

// Format large numbers for better readability
function formatDownloadCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Run once DOM is loaded
document.addEventListener("DOMContentLoaded", fetchDownloadCounts);

// Retry failed requests every 5 minutes but only if page is still open
let retryInterval;
document.addEventListener("DOMContentLoaded", function() {
    retryInterval = setInterval(() => {
        const failedElements = document.querySelectorAll('.project-download-count-android, .project-download-count-ios');
        let hasFailedElements = false;
        
        failedElements.forEach(element => {
            if (element.textContent === "N/A") {
                hasFailedElements = true;
                const projectItem = element.closest('.project-item');
                if (projectItem) fetchDownloadCount(projectItem);
            }
        });
        
        // Stop retrying if no failed elements remain
        if (!hasFailedElements) {
            clearInterval(retryInterval);
        }
    }, 300000); // 5 minutes
});

// Clean up interval when page is unloaded
window.addEventListener('beforeunload', function() {
    if (retryInterval) {
        clearInterval(retryInterval);
    }
});