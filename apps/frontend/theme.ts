import { extendTheme } from 'native-base';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'indigo',
      },
    },
    Input: {
      defaultProps: {
        variant: 'outline',
        colorScheme: 'indigo',
        width: '100%',
      },
    },
    FormControl: {
      defaultProps: {
        colorScheme: 'indigo',
        width: '100%',
        align: 'center',
      },
    },
    Box: {
      defaultProps: {
        colorScheme: 'indigo',
      },
    },
    Text: {
      defaultProps: {
        colorScheme: 'indigo',
      },
    },
  },
});
export default theme;
