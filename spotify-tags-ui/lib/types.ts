export type Track = {
  id: string;
  tags: Array<string>;
  metadata: {
    preview_url: string;
    external_urls: {
      spotify: string;
    };
    name: string;
    artists: Array<{
      name: string;
      external_urls: {
        spotify: string;
      };
    }>;
    album: {
      images: Array<{
        width: string;
        url: string;
        height: string;
      }>;
    };
  };
};

export type TagWrapper = {
  tag: string;
  selected: boolean;
};

export enum Operator {
  and,
  or,
}

export type TracksFilter = {
  keyword?: string;
  tags: Array<string>;
  operator: Operator;
};

export type Predicate<T> = (value: T) => boolean;

export type BinaryPredicate<T, R> = (value: T, other: R) => boolean;

export type ContextMenuCallbacks = {
  onDelete: (id: string) => void;
  onAddMoreTags: (track: Track) => void;
};
