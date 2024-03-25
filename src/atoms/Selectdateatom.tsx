import { atom } from "recoil";

export let dateatom = atom({
  key: "dateatom",
  default: 0,
});
export let interest = atom({
  key: "interest",
  default: 0.0,
});
export let amount = atom({
  key: "amount",
  default: 0,
});
