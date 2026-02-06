// 'use client'
import { onShowInsFunds, setLoader, setLoaderConfig } from "@/redux/slice/auth-slice";
import store from "@/redux/store";
import { ITransactionDetail } from "@/utils/index";
import universities from "@/utils/universities.json";
import { ArgsProps } from "antd/es/notification/interface";
import { format } from "date-fns";
import Image from "next/image";
import React, { CSSProperties } from "react";
import { toast } from "sonner";
import { getEarnedBracs } from "./brac";


export const getInitials = (name: string | undefined | null): string => ((name || "").match(/\b\w/g) || []).join('').toUpperCase();

export const getSchoolInitials = (name: string): string => {
  const school = universities?.universities?.find((s) => s.name === name) || null
  return String(school?.code || getInitials(name)).toUpperCase();
};

Number.prototype.format = function (n: number, x: number) {
  let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return Number(this).toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


export const priceFormatter = (value?: number, dec = 0): string => `₦${Number(value || 0).format(dec)}`

// export const showSuccess = (description: string | React.ReactNode, options: any = {}, message: string = "Success",) => showMessage(message, description, "success", options);
// export const showInfo = (description: string | React.ReactNode, options = {}, message: string = "Information",) => showMessage(message, description, "info", options);
// export const showWarning = (description: string | React.ReactNode, options: ArgsProps | any = {}, message: string = "Warning") => showMessage(message, description, "warning", options);
// export const showError = (description: string | React.ReactNode, options: ArgsProps | {} = {}, message: string = "Error") => showMessage(message, description, "error", options);
//
// type NotificationType = "success" | "info" | "warning" | "error";
//
// export const showMessage = (_: string, description: string | React.ReactNode, type: NotificationType, options: ArgsProps | {} = {}) => {
//   notification[type]({
//     message: '',
//     description,
//     icon: null,
//     placement: 'top', ...options
//   });
// };



export const showSuccess = (description: string | React.ReactNode, options: ArgsProps = { message: '' }, message: string = 'Success') => showMessage(message, description, 'success', options);
export const showInfo = (description: string | React.ReactNode, options: ArgsProps = { message: '' }, message: string = 'Information') => showMessage(message, description, 'info', options);
export const showWarning = (description: string | React.ReactNode, options: ArgsProps = { message: '' }, message: string = 'Warning') => showMessage(message, description, 'warning', options);
export const showError = (description: string | React.ReactNode, options: ArgsProps = { message: '' }, message: string = 'Error') => showMessage(message, description, 'error', options);

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const showMessage = (_: string, description: string | React.ReactNode, type: NotificationType, options: ArgsProps = { message: '' }) => {
  //@ts-ignore
  toast[type](description, { richColors: true, closable: true, action: ['decorators'], dismissible: true, ...options, })
};

export interface ILoaderConfig {
  message: string,
  spinnerColor?: CSSProperties['color'],
  style?: CSSProperties | undefined;
  textStyle?: CSSProperties | undefined;
}

export const showAppLoader = (config: ILoaderConfig = {
  message: "Please wait...",
  spinnerColor: "#013D25",
  style: {},
  textStyle: {}
}) => {
  store.dispatch(setLoaderConfig(config));
};

export const hideAppLoader = () => {
  store.dispatch(setLoaderConfig({
    message: "Please wait...",
    spinnerColor: "#013D25",
    style: {},
    textStyle: {}
  }));
  store.dispatch(setLoader(false));
};

export const onShowInsufficientFunds = () => {
  store.dispatch(onShowInsFunds());
}


export function formatPhoneNumber(phoneNumber: string): string {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  if (cleanedNumber.startsWith('234')) return `+${cleanedNumber.replace('+', '')}`;
  if (cleanedNumber.startsWith('0')) return `+234${cleanedNumber.slice(1).replace('+', '')}`;
  return `+${cleanedNumber.replace('+', '').replaceAll(' ', '')}`;
}

export const getNetworkIcon = (ticker: string, size: number = 40) => {
  if (ticker?.toLowerCase().includes('mtn')) {
    return <Image src='/network/mtn.svg' alt='MTN' width={size} height={size} />;
  }
  if (ticker?.toLowerCase().includes('glo')) {
    return <Image src='/network/glo.svg' alt='GLO' width={size} height={size} />;
  }
  if (ticker?.toLowerCase().includes('9mobile')) {
    return <Image src='/network/9mobile.svg' alt='9mobile' width={size} height={size} />;
  }
  if (ticker?.toLowerCase().includes('airtel')) {
    return <Image src='/network/airtel.svg' alt='Airtel' width={size} height={size} />;
  }
  return null;// <img src={ticker} alt='Airtel' width={size} height={size} />;;
};

export const pluralize = (count: number, noun: string, suffix = 's', pluralForm?: string) =>
  `${new Intl.NumberFormat().format(count)} ${count === 1 || count === 0 ? noun : pluralForm || noun + suffix}`;

export const pluralizeString = (count: number, noun: string, suffix = 's', pluralForm?: string) =>
  `${count === 1 || count === 0 ? noun : pluralForm || noun + suffix}`;

export const formatNumber = (number: number | string | undefined) => Number(number || 0).format(0);

export const convertCamelCaseToReadable = (str?: string): string => {
  if (!str) return "";
  const spaced = str.replace(/([A-Z])/g, ' $1');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const toPascalCase = (str?: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(\w)(\w*)/g, (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase())
    .replace(/\s+/g, ' ');
};
export const collection = (collect: any) => Array.isArray(collect) ? collect : [];


export const formatDate = (dateString: any, formatStr = "MMMM dd, yyyy | hh:mm a") => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return format(date, formatStr);
    } else {
      return "Invalid Date";
    }
  } catch (error) {
    return "Error";
  }
};




