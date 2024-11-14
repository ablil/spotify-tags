#!/usr/bin/env python3
from dataclasses import dataclass
from typing import Set, List

from spotipy import Spotify

from aws_lambda.logger import logger


@dataclass
class SpotifyLabel:
    spotify_track: str
    labels: Set[str]


@dataclass
class TrackInfo:
    id: str
    metadata: dict
    tags: Set[str]

class SpotifyTagger:
    def __init__(self, dynamodb_table, spotify_client: Spotify):
        self.table = dynamodb_table
        self.spotify_client = spotify_client

    def save_spotify_labels(self, data: SpotifyLabel):
        track = self.spotify_client.track(data.spotify_track)
        logger.debug("track metadata", track)

        # TODO: convert all tags to lowercase and remove duplicated
        result = self.table.put_item(Item={
            'id': track['id'],
            'tags': data.labels,
            'metadata': track
        })
        logger.info(f"saved track successfully", result)

    # TODO: maybe you should cache this method
    def fetch_all(self):
        logger.info("trying to get all data")
        items = self.table.scan()['Items']
        for item in items:
            # set data type is not serializable by json library
            item['tags'] = [tag for tag in item['tags']]
        return items

    def delete_track(self, id: str):
        self.table.delete_item(Key={'id': id})
        logger.info("deleted track successfully", id)

    def patch_track(self, id: str, param: List[str]):
        # TODO: handle case where all tags are removed
        logger.info("trying to update tags", id, param)
        result = self.table.update_item(
            Key={'id': id},
            UpdateExpression='SET tags = :tags',
            ExpressionAttributeValues={':tags': set(param)},
            ReturnValues='ALL_NEW'
        )
        logger.info("updated tags", result)
        result['Attributes']['tags'] = list(result['Attributes']['tags'])
        return result['Attributes']