import SingleMessage from "./SingleMessage";
import NouveauMessage from "./NouveauMessage";
import UserMessage from "./UserMessage";

import { isEmpty } from "../../lib/allFunctions";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { UidContext } from "../../context/UidContext";

export default function Message() {
  const { users } = useSelector((state) => state.users);
  const { messages } = useSelector((state) => state.messages);
  const { currentQuery } = useContext(UidContext);

  return (
    <div className="mt-6 w-full">
      <div />
      {!isEmpty(currentQuery?.user) ? (
        <SingleMessage />
      ) : (
        <div className="flex w-full flex-col gap-6">
          <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
            <p className="text-[var(--primary-color)] font-semibold text-lg">
              Messages (<span>{messages.length}</span>)
            </p>
          </div>

          <NouveauMessage />

          {!isEmpty(messages) ? (
            <>
              <div className="w-full grid grid-cols-1 gap-2 flex-wrap xl:grid-cols-2">
                {messages.map((item) => {
                  const actualUser = users.find((us) => us._id === item.userId);
                  const actualMessages = item.messages;

                  if (!isEmpty(actualUser) && !isEmpty(actualMessages))
                    return (
                      <div key={actualUser._id} className="w-full">
                        <UserMessage
                          message={actualMessages[actualMessages.length - 1]}
                          user={actualUser}
                        />
                      </div>
                    );
                })}
              </div>
            </>
          ) : (
            <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
              {`< Aucun message pour le moment >`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
