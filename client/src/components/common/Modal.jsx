export default function Modal({ open, children, close }) {
  if (!open) return null;

  return (
    <div
      className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
"
    >
      <div
        className="
bg-white
dark:bg-slate-900
p-6
rounded-xl
"
      >
        <button
          onClick={close}
          className="
float-right
"
        >
          X
        </button>

        {children}
      </div>
    </div>
  );
}
