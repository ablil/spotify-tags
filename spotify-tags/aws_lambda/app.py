import dataclasses
import json

import boto3
import spotipy
from aws_lambda_powertools import Metrics
from aws_lambda_powertools import Tracer
from aws_lambda_powertools.event_handler import APIGatewayRestResolver
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.metrics import MetricUnit
from aws_lambda_powertools.utilities.typing import LambdaContext
from spotipy import SpotifyClientCredentials

from aws_lambda.core import SpotifyTagger, SpotifyLabel
from aws_lambda.logger import logger

app = APIGatewayRestResolver()
tracer = Tracer()
metrics = Metrics(namespace="Powertools")

table_name = 'spotify-tags'
dynamodb_table = boto3.resource('dynamodb').Table(table_name)

spotify_client = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

tagger = SpotifyTagger(dynamodb_table, spotify_client)

@app.get("/hello")
@tracer.capture_method
def hello():
    # adding custom metrics
    # See: https://awslabs.github.io/aws-lambda-powertools-python/latest/core/metrics/
    metrics.add_metric(name="HelloWorldInvocations", unit=MetricUnit.Count, value=1)

    # structured log
    # See: https://awslabs.github.io/aws-lambda-powertools-python/latest/core/logger/
    logger.info("Hello world API - HTTP 200")
    return {"message": "hello world"}

@app.get("/")
def healthcheck():
    return "UP"

@app.get("/tracks")
def get_all_tracks():
    return tagger.fetch_all()

@app.delete("/tracks/<id>")
def delete_track(id: str):
    logger.info("got request to delete track", id)
    tagger.delete_track(id)
    return None

@app.patch('/tracks/<id>')
def patch_track(id: str):
    logger.info("got request to patch track", id)
    request_body: dict = app.current_event.json_body
    assert 'tags' in request_body

    return tagger.patch_track(id, request_body['tags'])


@app.post("/label-track")
def label_track():
    logger.info("got request to label a Spotify track")
    request_body: dict = app.current_event.json_body
    labels: SpotifyLabel = SpotifyLabel(
        spotify_track=request_body['track'],
        labels=set(filter(lambda label: len(label) > 1 ,request_body['labels'].split(' ')))
    )
    tagger.save_spotify_labels(labels)
    return "SUCCESS"

# Enrich logging with contextual information from Lambda
@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST)
# Adding tracer
# See: https://awslabs.github.io/aws-lambda-powertools-python/latest/core/tracer/
@tracer.capture_lambda_handler
# ensures metrics are flushed upon request completion/failure and capturing ColdStart metric
@metrics.log_metrics(capture_cold_start_metric=True)
def lambda_handler(event: dict, context: LambdaContext) -> dict:
    logger.info(f"event {event}")
    return app.resolve(event, context)
