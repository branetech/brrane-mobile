import { IUSER } from "@/utils";
import { ILoaderConfig } from "@/utils/helpers";
import { createSlice } from "@reduxjs/toolkit";
import { findKey } from "lodash";

function parseUserInfo(payload: IUSER): IUSER {
  let user: IUSER | any = {}
  if (typeof (payload) == 'object') user = { ...payload }

  const photo = payload?.identityVerification?.passportPhotographVerification?.status || ''
  const bank = payload?.identityVerification?.bankAccountVerification?.status || ''
  const bvn = payload?.identityVerification?.bvnVerification?.status || ''
  const location = payload?.identityVerification?.locationVerification?.status || ''
  const drivers = payload?.identityVerification?.driversLicenseVerification?.status || ''
  const voters = payload?.identityVerification?.votersIdVerification?.status || ''
  const intl = payload?.identityVerification?.passportVerification?.status || ''
  const nin = payload?.identityVerification?.ninVerification?.status || ''
  const hasCompleted = (status: string) => status === 'completed';

  const identity = hasCompleted(nin) || hasCompleted(intl) || hasCompleted(drivers) || hasCompleted(voters);
  // ID Verification NIN, INTL, Drivers, Voters
  user.hasIdentity = identity
  user.identity = findKey({
    "NIN": hasCompleted(nin),
    "Internation Passport": hasCompleted(intl),
    "Voters Card": hasCompleted(voters),
    "Drivers Licence": hasCompleted(voters)
  }, (value: boolean) => value)

  user.hasNextOfKin = !!payload?.nextOfKin?.firstName
  user.hasEmail = !!payload?.email
  user.hasBvn = hasCompleted(bvn);
  user.hasBank = hasCompleted(bank);
  user.hasPhoto = hasCompleted(photo);
  user.hasLocation = hasCompleted(location);
  user.location = hasCompleted(location);
  user.hasPhone = !!payload?.phone
  user.hasUsername = !!payload?.username
  user.hasName = !!payload?.firstName && !!payload?.lastName && !!payload?.university
  user.locationStatus = location;
  user.photoStatus = photo;
  user.hasBanking = user?.beneficiaries && !!user?.beneficiaries?.length;

  user.identityKyc = identity && user.hasPhoto && user.hasLocation;
  user.kycDone = bvn && user.hasName && user.identiyKyc && user?.hasBanking;
  user.name = `${payload?.firstName || ''} ${payload?.lastName || ''}`;

  return user as IUSER;
}

const { reducer, actions } = createSlice({
  name: "auth",
  initialState: {
    user: null,
    contactChecker: '',
    token: null,
    loaderConfig: {
      message: 'Please wait...',
      bg: '#FFFFFF',
    },
    isLoggedIn: false,
    showTab: false,
    isLoading: false,
    insufficientFundsModal: false,
    wallet: null,
    config: null,
    refreshToken: null,
    otp: null,
    phone: null,
    onContactChecked: null,
    checkouts: [],
  } as Auth,
  reducers: {
    auth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.refreshToken = action.payload.refreshToken;
      state.otp = action.payload.otp;
      state.phone = action.payload.phone;
      setCookie('brane-token', token)
    },
    setUser: (state, action) => {
      state.user = parseUserInfo(action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = !!action.payload;
      setCookie('brane-token', action.payload)
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      setCookie('brane-token', '')
    },
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoaderConfig: (state, action) => {
      state.loaderConfig = action.payload;
      state.isLoading = true;
    },
    onShowTab: (state) => {
      state.showTab = true;
    },
    onHideTab: (state) => {
      state.showTab = false;
    },
    onShowInsFunds: (state) => {
      state.insufficientFundsModal = true;
    },
    onHideInsFunds: (state) => {
      state.insufficientFundsModal = false;
    },
    onAddToCheckouts: (state, action) => {
      const checkouts = state?.checkouts || []
      const asset = action.payload;
      const exists = checkouts.map(item => item.tickerSymbol).includes(action.payload.tickerSymbol)
      if (!exists) {
        const stockPrice = (asset?.currentPrice || 0);
        const totalCharge = 0.09630661039 * stockPrice;
        const order = {
          quantity: 1,
          netPayable: stockPrice + totalCharge,
          tickerSymbol: asset?.tickerSymbol || '',
          stockPrice,
          totalCharge,
          brokerName: '',
          assetClass: asset?.assetClass || 'stocks',
          logo: asset?.logo || '',
          companyName: asset?.companyName || ''
        };
        checkouts.push(order);
        state.checkouts = checkouts;
      }
    },
    onUpdateCheckouts: (state, action) => {
      const checkouts = state?.checkouts || []
      const asset = action.payload;
      state.checkouts = checkouts.map((item) => {
        if (item.tickerSymbol === asset.tickerSymbol) return asset;
        return item;
      });
    },
    onRemoveFromCheckouts: (state, action) => {
      const checkouts = state?.checkouts || []
      state.checkouts = [...checkouts.filter(item => item.tickerSymbol !== action.payload)]
    },
    onClearCheckouts: (state) => {
      state.checkouts = [];
    },
    setAppState(state: any, action) {
      const payload = action?.payload
      if (typeof (payload) === 'object') {
        Object.keys(payload).forEach((key) => {
          if (key === 'user') {
            state[key] = parseUserInfo(payload[key])
          } else if (key === 'contactChecker') {
            state[key] = payload[key]
            if (payload[key] === '') state['onContactChecked'] = null
          } else {
            state[key] = payload[key]
          }
        })
      }
    },

    setConfig: (state, action) => {
      state.config = action.payload;
    },
  },
});
export default reducer;

export const {
  auth,
  logOut,
  setRefreshToken,
  setToken,
  setLoader,
  setUser,
  setAppState,
  setLoaderConfig,
  onHideInsFunds,
  onShowInsFunds,
  onHideTab,
  onShowTab,
  setConfig,
  onRemoveFromCheckouts,
  onClearCheckouts,
  onAddToCheckouts,
  onUpdateCheckouts
} = actions;

export interface Auth {
  user: IUSER | null;
  token: string | null;
  isLoggedIn: boolean;
  insufficientFundsModal: boolean;
  isLoading: boolean | false;
  loaderConfig: ILoaderConfig;
  config: any;
  otp: string | null;
  phone: string | null;
  showTab: boolean | false;
  refreshToken: string | null;
  contactChecker: string | null;
  checkouts: AssetCheckout[];
  onContactChecked: null | ((contact?: string) => void);
}
interface AssetCheckout {
  // For Stocks
  tickerSymbol: string;
  assetClass: string;
  brokerName: string;
  quantity: number;
  netPayable: number;
  stockPrice?: number;
  totalCharge?: number;

  // For Investment Plans
  days?: string;
  amount?: number;
  interestRate?: number;
  planName?: string;
  maturityDate?: string;
  // For Gold
  logo: string;
  companyName: string;
}

function setCookie(name: string, value: string, exDays: number = 100) {
  const d = new Date();
  d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  if (typeof window !== "undefined") {
    window.document.cookie = `${name}=${value};${expires};path=/`;
  }
}
