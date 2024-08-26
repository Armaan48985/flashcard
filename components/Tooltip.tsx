export const Tooltip = ({ text }: { text: string }) => (
    <div className="w-auto text-center absolute bottom-full mb-4 text-sm bg-white bg-opacity-15 text-gray-200 rounded py-[2px] px-2 shadow-lg">
      {text}
    </div>
  );
  