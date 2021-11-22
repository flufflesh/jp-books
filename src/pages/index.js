import {
  Input,
  VStack,
  Link,
  HStack,
  useColorMode,
  Text,
  useColorModeValue,
  Box,
  Button,
} from "@chakra-ui/react";
import * as React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// styles
const pageStyles = {
  color: "#232129",
  paddingLeft: 96,
  paddingRight: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  height: "100%",
};

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// markup
const IndexPage = () => {
  const [shownItems, setShownItems] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const goNext = () => {
    setShownItems([...items.slice(0, shownItems.length + 50)]);
  };

  React.useEffect(() => {
    fetch("/static/items.json")
      .then((response) => {
        return response.json();
      })
      .then((items) => {
        setItems(items);
        setShownItems(items.slice(0, 50));
      });
  }, []);

  const search = (e) => {
    if (e.target.value !== "") {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setShownItems(items.slice(0, 50));
      return;
    }
    const newItems = items.filter(
      (item) =>
        item.name.includes(e.target.value) ||
        item.size.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setShownItems(newItems);
  };

  const debouncedSearch = React.useCallback(debounce(search, 500), []);

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("cyan.500", "cyan.300");
  const sizeColor = useColorModeValue("purple.500", "purple.300");
  return (
    <Box as="main" bg={bgColor} pr={36} pl={36} pt={12}>
      <title>jp scraper</title>
      <VStack align="start" w="100%">
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
        <Input
          type="text"
          placeholder="search here"
          onChange={debouncedSearch}
        />
        <InfiniteScroll
          next={() => goNext()}
          dataLength={shownItems.length}
          hasMore={!isSearching}
          endMessage={<p>done</p>}
          loader={<p style={{ padding: 0, margin: 0 }}>loading...</p>}
          scrollThreshold="100px"
        >
          {shownItems?.map((item, index) => (
            <HStack key={item.name + index} maxW="100%" mb="10px">
              <Link href={item.href} target="_blank" isExternal>
                <HStack>
                  <Text color={textColor}>{item.name} </Text>
                  <Text color={sizeColor}>{item.size}</Text>
                </HStack>
              </Link>
            </HStack>
          ))}
        </InfiniteScroll>
      </VStack>
    </Box>
  );
};

export default IndexPage;
