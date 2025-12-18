from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

# import your existing functions
from Main import chat_with_gpt, view_user_memories

app = FastAPI(title="NeuroMind Backend")

# -------- Request Models --------
class ChatRequest(BaseModel):
    patient_id: str
    doctor_message: str

class MemoryRequest(BaseModel):
    patient_id: str

# -------- Routes --------
@app.post("/chat")
def chat(req: ChatRequest):
    response = chat_with_gpt(
        prompt=req.doctor_message,
        patient_id=req.patient_id
    )
    return {
        "assistant_response": response
    }

@app.get("/memories/{patient_id}")
def get_memories(patient_id: str):
    # reuse mem0 directly
    memories = view_user_memories(patient_id)
    return {
        "patient_id": patient_id,
        "memories": memories
    }
