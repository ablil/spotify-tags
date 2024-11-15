import { TagWrapper, Track } from "@/lib/types";
import CheckboxIcon from "@/svgs/CheckboxIcon";
import PlusIcon from "@/svgs/PlusIcon";
import { FC, useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import ModalWrapper from "./ModalWrapper";
import { matches } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tags: Array<TagWrapper>;
  track?: Track;
  onAddOrRemoveTag: (tag: string) => void;
};

const AddMoreTagsModal: FC<Props> = ({ isOpen, onClose, tags, onAddOrRemoveTag, track }) => {
  const [filteredTags, setTags] = useState(tags);
  const [keyword, setKeyword] = useState("");

  const onCloseModal = () => {
    setKeyword("");
    onClose();
  };

  const onAddTag = () => {
    if (keyword.length > 0) {
      onAddOrRemoveTag(keyword);
      setKeyword("");
    }
  };

  useEffect(() => {
    setTags(keyword.length > 0 ? tags.filter((tag) => matches(tag.tag, keyword)) : tags);
  }, [keyword, tags]);

  return (
    <ModalWrapper isOpen={isOpen!} onClose={onCloseModal}>
      <div>
        <header className="px-4 py-2 capitalize">
          {track?.metadata.name} <small>by</small> {track?.metadata.artists[0].name}
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

        <article>
          {filteredTags?.map((tag) => (
            <InternalTag
              tag={tag.tag}
              key={tag.tag}
              initialyChecked={tag.selected}
              onToggle={() => onAddOrRemoveTag(tag.tag)}
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
