import requests
from bs4 import BeautifulSoup
import json
import time

def get_google_scholar_metrics(user_id):
    """Fetches citation metrics from Google Scholar."""
    url = f"https://scholar.google.com/citations?user={user_id}&hl=en"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        citation_element = soup.find("td", class_="gsc_rsb_std")
        citations = citation_element.text if citation_element else "N/A"

        publication_elements = soup.find_all("td", class_="gsc_rsb_std")
        publications = publication_elements[1].text if len(publication_elements) > 1 else "N/A"

        # Corrected h-index extraction
        h_index_element = soup.find_all("td", class_="gsc_rsb_std")
        h_index = h_index_element[2].text if len(h_index_element) > 2 else "N/A"

        citations_per_year = get_citations_per_year(soup)

        return {"citations": citations, "publications": publications, "h_index": h_index, "citations_per_year": citations_per_year}

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Google Scholar: {e}")
        return {"citations": "Error", "publications": "Error", "h_index": "Error", "citations_per_year":{}}

def get_citations_per_year(soup):
    """Extracts citations per year from the Google Scholar profile."""
    citations_per_year = {}
    try:
        year_elements = soup.find_all("span", class_="gsc_g_t")
        citation_elements = soup.find_all("span", class_="gsc_g_al")

        if year_elements and citation_elements:
            for year_element, citation_element in zip(year_elements, citation_elements):
                year = year_element.text.strip()
                citations = citation_element.text.strip()
                citations_per_year[year] = int(citations)
    except Exception as e:
        print(f"Error extracting citations per year: {e}")

    return citations_per_year

def update_metrics_json(user_id, output_file="metrics.json"):
    """Updates a JSON file with Google Scholar metrics."""
    metrics = get_google_scholar_metrics(user_id)
    with open(output_file, "w") as f:
        json.dump(metrics, f, indent=4)
    print(f"Metrics updated in {output_file}")

if __name__ == "__main__":
    user_id = "Fs_mg34AAAAJ"  # Replace with your Google Scholar user ID
    retries = 3
    delay = 5
    for i in range(retries):
        try:
            update_metrics_json(user_id)
            break #if successful, break the loop
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                print(f"Too many requests. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise e
    else:
        print("Max retries exceeded")
