"use client";

import { FcSearch } from "react-icons/fc";
import InputWithChildren from "../../InputWithChildren/InputWithChildren";

function FriendsSearch({
  searchUserInput,
  setSearchUserInput,
}: {
  searchUserInput: string;
  setSearchUserInput: (search: string) => void;
}) {
  function onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchUserInput(e.target.value);
  }

  return (
    <>
      <InputWithChildren
        userInput={searchUserInput}
        setUserInput={onChangeSearchInput}
        disabled={false}
        placeholder="Search people"
        className="my-2 text-xs"
      >
        <FcSearch />
      </InputWithChildren>
    </>
  );
}

export default FriendsSearch;
