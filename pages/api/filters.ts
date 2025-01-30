import type { NextApiRequest, NextApiResponse } from "next";

const filtersData = {
  category1: [
    { name: "Option 1", count: 10 },
    { name: "Option 2", count: 5 },
  ],
  category2: [
    { name: "Option A", count: 8 },
    { name: "Option B", count: 12 },
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(filtersData);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
