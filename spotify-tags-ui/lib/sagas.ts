import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { deleteTrack, fetchAllTracks, patchTrack } from "./api";
import { Actions, deleteTrackAction, loadAllTracksAction, updateTrackTagsActions } from "./store";
import { Track } from "./types";
import { eq } from "./utils";

function* loadAllTracks() {
  try {
    const tracks: Array<Track> = yield call(fetchAllTracks);
    yield put(Actions.tracksLoadedSuccessfully(tracks));
  } catch (err: unknown) {
    console.error(err)
    yield put(Actions.fetchAllTracksFailure());
  }
}

function* updateTags({ payload: tag }: PayloadAction<string>) {
  try {
    const track: Track = yield select((state) => state.modal.track);

    const updatedTags = track.tags?.includes(tag) ? track.tags.filter((t) => !eq(tag, t)) : track.tags.concat(tag);
    const updatedTrack: Track = yield call(patchTrack, track.id, updatedTags);
    yield put(Actions.trackUpdated(updatedTrack));
  } catch (err: unknown) {
    console.error(err)
    alert("failed to updated tags, try again !");
  }
}

function* deleteTrackWorker(action: PayloadAction<string>) {
  try {
    yield call(deleteTrack, action.payload);
    yield put(Actions.trackDeleted(action.payload));
  } catch (err: unknown) {
    console.error(err)
    alert("failed to updated tags, try again !");
  }
}

export function* allSagas() {
  yield takeLatest(loadAllTracksAction.type, loadAllTracks);
  yield takeLatest(deleteTrackAction.type, deleteTrackWorker);
  yield takeLatest(updateTrackTagsActions.type, updateTags);
}
