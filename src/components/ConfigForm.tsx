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
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ChatConfig, ModelProvider, ModelOption } from "../types";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export interface ConfigFormProps {
  onSave: (config: ChatConfig) => void;
  initialConfig?: ChatConfig;
  language?: "en" | "zh";
}

export const MODEL_OPTIONS: Record<ModelProvider, ModelOption[]> = {
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
  custom: [
    {
      id: "custom-model",
      name: "Custom Model",
      provider: "custom",
      maxTokens: 32768,
    },
  ],
};

const ConfigForm: React.FC<ConfigFormProps> = ({
  onSave,
  initialConfig,
  language = "zh",
}) => {
  const [baseUrl, setBaseUrl] = React.useState(initialConfig?.baseUrl || "");
  const [apiKey, setApiKey] = React.useState(initialConfig?.apiKey || "");
  const [maxLength, setMaxLength] = React.useState(
    initialConfig?.maxLength || 45
  );
  const [minLength, setMinLength] = React.useState(
    initialConfig?.minLength || 20
  );
  const [provider, setProvider] = React.useState<ModelProvider>(
    initialConfig?.provider || "google"
  );
  const [model, setModel] = React.useState(
    initialConfig?.model || "gemini-1.5-pro"
  );
  const toast = useToast();
  const [showApiKey, setShowApiKey] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider === "custom" && !baseUrl) {
      toast({
        title: language === "zh" ? "错误" : "Error",
        description:
          language === "zh" ? "请填写所有必填项" : "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!apiKey) {
      toast({
        title: language === "zh" ? "错误" : "Error",
        description:
          language === "zh" ? "请输入 API Key" : "Please enter your API Key",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (minLength >= maxLength) {
      toast({
        title: language === "zh" ? "错误" : "Error",
        description:
          language === "zh"
            ? "最小字数必须小于最大字数"
            : "Minimum length must be less than maximum length",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave({
      baseUrl: provider === "custom" ? baseUrl : getDefaultBaseUrl(provider),
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
    if (newProvider !== "custom") {
      setBaseUrl("");
    }
    setModel(MODEL_OPTIONS[newProvider][0].id);
  };

  const getDefaultBaseUrl = (provider: ModelProvider) => {
    switch (provider) {
      case "openai":
      case "custom":
        return import.meta.env.VITE_OPENAI_BASE_URL;
      case "anthropic":
        return import.meta.env.VITE_ANTHROPIC_BASE_URL;
      case "google":
        return import.meta.env.VITE_GOOGLE_BASE_URL;
      default:
        return import.meta.env.VITE_OPENAI_BASE_URL;
    }
  };

  const getAvailableModels = (currentProvider: ModelProvider) => {
    if (currentProvider === "custom") {
      // 合并所有提供商的模型
      return [
        ...MODEL_OPTIONS.openai,
        ...MODEL_OPTIONS.anthropic,
        ...MODEL_OPTIONS.google,
      ];
    }
    return MODEL_OPTIONS[currentProvider];
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
            <option value="google">Google (Gemini)</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="custom">自定义提供商</option>
          </Select>
        </FormControl>

        {provider === "custom" && (
          <FormControl isRequired>
            <FormLabel fontSize={{ base: "sm", md: "md" }}>
              API Base URL
            </FormLabel>
            <Input
              size={{ base: "sm", md: "md" }}
              placeholder={import.meta.env.VITE_OPENAI_BASE_URL}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>API Key</FormLabel>
          <InputGroup size={{ base: "sm", md: "md" }}>
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder={`Enter your ${provider.toUpperCase()} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label={showApiKey ? "Hide API Key" : "Show API Key"}
                icon={showApiKey ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowApiKey(!showApiKey)}
                variant="ghost"
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={{ base: "sm", md: "md" }}>选择模型</FormLabel>
          <Select
            size={{ base: "sm", md: "md" }}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {getAvailableModels(provider).map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.provider.toUpperCase()})
              </option>
            ))}
          </Select>
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

export default ConfigForm;
