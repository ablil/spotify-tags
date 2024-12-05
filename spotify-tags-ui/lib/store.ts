import { configureStore, createAction, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { allSagas } from "./sagas";
import { Operator, SortBy, SortDirection, Track, TracksFilter } from "./types";
import {
  extractAndSortAllTags,
  filterAllTracks,
  includesIgnoreCase,
  removeIgnoreCase,
  removeTrack,
  replaceTrack,
} from "./utils";

type SliceState = {
  previewMode: boolean;
  _tracks?: Array<Track>;
  _tags?: Array<string>;
  status: AppStatus;
  filters: TracksFilter;
  modal: {
    track?: Track;
    isOpen: boolean;
  };
  player: {
    track?: Track;
    playing: boolean;
  };
};

enum AppStatus {
  idle,
  loading,
  done,
  error,
}

export const loadAllTracksAction = createAction<boolean>("api/tracks/load_all");
export const deleteTrackAction = createAction<string>("api/tracks/delete");
export const updateTrackTagsActions = createAction<string>("api/tracks/update_tags");

const defaultFilters: TracksFilter = {
  tags: [],
  keyword: undefined,
  operator: Operator.or,
  sortBy: SortBy.last_updated,
  sortIn: SortDirection.desc,
};

const initialSlice: SliceState = {
  previewMode: true,
  filters: defaultFilters,
  status: AppStatus.idle,
  modal: {
    isOpen: false,
  },
  player: {
    playing: false,
  },
};

const slice = createSlice({
  name: "default",
  initialState: initialSlice,
  reducers: {
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },
    tracksLoadedSuccessfully: (state, action: PayloadAction<Array<Track>>) => {
      state.status = AppStatus.done;
      state._tracks = action.payload;
      state._tags = extractAndSortAllTags(action.payload);
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
    sortBy: (state, action: PayloadAction<SortBy>) => {
      state.filters = { ...state.filters, sortBy: action.payload };
    },
    sortIn: (state, action: PayloadAction<SortDirection>) => {
      state.filters = { ...state.filters, sortIn: action.payload };
    },
    toggleOperatorFilter: (state, action: PayloadAction<Operator>) => {
      state.filters = {
        ...state.filters,
        operator: action.payload,
      };
    },
    trackUpdated: (state, action: PayloadAction<Track>) => {
      state._tracks = replaceTrack(action.payload, state._tracks);
      state._tags = state._tracks ? extractAndSortAllTags(state._tracks) : state._tags;
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
      state._tags = state._tracks ? extractAndSortAllTags(state._tracks) : state._tags;
    },
    playTrack: (state, action: PayloadAction<Track>) => {
      state.player = { ...state.player, track: action.payload, playing: !state.player.playing };
    },
    togglePlayer: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.player.playing = action.payload;
      } else {
        state.player.playing = !state.player.playing;
      }
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

export const isPreviewModeSelector = (state: RootState) => state.previewMode;
