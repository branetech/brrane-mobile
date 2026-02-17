import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { useReduxState } from "@/redux/useReduxState";
import OTP from "@/components/forgot-password/otp";
import { SignupForm } from "@/components/sign-up/signupForm";

type Page = "signup" | "otp";

export default function SignupScreen() {
  const [page, setPage] = useReduxState<Page>("signup", "signupPage");
  const [otp, setOtp] = useReduxState("", "signupOtp");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<"sms" | "whatsapp">("sms");

  const handleSubmitSignup = async (data: any) => {
    try {
      setIsLoading(true);
      // await API.signup({ ...data, verifyMethod });
      console.log("Signup initiated with:", data);
      setShowVerifyModal(false);
      setPage("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
    console.log("OTP Entered:", otpValue);
    // await API.verifyOtp(otpValue);
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      // await API.resendOtp();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {page === "signup" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SignupForm
            onSubmit={handleSubmitSignup}
            openVerifyModal={showVerifyModal}
            onCloseVerifyModal={() => setShowVerifyModal(false)}
            onSelectMethod={(method: any) => {
              setVerifyMethod(method);
            }}
            verifyMethod={verifyMethod}
            setVerifyMethod={setVerifyMethod}
          />
        </KeyboardAvoidingView>
      )}

      {page === "otp" && (
        <OTP
          otp={otp}
          handleOtpChange={setOtp}
          onSubmitEmail={handleOTPComplete}
          back={() => setPage("signup")}
          isResending={isResending}
          requestOtp={handleResendOtp}
          isLoading={isLoading}
          isDisabled={false}
        />
      )}
    </SafeAreaView>
  );
}
