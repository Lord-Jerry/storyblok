type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function Button(props: ButtonProps) {
  const disabledStyle = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
  return (
    <button
      disabled={props.disabled}
      type="button"
      onClick={!props.disabled ? props.onClick : () => null}
      className={`${disabledStyle} inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
    >
      {props.label}
    </button>
  );
}
