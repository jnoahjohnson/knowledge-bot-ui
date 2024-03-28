import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Knowledge Bot" },
    { name: "description", content: "Ask questions to the knowledge bot" },
  ];
};

export default function Index() {
  return (
    <div className="max-w-2xl mx-auto flex items-center gap-2 flex-wrap py-6">
      <Card className="min-w-48 flex-1">
        <CardHeader>
          <CardTitle>Ask Me Anything</CardTitle>
          <CardDescription>Ask me any questions!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link to="/ask">
            <Button variant="outline">Ask</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="min-w-48 flex-1">
        <CardHeader>
          <CardTitle>Train Me</CardTitle>
          <CardDescription>Train me with new information!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link to="/train">
            <Button variant="outline">Train</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
