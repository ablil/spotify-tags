#!/usr/bin/env python3
import functools
import logging
from http import HTTPStatus

import spotipy
from aws_lambda_powertools.event_handler import Response, content_types
from spotipy import Spotify


@functools.cache
def get_client(access_token: str) -> Spotify:
    logging.debug("creating client", extra={'token': access_token})
    return spotipy.Spotify(auth=access_token, auth_manager=None)


def create_private_playlist(tags: set[str], tracks: set[str], access_token: str) -> dict:
    client = get_client(access_token)
    playlist = client.user_playlist_create(
        user=client.current_user()['id'],
        name='SpotifyTags#' + ' '.join(tags[:3]),
        public=False,
        collaborative=False,
        description=' '.join(tags)
    )
    client.playlist_add_items(playlist['id'], tracks)
    return playlist

def handle_spotify_exception(e: spotipy.SpotifyException) -> Response:
    if str(e.http_status).startswith('4'):
        return Response(
            status_code=e.http_status,
            content_type=content_types.APPLICATION_JSON,
            body={'error': e.msg }
        )
    else:
        raise e