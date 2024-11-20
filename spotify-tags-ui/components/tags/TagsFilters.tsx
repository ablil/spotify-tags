import { Actions, filterTagsSelector, useAppDispatch, useAppSelector } from "@/lib/store";
import { Operator } from "@/lib/types";
import CloseButton from "@/svgs/CloseButton";
import Tag, { TagInLoadingState } from "./Tag";
import { eq, matches } from "@/lib/utils";
import CustomInput from "../CustomInput";
import { useMemo, useState } from "react";


// TODO: if you have a loooot of tags, check how they are displayed
const TagsFilters = () => {
  const dispatcher = useAppDispatch()
  const tags = useAppSelector(filterTagsSelector)

  const [keyword, setKeyword] = useState('')
  const filteredTags = useMemo(() => tags.filter(tag => matches(tag.tag, keyword)), [keyword, tags])
  const hasAnyTagsSelected = useMemo(() => tags?.some(tag => tag.selected) ?? false, [tags])

  console.log('should be hidden', !hasAnyTagsSelected)

  const filterByTag = (tag: string) => dispatcher(Actions.filterByTag(tag))
  const resetFilters = () => dispatcher(Actions.resetFilters())
  const toggleOperator = (operator: Operator) => dispatcher(Actions.toggleOperatorFilter(operator))


  return (
    <aside className="bg-zinc-900 m-4 rounded-md">
      <div className="text-white capitlize p-4">Tags</div>

      <div className="px-2">
        <CustomInput className="mx-4" keyword={keyword} onKeyword={keyword => setKeyword(keyword)} placeHolder='search a tag' />
      </div>

      {hasAnyTagsSelected && (
        <div className="flex items-center justify-between p-4">
          <select name="operator" id="operator" className="select" onChange={evt => toggleOperator(evt.currentTarget.value as Operator)}>
            <option value={Operator.or}>anyOf</option>
            <option value={Operator.and}>allOf</option>
          </select>
          <button className="underline text-sm opacity-80" onClick={resetFilters}>clear</button>
        </div>
      )}

      <div>
        {filteredTags.map((tag) => (
          <button
            data-selected={tag.selected}
            className="p-2 capitalize block w-full text-left sidebar-tag px-4"
            key={tag.tag}
            onClick={() => filterByTag(tag.tag)}
          >{tag.tag}</button>
        ))}
      </div>
    </aside>
  );
};


export default TagsFilters;
