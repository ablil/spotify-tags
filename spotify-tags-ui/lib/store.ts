import { configureStore, createAction, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { allSagas } from "./sagas";
import { Operator, Track, TracksFilter } from "./types";
import {
  extractAllTags,
  filterAllTracks,
  includesIgnoreCase,
  removeIgnoreCase,
  removeTrack,
  replaceTrack
} from "./utils";

type SliceState = {
  _tracks?: Array<Track>;
  _tags?: Array<string>;
  status: AppStatus;
  filters: TracksFilter;
  modal: {
    track?: Track;
    isOpen: boolean;
  };
};

enum AppStatus {
  idle,
  loading,
  done,
  error,
}

export const loadAllTracksAction = createAction("api/tracks/load_all");
export const deleteTrackAction = createAction<string>("api/tracks/delete");
export const updateTrackTagsActions = createAction<string>("api/tracks/update_tags");

const defaultFilters: TracksFilter = {
  tags: [],
  keyword: undefined,
  operator: Operator.or,
};

const initialSlice: SliceState = {
  filters: defaultFilters,
  status: AppStatus.idle,
  modal: {
    isOpen: false,
  },
};

const slice = createSlice({
  name: "default",
  initialState: initialSlice,
  reducers: {
    tracksLoadedSuccessfully: (state, action: PayloadAction<Array<Track>>) => {
      state.status = AppStatus.done;
      state._tracks = action.payload;
      state._tags = extractAllTags(action.payload);
    },
    fetchAllTracksFailure: (state) => {
      state.status = AppStatus.error;
    },
    resetFilters: (state) => {
      state.filters = defaultFilters;
    },
    filterByTag: (state, action: PayloadAction<string>) => {
      if (includesIgnoreCase(state.filters.tags, action.payload)) {
        state.filters = { ...state.filters, tags: removeIgnoreCase(state.filters.tags, action.payload) };
      } else {
        state.filters = { ...state.filters, tags: state.filters.tags.concat(action.payload) };
      }
    },
    filterByKeyword: (state, action: PayloadAction<string>) => {
      state.filters = { ...state.filters, keyword: action.payload };
    },
    toggleOperatorFilter: (state) => {
      state.filters = {
        ...state.filters,
        operator: state.filters.operator === Operator.and ? Operator.or : Operator.and,
      };
    },
    trackUpdated: (state, action: PayloadAction<Track>) => {
      state._tracks = replaceTrack(action.payload, state._tracks);
      state._tags = state._tracks ? extractAllTags(state._tracks) : state._tags;
      if (state.modal.track?.id === action.payload.id) {
        state.modal = { ...state.modal, track: action.payload };
      }
    },
    openEditTagsModal: (state, action: PayloadAction<Track>) => {
      state.modal = { ...state.modal, isOpen: true, track: action.payload };
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.track = undefined;
    },
    trackDeleted: (state, action: PayloadAction<string>) => {
      state._tracks = removeTrack(action.payload, state._tracks);
      state._tags = state._tracks ? extractAllTags(state._tracks) : state._tags;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(loadAllTracksAction, (state) => {
      state.status = AppStatus.loading;
      state.filters = defaultFilters;
    }),
});
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: slice.reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(allSagas);

export const Actions = slice.actions;
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();
type RootState = ReturnType<typeof store.getState>;

// re-usable selector
export const filteredTracksSelector = createSelector(
  [(state: RootState) => state._tracks, (state) => state.filters],
  (tracks, filters) => (tracks ? filterAllTracks(tracks, filters) : tracks),
);

export const filterTagsSelector = createSelector(
  [(state: RootState) => state._tags, (state: RootState) => state.filters],
  (tags, filters) =>
    tags ? tags.map((item) => ({ tag: item, selected: includesIgnoreCase(filters.tags, item) })) : [],
);

export const modalTagsSelector = createSelector(
  [(state: RootState) => state._tags, (state: RootState) => state.modal.track],
  (tags, track) =>
    tags && track ? tags.map((item) => ({ tag: item, selected: includesIgnoreCase(track.tags, item) ?? false })) : [],
);
