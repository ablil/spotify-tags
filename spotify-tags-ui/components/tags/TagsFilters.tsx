import { Actions, filterTagsSelector, useAppDispatch, useAppSelector } from "@/lib/store";
import { Operator } from "@/lib/types";
import CloseButton from "@/svgs/CloseButton";
import Tag, { TagInLoadingState } from "./Tag";


// TODO: if you have a loooot of tags, check how they are displayed
const TagsFilters = () => {
  const dispatcher = useAppDispatch()

  const tags = useAppSelector(filterTagsSelector)
  const hasAnySelectedTag = tags?.some((tag) => tag.selected);

  const filters = useAppSelector(state => state.filters)

  const filterByTag = (tag: string) => dispatcher(Actions.filterByTag(tag))
  const resetFilters = () => dispatcher(Actions.resetFilters())
  const toggleOperator = () => dispatcher(Actions.toggleOperatorFilter())


  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1">
      <div className="center-h">
        <div className="rounded-md p-1 logical-operators-wrapper max-w-min center-h">
          <button disabled={filters.operator === Operator.and} onClick={toggleOperator}>
            all
          </button>
          <button disabled={filters.operator === Operator.or} onClick={toggleOperator}>
            any
          </button>
        </div>
        <CloseButton onClick={resetFilters} title="clear all filters" hidden={!hasAnySelectedTag} />
      </div>

      <div className="flex items-center gap-1 overflow-x-scroll">
        {tags.map((tag) => (
          <Tag
            onClick={() => filterByTag(tag.tag)}
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
