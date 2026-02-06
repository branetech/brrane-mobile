import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setNavigation } from "@/services";
import {routesToPrefetch} from "@/services/routes";

const usePrefetch = () => {
  const { prefetch, push } = useRouter();
  useEffect(() => {
    routesToPrefetch.forEach((route) => prefetch(route));
    setNavigation(push);
  }, [prefetch, push]);

};
export default usePrefetch;