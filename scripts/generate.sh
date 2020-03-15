# TODO: Start up API if not on, and turn it off
echo 'Going to generate client [1/2]'
yarn gen:api
echo 'Finishing up client [1/2]'
sleep 2
echo 'Going to generate dashboard [2/2]'
yarn gen:dashboard
echo 'Finishing up dashboard [2/2]'
