import { addToast, removeToast } from "state";
import { v4 as uuidv4 } from "uuid";

export const showToast = (
  type = "success",
  title = "title",
  message = "message",
  duration = 3000,
  dispatch
) => {
  const id = uuidv4();
  const toast = { id, type, title, message };
  dispatch(addToast(toast));
  setTimeout(() => dispatch(removeToast(id)), duration);
};
