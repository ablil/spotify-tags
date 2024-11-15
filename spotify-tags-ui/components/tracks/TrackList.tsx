"use client";
import {
  filteredTracksSelector,
  loadAllTracksAction,
  store,
  modalTagsSelector,
  filterTagsSelector,
  updateTrackTagsActions,
  useAppDispatch,
  useAppSelector,
  Actions,
} from "@/lib/store";
import { useCallback, useEffect } from "react";
import { Provider } from "react-redux";
import SearchInput from "../SearchInput";
import TagsFilters from "../tags/TagsFilters";
import TracksTable from "./TracksTable";
import AddMoreTagsModal from "../modals/AddMoreTagsModal";
import AudioPlayer from "../player/AudioPlayer";

const TrackList = () => {
  const dispatcher = useAppDispatch();

  const tracks = useAppSelector(filteredTracksSelector);
  const filterTags = useAppSelector(filterTagsSelector);
  const appliedFilters = useAppSelector((state) => state.filters);

  const modal = useAppSelector((state) => state.modal);
  const modalTags = useAppSelector(modalTagsSelector);

  const searchByKeyword = useCallback((keyword: string) => dispatcher(Actions.filterByKeyword(keyword)), []);

  useEffect(() => {
    dispatcher(loadAllTracksAction());
  }, []);

  return (
    <div className="bg-zinc-900 p-4 md:m-4 rounded-md">
      <article className="center-h justify-end">
        <SearchInput onKeywordChange={searchByKeyword} placeholder="Search for a track" />
      </article>
      <TagsFilters
        operator={appliedFilters.operator}
        toggleOperator={() => dispatcher(Actions.toggleOperatorFilter())}
        onSelectTag={(tag) => dispatcher(Actions.filterByTag(tag))}
        tags={filterTags}
        onClearAll={() => dispatcher(Actions.resetFilters())}
      />
      <TracksTable
        onSelectTag={(tag) => dispatcher(Actions.filterByTag(tag))}
        tracks={tracks}
        selectedTags={appliedFilters.tags}
      />

      {modal.track && filterTags && (
        <AddMoreTagsModal
          isOpen={modal.isOpen!}
          onClose={() => dispatcher(Actions.closeModal())}
          track={modal.track}
          tags={modalTags}
          onAddOrRemoveTag={(tag) => dispatcher(updateTrackTagsActions(tag))}
        />
      )}
    </div>
  );
};

const wrapper = () => (
  <Provider store={store}>
    <TrackList />
    <AudioPlayer />
  </Provider>
);

export default wrapper;
