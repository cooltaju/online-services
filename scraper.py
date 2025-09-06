import requests
from bs4 import BeautifulSoup
import json
import os
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def scrape_psc():
    """Scrapes the CG PSC website for new recruitment advertisements based on the analyzed HTML structure."""
    url = "https://psc.cg.gov.in/"
    base_url = "https://psc.cg.gov.in/"
    vacancies = []
    logging.info(f"Starting scrape for {url}")
    try:
        response = requests.get(url, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # --- Strategy 1: Find the main notification block based on class 'style209' ---
        main_notifications = soup.find('span', class_='style209')
        if main_notifications:
            logging.info("Found main notification block (style209).")
            for link in main_notifications.find_all('a'):
                if link and link.has_attr('href'):
                    title = link.get_text(strip=True)
                    href = link['href'].replace('../', '')  # Clean up relative path

                    if not href.startswith('http'):
                        href = base_url + href

                    vacancies.append({
                        "title": title,
                        "documents": "कृपया विस्तृत जानकारी के लिए अधिसूचना (notification) देखें।",
                        "link": href
                    })
                    logging.info(f"Found vacancy: {title}")
        else:
            logging.warning("Could not find main notification block (style209).")

        # --- Strategy 2: Find the '..NEW..' section items based on class 'style408' ---
        new_section_tds = soup.find_all('td', class_='style408')
        if new_section_tds:
            logging.info("Found '..NEW..' section items (style408).")
            for td in new_section_tds:
                link = td.find('a')
                if link and link.has_attr('href'):
                    title = link.get_text(strip=True)
                    href = link['href'].replace('../', '')  # Clean up relative path

                    if not href.startswith('http'):
                        href = base_url + href

                    # Avoid adding duplicates found by the first strategy
                    if not any(v['link'] == href for v in vacancies):
                        vacancies.append({
                            "title": title,
                            "documents": "कृपया विस्तृत जानकारी के लिए अधिसूचना (notification) देखें।",
                            "link": href
                        })
                        logging.info(f"Found vacancy: {title}")
        else:
            logging.warning("Could not find '..NEW..' section items (style408).")

    except requests.exceptions.RequestException as e:
        logging.error(f"Error scraping {url}: {e}")

    return vacancies

def main():
    """Main function to run all scrapers and save the results."""
    logging.info("Starting the main scraper function.")
    all_vacancies = []
    
    psc_vacancies = scrape_psc()
    all_vacancies.extend(psc_vacancies)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, 'vacancies.json')

    logging.info(f"Attempting to write {len(all_vacancies)} vacancies to {file_path}")
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(all_vacancies, f, ensure_ascii=False, indent=4)
        logging.info(f"Successfully wrote vacancies to {file_path}")
    except IOError as e:
        logging.error(f"Error writing to file {file_path}: {e}")

if __name__ == "__main__":
    main()