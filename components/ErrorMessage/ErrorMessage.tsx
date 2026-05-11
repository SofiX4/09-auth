import css from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  return <p className={css.text}>Could not fetch the list of notes.</p>;
}