export const parseTransaction = (transaction: ITransactionDetail) => {
  const wasSuccessful = String(transaction?.status).toLowerCase().includes('success');

  const service = transaction?.serviceId ? `(${String(transaction?.serviceId).toUpperCase()})` : ''
  const amount = Number(transaction?.amount || 0)
  const {
    bracValue, rate, commissionVal, paymentGatewayFees, allocatable:rebate
  }  = getEarnedBracs({
    amount,
    serviceType: transaction?.transactionType?.toLowerCase() as any || 'brane',
    serviceId: transaction?.serviceId
  })
  

  if (transaction) {
    transaction.timestamp = new Date(String(transaction?.createdAt)).getTime();
    transaction.date = formatDate(String(transaction?.createdAt), "MMMM dd, yyyy");
    transaction.time = formatDate(String(transaction?.createdAt), "hh:mm:ss a");
    transaction.points = wasSuccessful ? bracValue : 0;
    transaction.paymentGatewayFees = wasSuccessful ? paymentGatewayFees : 0;
    transaction.service = service;
    transaction.rebate = wasSuccessful ? Number(rebate) : 0;
    transaction.rate = wasSuccessful ? Number(rate) : 0;

    if (String(transaction?.transactionType).toLowerCase().includes('stock')) {
      transaction.amount = Number(transaction.rebateAmount);
    }
  }
  return transaction || {};
}


