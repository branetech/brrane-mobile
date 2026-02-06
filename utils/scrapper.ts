 import {STOCKS_DETAILS} from "@/utils/constants";
 import {useEffect} from "react";
import {dispatch} from "@/redux/store";
import {setAppState} from "@/redux/slice/auth-slice";
import axios from "axios";
import {calculatePercentageChange, parseTicker} from "@/utils/helpers";



export const extractTableFromHTML = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  // const tables = doc.querySelectorAll('table');
  // const allTableData: any[] = [];
  const firstQuote = doc.querySelector('.d-dquote-x3');
  const firstQuoteTime = doc.querySelector('.d-dquote-time');
  const price = firstQuote ? firstQuote?.textContent?.trim() || '' : ''
  const time = firstQuoteTime ? firstQuoteTime?.textContent?.trim() || '' : ''


  // tables.forEach(table => {
  //   const tableData: any[] = [];
  //   const rows = table.querySelectorAll('tr');
  //   rows.forEach(row => {
  //     const rowData: any[] = [];
  //     const cells = row.querySelectorAll('td, th');
  //     cells.forEach((cell: Element) => rowData.push(cell?.textContent?.trim()));
  //     tableData.push(rowData);
  //   });
  //   allTableData.push(tableData);
  // });


  return {price, time: time.replaceAll(' All data delayed at least 30 minutes', '').replaceAll('As at ', '')};
};


export const getHtml = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return ''
    return await response.text()
  } catch (error) {
    return ''
  }
};

export const getStockPrice = async (symbol: string = 'MTNN') => {
  if (symbol.toLowerCase().includes('airtel')) symbol = 'AIRTELAFRI'
  else symbol = 'MTNN'
  const html = await getHtml(`https://ngxgroup.com/exchange/data/company-profile/?symbol=${symbol}`)
  const {price} = extractTableFromHTML(html)
  return price;
}

export const scrapper = async () => {
  // const now: any = new Date();
  // const currentDay: any = now.getDay();
  // const currentHour = now.getHours();
  // const lastRunTimeString = localStorage.getItem('lastRunTime');
  // const lastRunTime: any = lastRunTimeString ? new Date(lastRunTimeString) : null;
  // if (lastRunTime && now.toDateString() !== lastRunTime.toDateString()) localStorage.removeItem('lastRunTime');
  // if (currentDay < 1 || currentDay > 5 || currentHour < 10 || currentHour >= 15) return;
  //
  // if (lastRunTime && now.toDateString() === lastRunTime.toDateString()) {
  //   const timeDifference = (now - lastRunTime) / (1000 * 60);
  //   if (timeDifference < 30) return;
  // }
  //
  // localStorage.setItem('lastRunTime', now.toISOString());

  try {
    const stocks = await Promise.all(
      STOCKS_DETAILS.map(async (stock) => {
        const price = await getStockPrice(stock?.tickerSymbol);
        const {data} = await axios.create({baseURL: '/'}).get(`/api/stock-chart-data/${stock?.id}`)
        const trends = data?.data || [];

        let lastTransaction = [0, 0];
        let secondLastTransaction = [0, 0];
        const count = trends.length
        if (count) {
          lastTransaction = trends[count - 1];
          secondLastTransaction = lastTransaction;
          if (count > 2) secondLastTransaction = trends[count - 2]
        }
        let percentage = calculatePercentageChange(Number(secondLastTransaction[1]), Number(lastTransaction[1]));
        let ticker = parseTicker(Number(secondLastTransaction[1]), Number(lastTransaction[1]));

        return {
          ...stock,
          openingPrice: price,
          history: trends,
          ticker,
          percentage,
          price: Number(price?.replaceAll('₦ ', '').replaceAll(',', ''))
        };
      })
    );
    dispatch(setAppState({stocks_details: stocks}));
  } catch (error) {

  }
};

