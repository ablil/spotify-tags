import { Operator, TagWrapper } from "@/lib/types";
import CloseButton from "@/svgs/CloseButton";
import { FC } from "react";
import Tag, { TagInLoadingState } from "./Tag";

type Props = {
  tags?: Array<TagWrapper>;
  operator: Operator;
  toggleOperator: () => void;
  onSelectTag: (tag: string) => void;
  onClearAll: () => void;
};

// TODO: if you have a loooot of tags, check how they are displayed
const TagsFilters: FC<Props> = ({ operator, toggleOperator, tags, onSelectTag, onClearAll }) => {
  const hasAnySelectedTag = tags?.some((tag) => tag.selected);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1">
      <div className="center-h">
        <div className="rounded-md p-1 logical-operators-wrapper max-w-min center-h">
          <button disabled={operator === Operator.and} onClick={toggleOperator}>
            all
          </button>
          <button disabled={operator === Operator.or} onClick={toggleOperator}>
            any
          </button>
        </div>
        <CloseButton onClick={() => onClearAll && onClearAll()} title="clear all filters" hidden={!hasAnySelectedTag} />
      </div>

      <div className="flex items-center gap-1">
        {tags?.map((tag) => (
          <Tag
            onClick={() => onSelectTag && onSelectTag(tag.tag)}
            key={tag.tag}
            tag={tag.tag}
            selected={tag.selected}
          />
        )) ?? <MultipleTagInLoadingState />}
      </div>
    </div>
  );
};

const MultipleTagInLoadingState = () => {
  return (
    <>
      <TagInLoadingState />
      <TagInLoadingState />
      <TagInLoadingState />
      <TagInLoadingState />
    </>
  );
};

export default TagsFilters;
