import { useId } from "react";
import { forwardRef } from "@chakra-ui/react";
import { Icon, type IconProps } from "@chakra-ui/react";

export type Props = IconProps;

const ArchiveIcon = forwardRef<Props, "svg">(function ArchiveIcon(
  { width = "24px", height = "24px", ...props },
  ref
) {
  const id = useId();

  return (
    <Icon
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      ref={ref}
      {...props}
    >
      <g clipPath={`url(#${id})`}>
        <path d="M15 11H9V13H15V11Z" fill="black" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V8C22 8.55228 21.5523 9 21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9C2.44772 9 2 8.55228 2 8V4ZM5 9H19V19H5V9ZM20 7H4V5H20V7Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  );
});

export default ArchiveIcon;
