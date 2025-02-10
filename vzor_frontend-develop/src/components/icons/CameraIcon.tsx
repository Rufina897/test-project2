import { useId } from "react";
import { forwardRef } from "@chakra-ui/react";
import { Icon, type IconProps } from "@chakra-ui/react";

export type Props = IconProps;

const CameraIcon = forwardRef<Props, "svg">(function CameraIcon(
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
        <path
          d="M9.5 3C9.23478 3 8.98043 3.10536 8.79289 3.29289L6.08579 6H3C2.44772 6 2 6.44772 2 7V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V7C22 6.44772 21.5523 6 21 6H17.9142L15.2071 3.29289C15.0196 3.10536 14.7652 3 14.5 3H9.5Z"
          fill="currentColor"
        />
        <path
          d="M7.20711 7.70711L9.91421 5H14.0858L16.7929 7.70711C16.9804 7.89464 17.2348 8 17.5 8H20V19H4V8H6.5C6.76522 8 7.01957 7.89464 7.20711 7.70711Z"
          fill="white"
        />
        <path
          d="M12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9Z"
          fill="currentColor"
        />
        <path
          d="M10 13C10 11.8954 10.8954 11 12 11C13.1046 11 14 11.8954 14 13C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13Z"
          fill="none"
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

export default CameraIcon;
