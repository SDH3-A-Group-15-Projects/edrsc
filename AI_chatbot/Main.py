from openai import OpenAI
from mem0 import Memory
import os
import json

load_dotenv()  # loads .env file
from openai import OpenAI
from mem0 import Memory

# -------------------------
# SET API KEYS
# -------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MEM0_API_KEY = os.getenv("MEM0_API_KEY")

# -------------------------
# INITIALIZE CLIENTS
# -------------------------
client = OpenAI(api_key=OPENAI_API_KEY)

# Get absolute path for memory database
import pathlib

memory_db_path = pathlib.Path(__file__).parent / "memory_db"
memory_db_path.mkdir(exist_ok=True)

print(f"[SYSTEM] Memory database location: {memory_db_path}")

# Configure mem0 with proper settings for dementia care and persistent storage
memory = Memory.from_config({
    "vector_store": {
        "provider": "qdrant",
        "config": {
            "path": str(memory_db_path),
            "on_disk": True
        }
    },
    "embedder": {
        "provider": "openai",
        "config": {
            "model": "text-embedding-3-small"
        }
    }
})

# System prompt for memory extraction
MEMORY_EXTRACTION_PROMPT = """You are extracting long-term memory facts about a PATIENT
from a conversation where a DOCTOR is speaking on the patient's behalf.

ONLY extract factual information ABOUT THE PATIENT.

Focus on:
- Patient preferences
- Patient routines and habits
- Medical-relevant observations
- Important people in the patient's life
- Patient abilities, limitations, or behaviors
- Things the patient would benefit from being reminded of

Rules:
- DO NOT extract information about the doctor
- DO NOT extract opinions or speculation
- Write each memory in third person about the PATIENT
- Be clear, concrete, and clinically useful

Return ONLY a JSON array of strings.

Example:
["Patient prefers tea in the morning",
 "Patient becomes anxious in the evenings",
 "Patient has a daughter named Sarah who visits weekly"]

If nothing relevant is present, return [].
"""


def extract_memories_from_conversation(user_message, assistant_response):

    try:
        extraction_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": MEMORY_EXTRACTION_PROMPT},
                {"role": "user",
                 "content": f"User said: {user_message}\nAssistant replied: {assistant_response}\n\nExtract memories:"}
            ],
            temperature=0.3
        )

        memories_text = extraction_response.choices[0].message.content.strip()

        memories_text = memories_text.replace("```json", "").replace("```", "").strip()
        memories = json.loads(memories_text)

        return memories if isinstance(memories, list) else []
    except Exception as e:
        print(f"[DEBUG] Memory extraction error: {e}")
        return []


def chat_with_gpt(prompt, patient_id="default_user"):

    # -------------------------
    #  Retrieve ALL memories
    # -------------------------
    try:
        all_memories_response = memory.get_all(user_id=patient_id)

        # Extract the actual memories from the 'results' key
        if isinstance(all_memories_response, dict) and 'results' in all_memories_response:
            all_memories = all_memories_response['results']
        else:
            all_memories = all_memories_response if all_memories_response else []

    except Exception as e:
        print(f"[DEBUG] Memory retrieval error: {e}")
        all_memories = []

    # Build rich context from all memories
    context = ""
    if all_memories:
        context = "\n=== IMPORTANT: What you know about this user ===\n"
        for mem in all_memories:
            if isinstance(mem, dict):
                memory_text = mem.get('memory', '')
            else:
                memory_text = str(mem)

            if memory_text and memory_text.strip():
                context += f"• {memory_text}\n"
        context += "=== END OF KNOWN INFORMATION ===\n\n"

    # -------------------------
    #  Build conversation messages
    # -------------------------
    messages = [
        {"role": "system",
         "content": (
             "You are a compassionate AI assistant for the NeuroMind System (NMS), "
             "used by clinicians and caregivers to support patients with dementia or memory challenges.\n\n"

             f"{context}"

             "IMPORTANT CONTEXT:\n"
             "- The person providing information is a DOCTOR speaking on behalf of the PATIENT\n"
             "- The memories you store and recall must always be about the PATIENT, never the doctor\n"
             "- The doctor may provide observations, history, or preferences of the patient\n\n"

             "Your role:\n"
             "- Understand doctor-provided patient information\n"
             "- Build a long-term memory profile for the PATIENT\n"
             "- Use known patient memories to support continuity of care\n"
             "- Respond in a professional, supportive clinical tone\n"
             "- Ask clarifying questions ONLY about the patient when appropriate\n\n"

             "NEVER assume the doctor and patient are the same person."
         )
         },
        {"role": "user", "content": f"Doctor report about patients:\n{prompt}"}
    ]

    # -------------------------
    # GPT Response
    # -------------------------
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7
        )
        assistant_response = response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {e}"

    # -------------------------
    # Extract and store meaningful memories
    # -------------------------
    try:
        # Extract specific memories from this conversation
        new_memories = extract_memories_from_conversation(prompt, assistant_response)

        if len(new_memories) > 0:
            # Store all memories in one call for efficiency
            combined_memory_text = "User information:\n" + "\n".join([f"- {mem}" for mem in new_memories])

            result = memory.add(
                messages=[
                    {"role": "user", "content": combined_memory_text}
                ],
                user_id=patient_id
            )

            # Verify storage worked
            verify = memory.get_all(user_id=patient_id)


    except Exception as e:
        print(f"[DEBUG] Memory storage error: {e}")
        import traceback
        traceback.print_exc()

    return assistant_response


