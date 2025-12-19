"""
Patient Researcher Agent - Backend API
"""
from openai import OpenAI
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
import os
from dotenv import load_dotenv
import requests
from serpapi import GoogleSearch

# FastAPI imports
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Patient Dementia News API",
    description="Patient-focused dementia news for carers and patients",
    version="1.0.0"
)

# CORS setup - allows Android/mobile apps to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cache for storing results
patient_news_cache = {
    "articles": None,
    "timestamp": None
}


# Response models for API documentation
class PatientArticle(BaseModel):
    title: str
    source: str
    url: str
    date: str
    description: str
    summary: str
    category: str  # lifestyle, support, caregiving, awareness, personal_story
    readability_score: int  # 1-10, how easy to understand
    actionable_tips: List[str]  # Practical tips from the article


class PatientNewsResponse(BaseModel):
    type: str = "patient"
    timestamp: str
    articles: List[Dict]
    total_articles: int
    categories: Dict[str, int]  # Count of articles per category


class PatientResearcherAgent:
    """Patient-focused news aggregation for dementia carers and patients"""

    def __init__(self):
        self.client = client
        self.serpapi_key = os.getenv("SERPAPI_KEY")

    def search_patient_news(self, query: str, num_results: int = 10) -> List[Dict]:
        """Search for patient-friendly news using SerpAPI"""

        if not self.serpapi_key:
            print("Warning: SERPAPI_KEY not found. Using mock data.")
            return self._get_mock_patient_results()

        try:
            params = {
                "q": query,
                "hl": "en",
                "api_key": self.serpapi_key,
                "num": num_results
            }

            search = GoogleSearch(params)
            results = search.get_dict()

            articles = []
            for item in results.get("organic_results", [])[:num_results]:
                articles.append({
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "date": item.get("date", datetime.now().strftime("%Y-%m-%d"))
                })

            print(f"SerpAPI returned {len(articles)} patient-focused results")
            return articles

        except Exception as e:
            print(f"SerpAPI error: {e}")
            return self._get_mock_patient_results()

    def _get_mock_patient_results(self) -> List[Dict]:
        """Mock patient-friendly search results for testing"""
        return [
            {
                "title": "10 Daily Activities to Keep Dementia Patients Engaged",
                "link": "https://www.alzheimers.org.uk/daily-activities",
                "snippet": "Simple, enjoyable activities that help dementia patients stay connected and engaged throughout the day.",
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "title": "Caregiver Self-Care: Why Taking Breaks is Essential",
                "link": "https://www.dementiauk.org/caregiver-selfcare",
                "snippet": "Practical advice for dementia carers on managing stress and avoiding burnout while providing care.",
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "title": "New Memory Café Opens in Dublin for Dementia Patients",
                "link": "https://www.alzheimer.ie/memory-cafe-dublin",
                "snippet": "A welcoming space where people with dementia and their carers can socialize and find support.",
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "title": "Music Therapy Shows Promise in Improving Dementia Symptoms",
                "link": "https://www.dementia.org/music-therapy",
                "snippet": "How familiar songs can help trigger memories and improve mood in people living with dementia.",
                "date": datetime.now().strftime("%Y-%m-%d")
            }
        ]

    def research_patient_news(self, days_back: int = 7) -> List[Dict]:
        """Research patient-friendly dementia news"""

        # Patient-focused search queries
        queries = [
            "dementia care tips families caregivers",
            "living with dementia daily life advice",
            "dementia support groups Ireland",
            "alzheimer's patient stories hope",
            "dementia activities engagement elderly",
            "caregiver stress dementia support"
        ]

        all_results = []
        for query in queries:
            print(f"Searching: {query}")
            results = self.search_patient_news(query, num_results=5)
            all_results.extend(results)

        # Remove duplicates
        seen_urls = set()
        unique_results = []
        for result in all_results:
            if result["link"] not in seen_urls:
                seen_urls.add(result["link"])
                unique_results.append(result)

        print(f"Total unique patient-focused results: {len(unique_results)}")

        if not unique_results:
            print("No search results found, returning empty list")
            return []

        # Use OpenAI to extract patient-friendly information
        prompt = f"""
        You are a patient advocate helping families affected by dementia.

        Extract patient-friendly information from these search results:

        {json.dumps(unique_results, indent=2)}

        For each article, extract:
        - title: Article title (simplified if too technical)
        - source: Source name
        - url: URL
        - date: Publication date (use {datetime.now().strftime("%Y-%m-%d")} if not available)
        - description: 2-3 sentences in plain, compassionate language
        - category: One of [lifestyle, support, caregiving, awareness, personal_story, community]

        Focus on articles that:
        - Offer practical advice for daily living
        - Provide emotional support
        - Share community resources
        - Tell hopeful personal stories
        - Give caregiving tips

        Return ONLY valid JSON array. No markdown, no explanation.
        """

        try:
            print("Calling OpenAI for patient news extraction...")
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a compassionate patient advocate. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4
            )

            content = response.choices[0].message.content.strip()

            # Extract JSON
            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()

            articles = json.loads(content)
            print(f"Extracted {len(articles)} patient articles")
            return articles
        except Exception as e:
            print(f"Error in patient research: {e}")
            import traceback
            traceback.print_exc()
            return []

    def validate_patient_articles(self, articles: List[Dict]) -> List[Dict]:
        """Validate articles for readability and relevance to patients"""

        if not articles:
            return []

        prompt = f"""
        You are evaluating dementia-related articles for patients and carers.

        Rate each article on:
        1. Readability (1-10): How easy is it for non-medical people to understand?
        2. Relevance (1-10): How useful is it for patients/carers?
        3. Compassion (1-10): Is the tone supportive and hopeful?
        Calculate readability_score as average of these three.
        Keep only articles with readability_score >= 7.

        Articles:
        {json.dumps(articles, indent=2)}

        Return ONLY valid JSON array with added "readability_score" field.
        Only include articles scoring 7+.
        """

        try:
            print("Validating patient articles...")
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a patient advocate evaluating content accessibility."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )

            content = response.choices[0].message.content.strip()

            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()

            validated = json.loads(content)
            print(f"Validated {len(validated)} patient articles")
            return validated
        except Exception as e:
            print(f"Validation error: {e}")
            return articles

    def create_patient_summaries(self, articles: List[Dict]) -> List[Dict]:
        """Create compassionate, easy-to-read summaries with actionable tips"""

        if not articles:
            return []

        prompt = f"""
        You are writing for families affected by dementia - patients and carers.

        For each article, create:
        1. summary: 100-150 words in simple, warm, encouraging language
           - Avoid medical jargon
           - Focus on hope and practical help
           - Use "you" to speak directly to readers

        2. actionable_tips: 2-4 specific things readers can do TODAY
           - Make them concrete and doable
           - Example: "Play their favorite music during meals" not "Use music therapy"

        Articles:
        {json.dumps(articles, indent=2)}

        Return ONLY valid JSON array with added "summary" and "actionable_tips" fields.
        """

        try:
            print("Creating patient summaries...")
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a compassionate writer helping families with dementia."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=4000
            )

            content = response.choices[0].message.content.strip()

            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()

            final_articles = json.loads(content)
            print(f"Created summaries for {len(final_articles)} articles")
            return final_articles
        except Exception as e:
            print(f"Summarization error: {e}")
            return articles

    def run_patient_pipeline(self, days_back: int = 7) -> Dict:
        """Execute the patient news pipeline"""
        print(f"\n{'=' * 60}")
        print(f"Patient Researcher Agent Starting")
        print(f"Looking back {days_back} days")
        print(f"{'=' * 60}\n")

        try:
            # Step 1: Research
            print("Step 1: Finding patient-friendly news...")
            articles = self.research_patient_news(days_back)
            print(f"Found {len(articles)} articles\n")

            # Step 2: Validate
            print("Step 2: Checking readability...")
            validated = self.validate_patient_articles(articles)
            print(f"Validated {len(validated)} articles\n")

            # Step 3: Create summaries
            print("Step 3: Creating helpful summaries...")
            final_articles = self.create_patient_summaries(validated)
            print(f"Finalized {len(final_articles)} articles\n")

            # Count categories
            categories = {}
            for article in final_articles:
                cat = article.get("category", "other")
                categories[cat] = categories.get(cat, 0) + 1

            print(f"{'=' * 60}")
            print(f"Pipeline Complete! Total: {len(final_articles)}")
            print(f"Categories: {categories}")
            print(f"{'=' * 60}\n")

            return {
                "type": "patient",
                "timestamp": datetime.now().isoformat(),
                "articles": final_articles,
                "total_articles": len(final_articles),
                "categories": categories
            }
        except Exception as e:
            print(f"Pipeline error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "type": "patient",
                "timestamp": datetime.now().isoformat(),
                "articles": [],
                "total_articles": 0,
                "categories": {},
                "error": str(e)
            }


