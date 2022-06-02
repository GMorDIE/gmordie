export const Loader = () => {
  return (
    <div className="fixed w-screen h-screen flex flex-col justify-center items-center text-salmon">
      <svg
        width={100}
        height={100}
        version="1.1"
        id="L3"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
      >
        <circle
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          cx="50"
          cy="50"
          r="44"
          className="opacity-50"
        />
        <circle
          fill="white"
          stroke="#424143"
          strokeWidth="3"
          cx="8"
          cy="54"
          r="6"
        >
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            type="rotate"
            from="0 50 48"
            to="360 50 52"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};