export const formatTimestampToHumanReadable = (timestamp: number) => {
  const inputDate = new Date(timestamp);
  const currentDate = new Date();

  // Calculate time differences
  //@ts-ignore
  const diffTime = currentDate - inputDate; // Difference in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Difference in days
  const inputDayOfWeek = inputDate.getDay(); // Day of the week (0 for Sunday, 1 for Monday, etc.)
  const currentDayOfWeek = currentDate.getDay(); // Current day of the week

  // Helper to get day of the week in string format
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Today's date (without time)
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  // Date calculations
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Last week's same day
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  // Formatting rules
  if (inputDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (inputDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else if (inputDate.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else if (inputDate > lastWeek && inputDayOfWeek === currentDayOfWeek - 1) {
    return `Last ${daysOfWeek[inputDayOfWeek]}`;
  } else if (inputDate < today && inputDate >= lastWeek) {
    return `Last ${daysOfWeek[inputDayOfWeek]}`;
  } else if (inputDate > today && inputDate < tomorrow) {
    return daysOfWeek[inputDayOfWeek];
  } else {
    return inputDate.toLocaleDateString(); // Return as date string for other cases
  }
};


export function calculatePercentageChange(oldValue: number, newValue: number) {
  if (oldValue === 0) return 0;
  const change = newValue - oldValue;
  return (change / oldValue) * 100;
}

export const parseTicker = (oldValue: number, newValue: number) => {
  if (oldValue === 0 || !oldValue) return '';
  const change = newValue - oldValue;
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return ''
};

function getSuffix(day: number): string {
  const suffixes = new Map([
    [1, "st"], [2, "nd"], [3, "rd"]
  ]);

  if (day % 10 >= 4 || day === 11 || day === 12 || day === 13) {
    return "th";
  }
  return suffixes.get(day % 10) || "th";
}

export const formatDateWithSuffix = (dateStr: string): string => {
  try {
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString("default", { month: "long" });
      const suffix = getSuffix(day);

      return `${month} ${day}${suffix}`;
    } else {
      return "Invalid Date";
    }
  } catch (error) {
    return "Error";
  }
}

export function formatNumberToDecimal(value: number): string {
  return value?.toFixed(2);
};

export function formatPercentageToDecimal(value: number): string {
  return value?.toFixed(2) + '%';
};

export function calculateBracsPercentage(part: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  const percentage = (part / total);
  return parseFloat(percentage.toFixed(3)); // round to 2 decimal places
}

export function calculatePercentage(percent: number, total: number): number {
  if (total === 0 || percent < 0) return 0;
  const percentage = (percent / 100) * total;
  return parseFloat(percentage.toFixed(3)); // round to 2 decimal places
}


export function getFirstWord(text: string): string {
  const noHyphens = text.replace(/-/g, " ");
  return noHyphens.split(" ")[0];
}


const toSnakeCase = (value: string) => value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const toCamelCase = (s: string) => s.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('_', '').replace(' ', ''));

const isArray = (value: unknown) => Array.isArray(value);

const isObject = (value: unknown) => value === Object(value) && !isArray(value) && typeof value !== 'function';

export const convertKeysCase = (o: unknown, type?: caseType): object => {
  if (isObject(o)) {
    let value = {};
    Object.keys(o as object).forEach((k) => {
      const val = o as { [key: string]: string | object | number | [] };
      value = { ...value, [type === 'snakeCase' ? toSnakeCase(k) : toCamelCase(k)]: convertKeysCase(val[k], type), };
    });
    return value;
  } else if (isArray(o)) {
    const value = o as Array<unknown>;
    return value.map((i) => convertKeysCase(i as object, type));
  }

  return o as any;
};

export const objectToFormData = (obj: Record<string, any>, formData: FormData = new FormData(), parentKey?: string): FormData => {
  if (obj && typeof obj === 'object' && !(obj instanceof File)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        formData.append(fullKey, value);
      } else if (value instanceof Date) {
        formData.append(fullKey, value.toISOString());
      } else if (Array.isArray(value)) {
        // value.forEach((item, index) => {
        // 	objectToFormData({ [`${key}`]: item }, formData, parentKey);
        // });
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            // Recursively handle nested objects in arrays
            objectToFormData(item, formData, `${fullKey}[${index}]`);
          } else {
            formData.append(`${fullKey}[${index}]`, item?.toString() || '');
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        objectToFormData(value, formData, fullKey);
      } else {
        formData.append(fullKey, value?.toString() || '');
      }
    });
  }
  return formData;
};
export type caseType = 'snakeCase' | 'camelCase';

export const tenureInDays = (tenure: string) => {
  const [value, unit] = tenure.split(" ");
  switch (unit) {
    case "months":
      return parseInt(value) * 30;
    case "years":
      return parseInt(value) * 365;
    case "days":
      return parseInt(value);
    default:
      return 0;
  }
};

export const calculateRemainingDays = (maturityDate: string) => {
  const maturityDateTime = new Date(maturityDate).getTime();
  const currentTime = new Date().getTime();
  const remainingTime = maturityDateTime - currentTime;
  const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));
  return remainingDays;
};
