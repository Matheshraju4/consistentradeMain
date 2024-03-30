import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { dateatom, interest, amount } from "@/atoms/Selectdateatom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRecoilState } from "recoil";

import { useNavigate } from "react-router-dom";
import { DatabaseUrl } from "@/Generalcomponents/DatabaseUrl";
import axios from "axios";

export function CardWithForm() {
  const [, setDate] = useRecoilState(dateatom);
  const navigate = useNavigate();
  const [, setprinicipalamount] = useRecoilState(amount);
  const [, setperdayInterest] = useRecoilState(interest);
  const [totalprofit, settotalprofit] = useState([]);
  const dateRef = useRef<HTMLInputElement>(null);
  const initialamountRef = useRef<HTMLInputElement>(null);
  const interestRef = useRef<HTMLInputElement>(null);
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
  function setamount() {
    if (initialamountRef.current) {
      setprinicipalamount(parseInt(initialamountRef.current.value || "0"));
    }
  }
  function setinterest() {
    if (interestRef.current) {
      setperdayInterest(parseFloat(interestRef.current.value || "0"));
    }
  }

  function setdateRef() {
    if (dateRef.current) {
      setDate(parseInt(dateRef.current?.value || "0"));
    }
  }

  const handleDeployClick = async () => {
    try {
      const currentDate = parseInt(dateRef.current?.value || "0");
      const currentPrincipalAmount = parseInt(
        initialamountRef.current?.value || "0"
      );
      const currentPerDayInterest = parseFloat(
        interestRef.current?.value || "0"
      );

      setDate(currentDate);
      setprinicipalamount(currentPrincipalAmount);
      setperdayInterest(currentPerDayInterest);

      navigate("/autocompundingcal");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {totalprofit.length ? navigate("/dashboard") : ""}
      <Card className="w-[350px] m-auto ">
        <CardHeader>
          <CardTitle>Create A Challenge</CardTitle>
          <CardDescription>Enter the details correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Initial Amount</Label>
                <Input
                  ref={initialamountRef}
                  id="name"
                  type="number"
                  placeholder="Enter the Initial Capital Amount"
                  onChange={setamount}
                />
                <Label htmlFor="name">PerDayInterest</Label>
                <Input
                  ref={interestRef}
                  id="name"
                  type="number"
                  placeholder="Enter the Per Day Interest "
                  onChange={setinterest}
                />
                <label>Enter Number of days</label>
                <Input type="number" ref={dateRef} onChange={setdateRef} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleDeployClick}>submit</Button>
        </CardFooter>
      </Card>
    </>
  );
}
