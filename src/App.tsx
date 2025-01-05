import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Container,
  Select,
  IconButton,
  Link,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { MODEL_OPTIONS } from "./components/ConfigForm";
import ConfigForm from "./components/ConfigForm";
import { ChatForm } from "./components/ChatForm";
import { OpenAIService } from "./services/openai";
import { GeminiService } from "./services/gemini";
import { ChatConfig, ChatInput, Language } from "./types";
import { SettingsIcon } from "@chakra-ui/icons";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const CONFIG_KEY = "chat_generator_config";

function App() {
  const [config, setConfig] = useState<ChatConfig>(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          baseUrl: "https://generativelanguage.googleapis.com/v1beta",
          apiKey: "",
          provider: import.meta.env.VITE_DEFAULT_MODEL_PROVIDER || "google",
          model: import.meta.env.VITE_DEFAULT_MODEL || "gemini-pro",
        };
  });
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "zh">("zh");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    document.title =
      language === "zh" ? "甜言蜜语生成器" : "Sweet Words Generator";
  }, [language]);

  const handleConfigSave = (newConfig: ChatConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    onClose();
  };

  const handleSubmit = async (input: ChatInput) => {
    if (!config.baseUrl || (!config.apiKey && config.provider !== "google")) {
      onOpen();
      return;
    }

    setIsLoading(true);
    try {
      let service;
      const provider = config.provider || "google";
      const selectedModel = MODEL_OPTIONS[provider].find(
        (m) => m.id === config.model
      );
      const modelProvider = selectedModel?.provider || provider;

      switch (modelProvider) {
        case "google":
          service = new GeminiService(config);
          break;
        case "openai":
        case "custom":
          service = new OpenAIService(config);
          break;
        case "anthropic":
          service = new OpenAIService(config);
          break;
        default:
          service = new OpenAIService(config);
      }

      const response = await service.generateLoveMessage(input);

      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response.content);
    } catch (error) {
      console.error("Error generating message:", error);
      setResult(
        language === "zh"
          ? "生成失败，请检查配置并重试。"
          : "Generation failed. Please check your configuration and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(-45deg, #ffe5e5, #fff0f0, #ffd6e1, #ffecf0, #ffe3e8)"
        bgSize="400% 400%"
        animation="gradient 15s ease infinite"
        zIndex={-1}
        sx={{
          "@keyframes gradient": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
            "100%": {
              backgroundPosition: "0% 50%",
            },
          },
        }}
      />
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={1000}
        display="flex"
        gap={2}
      >
        <IconButton
          aria-label="Settings"
          icon={<SettingsIcon />}
          size="sm"
          onClick={onOpen}
          bg="white"
          boxShadow="sm"
        />
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          size="sm"
          width="110px"
          bg="white"
          boxShadow="sm"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </Select>
      </Box>
      <Container
        maxW="container.md"
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 8 }}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        boxShadow="lg"
        mt={{ base: 4, md: 8 }}
        mb={{ base: 4, md: 8 }}
        minH="calc(100vh - 8rem)"
      >
        <VStack spacing={{ base: 4, md: 8 }} height="100%">
          <Box textAlign="center" w="100%">
            <Heading
              as="h1"
              size={{ base: "lg", md: "xl" }}
              mb={{ base: 1, md: 2 }}
            >
              {language === "zh" ? "甜言蜜语生成器" : "Sweet Words Generator"}
            </Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
              {language === "zh"
                ? "输入关键词，选择风格，让AI为你生成独特的情话"
                : "Enter keywords, choose a style, and let AI generate unique sweet words for you"}
            </Text>
          </Box>

          <Box position="relative" width="100%">
            <ChatForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              result={result}
              language={language}
              maxLength={config.maxLength}
              minLength={config.minLength}
            />
          </Box>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "full", md: "md" }}
          >
            <ModalOverlay />
            <ModalContent
              mx={{ base: 2, md: 0 }}
              my={{ base: "auto", md: "3.75rem" }}
            >
              <ModalHeader fontSize={{ base: "lg", md: "xl" }}>
                {language === "zh" ? "模型配置" : "Model Configuration"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <ConfigForm
                  onSave={handleConfigSave}
                  initialConfig={config}
                  language={language}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>

      <Box
        as="footer"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        py={3}
        bg="rgba(255, 255, 255, 0.9)"
        backdropFilter="blur(10px)"
        borderTop="1px"
        borderColor="gray.200"
        textAlign="center"
        zIndex={1}
        sx={{
          "@media screen and (min-height: 100vh)": {
            position: "fixed",
          },
          "@media screen and (max-height: 100vh)": {
            position: "relative",
          },
        }}
      >
        <Container maxW="container.md">
          <VStack spacing={2}>
            <HStack spacing={4} justify="center">
              <Link
                href="https://github.com/zaunist/sweet-words.git"
                isExternal
                display="flex"
                alignItems="center"
                color="gray.600"
                _hover={{ color: "gray.800" }}
              >
                <Icon as={FaGithub} boxSize={5} mr={1} />
                <Text>GitHub</Text>
              </Link>
              <Link
                href="https://x.com/zaunist"
                isExternal
                display="flex"
                alignItems="center"
                color="gray.600"
                _hover={{ color: "gray.800" }}
              >
                <Icon as={FaXTwitter} boxSize={5} mr={1} />
                <Text>Twitter</Text>
              </Link>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              © {new Date().getFullYear()} Sweet Words. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
