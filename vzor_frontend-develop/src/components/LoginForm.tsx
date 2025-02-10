import {
  Box,
  Input,
  FormControl,
  InputRightElement,
  InputGroup,
  Button,
  Text,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import ShowPasswordIcon from "./icons/ ShowPasswordIcon";
import HidePasswordIcon from "./icons/HidePasswordIcon";
import LogoIcon from "./icons/LogoIcon";
import { useAuth } from "../hooks/useAuth";

interface FormValues {
  username: string;
  password: string;
}

const schema = yup
  .object({
    username: yup.string().required('Логин обязателен'),
    password: yup.string().required('Пароль обязателен'),
  })
  .required();

const LoginForm = () => {
  const { control, handleSubmit, setError, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });
  const { mutateAsync: login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async ({ username, password }: FormValues) => {
      try {
        await login({ username, password });
        navigate("/dashboard", { replace: true });
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Ошибка при входе в систему";
        setLoginError(errorMessage);
      }
    },
    [login, navigate]
  );
``
  return (
    <Box>
      <Heading textAlign="center" fontWeight="bold" fontSize="32px">
        VZOR{" "}
      </Heading>
      <Flex height="100%" alignItems="center" justifyContent="center">
        <Flex onSubmit={handleSubmit(onSubmit)} as="form" w="100%" h="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="100%"
            gap="32px"
            p="32px 30px 32px 30px"
          >
            <LogoIcon />
            <Text fontWeight="bold" fontSize="22px">
              Вход в систему
            </Text>
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <FormControl isInvalid={!!fieldState.error}>
                  <Input
                    type="text"
                    placeholder="Логин"
                    {...field}
                  />
                  <FormErrorMessage>
                  Поле не может быть пустым
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <FormControl isInvalid={!!fieldState.error}>
                  <InputGroup>
                    <Input
                      type={!showPassword ? "password" : "text"}
                      placeholder="Пароль"
                      {...field}
                    />
                    <InputRightElement>
                      <Button
                        variant="link"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    Поле не может быть пустым
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            <Button type="submit" loadingText="Вход" bg="orange.400" w="100%">
              Вход
            </Button>

            {loginError && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {loginError}
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default memo(LoginForm);
