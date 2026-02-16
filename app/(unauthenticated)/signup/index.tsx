import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { PhoneInput } from "@/components/phone-input";
import { PassWrd } from "@/components/svg";
import { VerifyMethodModal } from "@/components/verificationModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, View } from "@idimma/rn-widget";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#013D25",
  text: "#0B0014",
  muted: "#85808A",
  border: "#E6E4E8",
  error: "#CB010B",
  screen: "#FFFFFF",
  inputBg: "#F7F7F8",
  googleBg: "#D2F1E4",
};

export default function SignupScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);
  const [hasConfirmBeenBlurred, setHasConfirmBeenBlurred] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<"sms" | "whatsapp">("sms");

  const PASSWORD_ERROR_MSG =
    "Your password must have at least 8 characters, a digit (0-9), an uppercase letter (A-Z), a special character ($,@), and match.";

  const validate = (val: string) => {
    if (val.length === 0) return false;

    const hasNumber = /\d/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasLength = val.length >= 8;

    return hasNumber && hasSpecial && hasLength && hasUpper;
  };

  const isPasswordValid = validate(password);
  const showRedError = hasBeenBlurred && !isPasswordValid;

  const passwordsMatch = password === confirmPassword;
  const showConfirmError =
    hasConfirmBeenBlurred && !passwordsMatch && confirmPassword.length > 0;
  const formIsValid = phone.length >= 10 && isPasswordValid && passwordsMatch;

  const handleSignup = (method: "sms" | "whatsapp") => {
    console.log("Creating account via:", method);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screen }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: COLORS.text,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Create your account
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: COLORS.muted,
              textAlign: "center",
            }}
          >
            Welcome to the future of wealth creation
          </Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={labelStyle}>Phone Number</Text>
          <PhoneInput
            value={phone}
            onPhoneChange={setPhone}
            placeholder="80298 83647 738"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={labelStyle}>Password</Text>
          <FormInput
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (hasBeenBlurred) setHasBeenBlurred(false);
            }}
            textContentType="oneTimeCode"
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => {
              setIsPasswordFocused(false);
              setHasBeenBlurred(true);
            }}
            error={showRedError ? PASSWORD_ERROR_MSG : undefined}
            leftContent={
              <PassWrd
                color={
                  showRedError
                    ? COLORS.error
                    : isPasswordFocused
                    ? COLORS.primary
                    : COLORS.muted
                }
                size={20}
              />
            }
            rightContent={
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.muted}
              />
            }
            rightClick={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
          />

          {password.length > 0 && !showRedError && (
            <Text
              style={{
                fontSize: 11,
                marginTop: 8,
                color: COLORS.primary,
                lineHeight: 16,
              }}
            >
              {PASSWORD_ERROR_MSG}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={labelStyle}>Confirm Password</Text>
          <FormInput
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              if (hasConfirmBeenBlurred) setHasConfirmBeenBlurred(false);
            }}
            textContentType="oneTimeCode"
            onBlur={() => setHasConfirmBeenBlurred(true)}
            error={showConfirmError ? "Passwords do not match" : undefined}
            leftContent={
              <PassWrd
                color={showConfirmError ? COLORS.error : COLORS.muted}
                size={20}
              />
            }
            rightContent={
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.muted}
              />
            }
            rightClick={() => setShowConfirmPassword(!showConfirmPassword)}
            secureTextEntry={!showConfirmPassword}
          />
        </View>

        <Text
          style={{
            fontSize: 12,
            color: COLORS.muted,
            lineHeight: 16,
            marginBottom: 24,
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          By clicking on the create account button, you agree to our{" "}
          <Text
            style={{ color: COLORS.primary, fontWeight: 400, fontSize: 12 }}
          >
            Privacy Policy
          </Text>{" "}
          and{" "}
          <Text
            style={{ color: COLORS.primary, fontWeight: 400, fontSize: 12 }}
          >
            Terms and Conditions
          </Text>
          .
        </Text>

        <BraneButton
          text="Create Account"
          onPress={() => setShowVerifyModal(true)}
          disabled={!formIsValid}
          height={52}
          radius={12}
          textColor={COLORS.googleBg}
          backgroundColor={COLORS.primary}
          style={{ marginBottom: 32 }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
          />
          <Text
            style={{
              marginHorizontal: 12,
              fontSize: 12,
              color: COLORS.muted,
              backgroundColor: COLORS.inputBg,
              paddingRight: 6,
              fontWeight: 500,
              paddingLeft: 6,
              paddingBottom: 2,
              borderRadius: 6,
            }}
          >
            or
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: COLORS.border }}
          />
        </View>

        <BraneButton
          text="Continue with Google"
          textColor={COLORS.primary}
          backgroundColor={COLORS.googleBg}
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
        <VerifyMethodModal
          visible={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          selectedMethod={verifyMethod}
          onSelect={(method) => {
            setVerifyMethod(method);
            handleSignup(method);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const labelStyle = {
  fontWeight: "400" as const,
  fontSize: 12,
  color: COLORS.muted,
  marginBottom: 6,
};
