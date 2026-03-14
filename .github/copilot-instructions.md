# GitHub Copilot Instructions — brrane-mobile

## Project Overview
Brrane Mobile is a React Native Expo financial super-app (wallet, stocks/BRACS, utilities, KYC). It is written in **TypeScript strict** mode with **Expo Router** file-based navigation.

---

## Tech Stack

| Concern | Library / Version |
|---|---|
| Framework | Expo ~55, React Native 0.83 |
| Language | TypeScript ~5.9 (strict) |
| Navigation | expo-router ~55 (file-based, typed routes enabled) |
| State | Redux Toolkit ^2.11 + redux-persist ^6 |
| Data fetching | SWR ^2.4 + Axios (via `BaseRequest`) |
| Forms | Formik ^2.4 + Yup ^1.7 / Zod ^4 |
| Toast | sonner-native ^0.23 |
| Icons | **iconsax-react-native ^0.0.8** (see guardrails) |
| Widgets | @idimma/rn-widget ^0.2 |

---

## Navigation Pattern

- **File-based routing** via `expo-router`. Screens live under `app/`.
- Tabs are defined in `app/(tabs)/_layout.tsx`.
- Auth screens live under `app/(auth)/`.
- Typed routes are **enabled** — use `router.push(path as any)` for dynamic segments.
- Push navigation: `router.push(...)`, replace: `router.replace(...)`, back: `router.back()`.

---

## State Management

- **Redux store** in `redux/store.ts` — all slices combined and persisted via `redux-persist`.
- **Auth slice** (`redux/slice/auth-slice.ts`) — holds `user`, `token`, `refreshToken`, `isLoading`, `loaderConfig`.
  - Uses `expo-secure-store` for token persistence (NOT AsyncStorage for tokens).
- **Themes slice** (`redux/slice/themeSlice.ts`) — light/dark preference.
- Access state with `useAppState()` or `useAppState('auth')`.
- Dispatch with the `dispatch` export from `redux/store.ts`.

---

## API Patterns

### BaseRequest
- Axios instance exported from `@/services` (default export).
- Auto-attaches `Authorization: Bearer <token>` from Redux state on every request.
- **401 handling**: queues requests, refreshes token via `/auth-service/refresh-token`, replays queue. On failure → `dispatch(logOut())` + `router.replace('/login')`.
- **Response interceptor** unwraps `response.data` — so `await BaseRequest.get(url)` returns the payload directly (not an AxiosResponse).

### Route constants
```ts
import { STOCKS_SERVICE, TRANSACTION_SERVICE, MOBILE_SERVICE, AUTH_SERVICE } from '@/services/routes';
```

### Error handling
```ts
import BaseRequest, { catchError } from '@/services';

try {
  const res: any = await BaseRequest.get(SOME_SERVICE.ENDPOINT);
} catch (error) {
  catchError(error); // shows sonner-native toast with parsed message
}
```

### Loading helpers
```ts
import { showAppLoader, hideAppLoader, showSuccess, showError } from '@/utils/helpers';

showAppLoader({ message: 'Please wait...' });
// ... async work ...
hideAppLoader();
showSuccess('Done!');
```

### Normalising list responses
```ts
const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};
```

---

## Component Patterns

### Screen shell
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Scheme = 'light' | 'dark';

export default function MyScreen() {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === 'dark' ? 'dark' : 'light';
  const C = Colors[scheme];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      {/* header → content */}
    </SafeAreaView>
  );
}
```

### Header structure
```tsx
import Back from '@/components/Back';
import { ThemedText } from '@/components/themed-text';
import { View } from '@idimma/rn-widget';

<View style={styles.header}>          {/* flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' */}
  <Back onPress={() => router.back()} />
  <ThemedText style={[styles.headerTitle, { color: C.text }]}>Title</ThemedText>
  <View style={{ width: 44 }} />      {/* spacer to centre title */}
</View>
```

### Colors object
```ts
// Always derive from scheme — never hardcode colors
const C = Colors[scheme === 'dark' ? 'dark' : 'light'];

