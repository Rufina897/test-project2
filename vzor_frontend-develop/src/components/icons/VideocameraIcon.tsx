import { useId } from "react";
import { forwardRef } from "@chakra-ui/react";
import { Icon, type IconProps } from "@chakra-ui/react";

export type Props = IconProps;

const VideoCameraIcon = forwardRef<Props, "svg">(function VideoCameraIcon(
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.31175 10.5154L13.9077 13.6442C14.1566 13.7348 14.4313 13.7228 14.6714 13.6108C14.9115 13.4988 15.0973 13.296 15.1879 13.0471L16.1421 10.4253C16.297 9.99967 16.7205 9.73303 17.1712 9.77726L21.0076 10.1539C21.2781 10.1804 21.5322 10.0204 21.6251 9.76509L21.9639 8.8342C22.0763 8.5253 21.9171 8.18375 21.6082 8.07132L8.00743 3.12103C6.97057 2.74365 5.8241 3.27826 5.44671 4.31512L4.12146 7.95603C3.93952 8.45324 3.96274 9.0024 4.18601 9.48248C4.40928 9.96256 4.81428 10.3342 5.31175 10.5154Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 14H5C5.55228 14 6 14.4477 6 15V19C6 19.5523 5.55228 20 5 20H3V14Z"
          fill="currentColor"
        />
        <path
          d="M10 12.2218V16C10 16.5523 9.55228 17 9 17H6"
          fill="currentColor"
        />
        <path d="M10 6.72793L8 5.99998" fill="currentColor" />
        <path
          d="M20.055 10.0604L19.2002 12.4087C19.0498 12.8219 18.7414 13.1584 18.3429 13.3442C17.9444 13.5301 17.4883 13.55 17.0751 13.3995L15.2954 12.7517"
          fill="currentColor"
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

export default VideoCameraIcon;
