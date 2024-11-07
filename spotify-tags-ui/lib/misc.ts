import { Actions, deleteTrackAction, store } from "./store";
import { ContextMenuCallbacks, Track } from "./types";

export const defaultContexMenuCallback: ContextMenuCallbacks = {
  onDelete: (id: string) => store.dispatch(deleteTrackAction(id)),
  onAddMoreTags: (track: Track) => store.dispatch(Actions.openEditTagsModal(track)),
};
