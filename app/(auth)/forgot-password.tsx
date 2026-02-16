import ForgotPassword from "@/components/forgot-password";
import ConfirmPassword from "@/components/forgot-password/confirm-password";
import OTP from "@/components/forgot-password/otp";
import { useReduxState } from "@/redux/useReduxState";
import { View } from "@idimma/rn-widget";
import { useState } from "react";

type Page = "forgotPassword" | "otp" | "createPassword";

export default function ForgotPasswordScreen() {
  const [page, setPage] = useReduxState<Page>("forgotPassword", "forgotPassword");
  const [otp, setOtp] = useReduxState("otp-page", "");
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      // await yourApi.sendResetEmail(data.email);
      setPage("otp");
    } catch (error) {
      console.error("Failed to send reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
    setPage("createPassword");
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      // await yourApi.resendOtp();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordReset = async (data: { password: string; confirmPassword: string }) => {
    try {
      setIsLoading(true);
      // await yourApi.resetPassword({ otp, ...data });
      console.log("Resetting password with otp:", otp, "and data:", data);
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View flex>
      {page === "forgotPassword" && (
        <ForgotPassword
          onSubmitEmail={handleEmailSubmit}
          isLoading={isLoading}
        />
      )}
      {page === "otp" && (
        <OTP
          isLoading={isLoading}
          onSubmitEmail={handleOTPComplete}
          isDisabled={false}
          back={() => setPage("forgotPassword")}
          handleOtpChange={setOtp}
          otp={otp}
          isResending={isResending}
          requestOtp={handleResendOtp}
        />
      )}
      {page === "createPassword" && (
        <ConfirmPassword
          onSubmitEmail={handlePasswordReset}
          isLoading={isLoading}
          back={() => setPage("otp")}
        />
      )}
    </View>
  );
}