import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { PhoneInput } from "@/components/phone-input";
import { PassWrd } from "@/components/svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "@idimma/rn-widget";
import { router } from "expo-router";
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
  fingerBorder: "#D3EBE1"
};

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);

  const PASSWORD_ERROR_MSG =
    "Your password must have at least 8 character, a digit (0-9), an uppercase letter(A), a special character ($,@) and match.";

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
  const formIsValid = phone.length >= 10 && isPasswordValid;

  const handleLogin = () => {
    console.log("Logging in...");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.screen }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: COLORS.text,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Welcome back!
          </Text>
          {/* <Text
            style={{ fontSize: 12, color: COLORS.muted, textAlign: "center", fontWeight: 400 }}
          >
            Lets get back from where we stop
          </Text> */}
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={labelStyle}>Phone Number</Text>
          <PhoneInput
            value={phone}
            onPhoneChange={setPhone}
            placeholder="8092738 223776"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Password</Text>
          <FormInput
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (hasBeenBlurred) setHasBeenBlurred(false);
            }}
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

        <TouchableOpacity style={{ marginBottom: 32 }}>
          <Text
            style={{ fontSize: 12, fontWeight: "500", color: COLORS.primary }}
          >
            I Forgot My Password
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <BraneButton
            text="Login"
            onPress={handleLogin}
            disabled={!formIsValid}
            textColor={COLORS.googleBg}
            height={52}
            radius={12}
            backgroundColor={COLORS.primary}
            style={{ flex: 1, marginRight: 12 }}
          />
          <TouchableOpacity
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: COLORS.fingerBorder,
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.4
            }}
          >
             <Image
              source={require("@/assets/images/finger-scan.png")}
              style={{ width: 32, height: 32 }}
            />
            {/* <Ionicons name="scan-outline" size={28} color={COLORS.muted} /> */}
          </TouchableOpacity>
        </View>

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
              paddingLeft: 6,
              fontWeight: 500,
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

        <View style={{ marginTop: 32, marginBottom: 20, alignItems: "center" }}>
          <Text
            style={{ fontSize: 12, color: COLORS.muted, fontWeight: "400" }}
          >
            Are you a new user?{" "}
            <Text
              style={{ color: COLORS.primary, fontWeight: "400", fontSize: 12 }}
              onPress={() => router.replace("/signup")}
            >
              Create Account
            </Text>
          </Text>
        </View>

        <View
          style={{ marginTop: "auto", marginBottom: 20, alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 12, color: COLORS.muted, fontWeight: "400" }}
          >
            Version 1.0.6
          </Text>
        </View>
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
