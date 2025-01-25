#!/usr/bin/env python3
import spotipy
import logging

logging.basicConfig(level=logging.DEBUG)


def lambda_handler(event, context):
    logging.info("processing new request", extra={'event': event, 'context': str(context)})

    tmp = event['methodArn'].split(':')
    apiGatewayArnTmp = tmp[5].split('/')
    resource = '/'
    token = event['authorizationToken']

    if apiGatewayArnTmp[3]:
        resource += apiGatewayArnTmp[3]

    try:
        user_id = get_user_id(token)
        return generateAllow(user_id, resource)
    except spotipy.SpotifyException as e:
        print(e)
        return generateDeny(token, resource)


def get_user_id(access_token) -> str:
    client = spotipy.Spotify(access_token)
    return client.current_user()['id']


def generatePolicy(principalId, effect, resource):
    authResponse = {}
    authResponse['principalId'] = principalId
    if (effect and resource):
        policyDocument = {}
        policyDocument['Version'] = '2012-10-17'
        policyDocument['Statement'] = []
        statementOne = {}
        statementOne['Action'] = 'execute-api:Invoke'
        statementOne['Effect'] = effect
        statementOne['Resource'] = '*' # FIXME: debug why event['methodArn'] is not working
        policyDocument['Statement'] = [statementOne]
        authResponse['policyDocument'] = policyDocument

    logging.info("generated policy", extra={'policy': authResponse})
    return authResponse

def generateAllow(principalId, resource):
    logging.info("authorization successful")
    return generatePolicy(principalId, 'Allow', resource)


def generateDeny(principalId, resource):
    logging.info("authorization failed")
    return generatePolicy(principalId, 'Deny', resource)
