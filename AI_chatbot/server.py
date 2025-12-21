from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from Main import chat_with_gpt, view_user_memories

app = FastAPI(title="NeuroMind Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(req: Request):
    body = await req.json()
    print("🔥 RAW CHAT BODY:", body)

    patient_id = body.get("patient_id")
    prompt = body.get("doctor_message") or body.get("message")

    if not patient_id or not prompt:
        raise HTTPException(
            status_code=400,
            detail="patient_id and doctor_message are required"
        )

    response = chat_with_gpt(
        prompt=prompt,
        patient_id=patient_id
    )

    return {"assistant_response": response}


@app.get("/memories/{patient_id}")
def get_memories(patient_id: str):
    memories = view_user_memories(patient_id)
    return {
        "patient_id": patient_id,
        "memories": memories
    }
