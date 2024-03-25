import { Button } from "@/components/ui/button";
import lossing from "../images/lossing_image.png";
import winning from "../images/winning_image.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/Generalcomponents/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { DatabaseUrl } from "@/Generalcomponents/DatabaseUrl";
// import { useNavigate } from "react-router-dom";

interface datainterface {
  perdaytarget: number;
  amount: number;
  iswon: Boolean;
  date: string;
}

export function Dashboard() {
  const [initialinvestment, setinitialinvestment] = useState(0);
  const [finalTarget, setfinalTarget] = useState(0);
  const [totalprofit, settotalprofit] = useState(0);
  const main_date = new Date();
  let todaydate = new Date();
  const d = todaydate.getHours();
  todaydate.setHours(-d);
  const responsedate = new Date();
  responsedate.setHours(main_date.getHours() + 24);
  console.log("tadaydtae", todaydate);
  const [data, setdata] = useState<datainterface[]>([]);
  async function setRequest(e: number, iswon: Boolean, date: string) {
    if (new Date(date).getTime() < responsedate.getTime()) {
      try {
        await axios.put(
          DatabaseUrl + "/updatewon/?id=" + e + "&iswon=" + iswon,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          }
        );
        // setdata(response.data.message.dataArray);
        // Reload the page after successful update
        window.location.reload();
      } catch (error) {
        console.error("Error occurred while updating data:", error);
      }
    }
  }
  useEffect(() => {
    async function fetchdata() {
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

      setdata(response.data.message);
      settotalprofit(response.data.profit);
      setfinalTarget(response.data.finalTarget);
      setinitialinvestment(response.data.initialInvestment);
    }
    fetchdata();
  }, []);
  console.log("this is data", data);
  return (
    <>
      <Header
        initialInvestment={initialinvestment}
        finalTarget={finalTarget}
        totalprofit={totalprofit}
      />
      <br />
      <div className=" grid grid-cols-2  gap-2 md:grid md:grid-cols-4 md:gap-4  ">
        {data.map((d, index) =>
          new Date(d.date).getTime() < responsedate.getTime() &&
          d.iswon !== null ? (
            <Card>
              <img
                src={d.iswon === true ? winning : lossing}
                className=" w-32 grid content-center p-2 m-auto m-5 rounded-full"
              />
              <CardFooter className="float-right text-xs">
                <p className="float-right">{d.date}</p>
              </CardFooter>
            </Card>
          ) : (
            <Card
              key={index}
              className={
                new Date(d.date).getTime() > responsedate.getTime()
                  ? "bg-slate-100"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle>{d.perdaytarget}</CardTitle>
                <CardDescription> Target</CardDescription>
              </CardHeader>

              <CardContent className="space-y-[5px]">
                <Button
                  id={`${index.toString()}_true`}
                  className={
                    new Date(d.date).getTime() > responsedate.getTime()
                      ? "ps-8 pe-8  md:me-2"
                      : "bg-green-400 ps-8 pe-8 md:me-2 "
                  }
                  onClick={() => setRequest(index, true, d.date)}
                >
                  Won
                </Button>
                <Button
                  id={`${index.toString()}_false`}
                  className={
                    new Date(d.date).getTime() > responsedate.getTime()
                      ? ""
                      : "bg-red-400  "
                  }
                  onClick={() => setRequest(index, false, d.date)}
                >
                  Loss
                </Button>
              </CardContent>

              <CardFooter className="float-right text-xs">
                <p className="float-right">{d.date}</p>
              </CardFooter>
            </Card>
          )
        )}{" "}
      </div>
    </>
  );
}
