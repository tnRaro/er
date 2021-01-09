import { ChakraProvider } from "@chakra-ui/react";
import "./global.css"

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCss>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default App;