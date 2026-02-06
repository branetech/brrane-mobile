import {useAppState} from "@/redux/store";
import {useDispatch} from "react-redux";
import {setUser} from "@/redux/slice/auth-slice";
import {useRequest} from "@/services/useRequest";
import {AUTH_SERVICE, TRANSACTION_SERVICE} from "@/services/routes";
import {omit} from "lodash";

export const useUserListener = () => {

  const {user, contactChecker} = useAppState();
  const dispatch = useDispatch();

  const updateUser = (data: any) => {
    if (typeof data === 'object') {
      try {
        dispatch(setUser(Object.assign(omit(user, ['beneficiaries']), data)));
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.log("failed ", [e, data, user])
      }
    }
  }

  useRequest(AUTH_SERVICE.PROFILE, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    revalidateOnReconnect: false,
    onDone: ({data}) => updateUser(data)
  });

  useRequest(TRANSACTION_SERVICE.BENEFICIARIES, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    onDone: ({data}) => updateUser({beneficiaries: Array.from(data)})
  });
}
