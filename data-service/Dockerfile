FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./app /app/app
EXPOSE 8000

CMD ["uvicorn", "app.main:app"]