// C.primary   → '#013D25'   (brand green)
// C.muted     → '#85808A'   (secondary text)
// C.background → '#FFFFFF' / '#151718'
// C.text       → '#0B0014' / '#FFFFFF'
// C.inputBg    → '#F7F7F8'
// C.border     → '#E6E4E8'
// C.error      → '#CB010B'
```

### BraneButton
```tsx
<BraneButton
  text="Continue"
  onPress={handlePress}
  backgroundColor={C.primary}   // '#013D25'
  textColor="#D2F1E4"
  height={52}
  radius={12}
  loading={isLoading}
/>
```

### FormInput
```tsx
<FormInput
  placeholder="Enter amount"
  keyboardType="number-pad"
  value={value}
  onChangeText={setValue}
  error={errorMessage}
  inputContainerStyle={{ height: 48, borderRadius: 8 }}
/>
```

### TransactionPinValidator
```tsx
<TransactionPinValidator
  visible={showPin}
  onClose={() => setShowPin(false)}
  onTransactionPinValidated={handlePinSuccess}
  onResetPin={() => router.push('/account/reset-transaction-pin')}
  onValidatePin={async (pin) => {
    try {
      await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, { pin });
      return true;
    } catch {
      return false;
    }
  }}
/>
```

### ThemedText
```tsx
// types: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'regular'
<ThemedText type="subtitle">Heading</ThemedText>
<ThemedText style={{ color: C.muted, fontSize: 12 }}>Body text</ThemedText>
```

---

## Key Guardrails

### ❌ NEVER use `@expo/vector-icons`
```tsx
// ❌ WRONG
import { Ionicons } from '@expo/vector-icons';

// ✅ CORRECT — use iconsax-react-native only
import { ArrowLeft, TickCircle, Eye, EyeSlash, Bank, Coin } from 'iconsax-react-native';
```

### ❌ NO HTML elements
React Native has no DOM. Use `View`, `Text`, `TouchableOpacity`, `FlatList`, etc.

### ✅ Use `@/` alias — NO relative imports
```tsx
// ❌ WRONG
import Back from '../../components/Back';

// ✅ CORRECT
import Back from '@/components/Back';
```

### ✅ Never hardcode colors — always use `Colors[scheme]`
```tsx
// ❌ WRONG
style={{ color: '#013D25' }}

// ✅ CORRECT
style={{ color: C.primary }}
```

### ✅ Keyboard Avoiding View for forms
```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
```

### ✅ Pull-to-refresh pattern
```tsx
import { RefreshControl, ScrollView } from 'react-native';
<ScrollView
  refreshControl={
    <RefreshControl refreshing={isRefreshing} onRefresh={() => fetchData(true)} />
  }
/>
```

---

## Folder Structure

```
app/
  (auth)/           login, signup, forgot-password
  (tabs)/           bottom tabs: index, portfolio, transactions, utilities, (account)
  account/          account settings screens
  add-funds/        fund wallet screens
  kyc/              KYC flow screens
  portfolio/        stock company detail, checkout
  send-money/       send money flow
  stock/            stock marketplace, portfolio, swap, withdraw, breakdown
  wallet/           wallet withdraw screens
  transaction/      transaction detail
components/         shared components
constants/          colors.ts, theme.ts
hooks/              use-color-scheme, use-theme-color, use-formik
redux/              store, slices (auth, themes, bracs, intents, etc.)
services/           BaseRequest (axios), routes.ts
utils/              helpers.tsx, brac.ts, secureStore.ts, token.tsx
```

---

## Common Patterns

### Multi-stage screens
Use a `stage` state variable (`'form' | 'preview' | 'pin' | 'success'`) and render different content per stage. Back button should navigate to the previous stage, not `router.back()`.

### Fetching on mount
```tsx
const fetchData = useCallback(async (refresh = false) => {
  if (refresh) setIsRefreshing(true);
  else setIsLoading(true);
  try {
    const res: any = await BaseRequest.get(ENDPOINT);
    setData(toArray(res));
  } catch (error) {
    catchError(error);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
}, []);

useEffect(() => { fetchData(); }, [fetchData]);
```

### Price formatting
```ts
import { priceFormatter } from '@/utils/helpers';
priceFormatter(amount, 2); // → '₦1,234.56'
```
