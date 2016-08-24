# PyCoffee: Python Backend of Lean Coffee

This is the core logic and data store of the Lean Coffee system. The API interface is managed by a different module.

## Tests

The tests need to be configured to run against a local mock dynamodb.
One way to do that:

    docker run -d -p 8000:8000 tray/dynamodb-local -inMemory -port 8000

They also require the package to be installed in editable mode:

    pip install -e .
    python setup.py test

## Using via the API

Because this uses a very 'green' API tool (chalice)[https://github.com/awslabs/chalice] it's unable to package additional code.
The workaround is to 

    python setup.py sdist

and then refer to the tarball in the requirements.txt explicitly.
