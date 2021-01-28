cd api
docker-compose -f docker-compose.test.yml up --build -d
docker-compose -f docker-compose.test.yml run --rm migrate yarn prisma migrate up --experimental