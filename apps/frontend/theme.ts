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
    VStack: {
      defaultProps: {
        colorScheme: 'indigo',
        mx: 'auto',
        my: 'auto',
        maxWidth: '200px',
        align: 'center',
        justify: 'center',
        space: 3,
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
