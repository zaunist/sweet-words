import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ChatInput, Language } from "../types";

interface ChatFormProps {
  onSubmit: (input: ChatInput) => Promise<void>;
  isLoading: boolean;
  result?: string;
  language: Language;
}

interface StyleOption {
  value: string;
  label: string;
}

const STYLE_OPTIONS: Record<Language, StyleOption[]> = {
  zh: [
    { value: "古风", label: "古风婉约" },
    { value: "现代", label: "现代浪漫" },
    { value: "甜蜜", label: "甜蜜温馨" },
    { value: "幽默", label: "幽默俏皮" },
    { value: "文艺", label: "文艺清新" },
    { value: "深情", label: "深情款款" },
    { value: "可爱", label: "可爱萌系" },
    { value: "诗意", label: "诗意优美" },
    { value: "青春", label: "青春活力" },
    { value: "高级", label: "高级优雅" },
  ],
  en: [
    { value: "classical", label: "Classical Romantic" },
    { value: "modern", label: "Modern Romance" },
    { value: "sweet", label: "Sweet & Warm" },
    { value: "humorous", label: "Humorous & Playful" },
    { value: "literary", label: "Literary & Fresh" },
    { value: "deep", label: "Deep & Sincere" },
    { value: "cute", label: "Cute & Adorable" },
    { value: "poetic", label: "Poetic & Beautiful" },
    { value: "youthful", label: "Young & Energetic" },
    { value: "elegant", label: "Elegant & Graceful" },
  ],
};

const SCENE_OPTIONS: Record<Language, StyleOption[]> = {
  zh: [
    { value: "日常", label: "日常问候" },
    { value: "睡前", label: "睡前陪伴" },
    { value: "用餐", label: "用餐相伴" },
    { value: "安慰", label: "温暖安慰" },
    { value: "道歉", label: "真诚致歉" },
    { value: "早安", label: "早安问候" },
    { value: "晚安", label: "晚安道别" },
    { value: "想念", label: "思念传达" },
  ],
  en: [
    { value: "daily", label: "Daily Greeting" },
    { value: "bedtime", label: "Bedtime Talk" },
    { value: "mealtime", label: "Dining Together" },
    { value: "comfort", label: "Warm Comfort" },
    { value: "apology", label: "Sincere Apology" },
    { value: "morning", label: "Good Morning" },
    { value: "night", label: "Good Night" },
    { value: "missing", label: "Missing You" },
  ],
};

const TRANSLATIONS = {
  zh: {
    keywords: "关键词 (用逗号分隔)",
    keywordsPlaceholder: "例如: 阳光,微笑,温暖",
    scene: "场景",
    style: "风格",
    name: "对方的名字",
    namePlaceholder: "请输入名字",
    generate: "生成情话",
    result: "生成结果",
    copy: "复制",
    error: "错误",
    fillAll: "请填写所有必填项",
    copied: "已复制",
    copiedDesc: "内容已复制到剪贴板",
    language: "语言",
  },
  en: {
    keywords: "Keywords (separated by commas)",
    keywordsPlaceholder: "e.g., sunshine, smile, warmth",
    scene: "Scene",
    style: "Style",
    name: "Recipient's Name",
    namePlaceholder: "Enter name",
    generate: "Generate Message",
    result: "Generated Result",
    copy: "Copy",
    error: "Error",
    fillAll: "Please fill in all required fields",
    copied: "Copied!",
    copiedDesc: "Message copied to clipboard",
    language: "Language",
  },
};

export const ChatForm: React.FC<ChatFormProps> = ({
  onSubmit,
  isLoading,
  result,
  language,
}) => {
  const [keywords, setKeywords] = React.useState<string>("");
  const [style, setStyle] = React.useState<string>(
    language === "zh" ? "诗意" : "poetic"
  );
  const [scene, setScene] = React.useState<string>(
    language === "zh" ? "想念" : "missing"
  );
  const [name, setName] = React.useState<string>("");
  const toast = useToast();
  const t = TRANSLATIONS[language];

  React.useEffect(() => {
    setStyle(language === "zh" ? "诗意" : "poetic");
    setScene(language === "zh" ? "想念" : "missing");
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!style || !name || !scene) {
      toast({
        title: t.error,
        description: t.fillAll,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const keywordArray = keywords
      ? keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k)
      : [];

    await onSubmit({
      keywords: keywordArray,
      style,
      scene,
      name,
      language,
    });
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: t.copied,
        description: t.copiedDesc,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box width="100%" maxW={{ base: "100%", md: "md" }} position="relative">
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>{t.keywords}</FormLabel>
          <Input
            placeholder={t.keywordsPlaceholder}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t.scene}</FormLabel>
          <Select value={scene} onChange={(e) => setScene(e.target.value)}>
            {SCENE_OPTIONS[language].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t.style}</FormLabel>
          <Select value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLE_OPTIONS[language].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t.name}</FormLabel>
          <Input
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          isLoading={isLoading}
        >
          {t.generate}
        </Button>

        {result && (
          <Box width="100%" position="relative">
            <FormControl>
              <FormLabel>{t.result}</FormLabel>
              <Textarea value={result} isReadOnly minHeight="150px" />
            </FormControl>
            <Button
              position="absolute"
              right="2"
              bottom="2"
              size="sm"
              onClick={handleCopy}
            >
              {t.copy}
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
