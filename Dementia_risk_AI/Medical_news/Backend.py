"""
Medical News System using OpenAI and SerpAPI
Backend API for NMS-Web (Medical Professionals)
"""
from openai import OpenAI
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from serpapi import GoogleSearch

# FastAPI imports
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Medical Dementia News API",
    description="AI-powered medical news aggregation for dementia research",
    version="1.0.0"
)

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client - FIXED
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cache for storing results
news_cache = {
    "articles": None,
    "timestamp": None
}


# Response models
class NewsArticle(BaseModel):
    title: str
    source: str
    url: str
    date: str
    description: str
    summary: str
    relevance_score: int


class NewsResponse(BaseModel):
    type: str = "medical"
    timestamp: str
    articles: List[Dict]
    total_articles: int


class MedicalNewsSystem:
    """Medical news aggregation system using OpenAI and SerpAPI"""

    def __init__(self):
        self.client = client
        self.serpapi_key = os.getenv("SERPAPI_KEY")

    def search_web(self, query: str, num_results: int = 10) -> List[Dict]:
        """Search the web using SerpAPI"""

        if not self.serpapi_key:
            print("Warning: SERPAPI_KEY not found. Using mock data.")
            return self._get_mock_search_results()

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

            print(f"SerpAPI returned {len(articles)} results for query: {query}")
            return articles

        except Exception as e:
            print(f"SerpAPI error: {e}")
            return self._get_mock_search_results()

    def _get_mock_search_results(self) -> List[Dict]:
        """Return mock search results for testing"""
        return [
            {
                "title": "New Alzheimer's drug shows promise in Phase 3 trial",
                "link": "https://www.alzheimers.org.uk/news/new-drug-trial",
                "snippet": "A new monoclonal antibody treatment has shown significant results in slowing cognitive decline in early-stage Alzheimer's patients.",
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "title": "Blood test for early dementia detection approved by FDA",
                "link": "https://www.nih.gov/news/blood-test-dementia",
                "snippet": "The FDA has approved a new blood biomarker test that can detect Alzheimer's disease up to 15 years before symptoms appear.",
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "title": "Exercise shown to reduce dementia risk by 30%",
                "link": "https://www.thelancet.com/exercise-dementia",
                "snippet": "New research from Trinity College Dublin shows regular exercise can significantly reduce dementia risk in older adults.",
                "date": datetime.now().strftime("%Y-%m-%d")
            }
        ]

    def research_medical_news(self, days_back: int = 7) -> List[Dict]:
        """Research dementia-related medical news"""

        # Create search queries
        queries = [
            f"dementia alzheimer's research clinical trial {datetime.now().year}",
            f"dementia treatment FDA approval {datetime.now().year}",
            f"alzheimer's biomarker diagnostic {datetime.now().year}",
            "dementia new drug development Ireland"
        ]

        all_results = []
        for query in queries:
            print(f"Searching: {query}")
            results = self.search_web(query, num_results=5)
            all_results.extend(results)

        # Remove duplicates based on URL
        seen_urls = set()
        unique_results = []
        for result in all_results:
            if result["link"] not in seen_urls:
                seen_urls.add(result["link"])
                unique_results.append(result)

        print(f"Total unique results: {len(unique_results)}")

        if not unique_results:
            print("No search results found, returning empty list")
            return []

        # Use OpenAI to extract relevant information
        prompt = f"""
        You are a medical researcher analyzing dementia-related news articles.

        Given these search results, extract and structure information about dementia/Alzheimer's news:

        {json.dumps(unique_results, indent=2)}

        For each article, extract:
        - title: The article title
        - source: The source/journal name (extract from URL or title)
        - url: The URL
        - date: Publication date (use today's date if not available: {datetime.now().strftime("%Y-%m-%d")})
        - description: A 2-3 sentence description of the article
        - key_findings: Main findings or clinical implications

        Return ONLY a valid JSON array of articles. No markdown, no explanation, just the JSON array.
        """

        try:
            print("Calling OpenAI for research extraction...")
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a medical researcher. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )

            content = response.choices[0].message.content.strip()

            # Extract JSON from response
            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()

            articles = json.loads(content)
            print(f"OpenAI extracted {len(articles)} articles")
            return articles
        except Exception as e:
            print(f"Error in research phase: {e}")
            import traceback
            traceback.print_exc()
            return []

    def validate_articles(self, articles: List[Dict]) -> List[Dict]:
        """Validate and score articles"""

        if not articles:
            print("No articles to validate")
            return []

        prompt = f"""
        You are a medical librarian validating news articles for clinical relevance and credibility.

        Analyze these articles and:
        1. Assign a relevance score (1-10) based on:
           - Clinical applicability
           - Source credibility
           - Scientific rigor
           - Impact on patient care
        2. Remove articles with scores below 7
        3. Remove duplicates
        4. Verify they're about dementia/Alzheimer's

        Articles to validate:
        {json.dumps(articles, indent=2)}

        Return ONLY a valid JSON array of validated articles with an added "relevance_score" field.
        Only include articles scoring 7 or higher.
        """

        try:
            print("Calling OpenAI for validation...")
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a medical fact-checker. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )

            content = response.choices[0].message.content.strip()

            # Extract JSON from response
            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()

            validated_articles = json.loads(content)
            print(f"Validated {len(validated_articles)} articles")
            return validated_articles
        except Exception as e:
            print(f"Error in validation phase: {e}")
            import traceback
            traceback.print_exc()
            return articles

    def create_summaries(self, articles: List[Dict]) -> List[Dict]:
        """Create professional medical summaries"""

        if not articles:
            print("No articles to summarize")
            return []

        prompt = f"""
        You are a medical writer creating summaries for healthcare professionals.

        For each article, create a 150-200 word professional summary that includes:
        - Key clinical implications
        - Study methodology (if applicable)
        - Primary outcomes
        - Statistical significance (if mentioned)
        - What's new or different

        Use appropriate medical terminology and maintain a professional tone.

        Articles:
        {json.dumps(articles, indent=2)}

        Return ONLY a valid JSON array where each article has an added "summary" field and "article_type" field.
        Article types: research, clinical_trial, drug_approval, guideline, review
        """

        try:
            print("Calling OpenAI for summarization...")
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a medical writer. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=4000
            )

            content = response.choices[0].message.content.strip()

            # Extract JSON from response
            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0].strip()
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0].strip()

            final_articles = json.loads(content)
            print(f"Created summaries for {len(final_articles)} articles")
            return final_articles
        except Exception as e:
            print(f"Error in summarization phase: {e}")
            import traceback
            traceback.print_exc()
            return articles

    def run_medical_pipeline(self, days_back: int = 7) -> Dict:
        """Execute the medical news pipeline"""
        print(f"\n{'=' * 60}")
        print(f"Starting Medical News Aggregation")
        print(f"Looking back {days_back} days")
        print(f"{'=' * 60}\n")

        try:
            # Step 1: Research
            print("Step 1: Researching medical news...")
            articles = self.research_medical_news(days_back)
            print(f"Found {len(articles)} articles\n")

            # Step 2: Validate
            print("Step 2: Validating articles...")
            validated_articles = self.validate_articles(articles)
            print(f"Validated {len(validated_articles)} articles\n")

            # Step 3: Summarize
            print("Step 3: Creating summaries...")
            final_articles = self.create_summaries(validated_articles)
            print(f"Created summaries for {len(final_articles)} articles\n")

            print(f"{'=' * 60}")
            print(f"Pipeline Complete! Total articles: {len(final_articles)}")
            print(f"{'=' * 60}\n")

            return {
                "type": "medical",
                "timestamp": datetime.now().isoformat(),
                "articles": final_articles,
                "total_articles": len(final_articles)
            }
        except Exception as e:
            print(f"Error running pipeline: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "type": "medical",
                "timestamp": datetime.now().isoformat(),
                "articles": [],
                "total_articles": 0,
                "error": str(e)
            }


