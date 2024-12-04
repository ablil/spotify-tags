import { Operator, Predicate, SortBy, SortDirection, Track, TracksFilter } from "./types";

export function equalsIgnoreCase(str1?: string, str2?: string): boolean {
  if (!str1 && !str2) return false;
  return str1?.toLocaleLowerCase() === str2?.toLowerCase();
}
export function eq(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function matches(str: string, pattern: string) {
  return str.toLowerCase().includes(pattern.toLowerCase());
}

export function includesIgnoreCase(array: Array<string>, str?: string): boolean {
  if (!str || str.length === 0) return false;
  return array.some((item) => item.toLowerCase() === str?.toLowerCase());
}

export function removeIgnoreCase(array: Array<string>, str: string): Array<string> {
  return array.filter((item) => item.toLowerCase() !== str.toLowerCase());
}

export function findIndexCasesInsensitive(array: Array<string>, str: string): number {
  return array.findIndex((item) => item.toLowerCase() === str.toLowerCase());
}

export function allOf<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (value: T) => predicates.every((predicate) => predicate(value));
}

export function anyOf<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (value: T) => predicates.some((predicate) => predicate(value));
}

export function extractAndSortAllTags(tracks: Array<Track>): Array<string> {
  return [...new Set(tracks.flatMap((track) => track.tags.map((item) => item.toLowerCase())))].toSorted();
}

function createFilterPredicate(filters: TracksFilter): (track: Track) => boolean {
  const predicates: Array<Predicate<Track>> = [];

  if (filters.keyword?.length) {
    const keyword: string = filters.keyword!;
    predicates.push(
      (track) =>
        matches(track.metadata.name, keyword) ||
        track.tags.some((tag) => eq(tag, keyword)) ||
        track.metadata.artists.some((artist) => matches(artist.name, keyword)),
    );
  }

  if (filters.tags.length > 0) {
    predicates.push((track) =>
      filters.operator === Operator.and
        ? filters.tags.every((tag) => isTrackTaggedWith(track, tag))
        : filters.tags.some((tag) => isTrackTaggedWith(track, tag)),
    );
  }

  return predicates.length ? allOf(...predicates) : () => true;
}

function createSortComparator(filters: TracksFilter): (item1: Track, item2: Track) => number {
  let compartor: (item1: Track, item2: Track) => number = (item1, item2) =>
    item1.metadata.name.localeCompare(item2.metadata.name);
  if (filters.sortBy === SortBy.artist) {
    compartor = (item1, item2) => item1.metadata.artists[0].name.localeCompare(item2.metadata.artists[0].name);
  }
  if (filters.sortBy === SortBy.last_updated) {
    compartor = (item1, item2) => item1.last_updated - item2.last_updated;
  }
  return filters.sortIn === SortDirection.desc ? (a, b) => -compartor(a, b) : compartor;
}

export function filterAllTracks(tracks: Array<Track>, filters: TracksFilter): Array<Track> {
  return tracks.filter(createFilterPredicate(filters)).toSorted(createSortComparator(filters));
}

export function isTrackTaggedWith(track: Track, _tag: string, isExactMatch?: boolean) {
  return isExactMatch ? track.tags?.some((tag) => eq(tag, _tag)) : track.tags?.some((tag) => matches(tag, _tag));
}

export function replaceTrack(updated: Track, tracks?: Array<Track>): typeof tracks {
  return tracks?.map((item) => (eq(item.id, updated.id) ? updated : item));
}

export function removeTrack(trackId: string, tracks?: Array<Track>): typeof tracks {
  return tracks?.filter((item) => item.id !== trackId);
}
