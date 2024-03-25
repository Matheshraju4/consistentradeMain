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

  function specificdata(index: number) {
    let currentdate = new Date();
    let date = new Date(currentdate);
    date.setDate(currentdate.getDate() + index);
    return date;
  }
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
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-xl">Date</TableHead>
            <TableHead className="text-right text-xl ">Target</TableHead>
            <TableHead className="text-right text-xl">Balance</TableHead>
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
      <Button onClick={sendreq}>Send</Button>
    </>
  );
}
