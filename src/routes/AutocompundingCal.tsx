import { DatabaseUrl } from "@/Generalcomponents/DatabaseUrl";
import { amount, dateatom, interest } from "@/atoms/Selectdateatom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export function AutoCompoundingCal() {
  const navigate = useNavigate();
  const [maindata, setEarningData] = useState([]);
  const [perdayTarget, setperdaytarget] = useState([]);
  const prinicipalamounts = useRecoilValue(amount);
  const perDayInterests = useRecoilValue(interest);
  const numberofDaysvalue = useRecoilValue(dateatom);
  const [data, setdata] = useState([]);
  const [totalprofit, settotalprofit] = useState([]);
  function specificdata(index: number) {
    let currentdate = new Date();
    let date = new Date(currentdate);
    date.setDate(currentdate.getDate() + index);
    return date;
  }
  useEffect(() => {
    async function fetchdata1() {
      const response = await axios.post(
        DatabaseUrl + "/dashboard",
        {
          principalAmount: 1000,
          perDayInterest: 0.01,
          numberofDays: 365,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      settotalprofit(response.data.message);
    }
    fetchdata1();
  }, []);
  useEffect(() => {
    async function fetchdata() {
      const response = await axios.post(
        DatabaseUrl + "/autocompoundingcalculator",
        {
          initialInvestment: prinicipalamounts,
          interestRate: perDayInterests,
          numberofdays: numberofDaysvalue,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      setEarningData(response.data.tabledata);
      setperdaytarget(response.data.perdaytarget);
      setdata(response.data.response);
      // Set the response data
      console.log(data);
    }
    fetchdata();
  }, []);

  function sendreq() {
    axios
      .post(
        DatabaseUrl + "/createtrade",
        {
          response: data,
          tabledata: maindata,
          perdaytarget: perdayTarget,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then(() => {
        navigate("/dashboard");
      });
  }
  return (
    <>
      {totalprofit.length ? navigate("/dashboard") : ""}
      <nav className="bg-white mb-10 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div>
            <h1 className="text-3xl font-semibold">ConsistentTrade</h1>
          </div>
          <div className="text-2xl bg-slate-300 p-3 border rounded">
            Final amount: ${parseInt(maindata[maindata.length - 1])}
          </div>
          <div>
            <Button
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                navigate("/createtrade");
              }}
            >
              Back
            </Button>
            <Button className="ml-2 " onClick={sendreq}>
              Make Challenge --{">"}
            </Button>
          </div>
        </div>
      </nav>
      <Table className="mt-20">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-bold  text-xl">Date</TableHead>
            <TableHead className="text-right font-bold text-xl ">
              Target
            </TableHead>
            <TableHead className="text-right font-bold text-xl">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maindata.map((value, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-lg">
                {specificdata(index).toLocaleDateString("en-GB")}
              </TableCell>
              <TableCell className="text-right text-lg">
                $
                {
                  // @ts-ignore
                  perdayTarget[index]
                }
              </TableCell>
              <TableCell className="text-right text-lg">
                {parseInt(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              ${parseInt(maindata[maindata.length - 1])}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
