import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: `'Calibri', sans-serif`,
    body: `'Calibri', sans-serif`,
  },
  styles: {
    global: {
      body: {
        fontFamily: `'Calibri', sans-serif`,
      },
    },
  },
});
