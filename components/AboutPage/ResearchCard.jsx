import Link from "next/link";

function getColorClasses(colorKey) {
  const colorMap = {
    lavender: "text-lavender bg-lavender/20",
    "sage-green": "text-sage-green bg-sage-green/20",
    peach: "text-peach bg-light-peach/40",
  };
  return colorMap[colorKey] || "text-gray-500 bg-gray-200";
}

export default function ResearchCard(props) {
  const { title, description, icon, color, downloadLink } = props;
  const colorClasses = getColorClasses(color);

  return (
    <div className="flex items-center gap4 bg-white px-6 min-h-[72px] py-4 justify-between rounded-lg shadow-soft hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`flex items-center justify-center rounded-lg shrink-0 size-12 ${colorClasses}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <p className="text-base font-medium leading-normal truncate">{title}</p>
          <p className="text-subtext-gray text-sm font-normal leading-normal line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="shrink-0 ml-4">
        <Link className={`min-w-[84px] flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 ${colorClasses} text-sm font-medium leading-normal w-fit gap-2 transition-colors}`} href={downloadLink}>
          <span className="material-symbols-outlined text-base">download</span>
          <span className="truncate hidden sm:inline">Download</span>
        </Link>
      </div>
    </div>
  );
}
