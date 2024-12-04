import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { createSpotifyAPI, SpotifyAPI } from "./api";
import { Actions, deleteTrackAction, loadAllTracksAction, updateTrackTagsActions } from "./store";
import { Track } from "./types";
import { eq } from "./utils";

const spotifyApi: SpotifyAPI = createSpotifyAPI();

function* loadAllTracks() {
  try {
    const tracks: Array<Track> = yield call(spotifyApi.fetchAllTracks);
    yield put(Actions.tracksLoadedSuccessfully(tracks));
  } catch (err: unknown) {
    console.error(err);
    yield put(Actions.fetchAllTracksFailure());
  }
}

function* updateTags({ payload: tag }: PayloadAction<string>) {
  try {
    const track: Track = yield select((state) => state.modal.track);
    const updatedTags = track.tags?.includes(tag) ? track.tags.filter((t) => !eq(tag, t)) : track.tags.concat(tag);

    if (updatedTags.length > 0) {
      const updatedTrack: Track = yield call(spotifyApi.patchTrack, track.id, updatedTags);
      yield put(Actions.trackUpdated(updatedTrack));
    } else {
      // delete track since it has no more tags
      yield call(spotifyApi.deleteTrack, track.id);
      yield put(Actions.trackDeleted(track.id));
      yield put(Actions.closeModal());
    }
  } catch (err: unknown) {
    console.error(err);
    alert("failed to updated tags, try again !");
  }
}

function* deleteTrackWorker(action: PayloadAction<string>) {
  try {
    yield call(spotifyApi.deleteTrack, action.payload);
    yield put(Actions.trackDeleted(action.payload));
  } catch (err: unknown) {
    console.error(err);
    alert("failed to updated tags, try again !");
  }
}

export function* allSagas() {
  yield takeLatest(loadAllTracksAction.type, loadAllTracks);
  yield takeLatest(deleteTrackAction.type, deleteTrackWorker);
  yield takeLatest(updateTrackTagsActions.type, updateTags);
}
