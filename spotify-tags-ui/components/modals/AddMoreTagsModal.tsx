import { Actions, modalTagsSelector, updateTrackTagsActions, useAppDispatch, useAppSelector } from "@/lib/store";
import { matches } from "@/lib/utils";
import CheckboxIcon from "@/svgs/CheckboxIcon";
import PlusIcon from "@/svgs/PlusIcon";
import { FC, useCallback, useMemo, useState } from "react";
import CustomInput from "../CustomInput";
import ModalWrapper from "./ModalWrapper";

const AddMoreTagsModal = () => {
  const dispatcher = useAppDispatch()
  const modal = useAppSelector(state => state.modal)
  const tags = useAppSelector(modalTagsSelector)

  const [keyword, setKeyword] = useState("");
  const filteredTags = useMemo(() => keyword.length > 0 ? tags.filter(tag => matches(tag.tag, keyword)) : tags, [tags, keyword])

  const toggleFilterByTag = (tag: string) => dispatcher(updateTrackTagsActions(tag))

  const onAddTag = () => {
    if (keyword.length > 0) {
      toggleFilterByTag(keyword)
    }
  };

  const onClose = useCallback(() => {
    dispatcher(Actions.closeModal())
    setKeyword('')
  }, [dispatcher])

  return (
    <ModalWrapper isOpen={modal.isOpen} onClose={onClose}>
      <div>
        <header className="px-4 py-2 capitalize">
          {modal.track?.metadata.name} <small>by</small> {modal.track?.metadata.artists[0].name}
        </header>

        <div className="p-1">
          <CustomInput
            placeHolder="Search or add new tag"
            keyword={keyword}
            onKeyword={(keyword) => setKeyword(keyword)}
          />
        </div>

        <div
          className="center-h h-10 leading-10 gap-2 hover:bg-zinc-900 duration-300 cursor-pointer"
          onClick={onAddTag}
        >
          <PlusIcon className="pl-2" />
          <span className="w-full h-full">Add tag</span>
        </div>

        <article className="max-h-96 overflow-y-scroll">
          {filteredTags?.map((tag) => (
            <InternalTag
              tag={tag.tag}
              key={tag.tag}
              initialyChecked={tag.selected}
              onToggle={() => toggleFilterByTag(tag.tag)}
            />
          ))}
        </article>
      </div>
    </ModalWrapper>
  );
};

const InternalTag: FC<{ tag: string; initialyChecked: boolean; onToggle: () => void }> = ({
  tag,
  initialyChecked: checked,
  onToggle,
}) => {
  const [_checked, setChecked] = useState(checked);

  const toggle = () => {
    setChecked((old) => !old);
    onToggle();
  };
  return (
    <div className="center-h h-10 leading-10 gap-2 hover:bg-zinc-900 duration-300">
      <input type="checkbox" id={tag} hidden={true} checked={_checked} onChange={toggle} />
      <CheckboxIcon data-visible={_checked} className="pl-2 text-green-400" />
      <label htmlFor={tag} className="w-full h-full">
        {tag}
      </label>
    </div>
  );
};

export default AddMoreTagsModal;
