import {useEffect, useMemo, useState} from "react";
import {useRequest} from "@/services/useRequest";
import {collection, parseTransaction} from "@/utils/helpers";
import {ITransactionDetail} from "@/utils/index";

let interval: any;
export const useCountDown = (props: {
  seconds: number | 60;
  interval: number;
  autoStart?: boolean;
}) => {
  const [seconds, setSeconds] = useState(props?.seconds);

  const onStartTimer = (value?: number) => {
    value && setSeconds(value);

    interval = setInterval(() => {
      setSeconds((sec) => {
        if (sec == 1) {
          clearInterval(interval);
          interval = null;
        }
        return sec - 1;
      });
    }, props?.interval);

    return interval;
  };

  useEffect(() => {
    if (props?.autoStart) onStartTimer();
    return () => {
      if (!!interval) clearInterval(interval);
    };
  }, []);

  return {seconds, onStartTimer};
};

export const useBoolean = (_default: boolean = false) => {
  const [open, setOpen] = useState(_default);
  return {
    open,
    setOpen,
    toggle: () => {
      setOpen(!open);
    },
    onClose: () => {
      setOpen(false);
    },
    onOpen: () => {
      setOpen(true);
    },
  };
};
export type FunctionType = (e?: any) => void;

type BooleansHook = [
  boolean, // The current boolean state
  FunctionType, // Function to set the state to true
  () => void, // Function to set the state to false
  () => void, // Function to toggle the state
  (state: boolean) => void // Function to set the state to a specific boolean value
];
export const useBooleans = (_default: boolean = false) => {
  const [open, setOpen] = useState(_default);
  return [
    open,
    () => setOpen(() => true),
    () => setOpen(false),
    () => setOpen(!open),
    setOpen,
  ] as BooleansHook;
};


export const getTodaysDate = () => new Date().toISOString().slice(0, 10);

export const isNull = (value: any) =>
  value === null || value === undefined || value === "" || value === "null";

export const useMounted = () => {
  const {open, onOpen, onClose} = useBoolean();
  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    };
  }, []);
  return open;
};
export const tickerToNetwork = (ticker: string) => {
  const lower = `${ticker}`.toLowerCase();
  if (lower.includes('mtn')) return "mtn"
  if (lower.includes('glo')) return "glo"
  if (lower.includes('airtel')) return "airtel"
  if (lower.includes('etisalat') || lower.includes('9mobile')) return "9mobile"
  return lower;
}

export const networkToTicker = (serviceId: string): string => {
  const lower = `${serviceId}`.toLowerCase();
  if (lower.includes('mtn')) return "MTNN"
  if (lower.includes('glo')) return "GLO"
  if (lower.includes('airtel')) return "AIRTELAFRI"
  if (lower.includes('etisalat') || lower.includes('9mobile')) return "9MOBILE"
  if (lower.includes('smile')) return "SMILE"
  if (lower.includes('spectranet')) return "SPECTRANET"
  return `${serviceId}`.toUpperCase();
};
