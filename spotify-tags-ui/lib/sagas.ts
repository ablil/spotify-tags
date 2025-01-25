import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { createSpotifyAPI, SpotifyAPI } from "./api";
import {
  Actions,
  createPlaylistAction,
  deleteTrackAction,
  filteredTracksSelector,
  filterTagsSelector,
  isPreviewModeSelector,
  loadAllTracksAction,
  updateTrackTagsActions,
} from "./store";
import { TagWrapper, Track } from "./types";
import { eq } from "./utils";
import { previewData } from "./preview";
import { toast } from "react-toastify";

const spotifyApi: SpotifyAPI = createSpotifyAPI();

function* loadAllTracks(action: PayloadAction<boolean>) {
  const isPreviewMode = action.payload;
  if (isPreviewMode) {
    yield put(Actions.setPreviewMode(isPreviewMode));
    yield put(Actions.tracksLoadedSuccessfully(previewData));
    return;
  }

  try {
    const tracks: Array<Track> = yield call(toast.promise, spotifyApi.fetchAllTracks(), {
      error: "failed to load tracks, try again !!",
    });
    yield put(Actions.tracksLoadedSuccessfully(tracks));
  } catch (err: unknown) {
    console.error(err);
    yield put(Actions.fetchAllTracksFailure());
  }
}

function* updateTags({ payload: tag }: PayloadAction<string>) {
  const isPreviewMode: boolean = yield select(isPreviewModeSelector);
  const track: Track = yield select((state) => state.modal.track);
  const updatedTags = track.tags?.includes(tag) ? track.tags.filter((t) => !eq(tag, t)) : track.tags.concat(tag);

  if (isPreviewMode) {
    yield put(Actions.trackUpdated({ ...track, tags: updatedTags }));
    return;
  }

  if (!updateTags.length) {
    // delete track since it has no more tags
    yield put(deleteTrackAction(track.id));
    yield put(Actions.closeModal());
    return;
  }

  const updatedTrack: Track = yield call(toast.promise, spotifyApi.patchTrack(track.id, updatedTags), {
    error: "failed to update tags",
  });
  yield put(Actions.trackUpdated(updatedTrack));
}

function* deleteTrackWorker(action: PayloadAction<string>) {
  const isPreviewMode: boolean = yield select(isPreviewModeSelector);
  if (isPreviewMode) {
    yield put(Actions.trackDeleted(action.payload));
    return;
  }

  yield call(toast.promise, spotifyApi.deleteTrack(action.payload), {
    pending: "deleting track",
    success: "track deleted",
    error: "failed to delete track",
  });
  yield put(Actions.trackDeleted(action.payload));
}

function* createPlaylistWorker() {
  const tags: TagWrapper[] = yield select(filterTagsSelector);
  const tracks: Track[] = yield select(filteredTracksSelector);
  yield call(
    toast.promise,
    spotifyApi.createPlaylist(
      tracks.map((track) => track.metadata.external_urls.spotify),
      tags.filter((tag) => tag.selected).map((tag) => tag.tag),
    ),
    {
      pending: "creating playlist ...",
      success: "playlist created, check your Spotify app",
      error: "failed to create playlist, try again !!",
    },
  );
}

export function* allSagas() {
  yield takeLatest(loadAllTracksAction.type, loadAllTracks);
  yield takeLatest(deleteTrackAction.type, deleteTrackWorker);
  yield takeLatest(updateTrackTagsActions.type, updateTags);
  yield takeLatest(createPlaylistAction.type, createPlaylistWorker);
}
