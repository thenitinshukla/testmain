import requests
from bs4 import BeautifulSoup
import json
import os
import time  # Added this import

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def get_google_scholar_metrics(user_id):
    """Fetches citation metrics from Google Scholar."""
    url = f"https://scholar.google.com/citations?user={user_id}&hl=en"
    try:
        time.sleep(5)
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract metrics from the table
        metrics = soup.find_all("td", class_="gsc_rsb_std")
        if len(metrics) >= 3:
            citations = metrics[0].text
            publications = metrics[1].text  # This might actually be something else; check the page
            h_index = metrics[2].text
        else:
            citations = publications = h_index = "N/A"

        return {"citations": citations, "publications": publications, "h_index": h_index}

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Google Scholar: {e}")
        return {"citations": "Error", "publications": "Error", "h_index": "Error"}

def update_metrics_json(user_id, output_file="metrics.json"):
    """Updates a JSON file with Google Scholar metrics."""
    metrics = get_google_scholar_metrics(user_id)
    if metrics["citations"] != "Error" and metrics["publications"] != "Error" and metrics["h_index"] != "Error":
        with open(output_file, "w") as f:
            json.dump(metrics, f, indent=4)
        print(f"Metrics updated in {output_file}")
    else:
        print("Failed to fetch metrics. Existing file not updated.")


if __name__ == "__main__":
    user_id = "Fs_mg34AAAAJ"  # Replace with your Google Scholar user ID
    update_metrics_json(user_id)