# Initialize the patient researcher agent
patient_agent = PatientResearcherAgent()


# API Endpoints
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "message": "Patient Dementia News API",
        "version": "1.0.0",
        "audience": "Patients and Carers",
        "endpoints": {
            "patient_news": "/api/news/patient",
            "by_category": "/api/news/patient/category/{category}",
            "health": "/api/health"
        }
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check - useful for Android app to verify connection"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "cache_status": {
            "has_data": patient_news_cache["articles"] is not None,
            "last_updated": patient_news_cache["timestamp"],
            "article_count": len(patient_news_cache["articles"]["articles"])
            if patient_news_cache["articles"] else 0
        }
    }


@app.get("/api/news/patient", response_model=PatientNewsResponse, tags=["News"])
async def get_patient_news(
        days_back: int = Query(default=7, ge=1, le=30, description="Days to search"),
        refresh: bool = Query(default=False, description="Force refresh")
):
    """
    Get patient-friendly dementia news

    Returns articles focused on:
    - Daily living tips
    - Caregiver support
    - Community resources
    - Personal stories
    - Practical advice
    """

    # Check cache
    if not refresh and patient_news_cache["articles"] and patient_news_cache["timestamp"]:
        cache_time = datetime.fromisoformat(patient_news_cache["timestamp"])
        cache_age = datetime.now() - cache_time

        # Use cache if less than 2 hours old
        if cache_age < timedelta(hours=2):
            print(f"Returning cached patient news (age: {cache_age})")
            return patient_news_cache["articles"]

    # Get fresh news
    print("Fetching fresh patient news...")
    result = patient_agent.run_patient_pipeline(days_back)

    # Update cache
    patient_news_cache["articles"] = result
    patient_news_cache["timestamp"] = result["timestamp"]

    return result


