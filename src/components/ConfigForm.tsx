import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  useToast,
  Select,
} from "@chakra-ui/react";
import { ChatConfig, ModelProvider, ModelOption } from "../types";

interface ConfigFormProps {
  onSave: (config: ChatConfig) => void;
  initialConfig?: ChatConfig;
  language?: "en" | "zh";
}

const MODEL_OPTIONS: Record<ModelProvider, ModelOption[]> = {
  openai: [
    {
      id: "gpt-4o-latest",
      name: "GPT-4 Turbo (Latest)",
      provider: "openai",
      maxTokens: 128000,
    },
    {
      id: "gpt-4o",
      name: "GPT-4 Turbo",
      provider: "openai",
      maxTokens: 128000,
    },
    {
      id: "gpt-4-1106-preview",
      name: "GPT-4 Turbo (1106)",
      provider: "openai",
      maxTokens: 4096,
    },
    { id: "gpt-4", name: "GPT-4", provider: "openai", maxTokens: 8192 },
    {
      id: "gpt-4-32k",
      name: "GPT-4 (32k)",
      provider: "openai",
      maxTokens: 32768,
    },
    {
      id: "gpt-3.5-turbo-1106",
      name: "GPT-3.5 Turbo (Latest)",
      provider: "openai",
      maxTokens: 4096,
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "openai",
      maxTokens: 4096,
    },
    {
      id: "gpt-3.5-turbo-16k",
      name: "GPT-3.5 Turbo (16k)",
      provider: "openai",
      maxTokens: 16384,
    },
  ],
  anthropic: [
    {
      id: "claude-3-5-sonnet",
      name: "Claude 3 Sonnet",
      provider: "anthropic",
      maxTokens: 200000,
    },
    {
      id: "claude-3-5-haiku",
      name: "Claude 3 Haiku",
      provider: "anthropic",
      maxTokens: 200000,
    },
    {
      id: "claude-2.1",
      name: "Claude 2.1",
      provider: "anthropic",
      maxTokens: 200000,
    },
    {
      id: "claude-2.0",
      name: "Claude 2.0",
      provider: "anthropic",
      maxTokens: 100000,
    },
    {
      id: "claude-instant-1.2",
      name: "Claude Instant",
      provider: "anthropic",
      maxTokens: 100000,
    },
  ],
  google: [
    {
      id: "gemini-2.0-flash-exp",
      name: "Gemini 2.0 Flash (Experimental)",
      provider: "google",
      maxTokens: 128000,
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      provider: "google",
      maxTokens: 128000,
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "google",
      maxTokens: 32768,
    },
    {
      id: "gemini-ultra",
      name: "Gemini Ultra",
      provider: "google",
      maxTokens: 32768,
    },
    { id: "palm-2", name: "PaLM 2", provider: "google", maxTokens: 8192 },
  ],
};

export const ConfigForm: React.FC<ConfigFormProps> = ({
  onSave,
  initialConfig,
  language = "zh",
}) => {
  const [baseUrl, setBaseUrl] = React.useState(initialConfig?.baseUrl || "");
  const [apiKey, setApiKey] = React.useState(initialConfig?.apiKey || "");
  const [maxLength, setMaxLength] = React.useState(
    initialConfig?.maxLength || 150
  );
  const [minLength, setMinLength] = React.useState(
    initialConfig?.minLength || 50
  );
  const [provider, setProvider] = React.useState<ModelProvider>(
    initialConfig?.provider || "openai"
  );
  const [model, setModel] = React.useState(
    initialConfig?.model || "gpt-4o-latest"
  );
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseUrl || !apiKey) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (minLength >= maxLength) {
      toast({
        title: "Error",
        description: "最小字数必须小于最大字数",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave({
      baseUrl,
      apiKey,
      maxLength,
      minLength,
      language: initialConfig?.language || "zh",
      model,
      provider,
    });
    toast({
      title: language === "zh" ? "配置已保存" : "Configuration Saved",
      description:
        language === "zh"
          ? "您的设置已成功更新"
          : "Your settings have been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleProviderChange = (newProvider: ModelProvider) => {
    setProvider(newProvider);
    setModel(MODEL_OPTIONS[newProvider][0].id);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={{ base: 3, md: 4 }}>
        <FormControl isRequired>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>模型提供商</FormLabel>
          <Select
            size={{ base: "sm", md: "md" }}
            value={provider}
            onChange={(e) =>
              handleProviderChange(e.target.value as ModelProvider)
            }
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="google">Google</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>选择模型</FormLabel>
          <Select
            size={{ base: "sm", md: "md" }}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODEL_OPTIONS[provider].map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>
            API Base URL
          </FormLabel>
          <Input
            size={{ base: "sm", md: "md" }}
            placeholder={
              provider === "openai"
                ? "https://api.openai.com"
                : provider === "anthropic"
                ? "https://api.anthropic.com"
                : "https://generativelanguage.googleapis.com"
            }
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>API Key</FormLabel>
          <Input
            size={{ base: "sm", md: "md" }}
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>
            最小字数限制
          </FormLabel>
          <Input
            size={{ base: "sm", md: "md" }}
            type="number"
            min={20}
            max={maxLength - 1}
            value={minLength}
            onChange={(e) => setMinLength(Number(e.target.value))}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>
            最大字数限制
          </FormLabel>
          <Input
            size={{ base: "sm", md: "md" }}
            type="number"
            min={minLength + 1}
            max={500}
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          size={{ base: "sm", md: "md" }}
        >
          保存配置
        </Button>
      </VStack>
    </Box>
  );
};
