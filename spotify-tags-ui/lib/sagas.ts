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
  try {
    const isPreviewMode = action.payload;
    yield put(Actions.setPreviewMode(isPreviewMode));
    const tracks: Array<Track> = isPreviewMode ? previewData : yield call(spotifyApi.fetchAllTracks);
    yield put(Actions.tracksLoadedSuccessfully(tracks));
  } catch (err: unknown) {
    console.error(err);
    toast.error("failed to load tracks");
    yield put(Actions.fetchAllTracksFailure());
  }
}

function* updateTags({ payload: tag }: PayloadAction<string>) {
  try {
    const isPreviewMode: boolean = yield select(isPreviewModeSelector);
    const track: Track = yield select((state) => state.modal.track);
    const updatedTags = track.tags?.includes(tag) ? track.tags.filter((t) => !eq(tag, t)) : track.tags.concat(tag);

    if (updatedTags.length > 0) {
      const updatedTrack: Track = isPreviewMode
        ? { ...track, tags: updatedTags }
        : yield call(spotifyApi.patchTrack, track.id, updatedTags);
      yield put(Actions.trackUpdated(updatedTrack));
    } else {
      // delete track since it has no more tags
      yield put(deleteTrackAction(track.id));
      yield put(Actions.closeModal());
    }
  } catch (err: unknown) {
    console.error(err);
    toast.error("failed to update tag, try again");
  }
}

function* deleteTrackWorker(action: PayloadAction<string>) {
  try {
    const isPreviewMode: boolean = yield select(isPreviewModeSelector);
    if (!isPreviewMode) {
      yield call(spotifyApi.deleteTrack, action.payload);
    }
    yield put(Actions.trackDeleted(action.payload));
  } catch (err: unknown) {
    console.error(err);
    toast.error("failed to update tags, try again !");
  }
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
