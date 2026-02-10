import { PhoneInput } from "@/components/phone-input";
import { FontAwesome } from "@expo/vector-icons";
import { Text, Touch, View } from "@idimma/rn-widget";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const [phone, setPhone] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"sms" | "whatsapp">("sms");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10">

        {/* Logo */}
        <View className="items-center mb-12">
          <Text className="text-[13px] text-[#9CA3AF] mb-1">
            Welcome to
          </Text>
          <Text className="text-[36px] font-extrabold text-[#3B5120] tracking-[-1px]">
            brane
          </Text>
        </View>

        {/* Title */}
        <View className="mb-6">
          <Text className="text-[20px] font-semibold text-[#111827] mb-1">
            Create your account
          </Text>
          <Text className="text-[13px] text-[#9CA3AF]">
            Verify phone number to create your account
          </Text>
        </View>

        {/* Phone Input */}
        <View className="mb-8">
          <PhoneInput
            value={phone}
            onPhoneChange={setPhone}
            placeholder="8130000000"
          />
        </View>

        {/* Verification Card */}
        <View
          className="bg-white rounded-[24px] p-5 mb-8 border border-[#F3F4F6]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.06,
            shadowRadius: 14,
            elevation: 6,
          }}
        >
          <Text className="text-[12px] text-[#9CA3AF] mb-4">
            How would you like to verify your phone number
          </Text>

          {/* WhatsApp */}
          <Touch
            onPress={() => setVerificationMethod("whatsapp")}
            className={`flex-row items-center justify-between rounded-2xl px-4 py-4 mb-3 border ${
              verificationMethod === "whatsapp"
                ? "border-[#3B5120]"
                : "border-[#F3F4F6]"
            }`}
          >
            <View className="flex-1 pr-3">
              <Text className="text-[14px] font-semibold text-[#111827]">
                Via WhatsApp
              </Text>
              <Text className="text-[12px] text-[#9CA3AF] mt-1">
                You will get a verification code on WhatsApp
              </Text>
            </View>

            <View
              className={`w-5 h-5 rounded-full border items-center justify-center ${
                verificationMethod === "whatsapp"
                  ? "border-[#3B5120]"
                  : "border-[#D1D5DB]"
              }`}
            >
              {verificationMethod === "whatsapp" && (
                <View className="w-2.5 h-2.5 rounded-full bg-[#3B5120]" />
              )}
            </View>
          </Touch>

          {/* SMS */}
          <Touch
            onPress={() => setVerificationMethod("sms")}
            className={`flex-row items-center justify-between rounded-2xl px-4 py-4 border ${
              verificationMethod === "sms"
                ? "border-[#3B5120]"
                : "border-[#F3F4F6]"
            }`}
          >
            <View className="flex-1 pr-3">
              <Text className="text-[14px] font-semibold text-[#111827]">
                Via SMS
              </Text>
              <Text className="text-[12px] text-[#9CA3AF] mt-1">
                You will get a verification code via SMS
              </Text>
            </View>

            <View
              className={`w-5 h-5 rounded-full border items-center justify-center ${
                verificationMethod === "sms"
                  ? "border-[#3B5120]"
                  : "border-[#D1D5DB]"
              }`}
            >
              {verificationMethod === "sms" && (
                <View className="w-2.5 h-2.5 rounded-full bg-[#3B5120]" />
              )}
            </View>
          </Touch>
        </View>

        {/* Social Buttons */}
        <View className="gap-y-3">
          <Touch className="h-14 bg-[#E7F0E3] rounded-[14px] flex-row items-center justify-center">
            <FontAwesome
              name="facebook-official"
              size={18}
              color="#1877F2"
              style={{ marginRight: 10 }}
            />
            <Text className="text-[#3B5120] font-semibold text-[14px]">
              Continue with Facebook
            </Text>
          </Touch>

          <Touch className="h-14 bg-[#E7F0E3] rounded-[14px] flex-row items-center justify-center">
            <FontAwesome
              name="apple"
              size={18}
              color="#000"
              style={{ marginRight: 10 }}
            />
            <Text className="text-[#3B5120] font-semibold text-[14px]">
              Continue with Apple
            </Text>
          </Touch>
        </View>

      </View>
    </SafeAreaView>
  );
}
