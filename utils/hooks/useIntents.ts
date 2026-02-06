import {useEffect} from "react";
import Intent from "@/utils/Intent";

export const useIntents = () => {
  useEffect(() => {
    Intent.init();
  }, []);

}