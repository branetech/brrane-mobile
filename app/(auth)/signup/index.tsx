import { ThemedText } from "@/components/themed-text";
import { Image, TouchableOpacity, View } from "@idimma/rn-widget";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { PhoneInput } from "@/components/phone-input";
import { PassWrd } from "@/components/svg";
import { BraneButton } from "@/components/brane-button";
import { VerifyMethodModal } from "@/components/verificationModal";
import { useFormHandler } from "@/hooks/use-formik";
import { Eye, EyeSlash } from "iconsax-react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as yup from "yup";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SignupScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? "light"];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<"sms" | "whatsapp">("sms");

  const { form, isDisabled } = useFormHandler({
    initialValues: { phone: "", password: "", confirmPassword: "" },
    validationSchema: yup.object().shape({
      phone: yup
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      password: yup
        .string()
        .min(8, "Password cannot be less than 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.,_-])(?=.{8,})/,
          "Your password must have at least 8 characters, a digit (0-9), an uppercase letter (A-Z), a special character ($, @, etc.)"
        ),
      confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    }),
    onSubmit: (data) => {
      console.log("Creating account via:", verifyMethod, data);
    },
  });

  const handleSignup = (method: "sms" | "whatsapp") => {
    setVerifyMethod(method);
    form.handleSubmit();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View flex px={"5%"} py={"6%"} spaced>
          <View gap={24}>
            <View gap={8} style={{ alignItems: "center" }}>
              <ThemedText type={"subtitle"}>Create your account</ThemedText>
              <ThemedText style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>
                Welcome to the future of wealth creation
              </ThemedText>
            </View>

            <View>
              <ThemedText style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
                Phone Number
              </ThemedText>
              <PhoneInput
                value={form.values.phone}
                onPhoneChange={(val) => form.setFieldValue("phone", val)}
                placeholder="80298 83647 738"
              />
            </View>

            <View>
              <ThemedText style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
                Password
              </ThemedText>
              <FormInput
                leftContent={
                  <PassWrd
                    color={
                      form.errors.password && form.touched.password
                        ? C.error
                        : C.muted
                    }
                    size={20}
                  />
                }
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                textContentType="oneTimeCode"
                rightContent={
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                    {showPassword
                      ? <EyeSlash size="20" color={C.muted} />
                      : <Eye size="20" color={C.muted} />}
                  </TouchableOpacity>
                }
                {...mapFormikProps("password", form)}
              />
            </View>

            <View>
              <ThemedText style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
                Confirm Password
              </ThemedText>
              <FormInput
                leftContent={
                  <PassWrd
                    color={
                      form.errors.confirmPassword && form.touched.confirmPassword
                        ? C.error
                        : C.muted
                    }
                    size={20}
                  />
                }
                placeholder="Enter password"
                secureTextEntry={!showConfirmPassword}
                textContentType="oneTimeCode"
                rightContent={
                  <TouchableOpacity onPress={() => setShowConfirmPassword((p) => !p)}>
                    {showConfirmPassword
                      ? <EyeSlash size="20" color={C.muted} />
                      : <Eye size="20" color={C.muted} />}
                  </TouchableOpacity>
                }
                {...mapFormikProps("confirmPassword", form)}
              />
            </View>
          </View>

          <View gap={16}>
            <ThemedText
              style={{
                fontSize: 12,
                color: C.muted,
                lineHeight: 16,
                textAlign: "center",
              }}
            >
              By clicking on the create account button, you agree to our{" "}
              <ThemedText style={{ color: C.primary, fontSize: 12 }}>
                Privacy Policy
              </ThemedText>{" "}
              and{" "}
              <ThemedText style={{ color: C.primary, fontSize: 12 }}>
                Terms and Conditions
              </ThemedText>
              .
            </ThemedText>

            <BraneButton
              text="Create Account"
              onPress={() => setShowVerifyModal(true)}
              disabled={isDisabled}
              height={52}
              radius={12}
              textColor={C.googleBg}
              backgroundColor={C.primary}
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
              <ThemedText
                style={{
                  marginHorizontal: 12,
                  fontSize: 12,
                  color: C.muted,
                  backgroundColor: C.inputBg,
                  paddingHorizontal: 6,
                  paddingBottom: 2,
                  fontWeight: "500",
                  borderRadius: 6,
                }}
              >
                or
              </ThemedText>
              <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            </View>

            <BraneButton
              text="Continue with Google"
              textColor={C.primary}
              backgroundColor={C.googleBg}
              onPress={() => console.log("Google Login")}
              height={52}
              radius={12}
              leftIcon={
                <Image
                  source={require("@/assets/images/Google.png")}
                  style={{ width: 18, height: 18 }}
                />
              }
            />
          </View>
        </View>

        <VerifyMethodModal
          visible={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          selectedMethod={verifyMethod}
          onSelect={(method) => {
            setShowVerifyModal(false);
            handleSignup(method);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}