@app.get("/api/news/patient/category/{category}", tags=["News"])
async def get_news_by_category(category: str):
    """
    Get patient news filtered by category

    Categories:
    - lifestyle: Daily living and activities
    - support: Emotional and community support
    - caregiving: Tips for carers
    - awareness: Understanding dementia
    - personal_story: Real experiences
    - community: Local events and groups
    """

    # Get latest news
    if not patient_news_cache["articles"]:
        result = patient_agent.run_patient_pipeline()
        patient_news_cache["articles"] = result
        patient_news_cache["timestamp"] = result["timestamp"]
    else:
        result = patient_news_cache["articles"]

    # Filter by category
    filtered = [
        article for article in result["articles"]
        if article.get("category", "").lower() == category.lower()
    ]

    return {
        "type": "patient",
        "category": category,
        "timestamp": result["timestamp"],
        "articles": filtered,
        "total_articles": len(filtered)
    }


@app.post("/api/news/refresh", tags=["News"])
async def refresh_patient_news(days_back: int = Query(default=7, ge=1, le=30)):
    """Force refresh of patient news - useful for pull-to-refresh in Android"""

    result = patient_agent.run_patient_pipeline(days_back)

    patient_news_cache["articles"] = result
    patient_news_cache["timestamp"] = result["timestamp"]

    return {
        "message": "Patient news refreshed",
        "timestamp": result["timestamp"],
        "articles_found": result["total_articles"],
        "categories": result.get("categories", {})
    }


if __name__ == "__main__":
    import uvicorn

    print("\n" + "=" * 60)
    print("Patient Dementia News API Starting...")
    print("For Patients & Carers")
    print("=" * 60)
    print(f"API: http://localhost:8000")
    print(f"Docs: http://localhost:8000/docs")
    print(f"Android should connect to: http://YOUR_IP:8000")
    print("=" * 60 + "\n")

    uvicorn.run(
        app,
        host="0.0.0.0",  # Allows Android devices on same network to connect
        port=8000,
        log_level="info"
    )