# Initialize the news system
news_system = MedicalNewsSystem()


# API Endpoints
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "message": "Medical Dementia News API",
        "version": "1.0.0",
        "endpoints": {
            "medical_news": "/api/news/medical",
            "health": "/api/health",
            "refresh": "/api/news/refresh"
        }
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "cache_status": {
            "has_cached_data": news_cache["articles"] is not None,
            "last_updated": news_cache["timestamp"],
            "articles_count": len(news_cache["articles"]) if news_cache["articles"] else 0
        }
    }


@app.get("/api/news/medical", response_model=NewsResponse, tags=["News"])
async def get_medical_news(
        days_back: int = Query(default=7, ge=1, le=30, description="Number of days to look back"),
        refresh: bool = Query(default=False, description="Force refresh of news data")
):
    """
    Get medical professional-focused dementia news

    - **days_back**: Number of days to search (1-30)
    - **refresh**: Force refresh instead of using cache
    """

    # Check cache (if not forcing refresh)
    if not refresh and news_cache["articles"] and news_cache["timestamp"]:
        cache_time = datetime.fromisoformat(news_cache["timestamp"])
        cache_age = datetime.now() - cache_time

        # Use cache if less than 1 hour old
        if cache_age < timedelta(hours=1):
            print(f"Returning cached results (age: {cache_age})")
            return news_cache["articles"]

    # Run the pipeline to get fresh news
    print("Fetching fresh medical news...")
    result = news_system.run_medical_pipeline(days_back)

    # Update cache
    news_cache["articles"] = result
    news_cache["timestamp"] = result["timestamp"]

    return result


@app.post("/api/news/refresh", tags=["News"])
async def refresh_news(
        days_back: int = Query(default=7, ge=1, le=30)
):
    """
    Trigger a background refresh of medical news

    - **days_back**: Number of days to search (1-30)
    """

    result = news_system.run_medical_pipeline(days_back)

    # Update cache
    news_cache["articles"] = result
    news_cache["timestamp"] = result["timestamp"]

    return {
        "message": "News refresh completed",
        "timestamp": result["timestamp"],
        "articles_found": result["total_articles"]
    }


if __name__ == "__main__":
    import uvicorn

    print("\n" + "=" * 60)
    print("Medical Dementia News API Starting...")
    print("=" * 60)
    print(f"API will be available at: http://localhost:8001")
    print(f"API docs at: http://localhost:8001/docs")
    print("=" * 60 + "\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )