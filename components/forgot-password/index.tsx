import { ThemedText } from "@/components/themed-text";
import { View } from "@idimma/rn-widget";
import Back from "../Back";
import { FormInput, mapFormikProps } from "../formInput";
import { Sms } from "iconsax-react-native";
import { BraneButton } from "../brane-button";
import * as yup from "yup";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useFormHandler } from "@/hooks/use-formik";

interface registerProps {
  onSubmitEmail: (data: any) => void;
  isLoading: boolean;
}

export default function ForgotPassword({ onSubmitEmail, isLoading }: registerProps) {
    const { form, isDisabled } = useFormHandler({
        initialValues: { email: "" },
        validationSchema: yup.object().shape({
          email: yup
          .string()
          .required("This field is required")
          .test(
            "email",
            "Please enter a valid email or phone number",
            (value) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const isEmail = emailRegex.test(value);
              const isNumber = /^(\+\d{1,3})?\d{6,}$/.test(value);
              return isEmail || isNumber;
            }
          ),
        }),
        onSubmit: onSubmitEmail,
      });
  const buttonDisabled = isDisabled || isLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex py={"12%"} px={"5%"} spaced>
        <View gap={24}>
          <Back />
          <View gap={8}>
            <ThemedText type={"subtitle"}>Password reset</ThemedText>
            <ThemedText>
              Input the email address associated with your account and we&apos;ll
              send you a link to reset your password.
            </ThemedText>
          </View>
          <View>
            <FormInput
              labelText={"Email address"}
              leftContent={<Sms size="20" color="#89888B" />}
              placeholder="Enter email address"
              {...mapFormikProps("email", form)}
            />
          </View>
        </View>
        <View>
          <BraneButton
            disabled={buttonDisabled}                              
            loading={isLoading}
            text={"Send Reset Code"}
            textColor="#D2F1E4"
            onPress={() => { form.handleSubmit(); }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}