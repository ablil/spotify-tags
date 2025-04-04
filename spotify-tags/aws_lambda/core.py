#!/usr/bin/env python3
import datetime
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
        logger.debug("track metadata", extra={'track': track})

        existing_labels = set()
        existing_track = self.table.get_item(Key={'id': track['id']})
        if 'Item' in existing_track:
            existing_labels.update(existing_track['Item']['tags'])

        new_labels = set(map(lambda item: item.lower(), data.labels))
        result = self.table.put_item(Item={
            'id': track['id'],
            'tags': new_labels.union(existing_labels),
            'metadata': track,
            'last_updated': int(datetime.datetime.now().timestamp()),
        })
        logger.info("saved track successfully", extra={'track': result})

    # TODO: maybe you should cache this method
    def fetch_all(self):
        logger.info("scanning table")
        items = self.table.scan()['Items']
        for item in items:
            # set data type is not serializable by json library
            item['tags'] = [tag.lower() for tag in item['tags']]
        return items

    def delete_track(self, id: str):
        self.table.delete_item(Key={'id': id})
        logger.info(f"deleted track successfully {id}")

    def patch_track(self, id: str, param: List[str]):
        # TODO: handle case where all tags are removed
        logger.info("updating track with new tags", extra={'id': id, 'tags': param})
        result = self.table.update_item(
            Key={'id': id},
            UpdateExpression='SET tags = :tags, last_updated = :last_updated',
            ExpressionAttributeValues={':tags': set(param), ':last_updated': int(datetime.datetime.now().timestamp())},
            ReturnValues='ALL_NEW'
        )
        logger.info("updated tags", result)
        result['Attributes']['tags'] = list(result['Attributes']['tags'])
        return result['Attributes']
