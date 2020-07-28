cd container/test
# TODO: Ensure sleep is based on TCP protocol with docker-wait or so
docker-compose run --rm test_api bash -c "sleep 10 && yarn migrate && /bin/bash"
docker-compose rm -s -f