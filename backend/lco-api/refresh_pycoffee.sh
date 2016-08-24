#!/bin/bash

pushd ../pycoffee && python setup.py sdist && popd
source .chalice/venv/bin/activate
pip uninstall -y pycoffee
rm .chalice/deployments/*.zip
