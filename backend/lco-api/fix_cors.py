#!/usr/bin/env python

""" Chalice has support for CORS but it only sets the standard headers.
    This script tweaks the API Gateway configuration to fix it up.

    Algorithm:
        find the restAPI
        iterate the resources and find all the OPTIONS ones
        look at the integrationreponses
        update them and fix Access-Control-Allow-Headers
    """

import boto3
import pprint
client = boto3.client('apigateway')


def get_id(name):
    response = client.get_rest_apis()
    for item in response['items']:
        if item['name'] == name:
            return item['id']


def get_option_resources(api_id):
    r = client.get_resources(restApiId=api_id)
    ids = []
    for item in r['items']:
        if 'resourceMethods' in item and 'OPTIONS' in item['resourceMethods']:
            ids.append(item['id'])
    return ids


def fix_resource(api_id, resource_id):
    r = client.get_integration(restApiId=api_id,
                               resourceId=resource_id, httpMethod='OPTIONS')
    old_h = r['integrationResponses']['200']['responseParameters']
    path = 'method.response.header.Access-Control-Allow-Headers'
    old_h = old_h[path][1:-1]  # remove quotes
    if 'X-CoffeeUser' in old_h:
        print "Not patching {}, it's already correct".format(resource_id)
        return

    up_r = client.update_integration_response(
        restApiId=api_id,
        resourceId=resource_id,
        httpMethod='OPTIONS',
        statusCode='200',
        patchOperations=[
            {'op': 'replace',
             'path': '/responseParameters/{}'.format(path),
             'value': "'{},X-CoffeeUser'".format(old_h)}
        ]
    )
    pprint.pprint(up_r)


def main():
    api_id = get_id('lco-api')
    resource_ids = get_option_resources(api_id)
    for resource in resource_ids:
        fix_resource(api_id, resource)


if __name__ == '__main__':
    main()
