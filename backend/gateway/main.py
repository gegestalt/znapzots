from fastapi import FastAPI
import httpx

app = FastAPI()

@app.get("/auth/status")
async def auth_status():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8001/auth/status")
        return response.json()