def view_user_memories(patient_id="default_user"):
    """Display all memories for a user AND return them as structured data."""
    try:
        memories_response = memory.get_all(user_id=patient_id)

        if isinstance(memories_response, dict) and 'results' in memories_response:
            memories = memories_response['results']
        else:
            memories = memories_response if memories_response else []

        # ✅ This list will be returned (for API / React)
        returned_memories = []

        if memories:
            print(f"\n{'=' * 60}")
            print(f"📋 Memory Profile for {patient_id}")
            print('=' * 60)

            for idx, mem in enumerate(memories, 1):
                if isinstance(mem, dict):
                    memory_text = mem.get('memory', '')
                    created = mem.get('created_at', 'Unknown')

                    print(f"{idx}. {memory_text}")
                    print(f"   └─ Stored: {created[:10] if created != 'Unknown' else 'Unknown'}")

                    # ✅ Add structured memory
                    returned_memories.append({
                        "memory": memory_text,
                        "created_at": created
                    })

                else:
                    print(f"{idx}. {mem}")

                    returned_memories.append({
                        "memory": str(mem),
                        "created_at": "Unknown"
                    })

            print('=' * 60 + '\n')

        else:
            print("\n📋 No memories stored yet.\n")

        # ✅ IMPORTANT: return data instead of None
        return returned_memories

    except Exception as e:
        print(f"Error retrieving memories: {e}\n")
        return []



def clear_user_memories(patient_id="default_user"):
    """Clear all memories for a user."""
    try:
        memory.delete_all(user_id=patient_id)
        print(f"✓ All memories cleared for {patient_id}\n")
    except Exception as e:
        print(f"Error clearing memories: {e}\n")


def export_memories(user_id="default_user", filename=None):
    """Export user memories to a JSON file for backup/sharing with caregivers."""
    try:
        memories_response = memory.get_all(user_id=user_id)

        if isinstance(memories_response, dict) and 'results' in memories_response:
            memories = memories_response['results']
        else:
            memories = memories_response if memories_response else []

        if not filename:
            filename = f"{patient_id}_memories_backup.json"

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(memories, f, indent=2, ensure_ascii=False)

        print(f"✓ Memories exported to {filename}\n")
    except Exception as e:
        print(f"Error exporting memories: {e}\n")


# -------------------------
#  MAIN LOOP
# -------------------------
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  🧠 NeuroMind Memory Assistant - Dementia Care Support")
    print("=" * 60)
    print("\nCommands:")
    print("  • Type naturally to chat and build your memory profile")
    print("  • 'memories' - View your complete memory profile")
    print("  • 'export' - Save memories to a file")
    print("  • 'clear' - Reset all memories")
    print("  • 'quit' - Exit (memories are saved automatically)")
    print("\n" + "=" * 60 + "\n")

    patient_id = input("Enter patient ID (or press Enter for default): ").strip()
    if not patient_id:
        patient_id = "default_patient"

    print(f"\n✓ Welcome! Logged in as: {patient_id}")
    print("💬 Start chatting ! \n")

    while True:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        if user_input.lower() in ["quit", "exit", "bye"]:
            print("\n✓ Goodbye! Your memories have been saved securely.")
            print("Take care, and see you next time!\n")
            break

        if user_input.lower() == "memories":
            view_user_memories(patient_id)
            continue

        if user_input.lower() == "export":
            export_memories(patient_id)
            continue

        if user_input.lower() == "clear":
            confirm = input("⚠️ Clear all memories? This cannot be undone. (yes/no): ")
            if confirm.lower() in ["yes", "y"]:
                clear_user_memories(patient_id)
            continue

        response = chat_with_gpt(user_input, patient_id)
        print(f"\nAssistant: {response}\n")