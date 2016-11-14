# How to test

1. If you have made any changes to the pycoffee code, run ./refresh_pycoffee.sh
2. Ensure you are in a shell pointed at the proper `AWS_DEFAULT_PROFILE`
3. run `chalice local` to start a local server
4. run 'pytest'

See the README for how to clean up dynamo tables
