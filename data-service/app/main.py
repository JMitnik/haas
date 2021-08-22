from typing import Optional
from fastapi import FastAPI


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hellso World"}

@app.get("/health")
async def health():
    return {"status": "Healthy"}
